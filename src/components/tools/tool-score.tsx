interface ToolScoreProps {
  editorialScore: number | null;
  communityScore: number | null;
  reviewCount: number;
}

export function ToolScore({ editorialScore, communityScore, reviewCount }: ToolScoreProps) {
  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <h3 className="font-semibold">Scores</h3>
      
      {editorialScore && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Editorial Score</span>
            <span className="font-bold text-lg">{editorialScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${editorialScore}%` }}
            />
          </div>
        </div>
      )}

      {communityScore !== null && communityScore > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Community Rating</span>
            <span className="font-bold text-lg flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {communityScore.toFixed(1)}/5
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Based on {reviewCount} reviews</p>
        </div>
      )}

      {!editorialScore && (!communityScore || communityScore === 0) && (
        <p className="text-muted-foreground text-sm">No scores yet</p>
      )}
    </div>
  );
}
