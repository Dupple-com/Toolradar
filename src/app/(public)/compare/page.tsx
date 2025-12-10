import { prisma } from "@/lib/prisma";
import { CompareSelector } from "@/components/compare/compare-selector";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { tools?: string };
}) {
  const selectedSlugs = searchParams.tools?.split(",").filter(Boolean) || [];

  const allTools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { id: true, name: true, slug: true, logo: true },
    orderBy: { name: "asc" },
  });

  const selectedTools = selectedSlugs.length > 0
    ? await prisma.tool.findMany({
        where: { slug: { in: selectedSlugs }, status: "published" },
        include: { categories: { include: { category: true } } },
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Compare Tools</h1>

      <CompareSelector tools={allTools} selected={selectedSlugs} />

      {selectedTools.length >= 2 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b bg-muted/50"></th>
                {selectedTools.map((tool) => (
                  <th key={tool.id} className="p-4 border-b bg-muted/50 min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      {tool.logo ? (
                        <img src={tool.logo} alt="" className="w-12 h-12 rounded" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center font-bold">
                          {tool.name[0]}
                        </div>
                      )}
                      <span className="font-semibold">{tool.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-medium">Tagline</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center text-sm">
                    {tool.tagline}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Pricing</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                      tool.pricing === "free" ? "bg-green-100 text-green-700" :
                      tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {tool.pricing}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Editorial Score</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center font-bold">
                    {tool.editorialScore ? `${tool.editorialScore}/100` : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Community Rating</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    {tool.communityScore ? (
                      <span>
                        <span className="text-yellow-500">★</span> {tool.communityScore.toFixed(1)}
                      </span>
                    ) : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Upvotes</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center font-bold text-primary">
                    {tool.upvotes}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Categories</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {tool.categories.map((ct) => (
                        <span key={ct.category.id} className="text-xs bg-muted px-2 py-1 rounded">
                          {ct.category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Website</td>
                {selectedTools.map((tool) => (
                  <td key={tool.id} className="p-4 text-center">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Visit →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedTools.length < 2 && selectedSlugs.length > 0 && (
        <p className="text-center py-8 text-muted-foreground">
          Select at least 2 tools to compare
        </p>
      )}
    </div>
  );
}
