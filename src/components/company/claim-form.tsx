"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClaimFormProps {
  companyId: string;
  companyName: string;
  domain: string;
}

export function ClaimForm({ companyId, companyName, domain }: ClaimFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    workEmail: "",
    jobTitle: "",
    linkedinUrl: "",
    additionalNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.workEmail && !formData.linkedinUrl) {
      toast.error("Please provide either a work email or LinkedIn profile");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          ...formData,
        }),
      });

      if (res.ok) {
        toast.success("Claim submitted! We'll review it shortly.");
        router.push(`/companies/${domain.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to submit claim");
      }
    } catch {
      toast.error("An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Work Email <span className="text-slate-400">(recommended)</span>
        </label>
        <input
          type="email"
          value={formData.workEmail}
          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
          placeholder={`you@${domain}`}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          An email address on the company domain helps verify your claim faster.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Job Title
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          placeholder="e.g. Marketing Manager, CEO, Product Lead"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          LinkedIn Profile
        </label>
        <input
          type="url"
          value={formData.linkedinUrl}
          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          We may check your LinkedIn to verify your employment at {companyName}.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Additional Notes <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          placeholder="Any additional information that might help verify your claim..."
          rows={3}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isLoading ? "Submitting..." : "Submit Claim Request"}
      </button>
    </form>
  );
}
