import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateToolMetadata, generateToolJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { RelatedTools } from "@/components/seo/related-tools";
import { TLDRSection } from "@/components/seo/tldr-section";
import { PricingSection } from "@/components/tools/pricing-section";
import { FAQSection } from "@/components/seo/faq-section";
import { CheckCircle, ExternalLink, Star, Scale, ArrowRight } from "lucide-react";

// Force dynamic rendering to avoid build-time DB access
export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Generate static params for popular tools
export async function generateStaticParams() {
  try {
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      select: { slug: true },
      orderBy: { weeklyUpvotes: "desc" },
      take: 100,
    });
    return tools.map((tool) => ({ slug: tool.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      tagline: true,
      slug: true,
      logo: true,
      description: true,
      pricing: true,
      communityScore: true,
      reviewCount: true,
    },
  });

  if (!tool) {
    return { title: "Tool not found" };
  }

  return generateToolMetadata(tool);
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: {
      categories: { include: { category: true } },
      alternatives: {
        include: { alternative: { select: { id: true, name: true, slug: true, logo: true, tagline: true } } },
        take: 5,
      },
      company: { select: { id: true, name: true, slug: true, claimedAt: true } },
      reviews: {
        where: { status: "approved" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!tool || tool.status !== "published") {
    notFound();
  }

  // Get related tools from same category (for internal linking)
  const relatedTools = tool.categories[0]
    ? await prisma.tool.findMany({
        where: {
          status: "published",
          id: { not: tool.id },
          categories: { some: { categoryId: tool.categories[0].categoryId } },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          logo: true,
          pricing: true,
          editorialScore: true,
          communityScore: true,
        },
        orderBy: { editorialScore: "desc" },
        take: 5,
      })
    : [];

  // Get popular tools for comparison suggestions
  const comparisonTools = await prisma.tool.findMany({
    where: {
      status: "published",
      id: { not: tool.id },
      categories: tool.categories[0]
        ? { some: { categoryId: tool.categories[0].categoryId } }
        : undefined,
    },
    select: { slug: true, name: true },
    orderBy: { weeklyUpvotes: "desc" },
    take: 3,
  });

  // Structured data
  const toolJsonLd = generateToolJsonLd({
    ...tool,
    reviewCount: tool._count.reviews,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    ...(tool.categories[0] ? [{ name: tool.categories[0].category.name, url: `/categories/${tool.categories[0].category.slug}` }] : []),
    { name: tool.name, url: `/tools/${tool.slug}` },
  ]);

  // FAQ for GEO optimization (AI search engines like ChatGPT, Perplexity)
  const year = new Date().getFullYear();
  const categoryName = tool.categories[0]?.category.name || "software";
  const avgRating = tool.communityScore?.toFixed(1) || "N/A";
  const reviewCount = tool._count.reviews;

  // Create FAQ data array (used for both JSON-LD and visible section)
  // Get first paragraph of description for FAQ (shorter answer)
  const firstParagraph = tool.description?.split('\n\n')[0] || tool.description;

  const faqs = [
    {
      question: `What is ${tool.name}?`,
      answer: firstParagraph || `${tool.name} is a ${categoryName.toLowerCase()} tool. ${tool.tagline}`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: tool.pricing === "free"
        ? `Yes, ${tool.name} is completely free to use.`
        : tool.pricing === "freemium"
        ? `${tool.name} offers a free plan with limited features. Paid plans are available for additional functionality.`
        : `${tool.name} is a paid tool. Visit their website for current pricing information.`,
    },
    {
      question: `What are the best alternatives to ${tool.name}?`,
      answer: tool.alternatives.length > 0
        ? `Popular alternatives to ${tool.name} include: ${tool.alternatives.slice(0, 5).map(a => a.alternative.name).join(", ")}. Compare features and pricing on Toolradar.`
        : `View ${tool.name} alternatives and similar ${categoryName.toLowerCase()} tools on Toolradar.`,
    },
    {
      question: `Is ${tool.name} good? What do users think?`,
      answer: reviewCount > 0
        ? `${tool.name} has a ${avgRating}/5 rating based on ${reviewCount} user reviews on Toolradar. Users appreciate ${tool.reviews[0]?.pros?.split('.')[0] || "its features"}.`
        : `${tool.name} has not yet been reviewed on Toolradar. Be the first to share your experience!`,
    },
    {
      question: `Who is ${tool.name} best for?`,
      answer: `${tool.name} is ideal for users looking for ${categoryName.toLowerCase()} solutions. ${tool.pricing === "free" ? "It's free, making it accessible for individuals and small teams." : tool.pricing === "freemium" ? "The free tier is great for getting started, with paid options for teams." : "It's designed for professionals and businesses willing to invest in quality tools."}`,
    },
  ];

  const faqJsonLd = generateFaqJsonLd(faqs);

  return (
    <>
      <JsonLd data={toolJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
            {tool.categories[0] && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/categories/${tool.categories[0].category.slug}`} className="hover:text-foreground">
                    {tool.categories[0].category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">{tool.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <header className="flex items-start gap-4 sm:gap-6">
              <ToolLogo
                src={tool.logo}
                name={tool.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold">{tool.name}</h1>
                  {tool.company?.claimedAt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <Link
                      href={tool.company ? `/companies/${tool.company.slug}/claim` : "/vendors"}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full hover:bg-slate-200"
                    >
                      Unclaimed
                    </Link>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mt-1">{tool.tagline}</p>

                {/* Categories with internal links */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {tool.categories.map((ct) => (
                    <Link
                      key={ct.category.id}
                      href={`/categories/${ct.category.slug}`}
                      className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition"
                    >
                      {ct.category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </header>

            {/* TL;DR Section for GEO */}
            <TLDRSection
              tool={{
                name: tool.name,
                tagline: tool.tagline,
                description: tool.description,
                pricing: tool.pricing,
                editorialScore: tool.editorialScore,
                communityScore: tool.communityScore,
                reviewCount: tool._count.reviews,
              }}
              category={tool.categories[0]?.category.name}
              topPros={tool.reviews.slice(0, 3).map(r => r.pros.split('.')[0]).filter(Boolean)}
              topCons={tool.reviews.slice(0, 3).map(r => r.cons.split('.')[0]).filter(Boolean)}
            />

            {/* Pricing Section */}
            <PricingSection
              pricing={tool.pricing}
              pricingDetails={tool.pricingDetails as Record<string, unknown> | null}
              toolName={tool.name}
              website={tool.website}
            />

            {/* Description */}
            <section className="bg-card rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">About {tool.name}</h2>
              <div className="text-muted-foreground whitespace-pre-line prose prose-slate max-w-none">
                {tool.description}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-card rounded-xl border p-6" id="reviews">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">
                  Reviews {tool._count.reviews > 0 && `(${tool._count.reviews})`}
                </h2>
                {tool._count.reviews > 5 && (
                  <Link href={`/tools/${tool.slug}/reviews`} className="text-primary hover:underline text-sm">
                    See all reviews →
                  </Link>
                )}
              </div>

              {tool.reviews.length > 0 ? (
                <div className="space-y-4">
                  {tool.reviews.map((review) => (
                    <article key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {review.user.image ? (
                            <img src={review.user.image} alt={`${review.user.name || "User"}'s profile picture`} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium">{review.user.name?.[0] || "U"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.user.name || "Anonymous"}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={star <= review.overallRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                              />
                            ))}
                          </div>
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                        )}
                      </div>
                      <h3 className="font-medium">{review.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">Pros: </span>
                          <span className="text-muted-foreground">{review.pros}</span>
                        </div>
                        <div>
                          <span className="text-red-600 font-medium">Cons: </span>
                          <span className="text-muted-foreground">{review.cons}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review {tool.name}!
                </p>
              )}

              <Link
                href={`/tools/${tool.slug}/review`}
                className="mt-4 block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition"
              >
                Write a Review
              </Link>
            </section>

            {/* Internal Links Section - SEO Boost */}
            {tool.categories.length > 0 && (
              <section className="bg-slate-50 rounded-xl p-6">
                <h2 className="font-semibold text-lg mb-4">Explore More</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.categories.map((ct) => (
                    <Link
                      key={ct.category.id}
                      href={`/categories/${ct.category.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Best {ct.category.name} Tools →
                    </Link>
                  ))}
                  <Link href={`/tools/${tool.slug}/alternatives`} className="text-sm text-primary hover:underline">
                    {tool.name} Alternatives →
                  </Link>
                </div>
              </section>
            )}

            {/* FAQ Section - Visible for users and SEO */}
            <FAQSection faqs={faqs} title={`${tool.name} FAQ`} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Rating Card */}
            {tool.communityScore !== null && tool.communityScore > 0 && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4">Community Rating</h3>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={star <= Math.round(tool.communityScore!) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="font-bold text-lg">{tool.communityScore.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">({tool._count.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Quick Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pricing</dt>
                  <dd className={`font-medium ${
                    tool.pricing === "free" ? "text-green-600" :
                    tool.pricing === "freemium" ? "text-blue-600" : "text-orange-600"
                  }`}>
                    {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                  </dd>
                </div>
                {tool.company && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Company</dt>
                    <dd>
                      <Link href={`/companies/${tool.company.slug}`} className="font-medium hover:text-primary">
                        {tool.company.name}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition"
              >
                Visit Website <ExternalLink size={16} />
              </a>
            </div>

            {/* Alternatives Card */}
            {tool.alternatives.length > 0 && (
              <div className="bg-card rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Alternatives</h3>
                  <Link href={`/tools/${tool.slug}/alternatives`} className="text-xs text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {tool.alternatives.map((alt) => (
                    <Link
                      key={alt.alternative.id}
                      href={`/tools/${alt.alternative.slug}`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition"
                    >
                      <ToolLogo
                        src={alt.alternative.logo}
                        name={alt.alternative.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{alt.alternative.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{alt.alternative.tagline}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Compare With Others */}
            {comparisonTools.length > 0 && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  Compare {tool.name}
                </h3>
                <div className="space-y-2">
                  {comparisonTools.map((ct) => (
                    <Link
                      key={ct.slug}
                      href={`/compare/${tool.slug}-vs-${ct.slug}`}
                      className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
                    >
                      <span>{tool.name} vs {ct.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/compare"
                  className="text-xs text-primary hover:underline mt-4 block"
                >
                  Compare more tools →
                </Link>
              </div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <RelatedTools
                tools={relatedTools}
                title={`More ${tool.categories[0]?.category.name || ""} Tools`}
                currentToolSlug={tool.slug}
                categorySlug={tool.categories[0]?.category.slug}
                categoryName={tool.categories[0]?.category.name}
                showAlternativesLink
                showCompareLink
              />
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
