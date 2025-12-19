import Link from "next/link";
import { ToolLogo } from "./tool-logo";
import { ArrowUpRight, Star } from "lucide-react";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logo: string | null;
    pricing: string;
    editorialScore: number | null;
    communityScore: number | null;
    upvotes: number;
    reviewCount: number;
  };
  showVotes?: boolean;
  rank?: number;
}

export function ToolCard({ tool, showVotes = false, rank }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-150"
    >
      {/* Rank */}
      {rank && (
        <span className="text-sm font-medium text-slate-300 tabular-nums w-4 shrink-0 pt-1">
          {rank}
        </span>
      )}

      {/* Logo */}
      <ToolLogo
        src={tool.logo}
        name={tool.name}
        className="w-10 h-10 rounded-lg shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
            {tool.name}
          </h3>
          <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-400 shrink-0 mt-1 transition-colors" />
        </div>
        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
          {tool.tagline}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {tool.pricing}
          </span>
          {tool.communityScore !== null && tool.communityScore > 0 && (
            <>
              <span className="text-slate-200">·</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = tool.communityScore! >= star;
                    const partial = !filled && tool.communityScore! > star - 1;
                    const percentage = partial ? (tool.communityScore! - (star - 1)) * 100 : 0;
                    return (
                      <div key={star} className="relative w-3 h-3">
                        <Star size={12} className="text-slate-200" fill="currentColor" />
                        {(filled || partial) && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: filled ? '100%' : `${percentage}%` }}
                          >
                            <Star size={12} className="text-amber-400" fill="currentColor" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs text-slate-500">{tool.communityScore.toFixed(1)}</span>
              </div>
            </>
          )}
          {tool.reviewCount > 0 && (
            <>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-500">{tool.reviewCount} review{tool.reviewCount > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
