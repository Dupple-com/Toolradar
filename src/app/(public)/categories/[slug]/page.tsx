import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      tools: {
        include: { tool: true },
      },
      children: true,
    },
  });

  if (!category) notFound();

  const tools = category.tools
    .map((ct) => ct.tool)
    .filter((t) => t.status === "published");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {category.icon && <span className="text-3xl">{category.icon}</span>}
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
      </div>

      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.children.map((child) => (
            <a
              key={child.id}
              href={`/categories/${child.slug}`}
              className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80"
            >
              {child.name}
            </a>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tools in this category yet.
        </div>
      )}
    </div>
  );
}
