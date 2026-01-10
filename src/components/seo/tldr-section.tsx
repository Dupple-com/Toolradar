import { CheckCircle, XCircle, Zap, DollarSign, Users } from "lucide-react";

interface TLDRSectionProps {
  tool: {
    name: string;
    tagline: string;
    tldr?: string[];
    description: string;
    pricing: string;
    editorialScore?: number | null;
    communityScore?: number | null;
    reviewCount?: number;
  };
  category?: string;
  topPros?: string[];
  topCons?: string[];
}

export function TLDRSection({ tool, category, topPros = [], topCons = [] }: TLDRSectionProps) {
  const getPricingLabel = () => {
    switch (tool.pricing) {
      case "free": return "Free forever";
      case "freemium": return "Free plan available";
      case "paid": return "Paid only";
      default: return tool.pricing;
    }
  };

  // Use tldr field if available, otherwise fallback to extracting from description
  const getKeyPoints = () => {
    if (tool.tldr && tool.tldr.length > 0) {
      return tool.tldr.slice(0, 3);
    }
    // Fallback: extract from description
    const sentences = tool.description.split(/[.!]/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3).map(s => s.trim());
  };

  const keyPoints = getKeyPoints();

  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg">TL;DR - {tool.name}</h2>
      </div>

      <ul className="text-muted-foreground space-y-2 mb-4">
        {keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {/* Pricing */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span><strong>Pricing:</strong> {getPricingLabel()}</span>
        </div>

        {/* Best For */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span><strong>Best for:</strong> {
            tool.pricing === "free" ? "Individuals & startups" :
            tool.pricing === "freemium" ? "Growing teams" :
            "Enterprises & professionals"
          }</span>
        </div>

        {/* Score */}
        {(tool.editorialScore ?? 0) > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span><strong>Score:</strong> {tool.editorialScore}/100</span>
          </div>
        )}
      </div>

      {/* Quick Pros/Cons */}
      {(topPros.length > 0 || topCons.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/20">
          {topPros.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Top Pros
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {topPros.slice(0, 3).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {topCons.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Top Cons
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {topCons.slice(0, 3).map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
