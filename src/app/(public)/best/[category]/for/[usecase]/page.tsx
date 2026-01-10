import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Star, ExternalLink, ArrowRight, Check } from "lucide-react";

export const dynamic = 'force-dynamic';

// Define use cases with their criteria
const USE_CASES: Record<string, {
  label: string;
  title: string;
  description: string;
  filter: (tool: { pricing: string; editorialScore: number | null }) => boolean;
  benefits: string[];
}> = {
  "small-business": {
    label: "Small Business",
    title: "Best {category} for Small Business",
    description: "Affordable and easy-to-use {category} tools perfect for small businesses and growing teams.",
    filter: (tool) => tool.pricing === "free" || tool.pricing === "freemium" || (tool.editorialScore || 0) >= 70,
    benefits: ["Affordable pricing", "Easy to set up", "Scales with your business", "No enterprise complexity"],
  },
  "startups": {
    label: "Startups",
    title: "Best {category} for Startups",
    description: "Fast, flexible {category} tools that help startups move quickly without breaking the bank.",
    filter: (tool) => tool.pricing === "free" || tool.pricing === "freemium",
    benefits: ["Free tiers available", "Quick setup", "Modern interfaces", "API access"],
  },
  "enterprise": {
    label: "Enterprise",
    title: "Best {category} for Enterprise",
    description: "Enterprise-grade {category} solutions with advanced security, compliance, and scalability.",
    filter: (tool) => (tool.editorialScore || 0) >= 80,
    benefits: ["Enterprise security", "Compliance ready", "Dedicated support", "Advanced features"],
  },
  "freelancers": {
    label: "Freelancers",
    title: "Best {category} for Freelancers",
    description: "Simple, cost-effective {category} tools ideal for freelancers and solo professionals.",
    filter: (tool) => tool.pricing === "free" || tool.pricing === "freemium",
    benefits: ["Budget-friendly", "Simple to use", "No team overhead", "Quick onboarding"],
  },
  "teams": {
    label: "Teams",
    title: "Best {category} for Teams",
    description: "Collaborative {category} tools designed for team productivity and seamless cooperation.",
    filter: (tool) => (tool.editorialScore || 0) >= 70,
    benefits: ["Real-time collaboration", "Team management", "Shared workspaces", "Permission controls"],
  },
  "marketing": {
    label: "Marketing",
    title: "Best {category} for Marketing Teams",
    description: "Powerful {category} tools to supercharge your marketing efforts and campaigns.",
    filter: (tool) => (tool.editorialScore || 0) >= 70,
    benefits: ["Campaign management", "Analytics built-in", "Integration options", "Content tools"],
  },
  "developers": {
    label: "Developers",
    title: "Best {category} for Developers",
    description: "Developer-friendly {category} tools with APIs, integrations, and technical flexibility.",
    filter: (tool) => (tool.editorialScore || 0) >= 70,
    benefits: ["API access", "Developer tools", "Integrations", "Customization options"],
  },
  "agencies": {
    label: "Agencies",
    title: "Best {category} for Agencies",
    description: "Multi-client {category} solutions perfect for agencies managing multiple projects.",
    filter: (tool) => (tool.editorialScore || 0) >= 75,
    benefits: ["Multi-client support", "White-label options", "Reporting tools", "Team management"],
  },
};

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        tools: { some: { tool: { status: "published" } } },
      },
      select: { slug: true },
      take: 50,
    });

    const params: { category: string; usecase: string }[] = [];
    const usecases = Object.keys(USE_CASES);

    for (const category of categories) {
      for (const usecase of usecases) {
        params.push({ category: category.slug, usecase });
      }
    }

    return params.slice(0, 200); // Limit to prevent too many pages
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { category: string; usecase: string } }): Promise<Metadata> {
  const { category: categorySlug, usecase } = params;

  const usecaseConfig = USE_CASES[usecase];
  if (!usecaseConfig) return { title: "Not found" };

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true },
  });

  if (!category) return { title: "Category not found" };

  const year = new Date().getFullYear();
  const title = usecaseConfig.title.replace("{category}", category.name) + ` ${year}`;
  const description = usecaseConfig.description.replace(/{category}/g, category.name.toLowerCase());

  return {
    title: `${title} | Toolradar`,
    description: `${description} Compare top-rated tools and find the perfect solution.`,
    keywords: `best ${category.name.toLowerCase()} for ${usecaseConfig.label.toLowerCase()}, ${category.name.toLowerCase()} tools ${usecaseConfig.label.toLowerCase()}, ${usecaseConfig.label.toLowerCase()} ${category.name.toLowerCase()} software`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/best/${categorySlug}/for/${usecase}`,
      siteName: "Toolradar",
      type: "article",
    },
    alternates: {
      canonical: `https://toolradar.com/best/${categorySlug}/for/${usecase}`,
    },
  };
}

export default async function BestCategoryForUsecasePage({
  params,
}: {
  params: { category: string; usecase: string };
}) {
  const { category: categorySlug, usecase } = params;

  const usecaseConfig = USE_CASES[usecase];
  if (!usecaseConfig) {
    notFound();
  }

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
    },
  });

  if (!category) {
    notFound();
  }

  // Filter and sort tools based on use case criteria
  const allTools = category.tools.map((ct) => ct.tool);
  const filteredTools = allTools
    .filter(usecaseConfig.filter)
    .sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0))
    .slice(0, 10);

  if (filteredTools.length === 0) {
    notFound();
  }

  const year = new Date().getFullYear();
  const pageTitle = usecaseConfig.title.replace("{category}", category.name);
  const pageDescription = usecaseConfig.description.replace(/{category}/g, category.name.toLowerCase());

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Best Tools", url: "/best" },
    { name: `Best ${category.name}`, url: `/best/${category.slug}` },
    { name: `For ${usecaseConfig.label}`, url: `/best/${category.slug}/for/${usecase}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${pageTitle} ${year}`,
    description: pageDescription,
    numberOfItems: filteredTools.length,
    itemListElement: filteredTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  const faqJsonLd = generateFaqJsonLd([
    {
      question: `What is the best ${category.name.toLowerCase()} tool for ${usecaseConfig.label.toLowerCase()} in ${year}?`,
      answer: `Based on our analysis, ${filteredTools[0]?.name} is the top ${category.name.toLowerCase()} tool for ${usecaseConfig.label.toLowerCase()} in ${year}, scoring ${filteredTools[0]?.editorialScore || "highly"}/100. Other excellent options include ${filteredTools.slice(1, 4).map(t => t.name).join(", ")}.`,
    },
    {
      question: `Are there free ${category.name.toLowerCase()} tools for ${usecaseConfig.label.toLowerCase()}?`,
      answer: filteredTools.some(t => t.pricing === "free" || t.pricing === "freemium")
        ? `Yes! ${filteredTools.filter(t => t.pricing === "free" || t.pricing === "freemium").slice(0, 3).map(t => t.name).join(", ")} offer free plans suitable for ${usecaseConfig.label.toLowerCase()}.`
        : `Most ${category.name.toLowerCase()} tools for ${usecaseConfig.label.toLowerCase()} are paid, but many offer free trials.`,
    },
    {
      question: `What should ${usecaseConfig.label.toLowerCase()} look for in ${category.name.toLowerCase()} software?`,
      answer: `Key features for ${usecaseConfig.label.toLowerCase()} include: ${usecaseConfig.benefits.join(", ")}. Compare options on Toolradar to find the best fit.`,
    },
  ]);

  // Get other use cases for this category
  const otherUsecases = Object.entries(USE_CASES)
    .filter(([key]) => key !== usecase)
    .slice(0, 5);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <span>/</span>
              <Link href="/best" className="hover:text-foreground transition">Best Tools</Link>
              <span>/</span>
              <Link href={`/best/${category.slug}`} className="hover:text-foreground transition">
                {category.name}
              </Link>
              <span>/</span>
              <span className="text-foreground">{usecaseConfig.label}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CategoryIcon icon={category.icon} size="lg" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  {pageTitle} {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {filteredTools.length} tools ranked and reviewed
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Why {usecaseConfig.label} Need Specialized {category.name} Tools</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {usecaseConfig.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools List */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {filteredTools.map((tool, index) => (
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
                        {(tool.editorialScore ?? 0) > 0 && (
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
                            {tool._count.reviews} reviews
                          </span>
                        )}
                      </div>

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
                            Website <ExternalLink className="w-3.5 h-3.5" />
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

        {/* Other Use Cases */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Best {category.name} for Other Use Cases</h2>
            <div className="flex flex-wrap gap-2">
              {otherUsecases.map(([key, config]) => (
                <Link
                  key={key}
                  href={`/best/${category.slug}/for/${key}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  For {config.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">
                  What is the best {category.name.toLowerCase()} tool for {usecaseConfig.label.toLowerCase()}?
                </h3>
                <p className="text-muted-foreground">
                  Based on our analysis, {filteredTools[0]?.name} is the top choice for {usecaseConfig.label.toLowerCase()},
                  with a score of {filteredTools[0]?.editorialScore}/100. It offers {usecaseConfig.benefits.slice(0, 2).join(" and ").toLowerCase()}.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  How did you select these {category.name.toLowerCase()} tools?
                </h3>
                <p className="text-muted-foreground">
                  We filtered tools based on criteria important for {usecaseConfig.label.toLowerCase()}: {usecaseConfig.benefits.join(", ").toLowerCase()}.
                  Tools are ranked by our editorial score, which considers features, ease of use, and value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/best/${category.slug}`}
              className="text-primary hover:underline"
            >
              View all Best {category.name} Tools
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href={`/categories/${category.slug}`}
              className="text-primary hover:underline"
            >
              Browse {category.name} Category
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
