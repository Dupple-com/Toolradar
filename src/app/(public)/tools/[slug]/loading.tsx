import { Skeleton } from "@/components/ui/skeleton";

export default function ToolDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header skeleton */}
          <div className="flex items-start gap-6">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-full max-w-md" />
              <div className="flex gap-3 mt-4">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-10 rounded-lg" />
            </div>
          </div>

          {/* Description skeleton */}
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scores skeleton */}
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="h-5 w-16 mb-4" />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Info skeleton */}
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="h-5 w-12 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          </div>

          {/* Alternatives skeleton */}
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="h-5 w-24 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
