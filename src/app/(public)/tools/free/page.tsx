import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Gift, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Tools - 100% Free Software | Toolradar",
  description: "Discover the best completely free tools and software. No hidden costs, no credit card required. Curated list of free solutions for developers, marketers, and businesses.",
  keywords: ["free tools", "free software", "no cost tools", "free apps", "open source"],
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function FreeToolsPage() {
  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: "free",
    },
    orderBy: [
      { editorialScore: "desc" },
      { communityScore: "desc" },
    ],
    take: 100,
    include: {
      categories: { include: { category: true }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <Gift className="w-5 h-5" />
            <span className="font-medium">100% Free</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Free Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Completely free software with no hidden costs. No credit card required, no trial limitations.
          </p>
          <p className="text-muted-foreground mt-2">{tools.length} free tools available</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="bg-card rounded-xl border p-5 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-3">
                <ToolLogo src={tool.logo} name={tool.name} className="w-10 h-10 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold group-hover:text-primary transition truncate">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.tagline}
                  </p>
                  {tool.categories[0] && (
                    <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                      {tool.categories[0].category.name}
                    </span>
                  )}
                </div>
                {tool.editorialScore && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{tool.editorialScore}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No free tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
