import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { ToolLogo } from "@/components/tools/tool-logo";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Scale, ArrowRight, Star } from "lucide-react";


export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        tools: { some: { tool: { status: "published" } } },
      },
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });

  if (!category) return { title: "Category not found" };

  const year = new Date().getFullYear();
  const title = `Compare ${category.name} Tools ${year}`;
  const description = `Compare the best ${category.name.toLowerCase()} tools side by side. See features, pricing, and reviews to find the right solution.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: `${category.name.toLowerCase()} comparison, compare ${category.name.toLowerCase()} tools, ${category.name.toLowerCase()} vs`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/compare/category/${params.slug}`,
      siteName: "Toolradar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/compare/category/${params.slug}`,
    },
  };
}

export default async function CategoryComparisonPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      tools: {
        where: { tool: { status: "published" } },
        include: {
          tool: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              tagline: true,
              pricing: true,
              editorialScore: true,
              communityScore: true,
              reviewCount: true,
            },
          },
        },
      },
    },
  });

  if (!category || category.tools.length < 2) {
    notFound();
  }

  const tools = category.tools
    .map((ct) => ct.tool)
    .sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0));

  const year = new Date().getFullYear();

  // Generate popular comparison pairs
  const comparisons: Array<{ tool1: typeof tools[0]; tool2: typeof tools[0] }> = [];
  for (let i = 0; i < Math.min(tools.length, 10); i++) {
    for (let j = i + 1; j < Math.min(tools.length, 10); j++) {
      comparisons.push({ tool1: tools[i], tool2: tools[j] });
    }
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${category.name} Comparisons`, url: `/compare/category/${category.slug}` },
  ]);

  const faqJsonLd = generateFaqJsonLd([
    {
      question: `What is the best ${category.name.toLowerCase()} tool in ${year}?`,
      answer: `Based on our analysis, ${tools[0]?.name} is the top-rated ${category.name.toLowerCase()} tool with a score of ${tools[0]?.editorialScore || "high"}/100. Other popular options include ${tools.slice(1, 4).map(t => t.name).join(", ")}.`,
    },
    {
      question: `How to compare ${category.name.toLowerCase()} tools?`,
      answer: `Compare ${category.name.toLowerCase()} tools by evaluating: 1) Features and capabilities, 2) Pricing models (free, freemium, paid), 3) User reviews and ratings, 4) Integration options, 5) Ease of use. Use our comparison tool to see side-by-side analysis.`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/compare" className="hover:text-foreground transition">Compare</Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CategoryIcon icon={category.icon} size="lg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Compare {category.name} Tools
                </h1>
                <p className="text-muted-foreground mt-1">
                  {tools.length} tools · {comparisons.length} possible comparisons
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Find the perfect {category.name.toLowerCase()} tool by comparing features, pricing, and user reviews.
              Choose any two tools below to see a detailed side-by-side comparison.
            </p>
          </div>
        </section>

        {/* Quick Compare Grid */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Scale className="w-5 h-5 text-muted-foreground" />
            Top Tools in {category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.slice(0, 9).map((tool, index) => (
              <div
                key={tool.id}
                className="bg-white rounded-xl border p-4 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/tools/${tool.slug}`} className="group">
                      <div className="flex items-center gap-2">
                        <ToolLogo src={tool.logo} name={tool.name} className="w-8 h-8 rounded-lg" />
                        <span className="font-semibold group-hover:text-primary transition truncate">
                          {tool.name}
                        </span>
                      </div>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{tool.tagline}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${
                        tool.pricing === "free" ? "bg-green-100 text-green-700" :
                        tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {tool.pricing}
                      </span>
                      {tool.editorialScore && (
                        <span className="text-muted-foreground">
                          Score: {tool.editorialScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Comparisons */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-lg font-bold mb-6">Popular Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.slice(0, 20).map(({ tool1, tool2 }, index) => (
              <Link
                key={`${tool1.slug}-${tool2.slug}`}
                href={`/compare/${tool1.slug}-vs-${tool2.slug}`}
                className="group flex items-center gap-4 bg-white rounded-xl border p-4 hover:border-primary hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 flex-1">
                  <ToolLogo src={tool1.logo} name={tool1.name} className="w-10 h-10 rounded-lg" />
                  <span className="font-medium truncate">{tool1.name}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium px-2">vs</div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="font-medium truncate">{tool2.name}</span>
                  <ToolLogo src={tool2.logo} name={tool2.name} className="w-10 h-10 rounded-lg" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
              </Link>
            ))}
          </div>

          {comparisons.length > 20 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              + {comparisons.length - 20} more comparisons available
            </p>
          )}
        </section>

        {/* Browse Other Categories */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-lg font-bold mb-4">Compare Other Categories</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/compare" className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary transition">
              All Comparisons
            </Link>
            <Link href={`/categories/${category.slug}`} className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary transition">
              Browse {category.name}
            </Link>
            <Link href={`/best/${category.slug}`} className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary transition">
              Best {category.name}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
