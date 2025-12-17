import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import Link from "next/link";

export default async function HomePage() {
  const [toolOfTheDay, trendingTools, recentTools] = await Promise.all([
    prisma.tool.findFirst({
      where: {
        status: "published",
        toolOfTheDay: { not: null },
      },
      orderBy: { toolOfTheDay: "desc" },
    }),
    prisma.tool.findMany({
      where: { status: "published" },
      orderBy: { weeklyUpvotes: "desc" },
      take: 6,
    }),
    prisma.tool.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Discover the best <span className="text-primary">tools</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto px-4">
          Community-driven ratings and reviews to help you find the right tools for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 md:mt-8 px-4">
          <Link
            href="/tools"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            Browse Tools
          </Link>
          <Link
            href="/trending"
            className="px-6 py-3 border rounded-lg hover:bg-muted font-medium"
          >
            Trending Now
          </Link>
        </div>
      </section>

      {/* Tool of the Day */}
      {toolOfTheDay && (
        <section className="py-8 md:py-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <span className="text-xl md:text-2xl">🏆</span>
            <h2 className="text-xl md:text-2xl font-bold">Tool of the Day</h2>
          </div>
          <Link
            href={`/tools/${toolOfTheDay.slug}`}
            className="block bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 sm:p-6 md:p-8 border border-primary/20 hover:border-primary/40 transition"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {toolOfTheDay.logo ? (
                <img src={toolOfTheDay.logo} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary flex-shrink-0">
                  {toolOfTheDay.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold">{toolOfTheDay.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2">{toolOfTheDay.tagline}</p>
                {toolOfTheDay.editorialScore && (
                  <p className="mt-2 text-sm">
                    Editorial Score: <span className="font-bold text-primary">{toolOfTheDay.editorialScore}/100</span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Trending */}
      <section className="py-8 md:py-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">🔥 Trending This Week</h2>
          <Link href="/trending" className="text-primary hover:underline text-sm md:text-base">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {trendingTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} showVotes rank={index + 1} />
          ))}
        </div>
      </section>

      {/* Recent */}
      <section className="py-8 md:py-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">🆕 Recently Added</h2>
          <Link href="/tools?sort=recent" className="text-primary hover:underline text-sm md:text-base">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
