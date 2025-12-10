import { searchTools } from "@/lib/meilisearch";
import { ToolCard } from "@/components/tools/tool-card";
import { SearchBar } from "@/components/search/search-bar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; pricing?: string };
}) {
  const { q = "", pricing } = searchParams;

  let tools: any[] = [];
  let totalHits = 0;

  if (q) {
    try {
      const filters = pricing ? `pricing = "${pricing}"` : undefined;
      const results = await searchTools(q, {
        filters: filters ? `${filters} AND status = "published"` : 'status = "published"',
        limit: 30,
      });
      tools = results.hits;
      totalHits = results.estimatedTotalHits || 0;
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Tools</h1>

      <SearchBar initialQuery={q} />

      {q && (
        <div className="mt-8">
          <p className="text-muted-foreground mb-6">
            {totalHits} results for &quot;{q}&quot;
          </p>

          <div className="flex gap-2 mb-6">
            {[
              { value: "", label: "All" },
              { value: "free", label: "Free" },
              { value: "freemium", label: "Freemium" },
              { value: "paid", label: "Paid" },
            ].map((option) => (
              <a
                key={option.value}
                href={`/search?q=${encodeURIComponent(q)}${option.value ? `&pricing=${option.value}` : ""}`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No tools found for &quot;{q}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
