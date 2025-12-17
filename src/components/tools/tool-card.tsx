import Link from "next/link";

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
    free: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    freemium: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    paid: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  };

  const pricing = pricingConfig[tool.pricing as keyof typeof pricingConfig] || pricingConfig.paid;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-200 group overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            {tool.logo ? (
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
                {tool.name[0]}
              </div>
            )}
            {rank && rank <= 3 && (
              <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"
              }`}>
                {rank}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
              {showVotes && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-600 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-8 8h5v8h6v-8h5z" />
                  </svg>
                  {tool.upvotes}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {tool.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${pricing.bg} ${pricing.text} ${pricing.border}`}>
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </span>
          {tool.communityScore && tool.communityScore > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-gray-700">{tool.communityScore.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">({tool.reviewCount})</span>
            </div>
          )}
        </div>
        {tool.editorialScore && (
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${tool.editorialScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">{tool.editorialScore}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
