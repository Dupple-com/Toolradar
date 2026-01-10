"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Star, Filter, X, Gift, Sparkles, Crown } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tagline: string;
  editorialScore: number | null;
  categories: { category: { name: string; slug: string } }[];
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface PricingToolsPageProps {
  title: string;
  description: string;
  tools: Tool[];
  categories: Category[];
  iconType: "free" | "freemium" | "paid";
  iconBgClass: string;
  iconTextClass: string;
  gradientClass: string;
  badgeText: string;
  pricing: string;
  filterBgClass: string;
  filterActiveClass: string;
}

const icons = {
  free: Gift,
  freemium: Sparkles,
  paid: Crown,
};

export function PricingToolsPage({
  title,
  description,
  tools,
  categories,
  iconType,
  iconBgClass,
  iconTextClass,
  gradientClass,
  badgeText,
  pricing,
  filterBgClass,
  filterActiveClass,
}: PricingToolsPageProps) {
  const Icon = icons[iconType];
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category");

  const filteredTools = selectedCategory
    ? tools.filter((tool) =>
        tool.categories.some((c) => c.category.slug === selectedCategory)
      )
    : tools;

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      router.push(`/tools/${pricing}?category=${slug}`, { scroll: false });
    } else {
      router.push(`/tools/${pricing}`, { scroll: false });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradientClass} to-background`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 ${iconBgClass} ${iconTextClass} px-4 py-2 rounded-full mb-4`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{badgeText}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <p className="text-muted-foreground mt-2">
            {filteredTools.length} tools available
            {selectedCategory && ` in selected category`}
          </p>
        </header>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                !selectedCategory
                  ? filterActiveClass
                  : `${filterBgClass} hover:opacity-80`
              }`}
            >
              All ({tools.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedCategory === cat.slug
                    ? filterActiveClass
                    : `${filterBgClass} hover:opacity-80`
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryClick(null)}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="bg-card rounded-xl border p-5 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-3">
                <ToolLogo src={tool.logo} name={tool.name} className="w-10 h-10 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold group-hover:text-primary transition truncate">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.tagline}
                  </p>
                  {tool.categories[0] && (
                    <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                      {tool.categories[0].category.name}
                    </span>
                  )}
                </div>
                {(tool.editorialScore ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{tool.editorialScore}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found in this category.</p>
            <button
              onClick={() => handleCategoryClick(null)}
              className="mt-2 text-primary hover:underline"
            >
              Show all tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
