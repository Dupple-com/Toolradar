import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slugs: string } }) {
  const slugs = params.slugs.split("-vs-");
  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs } },
    select: { name: true },
  });
  const names = tools.map((t) => t.name).join(" vs ");
  return {
    title: `${names} Comparison - Toolradar`,
    description: `Compare ${names} - features, pricing, and reviews side by side.`,
  };
}

export default async function CompareResultPage({
  params,
}: {
  params: { slugs: string };
}) {
  const slugs = params.slugs.split("-vs-");
  
  if (slugs.length < 2 || slugs.length > 4) {
    notFound();
  }

  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs }, status: "published" },
    include: {
      reviews: { where: { status: "approved" }, take: 1 },
      _count: { select: { reviews: true } },
    },
  });

  if (tools.length < 2) {
    notFound();
  }

  // Sort tools in the same order as slugs
  const sortedTools = slugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as typeof tools;

  const features = [
    { key: "pricing", label: "Pricing" },
    { key: "editorialScore", label: "Editorial Score" },
    { key: "communityScore", label: "Community Score" },
    { key: "reviewCount", label: "Reviews" },
    { key: "upvotes", label: "Upvotes" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {sortedTools.map((t) => t.name).join(" vs ")}
      </h1>

      {/* Tools Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${sortedTools.length}, 1fr)` }}>
        {sortedTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="bg-card rounded-xl border p-6 text-center hover:border-primary transition"
          >
            {tool.logo ? (
              <img src={tool.logo} alt="" className="w-16 h-16 rounded-xl mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                {tool.name[0]}
              </div>
            )}
            <h2 className="font-bold text-lg">{tool.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{tool.tagline}</p>
          </Link>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-8 bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-6 py-4 font-medium">Feature</th>
              {sortedTools.map((tool) => (
                <th key={tool.id} className="text-center px-6 py-4 font-medium">
                  {tool.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-6 py-4 font-medium">Pricing</td>
              {sortedTools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
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
              <td className="px-6 py-4 font-medium">Editorial Score</td>
              {sortedTools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 text-center">
                  {tool.editorialScore ? (
                    <span className="text-lg font-bold text-primary">{tool.editorialScore}/100</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Community Score</td>
              {sortedTools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 text-center">
                  {tool.communityScore && tool.communityScore > 0 ? (
                    <span>
                      <span className="text-yellow-500">★</span> {tool.communityScore.toFixed(1)}/5
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Reviews</td>
              {sortedTools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 text-center">
                  {tool._count.reviews}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Upvotes</td>
              {sortedTools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 text-center font-bold">
                  {tool.upvotes}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <div className="mt-8 bg-primary/5 rounded-xl border border-primary/20 p-6">
        <h3 className="font-bold text-lg mb-2">Our Take</h3>
        <p className="text-muted-foreground">
          Based on editorial scores and community feedback, 
          <strong className="text-foreground">
            {" "}{sortedTools.reduce((best, tool) => 
              (tool.editorialScore || 0) > (best.editorialScore || 0) ? tool : best
            ).name}
          </strong>
          {" "}leads in our rating. However, the best choice depends on your specific needs.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex gap-4 justify-center">
        {sortedTools.map((tool) => (
          <a
            key={tool.id}
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border rounded-lg hover:bg-muted transition"
          >
            Visit {tool.name} →
          </a>
        ))}
      </div>
    </div>
  );
}
