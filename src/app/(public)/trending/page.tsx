import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ToolCard } from "@/components/tools/tool-card";
import { Flame } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

// Force dynamic rendering to avoid build-time DB access

export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 minutes for trending data

export const metadata: Metadata = {
  title: "Trending Software Tools This Week | Toolradar",
  description: "Discover the most popular and upvoted software tools this week. See what the community is using and recommending right now.",
  keywords: "trending software, popular tools, hot software, best tools this week, trending apps, most upvoted tools",
  openGraph: {
    title: "Trending Software Tools This Week | Toolradar",
    description: "Discover the most popular and upvoted software tools this week.",
    url: "https://toolradar.com/trending",
    siteName: "Toolradar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Software Tools This Week | Toolradar",
    description: "Discover the most popular and upvoted software tools this week.",
  },
  alternates: {
    canonical: "https://toolradar.com/trending",
  },
};

export default async function TrendingPage() {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    orderBy: { weeklyUpvotes: "desc" },
    take: 30,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Trending", url: "/trending" },
  ]);

  const trendingListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending Software Tools This Week",
    description: "Most upvoted tools by the community this week",
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={trendingListJsonLd} />
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          Trending This Week
        </h1>
        <p className="text-muted-foreground mt-2">
          The most upvoted tools by the community this week.
        </p>
      </div>

      <div className="space-y-4">
        {tools.map((tool, index) => (
          <div key={tool.id} className="flex items-center gap-4">
            <span className={`text-2xl font-bold w-8 ${
              index < 3 ? "text-primary" : "text-muted-foreground"
            }`}>
              {index + 1}
            </span>
            <div className="flex-1">
              <ToolCard tool={tool} showVotes />
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
