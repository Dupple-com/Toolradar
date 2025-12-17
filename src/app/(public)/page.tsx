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
      {/* Hero Section */}
      <section className="relative py-24 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">The World's Largest Software Marketplace</span>
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
            Find the Best Software <br />
            <span className="text-blue-600">for Your Business</span>
          </h1>
          <p className="text-lg text-slate-500 mt-8 max-w-2xl mx-auto leading-relaxed">
            Join the community of professionals sharing real reviews to help you choose the right tools. Community-driven, verified insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/tools"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/20 transition-all duration-100"
            >
              Browse Software
            </Link>
            <Link
              href="/trending"
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold transition-all duration-100"
            >
              Trending Now
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-8 text-slate-400">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-slate-700">2,000+</span>
              <span className="text-xs uppercase tracking-widest font-medium mt-1">Tools</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-slate-700">10k+</span>
              <span className="text-xs uppercase tracking-widest font-medium mt-1">Reviews</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-slate-700">100%</span>
              <span className="text-xs uppercase tracking-widest font-medium mt-1">Verified</span>
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

        {/* CTA Section */}
        <section className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight tracking-tight">
              Ready to grow your business? <br />
              <span className="text-blue-400">List your tool today.</span>
            </h2>
            <p className="text-lg text-slate-300 mt-8 max-w-2xl mx-auto">
              Get in front of 5+ million professionals looking for the software you've built. Join Toolradar's marketplace.
            </p>
            <div className="mt-10">
              <Link
                href="/vendors"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-2xl shadow-blue-500/20 transition-all hover:-translate-y-1"
              >
                Get Started for Free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
