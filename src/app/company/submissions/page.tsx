import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default async function CompanySubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    redirect("/company/setup");
  }

  const submissions = await prisma.submission.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });

  const statusConfig = {
    pending: {
      label: "Pending Review",
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Submissions</h1>
          <p className="text-muted-foreground">Track the status of your tool submissions</p>
        </div>
        <Link
          href="/company/submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Submit New Tool
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven't submitted any tools yet.</p>
          <Link
            href="/company/submit"
            className="text-primary hover:underline"
          >
            Submit your first tool
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const data = submission.data as {
              name: string;
              website: string;
              tagline?: string;
              description?: string;
            };
            const config = statusConfig[submission.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <div
                key={submission.id}
                className={`bg-card rounded-xl border p-6 ${config.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{data.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </div>
                    {data.tagline && (
                      <p className="text-muted-foreground mb-2">{data.tagline}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <a
                        href={data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        {data.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>
                        Submitted {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {submission.feedback && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Feedback:</p>
                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-muted/50 rounded-xl">
        <p className="text-sm text-muted-foreground">
          <strong>Review Process:</strong> Our team reviews submissions within 48 hours.
          You'll receive a notification when your submission is approved or if we need more information.
        </p>
      </div>
    </div>
  );
}
