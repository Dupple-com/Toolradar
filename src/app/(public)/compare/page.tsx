import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CompareSelector } from "@/components/compare/compare-selector";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const [popularTools, categories] = await Promise.all([
    prisma.tool.findMany({
      where: { status: "published" },
      orderBy: { upvotes: "desc" },
      take: 50,
      select: { id: true, name: true, slug: true, logo: true, tagline: true },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true, slug: true, icon: true },
      take: 8,
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Compare Tools</h1>
            <p className="text-lg text-muted-foreground">
              Select 2-4 tools to compare features, pricing, and reviews side by side.
              Make informed decisions with our detailed comparison.
            </p>
          </div>
        </div>
      </section>

      {/* Selector */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <CompareSelector tools={popularTools} />
      </section>

      {/* Categories for comparison */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-lg font-semibold mb-4">Compare by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl hover:border-primary hover:shadow-md transition"
            >
              <span className="text-lg">{category.icon || "📁"}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-center mb-8">How Comparison Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Select Tools",
                description: "Choose 2-4 tools you want to compare from our database of 100+ products.",
                icon: "🔍",
              },
              {
                step: "2",
                title: "View Comparison",
                description: "See features, pricing, scores, and reviews side by side in a clear table.",
                icon: "📊",
              },
              {
                step: "3",
                title: "Make a Decision",
                description: "Use our insights and community feedback to choose the best tool for you.",
                icon: "✅",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/5 rounded-2xl flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
