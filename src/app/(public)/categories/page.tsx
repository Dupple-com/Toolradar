import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CategorySearch } from "@/components/categories/category-search";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { tools: true } },
        },
      },
      _count: { select: { tools: true } },
      tools: {
        where: { tool: { status: "published" } },
        take: 3,
        include: {
          tool: {
            select: { id: true, name: true, slug: true, logo: true, tagline: true },
          },
        },
        orderBy: { tool: { editorialScore: "desc" } },
      },
    },
    orderBy: { name: "asc" },
  });

  // Calculate total tools across all categories
  const totalTools = categories.reduce((sum, cat) => {
    const categoryTotal = cat._count.tools + cat.children.reduce((s, c) => s + c._count.tools, 0);
    return sum + categoryTotal;
  }, 0);

  // Get popular categories (most tools)
  const popularCategories = [...categories]
    .sort((a, b) => {
      const aTotal = a._count.tools + a.children.reduce((s, c) => s + c._count.tools, 0);
      const bTotal = b._count.tools + b.children.reduce((s, c) => s + c._count.tools, 0);
      return bTotal - aTotal;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Software Categories</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Browse software by category to find the best solution for your needs.
              Explore {categories.length} categories with {totalTools}+ tools.
            </p>
            <CategorySearch categories={categories} />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category) => {
            const totalInCategory = category._count.tools + category.children.reduce((s, c) => s + c._count.tools, 0);
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-white rounded-xl border p-4 hover:border-primary/50 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  {category.icon || "📁"}
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">{totalInCategory} products</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6">All Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const totalInCategory = category._count.tools + category.children.reduce((s, c) => s + c._count.tools, 0);
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition"
              >
                {/* Category Header */}
                <Link
                  href={`/categories/${category.slug}`}
                  className="block p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon || "📁"}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{totalInCategory} products</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>

                {/* Subcategories */}
                {category.children.length > 0 && (
                  <div className="px-5 pb-4 border-t bg-gray-50/50">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Subcategories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.children.slice(0, 5).map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="text-xs px-2.5 py-1.5 bg-white border rounded-lg hover:border-primary hover:text-primary transition"
                        >
                          {child.name} ({child._count.tools})
                        </Link>
                      ))}
                      {category.children.length > 5 && (
                        <Link
                          href={`/categories/${category.slug}`}
                          className="text-xs px-2.5 py-1.5 text-primary hover:underline"
                        >
                          +{category.children.length - 5} more
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Featured Tools Preview */}
                {category.tools.length > 0 && (
                  <div className="px-5 pb-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Top Products
                    </p>
                    <div className="space-y-2">
                      {category.tools.map((ct) => (
                        <Link
                          key={ct.tool.id}
                          href={`/tools/${ct.tool.slug}`}
                          className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition"
                        >
                          {ct.tool.logo ? (
                            <img src={ct.tool.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                              {ct.tool.name[0]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{ct.tool.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{ct.tool.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
