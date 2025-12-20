"use client";

import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { ReviewReplyForm } from "./review-reply-form";

interface ReviewReply {
  id: string;
  content: string;
  isVendorResponse: boolean;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    pros: string;
    cons: string;
    overallRating: number;
    verified: boolean;
    createdAt: string | Date;
    user: {
      name: string | null;
      image: string | null;
    };
    replies?: ReviewReply[];
    _count?: {
      replies: number;
    };
  };
  toolSlug: string;
  isLoggedIn: boolean;
}

export function ReviewCard({ review, toolSlug, isLoggedIn }: ReviewCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<ReviewReply[]>(review.replies || []);
  const [replyCount, setReplyCount] = useState(review._count?.replies || replies.length);

  const handleReplyAdded = (newReply: ReviewReply) => {
    setReplies((prev) => [...prev, newReply]);
    setReplyCount((prev) => prev + 1);
    setShowReplies(true);
    setShowReplyForm(false);
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div id={`review-${review.id}`} className="border-b last:border-0 pb-6 last:pb-0">
      {/* Review Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
          {review.user.image ? (
            <img src={review.user.image} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <span className="text-sm font-semibold text-slate-600">
              {review.user.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{review.user.name || "Anonymous"}</p>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-500">{"★".repeat(review.overallRating)}{"☆".repeat(5 - review.overallRating)}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <h4 className="font-semibold text-slate-900 mb-2">{review.title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-green-50 rounded-lg p-3">
          <span className="text-green-700 font-medium block mb-1">Pros</span>
          <p className="text-slate-700">{review.pros}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <span className="text-red-700 font-medium block mb-1">Cons</span>
          <p className="text-slate-700">{review.cons}</p>
        </div>
      </div>

      {/* Reply Button & Count */}
      <div className="flex items-center gap-4 mt-4">
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={16} />
            Reply
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-slate-100 space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {reply.user.image ? (
                    <img src={reply.user.image} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="text-xs font-semibold text-slate-600">
                      {reply.user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{reply.user.name || "Anonymous"}</span>
                    {reply.isVendorResponse && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        <Building2 size={10} />
                        Vendor
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-blue-100">
          <ReviewReplyForm
            reviewId={review.id}
            onReplyAdded={handleReplyAdded}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
