import { prisma } from "@/lib/prisma";
import { TotdSelector } from "@/components/admin/totd-selector";

// Force dynamic rendering - admin pages should never be static
export const dynamic = "force-dynamic";

export default async function ToolOfTheDayPage() {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      logo: true,
      toolOfTheDay: true,
    },
  });

  const currentTotd = tools.find(
    (t) =>
      t.toolOfTheDay &&
      new Date(t.toolOfTheDay).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tool of the Day</h1>

      {currentTotd && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <p className="text-sm text-primary mb-2">Today&apos;s Tool of the Day</p>
          <div className="flex items-center gap-4">
            {currentTotd.logo && (
              <img src={currentTotd.logo} alt={`${currentTotd.name} logo`} className="w-12 h-12 rounded" />
            )}
            <div>
              <p className="font-semibold text-lg">{currentTotd.name}</p>
              <p className="text-muted-foreground">{currentTotd.tagline}</p>
            </div>
          </div>
        </div>
      )}

      <TotdSelector tools={tools} currentTotdId={currentTotd?.id} />
    </div>
  );
}
