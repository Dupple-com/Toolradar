"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SearchResultCard,
  SearchFilters,
  SearchActiveFilters,
  SearchLoadingSkeleton,
  SearchEmptyState,
  PRICING_OPTIONS,
  type SearchResult,
  type Category,
} from "@/components/search";
import { LoadingButton } from "@/components/ui/loading-button";

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedPricing, setSelectedPricing] = useState(searchParams.get("pricing") || "all");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "relevance");

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/search", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  // Build search URL
  const buildSearchUrl = useCallback(
    (params: {
      q?: string;
      category?: string;
      pricing?: string;
      sort?: string;
      limit?: number;
      offset?: number;
    }) => {
      const urlParams = new URLSearchParams();
      if (params.q) urlParams.set("q", params.q);
      if (params.category && params.category !== "all") urlParams.set("category", params.category);
      if (params.pricing && params.pricing !== "all") urlParams.set("pricing", params.pricing);
      if (params.sort && params.sort !== "relevance") urlParams.set("sort", params.sort);
      if (params.limit) urlParams.set("limit", String(params.limit));
      if (params.offset) urlParams.set("offset", String(params.offset));
      return `/api/search?${urlParams.toString()}`;
    },
    []
  );

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string, category: string, pricing: string, sort: string, loadMore = false) => {
      const currentOffset = loadMore ? offset + ITEMS_PER_PAGE : 0;

      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setOffset(0);
      }

      try {
        const url = buildSearchUrl({
          q: searchQuery,
          category,
          pricing,
          sort,
          limit: ITEMS_PER_PAGE,
          offset: currentOffset,
        });

        const res = await fetch(url);
        const data = await res.json();

        if (loadMore) {
          setResults((prev) => [...prev, ...(data.hits || [])]);
        } else {
          setResults(data.hits || []);
        }

        setTotalHits(data.estimatedTotalHits || 0);
        setOffset(currentOffset);
        setHasMore((data.hits?.length || 0) === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Search error:", error);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [offset, buildSearchUrl]
  );

  // Update URL and search on param change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "all";
    const pricing = searchParams.get("pricing") || "all";
    const sort = searchParams.get("sort") || "relevance";

    setQuery(q);
    setSelectedCategory(category);
    setSelectedPricing(pricing);
    setSelectedSort(sort);

    performSearch(q, category, pricing, sort);
  }, [searchParams]);

  // Update URL with filters
  const updateUrl = (params: { q?: string; category?: string; pricing?: string; sort?: string }) => {
    const urlParams = new URLSearchParams();
    const newQuery = params.q ?? query;
    const newCategory = params.category ?? selectedCategory;
    const newPricing = params.pricing ?? selectedPricing;
    const newSort = params.sort ?? selectedSort;

    if (newQuery) urlParams.set("q", newQuery);
    if (newCategory !== "all") urlParams.set("category", newCategory);
    if (newPricing !== "all") urlParams.set("pricing", newPricing);
    if (newSort !== "relevance") urlParams.set("sort", newSort);

    router.push(`/search?${urlParams.toString()}`);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: query });
  };

  // Handle load more
  const handleLoadMore = () => {
    performSearch(query, selectedCategory, selectedPricing, selectedSort, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Tools</h1>
        <p className="text-muted-foreground">Find the perfect tool for your needs</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
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
              placeholder="Search for tools..."
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg bg-background"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <SearchFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
        selectedSort={selectedSort}
        onCategoryChange={(category) => updateUrl({ category })}
        onPricingChange={(pricing) => updateUrl({ pricing })}
        onSortChange={(sort) => updateUrl({ sort })}
      />

      {/* Active filters */}
      <SearchActiveFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
        pricingOptions={PRICING_OPTIONS}
        onClearCategory={() => updateUrl({ category: "all" })}
        onClearPricing={() => updateUrl({ pricing: "all" })}
        onClearAll={() => updateUrl({ category: "all", pricing: "all" })}
      />

      {/* Results header */}
      {!isLoading && (query || selectedCategory !== "all" || selectedPricing !== "all") && (
        <div className="mb-4">
          <p className="text-muted-foreground">
            {totalHits > 0 ? (
              <>
                Found <span className="font-medium text-foreground">{totalHits}</span> tool
                {totalHits !== 1 ? "s" : ""}
                {query && (
                  <>
                    {" "}for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
                  </>
                )}
              </>
            ) : (
              "No results found"
            )}
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <SearchLoadingSkeleton />
      ) : results.length > 0 ? (
        <>
          {/* Results grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <SearchResultCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-8 text-center">
              <LoadingButton
                onClick={handleLoadMore}
                isLoading={isLoadingMore}
                loadingText="Loading..."
                variant="secondary"
                size="lg"
              >
                Load more ({results.length} of {totalHits})
              </LoadingButton>
            </div>
          )}
        </>
      ) : (
        <SearchEmptyState
          query={query}
          hasFilters={selectedCategory !== "all"}
          categories={categories}
          onClearSearch={() => updateUrl({ q: "", category: "all", pricing: "all" })}
          onCategorySelect={(slug) => updateUrl({ category: slug })}
        />
      )}
    </div>
  );
}
