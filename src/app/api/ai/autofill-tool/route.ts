import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import * as cheerio from "cheerio";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemini-2.5-flash-preview";
const COOLDOWN_MINUTES = 10;

interface PageContent {
  url: string;
  title: string;
  content: string;
}

// Fetch and extract text content from a URL
async function fetchPageContent(url: string): Promise<PageContent | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Toolradar/1.0; +https://toolradar.com)",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and other non-content elements
    $("script, style, nav, footer, header, aside, noscript, iframe").remove();

    // Extract title
    const title = $("title").text().trim() || $("h1").first().text().trim();

    // Extract main content
    let content = "";

    // Try to find main content area
    const mainSelectors = ["main", "article", '[role="main"]', ".content", "#content", ".main"];
    for (const selector of mainSelectors) {
      const main = $(selector);
      if (main.length) {
        content = main.text();
        break;
      }
    }

    // Fallback to body
    if (!content) {
      content = $("body").text();
    }

    // Clean up whitespace
    content = content.replace(/\s+/g, " ").trim().slice(0, 15000);

    return { url, title, content };
  } catch {
    return null;
  }
}

// Discover relevant pages from homepage
function discoverPages(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];
  const base = new URL(baseUrl);

  // Keywords to look for in links
  const relevantKeywords = [
    "pricing",
    "price",
    "plans",
    "features",
    "about",
    "product",
    "solutions",
    "how-it-works",
    "what-is",
    "why",
    "benefits",
    "use-cases",
    "integrations",
  ];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const url = new URL(href, baseUrl);

      // Only same domain
      if (url.hostname !== base.hostname) return;

      // Check if URL or link text contains relevant keywords
      const linkText = $(el).text().toLowerCase();
      const urlPath = url.pathname.toLowerCase();

      const isRelevant = relevantKeywords.some(
        (kw) => urlPath.includes(kw) || linkText.includes(kw)
      );

      if (isRelevant && !links.includes(url.href)) {
        links.push(url.href);
      }
    } catch {
      // Invalid URL, skip
    }
  });

  return links.slice(0, 5); // Limit to 5 additional pages
}

// Call OpenRouter API
async function callAI(pages: PageContent[], categories: string[]): Promise<Record<string, unknown>> {
  const systemPrompt = `You are an expert at analyzing software products and extracting structured information.
You will receive content from a software product's website pages.
Your task is to extract accurate information to create a comprehensive product listing.

IMPORTANT:
- Be factual and accurate - only include information you can verify from the content
- For pricing, determine if it's "free", "freemium" (has free tier + paid), or "paid" (no free option)
- Pros should highlight genuine strengths
- Cons should be honest limitations (every product has some)
- FAQs should be useful questions potential users might have
- Categories should match from the provided list

Available categories: ${categories.join(", ")}`;

  const userPrompt = `Analyze this software product and extract the following information:

${pages.map((p) => `=== PAGE: ${p.url} ===\nTitle: ${p.title}\n\n${p.content}`).join("\n\n")}

---

Return a JSON object with these fields:
{
  "tagline": "A short, catchy one-line description (max 100 chars)",
  "description": "A detailed 2-3 paragraph description of what the product does, who it's for, and key benefits",
  "pricing": "free" | "freemium" | "paid",
  "tldr": ["Key point 1", "Key point 2", "Key point 3"],
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "faqs": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"},
    {"question": "Question 3?", "answer": "Answer 3"}
  ],
  "suggestedCategories": ["Category 1", "Category 2"]
}

Return ONLY valid JSON, no markdown or explanation.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://toolradar.com",
      "X-Title": "Toolradar",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenRouter error:", error);
    throw new Error("AI request failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No AI response");
  }

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = content;
  if (content.includes("```")) {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1];
    }
  }

  return JSON.parse(jsonStr.trim());
}

export async function POST(request: NextRequest) {
  // Check auth
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  // Check cooldown (skip for admins)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { lastAiAutofillAt: true, role: true },
  });

  const isAdmin = dbUser?.role === "admin";

  if (!isAdmin && dbUser?.lastAiAutofillAt) {
    const cooldownEnd = new Date(dbUser.lastAiAutofillAt.getTime() + COOLDOWN_MINUTES * 60 * 1000);
    if (new Date() < cooldownEnd) {
      const remainingMs = cooldownEnd.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return NextResponse.json(
        { error: `Please wait ${remainingMin} minute${remainingMin > 1 ? "s" : ""} before using AI autofill again` },
        { status: 429 }
      );
    }
  }

  try {
    const { websiteUrl, categories } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json({ error: "Website URL required" }, { status: 400 });
    }

    // Normalize URL
    let url = websiteUrl;
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    // Step 1: Fetch homepage
    const homepageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Toolradar/1.0; +https://toolradar.com)",
      },
    });

    if (!homepageRes.ok) {
      return NextResponse.json({ error: "Could not fetch website" }, { status: 400 });
    }

    const homepageHtml = await homepageRes.text();
    const $ = cheerio.load(homepageHtml);
    const homepageTitle = $("title").text().trim();

    // Clean homepage content
    $("script, style, nav, footer, header, aside, noscript, iframe").remove();
    const homepageContent = $("body").text().replace(/\s+/g, " ").trim().slice(0, 15000);

    const pages: PageContent[] = [
      { url, title: homepageTitle, content: homepageContent },
    ];

    // Step 2: Discover and fetch relevant pages
    const additionalUrls = discoverPages(homepageHtml, url);

    const additionalPages = await Promise.all(
      additionalUrls.map((pageUrl) => fetchPageContent(pageUrl))
    );

    for (const page of additionalPages) {
      if (page) {
        pages.push(page);
      }
    }

    // Step 3: Call AI to extract information
    const categoryNames = categories || [];
    const result = await callAI(pages, categoryNames);

    // Update cooldown timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastAiAutofillAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: result,
      pagesAnalyzed: pages.map((p) => p.url),
    });
  } catch (error) {
    console.error("Autofill error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze website" },
      { status: 500 }
    );
  }
}
