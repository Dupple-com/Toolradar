"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tagline: string;
}

export function CompareSelector({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Tool[]>([]);

  const toggleTool = (tool: Tool) => {
    if (selected.find((t) => t.id === tool.id)) {
      setSelected(selected.filter((t) => t.id !== tool.id));
    } else if (selected.length < 4) {
      setSelected([...selected, tool]);
    }
  };

  const handleCompare = () => {
    if (selected.length >= 2) {
      const slugs = selected.map((t) => t.slug).join("-vs-");
      router.push(`/compare/${slugs}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {selected.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg"
          >
            {tool.logo && <img src={tool.logo} alt="" className="w-6 h-6 rounded" />}
            <span className="font-medium">{tool.name}</span>
            <button
              onClick={() => toggleTool(tool)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        ))}
        {selected.length === 0 && (
          <p className="text-muted-foreground">Select tools below to compare</p>
        )}
      </div>

      {selected.length >= 2 && (
        <button
          onClick={handleCompare}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Compare {selected.length} Tools
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const isSelected = selected.find((t) => t.id === tool.id);
          return (
            <button
              key={tool.id}
              onClick={() => toggleTool(tool)}
              disabled={!isSelected && selected.length >= 4}
              className={`p-3 rounded-xl border text-left transition ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50 disabled:opacity-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {tool.logo ? (
                  <img src={tool.logo} alt="" className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-bold">
                    {tool.name[0]}
                  </div>
                )}
                <span className="font-medium text-sm truncate">{tool.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
