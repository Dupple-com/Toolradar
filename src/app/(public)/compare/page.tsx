import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CompareSelector } from "@/components/compare/compare-selector";

export default async function ComparePage() {
  const popularTools = await prisma.tool.findMany({
    where: { status: "published" },
    orderBy: { upvotes: "desc" },
    take: 20,
    select: { id: true, name: true, slug: true, logo: true, tagline: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Compare Tools</h1>
      <p className="text-muted-foreground mb-8">
        Select 2-4 tools to compare side by side.
      </p>

      <CompareSelector tools={popularTools} />

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Popular Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tools: ["notion", "obsidian"], label: "Notion vs Obsidian" },
            { tools: ["figma", "sketch"], label: "Figma vs Sketch" },
            { tools: ["slack", "discord"], label: "Slack vs Discord" },
            { tools: ["vercel", "netlify"], label: "Vercel vs Netlify" },
          ].map((comparison) => (
            <Link
              key={comparison.tools.join("-")}
              href={`/compare/${comparison.tools.join("-vs-")}`}
              className="p-4 bg-card rounded-xl border hover:border-primary transition"
            >
              <p className="font-medium">{comparison.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
