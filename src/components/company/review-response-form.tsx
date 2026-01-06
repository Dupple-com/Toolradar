"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send, Pencil, Trash2, Check } from "lucide-react";

interface ReviewResponseFormProps {
  reviewId: string;
  existingResponse?: string;
}

export function ReviewResponseForm({ reviewId, existingResponse }: ReviewResponseFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!existingResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(existingResponse || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/company/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setIsSaved(true);
        setIsEditing(false);
        router.refresh();
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit response");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your response?")) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/company/reviews/${reviewId}/reply`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContent("");
        setIsEditing(true);
        router.refresh();
        toast.success("Response deleted");
      } else {
        toast.error("Failed to delete response");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  if (!isEditing && existingResponse) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Response
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a professional response to this review..."
        rows={3}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none text-sm"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isSaved
              ? "bg-green-500 text-white"
              : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {existingResponse ? "Update Response" : "Submit Response"}
            </>
          )}
        </button>
        {existingResponse && isEditing && (
          <button
            type="button"
            onClick={() => {
              setContent(existingResponse);
              setIsEditing(false);
            }}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Your response will be visible on the public tool page.
      </p>
    </form>
  );
}
