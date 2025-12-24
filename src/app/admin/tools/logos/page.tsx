import { prisma } from "@/lib/prisma";
import { LogoManager } from "@/components/admin/logo-manager";

// Force dynamic rendering - admin pages should never be static
export const dynamic = "force-dynamic";

export default async function AdminLogosPage() {
  const tools = await prisma.tool.findMany({
    orderBy: [
      { logo: "asc" }, // Tools without logos first (null comes first in asc)
      { name: "asc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      website: true,
      status: true,
    },
  });

  const missingCount = tools.filter((t) => !t.logo).length;
  const totalCount = tools.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logo Management</h1>
          <p className="text-muted-foreground mt-1">
            {missingCount} of {totalCount} tools are missing logos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Missing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Has logo</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-card rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Logo coverage</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((totalCount - missingCount) / totalCount) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${((totalCount - missingCount) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <LogoManager tools={tools} />
    </div>
  );
}
