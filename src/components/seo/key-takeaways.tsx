import { Lightbulb, Trophy, DollarSign, Star } from "lucide-react";

interface KeyTakeawaysProps {
  category: string;
  topTool: {
    name: string;
    editorialScore?: number | null;
  };
  totalTools: number;
  freeToolsCount: number;
  avgScore?: number;
}

export function KeyTakeaways({ category, topTool, totalTools, freeToolsCount, avgScore }: KeyTakeawaysProps) {
  const year = new Date().getFullYear();

  return (
    <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h2 className="font-bold text-lg text-yellow-900">Key Takeaways</h2>
      </div>

      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <Trophy className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{topTool.name}</strong> is our #1 pick for {category.toLowerCase()} in {year}
            {topTool.editorialScore && `, scoring ${topTool.editorialScore}/100`}.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <span>
            We analyzed <strong>{totalTools} {category.toLowerCase()} tools</strong> to create this ranking.
          </span>
        </li>

        {freeToolsCount > 0 && (
          <li className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>{freeToolsCount} tools</strong> offer free plans, perfect for getting started.
            </span>
          </li>
        )}

        {avgScore != null && avgScore > 0 && (
          <li className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>
              Average editorial score: <strong>{avgScore.toFixed(0)}/100</strong> - high-quality category.
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
