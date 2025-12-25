import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReviewCard } from "@/components/reviews/review-card";
import { Metadata } from "next";
import { generateReviewsMetadata, generateReviewsJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

// Force dynamic rendering to avoid build-time DB access
export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const tool = await prisma.tool.findUnique({
      where: { slug: params.slug, status: "published" },
      select: {
        name: true,
        slug: true,
        tagline: true,
        reviewCount: true,
        communityScore: true,
      },
    });

    if (!tool) return { title: "Reviews Not Found" };

    return generateReviewsMetadata(tool);
  } catch {
    return { title: "Reviews" };
  }
}

// Generate static params for popular tools
export async function generateStaticParams() {
  try {
    const tools = await prisma.tool.findMany({
      where: { status: "published", reviewCount: { gt: 0 } },
      select: { slug: true },
      orderBy: { reviewCount: "desc" },
      take: 50,
    });
    return tools.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export default async function ToolReviewsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  const sort = searchParams.sort || "recent";

  // Define sort order based on param
  const orderBy = sort === "highest" ? { overallRating: "desc" as const } :
                  sort === "lowest" ? { overallRating: "asc" as const } :
                  sort === "helpful" ? { helpfulCount: "desc" as const } :
                  { createdAt: "desc" as const };

  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  // Run queries in parallel for better performance
  const [tool, avgRatings] = await Promise.all([
    prisma.tool.findUnique({
      where: { slug: params.slug },
      include: {
        reviews: {
          where: { status: "approved" },
          orderBy,
          include: {
            user: { select: { name: true, image: true } },
            replies: {
              include: { user: { select: { id: true, name: true, image: true } } },
              orderBy: { createdAt: "asc" },
            },
            _count: { select: { replies: true } },
          },
        },
        categories: {
          include: { category: { select: { name: true, slug: true } } },
          take: 1,
        },
      },
    }),
    // Use aggregate for rating averages - more efficient than JS reduce
    prisma.review.aggregate({
      where: {
        tool: { slug: params.slug },
        status: "approved",
      },
      _avg: {
        overallRating: true,
        easeOfUse: true,
        valueForMoney: true,
        features: true,
      },
      _count: true,
    }),
  ]);

  if (!tool) {
    notFound();
  }

  const ratingsSummary = avgRatings._count > 0 ? {
    overall: avgRatings._avg.overallRating || 0,
    easeOfUse: avgRatings._avg.easeOfUse || 0,
    valueForMoney: avgRatings._avg.valueForMoney || 0,
    features: avgRatings._avg.features || 0,
  } : null;

  // Generate JSON-LD for SEO and GEO
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: tool.name, url: `/tools/${tool.slug}` },
    { name: "Reviews", url: `/tools/${tool.slug}/reviews` },
  ]);

  const reviewsJsonLd = generateReviewsJsonLd({
    name: tool.name,
    slug: tool.slug,
    description: tool.description || undefined,
    logo: tool.logo,
    communityScore: tool.communityScore,
    reviewCount: tool.reviewCount,
    reviews: tool.reviews.map(r => ({
      overallRating: r.overallRating,
      title: r.title,
      pros: r.pros,
      cons: r.cons,
      createdAt: r.createdAt,
      user: r.user,
    })),
  });

  // FAQ for GEO optimization
  const faqJsonLd = generateFaqJsonLd([
    {
      question: `Is ${tool.name} worth it?`,
      answer: ratingsSummary
        ? `Based on ${tool.reviews.length} user reviews, ${tool.name} has an average rating of ${ratingsSummary.overall.toFixed(1)}/5. Users rate ease of use at ${ratingsSummary.easeOfUse.toFixed(1)}/5 and value for money at ${ratingsSummary.valueForMoney.toFixed(1)}/5.`
        : `${tool.name} currently has no user reviews. Be the first to share your experience!`,
    },
    {
      question: `What do users like about ${tool.name}?`,
      answer: tool.reviews.length > 0
        ? `Users commonly praise: ${tool.reviews.slice(0, 3).map(r => r.pros.split('.')[0]).join('. ')}.`
        : `No user feedback available yet for ${tool.name}.`,
    },
    {
      question: `What are the downsides of ${tool.name}?`,
      answer: tool.reviews.length > 0
        ? `Common concerns include: ${tool.reviews.slice(0, 3).map(r => r.cons.split('.')[0]).join('. ')}.`
        : `No user feedback available yet for ${tool.name}.`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={reviewsJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/tools/${tool.slug}`} className="text-primary hover:underline text-sm">
            ← Back to {tool.name}
          </Link>
          <h1 className="text-2xl font-bold mt-2">Reviews for {tool.name}</h1>
        </div>
        <Link
          href={`/tools/${tool.slug}/review`}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Write a Review
        </Link>
      </div>

      {ratingsSummary && (
        <div className="bg-card rounded-xl border p-6 mb-8">
          <h2 className="font-semibold mb-4">Rating Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Overall", value: ratingsSummary.overall },
              { label: "Ease of Use", value: ratingsSummary.easeOfUse },
              { label: "Value for Money", value: ratingsSummary.valueForMoney },
              { label: "Features", value: ratingsSummary.features },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{item.value.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Based on {tool.reviews.length} reviews
          </p>
        </div>
      )}

      {/* Sort controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          {tool.reviews.length} {tool.reviews.length === 1 ? "review" : "reviews"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <div className="flex flex-wrap gap-1">
            {[
              { value: "recent", label: "Recent" },
              { value: "highest", label: "Highest" },
              { value: "lowest", label: "Lowest" },
              { value: "helpful", label: "Helpful" },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/tools/${tool.slug}/reviews${option.value === "recent" ? "" : `?sort=${option.value}`}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  sort === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tool.reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-xl border p-6">
            <ReviewCard
              review={{
                id: review.id,
                title: review.title,
                pros: review.pros,
                cons: review.cons,
                overallRating: review.overallRating,
                verified: review.verified,
                createdAt: review.createdAt.toISOString(),
                user: review.user,
                replies: review.replies.map((r) => ({
                  ...r,
                  createdAt: r.createdAt.toISOString(),
                })),
                _count: review._count,
              }}
              toolSlug={tool.slug}
              isLoggedIn={isLoggedIn}
            />

            {review.useCases && (
              <div className="mt-4 bg-muted/50 rounded-lg p-4">
                <p className="font-medium text-sm mb-1">Use Cases</p>
                <p className="text-sm text-muted-foreground">{review.useCases}</p>
              </div>
            )}

            <div className="flex gap-4 mt-4 pt-4 border-t text-sm">
              <span>Ease of Use: <span className="text-yellow-500">{"★".repeat(review.easeOfUse)}</span></span>
              <span>Value: <span className="text-yellow-500">{"★".repeat(review.valueForMoney)}</span></span>
              <span>Features: <span className="text-yellow-500">{"★".repeat(review.features)}</span></span>
            </div>
          </div>
        ))}

        {tool.reviews.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border">
            <p className="text-muted-foreground mb-4">No reviews yet. Be the first!</p>
            <Link
              href={`/tools/${tool.slug}/review`}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Write a Review
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
