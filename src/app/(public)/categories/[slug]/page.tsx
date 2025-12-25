import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ToolCard } from "@/components/tools/tool-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CategoryIcon } from "@/components/categories/category-icon";
import { SortSelect } from "@/components/filters/sort-select";
import { JsonLd } from "@/components/seo/json-ld";
import { generateCategoryMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { tools: true } } },
  });

  if (!category) return { title: "Category not found" };

  return generateCategoryMetadata({
    name: category.name,
    slug: category.slug,
    description: category.description,
    toolCount: category._count.tools,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; pricing?: string };
}) {
  const { sort = "score", pricing } = searchParams;

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      parent: {
        include: {
          children: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
      children: {
        include: {
          _count: { select: { tools: true } },
        },
        orderBy: { name: "asc" },
      },
      tools: {
        include: {
          tool: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Filter and sort tools
  let tools = category.tools
    .map((ct) => ct.tool)
    .filter((t) => t.status === "published");

  // Apply pricing filter
  if (pricing && pricing !== "all") {
    tools = tools.filter((t) => t.pricing === pricing);
  }

  // Apply sorting
  tools = tools.sort((a, b) => {
    if (sort === "score") return (b.editorialScore || 0) - (a.editorialScore || 0);
    if (sort === "reviews") return b.reviewCount - a.reviewCount;
    if (sort === "trending") return b.weeklyUpvotes - a.weeklyUpvotes;
    if (sort === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Get stats
  const stats = {
    totalTools: tools.length,
    freeTools: tools.filter((t) => t.pricing === "free").length,
    avgScore: tools.length > 0
      ? Math.round(tools.reduce((s, t) => s + (t.editorialScore || 0), 0) / tools.length)
      : 0,
  };

  // Structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    ...(category.parent ? [{ name: category.parent.name, url: `/categories/${category.parent.slug}` }] : []),
    { name: category.name, url: `/categories/${category.slug}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${category.name} Software`,
    description: category.description || `Top ${category.name} tools`,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Breadcrumb & Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/categories" className="hover:text-foreground transition">
              Categories
            </Link>
            {category.parent && (
              <>
                <span>/</span>
                <Link href={`/categories/${category.parent.slug}`} className="hover:text-foreground transition">
                  {category.parent.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <CategoryIcon icon={category.icon} size="lg" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{category.name} Software</h1>
                  <p className="text-muted-foreground mt-1">
                    {stats.totalTools} products available
                  </p>
                </div>
              </div>
              {category.description && (
                <p className="text-muted-foreground mt-4 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.totalTools}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.freeTools}</p>
                <p className="text-xs text-muted-foreground">Free Tools</p>
              </div>
              {stats.avgScore > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      {category.children.length > 0 && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Browse:</span>
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition"
                >
                  {child.name}
                  <span className="text-muted-foreground ml-1">({child._count.tools})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters & Tools */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <div className="flex gap-2">
              {[
                { value: "all", label: "All" },
                { value: "free", label: "Free" },
                { value: "freemium", label: "Freemium" },
                { value: "paid", label: "Paid" },
              ].map((option) => (
                <Link
                  key={option.value}
                  href={`/categories/${category.slug}?sort=${sort}${option.value !== "all" ? `&pricing=${option.value}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    (pricing || "all") === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <SortSelect
              defaultValue={sort}
              options={[
                { value: "score", label: "Highest Score" },
                { value: "reviews", label: "Most Reviews" },
                { value: "trending", label: "Trending" },
                { value: "recent", label: "Recently Added" },
              ]}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {tools.length} {tools.length === 1 ? "result" : "results"}
          {pricing && pricing !== "all" && ` for ${pricing} tools`}
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} showVotes rank={index + 1} />
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border">
            <p className="text-muted-foreground mb-4">No tools found matching your criteria.</p>
            <Link
              href={`/categories/${category.slug}`}
              className="text-primary hover:underline"
            >
              Clear filters
            </Link>
          </div>
        )}
      </section>

      {/* Related Categories */}
      {category.parent && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <h2 className="text-lg font-bold mb-4">Related Categories</h2>
          <div className="flex flex-wrap gap-2">
            {category.parent.children?.filter((c: { id: string }) => c.id !== category.id).slice(0, 8).map((sibling: { id: string; slug: string; name: string }) => (
              <Link
                key={sibling.id}
                href={`/categories/${sibling.slug}`}
                className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary hover:text-primary transition"
              >
                {sibling.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Explore More - Internal Linking */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">Explore {category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Best of Page */}
            <Link
              href={`/best/${category.slug}`}
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition"
            >
              <span className="text-2xl mb-2 block">🏆</span>
              <h3 className="font-medium text-sm">Best {category.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Top 10 tools ranked</p>
            </Link>

            {/* Compare Category */}
            <Link
              href={`/compare/category/${category.slug}`}
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition"
            >
              <span className="text-2xl mb-2 block">⚖️</span>
              <h3 className="font-medium text-sm">Compare {category.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Side-by-side comparison</p>
            </Link>

            {/* Free Tools */}
            <Link
              href="/tools/free"
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition"
            >
              <span className="text-2xl mb-2 block">🆓</span>
              <h3 className="font-medium text-sm">Free Tools</h3>
              <p className="text-xs text-muted-foreground mt-1">Browse free software</p>
            </Link>

            {/* Alternatives Hub */}
            <Link
              href="/alternatives"
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition"
            >
              <span className="text-2xl mb-2 block">🔄</span>
              <h3 className="font-medium text-sm">Find Alternatives</h3>
              <p className="text-xs text-muted-foreground mt-1">Switch from your current tool</p>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
