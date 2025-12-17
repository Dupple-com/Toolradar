"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string;
  status: string;
}

export function LogoManager({ tools: initialTools }: { tools: Tool[] }) {
  const [tools, setTools] = useState(initialTools);
  const [filter, setFilter] = useState<"all" | "missing" | "has">("missing");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    let result = tools;

    // Filter by logo status
    if (filter === "missing") {
      result = result.filter((t) => !t.logo);
    } else if (filter === "has") {
      result = result.filter((t) => t.logo);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.website.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tools, filter, search]);

  const handleEdit = (tool: Tool) => {
    setEditingId(tool.id);
    setEditValue(tool.logo || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = async (toolId: string) => {
    setSaving(toolId);
    try {
      const res = await fetch(`/api/admin/tools/${toolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: editValue || null }),
      });

      if (!res.ok) {
        throw new Error("Failed to update logo");
      }

      // Update local state
      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId ? { ...t, logo: editValue || null } : t
        )
      );

      toast.success("Logo updated successfully");
      setEditingId(null);
      setEditValue("");
    } catch (error) {
      toast.error("Failed to update logo");
    } finally {
      setSaving(null);
    }
  };

  const suggestLogoUrl = (website: string): string => {
    try {
      const url = new URL(website);
      return `https://logo.clearbit.com/${url.hostname}`;
    } catch {
      return "";
    }
  };

  const handleFetchLogo = async (tool: Tool) => {
    const suggestedUrl = suggestLogoUrl(tool.website);
    if (!suggestedUrl) {
      toast.error("Invalid website URL");
      return;
    }

    // Test if the logo URL is valid
    try {
      const img = new Image();
      img.onload = () => {
        setEditingId(tool.id);
        setEditValue(suggestedUrl);
        toast.info("Logo URL found! Click Save to apply.");
      };
      img.onerror = () => {
        toast.error("Could not find logo for this domain");
      };
      img.src = suggestedUrl;
    } catch {
      toast.error("Could not fetch logo");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card rounded-xl border p-4">
        <div className="flex gap-2">
          {[
            { value: "missing", label: "Missing logos", count: tools.filter((t) => !t.logo).length },
            { value: "has", label: "Has logo", count: tools.filter((t) => t.logo).length },
            { value: "all", label: "All tools", count: tools.length },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or website..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTools.length} tools
      </p>

      {/* Tools table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-16">Logo</th>
              <th className="text-left px-4 py-3 font-medium">Tool</th>
              <th className="text-left px-4 py-3 font-medium">Website</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Logo URL</th>
              <th className="text-right px-4 py-3 font-medium w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTools.map((tool) => (
              <tr key={tool.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  {tool.logo ? (
                    <img
                      src={tool.logo}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                      <span className="text-red-400 text-xs">?</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{tool.name}</p>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block max-w-[200px]"
                  >
                    {tool.website}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tool.status === "published"
                        ? "bg-green-100 text-green-700"
                        : tool.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editingId === tool.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground truncate block max-w-[300px]">
                      {tool.logo || "—"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === tool.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(tool.id)}
                        disabled={saving === tool.id}
                        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {saving === tool.id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {!tool.logo && (
                        <button
                          onClick={() => handleFetchLogo(tool)}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                          title="Try to auto-fetch logo from Clearbit"
                        >
                          Auto-fetch
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(tool)}
                        className="px-2 py-1 text-sm text-primary hover:underline"
                      >
                        {tool.logo ? "Edit" : "Add"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredTools.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {search
                    ? `No tools found for "${search}"`
                    : filter === "missing"
                    ? "All tools have logos!"
                    : "No tools found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk actions hint */}
      {filter === "missing" && filteredTools.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-1">Tips for finding logos</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>Use the &quot;Auto-fetch&quot; button to try Clearbit&apos;s logo API</li>
            <li>Visit the tool&apos;s website and find their logo in the assets or press kit</li>
            <li>Check their Twitter/X or LinkedIn profile for high-quality logos</li>
            <li>Use services like logo.dev or brandfetch.com</li>
          </ul>
        </div>
      )}
    </div>
  );
}
