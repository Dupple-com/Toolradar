import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
      _count: { select: { tools: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block bg-card rounded-xl border p-6 hover:border-primary/50 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-3">
              {category.icon && <span className="text-2xl">{category.icon}</span>}
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            {category.description && (
              <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {category._count.tools} tools
            </p>
            {category.children.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {category.children.slice(0, 3).map((child) => (
                  <span key={child.id} className="text-xs bg-muted px-2 py-1 rounded">
                    {child.name}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No categories yet.
        </div>
      )}
    </div>
  );
}
