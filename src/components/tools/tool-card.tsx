import Link from "next/link";
import { ToolLogo } from "./tool-logo";
import { Star, ChevronUp } from "lucide-react";

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
  const pricingConfig = {
    free: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    freemium: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    paid: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  };

  const pricing = pricingConfig[tool.pricing as keyof typeof pricingConfig] || pricingConfig.paid;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-100 group"
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Rank Badge - Subtler */}
          {rank && (
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-slate-400 border border-slate-100 rounded bg-slate-50">
              {rank}
            </div>
          )}

          {/* Logo */}
          <div className="flex-shrink-0">
            <ToolLogo
              src={tool.logo}
              name={tool.name}
              className="w-11 h-11 rounded-lg border border-slate-100"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {tool.name}
              </h3>
              {showVotes && (
                <div className="flex items-center gap-0.5 text-xs font-bold text-slate-500">
                  <ChevronUp size={14} className="text-blue-600" />
                  {tool.upvotes}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {tool.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Professional Stats */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${pricing.bg} ${pricing.text} ${pricing.border}`}>
            {tool.pricing}
          </span>
          {tool.communityScore && tool.communityScore > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{tool.communityScore.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({tool.reviewCount})</span>
            </div>
          )}
        </div>
        {tool.editorialScore && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Score</span>
            <span className="text-xs font-bold text-blue-600">{tool.editorialScore}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
