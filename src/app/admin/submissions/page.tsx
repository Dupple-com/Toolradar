import { prisma } from "@/lib/prisma";
import { SubmissionModeration } from "@/components/admin/submission-moderation";

// Force dynamic rendering - admin pages should never be static
export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "pending";

  const submissions = await prisma.submission.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: {
          name: true,
          domain: true,
          user: { select: { name: true, email: true } }
        }
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tool Submissions</h1>
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <a
              key={s}
              href={`/admin/submissions?status=${s}`}
              className={`px-4 py-2 rounded-lg text-sm ${
                status === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionModeration key={submission.id} submission={submission} />
        ))}
        {submissions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
            No {status} submissions found.
          </div>
        )}
      </div>
    </div>
  );
}
