import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolradar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
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
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Pricing filter pages (programmatic SEO)
  const pricingPages: MetadataRoute.Sitemap = ["free", "freemium", "paid"].map((pricing) => ({
    url: `${SITE_URL}/pricing/${pricing}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Tool pages
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Category pages
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Company pages
  const companies = await prisma.company.findMany({
    where: { tools: { some: { status: "published" } } },
    select: { slug: true, updatedAt: true },
  });

  const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${SITE_URL}/companies/${company.slug}`,
    lastModified: company.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Alternatives pages (programmatic SEO)
  const alternativePages: MetadataRoute.Sitemap = tools.slice(0, 100).map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}/alternatives`,
    lastModified: tool.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // Best category pages (programmatic SEO)
  const bestCategoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/best/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Comparison pages (programmatic SEO) - Top tool pairs
  const topTools = tools.slice(0, 30);
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < Math.min(topTools.length, 15); i++) {
    for (let j = i + 1; j < Math.min(topTools.length, 15); j++) {
      comparisonPages.push({
        url: `${SITE_URL}/compare/${topTools[i].slug}-vs-${topTools[j].slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  return [
    ...staticPages,
    ...pricingPages,
    ...toolPages,
    ...categoryPages,
    ...companyPages,
    ...alternativePages,
    ...bestCategoryPages,
    ...comparisonPages.slice(0, 100), // Limit to 100 comparison pages
  ];
}
