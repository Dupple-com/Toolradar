"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SubmissionData {
  name: string;
  website: string;
  tagline: string;
  description: string;
  pricing: string;
  logo?: string;
}

interface SubmissionModerationProps {
  submission: {
    id: string;
    data: unknown;
    status: string;
    feedback: string | null;
    createdAt: Date;
    company: {
      name: string;
      domain: string;
      user: { name: string | null; email: string } | null;
    };
  };
}

export function SubmissionModeration({ submission }: SubmissionModerationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const data = submission.data as SubmissionData;

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !feedback.trim()) {
      toast.error("Please provide feedback for rejection");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: action === "reject" ? feedback : undefined,
        }),
      });

      if (res.ok) {
        toast.success(action === "approve" ? "Submission approved and tool created!" : "Submission rejected");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to process submission");
      }
    } catch {
      toast.error("An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{data.name}</h3>
          <p className="text-sm text-muted-foreground">
            Submitted by {submission.company.name} {submission.company.user ? `(${submission.company.user.email})` : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(submission.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${
          data.pricing === "free" ? "bg-green-100 text-green-700" :
          data.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
          "bg-orange-100 text-orange-700"
        }`}>
          {data.pricing}
        </span>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{data.tagline}</p>
        <a
          href={data.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {data.website}
        </a>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-primary hover:underline"
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>

      {showDetails && (
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{data.description}</p>
          </div>
          {data.logo && (
            <div>
              <p className="text-sm font-medium mb-1">Logo URL</p>
              <p className="text-sm text-muted-foreground break-all">{data.logo}</p>
            </div>
          )}
        </div>
      )}

      {submission.status === "pending" && (
        <div className="space-y-3 pt-2">
          <textarea
            placeholder="Feedback (required for rejection)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAction("approve")}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Approve & Create Tool"}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {submission.status === "rejected" && submission.feedback && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700">Rejection Reason</p>
          <p className="text-sm text-red-600 mt-1">{submission.feedback}</p>
        </div>
      )}
    </div>
  );
}
