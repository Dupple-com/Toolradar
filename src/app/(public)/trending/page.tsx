import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";

export default async function TrendingPage() {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    orderBy: { weeklyUpvotes: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🔥 Trending This Week</h1>
        <p className="text-muted-foreground mt-2">
          The most upvoted tools by the community this week.
        </p>
      </div>

      <div className="space-y-4">
        {tools.map((tool, index) => (
          <div key={tool.id} className="flex items-center gap-4">
            <span className={`text-2xl font-bold w-8 ${
              index < 3 ? "text-primary" : "text-muted-foreground"
            }`}>
              {index + 1}
            </span>
            <div className="flex-1">
              <ToolCard tool={tool} showVotes />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
