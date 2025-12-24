import Link from "next/link";
import { ArrowRight, Layers, Scale, TrendingUp, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ExploreSidebarProps {
  // Current context
  currentToolSlug?: string;
  currentToolName?: string;
  currentCategorySlug?: string;
  currentCategoryName?: string;

  // Related data
  categories?: Category[];
  relatedCategorySlugs?: string[];

  // Comparison suggestions
  comparisonSlugs?: string[];
}

export function ExploreSidebar({
  currentToolSlug,
  currentToolName,
  currentCategorySlug,
  currentCategoryName,
  categories = [],
  comparisonSlugs = [],
}: ExploreSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Quick Links for Tool Pages */}
      {currentToolSlug && currentToolName && (
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            Explore {currentToolName}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/tools/${currentToolSlug}`}
                className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
              >
                Overview & Reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href={`/tools/${currentToolSlug}/alternatives`}
                className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
              >
                Alternatives
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
            {comparisonSlugs.length > 0 && (
              <li>
                <Link
                  href={`/compare/${currentToolSlug}-vs-${comparisonSlugs[0]}`}
                  className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
                >
                  Compare with others
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Compare Section */}
      {comparisonSlugs.length > 1 && currentToolSlug && (
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            Popular Comparisons
          </h3>
          <ul className="space-y-2">
            {comparisonSlugs.slice(0, 3).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/compare/${currentToolSlug}-vs-${slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition block py-1"
                >
                  {currentToolName} vs {slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Links */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  category.slug === currentCategorySlug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:border-primary hover:text-primary"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <Link
            href="/categories"
            className="text-sm text-primary hover:underline mt-4 block"
          >
            View all categories
          </Link>
        </div>
      )}

      {/* Trending CTA */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Trending Now
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          See what tools are most popular this week
        </p>
        <Link
          href="/trending"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View trending <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Pricing Filter Links */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold mb-4">Browse by Pricing</h3>
        <div className="space-y-2">
          <Link
            href="/pricing/free"
            className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Free Tools
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing/freemium"
            className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Freemium Tools
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing/paid"
            className="flex items-center justify-between text-sm py-2 hover:text-primary transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Paid Tools
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
