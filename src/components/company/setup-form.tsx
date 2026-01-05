"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export function CompanySetupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
  });

  const fetchMetaDescription = async () => {
    if (!formData.website) {
      toast.error("Please enter a website URL first");
      return;
    }

    setIsFetchingMeta(true);
    try {
      const res = await fetch("/api/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.website }),
      });

      const data = await res.json();

      if (res.ok) {
        const updates: Partial<typeof formData> = {};

        if (data.description) {
          updates.description = data.description;
        }
        if (data.title && !formData.name) {
          // Clean up title (remove common suffixes)
          const cleanTitle = data.title
            .replace(/\s*[-|–—]\s*.+$/, "")
            .replace(/\s*:\s*.+$/, "")
            .trim();
          updates.name = cleanTitle;
        }

        if (Object.keys(updates).length > 0) {
          setFormData({ ...formData, ...updates });
          toast.success("Filled from website metadata");
        } else {
          toast.info("No metadata found on website");
        }
      } else {
        toast.error(data.error || "Failed to fetch metadata");
      }
    } catch {
      toast.error("Failed to fetch website");
    }
    setIsFetchingMeta(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Company profile created!");
        router.push("/company");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error creating company");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border p-6">
      <div>
        <label className="block text-sm font-medium mb-2">Company Website *</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            required
            placeholder="https://acme.com"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            type="button"
            onClick={fetchMetaDescription}
            disabled={isFetchingMeta || !formData.website}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {isFetchingMeta ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Auto-fill
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          This will be used to verify your company ownership
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Company Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Acme Inc."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Tell us about your company..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Creating..." : "Create Company Profile"}
      </button>
    </form>
  );
}
