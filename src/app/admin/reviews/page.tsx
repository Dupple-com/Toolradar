import { prisma } from "@/lib/prisma";
import { ReviewModeration } from "@/components/admin/review-moderation";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "pending";

  const reviews = await prisma.review.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: {
      tool: { select: { name: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews Moderation</h1>
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <a
              key={s}
              href={`/admin/reviews?status=${s}`}
              className={`px-4 py-2 rounded-lg text-sm ${
                status === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewModeration key={review.id} review={review} />
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
            No {status} reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
