export function SearchLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted" />
            <div className="flex-1">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
