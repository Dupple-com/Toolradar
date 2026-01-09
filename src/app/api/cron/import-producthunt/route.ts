import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Parser from "rss-parser";

// Custom parser to handle radar namespace
type CustomFeed = {
  items: CustomItem[];
};

type CustomItem = {
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  isoDate: string;
  guid: string;
  "radar:score"?: string;
  "radar:sourcePlatform"?: string;
  "radar:sourceId"?: string;
  "producthunt:url"?: string;
  "radar:metadata"?: string;
};

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ["radar:score", "radar:score"],
      ["radar:sourcePlatform", "radar:sourcePlatform"],
      ["radar:sourceId", "radar:sourceId"],
      ["producthunt:url", "producthunt:url"],
      ["radar:metadata", "radar:metadata"],
    ],
  },
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 60);
}

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function generateLogoUrl(domain: string): string {
  // Use clearbit logo API as fallback
  return `https://logo.clearbit.com/${domain}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get RSS feed URL from env
  const feedUrl = process.env.PRODUCTHUNT_RSS_FEED_URL;
  if (!feedUrl) {
    return NextResponse.json(
      { error: "PRODUCTHUNT_RSS_FEED_URL not configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch and parse RSS feed
    const feed = await parser.parseURL(feedUrl);

    const results = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Get or create default category for Product Hunt tools
    let aiCategory = await prisma.category.findUnique({
      where: { slug: "ai-automation" },
    });
    if (!aiCategory) {
      aiCategory = await prisma.category.create({
        data: {
          name: "AI & Automation",
          slug: "ai-automation",
          icon: "bot",
          description: "AI-powered tools and automation platforms",
        },
      });
    }

    for (const item of feed.items) {
      results.processed++;

      try {
        const domain = extractDomain(item.link);
        if (!domain) {
          results.errors.push(`Invalid URL for "${item.title}": ${item.link}`);
          results.skipped++;
          continue;
        }

        // Generate slug from title
        const slug = slugify(item.title);

        // Check if tool already exists
        const existingTool = await prisma.tool.findFirst({
          where: {
            OR: [{ slug }, { website: item.link }],
          },
        });

        if (existingTool) {
          results.skipped++;
          continue;
        }

        // Create or get company
        let company = await prisma.company.findUnique({
          where: { domain },
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              name: item.title.split(" ")[0], // First word as company name
              slug: slugify(domain),
              domain,
              logo: generateLogoUrl(domain),
              website: item.link,
              description: `Company behind ${item.title}`,
            },
          });
        }

        // Parse metadata if available
        let metadata: Record<string, unknown> = {};
        if (item["radar:metadata"]) {
          try {
            metadata = JSON.parse(item["radar:metadata"]);
          } catch {
            // Ignore parse errors
          }
        }

        // Extract score
        const score = item["radar:score"]
          ? parseInt(item["radar:score"], 10)
          : 0;

        // Create tool in draft status
        const tool = await prisma.tool.create({
          data: {
            name: item.title,
            slug,
            tagline: item.contentSnippet || item.content || item.title,
            description: item.content || item.contentSnippet || item.title,
            logo: generateLogoUrl(domain),
            website: item.link,
            pricing: "freemium", // Default, can be updated later
            status: "draft", // Needs review before publishing
            companyId: company.id,
            upvotes: score,
            weeklyUpvotes: Math.floor(score / 7),
            launchDate: item.isoDate ? new Date(item.isoDate) : new Date(),
          },
        });

        // Link to AI category by default (most PH tools are AI-related)
        await prisma.categoryTool.create({
          data: {
            toolId: tool.id,
            categoryId: aiCategory.id,
          },
        });

        results.created++;
      } catch (error) {
        results.errors.push(
          `Error processing "${item.title}": ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${results.created} created, ${results.skipped} skipped, ${results.errors.length} errors`,
      results,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        error: "Import failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
