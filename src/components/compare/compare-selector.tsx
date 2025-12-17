"use client";

import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.tagline?.toLowerCase().includes(q)
    );
  }, [tools, searchQuery]);

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
      {/* Selected Tools Preview */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Selected Tools ({selected.length}/4)</h3>
          {selected.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition"
            >
              Compare Now
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {/* Selected tool slots */}
          {Array.from({ length: 4 }).map((_, index) => {
            const tool = selected[index];
            return (
              <div
                key={index}
                className={`flex-1 min-w-0 p-4 rounded-xl border-2 border-dashed transition ${
                  tool ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
              >
                {tool ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleTool(tool)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm transition"
                    >
                      ×
                    </button>
                    <div className="flex flex-col items-center text-center">
                      {tool.logo ? (
                        <img src={tool.logo} alt="" className="w-12 h-12 rounded-xl mb-2" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-lg mb-2">
                          {tool.name[0]}
                        </div>
                      )}
                      <span className="font-medium text-sm truncate w-full">{tool.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs">Add tool</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools to compare..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
        />
      </div>

      {/* Tool Grid */}
      <div>
        <h3 className="font-semibold text-gray-600 mb-3">
          {searchQuery ? `Search results (${filteredTools.length})` : "Popular tools"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredTools.map((tool) => {
            const isSelected = selected.find((t) => t.id === tool.id);
            const isDisabled = !isSelected && selected.length >= 4;
            return (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool)}
                disabled={isDisabled}
                className={`p-4 rounded-xl border text-left transition group ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tool.logo ? (
                    <img src={tool.logo} alt="" className="w-10 h-10 rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                      {tool.name[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition">
                      {tool.name}
                    </p>
                    {tool.tagline && (
                      <p className="text-xs text-gray-500 truncate">{tool.tagline}</p>
                    )}
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tools found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
