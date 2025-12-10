import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { category?: string; pricing?: string; sort?: string; q?: string };
}) {
  const { category, pricing, sort, q } = searchParams;

  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      ...(pricing && { pricing }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: sort === "score" ? { editorialScore: "desc" } :
             sort === "reviews" ? { reviewCount: "desc" } :
             sort === "recent" ? { createdAt: "desc" } :
             { weeklyUpvotes: "desc" },
    take: 50,
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Tools</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-card rounded-xl border p-6 space-y-6 sticky top-24">
            <div>
              <h3 className="font-semibold mb-3">Search</h3>
              <form>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search tools..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </form>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Pricing</h3>
              <div className="space-y-2">
                {["all", "free", "freemium", "paid"].map((p) => (
                  <a
                    key={p}
                    href={`/tools${p === "all" ? "" : `?pricing=${p}`}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      (pricing || "all") === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: "trending", label: "Trending" },
                  { value: "score", label: "Highest Score" },
                  { value: "reviews", label: "Most Reviews" },
                  { value: "recent", label: "Recently Added" },
                ].map((s) => (
                  <a
                    key={s.value}
                    href={`/tools?sort=${s.value}${pricing ? `&pricing=${pricing}` : ""}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      (sort || "trending") === s.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Tools Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} showVotes />
            ))}
          </div>
          {tools.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No tools found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
