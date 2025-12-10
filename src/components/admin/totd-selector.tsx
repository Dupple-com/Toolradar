"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TotdSelectorProps {
  tools: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logo: string | null;
  }[];
  currentTotdId?: string;
}

export function TotdSelector({ tools, currentTotdId }: TotdSelectorProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(currentTotdId || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    if (!selectedId) return;
    setIsLoading(true);

    await fetch("/api/admin/totd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId: selectedId }),
    });

    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <h2 className="font-semibold">Select Tool of the Day</h2>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="">Select a tool...</option>
        {tools.map((tool) => (
          <option key={tool.id} value={tool.id}>
            {tool.name} - {tool.tagline}
          </option>
        ))}
      </select>

      <button
        onClick={handleSelect}
        disabled={!selectedId || isLoading}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Setting..." : "Set as Tool of the Day"}
      </button>
    </div>
  );
}
