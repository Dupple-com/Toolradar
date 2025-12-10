import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/auth-utils";

export default async function CompanyBadgesPage() {
  const user = await requireCompany();

  const company = await prisma.company.findUnique({
    where: { userId: user.id },
    include: {
      badges: { include: { tool: { select: { name: true, slug: true } } } },
    },
  });

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Badges</h1>

      {company.badges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.badges.map((badge) => (
            <div key={badge.id} className="bg-card rounded-xl border p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">
                  {badge.type === "selected" ? "🏅" :
                   badge.type === "top-rated" ? "⭐" :
                   badge.type === "trending" ? "🔥" : "🏆"}
                </span>
                <div>
                  <p className="font-semibold">
                    {badge.type === "selected" ? "Toolradar Selected" :
                     badge.type === "top-rated" ? "Top Rated" :
                     badge.type === "trending" ? "Trending" : "Tool of the Day"}
                  </p>
                  <p className="text-sm text-muted-foreground">{badge.tool.name}</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Embed Code:</p>
                <code className="text-xs break-all">
                  {`<script src="https://toolradar.com/badge/${badge.tool.slug}.js"></script>`}
                </code>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">
            No badges yet. Get your tools rated to earn badges!
          </p>
        </div>
      )}
    </div>
  );
}
