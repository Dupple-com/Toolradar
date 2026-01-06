import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BarChart3, Eye, MousePointer, GitCompare, Search, TrendingUp } from "lucide-react";

export default async function CompanyAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    redirect("/company/setup");
  }

  // Get tools with analytics and search terms
  const tools = await prisma.tool.findMany({
    where: { companyId: company.id },
    include: {
      analytics: {
        orderBy: { date: "desc" },
        take: 30,
      },
      searchTerms: {
        orderBy: { count: "desc" },
        take: 10,
      },
    },
  });

  // Aggregate all search terms across tools
  const allSearchTerms = tools
    .flatMap((t) => t.searchTerms || [])
    .reduce((acc, term) => {
      const existing = acc.find((t) => t.term === term.term);
      if (existing) {
        existing.count += term.count;
      } else {
        acc.push({ term: term.term, count: term.count });
      }
      return acc;
    }, [] as { term: string; count: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate totals
  const totals = tools.reduce(
    (acc, tool) => {
      const toolTotals = tool.analytics.reduce(
        (tAcc, a) => ({
          views: tAcc.views + a.views,
          uniqueViews: tAcc.uniqueViews + a.uniqueViews,
          clicks: tAcc.clicks + a.clicks,
          comparisons: tAcc.comparisons + a.comparisons,
          searchAppears: tAcc.searchAppears + a.searchAppears,
        }),
        { views: 0, uniqueViews: 0, clicks: 0, comparisons: 0, searchAppears: 0 }
      );
      return {
        views: acc.views + toolTotals.views,
        uniqueViews: acc.uniqueViews + toolTotals.uniqueViews,
        clicks: acc.clicks + toolTotals.clicks,
        comparisons: acc.comparisons + toolTotals.comparisons,
        searchAppears: acc.searchAppears + toolTotals.searchAppears,
      };
    },
    { views: 0, uniqueViews: 0, clicks: 0, comparisons: 0, searchAppears: 0 }
  );

  const stats = [
    { label: "Total Views", value: totals.views, icon: Eye, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Unique Visitors", value: totals.uniqueViews, icon: Eye, color: "text-green-500", bg: "bg-green-100" },
    { label: "Website Clicks", value: totals.clicks, icon: MousePointer, color: "text-purple-500", bg: "bg-purple-100" },
    { label: "Comparisons", value: totals.comparisons, icon: GitCompare, color: "text-orange-500", bg: "bg-orange-100" },
    { label: "Search Appearances", value: totals.searchAppears, icon: Search, color: "text-cyan-500", bg: "bg-cyan-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track performance across all your tools (last 30 days)</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border p-4">
            <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Per-Tool Analytics */}
      <div>
        <h2 className="font-semibold mb-4">Analytics by Tool</h2>
        {tools.length === 0 ? (
          <div className="bg-card rounded-xl border p-8 text-center text-muted-foreground">
            No tools yet. Submit a tool to start tracking analytics.
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-medium">Tool</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Views</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Unique</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Clicks</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Comparisons</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => {
                  const toolTotals = tool.analytics.reduce(
                    (acc, a) => ({
                      views: acc.views + a.views,
                      uniqueViews: acc.uniqueViews + a.uniqueViews,
                      clicks: acc.clicks + a.clicks,
                      comparisons: acc.comparisons + a.comparisons,
                    }),
                    { views: 0, uniqueViews: 0, clicks: 0, comparisons: 0 }
                  );
                  return (
                    <tr key={tool.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{tool.name}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {toolTotals.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {toolTotals.uniqueViews.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {toolTotals.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {toolTotals.comparisons.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Search Terms */}
      {allSearchTerms.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            Top Search Keywords
          </h2>
          <div className="bg-card rounded-xl border p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Keywords that led users to your tools
            </p>
            <div className="flex flex-wrap gap-2">
              {allSearchTerms.map((term) => (
                <div
                  key={term.term}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-900">{term.term}</span>
                  <span className="text-xs text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded">
                    {term.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
        <BarChart3 className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Analytics are updated daily</p>
          <p>Data shown is from the last 30 days. More detailed analytics coming soon.</p>
        </div>
      </div>
    </div>
  );
}
