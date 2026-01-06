import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PricingToolsPage } from "@/components/tools/pricing-tools-page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Free Tools - 100% Free Software | Toolradar",
  description: "Discover the best completely free tools and software. No hidden costs, no credit card required. Curated list of free solutions for developers, marketers, and businesses.",
  keywords: ["free tools", "free software", "no cost tools", "free apps", "open source"],
};


export const revalidate = 3600;

async function FreeToolsContent() {
  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: "free",
    },
    orderBy: [
      { editorialScore: "desc" },
      { communityScore: "desc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      tagline: true,
      editorialScore: true,
      categories: {
        include: { category: { select: { name: true, slug: true } } },
        take: 1
      },
    },
  });

  // Get categories with counts for free tools
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  tools.forEach((tool) => {
    tool.categories.forEach((tc) => {
      const existing = categoryMap.get(tc.category.slug);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(tc.category.slug, {
          name: tc.category.name,
          slug: tc.category.slug,
          count: 1,
        });
      }
    });
  });

  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return (
    <PricingToolsPage
      title="Free Tools"
      description="Completely free software with no hidden costs. No credit card required, no trial limitations."
      tools={tools}
      categories={categories}
      iconType="free"
      iconBgClass="bg-green-100"
      iconTextClass="text-green-800"
      gradientClass="from-green-50"
      badgeText="100% Free"
      pricing="free"
      filterBgClass="bg-green-100 text-green-800"
      filterActiveClass="bg-green-600 text-white"
    />
  );
}

export default function FreeToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FreeToolsContent />
    </Suspense>
  );
}
