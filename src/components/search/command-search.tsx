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
    <div className="hidden md:block flex-1 max-w-xl">
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 bg-gray-100/50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left hidden sm:inline">Search tools...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-md border border-gray-200 font-medium text-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            ref={containerRef}
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-gray-200">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for tools..."
                className="flex-1 py-4 text-lg bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
              />
              {isLoading && (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded text-gray-600">ESC</kbd>
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {query.trim() === "" ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>Start typing to search tools...</p>
                  <p className="text-sm mt-2 text-gray-400">Try "AI", "productivity", "design"</p>
                </div>
              ) : results.length === 0 && !isLoading ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>No tools found for "{query}"</p>
                  <p className="text-sm mt-2 text-gray-400">Try a different search term</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((tool, index) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tool.logo ? (
                          <Image
                            src={tool.logo}
                            alt={tool.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">
                            {tool.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate text-gray-900">{tool.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs rounded ${pricingColors[tool.pricing] || "bg-gray-100 text-gray-700"}`}>
                            {tool.pricing}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
                        {tool.categoryNames?.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {tool.categoryNames.slice(0, 2).join(" · ")}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-600 hover:bg-gray-50 transition-colors border-t border-gray-200 ${
                        selectedIndex === results.length ? "bg-gray-50" : ""
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
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">↑</kbd>
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
