import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitUrlsToIndexNow } from "@/lib/indexnow";
import { pingSitemapToSearchEngines } from "@/lib/sitemap-ping";

const INDEXING_SECRET = process.env.INDEXING_SECRET || process.env.SEED_SECRET;

// GET - Ping sitemap to search engines
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== INDEXING_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await pingSitemapToSearchEngines();

  return NextResponse.json({
    message: "Sitemap ping completed",
    results,
  });
}

// POST - Submit URLs to IndexNow
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== INDEXING_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { urls, type } = body;

    let urlsToSubmit: string[] = [];

    if (urls && Array.isArray(urls)) {
      // Submit specific URLs
      urlsToSubmit = urls;
    } else if (type === "all") {
      // Submit all important pages
      urlsToSubmit = await getAllIndexableUrls();
    } else if (type === "tools") {
      // Submit all tool pages
      urlsToSubmit = await getToolUrls();
    } else if (type === "categories") {
      // Submit all category pages
      urlsToSubmit = await getCategoryUrls();
    } else if (type === "new") {
      // Submit pages created in last 24 hours
      urlsToSubmit = await getRecentUrls();
    } else {
      return NextResponse.json({
        error: "Invalid request. Provide 'urls' array or 'type' (all|tools|categories|new)"
      }, { status: 400 });
    }

    const result = await submitUrlsToIndexNow(urlsToSubmit);

    // Also ping sitemap
    const sitemapResults = await pingSitemapToSearchEngines();

    return NextResponse.json({
      indexNow: result,
      sitemapPing: sitemapResults,
      urlCount: urlsToSubmit.length,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to process request",
      details: String(error)
    }, { status: 500 });
  }
}

async function getAllIndexableUrls(): Promise<string[]> {
  const urls: string[] = [
    "/",
    "/tools",
    "/categories",
    "/compare",
    "/best",
    "/guides",
    "/software-for",
    "/alternatives",
    "/trending",
  ];

  // Add tool URLs
  urls.push(...await getToolUrls());

  // Add category URLs
  urls.push(...await getCategoryUrls());

  return urls;
}

async function getToolUrls(): Promise<string[]> {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { slug: true },
  });

  const urls: string[] = [];
  for (const tool of tools) {
    urls.push(`/tools/${tool.slug}`);
    urls.push(`/tools/${tool.slug}/alternatives`);
    urls.push(`/tools/${tool.slug}/pricing`);
    urls.push(`/tools/${tool.slug}/reviews`);
  }

  return urls;
}

async function getCategoryUrls(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const useCases = ["small-business", "startups", "enterprise", "freelancers", "teams", "marketing", "developers", "agencies"];
  const urls: string[] = [];

  for (const cat of categories) {
    urls.push(`/categories/${cat.slug}`);
    urls.push(`/best/${cat.slug}`);
    urls.push(`/guides/${cat.slug}`);

    // Listicle pages
    for (const useCase of useCases) {
      urls.push(`/best/${cat.slug}/for/${useCase}`);
    }
  }

  return urls;
}

async function getRecentUrls(): Promise<string[]> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentTools = await prisma.tool.findMany({
    where: {
      status: "published",
      OR: [
        { createdAt: { gte: oneDayAgo } },
        { updatedAt: { gte: oneDayAgo } },
      ],
    },
    select: { slug: true },
  });

  const urls: string[] = [];
  for (const tool of recentTools) {
    urls.push(`/tools/${tool.slug}`);
    urls.push(`/tools/${tool.slug}/alternatives`);
    urls.push(`/tools/${tool.slug}/pricing`);
  }

  return urls;
}
