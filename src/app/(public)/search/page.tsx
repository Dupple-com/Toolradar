"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolCard } from "@/components/tools/tool-card";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setResults(data.hits || []);
    setIsLoading(false);
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    handleSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Tools</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools..."
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Searching...</div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">{results.length} results found</p>
          <div className="grid gap-4">
            {results.map((tool) => (
              <ToolCard key={tool.id} tool={tool} showVotes />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12 text-muted-foreground">
          No tools found for "{query}"
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Enter a search term to find tools
        </div>
      )}
    </div>
  );
}
