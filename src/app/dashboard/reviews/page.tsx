import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tool: { select: { name: true, slug: true, logo: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <Link
                  href={`/tools/${review.tool.slug}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  {review.tool.logo ? (
                    <img src={review.tool.logo} alt={`${review.tool.name} logo`} className="w-10 h-10 rounded" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold">
                      {review.tool.name[0]}
                    </div>
                  )}
                  <span className="font-medium">{review.tool.name}</span>
                </Link>
                <span className={`px-2 py-1 rounded text-xs ${
                  review.status === "approved" ? "bg-green-100 text-green-700" :
                  review.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {review.status}
                </span>
              </div>
              <h3 className="font-semibold">{review.title}</h3>
              <p className="text-yellow-500 mt-1">{"★".repeat(review.overallRating)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">You haven&apos;t written any reviews yet.</p>
        </div>
      )}
    </div>
  );
}
