import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PricingToolsPage } from "@/components/tools/pricing-tools-page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Freemium Tools - Free Plans with Paid Upgrades | Toolradar",
  description: "Discover the best freemium tools and software. Start free and upgrade when you need more features. Perfect for growing teams and businesses.",
  keywords: ["freemium tools", "freemium software", "free plan tools", "free tier software", "try before you buy"],
};


export const revalidate = 3600;

async function FreemiumToolsContent() {
  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: "freemium",
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

  // Get categories with counts
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
      title="Freemium Tools"
      description="Start free and upgrade when you need more. These tools offer generous free tiers with optional paid plans."
      tools={tools}
      categories={categories}
      iconType="freemium"
      iconBgClass="bg-purple-100"
      iconTextClass="text-purple-800"
      gradientClass="from-purple-50"
      badgeText="Freemium"
      pricing="freemium"
      filterBgClass="bg-purple-100 text-purple-800"
      filterActiveClass="bg-purple-600 text-white"
    />
  );
}

export default function FreemiumToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FreemiumToolsContent />
    </Suspense>
  );
}
