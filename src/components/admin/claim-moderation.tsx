"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClaimModerationProps {
  claim: {
    id: string;
    workEmail: string | null;
    jobTitle: string | null;
    linkedinUrl: string | null;
    additionalNotes: string | null;
    status: string;
    feedback: string | null;
    createdAt: Date;
    user: {
      name: string | null;
      email: string;
      image: string | null;
      linkedinUrl: string | null;
    };
    company: {
      name: string;
      domain: string;
      slug: string;
      logo: string | null;
    };
  };
}

export function ClaimModeration({ claim }: ClaimModerationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !feedback.trim()) {
      toast.error("Please provide feedback for rejection");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/claims/${claim.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: action === "reject" ? feedback : undefined,
        }),
      });

      if (res.ok) {
        toast.success(
          action === "approve"
            ? "Claim approved! User is now company owner."
            : "Claim rejected"
        );
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to process claim");
      }
    } catch {
      toast.error("An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Company logo */}
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {claim.company.logo ? (
              <img
                src={claim.company.logo}
                alt={claim.company.name}
                className="w-12 h-12 object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {claim.company.name[0]}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{claim.company.name}</h3>
            <p className="text-sm text-muted-foreground">{claim.company.domain}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Claimed by: {claim.user.name || claim.user.email}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded ${
            claim.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : claim.status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {claim.status}
        </span>
      </div>

      {/* Claimant info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Work Email:</span>{" "}
          <span className="font-medium">{claim.workEmail || "Not provided"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Job Title:</span>{" "}
          <span className="font-medium">{claim.jobTitle || "Not provided"}</span>
        </div>
      </div>

      {claim.linkedinUrl && (
        <div className="text-sm">
          <span className="text-muted-foreground">LinkedIn:</span>{" "}
          <a
            href={claim.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {claim.linkedinUrl}
          </a>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-primary hover:underline"
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>

      {showDetails && (
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg text-sm">
          <div>
            <p className="font-medium mb-1">User Account</p>
            <p className="text-muted-foreground">
              Email: {claim.user.email}
              {claim.user.linkedinUrl && (
                <>
                  <br />
                  LinkedIn:{" "}
                  <a
                    href={claim.user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {claim.user.linkedinUrl}
                  </a>
                </>
              )}
            </p>
          </div>
          {claim.additionalNotes && (
            <div>
              <p className="font-medium mb-1">Additional Notes</p>
              <p className="text-muted-foreground whitespace-pre-line">
                {claim.additionalNotes}
              </p>
            </div>
          )}
          <div>
            <p className="font-medium mb-1">Submitted</p>
            <p className="text-muted-foreground">
              {new Date(claim.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}

      {claim.status === "pending" && (
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
              {isLoading ? "Processing..." : "Approve Claim"}
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

      {claim.status === "rejected" && claim.feedback && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700">Rejection Reason</p>
          <p className="text-sm text-red-600 mt-1">{claim.feedback}</p>
        </div>
      )}
    </div>
  );
}
