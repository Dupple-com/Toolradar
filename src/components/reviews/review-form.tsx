"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  toolId: string;
  toolSlug: string;
}

export function ReviewForm({ toolId, toolSlug }: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    overallRating: 5,
    easeOfUse: 5,
    valueForMoney: 5,
    customerSupport: 5,
    features: 5,
    pros: "",
    cons: "",
    useCases: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, toolId }),
    });

    if (res.ok) {
      router.push(`/tools/${toolSlug}/reviews?submitted=true`);
    } else {
      alert("Error submitting review");
    }
    setIsLoading(false);
  };

  const RatingInput = ({ label, field }: { label: string; field: keyof typeof formData }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: value })}
            className={`text-2xl ${
              value <= (formData[field] as number) ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Review Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <RatingInput label="Overall Rating *" field="overallRating" />
        <RatingInput label="Ease of Use *" field="easeOfUse" />
        <RatingInput label="Value for Money *" field="valueForMoney" />
        <RatingInput label="Features *" field="features" />
        <RatingInput label="Customer Support" field="customerSupport" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">What do you like? *</label>
        <textarea
          value={formData.pros}
          onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
          required
          rows={3}
          placeholder="What are the best features? What problems does it solve?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">What could be improved? *</label>
        <textarea
          value={formData.cons}
          onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
          required
          rows={3}
          placeholder="What are the drawbacks? What's missing?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Use Cases (optional)</label>
        <textarea
          value={formData.useCases}
          onChange={(e) => setFormData({ ...formData, useCases: e.target.value })}
          rows={2}
          placeholder="How do you use this tool?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-1">🔒 Review Verification</p>
        <p className="text-muted-foreground">
          Your review will be verified before publishing. Reviews from LinkedIn-connected accounts
          or professional email domains get a "Verified" badge.
        </p>
      </div>

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
