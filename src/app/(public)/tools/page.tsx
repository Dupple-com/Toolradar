import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { sort?: string; pricing?: string; category?: string };
}) {
  const { sort = "popular", pricing, category } = searchParams;

  const where: any = { status: "published" };
  if (pricing) where.pricing = pricing;

  const orderBy: any = 
    sort === "recent" ? { createdAt: "desc" } :
    sort === "rating" ? { communityScore: "desc" } :
    sort === "score" ? { editorialScore: "desc" } :
    { upvotes: "desc" };

  const tools = await prisma.tool.findMany({
    where,
    orderBy,
    take: 50,
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Tools</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2">
          {[
            { value: "popular", label: "Popular" },
            { value: "recent", label: "Recent" },
            { value: "rating", label: "Top Rated" },
            { value: "score", label: "Best Score" },
          ].map((option) => (
            <a
              key={option.value}
              href={`/tools?sort=${option.value}${pricing ? `&pricing=${pricing}` : ""}`}
              className={`px-4 py-2 rounded-lg text-sm ${
                sort === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { value: "", label: "All" },
            { value: "free", label: "Free" },
            { value: "freemium", label: "Freemium" },
            { value: "paid", label: "Paid" },
          ].map((option) => (
            <a
              key={option.value}
              href={`/tools?sort=${sort}${option.value ? `&pricing=${option.value}` : ""}`}
              className={`px-4 py-2 rounded-lg text-sm ${
                (pricing || "") === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tools found matching your criteria.
        </div>
      )}
    </div>
  );
}
