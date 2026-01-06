import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Force dynamic generation at runtime (not build time)
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolradar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/vendors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/best`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/review`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Pricing filter pages (programmatic SEO) - static, no DB needed
  const pricingPages: MetadataRoute.Sitemap = ["free", "freemium", "paid"].map((pricing) => ({
    url: `${SITE_URL}/tools/${pricing}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Use case pages (programmatic SEO) - static
  const useCasePages: MetadataRoute.Sitemap = [
    "startups", "enterprises", "freelancers", "teams", "students", "remote"
  ].map((usecase) => ({
    url: `${SITE_URL}/tools/for/${usecase}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic pages - wrapped in try-catch for build time when DB is unavailable
  let toolPages: MetadataRoute.Sitemap = [];
  let toolReviewPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let companyPages: MetadataRoute.Sitemap = [];
  let alternativePages: MetadataRoute.Sitemap = [];
  let bestCategoryPages: MetadataRoute.Sitemap = [];
  let comparisonPages: MetadataRoute.Sitemap = [];
  let compareCategoryPages: MetadataRoute.Sitemap = [];

  try {
    // Tool pages - all published tools
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true, editorialScore: true },
      orderBy: { editorialScore: "desc" },
    });

    toolPages = tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: tool.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Tool reviews pages - all tools
    toolReviewPages = tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}/reviews`,
      lastModified: tool.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    // Alternatives pages - all tools (programmatic SEO)
    alternativePages = tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}/alternatives`,
      lastModified: tool.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Comparison pages (programmatic SEO) - Top 50 tools = 1225 comparisons
    const topTools = tools.slice(0, 50);
    for (let i = 0; i < topTools.length; i++) {
      for (let j = i + 1; j < topTools.length; j++) {
        comparisonPages.push({
          url: `${SITE_URL}/compare/${topTools[i].slug}-vs-${topTools[j].slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      }
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch tools", error);
  }

  try {
    // Category pages
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    categoryPages = categories.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Best category pages (programmatic SEO)
    bestCategoryPages = categories.map((category) => ({
      url: `${SITE_URL}/best/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Compare category pages (programmatic SEO)
    compareCategoryPages = categories.map((category) => ({
      url: `${SITE_URL}/compare/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch categories", error);
  }

  try {
    // Company pages
    const companies = await prisma.company.findMany({
      where: { tools: { some: { status: "published" } } },
      select: { slug: true, updatedAt: true },
    });

    companyPages = companies.map((company) => ({
      url: `${SITE_URL}/companies/${company.slug}`,
      lastModified: company.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch companies", error);
  }

  return [
    ...staticPages,
    ...pricingPages,
    ...useCasePages,
    ...toolPages,
    ...toolReviewPages,
    ...categoryPages,
    ...companyPages,
    ...alternativePages,
    ...bestCategoryPages,
    ...compareCategoryPages,
    ...comparisonPages, // ~1225 comparison pages for top 50 tools
  ];
}
