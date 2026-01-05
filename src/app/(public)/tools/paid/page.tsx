import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PricingToolsPage } from "@/components/tools/pricing-tools-page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Paid Tools - Premium Software Solutions | Toolradar",
  description: "Discover the best paid tools and premium software. Enterprise-grade solutions with professional support and advanced features.",
  keywords: ["paid tools", "premium software", "professional tools", "enterprise software", "paid apps"],
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

async function PaidToolsContent() {
  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: "paid",
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
      title="Paid Tools"
      description="Premium software solutions with professional support, advanced features, and enterprise-grade reliability."
      tools={tools}
      categories={categories}
      iconType="paid"
      iconBgClass="bg-amber-100"
      iconTextClass="text-amber-800"
      gradientClass="from-amber-50"
      badgeText="Premium"
      pricing="paid"
      filterBgClass="bg-amber-100 text-amber-800"
      filterActiveClass="bg-amber-600 text-white"
    />
  );
}

export default function PaidToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaidToolsContent />
    </Suspense>
  );
}
