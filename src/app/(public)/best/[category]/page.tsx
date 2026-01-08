import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { CategoryIcon } from "@/components/categories/category-icon";
import { KeyTakeaways } from "@/components/seo/key-takeaways";
import { Star, ExternalLink, ArrowRight } from "lucide-react";


export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        tools: { some: { tool: { status: "published" } } },
      },
      select: { slug: true },
    });
    return categories.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const { category: categorySlug } = params;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true, description: true },
  });

  if (!category) {
    return { title: "Category not found" };
  }

  const year = new Date().getFullYear();
  const title = `10 Best ${category.name} Tools in ${year}`;
  const description = `Discover the best ${category.name.toLowerCase()} software tools in ${year}. Compare features, pricing, and user reviews to find the perfect solution for your needs.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: `best ${category.name.toLowerCase()} tools, top ${category.name.toLowerCase()} software, ${category.name.toLowerCase()} tools ${year}, ${category.name.toLowerCase()} software comparison`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/best/${categorySlug}`,
      siteName: "Toolradar",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/best/${categorySlug}`,
    },
  };
}

export default async function BestCategoryPage({ params }: { params: { category: string } }) {
  const { category: categorySlug } = params;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      tools: {
        where: { tool: { status: "published" } },
        include: {
          tool: {
            include: {
              _count: { select: { reviews: true } },
            },
          },
        },
      },
      parent: true,
      children: {
        select: { id: true, name: true, slug: true },
        take: 8,
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Get top 10 tools sorted by score
  const topTools = category.tools
    .map((ct) => ct.tool)
    .sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0))
    .slice(0, 10);

  if (topTools.length === 0) {
    notFound();
  }

  const year = new Date().getFullYear();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Best Tools", url: "/best" },
    { name: `Best ${category.name}`, url: `/best/${category.slug}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `10 Best ${category.name} Tools in ${year}`,
    description: `Top ${category.name} software tools ranked by score and reviews`,
    numberOfItems: topTools.length,
    itemListElement: topTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
      description: tool.tagline,
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `10 Best ${category.name} Tools in ${year}`,
    description: category.description || `Top ${category.name} software tools`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
    },
  };

  // FAQ for GEO optimization (AI search engines)
  const top3 = topTools.slice(0, 3).map(t => t.name).join(", ");
  const freeTools = topTools.filter(t => t.pricing === "free" || t.pricing === "freemium");

  const faqJsonLd = generateFaqJsonLd([
    {
      question: `What is the best ${category.name.toLowerCase()} tool in ${year}?`,
      answer: `Based on our analysis, ${topTools[0]?.name || "various tools"} ranks as the #1 ${category.name.toLowerCase()} tool in ${year}. It scores ${topTools[0]?.editorialScore || "highly"}/100 on our editorial assessment. Other top options include ${top3}.`,
    },
    {
      question: `What are the top 3 ${category.name.toLowerCase()} tools?`,
      answer: `The top 3 ${category.name.toLowerCase()} tools in ${year} are: 1) ${topTools[0]?.name} - ${topTools[0]?.tagline}, 2) ${topTools[1]?.name || "N/A"} - ${topTools[1]?.tagline || ""}, 3) ${topTools[2]?.name || "N/A"} - ${topTools[2]?.tagline || ""}.`,
    },
    {
      question: `Are there free ${category.name.toLowerCase()} tools?`,
      answer: freeTools.length > 0
        ? `Yes! ${freeTools.slice(0, 3).map(t => t.name).join(", ")} offer free plans. ${freeTools.length} tools in our top ${topTools.length} have free or freemium options.`
        : `Most ${category.name.toLowerCase()} tools are paid, but many offer free trials. Check individual tool pages for current pricing.`,
    },
    {
      question: `How do I choose the right ${category.name.toLowerCase()} tool?`,
      answer: `Consider your specific needs, budget, and team size. ${topTools[0]?.name} is great for most users, while ${topTools[1]?.name || "other options"} may be better for specific use cases. Read our detailed reviews and comparisons on Toolradar.`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-foreground transition">Categories</Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CategoryIcon icon={category.icon} size="lg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  10 Best {category.name} Tools in {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description || `Discover the best ${category.name.toLowerCase()} software tools. We've analyzed and ranked the top solutions based on features, user reviews, and overall value.`}
            </p>
          </div>
        </section>

        {/* Key Takeaways for GEO */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <KeyTakeaways
            category={category.name}
            topTool={{
              name: topTools[0]?.name || "",
              editorialScore: topTools[0]?.editorialScore,
            }}
            totalTools={category.tools.length}
            freeToolsCount={topTools.filter(t => t.pricing === "free" || t.pricing === "freemium").length}
            avgScore={topTools.reduce((sum, t) => sum + (t.editorialScore || 0), 0) / topTools.length}
          />
        </div>

        {/* Top 10 List */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {topTools.map((tool, index) => (
              <article
                key={tool.id}
                className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-slate-100 text-slate-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {index + 1}
                    </div>

                    {/* Logo */}
                    <ToolLogo src={tool.logo} name={tool.name} className="w-14 h-14 rounded-xl flex-shrink-0" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/tools/${tool.slug}`} className="group">
                            <h2 className="text-xl font-semibold group-hover:text-primary transition">
                              {tool.name}
                            </h2>
                          </Link>
                          <p className="text-muted-foreground mt-1">{tool.tagline}</p>
                        </div>

                        {/* Score Badge */}
                        {tool.editorialScore && tool.editorialScore > 0 && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full flex-shrink-0">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{tool.editorialScore}/100</span>
                          </div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          tool.pricing === "free" ? "bg-green-100 text-green-700" :
                          tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </span>
                        {tool._count.reviews > 0 && (
                          <span className="text-muted-foreground">
                            {tool._count.reviews} {tool._count.reviews === 1 ? "review" : "reviews"}
                          </span>
                        )}
                        {tool.communityScore && tool.communityScore > 0 && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            {tool.communityScore.toFixed(1)} community score
                          </span>
                        )}
                      </div>

                      {/* Description Preview */}
                      {tool.description && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {tool.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                        {tool.website && (
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                          >
                            Visit Website <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        {category.children.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 pb-8">
            <h2 className="text-lg font-semibold mb-4">Related Categories</h2>
            <div className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/best/${child.slug}`}
                  className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary hover:text-primary transition"
                >
                  Best {child.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">
              How We Rank {category.name} Tools
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Our ranking of the best {category.name.toLowerCase()} tools is based on multiple factors:
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>Editorial Score:</strong> Our team evaluates features, ease of use, and value for money.</li>
                <li><strong>Community Reviews:</strong> Real feedback from users who have used these tools.</li>
                <li><strong>Feature Analysis:</strong> Comprehensive comparison of capabilities and integrations.</li>
                <li><strong>Pricing Value:</strong> How well the pricing aligns with the features offered.</li>
              </ul>
              <p className="mt-4">
                We regularly update this list to ensure you have access to the most current and accurate information
                about the best {category.name.toLowerCase()} software available in {year}.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View all {category.name} tools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
