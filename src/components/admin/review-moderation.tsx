"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewModerationProps {
  review: {
    id: string;
    title: string;
    pros: string;
    cons: string;
    overallRating: number;
    verified: boolean;
    status: string;
    createdAt: Date;
    tool: { name: string; slug: string };
    user: { name: string | null; email: string };
  };
}

export function ReviewModeration({ review }: ReviewModerationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(true);
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
    });
    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{review.title}</h3>
          <p className="text-sm text-muted-foreground">
            for <span className="text-foreground">{review.tool.name}</span> by {review.user.name || review.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">{"★".repeat(review.overallRating)}</span>
          {review.verified && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-green-600 mb-1">Pros</p>
          <p className="text-sm">{review.pros}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-red-600 mb-1">Cons</p>
          <p className="text-sm">{review.cons}</p>
        </div>
      </div>

      {review.status === "pending" && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleAction("approve")}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
