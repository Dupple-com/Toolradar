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

const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  freemium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

interface SearchResultCardProps {
  tool: SearchResult;
}

export function SearchResultCard({ tool }: SearchResultCardProps) {
  return (
    <Link
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
  );
}

export type { SearchResult };
