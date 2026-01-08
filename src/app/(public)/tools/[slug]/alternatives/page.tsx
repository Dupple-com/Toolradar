import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateMetadata as generateSeoMetadata, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { ArrowLeft, Star, DollarSign, Users, ArrowRight, CheckCircle } from "lucide-react";


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
  const { slug } = params;
  const year = new Date().getFullYear();
  const tool = await prisma.tool.findUnique({
    where: { slug },
    select: { name: true, tagline: true },
  });

  if (!tool) {
    return { title: "Tool not found" };
  }

  return generateSeoMetadata({
    title: `Best ${tool.name} Alternatives & Competitors in ${year}`,
    description: `Looking for ${tool.name} alternatives? Compare the top ${tool.name} competitors with real user reviews, pricing, and features. Find the best alternative for your needs.`,
    path: `/tools/${slug}/alternatives`,
    keywords: [
      `${tool.name} alternatives`,
      `${tool.name} competitors`,
      `tools like ${tool.name}`,
      `${tool.name} replacement`,
      `best ${tool.name} alternative`,
      `switch from ${tool.name}`,
    ],
  });
}

export default async function AlternativesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const tool = await prisma.tool.findUnique({
    where: { slug },
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

  const year = new Date().getFullYear();
  const topAlternative = alternatives[0];
  const freeAlternatives = alternatives.filter(a => a.pricing === "free" || a.pricing === "freemium");

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

  // FAQ for SEO and GEO
  const faqJsonLd = generateFaqJsonLd([
    {
      question: `What is the best ${tool.name} alternative?`,
      answer: topAlternative
        ? `Based on our analysis, ${topAlternative.name} is the top-rated ${tool.name} alternative with a score of ${topAlternative.editorialScore || "high"}/100. However, the best choice depends on your specific needs, budget, and use case.`
        : `There are several strong ${tool.name} alternatives available. The best choice depends on your specific needs, budget, and use case.`,
    },
    {
      question: `Is there a free alternative to ${tool.name}?`,
      answer: freeAlternatives.length > 0
        ? `Yes, there are free alternatives to ${tool.name}. ${freeAlternatives.slice(0, 3).map(a => a.name).join(", ")} ${freeAlternatives.length > 1 ? "are" : "is"} available with free or freemium pricing.`
        : `While most ${tool.name} alternatives are paid, many offer free trials or freemium tiers. Check each tool's pricing page for current offers.`,
    },
    {
      question: `How do I switch from ${tool.name} to an alternative?`,
      answer: `Switching from ${tool.name} typically involves: 1) Exporting your data from ${tool.name}, 2) Creating an account with the new tool, 3) Importing your data (if supported), and 4) Training your team on the new platform. Most alternatives offer migration guides or support.`,
    },
    {
      question: `What should I look for in a ${tool.name} alternative?`,
      answer: `When evaluating ${tool.name} alternatives, consider: feature parity with what you currently use, pricing and scalability, integration capabilities, user interface and learning curve, customer support quality, and data migration options.`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
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
                  Best {tool.name} Alternatives & Competitors in {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {alternatives.length} alternatives to {tool.name} • Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground max-w-3xl">
              Whether you're exploring your options or actively looking to switch from {tool.name},
              this guide covers the best alternatives available in {year}. We've evaluated each
              option based on features, pricing, user reviews, and overall value to help you
              make an informed decision.
            </p>
          </header>

          {/* Quick Stats */}
          {alternatives.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-primary">{alternatives.length}</div>
                <div className="text-sm text-muted-foreground">Alternatives</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{freeAlternatives.length}</div>
                <div className="text-sm text-muted-foreground">Free Options</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {topAlternative?.editorialScore || "—"}
                </div>
                <div className="text-sm text-muted-foreground">Top Score</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">{year}</div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
            </div>
          )}

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
        <section className="mt-12 bg-white rounded-xl border p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-4">
            Why Look for {tool.name} Alternatives?
          </h2>
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p>
              There are plenty of reasons why you might be exploring {tool.name} alternatives.
              Maybe the pricing doesn't fit your budget anymore, or you've outgrown the feature set.
              Perhaps you need better integrations with tools you already use, or you're simply
              curious about what else is available in the market. Whatever the reason, it's smart
              to regularly evaluate your software stack to ensure you're getting the best value.
            </p>
            <p className="mt-4">
              Our list of {tool.name} alternatives is built from real user feedback and comprehensive
              analysis. We look at features, pricing, ease of use, customer support, and overall
              user satisfaction to help you find a tool that genuinely fits your needs better than
              what you're currently using.
            </p>
          </div>
        </section>

        {/* What to Consider Section */}
        <section className="mt-8 bg-white rounded-xl border p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-4">
            What to Consider When Switching from {tool.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Feature Parity</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure the alternative covers the features you actually use. You don't need
                  every feature—just the ones that matter to your workflow.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Data Migration</h3>
                <p className="text-sm text-muted-foreground">
                  Check how easy it is to export your data from {tool.name} and import it into
                  the new tool. Some alternatives offer migration assistance.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Team Adoption</h3>
                <p className="text-sm text-muted-foreground">
                  Consider the learning curve for your team. A slightly less powerful tool that
                  your team will actually use is better than a feature-rich one they won't.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Total Cost</h3>
                <p className="text-sm text-muted-foreground">
                  Look beyond the sticker price. Consider implementation time, training costs,
                  and any add-ons you might need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-5">
              <h3 className="font-semibold mb-2">What is the best {tool.name} alternative?</h3>
              <p className="text-muted-foreground text-sm">
                {topAlternative
                  ? `Based on our analysis, ${topAlternative.name} is currently the top-rated ${tool.name} alternative${topAlternative.editorialScore ? ` with a score of ${topAlternative.editorialScore}/100` : ""}. That said, the "best" alternative depends on your specific needs, budget, and use case. We recommend trying free trials before making a decision.`
                  : `The best ${tool.name} alternative depends on your specific needs. We recommend comparing features, pricing, and reading user reviews to find the right fit for your situation.`}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-5">
              <h3 className="font-semibold mb-2">Is there a free alternative to {tool.name}?</h3>
              <p className="text-muted-foreground text-sm">
                {freeAlternatives.length > 0
                  ? `Yes! ${freeAlternatives.slice(0, 3).map(a => a.name).join(", ")} ${freeAlternatives.length > 1 ? "offer" : "offers"} free or freemium pricing. Free alternatives often have limitations on features or usage, but they can be perfect for individuals or small teams.`
                  : `While most ${tool.name} alternatives are paid, many offer free trials or generous freemium tiers. It's worth testing several options to find one that fits your budget.`}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-5">
              <h3 className="font-semibold mb-2">How difficult is it to switch from {tool.name}?</h3>
              <p className="text-muted-foreground text-sm">
                Switching difficulty varies depending on how much data you have and how deeply integrated
                {tool.name} is in your workflow. Most modern tools support data export/import in standard
                formats. Plan for a transition period where you might run both tools in parallel to ensure
                a smooth switch.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Explore More</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href={`/tools/${tool.slug}`}
              className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
            >
              <span className="font-medium text-sm">{tool.name} Overview</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link
              href={`/tools/${tool.slug}/reviews`}
              className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
            >
              <span className="font-medium text-sm">{tool.name} Reviews</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link
              href={`/tools/${tool.slug}/pricing`}
              className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
            >
              <span className="font-medium text-sm">{tool.name} Pricing</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            {tool.categories[0] && (
              <Link
                href={`/categories/${tool.categories[0].category.slug}`}
                className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
              >
                <span className="font-medium text-sm">More {tool.categories[0].category.name}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
