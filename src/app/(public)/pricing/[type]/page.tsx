import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/tools/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 3600;

const VALID_PRICING = ["free", "freemium", "paid"] as const;
type PricingType = (typeof VALID_PRICING)[number];

const PRICING_INFO: Record<PricingType, { title: string; description: string; icon: string }> = {
  free: {
    title: "Best Free Software Tools",
    description: "Discover completely free software tools. No credit card required, no hidden fees. Start using these tools right away without spending a dime.",
    icon: "🆓",
  },
  freemium: {
    title: "Best Freemium Software Tools",
    description: "Explore freemium tools that offer free tiers with optional paid upgrades. Perfect for getting started and scaling as your needs grow.",
    icon: "⚡",
  },
  paid: {
    title: "Best Paid Software Tools",
    description: "Premium software tools that deliver exceptional value. Explore professional-grade solutions trusted by businesses worldwide.",
    icon: "💎",
  },
};

export async function generateStaticParams() {
  return VALID_PRICING.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const pricing = params.type as PricingType;
  if (!VALID_PRICING.includes(pricing)) {
    return { title: "Not found" };
  }

  const info = PRICING_INFO[pricing];
  const year = new Date().getFullYear();

  return {
    title: `${info.title} in ${year} | Toolradar`,
    description: info.description,
    keywords: `${pricing} software, ${pricing} tools, best ${pricing} software, ${pricing} apps, ${pricing === "free" ? "no cost software" : pricing === "freemium" ? "free trial software" : "premium software"}`,
    openGraph: {
      title: `${info.title} in ${year} | Toolradar`,
      description: info.description,
      url: `https://toolradar.com/pricing/${pricing}`,
      siteName: "Toolradar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.title} in ${year}`,
      description: info.description,
    },
    alternates: {
      canonical: `https://toolradar.com/pricing/${pricing}`,
    },
  };
}

export default async function PricingTypePage({ params }: { params: { type: string } }) {
  const pricing = params.type as PricingType;

  if (!VALID_PRICING.includes(pricing)) {
    notFound();
  }

  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: pricing,
    },
    orderBy: [
      { editorialScore: "desc" },
      { weeklyUpvotes: "desc" },
    ],
    take: 50,
  });

  const info = PRICING_INFO[pricing];
  const year = new Date().getFullYear();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: `${pricing.charAt(0).toUpperCase() + pricing.slice(1)} Tools`, url: `/pricing/${pricing}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: info.title,
    description: info.description,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 20).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/tools" className="hover:text-foreground transition">
                Tools
              </Link>
              <span>/</span>
              <span className="text-foreground capitalize">{pricing}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{info.icon}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{info.title} in {year}</h1>
                <p className="text-muted-foreground mt-1">
                  {tools.length} {pricing} tools available
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {info.description}
            </p>

            {/* Pricing Filter Links */}
            <div className="flex gap-3 mt-6">
              {VALID_PRICING.map((p) => (
                <Link
                  key={p}
                  href={`/pricing/${p}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    p === pricing
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Link>
              ))}
              <Link
                href="/tools"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
              >
                All Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} showVotes rank={index < 10 ? index + 1 : undefined} />
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border">
              <p className="text-muted-foreground">No {pricing} tools found.</p>
              <Link href="/tools" className="text-primary hover:underline mt-2 inline-block">
                Browse all tools
              </Link>
            </div>
          )}
        </section>

        {/* SEO Content */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">
              About {pricing.charAt(0).toUpperCase() + pricing.slice(1)} Software
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              {pricing === "free" && (
                <>
                  <p>
                    Free software tools offer full functionality without any cost. These tools are perfect for
                    individuals, startups, and small teams looking to build their tech stack without upfront investment.
                  </p>
                  <p className="mt-4">
                    Many of the best free tools are open-source, meaning they benefit from community contributions
                    and ongoing development. Our curated list includes both open-source and proprietary free tools
                    that have proven their value in real-world use.
                  </p>
                </>
              )}
              {pricing === "freemium" && (
                <>
                  <p>
                    Freemium software offers a free tier with basic features, with the option to upgrade to paid
                    plans for advanced functionality. This model allows you to test tools thoroughly before committing.
                  </p>
                  <p className="mt-4">
                    Freemium tools are ideal for growing businesses that want to start small and scale their
                    usage as needs evolve. Many of today's leading software companies use this pricing model
                    to deliver value at every stage of your journey.
                  </p>
                </>
              )}
              {pricing === "paid" && (
                <>
                  <p>
                    Paid software tools typically offer premium features, dedicated support, and enterprise-grade
                    reliability. These tools are designed for teams and businesses that need professional solutions.
                  </p>
                  <p className="mt-4">
                    While paid tools require an investment, they often provide better ROI through increased
                    productivity, advanced features, and priority customer support. Our curated list helps you
                    find the best value for your budget.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
