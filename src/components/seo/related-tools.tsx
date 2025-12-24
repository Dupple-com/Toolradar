import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Star, ArrowRight } from "lucide-react";

interface RelatedTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string | null;
  pricing: string;
  editorialScore: number | null;
  communityScore: number | null;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function RelatedTools({
  tools,
  title = "Related Tools",
  showViewAll = false,
  viewAllHref,
  viewAllLabel = "View all",
}: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {showViewAll && viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {viewAllLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {tools.slice(0, 5).map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <ToolLogo
              src={tool.logo}
              name={tool.name}
              className="w-10 h-10 rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm group-hover:text-primary transition truncate">
                  {tool.name}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    tool.pricing === "free"
                      ? "bg-green-100 text-green-700"
                      : tool.pricing === "freemium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {tool.tagline}
              </p>
            </div>
            {(tool.editorialScore || tool.communityScore) && (
              <div className="flex items-center gap-1 text-sm flex-shrink-0">
                {tool.editorialScore ? (
                  <span className="font-semibold text-primary">{tool.editorialScore}</span>
                ) : tool.communityScore ? (
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{tool.communityScore.toFixed(1)}</span>
                  </span>
                ) : null}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

// Compact version for sidebars
export function RelatedToolsCompact({
  tools,
  title = "You might also like",
}: {
  tools: RelatedTool[];
  title?: string;
}) {
  if (tools.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-2">
        {tools.slice(0, 4).map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-2 text-sm hover:text-primary transition"
          >
            <ToolLogo
              src={tool.logo}
              name={tool.name}
              className="w-6 h-6 rounded"
            />
            <span className="truncate">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
