import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { redirect } from "next/navigation";
import { MessageSquare, Star, Clock } from "lucide-react";
import { ReviewResponseForm } from "@/components/company/review-response-form";

export default async function CompanyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    redirect("/company/setup");
  }

  // Get all reviews for company's tools
  const reviews = await prisma.review.findMany({
    where: {
      tool: { companyId: company.id },
      status: "approved",
    },
    include: {
      tool: { select: { name: true, slug: true } },
      user: { select: { name: true, image: true } },
      replies: {
        where: { isVendorResponse: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const needsResponse = reviews.filter((r) => r.replies.length === 0);
  const responded = reviews.filter((r) => r.replies.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">
          Respond to customer reviews and build trust
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{needsResponse.length}</p>
              <p className="text-sm text-muted-foreground">Needs Response</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{responded.length}</p>
              <p className="text-sm text-muted-foreground">Responded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Needs Response */}
      {needsResponse.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Awaiting Response ({needsResponse.length})
          </h2>
          <div className="space-y-4">
            {needsResponse.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Responded */}
      {responded.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Responded ({responded.length})
          </h2>
          <div className="space-y-4">
            {responded.map((review) => (
              <ReviewCard key={review.id} review={review} hasResponse />
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="bg-card rounded-xl border p-8 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm">
            When customers leave reviews, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  hasResponse = false,
}: {
  review: {
    id: string;
    title: string;
    pros: string;
    cons: string;
    overallRating: number;
    createdAt: Date;
    tool: { name: string; slug: string };
    user: { name: string | null; image: string | null };
    replies: { content: string }[];
  };
  hasResponse?: boolean;
}) {
  return (
    <div className="bg-card rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-500">
              {"★".repeat(review.overallRating)}
              {"☆".repeat(5 - review.overallRating)}
            </span>
            <span className="text-sm text-muted-foreground">
              for {review.tool.name}
            </span>
          </div>
          <h3 className="font-semibold">{review.title}</h3>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>{review.user.name || "Anonymous"}</p>
          <p>{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm mb-4">
        {review.pros && (
          <div>
            <p className="font-medium text-green-600">Pros</p>
            <p className="text-muted-foreground">{review.pros}</p>
          </div>
        )}
        {review.cons && (
          <div>
            <p className="font-medium text-red-600">Cons</p>
            <p className="text-muted-foreground">{review.cons}</p>
          </div>
        )}
      </div>

      {/* Existing Response */}
      {hasResponse && review.replies[0] && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <p className="text-xs font-medium text-blue-600 mb-2">Your Response</p>
          <p className="text-sm">{review.replies[0].content}</p>
        </div>
      )}

      {/* Response Form */}
      <ReviewResponseForm
        reviewId={review.id}
        existingResponse={review.replies[0]?.content}
      />
    </div>
  );
}
