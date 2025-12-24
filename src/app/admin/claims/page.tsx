import { prisma } from "@/lib/prisma";
import { ClaimModeration } from "@/components/admin/claim-moderation";

// Force dynamic rendering - admin pages should never be static
export const dynamic = "force-dynamic";

export default async function AdminClaimsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "pending";

  const claims = await prisma.claimRequest.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true, linkedinUrl: true } },
      company: { select: { name: true, domain: true, slug: true, logo: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Claims</h1>
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <a
              key={s}
              href={`/admin/claims?status=${s}`}
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
        {claims.map((claim) => (
          <ClaimModeration key={claim.id} claim={claim} />
        ))}
        {claims.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
            No {status} claims found.
          </div>
        )}
      </div>
    </div>
  );
}
