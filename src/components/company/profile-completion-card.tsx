"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from "lucide-react";
import { CompletionCriteria } from "@/lib/profile-completion";

interface ProfileCompletionCardProps {
  toolId: string;
  toolName: string;
  score: number;
  criteria: CompletionCriteria[];
}

export function ProfileCompletionCard({
  toolId,
  toolName,
  score,
  criteria,
}: ProfileCompletionCardProps) {
  const [isExpanded, setIsExpanded] = useState(score < 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const incompleteCriteria = criteria.filter((c) => !c.completed);

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(score / 100) * 125.6} 125.6`}
                className={getScoreColor(score)}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          <div className="text-left">
            <p className="font-medium">{toolName}</p>
            <p className="text-sm text-muted-foreground">
              {score === 100 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Profile complete!
                </span>
              ) : (
                `${incompleteCriteria.length} items to complete`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {score < 100 && (
            <Link
              href={`/company/tools/${toolId}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Complete Profile
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t">
          {/* Progress Bar */}
          <div className="py-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(score)} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Criteria List */}
          <div className="grid grid-cols-2 gap-2">
            {criteria.map((item) => (
              <div
                key={item.name}
                className={`flex items-start gap-2 p-2 rounded-lg ${
                  item.completed ? "bg-green-50" : "bg-muted/50"
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-medium ${item.completed ? "text-green-700" : ""}`}>
                    {item.name}
                    <span className="text-xs text-muted-foreground ml-1">+{item.weight}%</span>
                  </p>
                  {!item.completed && (
                    <p className="text-xs text-muted-foreground">{item.tip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
