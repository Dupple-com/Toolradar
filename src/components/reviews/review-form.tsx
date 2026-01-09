"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface ReviewFormProps {
  toolId: string;
  toolSlug: string;
}

export function ReviewForm({ toolId, toolSlug }: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [formData, setFormData] = useState({
    overallRating: 5,
    easeOfUse: 5,
    valueForMoney: 5,
    features: 5,
    customerSupport: 5,
    title: "",
    pros: "",
    cons: "",
    useCases: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Please complete the verification");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, toolId, turnstileToken }),
    });

    if (res.ok) {
      toast.success("Review submitted successfully!");
      router.push(`/tools/${toolSlug}?review=submitted`);
    } else {
      toast.error("Error submitting review");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
    setIsLoading(false);
  };

  const RatingInput = ({
    label,
    name,
    value,
  }: {
    label: string;
    name: keyof typeof formData;
    value: number;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, [name]: star })}
            className={`text-2xl transition ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
      <div className="grid grid-cols-2 gap-6">
        <RatingInput label="Overall Rating *" name="overallRating" value={formData.overallRating} />
        <RatingInput label="Ease of Use *" name="easeOfUse" value={formData.easeOfUse} />
        <RatingInput label="Value for Money *" name="valueForMoney" value={formData.valueForMoney} />
        <RatingInput label="Features *" name="features" value={formData.features} />
        <RatingInput label="Customer Support" name="customerSupport" value={formData.customerSupport} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Review Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          What do you like? *
          <span className="text-muted-foreground font-normal"> (Pros)</span>
        </label>
        <textarea
          value={formData.pros}
          onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
          required
          rows={3}
          placeholder="What are the best features? What problem does it solve?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          What could be improved? *
          <span className="text-muted-foreground font-normal"> (Cons)</span>
        </label>
        <textarea
          value={formData.cons}
          onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
          required
          rows={3}
          placeholder="What limitations or issues have you encountered?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Use Cases
          <span className="text-muted-foreground font-normal"> (Optional)</span>
        </label>
        <textarea
          value={formData.useCases}
          onChange={(e) => setFormData({ ...formData, useCases: e.target.value })}
          rows={2}
          placeholder="How do you use this tool? What workflows?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Review Guidelines</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Be honest and specific about your experience</li>
          <li>Focus on features, not personal opinions about the company</li>
          <li>Your review will be moderated before publishing</li>
          <li>Verified users get a badge on their reviews</li>
        </ul>
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
        onSuccess={(token) => setTurnstileToken(token)}
        onError={() => setTurnstileToken(null)}
        onExpire={() => setTurnstileToken(null)}
        options={{ theme: "light" }}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
