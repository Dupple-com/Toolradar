import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { redirect } from "next/navigation";
import { Award, Star, TrendingUp, Gem, CheckCircle, Flame } from "lucide-react";
import { BadgeCard } from "@/components/company/badge-card";

const badgeInfo: Record<string, { label: string; description: string; icon: typeof Award; color: string; bgColor: string }> = {
  "top-rated": {
    label: "Top Rated",
    description: "Awarded to tools with exceptional ratings",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-50 border-amber-200",
  },
  "rising-star": {
    label: "Rising Star",
    description: "Fast-growing tools gaining traction",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-50 border-purple-200",
  },
  "best-value": {
    label: "Best Value",
    description: "Great features at competitive pricing",
    icon: Gem,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  "editors-choice": {
    label: "Editor's Choice",
    description: "Hand-picked by our editorial team",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50 border-blue-200",
  },
  trending: {
    label: "Trending",
    description: "Currently popular in the community",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-50 border-red-200",
  },
  selected: {
    label: "Toolradar Selected",
    description: "Meets our quality standards",
    icon: Award,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 border-indigo-200",
  },
};

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeCompany = await getActiveCompany(user.id);

  if (!activeCompany?.verifiedAt) {
    redirect("/company/setup");
  }

  const company = await prisma.company.findUnique({
    where: { id: activeCompany.id },
    include: {
      badges: {
        include: { tool: true },
        orderBy: { createdAt: "desc" },
      },
      tools: {
        where: { status: "published" },
        select: { id: true, name: true, slug: true, editorialScore: true },
      },
    },
  });

  if (!company) {
    redirect("/company/setup");
  }

  // Group badges by tool
  const badgesByTool = company.badges.reduce((acc, badge) => {
    if (!acc[badge.toolId]) {
      acc[badge.toolId] = { tool: badge.tool, badges: [] };
    }
    acc[badge.toolId].badges.push(badge);
    return acc;
  }, {} as Record<string, { tool: typeof company.badges[0]["tool"]; badges: typeof company.badges }>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Badges & Awards</h1>
        <p className="text-muted-foreground">
          Showcase your achievements and build trust with visitors
        </p>
      </div>

      {/* Badge Types Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(badgeInfo).map(([type, info]) => {
          const Icon = info.icon;
          const hasBadge = company.badges.some((b) => b.type === type);
          return (
            <div
              key={type}
              className={`p-4 rounded-xl border ${
                hasBadge ? info.bgColor : "bg-muted/30 border-muted opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${hasBadge ? info.color : "text-muted-foreground"}`} />
                <div>
                  <p className={`font-medium text-sm ${hasBadge ? "" : "text-muted-foreground"}`}>
                    {info.label}
                  </p>
                  {hasBadge && (
                    <p className="text-xs text-green-600">Earned!</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earned Badges */}
      {Object.keys(badgesByTool).length > 0 ? (
        <div className="space-y-6">
          <h2 className="font-semibold">Your Badges</h2>
          {Object.values(badgesByTool).map(({ tool, badges }) => (
            <div key={tool.id} className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold mb-4">{tool.name}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {badges.map((badge) => {
                  const info = badgeInfo[badge.type] || badgeInfo.selected;
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={{
                        type: badge.type,
                        year: badge.year,
                        toolSlug: tool.slug,
                        toolName: tool.name,
                      }}
                      info={info}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border p-8 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No badges yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Badges are awarded to tools that achieve exceptional ratings, trending status, or are selected by our editorial team.
            Keep improving your tool&apos;s profile and gathering reviews!
          </p>
        </div>
      )}

      {/* How to Earn Badges */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
        <h3 className="font-semibold mb-4">How to Earn Badges</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium">Top Rated</p>
              <p className="text-muted-foreground">Maintain a score of 85+ with at least 10 reviews</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Rising Star</p>
              <p className="text-muted-foreground">Be among the fastest-growing tools this quarter</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Gem className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-medium">Best Value</p>
              <p className="text-muted-foreground">High ratings with competitive or free pricing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Editor&apos;s Choice</p>
              <p className="text-muted-foreground">Hand-selected by our editorial team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
