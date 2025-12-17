"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string | null;
  pricing: string;
  editorialScore: number | null;
  communityScore: number | null;
  upvotes: number;
  categoryNames: string[];
  categorySlugs: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { tools: number };
}

const PRICING_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "score", label: "Highest Score" },
  { value: "trending", label: "Trending" },
  { value: "upvotes", label: "Most Upvotes" },
  { value: "recent", label: "Recently Added" },
];

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

  // Pricing badge colors
  const pricingColors: Record<string, string> = {
    free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    freemium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    paid: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Tools</h1>
        <p className="text-muted-foreground">
          Find the perfect tool for your needs
        </p>
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
      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b">
        {/* Category filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => updateUrl({ category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat._count.tools})
              </option>
            ))}
          </select>
        </div>

        {/* Pricing filter */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium mb-2">Price</label>
          <select
            value={selectedPricing}
            onChange={(e) => updateUrl({ pricing: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
          >
            {PRICING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium mb-2">Sort by</label>
          <select
            value={selectedSort}
            onChange={(e) => updateUrl({ sort: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== "all" || selectedPricing !== "all") && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => updateUrl({ category: "all" })}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
            >
              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {selectedPricing !== "all" && (
            <button
              onClick={() => updateUrl({ pricing: "all" })}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
            >
              {PRICING_OPTIONS.find((p) => p.value === selectedPricing)?.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => updateUrl({ category: "all", pricing: "all" })}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

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
                    {" "}
                    for "<span className="font-medium text-foreground">{query}</span>"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          {/* Results grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="block bg-card rounded-xl border p-6 hover:border-primary/50 hover:shadow-lg transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {tool.logo ? (
                      <Image
                        src={tool.logo}
                        alt={tool.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">
                        {tool.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition truncate">
                      {tool.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {tool.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col items-center px-3 py-2 bg-muted rounded-lg flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-semibold text-sm">{tool.upvotes}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${pricingColors[tool.pricing] || "bg-gray-100 text-gray-700"}`}>
                    {tool.pricing}
                  </span>
                  {tool.editorialScore && (
                    <span className="text-muted-foreground">
                      Score: <span className="text-foreground font-medium">{tool.editorialScore}/100</span>
                    </span>
                  )}
                  {tool.categoryNames?.length > 0 && (
                    <span className="text-muted-foreground text-xs">
                      {tool.categoryNames.slice(0, 2).join(" · ")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `Load more (${results.length} of ${totalHits})`
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {query ? (
            <>
              <h2 className="text-xl font-semibold mb-2">No tools found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any tools matching "{query}"
                {selectedCategory !== "all" && " in this category"}.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => updateUrl({ q: "", category: "all", pricing: "all" })}
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
                        onClick={() => updateUrl({ category: cat.slug })}
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
      )}
    </div>
  );
}
