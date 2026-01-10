import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { ComparisonTracker } from "@/components/tracking/comparison-tracker";
import { CheckCircle, XCircle, ArrowRight, Users, DollarSign, Zap, Trophy, AlertCircle, Target } from "lucide-react";
import { getComparisonContent, type ComparisonExpertContent } from "@/content/comparison-content";


export const revalidate = 3600;

// Generate static params for popular comparisons
export async function generateStaticParams() {
  try {
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      orderBy: { weeklyUpvotes: "desc" },
      take: 20,
      select: { slug: true },
    });

    const comparisons: { slugs: string }[] = [];
    for (let i = 0; i < Math.min(tools.length, 15); i++) {
      for (let j = i + 1; j < Math.min(tools.length, 15); j++) {
        comparisons.push({ slugs: `${tools[i].slug}-vs-${tools[j].slug}` });
      }
    }
    return comparisons.slice(0, 50);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slugs: string } }): Promise<Metadata> {
  const { slugs: slugsParam } = params;
  const slugs = slugsParam.split("-vs-");
  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs }, status: "published" },
    select: { name: true, slug: true },
  });

  if (tools.length < 2) return { title: "Comparison not found" };

  const sortedTools = slugs.map(slug => tools.find(t => t.slug === slug)).filter(Boolean);
  const names = sortedTools.map(t => t!.name);
  const year = new Date().getFullYear();
  const title = `${names.join(" vs ")}: Which is Better in ${year}?`;

  // Get expert content for enhanced description
  const expertContent = getComparisonContent(slugsParam);
  const description = expertContent
    ? `${expertContent.expertIntro.slice(0, 150)}... Compare features, pricing, strengths and weaknesses.`
    : `Compare ${names.join(" and ")} side by side. See features, pricing, ratings, and user reviews to help you choose the best option for your needs.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: `${names.join(" vs ")}, ${names[0]} alternative, ${names[1]} alternative, ${names.join(" comparison")}`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/compare/${slugsParam}`,
      siteName: "Toolradar",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/compare/${slugsParam}`,
    },
  };
}

export default async function CompareResultPage({
  params,
}: {
  params: { slugs: string };
}) {
  const { slugs: slugsParam } = params;
  const slugs = slugsParam.split("-vs-");

  if (slugs.length < 2 || slugs.length > 4) {
    notFound();
  }

  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs }, status: "published" },
    include: {
      reviews: {
        where: { status: "approved" },
        take: 3,
        orderBy: { helpfulCount: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
      categories: { include: { category: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (tools.length < 2) {
    notFound();
  }

  // Sort tools in the same order as slugs
  const sortedTools = slugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as typeof tools;

  // Find winner
  const winner = sortedTools.reduce((best, tool) =>
    (tool.editorialScore || 0) > (best.editorialScore || 0) ? tool : best
  );

  const toolNames = sortedTools.map(t => t.name);
  const year = new Date().getFullYear();

  // Get expert content for enhanced comparison
  const expertContent = getComparisonContent(slugsParam);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: toolNames.join(" vs "), url: `/compare/${slugsParam}` },
  ]);

  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${toolNames.join(" vs ")}: Which is Better in ${year}?`,
    description: `Detailed comparison of ${toolNames.join(" and ")}`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: { "@type": "Organization", name: "Toolradar" },
    publisher: { "@type": "Organization", name: "Toolradar", url: "https://toolradar.com" },
    about: sortedTools.map(tool => ({
      "@type": "SoftwareApplication",
      name: tool.name,
      applicationCategory: tool.categories[0]?.category.name || "Software",
    })),
  };

  // FAQ for GEO optimization (AI search engines)
  const tool1 = sortedTools[0];
  const tool2 = sortedTools[1];
  const winnerName = winner.name;
  const winnerScore = winner.editorialScore || "high";

  // Use expert FAQs when available, otherwise use generic ones
  const faqJsonLd = expertContent
    ? generateFaqJsonLd(expertContent.faqs)
    : generateFaqJsonLd([
        {
          question: `Is ${tool1.name} or ${tool2.name} better?`,
          answer: `Based on our analysis, ${winnerName} scores higher with ${winnerScore}/100. ${tool1.name} is ${tool1.pricing} while ${tool2.name} is ${tool2.pricing}. The best choice depends on your specific needs and budget.`,
        },
        {
          question: `What is the difference between ${tool1.name} and ${tool2.name}?`,
          answer: `${tool1.name}: ${tool1.tagline}. ${tool2.name}: ${tool2.tagline}. ${tool1.name} is ${tool1.pricing} and ${tool2.name} is ${tool2.pricing}. Compare detailed features on Toolradar.`,
        },
        {
          question: `Which is cheaper, ${tool1.name} or ${tool2.name}?`,
          answer: tool1.pricing === "free" && tool2.pricing !== "free"
            ? `${tool1.name} is free while ${tool2.name} is ${tool2.pricing}.`
            : tool2.pricing === "free" && tool1.pricing !== "free"
            ? `${tool2.name} is free while ${tool1.name} is ${tool1.pricing}.`
            : tool1.pricing === tool2.pricing
            ? `Both ${tool1.name} and ${tool2.name} have ${tool1.pricing} pricing. Visit their websites for detailed pricing.`
            : `${tool1.name} is ${tool1.pricing} and ${tool2.name} is ${tool2.pricing}. Compare specific plans on their websites.`,
        },
        {
          question: `Should I switch from ${tool1.name} to ${tool2.name}?`,
          answer: `Consider switching if ${tool2.name}'s features better match your needs. ${winnerName} scores higher overall (${winnerScore}/100). Read user reviews on Toolradar to see what users think about each tool.`,
        },
      ]);

  return (
    <>
      <ComparisonTracker toolIds={sortedTools.map((t) => t.id)} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={comparisonJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/compare" className="hover:text-foreground transition">
              Compare
            </Link>
            <span>/</span>
            <span className="text-foreground">{sortedTools.map((t) => t.name).join(" vs ")}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {sortedTools.map((t) => t.name).join(" vs ")}: Which Should You Choose in {year}?
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            {expertContent
              ? expertContent.expertIntro
              : `Choosing between ${sortedTools.map((t) => t.name).join(" and ")} comes down to understanding
                what each tool does best. This comparison breaks down the key differences so you can make
                an informed decision based on your specific needs, not marketing claims.`}
          </p>
        </div>
      </section>

      {/* Quick Recommendation - TL;DR */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Short on time? Here&apos;s the quick answer
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            We&apos;ve tested both tools. Here&apos;s who should pick what:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <p className="font-semibold text-blue-700 mb-2">Go with {tool1.name} if you...</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {tool1.pricing === "free" && <li>• Don&apos;t want to spend a dime</li>}
                {tool1.pricing === "freemium" && <li>• Want to try before you buy</li>}
                {(tool1.editorialScore || 0) > (tool2.editorialScore || 0) && <li>• Want our top-rated pick</li>}
                {tool1._count.reviews > tool2._count.reviews && <li>• Trust what other users say</li>}
                <li>• Need {tool1.categories[0]?.category.name?.toLowerCase() || "general"} features</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <p className="font-semibold text-indigo-700 mb-2">Go with {tool2.name} if you...</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {tool2.pricing === "free" && <li>• Don&apos;t want to spend a dime</li>}
                {tool2.pricing === "freemium" && <li>• Want to try before you buy</li>}
                {(tool2.editorialScore || 0) > (tool1.editorialScore || 0) && <li>• Want our top-rated pick</li>}
                {tool2._count.reviews > tool1._count.reviews && <li>• Trust what other users say</li>}
                <li>• Need {tool2.categories[0]?.category.name?.toLowerCase() || "general"} features</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hook Comparison Table - Immediate Value */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-6 py-4 font-semibold text-gray-600">At a Glance</th>
                {sortedTools.map((tool) => (
                  <th key={tool.id} className="text-center px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      {tool.logo ? (
                        <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {tool.name[0]}
                        </div>
                      )}
                      <span className="font-semibold">{tool.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Price
                  </div>
                </td>
                {sortedTools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tool.pricing === "free" ? "bg-green-50 text-green-700" :
                      tool.pricing === "freemium" ? "bg-blue-50 text-blue-700" :
                      "bg-orange-50 text-orange-700"
                    }`}>
                      {tool.pricing === "free" ? "Free" : tool.pricing === "freemium" ? "Free + Paid" : "Paid"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Best For
                  </div>
                </td>
                {sortedTools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 text-center text-sm text-gray-600">
                    {tool.categories[0]?.category.name || "General"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-400" />
                    Rating
                  </div>
                </td>
                {sortedTools.map((tool) => {
                  const isHighest = tool.editorialScore === Math.max(...sortedTools.map(t => t.editorialScore || 0));
                  return (
                    <td key={tool.id} className="px-6 py-4 text-center">
                      <span className={`text-lg font-bold ${isHighest ? "text-primary" : "text-gray-600"}`}>
                        {tool.editorialScore || "—"}/100
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tools Overview Cards */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${sortedTools.length}, 1fr)` }}>
          {sortedTools.map((tool) => {
            const isWinner = tool.id === winner.id;
            return (
              <div
                key={tool.id}
                className={`bg-white rounded-xl border-2 p-6 text-center relative ${
                  isWinner ? "border-primary" : "border-gray-200"
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    TOP RATED
                  </div>
                )}
                <Link href={`/tools/${tool.slug}`} className="block">
                  {tool.logo ? (
                    <img src={tool.logo} alt={`${tool.name} logo`} className="w-16 h-16 rounded-xl mx-auto mb-4 object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                      {tool.name[0]}
                    </div>
                  )}
                  <h2 className="font-bold text-lg hover:text-primary transition">{tool.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.tagline}</p>
                </Link>

                {/* Quick stats */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t">
                  {tool.editorialScore && (
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary">{tool.editorialScore}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  )}
                  {tool.communityScore && tool.communityScore > 0 && (
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        <span className="text-yellow-500">★</span> {tool.communityScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">{tool._count.reviews} reviews</p>
                    </div>
                  )}
                </div>

                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 block w-full py-2.5 rounded-lg font-medium transition ${
                    isWinner
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  Visit Website
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Feature</th>
                {sortedTools.map((tool) => (
                  <th key={tool.id} className="text-center px-6 py-4 font-semibold">
                    {tool.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Pricing Model</td>
                {sortedTools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tool.pricing === "free" ? "bg-green-50 text-green-700 border border-green-200" :
                      tool.pricing === "freemium" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-orange-50 text-orange-700 border border-orange-200"
                    }`}>
                      {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Editorial Score</td>
                {sortedTools.map((tool) => {
                  const isHighest = tool.editorialScore === Math.max(...sortedTools.map(t => t.editorialScore || 0));
                  return (
                    <td key={tool.id} className="px-6 py-4 text-center">
                      {tool.editorialScore ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isHighest ? "bg-primary" : "bg-gray-400"}`}
                              style={{ width: `${tool.editorialScore}%` }}
                            />
                          </div>
                          <span className={`font-bold ${isHighest ? "text-primary" : ""}`}>
                            {tool.editorialScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Community Rating</td>
                {sortedTools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 text-center">
                    {tool.communityScore && tool.communityScore > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= Math.round(tool.communityScore!) ? "text-yellow-400" : "text-gray-200"}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-1 font-medium">{tool.communityScore.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No ratings yet</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Total Reviews</td>
                {sortedTools.map((tool) => {
                  const isHighest = tool._count.reviews === Math.max(...sortedTools.map(t => t._count.reviews));
                  return (
                    <td key={tool.id} className="px-6 py-4 text-center">
                      <span className={`font-semibold ${isHighest && tool._count.reviews > 0 ? "text-primary" : ""}`}>
                        {tool._count.reviews}
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Community Upvotes</td>
                {sortedTools.map((tool) => {
                  const isHighest = tool.upvotes === Math.max(...sortedTools.map(t => t.upvotes));
                  return (
                    <td key={tool.id} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <svg className={`w-4 h-4 ${isHighest ? "text-primary" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4l-8 8h5v8h6v-8h5z" />
                        </svg>
                        <span className={`font-semibold ${isHighest ? "text-primary" : ""}`}>
                          {tool.upvotes}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-700">Categories</td>
                {sortedTools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {tool.categories.slice(0, 2).map((ct) => (
                        <span key={ct.category.id} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {ct.category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Deep Dive Analysis */}
      {expertContent ? (
        <>
          {/* Expert Tool Analysis */}
          <section className="max-w-6xl mx-auto px-4 pb-8">
            <h2 className="text-xl font-bold mb-4">In-Depth Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tool 1 Analysis */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  {tool1.logo ? (
                    <img src={tool1.logo} alt={tool1.name} className="w-6 h-6 rounded" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {tool1.name[0]}
                    </div>
                  )}
                  {tool1.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {expertContent.tool1Analysis.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Weaknesses
                    </h4>
                    <ul className="space-y-1">
                      {expertContent.tool1Analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Best For
                    </h4>
                    <p className="text-sm text-muted-foreground">{expertContent.tool1Analysis.bestFor}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground italic">{expertContent.tool1Analysis.verdict}</p>
                  </div>
                </div>
              </div>

              {/* Tool 2 Analysis */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  {tool2.logo ? (
                    <img src={tool2.logo} alt={tool2.name} className="w-6 h-6 rounded" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {tool2.name[0]}
                    </div>
                  )}
                  {tool2.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {expertContent.tool2Analysis.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Weaknesses
                    </h4>
                    <ul className="space-y-1">
                      {expertContent.tool2Analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Best For
                    </h4>
                    <p className="text-sm text-muted-foreground">{expertContent.tool2Analysis.bestFor}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground italic">{expertContent.tool2Analysis.verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Head-to-Head Comparisons */}
          <section className="max-w-6xl mx-auto px-4 pb-8">
            <h2 className="text-xl font-bold mb-4">Head-to-Head Comparison</h2>
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="divide-y">
                {expertContent.headToHead.map((comparison, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{comparison.category}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        comparison.winner === "tool1"
                          ? "bg-blue-50 text-blue-700"
                          : comparison.winner === "tool2"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {comparison.winner === "tool1"
                          ? `${tool1.name} wins`
                          : comparison.winner === "tool2"
                          ? `${tool2.name} wins`
                          : "Tie"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comparison.analysis}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Migration Advice */}
          {expertContent.migrationAdvice && (
            <section className="max-w-6xl mx-auto px-4 pb-8">
              <h2 className="text-xl font-bold mb-4">Migration Considerations</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800">{expertContent.migrationAdvice}</p>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="max-w-6xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold mb-4">Understanding the Differences</h2>
          <div className="bg-white rounded-xl border p-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground">
                Both {tool1.name} and {tool2.name} solve similar problems, but they approach them differently.
                {tool1.name} positions itself as &quot;{tool1.tagline?.toLowerCase()}&quot; while {tool2.name}
                focuses on &quot;{tool2.tagline?.toLowerCase()}&quot;. These differences matter depending on what
                you&apos;re trying to accomplish.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">When to Choose {tool1.name}</h3>
              <p className="text-muted-foreground">
                {tool1.name} makes sense if you&apos;re looking for a {tool1.pricing === "free" ? "completely free" :
                tool1.pricing === "freemium" ? "budget-friendly option with a free tier" :
                "comprehensive paid"} solution.
                {tool1.editorialScore && tool1.editorialScore > (tool2.editorialScore || 0)
                  ? ` With a score of ${tool1.editorialScore}/100, it&apos;s our top pick in this comparison.`
                  : ""}
                {tool1._count.reviews > 0 && ` It has ${tool1._count.reviews} user reviews that can help you understand real-world experiences.`}
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">When to Choose {tool2.name}</h3>
              <p className="text-muted-foreground">
                {tool2.name} is worth considering if you need a {tool2.pricing === "free" ? "free" :
                tool2.pricing === "freemium" ? "flexible option with both free and paid tiers" :
                "professional-grade"} tool.
                {tool2.editorialScore && tool2.editorialScore > (tool1.editorialScore || 0)
                  ? ` Scoring ${tool2.editorialScore}/100, it edges ahead in our evaluation.`
                  : ""}
                {tool2._count.reviews > 0 && ` The ${tool2._count.reviews} reviews give insight into what actual users think.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Use Case Scenarios */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Who Should Use What?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-5">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Bootstrapped or small team?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {tool1.pricing === "free" || tool1.pricing === "freemium"
                ? `When every dollar counts, ${tool1.name} lets you get started without pulling out your credit card.`
                : tool2.pricing === "free" || tool2.pricing === "freemium"
                ? `${tool2.name} won't cost you anything to start, which is exactly what early-stage teams need.`
                : `Neither is free, but both have their value. Test them both and see which clicks.`}
            </p>
            <p className="text-sm font-medium text-green-700">
              We&apos;d pick: {(tool1.pricing === "free" || tool1.pricing === "freemium") ? tool1.name : tool2.name}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Growing fast?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your team doubled last quarter and you need tools that won&apos;t break when you add 50 more people.
              {(tool1.editorialScore || 0) > (tool2.editorialScore || 0)
                ? ` ${tool1.name} handles scale better in our testing.`
                : ` ${tool2.name} is built for teams that are leveling up.`}
            </p>
            <p className="text-sm font-medium text-blue-700">
              We&apos;d pick: {(tool1.editorialScore || 0) > (tool2.editorialScore || 0) ? tool1.name : tool2.name}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Enterprise with complex needs?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You need SSO, compliance certifications, and a support team that picks up the phone.
              {tool1.pricing === "paid"
                ? ` ${tool1.name} is built for organizations like yours.`
                : tool2.pricing === "paid"
                ? ` ${tool2.name} takes enterprise seriously.`
                : ` Both have enterprise tiers—compare their security features.`}
            </p>
            <p className="text-sm font-medium text-purple-700">
              We&apos;d pick: {tool1.pricing === "paid" ? tool1.name : tool2.pricing === "paid" ? tool2.name : winner.name}
            </p>
          </div>
        </div>
      </section>

      {/* Decision Helper Checklist */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Still not sure? Answer these 3 questions</h2>
        <div className="bg-white rounded-xl border p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-medium mb-1">How much can you spend?</p>
                <p className="text-sm text-muted-foreground">
                  {tool1.pricing === "free"
                    ? `Nothing at all? ${tool1.name} is completely free.`
                    : tool2.pricing === "free"
                    ? `Zero budget? ${tool2.name} won't cost you anything.`
                    : tool1.pricing === "freemium"
                    ? `Tight budget? Start free with ${tool1.name}, upgrade when you're ready.`
                    : tool2.pricing === "freemium"
                    ? `Want to test first? ${tool2.name} has a free tier to get you started.`
                    : `Both are paid tools. If money isn't the issue, go with ${winner.name}—it scored higher.`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-medium mb-1">Do you care what other users think?</p>
                <p className="text-sm text-muted-foreground">
                  {tool1._count.reviews > tool2._count.reviews
                    ? `${tool1.name} has ${tool1._count.reviews} reviews from real users. That's more social proof to help you decide.`
                    : tool2._count.reviews > tool1._count.reviews
                    ? `${tool2.name} has ${tool2._count.reviews} user reviews, so you can see what people actually think.`
                    : `Both have similar review counts. Read a few before you commit.`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-medium mb-1">Expert opinion or crowd wisdom?</p>
                <p className="text-sm text-muted-foreground">
                  Our team rated {winner.name} higher ({winner.editorialScore}/100). But the community has upvoted {tool1.upvotes > tool2.upvotes ? tool1.name : tool2.name} more ({Math.max(tool1.upvotes, tool2.upvotes)} votes). Pick your source of truth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Key Takeaways</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl border border-green-200 p-5">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              What {winner.name} Does Better
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              {winner.editorialScore && winner.editorialScore > ((winner.id === tool1.id ? tool2 : tool1).editorialScore || 0) && (
                <li>Higher overall score ({winner.editorialScore}/100)</li>
              )}
              {winner._count.reviews > (winner.id === tool1.id ? tool2 : tool1)._count.reviews && (
                <li>More user reviews ({winner._count.reviews} reviews)</li>
              )}
              {winner.upvotes > (winner.id === tool1.id ? tool2 : tool1).upvotes && (
                <li>More community upvotes</li>
              )}
              <li>Our recommendation for most use cases</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Consider {winner.id === tool1.id ? tool2.name : tool1.name} If
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              {(winner.id === tool1.id ? tool2 : tool1).pricing === "free" && (
                <li>You need a completely free solution</li>
              )}
              {(winner.id === tool1.id ? tool2 : tool1).pricing === "freemium" && (
                <li>You want to start free and scale later</li>
              )}
              <li>Its specific features better match your workflow</li>
              <li>You prefer its interface or design approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">The Bottom Line</h3>
              <p className="text-muted-foreground">
                {expertContent ? (
                  expertContent.expertVerdict
                ) : (
                  <>
                    If we had to pick one, we&apos;d go with{" "}
                    <Link href={`/tools/${winner.slug}`} className="font-semibold text-primary hover:underline">
                      {winner.name}
                    </Link>
                    {winner.editorialScore && ` (${winner.editorialScore}/100)`}. But the honest answer is that
                    &quot;better&quot; depends on your situation. {winner.name} scores higher in our analysis, but
                    {winner.id === tool1.id ? ` ${tool2.name}` : ` ${tool1.name}`} might be the right choice
                    if its specific strengths align with what you need most. Take advantage of free trials
                    to test both before committing.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Reviews */}
      {sortedTools.some((t) => t.reviews.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold mb-6">What Users Say</h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${sortedTools.length}, 1fr)` }}>
            {sortedTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold mb-4">{tool.name} Reviews</h3>
                {tool.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {tool.reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-500">{"★".repeat(review.overallRating)}</span>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                        <p className="font-medium">{review.title}</p>
                        <p className="text-muted-foreground line-clamp-2 mt-1">{review.pros}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                )}
                <Link
                  href={`/tools/${tool.slug}/reviews`}
                  className="text-primary text-sm hover:underline mt-4 block"
                >
                  View all reviews →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {expertContent ? (
            expertContent.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Is {tool1.name} or {tool2.name} better?</h3>
                <p className="text-muted-foreground text-sm">
                  Based on our analysis, {winnerName} scores higher with {winnerScore}/100. {tool1.name} is
                  {tool1.pricing} while {tool2.name} is {tool2.pricing}. The best choice depends on your
                  specific needs and budget. We recommend testing both with free trials if available.
                </p>
              </div>
              <div className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Can I switch from {tool1.name} to {tool2.name} easily?</h3>
                <p className="text-muted-foreground text-sm">
                  Migration difficulty varies. Check if both tools support data export/import in compatible
                  formats. Some tools offer migration assistance or have integration partners who can help
                  with the transition.
                </p>
              </div>
              <div className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Do {tool1.name} and {tool2.name} offer free trials?</h3>
                <p className="text-muted-foreground text-sm">
                  Most software in this category offers free trials or free tiers. {tool1.name} is
                  {tool1.pricing === "free" ? " completely free" : tool1.pricing === "freemium" ? " freemium with a free tier" : " paid with potential trial"}.
                  {tool2.name} is
                  {tool2.pricing === "free" ? " completely free" : tool2.pricing === "freemium" ? " freemium with a free tier" : " paid with potential trial"}.
                  Visit their websites for current trial offers.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Related Links */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Related Comparisons & Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href={`/tools/${tool1.slug}/alternatives`}
            className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
          >
            <span className="font-medium">{tool1.name} Alternatives</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
          </Link>
          <Link
            href={`/tools/${tool2.slug}/alternatives`}
            className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
          >
            <span className="font-medium">{tool2.name} Alternatives</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
          </Link>
          <Link
            href={`/tools/${tool1.slug}`}
            className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
          >
            <span className="font-medium">{tool1.name} Full Review</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
          </Link>
          <Link
            href={`/tools/${tool2.slug}`}
            className="bg-white rounded-lg border p-4 hover:border-primary transition flex items-center justify-between group"
          >
            <span className="font-medium">{tool2.name} Full Review</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
          </Link>
        </div>
      </section>

      {/* Back link */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Compare other tools
        </Link>
      </section>
      </div>
    </>
  );
}
