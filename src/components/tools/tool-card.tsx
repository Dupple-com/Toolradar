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
}

export function ToolCard({ tool, showVotes = false }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-card rounded-xl border p-6 hover:border-primary/50 hover:shadow-lg transition group"
    >
      <div className="flex items-start gap-4">
        {tool.logo ? (
          <img src={tool.logo} alt={tool.name} className="w-14 h-14 rounded-xl" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
            {tool.name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-primary transition truncate">
            {tool.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {tool.tagline}
          </p>
        </div>
        {showVotes && (
          <div className="flex flex-col items-center px-3 py-2 bg-muted rounded-lg">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="font-semibold">{tool.upvotes}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
        <span className={`px-2 py-1 rounded text-xs ${
          tool.pricing === "free" ? "bg-green-100 text-green-700" :
          tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
          "bg-orange-100 text-orange-700"
        }`}>
          {tool.pricing}
        </span>
        {tool.editorialScore && (
          <span className="text-muted-foreground">
            Score: <span className="text-foreground font-medium">{tool.editorialScore}/100</span>
          </span>
        )}
        {tool.communityScore && tool.communityScore > 0 && (
          <span className="text-muted-foreground">
            <span className="text-yellow-500">★</span> {tool.communityScore.toFixed(1)} ({tool.reviewCount})
          </span>
        )}
      </div>
    </Link>
  );
}
