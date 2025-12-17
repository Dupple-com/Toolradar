"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string | null;
  pricing: string;
  categoryNames: string[];
}

export function CommandSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.hits || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
      }
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex === results.length && query.trim()) {
          // "See all results" selected
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        } else if (results[selectedIndex]) {
          router.push(`/tools/${results[selectedIndex].slug}`);
          setIsOpen(false);
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
      }
    },
    [results, selectedIndex, query, router]
  );

  const pricingColors: Record<string, string> = {
    free: "bg-green-100 text-green-700",
    freemium: "bg-blue-100 text-blue-700",
    paid: "bg-orange-100 text-orange-700",
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search tools...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-background rounded border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[15vh]">
          <div
            ref={containerRef}
            className="w-full max-w-xl bg-background rounded-xl shadow-2xl border overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for tools..."
                className="flex-1 py-4 text-lg bg-transparent outline-none placeholder:text-muted-foreground"
              />
              {isLoading && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">ESC</kbd>
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {query.trim() === "" ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <p>Start typing to search tools...</p>
                  <p className="text-sm mt-2">Try "AI", "productivity", "design"</p>
                </div>
              ) : results.length === 0 && !isLoading ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <p>No tools found for "{query}"</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((tool, index) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
                        index === selectedIndex ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tool.logo ? (
                          <Image
                            src={tool.logo}
                            alt={tool.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-muted-foreground">
                            {tool.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{tool.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs rounded ${pricingColors[tool.pricing] || "bg-gray-100 text-gray-700"}`}>
                            {tool.pricing}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
                        {tool.categoryNames?.length > 0 && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5">
                            {tool.categoryNames.slice(0, 2).join(" · ")}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}

                  {/* See all results */}
                  {query.trim() && (
                    <button
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-primary hover:bg-muted/50 transition-colors border-t ${
                        selectedIndex === results.length ? "bg-muted/50" : ""
                      }`}
                    >
                      <span>See all results for "{query}"</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 border-t bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-background rounded border">↑</kbd>
                <kbd className="px-1 py-0.5 bg-background rounded border">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
