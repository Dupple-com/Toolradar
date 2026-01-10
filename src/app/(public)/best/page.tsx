import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Trophy, TrendingUp, Star } from "lucide-react";


export const dynamic = "force-dynamic";
export const revalidate = 3600;

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Software Tools in ${year} | Top Rated by Category | Toolradar`,
  description: `Discover the best software tools in ${year}. Browse our curated lists of top-rated tools across all categories - from project management to AI, design to development.`,
  keywords: "best software tools, top software, best tools 2026, software rankings, top rated software, best apps",
  openGraph: {
    title: `Best Software Tools in ${year} | Toolradar`,
    description: `Discover the best software tools in ${year}. Curated lists of top-rated tools across all categories.`,
    url: "https://toolradar.com/best",
    siteName: "Toolradar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Best Software Tools in ${year}`,
    description: `Discover the best software tools in ${year}. Top-rated tools across all categories.`,
  },
  alternates: {
    canonical: "https://toolradar.com/best",
  },
};

export default async function BestToolsHubPage() {
  const categories = await prisma.category.findMany({
    where: {
      tools: { some: { tool: { status: "published" } } },
    },
    include: {
      _count: { select: { tools: true } },
      tools: {
        where: { tool: { status: "published" } },
        take: 3,
        orderBy: { tool: { editorialScore: "desc" } },
        include: {
          tool: {
            select: { name: true, slug: true, logo: true, editorialScore: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Sort by tool count for popular categories
  const popularCategories = [...categories]
    .sort((a, b) => b._count.tools - a._count.tools)
    .slice(0, 8);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Best Tools", url: "/best" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best Software Tools in ${year}`,
    description: "Curated lists of the best software tools by category",
    hasPart: categories.map((cat) => ({
      "@type": "ItemList",
      name: `Best ${cat.name} Tools`,
      url: `https://toolradar.com/best/${cat.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Best Software Tools in {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Top-rated tools across {categories.length} categories
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mt-4">
              Explore our curated lists of the best software tools. Each list is ranked by our
              editorial team based on features, user reviews, and overall value.
            </p>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                href={`/best/${category.slug}`}
                className="group bg-white rounded-xl border p-5 hover:border-primary hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition">
                    <CategoryIcon icon={category.icon} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition">
                      Best {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category._count.tools} tools ranked
                    </p>
                  </div>
                </div>
                {/* Top 3 tools preview */}
                <div className="flex -space-x-2">
                  {category.tools.slice(0, 3).map((ct, i) => (
                    <div
                      key={ct.tool.slug}
                      className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 overflow-hidden"
                      style={{ zIndex: 3 - i }}
                    >
                      {ct.tool.logo ? (
                        <img src={ct.tool.logo} alt={`${ct.tool.name} logo`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                          {ct.tool.name[0]}
                        </div>
                      )}
                    </div>
                  ))}
                  {category._count.tools > 3 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{category._count.tools - 3}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Browse All Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/best/${category.slug}`}
                className="group flex items-center gap-4 bg-white rounded-xl border p-4 hover:border-primary hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition">
                  <CategoryIcon icon={category.icon} size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition">
                    10 Best {category.name} Tools
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category._count.tools} tools • Updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">How We Rank Software Tools</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Our "Best of" lists are created through a rigorous evaluation process. Each tool
                is assessed based on multiple criteria:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6 not-prose">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Editorial Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team evaluates features, usability, pricing, and value proposition.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">⭐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Community Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Real feedback from verified users who have hands-on experience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-lg">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Regular Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Lists are updated regularly to reflect the latest market changes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Category Expertise</h3>
                    <p className="text-sm text-muted-foreground">
                      Tools are compared against others in their specific category.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
