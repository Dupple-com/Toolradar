"use client";

import Link from "next/link";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from "lucide-react";

interface CategoryRanking {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  rank: number;
  totalInCategory: number;
}

interface CategoryRankingCardProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
  rankings: CategoryRanking[];
}

export function CategoryRankingCard({
  toolName,
  toolSlug,
  rankings,
}: CategoryRankingCardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <Trophy className="w-4 h-4 text-muted-foreground" />;
  };

  const getRankBadge = (rank: number, total: number) => {
    const percentile = ((total - rank + 1) / total) * 100;

    if (rank === 1) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          #1 in Category
        </span>
      );
    }
    if (rank <= 3) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Top 3
        </span>
      );
    }
    if (percentile >= 90) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Top 10%
        </span>
      );
    }
    if (percentile >= 75) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
          Top 25%
        </span>
      );
    }
    return null;
  };

  if (rankings.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="font-medium">{toolName}</h3>
        </div>
        <Link
          href={`/tools/${toolSlug}`}
          className="text-xs text-primary hover:underline"
        >
          View Page
        </Link>
      </div>

      <div className="space-y-2">
        {rankings.map((ranking) => (
          <Link
            key={ranking.categoryId}
            href={`/categories/${ranking.categorySlug}`}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              {getRankIcon(ranking.rank)}
              <span className="text-sm group-hover:text-primary transition-colors">
                {ranking.categoryName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getRankBadge(ranking.rank, ranking.totalInCategory)}
              <span className="text-sm font-medium">
                #{ranking.rank}
                <span className="text-muted-foreground font-normal">
                  /{ranking.totalInCategory}
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
