import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { ToolLogo } from "@/components/tools/tool-logo";
import { ArrowRight, TrendingUp, Shuffle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Software Alternatives ${year} - Find Better Options | Toolradar`,
  description: `Discover alternatives to popular software tools. Compare features, pricing, and reviews to find the perfect replacement for ${year}.`,
  keywords: "software alternatives, tool alternatives, app alternatives, software comparison, find alternatives",
  openGraph: {
    title: `Software Alternatives ${year} | Toolradar`,
    description: "Find better alternatives to your current software tools.",
    url: "https://toolradar.com/alternatives",
    siteName: "Toolradar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Software Alternatives ${year}`,
    description: "Discover better alternatives to popular software tools.",
  },
  alternates: {
    canonical: "https://toolradar.com/alternatives",
  },
};

export default async function AlternativesHubPage() {
  // Get popular tools that have alternatives pages
  const popularTools = await prisma.tool.findMany({
    where: {
      status: "published",
      reviewCount: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      tagline: true,
      pricing: true,
      editorialScore: true,
      categories: {
        include: { category: { select: { name: true, slug: true } } },
        take: 1,
      },
      _count: {
        select: { alternatives: true },
      },
    },
    orderBy: { weeklyUpvotes: "desc" },
    take: 50,
  });

  // Get categories with most tools
  const categories = await prisma.category.findMany({
    where: {
      tools: { some: { tool: { status: "published" } } },
    },
    include: {
      _count: { select: { tools: true } },
    },
    orderBy: {
      tools: { _count: "desc" },
    },
    take: 12,
  });

  // Group tools by category
  const toolsByCategory = categories.map(cat => ({
    category: cat,
    tools: popularTools.filter(t => t.categories[0]?.category.slug === cat.slug).slice(0, 6),
  })).filter(g => g.tools.length > 0);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Alternatives", url: "/alternatives" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Popular Software Alternatives ${year}`,
    description: "Find alternatives to popular software tools",
    numberOfItems: popularTools.length,
    itemListElement: popularTools.slice(0, 20).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${tool.name} Alternatives`,
      url: `https://toolradar.com/tools/${tool.slug}/alternatives`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shuffle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Software Alternatives
                </h1>
                <p className="text-muted-foreground mt-1">
                  Find better options for your current tools
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mt-4">
              Looking to switch from your current software? Browse alternatives to {popularTools.length}+ popular tools.
              Compare features, pricing, and user reviews to find the perfect replacement.
            </p>
          </div>
        </section>

        {/* Trending Alternatives */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Trending Alternatives Searches</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularTools.slice(0, 10).map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}/alternatives`}
                className="group bg-white rounded-xl border p-4 hover:border-primary hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ToolLogo src={tool.logo} name={tool.name} className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate group-hover:text-primary transition">
                      {tool.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tool._count.alternatives} alternatives
                    </p>
                  </div>
                </div>
                <p className="text-xs text-primary group-hover:underline">
                  View alternatives →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        {toolsByCategory.map(({ category, tools }) => (
          <section key={category.id} className="max-w-6xl mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{category.name} Alternatives</h2>
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                View all {category.name} tools →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}/alternatives`}
                  className="group flex items-center gap-4 bg-white rounded-xl border p-4 hover:border-primary hover:shadow-md transition"
                >
                  <ToolLogo src={tool.logo} name={tool.name} className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold group-hover:text-primary transition">
                      {tool.name} Alternatives
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {tool.tagline}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* All Tools A-Z */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-lg font-bold mb-6">All Tools A-Z</h2>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex flex-wrap gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}/alternatives`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
