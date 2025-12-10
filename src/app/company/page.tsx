import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";

export default async function CompanyDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const company = await prisma.company.findUnique({
    where: { userId: user.id },
    include: {
      tools: { select: { id: true, name: true, slug: true, upvotes: true, reviewCount: true } },
      submissions: { where: { status: "pending" } },
      badges: true,
    },
  });

  if (!company) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border">
        <h1 className="text-2xl font-bold mb-4">Set Up Your Company Profile</h1>
        <p className="text-muted-foreground mb-6">
          Create a company profile to submit tools and access analytics.
        </p>
        <Link
          href="/company/setup"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const totalViews = company.tools.reduce((sum, t) => sum + t.upvotes, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{company.name}</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tools", value: company.tools.length },
          { label: "Total Upvotes", value: totalViews },
          { label: "Badges", value: company.badges.length },
          { label: "Pending Submissions", value: company.submissions.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border p-6">
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold mb-4">Your Tools</h2>
        <div className="space-y-3">
          {company.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="flex items-center justify-between bg-card rounded-xl border p-4 hover:border-primary transition"
            >
              <span className="font-medium">{tool.name}</span>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{tool.upvotes} upvotes</span>
                <span>{tool.reviewCount} reviews</span>
              </div>
            </Link>
          ))}
          {company.tools.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tools yet. <Link href="/company/submit" className="text-primary hover:underline">Submit your first tool</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
