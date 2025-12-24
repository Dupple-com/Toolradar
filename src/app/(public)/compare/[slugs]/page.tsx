import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
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
  const slugs = params.slugs.split("-vs-");
  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs }, status: "published" },
    select: { name: true, slug: true },
  });

  if (tools.length < 2) return { title: "Comparison not found" };

  const sortedTools = slugs.map(slug => tools.find(t => t.slug === slug)).filter(Boolean);
  const names = sortedTools.map(t => t!.name);
  const year = new Date().getFullYear();
  const title = `${names.join(" vs ")}: Which is Better in ${year}?`;
  const description = `Compare ${names.join(" and ")} side by side. See features, pricing, ratings, and user reviews to help you choose the best option for your needs.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: `${names.join(" vs ")}, ${names[0]} alternative, ${names[1]} alternative, ${names.join(" comparison")}`,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/compare/${params.slugs}`,
      siteName: "Toolradar",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/compare/${params.slugs}`,
    },
  };
}

export default async function CompareResultPage({
  params,
}: {
  params: { slugs: string };
}) {
  const slugs = params.slugs.split("-vs-");

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

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: toolNames.join(" vs "), url: `/compare/${params.slugs}` },
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

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={comparisonJsonLd} />
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
            {sortedTools.map((t) => t.name).join(" vs ")}
          </h1>
          <p className="text-muted-foreground">
            Detailed comparison of {sortedTools.length} tools - features, pricing, and community reviews
          </p>
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
                    <img src={tool.logo} alt="" className="w-16 h-16 rounded-xl mx-auto mb-4 object-cover" />
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

      {/* Verdict */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Our Recommendation</h3>
              <p className="text-muted-foreground">
                Based on our editorial analysis and community feedback,{" "}
                <Link href={`/tools/${winner.slug}`} className="font-semibold text-primary hover:underline">
                  {winner.name}
                </Link>
                {" "}scores highest in our comparison
                {winner.editorialScore && ` with a score of ${winner.editorialScore}/100`}.
                However, the best choice depends on your specific requirements, budget, and use case.
                We recommend trying the free trials when available.
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
