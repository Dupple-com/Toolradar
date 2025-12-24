"use client";

import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchActiveFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedPricing: string;
  pricingOptions: { value: string; label: string }[];
  onClearCategory: () => void;
  onClearPricing: () => void;
  onClearAll: () => void;
}

export function SearchActiveFilters({
  categories,
  selectedCategory,
  selectedPricing,
  pricingOptions,
  onClearCategory,
  onClearPricing,
  onClearAll,
}: SearchActiveFiltersProps) {
  const hasActiveFilters = selectedCategory !== "all" || selectedPricing !== "all";

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {selectedCategory !== "all" && (
        <button
          onClick={onClearCategory}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
        >
          {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
          <X className="w-4 h-4" />
        </button>
      )}
      {selectedPricing !== "all" && (
        <button
          onClick={onClearPricing}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
        >
          {pricingOptions.find((p) => p.value === selectedPricing)?.label}
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-foreground underline"
      >
        Clear all
      </button>
    </div>
  );
}
