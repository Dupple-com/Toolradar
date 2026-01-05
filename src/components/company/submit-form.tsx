"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export function SubmitToolForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    tagline: "",
    description: "",
    pricing: "free",
    logo: "",
  });

  const handleAutoFill = async () => {
    if (!formData.website) {
      toast.error("Please enter a website URL first");
      return;
    }

    setIsFetching(true);
    try {
      const res = await fetch("/api/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.website }),
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          name: data.title || prev.name,
          tagline: data.description?.slice(0, 100) || prev.tagline,
          description: data.description || prev.description,
          logo: data.logo || prev.logo,
        }));
        toast.success("Fields auto-filled from website!");
      } else {
        toast.error("Could not fetch website metadata");
      }
    } catch {
      toast.error("Error fetching website data");
    }
    setIsFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Tool submitted for review!");
      setSubmitted(true);
    } else {
      toast.error("Error submitting tool");
    }
    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-green-800 mb-2">Submission Received!</h2>
        <p className="text-green-700">
          Our team will review your tool and get back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Website URL - First field with auto-fill */}
      <div>
        <label className="block text-sm font-medium mb-2">Website URL *</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            required
            placeholder="example.com"
            className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={isFetching || !formData.website}
            className="px-4 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Auto-fill
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Enter URL and click Auto-fill to populate fields automatically
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tool Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tagline *</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          required
          placeholder="One sentence description"
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Pricing</label>
        <select
          value={formData.pricing}
          onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
        >
          <option value="free">Free</option>
          <option value="freemium">Freemium</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Logo URL</label>
        <input
          type="url"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
      >
        {isLoading ? "Submitting..." : "Submit Tool"}
      </button>
    </form>
  );
}
