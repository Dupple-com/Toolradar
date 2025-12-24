"use client";

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

interface SearchFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedPricing: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onPricingChange: (pricing: string) => void;
  onSortChange: (sort: string) => void;
}

export function SearchFilters({
  categories,
  selectedCategory,
  selectedPricing,
  selectedSort,
  onCategoryChange,
  onPricingChange,
  onSortChange,
}: SearchFiltersProps) {
  const selectClassName =
    "w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none";

  return (
    <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b">
      {/* Category filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClassName}
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
          onChange={(e) => onPricingChange(e.target.value)}
          className={selectClassName}
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
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClassName}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { PRICING_OPTIONS, SORT_OPTIONS };
export type { Category };
