import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import Link from "next/link";

export default async function MyReviewsPage() {
  const user = await requireAuth();

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { tool: { select: { name: true, slug: true, logo: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl border p-6">
              <div className="flex items-start justify-between">
                <Link href={`/tools/${review.tool.slug}`} className="flex items-center gap-3 hover:text-primary">
                  {review.tool.logo ? (
                    <img src={review.tool.logo} alt="" className="w-10 h-10 rounded" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted" />
                  )}
                  <span className="font-medium">{review.tool.name}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">{"★".repeat(review.overallRating)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    review.status === "approved" ? "bg-green-100 text-green-700" :
                    review.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
              <h3 className="font-medium mt-3">{review.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{review.pros.slice(0, 100)}...</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground mb-4">No reviews yet</p>
          <a href="/tools" className="text-primary hover:underline">
            Review a tool →
          </a>
        </div>
      )}
    </div>
  );
}
