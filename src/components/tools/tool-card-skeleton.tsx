import { Skeleton } from "@/components/ui/skeleton";

interface ToolCardSkeletonProps {
  showVotes?: boolean;
}

export function ToolCardSkeleton({ showVotes = false }: ToolCardSkeletonProps) {
  return (
    <div className="block bg-card rounded-xl border p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {showVotes && (
          <Skeleton className="w-12 h-16 rounded-lg" />
        )}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ToolListSkeleton({ count = 10, showVotes = false }: { count?: number; showVotes?: boolean }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} showVotes={showVotes} />
      ))}
    </div>
  );
}
