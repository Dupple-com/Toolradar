"use client";

import Link from "next/link";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchEmptyStateProps {
  query: string;
  hasFilters: boolean;
  categories: Category[];
  onClearSearch: () => void;
  onCategorySelect: (slug: string) => void;
}

export function SearchEmptyState({
  query,
  hasFilters,
  categories,
  onClearSearch,
  onCategorySelect,
}: SearchEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
      </div>
      {query ? (
        <>
          <h2 className="text-xl font-semibold mb-2">No tools found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find any tools matching &quot;{query}&quot;
            {hasFilters && " in this category"}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onClearSearch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear search
            </button>
            <Link
              href="/tools"
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              Browse all tools
            </Link>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Start your search</h2>
          <p className="text-muted-foreground mb-6">
            Enter a search term or browse by category
          </p>
          {/* Popular categories */}
          {categories.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium mb-3">Popular categories</p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat.slug)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
