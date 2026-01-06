import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import { CompanySettingsForm } from "@/components/company/company-settings-form";

export default async function CompanyDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeCompany = await getActiveCompany(user.id);

  if (!activeCompany) {
    redirect("/company/setup");
  }

  if (!activeCompany.verifiedAt) {
    if (activeCompany.verificationToken) {
      redirect(`/company/verify?token=${activeCompany.verificationToken}`);
    }
    redirect("/company/setup");
  }

  const company = await prisma.company.findUnique({
    where: { id: activeCompany.id },
    select: {
      id: true,
      name: true,
      linkedinUrl: true,
      tools: { select: { id: true, name: true, slug: true, upvotes: true, reviewCount: true } },
      submissions: { where: { status: "pending" }, select: { id: true } },
      badges: { select: { id: true } },
    },
  });

  if (!company) {
    redirect("/company/setup");
  }

  const totalUpvotes = company.tools.reduce((sum, t) => sum + t.upvotes, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{company.name}</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tools", value: company.tools.length },
          { label: "Total Upvotes", value: totalUpvotes },
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
            <div
              key={tool.id}
              className="flex items-center justify-between bg-card rounded-xl border p-4"
            >
              <span className="font-medium">{tool.name}</span>
              <div className="flex items-center gap-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{tool.upvotes} upvotes</span>
                  <span>{tool.reviewCount} reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/company/tools/${tool.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <Link
                    href={`/tools/${tool.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {company.tools.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tools yet. <Link href="/company/submit" className="text-primary hover:underline">Submit your first tool</Link>
            </p>
          )}
        </div>
      </div>

      <CompanySettingsForm company={{ id: company.id, linkedinUrl: company.linkedinUrl }} />
    </div>
  );
}
