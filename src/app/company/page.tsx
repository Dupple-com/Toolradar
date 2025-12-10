import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/auth-utils";
import Link from "next/link";

export default async function CompanyDashboard() {
  const user = await requireCompany();

  const company = await prisma.company.findUnique({
    where: { userId: user.id },
    include: {
      tools: { select: { id: true } },
      badges: { select: { id: true } },
      submissions: { where: { status: "pending" }, select: { id: true } },
    },
  });

  if (!company) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Set Up Your Company Profile</h1>
        <p className="text-muted-foreground mb-6">
          Create your company profile to start submitting tools and tracking analytics.
        </p>
        <Link
          href="/company/setup"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Set Up Company
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-muted-foreground">{company.domain}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/company/tools" className="bg-card rounded-xl border p-6 hover:border-primary/50">
          <p className="text-muted-foreground text-sm">Listed Tools</p>
          <p className="text-3xl font-bold mt-1">{company.tools.length}</p>
        </Link>
        <Link href="/company/badges" className="bg-card rounded-xl border p-6 hover:border-primary/50">
          <p className="text-muted-foreground text-sm">Badges Earned</p>
          <p className="text-3xl font-bold mt-1">{company.badges.length}</p>
        </Link>
        <div className="bg-card rounded-xl border p-6">
          <p className="text-muted-foreground text-sm">Pending Submissions</p>
          <p className="text-3xl font-bold mt-1">{company.submissions.length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/company/submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Submit New Tool
          </Link>
          <Link
            href="/company/analytics"
            className="px-4 py-2 border rounded-lg hover:bg-muted"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
