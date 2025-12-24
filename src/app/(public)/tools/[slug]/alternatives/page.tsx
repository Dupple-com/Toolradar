import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateMetadata as generateSeoMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

// Generate static params for popular tools
export async function generateStaticParams() {
  try {
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      select: { slug: true },
      orderBy: { weeklyUpvotes: "desc" },
      take: 50,
    });
    return tools.map((tool) => ({ slug: tool.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    select: { name: true, tagline: true },
  });

  if (!tool) {
    return { title: "Tool not found" };
  }

  return generateSeoMetadata({
    title: `Best ${tool.name} Alternatives & Competitors in 2025`,
    description: `Looking for ${tool.name} alternatives? Compare the top ${tool.name} competitors with real user reviews. Find the best alternative for your needs.`,
    path: `/tools/${params.slug}/alternatives`,
    keywords: [
      `${tool.name} alternatives`,
      `${tool.name} competitors`,
      `tools like ${tool.name}`,
      `${tool.name} replacement`,
      `best ${tool.name} alternative`,
    ],
  });
}

export default async function AlternativesPage({ params }: { params: { slug: string } }) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: { category: true },
        take: 1,
      },
      alternatives: {
        include: {
          alternative: {
            include: {
              _count: { select: { reviews: true } },
            },
          },
        },
      },
    },
  });

  if (!tool || tool.status !== "published") {
    notFound();
  }

  // If no direct alternatives, find tools in same category
  let alternatives = tool.alternatives.map((a) => a.alternative);

  if (alternatives.length < 5 && tool.categories[0]) {
    const categoryTools = await prisma.tool.findMany({
      where: {
        status: "published",
        id: { not: tool.id },
        categories: { some: { categoryId: tool.categories[0].categoryId } },
      },
      include: {
        _count: { select: { reviews: true } },
      },
      orderBy: { communityScore: "desc" },
      take: 10,
    });

    // Merge and dedupe
    const existingIds = new Set(alternatives.map((a) => a.id));
    for (const t of categoryTools) {
      if (!existingIds.has(t.id)) {
        alternatives.push(t);
      }
    }
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: tool.name, url: `/tools/${tool.slug}` },
    { name: "Alternatives", url: `/tools/${tool.slug}/alternatives` },
  ]);

  // ItemList structured data for alternatives
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${tool.name} Alternatives`,
    description: `Best alternatives to ${tool.name}`,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((alt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: alt.name,
      url: `https://toolradar.com/tools/${alt.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
            <li>/</li>
            <li><Link href={`/tools/${tool.slug}`} className="hover:text-foreground">{tool.name}</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Alternatives</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} />
            Back to {tool.name}
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <ToolLogo src={tool.logo} name={tool.name} className="w-12 h-12 rounded-xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Best {tool.name} Alternatives & Competitors
              </h1>
              <p className="text-muted-foreground mt-1">
                {alternatives.length} alternatives to {tool.name} for {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground max-w-3xl">
            Looking for alternatives to {tool.name}? Here are the best {tool.name} competitors
            based on user reviews and ratings. Compare features, pricing, and find the
            perfect alternative for your needs.
          </p>
        </header>

        {/* Alternatives Grid */}
        {alternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map((alt, index) => (
              <div key={alt.id} className="relative">
                {index < 3 && (
                  <span className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                )}
                <ToolCard
                  tool={{
                    ...alt,
                    reviewCount: alt._count?.reviews || 0,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <p className="text-muted-foreground">
              No alternatives found yet. Check back later!
            </p>
          </div>
        )}

        {/* SEO Content Section */}
        <section className="mt-12 bg-slate-50 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-4">
            Why Look for {tool.name} Alternatives?
          </h2>
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p>
              While {tool.name} is a popular choice, there are many reasons why users
              look for alternatives. Whether you're looking for different pricing options,
              specific features, better integrations, or simply want to explore what else
              is available in the market, we've got you covered.
            </p>
            <p className="mt-4">
              Our list of {tool.name} alternatives is curated based on real user reviews
              and ratings from the Toolradar community. Each alternative has been evaluated
              for its features, ease of use, customer support, and value for money.
            </p>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tools/${tool.slug}`}
              className="px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 transition"
            >
              {tool.name} Overview
            </Link>
            <Link
              href={`/tools/${tool.slug}/reviews`}
              className="px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 transition"
            >
              {tool.name} Reviews
            </Link>
            {tool.categories[0] && (
              <Link
                href={`/categories/${tool.categories[0].category.slug}`}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 transition"
              >
                More {tool.categories[0].category.name} Tools
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
