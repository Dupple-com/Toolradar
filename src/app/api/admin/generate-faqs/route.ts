import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SEED_SECRET = process.env.SEED_SECRET || "dev-secret";

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url;
  }
}

// Fetch and extract content from a URL
async function fetchPageContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Basic HTML to text extraction
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000); // Limit content

    return text;
  } catch {
    return null;
  }
}

// Generate FAQs based on scraped content
function generateFAQs(
  toolName: string,
  pricingContent: string | null,
  featuresContent: string | null,
  integrationsContent: string | null
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Extract pricing info
  const hasFreeText = pricingContent?.toLowerCase().includes("free") || false;
  const priceMatches = pricingContent?.match(/\$[\d,]+(?:\.\d{2})?(?:\s*\/\s*(?:month|mo|user|seat))?/gi) || [];
  const uniquePrices = Array.from(new Set(priceMatches)).slice(0, 4);

  // FAQ 1: Is it free?
  if (hasFreeText) {
    faqs.push({
      question: `Is ${toolName} free to use?`,
      answer: `Yes, ${toolName} offers a free plan or free trial. ${uniquePrices.length > 0 ? `Paid plans start at ${uniquePrices[0]}.` : "Check their website for current pricing details."}`
    });
  } else if (uniquePrices.length > 0) {
    faqs.push({
      question: `How much does ${toolName} cost?`,
      answer: `${toolName} pricing starts at ${uniquePrices[0]}. ${uniquePrices.length > 1 ? `Other plans available at ${uniquePrices.slice(1).join(", ")}.` : ""} Visit their pricing page for the most up-to-date information.`
    });
  }

  // FAQ 2: Pricing for teams
  if (uniquePrices.length > 1) {
    faqs.push({
      question: `What are ${toolName}'s pricing plans?`,
      answer: `${toolName} offers multiple pricing tiers: ${uniquePrices.join(", ")}. Plans typically scale based on features, users, or usage limits. Enterprise pricing is often available for larger organizations.`
    });
  }

  // FAQ 3: Integrations
  const integrationKeywords = ["slack", "google", "microsoft", "zapier", "salesforce", "hubspot", "jira", "github", "notion", "trello", "asana", "figma", "dropbox", "zoom"];
  const foundIntegrations: string[] = [];

  if (integrationsContent) {
    integrationKeywords.forEach(keyword => {
      if (integrationsContent.toLowerCase().includes(keyword)) {
        foundIntegrations.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
  }

  if (foundIntegrations.length > 0) {
    faqs.push({
      question: `What integrations does ${toolName} support?`,
      answer: `${toolName} integrates with popular tools including ${foundIntegrations.slice(0, 6).join(", ")}${foundIntegrations.length > 6 ? `, and ${foundIntegrations.length - 6} more` : ""}. Check their integrations page for the complete list.`
    });
  }

  // FAQ 4: Main features/use cases
  const hasAPI = featuresContent?.toLowerCase().includes("api") || integrationsContent?.toLowerCase().includes("api");
  const hasAutomation = featuresContent?.toLowerCase().includes("automat") || false;
  const hasAI = featuresContent?.toLowerCase().includes(" ai ") || featuresContent?.toLowerCase().includes("artificial intelligence") || false;

  const features: string[] = [];
  if (hasAPI) features.push("API access");
  if (hasAutomation) features.push("automation capabilities");
  if (hasAI) features.push("AI-powered features");

  if (features.length > 0) {
    faqs.push({
      question: `What are ${toolName}'s key features?`,
      answer: `${toolName} offers ${features.join(", ")} among its key capabilities. The platform is designed to help teams work more efficiently and streamline their workflows.`
    });
  }

  // FAQ 5: API availability
  if (hasAPI) {
    faqs.push({
      question: `Does ${toolName} have an API?`,
      answer: `Yes, ${toolName} provides API access for developers and teams looking to build custom integrations or automate workflows. Documentation is typically available on their developer portal.`
    });
  }

  // FAQ 6: Free trial
  const hasTrialText = pricingContent?.toLowerCase().includes("trial") || pricingContent?.toLowerCase().includes("try") || false;
  if (hasTrialText) {
    faqs.push({
      question: `Does ${toolName} offer a free trial?`,
      answer: `Yes, ${toolName} offers a free trial so you can test the platform before committing to a paid plan. No credit card is typically required to start.`
    });
  }

  // FAQ 7: Enterprise
  const hasEnterprise = pricingContent?.toLowerCase().includes("enterprise") || false;
  if (hasEnterprise) {
    faqs.push({
      question: `Does ${toolName} offer enterprise plans?`,
      answer: `Yes, ${toolName} offers enterprise plans with advanced features like SSO, enhanced security, dedicated support, and custom pricing. Contact their sales team for a quote.`
    });
  }

  return faqs.slice(0, 7); // Max 7 FAQs
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const toolSlug = searchParams.get("tool");
  const listOnly = searchParams.get("list") === "true";

  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // List all tools that need FAQs
  if (listOnly) {
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      select: { id: true, name: true, slug: true, website: true, faqs: true },
      orderBy: { weeklyUpvotes: "desc" },
    });

    const needsFaqs = tools.filter(t => t.website && (!t.faqs || !Array.isArray(t.faqs) || t.faqs.length === 0));
    const hasFaqs = tools.filter(t => t.faqs && Array.isArray(t.faqs) && t.faqs.length > 0);

    return NextResponse.json({
      total: tools.length,
      withWebsite: tools.filter(t => t.website).length,
      alreadyHasFaqs: hasFaqs.length,
      needsFaqs: needsFaqs.length,
      toolsToProcess: needsFaqs.slice(0, 50).map(t => ({
        slug: t.slug,
        name: t.name,
        website: t.website,
      })),
    });
  }

  // Process a specific tool
  if (toolSlug) {
    const tool = await prisma.tool.findUnique({
      where: { slug: toolSlug },
      select: { id: true, name: true, slug: true, website: true, faqs: true },
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    if (!tool.website) {
      return NextResponse.json({ error: "Tool has no website" }, { status: 400 });
    }

    const baseUrl = extractDomain(tool.website);

    // Fetch pages
    const [pricingContent, featuresContent, integrationsContent] = await Promise.all([
      fetchPageContent(`${baseUrl}/pricing`),
      fetchPageContent(`${baseUrl}/features`).then(c => c || fetchPageContent(`${baseUrl}/product`)),
      fetchPageContent(`${baseUrl}/integrations`),
    ]);

    // Generate FAQs
    const faqs = generateFAQs(tool.name, pricingContent, featuresContent, integrationsContent);

    if (faqs.length === 0) {
      return NextResponse.json({
        tool: tool.slug,
        error: "Could not generate FAQs - insufficient content",
        pagesFound: {
          pricing: !!pricingContent,
          features: !!featuresContent,
          integrations: !!integrationsContent,
        }
      });
    }

    // Update tool
    await prisma.tool.update({
      where: { id: tool.id },
      data: { faqs },
    });

    return NextResponse.json({
      tool: tool.slug,
      name: tool.name,
      faqsGenerated: faqs.length,
      faqs,
      sources: {
        pricing: `${baseUrl}/pricing`,
        features: `${baseUrl}/features`,
        integrations: `${baseUrl}/integrations`,
      },
    });
  }

  return NextResponse.json({
    error: "Specify ?tool=slug to process a tool, or ?list=true to see all tools"
  });
}
