import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { Sparkles, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Freemium Tools - Free Plans with Paid Upgrades | Toolradar",
  description: "Discover the best freemium tools and software. Start free and upgrade when you need more features. Perfect for growing teams and businesses.",
  keywords: ["freemium tools", "freemium software", "free plan tools", "free tier software", "try before you buy"],
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function FreemiumToolsPage() {
  const tools = await prisma.tool.findMany({
    where: {
      status: "published",
      pricing: "freemium",
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Freemium</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Freemium Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you need more. These tools offer generous free tiers with optional paid plans.
          </p>
          <p className="text-muted-foreground mt-2">{tools.length} freemium tools available</p>
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
            <p className="text-muted-foreground">No freemium tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
