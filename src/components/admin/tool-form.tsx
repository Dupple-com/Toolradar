"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ToolFormProps {
  tool?: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    logo: string | null;
    website: string;
    pricing: string;
    status: string;
    editorialScore: number | null;
  };
}

export function ToolForm({ tool }: ToolFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tool?.name || "",
    slug: tool?.slug || "",
    tagline: tool?.tagline || "",
    description: tool?.description || "",
    logo: tool?.logo || "",
    website: tool?.website || "",
    pricing: tool?.pricing || "free",
    status: tool?.status || "draft",
    editorialScore: tool?.editorialScore || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = tool ? `/api/admin/tools/${tool.id}` : "/api/admin/tools";
    const method = tool ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        editorialScore: formData.editorialScore ? parseInt(formData.editorialScore as string) : null,
      }),
    });

    if (res.ok) {
      router.push("/admin/tools");
      router.refresh();
    } else {
      alert("Error saving tool");
    }
    setIsLoading(false);
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={generateSlug}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tagline *</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          required
          placeholder="One sentence description"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Website URL *</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo URL</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pricing</label>
          <select
            value={formData.pricing}
            onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Editorial Score (0-100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.editorialScore}
            onChange={(e) => setFormData({ ...formData, editorialScore: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : tool ? "Update Tool" : "Create Tool"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
