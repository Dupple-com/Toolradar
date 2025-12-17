import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section Skeleton */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Skeleton className="h-10 w-72 mb-4" />
            <Skeleton className="h-6 w-full max-w-xl mb-6" />
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          </div>
        </div>
      </section>

      {/* Popular Categories Skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 text-center">
              <Skeleton className="w-12 h-12 mx-auto mb-3 rounded-xl" />
              <Skeleton className="h-4 w-20 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* All Categories Skeleton */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-3" />
              </div>
              <div className="px-5 pb-4 border-t bg-gray-50/50">
                <Skeleton className="h-3 w-24 my-3" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-7 w-24 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
