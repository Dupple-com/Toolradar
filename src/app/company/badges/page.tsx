import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { redirect } from "next/navigation";

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
      badges: { include: { tool: true } },
    },
  });

  if (!company) {
    redirect("/company/setup");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Badges</h1>
      <p className="text-muted-foreground">
        Display these badges on your website to show your Toolradar recognition.
      </p>

      {company.badges.length > 0 ? (
        <div className="space-y-4">
          {company.badges.map((badge) => (
            <div key={badge.id} className="bg-card rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">{badge.tool.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{badge.type}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {badge.year}
                </span>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {`<script src="https://toolradar.com/badge/${badge.tool.slug}.js"></script>`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">
            No badges yet. Badges are awarded to top-rated and featured tools.
          </p>
        </div>
      )}
    </div>
  );
}
