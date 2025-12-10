import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slugs: string } }) {
  const slugsArray = params.slugs.split("-vs-");
  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugsArray } },
    select: { name: true },
  });
  const names = tools.map((t) => t.name).join(" vs ");
  return {
    title: `${names} Comparison - Toolradar`,
    description: `Compare ${names}. See features, pricing, and ratings side by side.`,
  };
}

export default async function CompareDetailPage({ params }: { params: { slugs: string } }) {
  const slugsArray = params.slugs.split("-vs-");

  if (slugsArray.length < 2) notFound();

  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugsArray }, status: "published" },
    include: {
      categories: { include: { category: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (tools.length < 2) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">
        {tools.map((t) => t.name).join(" vs ")}
      </h1>
      <p className="text-muted-foreground mb-8">
        Detailed comparison of {tools.map((t) => t.name).join(" and ")}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-card rounded-xl border">
          <thead>
            <tr>
              <th className="text-left p-4 border-b bg-muted/50"></th>
              {tools.map((tool) => (
                <th key={tool.id} className="p-4 border-b bg-muted/50 min-w-[250px]">
                  <Link href={`/tools/${tool.slug}`} className="flex flex-col items-center gap-2 hover:text-primary">
                    {tool.logo ? (
                      <img src={tool.logo} alt="" className="w-16 h-16 rounded-xl" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold">
                        {tool.name[0]}
                      </div>
                    )}
                    <span className="font-semibold text-lg">{tool.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b font-medium">Description</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b text-sm">{tool.tagline}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Pricing Model</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b text-center">
                  <span className={`px-3 py-1 rounded text-sm ${
                    tool.pricing === "free" ? "bg-green-100 text-green-700" :
                    tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Toolradar Score</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b text-center">
                  <span className="text-2xl font-bold text-primary">
                    {tool.editorialScore || "-"}
                  </span>
                  {tool.editorialScore && <span className="text-muted-foreground">/100</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">User Rating</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b text-center">
                  {tool.communityScore ? (
                    <>
                      <span className="text-yellow-500 text-xl">★</span>
                      <span className="text-xl font-bold ml-1">{tool.communityScore.toFixed(1)}</span>
                      <p className="text-xs text-muted-foreground">{tool._count.reviews} reviews</p>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No reviews</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Community Votes</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b text-center font-bold text-lg">
                  ▲ {tool.upvotes}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Categories</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 border-b">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tool.categories.map((ct) => (
                      <Link
                        key={ct.category.id}
                        href={`/categories/${ct.category.slug}`}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
                      >
                        {ct.category.name}
                      </Link>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium">Action</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm"
                  >
                    Visit Website
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link href="/compare" className="text-primary hover:underline">
          ← Compare other tools
        </Link>
      </div>
    </div>
  );
}
