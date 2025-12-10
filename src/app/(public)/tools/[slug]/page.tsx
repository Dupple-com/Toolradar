import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VoteButton } from "@/components/tools/vote-button";
import { FavoriteButton } from "@/components/tools/favorite-button";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = await prisma.tool.findUnique({ where: { slug: params.slug } });
  if (!tool) return { title: "Tool not found" };
  return {
    title: `${tool.name} - Toolradar`,
    description: tool.tagline,
  };
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: {
      categories: { include: { category: true } },
      alternatives: { include: { alternative: true } },
      reviews: {
        where: { status: "approved" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
      _count: { select: { reviews: true, votes: true, comments: true } },
    },
  });

  if (!tool || tool.status !== "published") {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-6">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} className="w-20 h-20 rounded-2xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                {tool.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{tool.tagline}</p>
              <div className="flex items-center gap-3 mt-4">
                {tool.categories.map((ct) => (
                  <Link
                    key={ct.category.id}
                    href={`/categories/${ct.category.slug}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80"
                  >
                    {ct.category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <VoteButton toolId={tool.id} initialVotes={tool.upvotes} />
              <FavoriteButton toolId={tool.id} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">About {tool.name}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{tool.description}</p>
          </div>

          {/* Reviews */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Reviews ({tool._count.reviews})</h2>
              <Link
                href={`/tools/${tool.slug}/reviews`}
                className="text-primary hover:underline text-sm"
              >
                See all reviews →
              </Link>
            </div>
            {tool.reviews.length > 0 ? (
              <div className="space-y-4">
                {tool.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {review.user.image ? (
                          <img src={review.user.image} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <span className="text-sm font-medium">{review.user.name?.[0] || "U"}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.user.name || "Anonymous"}</p>
                        <p className="text-yellow-500 text-sm">{"★".repeat(review.overallRating)}</p>
                      </div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <h4 className="font-medium">{review.title}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-green-600 font-medium">Pros: </span>
                        <span className="text-muted-foreground">{review.pros}</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">Cons: </span>
                        <span className="text-muted-foreground">{review.cons}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No reviews yet. Be the first to review this tool!
              </p>
            )}
            <Link
              href={`/tools/${tool.slug}/review`}
              className="mt-4 block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Write a Review
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scores */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Scores</h3>
            <div className="space-y-4">
              {tool.editorialScore && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Editorial Score</span>
                    <span className="font-bold text-primary">{tool.editorialScore}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${tool.editorialScore}%` }}
                    />
                  </div>
                </div>
              )}
              {tool.communityScore && tool.communityScore > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Score</span>
                    <span className="font-bold">
                      <span className="text-yellow-500">★</span> {tool.communityScore.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.reviewCount} reviews</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Info</h3>
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
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Upvotes</dt>
                <dd className="font-medium">{tool.upvotes}</dd>
              </div>
            </dl>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Visit Website →
            </a>
          </div>

          {/* Alternatives */}
          {tool.alternatives.length > 0 && (
            <div className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Alternatives</h3>
              <div className="space-y-3">
                {tool.alternatives.map((alt) => (
                  <Link
                    key={alt.alternative.id}
                    href={`/tools/${alt.alternative.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition"
                  >
                    {alt.alternative.logo ? (
                      <img src={alt.alternative.logo} alt="" className="w-10 h-10 rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold">
                        {alt.alternative.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{alt.alternative.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{alt.alternative.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
