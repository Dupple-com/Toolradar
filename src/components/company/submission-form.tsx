"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubmissionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    tagline: "",
    description: "",
    pricing: "freemium",
    logo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/company/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/company?submitted=true");
    } else {
      alert("Error submitting tool");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Tool Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website URL *</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tagline *</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          required
          placeholder="One sentence description"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pricing Model</label>
        <select
          value={formData.pricing}
          onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="free">Free</option>
          <option value="freemium">Freemium</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Logo URL</label>
        <input
          type="url"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}
