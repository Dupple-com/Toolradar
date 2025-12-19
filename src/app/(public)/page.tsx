import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Trophy, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/search/hero-search";

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
      include: {
        _count: { select: { reviews: true } }
      }
    }),
    prisma.tool.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        _count: { select: { reviews: true } }
      }
    }),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Linear style */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 font-medium text-sm">Software Discovery Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 tracking-[-0.02em] leading-[1.05]">
            Find the best tools
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">for your stack</span>
          </h1>
          <p className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
            Real reviews from professionals. Community-driven insights to help you make the right choice.
          </p>

          <div className="mt-10">
            <HeroSearch />
          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-slate-400">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-slate-900 tabular-nums">2,000+</span>
              <span className="text-xs uppercase tracking-wider font-medium mt-1 text-slate-400">Tools</span>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-slate-900 tabular-nums">10k+</span>
              <span className="text-xs uppercase tracking-wider font-medium mt-1 text-slate-400">Reviews</span>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-slate-900 tabular-nums">100%</span>
              <span className="text-xs uppercase tracking-wider font-medium mt-1 text-slate-400">Verified</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Tool of the Day - Linear style */}
        {toolOfTheDay && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={18} className="text-amber-500" />
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Featured Today</h2>
            </div>

            <Link href={`/tools/${toolOfTheDay.slug}`} className="group block">
              <div className="relative bg-gradient-to-br from-slate-50/80 to-white border border-slate-200 rounded-xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <ToolLogo
                    src={toolOfTheDay.logo}
                    name={toolOfTheDay.name}
                    className="w-20 h-20 rounded-xl border border-slate-200 shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                          {toolOfTheDay.name}
                        </h3>
                        <p className="text-slate-500 mt-2 leading-relaxed max-w-xl">{toolOfTheDay.tagline}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span className="text-sm font-medium">View</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    {toolOfTheDay.communityScore !== null && toolOfTheDay.communityScore > 0 && (
                      <div className="flex items-center gap-2 mt-6">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-semibold text-slate-900">{toolOfTheDay.communityScore.toFixed(1)}</span>
                        </div>
                        <span className="text-slate-400 text-sm">rating</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Trending Section - Linear style */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Trending this week</h2>
            </div>
            <Link href="/trending" className="group flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
              View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={{
                  ...tool,
                  reviewCount: tool._count.reviews
                }}
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        {/* Recently Added - Linear style */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-slate-400" />
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Recently added</h2>
            </div>
            <Link href="/tools" className="group flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
              Browse all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  ...tool,
                  reviewCount: tool._count.reviews
                }}
              />
            ))}
          </div>
        </section>

        {/* CTA Section - Linear style */}
        <section className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-4">For Vendors</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight tracking-tight">
              Get your product discovered
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-xl mx-auto">
              Join thousands of companies reaching millions of professionals on Toolradar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/company/submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all"
              >
                List your product <ArrowRight size={16} />
              </Link>
              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
