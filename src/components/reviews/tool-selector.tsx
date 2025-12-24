"use client";

import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tagline: string;
}

interface ToolSelectorProps {
  tools: Tool[];
  onSelect: (tool: Tool) => void;
}

/**
 * Tool selection step for the review flow.
 * Displays a searchable grid of tools for users to choose from.
 */
export function ToolSelector({ tools, onSelect }: ToolSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline?.toLowerCase().includes(q)
    );
  }, [tools, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Which tool would you like to review?</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a tool..."
            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg"
            autoFocus
          />
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelect(tool)}
              className="flex items-center gap-4 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition text-left group"
            >
              {tool.logo ? (
                <img src={tool.logo} alt="" className="w-12 h-12 rounded-xl flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {tool.name[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium group-hover:text-primary transition">{tool.name}</p>
                <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition flex-shrink-0" />
            </button>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tools found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
