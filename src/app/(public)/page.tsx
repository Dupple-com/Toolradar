import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Trophy, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

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
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link
              href="/tools"
              className="group px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all duration-150 flex items-center justify-center gap-2"
            >
              Browse Software
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/trending"
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-medium transition-all duration-150"
            >
              View Trending
            </Link>
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
        {/* Tool of the Day */}
        {toolOfTheDay && (
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 text-amber-600">
                <Trophy size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Tool of the Day</h2>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Editor's Choice</p>
              </div>
            </div>

            <Link href={`/tools/${toolOfTheDay.slug}`} className="group block">
              <div className="relative bg-white border border-slate-200 rounded-2xl p-10 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <span className="px-4 py-1 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest rounded-full border border-blue-100">Featured</span>
                </div>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <ToolLogo
                    src={toolOfTheDay.logo}
                    name={toolOfTheDay.name}
                    className="w-28 h-28 rounded-2xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {toolOfTheDay.name}
                    </h3>
                    <p className="text-xl text-slate-500 mt-4 leading-relaxed">{toolOfTheDay.tagline}</p>
                    <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-slate-900">{toolOfTheDay.communityScore?.toFixed(1) || '4.8'}</span>
                        <div className="flex flex-col">
                          <div className="flex text-amber-400 text-xs">★★★★★</div>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">User Rating</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-blue-600">{toolOfTheDay.editorialScore || '94'}/100</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center">Score</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Check it out <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Trending Section */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 text-blue-600">
                  <TrendingUp size={16} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Trending Software</h2>
              </div>
              <p className="text-slate-500 text-sm">Top performing tools this week based on community engagement</p>
            </div>
            <Link href="/trending" className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors">
              See all trending <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Recently Added */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 text-emerald-600">
                  <Sparkles size={16} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Recently Added</h2>
              </div>
              <p className="text-slate-500 text-sm">Newly listed tools curated by our editorial team</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-600 transition-colors">
              Explore all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all"
              >
                List your product <ArrowRight size={16} />
              </Link>
              <Link
                href="/company"
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
