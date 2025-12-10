"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CompareSelectorProps {
  tools: { id: string; name: string; slug: string; logo: string | null }[];
  selected: string[];
}

export function CompareSelector({ tools, selected }: CompareSelectorProps) {
  const router = useRouter();
  const [selection, setSelection] = useState<string[]>(selected);

  const toggleTool = (slug: string) => {
    const newSelection = selection.includes(slug)
      ? selection.filter((s) => s !== slug)
      : selection.length < 4
      ? [...selection, slug]
      : selection;

    setSelection(newSelection);
    if (newSelection.length >= 2) {
      router.push(`/compare?tools=${newSelection.join(",")}`);
    } else if (newSelection.length > 0) {
      router.push(`/compare?tools=${newSelection.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Select tools to compare (max 4)</h2>
        <span className="text-sm text-muted-foreground">{selection.length}/4 selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => toggleTool(tool.slug)}
            disabled={selection.length >= 4 && !selection.includes(tool.slug)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
              selection.includes(tool.slug)
                ? "bg-primary/10 border-primary text-primary"
                : "hover:bg-muted disabled:opacity-50"
            }`}
          >
            {tool.logo ? (
              <img src={tool.logo} alt="" className="w-5 h-5 rounded" />
            ) : (
              <span className="w-5 h-5 rounded bg-muted text-xs flex items-center justify-center">
                {tool.name[0]}
              </span>
            )}
            <span className="text-sm">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
