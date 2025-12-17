import { Skeleton } from "@/components/ui/skeleton";
import { ToolCardSkeleton } from "@/components/tools/tool-card-skeleton";

export default function ToolsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Skeleton className="h-9 w-48 mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters skeleton */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-card rounded-xl border p-6 space-y-6">
            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Tools grid skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ToolCardSkeleton key={i} showVotes />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
