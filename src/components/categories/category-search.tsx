"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  children: {
    id: string;
    name: string;
    slug: string;
    _count: { tools: number };
  }[];
  _count: { tools: number };
}

interface CategorySearchProps {
  categories: Category[];
}

export function CategorySearch({ categories }: CategorySearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: { type: "category" | "subcategory"; name: string; slug: string; icon?: string | null; parent?: string; count: number }[] = [];

    categories.forEach((cat) => {
      // Check parent category
      if (cat.name.toLowerCase().includes(q) || cat.description?.toLowerCase().includes(q)) {
        results.push({
          type: "category",
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          count: cat._count.tools,
        });
      }

      // Check children
      cat.children.forEach((child) => {
        if (child.name.toLowerCase().includes(q)) {
          results.push({
            type: "subcategory",
            name: child.name,
            slug: child.slug,
            parent: cat.name,
            count: child._count.tools,
          });
        }
      });
    });

    return results.slice(0, 8);
  }, [query, categories]);

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search categories..."
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
        />
      </div>

      {/* Results dropdown */}
      {isFocused && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          {filteredResults.map((result, index) => (
            <Link
              key={`${result.slug}-${index}`}
              href={`/categories/${result.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b last:border-0"
            >
              {result.type === "category" && result.icon && (
                <span className="text-xl">{result.icon}</span>
              )}
              {result.type === "subcategory" && (
                <span className="text-xs text-muted-foreground">└</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{result.name}</p>
                {result.parent && (
                  <p className="text-xs text-muted-foreground">in {result.parent}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{result.count} products</span>
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {isFocused && query.trim() && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg p-4 text-center text-muted-foreground text-sm z-50">
          No categories found for "{query}"
        </div>
      )}
    </div>
  );
}
