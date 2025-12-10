import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ToolReviewsPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });

  if (!tool) {
    notFound();
  }

  const avgRatings = tool.reviews.length > 0 ? {
    overall: tool.reviews.reduce((s, r) => s + r.overallRating, 0) / tool.reviews.length,
    easeOfUse: tool.reviews.reduce((s, r) => s + r.easeOfUse, 0) / tool.reviews.length,
    valueForMoney: tool.reviews.reduce((s, r) => s + r.valueForMoney, 0) / tool.reviews.length,
    features: tool.reviews.reduce((s, r) => s + r.features, 0) / tool.reviews.length,
  } : null;

  return (
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

      {avgRatings && (
        <div className="bg-card rounded-xl border p-6 mb-8">
          <h2 className="font-semibold mb-4">Rating Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Overall", value: avgRatings.overall },
              { label: "Ease of Use", value: avgRatings.easeOfUse },
              { label: "Value for Money", value: avgRatings.valueForMoney },
              { label: "Features", value: avgRatings.features },
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

      <div className="space-y-6">
        {tool.reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {review.user.image ? (
                  <img src={review.user.image} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                    {review.user.name?.[0] || "U"}
                  </div>
                )}
                <div>
                  <p className="font-medium">{review.user.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Verified User
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-yellow-500 text-lg">{"★".repeat(review.overallRating)}</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-3">{review.title}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-700 font-medium text-sm mb-1">👍 Pros</p>
                <p className="text-sm">{review.pros}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm mb-1">👎 Cons</p>
                <p className="text-sm">{review.cons}</p>
              </div>
            </div>

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
  );
}
