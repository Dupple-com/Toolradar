import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VoteButton } from "@/components/tools/vote-button";
import { ToolScore } from "@/components/tools/tool-score";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = await prisma.tool.findUnique({ where: { slug: params.slug } });
  if (!tool) return {};
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
      _count: { select: { reviews: true, votes: true } },
    },
  });

  if (!tool || tool.status !== "published") notFound();

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
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center text-3xl font-bold">
                {tool.name[0]}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                {tool.toolOfTheDay && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    🏆 Tool of the Day
                  </span>
                )}
              </div>
              <p className="text-xl text-muted-foreground mt-2">{tool.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tool.categories.map((ct) => (
                  <Link
                    key={ct.category.id}
                    href={`/categories/${ct.category.slug}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80"
                  >
                    {ct.category.name}
                  </Link>
                ))}
                <span className={`px-3 py-1 rounded-full text-sm ${
                  tool.pricing === "free" ? "bg-green-100 text-green-700" :
                  tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {tool.pricing}
                </span>
              </div>
            </div>
            <VoteButton toolId={tool.id} initialVotes={tool.upvotes} />
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">About {tool.name}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{tool.description}</p>
          </div>

          {/* Reviews Preview */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <Link href={`/tools/${tool.slug}/reviews`} className="text-primary hover:underline text-sm">
                View all ({tool._count.reviews}) →
              </Link>
            </div>
            {tool.reviews.length > 0 ? (
              <div className="space-y-4">
                {tool.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      {review.user.image ? (
                        <img src={review.user.image} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted" />
                      )}
                      <span className="font-medium">{review.user.name || "Anonymous"}</span>
                      <span className="text-yellow-500">{"★".repeat(review.overallRating)}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <h3 className="font-medium">{review.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{review.pros.slice(0, 150)}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}
            <Link
              href={`/tools/${tool.slug}/reviews/new`}
              className="block mt-4 text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Write a Review
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scores */}
          <ToolScore
            editorialScore={tool.editorialScore}
            communityScore={tool.communityScore}
            reviewCount={tool._count.reviews}
          />

          {/* Actions */}
          <div className="bg-card rounded-xl border p-6 space-y-3">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-center hover:bg-primary/90 font-medium"
            >
              Visit Website →
            </a>
            <Link
              href={`/compare?tools=${tool.slug}`}
              className="block w-full px-4 py-3 border rounded-lg text-center hover:bg-muted"
            >
              Compare with others
            </Link>
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
                    className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg -mx-2"
                  >
                    {alt.alternative.logo ? (
                      <img src={alt.alternative.logo} alt="" className="w-10 h-10 rounded" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold">
                        {alt.alternative.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{alt.alternative.name}</p>
                      <p className="text-xs text-muted-foreground">{alt.alternative.pricing}</p>
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
