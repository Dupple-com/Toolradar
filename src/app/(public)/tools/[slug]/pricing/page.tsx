import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { ArrowRight, Check, X, ExternalLink, HelpCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const tool = await prisma.tool.findUnique({
    where: { slug },
    select: { name: true, pricing: true, pricingDetails: true },
  });

  if (!tool) return { title: "Tool not found" };

  const year = new Date().getFullYear();
  const title = `${tool.name} Pricing ${year}: Plans, Cost & Free Options`;
  const description = `${tool.name} pricing breakdown for ${year}. Compare plans, see costs, and find out if there's a free tier. ${tool.pricing === "free" ? `${tool.name} is completely free!` : tool.pricing === "freemium" ? `${tool.name} offers a free plan with paid upgrades.` : `${tool.name} is a paid tool with various pricing tiers.`}`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: `${tool.name} pricing, ${tool.name} cost, ${tool.name} plans, ${tool.name} free, how much does ${tool.name} cost, ${tool.name} price`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/tools/${slug}/pricing`,
      siteName: "Toolradar",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/tools/${slug}/pricing`,
    },
  };
}

export default async function ToolPricingPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const tool = await prisma.tool.findUnique({
    where: { slug, status: "published" },
    include: {
      categories: {
        include: { category: true },
        take: 1,
      },
    },
  });

  if (!tool) {
    notFound();
  }

  // Get alternatives with different pricing
  const category = tool.categories[0]?.category;
  const alternatives = category ? await prisma.tool.findMany({
    where: {
      status: "published",
      id: { not: tool.id },
      categories: { some: { categoryId: category.id } },
    },
    orderBy: { editorialScore: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      pricing: true,
      tagline: true,
      editorialScore: true,
    },
  }) : [];

  const freeAlternatives = alternatives.filter(a => a.pricing === "free" || a.pricing === "freemium");
  const year = new Date().getFullYear();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: tool.name, url: `/tools/${tool.slug}` },
    { name: "Pricing", url: `/tools/${tool.slug}/pricing` },
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description: tool.tagline,
    image: tool.logo,
    brand: {
      "@type": "Organization",
      name: tool.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(tool.pricing === "free" ? {
        lowPrice: "0",
        highPrice: "0",
        offerCount: 1,
      } : tool.pricing === "freemium" ? {
        lowPrice: "0",
        offerCount: 2,
      } : {
        offerCount: 1,
      }),
    },
  };

  const faqJsonLd = generateFaqJsonLd([
    {
      question: `How much does ${tool.name} cost?`,
      answer: tool.pricing === "free"
        ? `${tool.name} is completely free to use. There are no hidden costs or paid tiers.`
        : tool.pricing === "freemium"
        ? `${tool.name} offers a free plan with limited features. Paid plans are available for users who need more advanced functionality. Visit their website for current pricing.`
        : `${tool.name} is a paid tool. Pricing varies based on your needs and team size. Visit their official website for the most up-to-date pricing information.`,
    },
    {
      question: `Is there a free version of ${tool.name}?`,
      answer: tool.pricing === "free"
        ? `Yes, ${tool.name} is entirely free to use.`
        : tool.pricing === "freemium"
        ? `Yes, ${tool.name} offers a free tier with basic features. You can upgrade to a paid plan for additional functionality.`
        : `${tool.name} does not offer a free plan, but they may offer a free trial. Check their website for current offers.`,
    },
    {
      question: `What are the best free alternatives to ${tool.name}?`,
      answer: freeAlternatives.length > 0
        ? `Some free alternatives to ${tool.name} include ${freeAlternatives.slice(0, 3).map(a => a.name).join(", ")}. Compare them on Toolradar to find the best fit for your needs.`
        : `While there aren't many free alternatives in this category, you can explore freemium options on Toolradar that offer free tiers with basic functionality.`,
    },
    {
      question: `Does ${tool.name} offer a free trial?`,
      answer: `Many software tools offer free trials. We recommend visiting ${tool.name}'s official website to check their current trial offers and pricing options.`,
    },
  ]);

  const pricingInfo = tool.pricingDetails as { plans?: Array<{ name: string; price: string; features: string[] }> } | null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/tools" className="hover:text-foreground transition">Tools</Link>
              <span>/</span>
              <Link href={`/tools/${tool.slug}`} className="hover:text-foreground transition">{tool.name}</Link>
              <span>/</span>
              <span className="text-foreground">Pricing</span>
            </nav>

            <div className="flex items-start gap-4">
              <ToolLogo src={tool.logo} name={tool.name} className="w-16 h-16 rounded-xl flex-shrink-0" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {tool.name} Pricing {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Plans, costs, and free options for {tool.name}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Overview */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                tool.pricing === "free" ? "bg-green-100 text-green-700" :
                tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                "bg-purple-100 text-purple-700"
              }`}>
                {tool.pricing === "free" ? "Free" :
                 tool.pricing === "freemium" ? "Freemium" : "Paid"}
              </span>
              {tool.pricing === "free" && (
                <span className="text-green-600 font-medium">No credit card required</span>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-4">Pricing Model</h2>

            {tool.pricing === "free" ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-lg">
                  <strong>{tool.name} is completely free</strong> to use. There are no paid tiers,
                  subscription fees, or hidden costs. You get access to all features at no charge.
                </p>
                <div className="flex items-center gap-2 mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">100% Free - No payment required</span>
                </div>
              </div>
            ) : tool.pricing === "freemium" ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-lg">
                  <strong>{tool.name} offers a free tier</strong> with basic features, plus paid plans
                  for users who need more advanced functionality.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6 not-prose">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">Free Tier Available</span>
                    </div>
                    <p className="text-sm text-green-600">Basic features included at no cost</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-700">Paid Upgrades</span>
                    </div>
                    <p className="text-sm text-blue-600">Premium features with paid plans</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <p className="text-lg">
                  <strong>{tool.name} is a paid tool</strong> with various pricing tiers based on
                  features and team size. Contact them or visit their website for detailed pricing.
                </p>
                <div className="flex items-center gap-2 mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700">Visit {tool.name}'s website for current pricing</span>
                </div>
              </div>
            )}

            {/* Pricing Details if available */}
            {pricingInfo?.plans && pricingInfo.plans.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Available Plans</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {pricingInfo.plans.map((plan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-2xl font-bold mt-2">{plan.price}</p>
                      {plan.features && (
                        <ul className="mt-4 space-y-2 text-sm">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
              <a
                href={tool.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                View Official Pricing <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition"
              >
                View Full Review <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Free Alternatives */}
        {freeAlternatives.length > 0 && tool.pricing === "paid" && (
          <section className="max-w-4xl mx-auto px-4 pb-8">
            <div className="bg-white rounded-xl border p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4">
                Free Alternatives to {tool.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                Looking for a free option? Here are some alternatives with free plans:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {freeAlternatives.slice(0, 4).map((alt) => (
                  <Link
                    key={alt.id}
                    href={`/tools/${alt.slug}`}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:shadow-sm transition"
                  >
                    <ToolLogo src={alt.logo} name={alt.name} className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{alt.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                          alt.pricing === "free" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {alt.pricing === "free" ? "Free" : "Freemium"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{alt.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <Link
                href={`/tools/${tool.slug}/alternatives`}
                className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
              >
                View all {tool.name} alternatives <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* All Alternatives */}
        {alternatives.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 pb-8">
            <div className="bg-white rounded-xl border p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4">
                Compare {tool.name} Pricing with Alternatives
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Tool</th>
                      <th className="text-center py-3 font-medium">Pricing</th>
                      <th className="text-center py-3 font-medium">Score</th>
                      <th className="text-right py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="bg-primary/5">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <ToolLogo src={tool.logo} name={tool.name} className="w-8 h-8 rounded" />
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Current</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          tool.pricing === "free" ? "bg-green-100 text-green-700" :
                          tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-center font-medium">{tool.editorialScore || "—"}</td>
                      <td className="py-3 text-right">
                        <Link href={`/tools/${tool.slug}`} className="text-primary text-sm hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                    {alternatives.map((alt) => (
                      <tr key={alt.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <ToolLogo src={alt.logo} name={alt.name} className="w-8 h-8 rounded" />
                            <span className="font-medium">{alt.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            alt.pricing === "free" ? "bg-green-100 text-green-700" :
                            alt.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {alt.pricing.charAt(0).toUpperCase() + alt.pricing.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 text-center font-medium">{alt.editorialScore || "—"}</td>
                        <td className="py-3 text-right">
                          <Link href={`/tools/${alt.slug}/pricing`} className="text-primary text-sm hover:underline">
                            Pricing
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">{tool.name} Pricing FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">How much does {tool.name} cost?</h3>
                <p className="text-muted-foreground">
                  {tool.pricing === "free"
                    ? `${tool.name} is completely free to use with no hidden costs.`
                    : tool.pricing === "freemium"
                    ? `${tool.name} offers a free plan with basic features. Paid plans provide additional functionality and are available at various price points.`
                    : `${tool.name} is a paid tool with pricing that varies based on your needs. Visit their website for current pricing.`}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a free trial for {tool.name}?</h3>
                <p className="text-muted-foreground">
                  {tool.pricing === "free"
                    ? `${tool.name} is free, so no trial is needed - you get full access immediately.`
                    : `Many software tools offer free trials. Check ${tool.name}'s website for current trial offers.`}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What are cheaper alternatives to {tool.name}?</h3>
                <p className="text-muted-foreground">
                  {freeAlternatives.length > 0
                    ? `Free or freemium alternatives include ${freeAlternatives.slice(0, 3).map(a => a.name).join(", ")}. View our full comparison to find the best value.`
                    : `Check our alternatives page to compare pricing across similar tools in this category.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">More about {tool.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href={`/tools/${tool.slug}`}
                className="p-3 border rounded-lg hover:border-primary hover:text-primary transition text-center text-sm"
              >
                Overview
              </Link>
              <Link
                href={`/tools/${tool.slug}/reviews`}
                className="p-3 border rounded-lg hover:border-primary hover:text-primary transition text-center text-sm"
              >
                Reviews
              </Link>
              <Link
                href={`/tools/${tool.slug}/alternatives`}
                className="p-3 border rounded-lg hover:border-primary hover:text-primary transition text-center text-sm"
              >
                Alternatives
              </Link>
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="p-3 border rounded-lg hover:border-primary hover:text-primary transition text-center text-sm"
                >
                  {category.name}
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
