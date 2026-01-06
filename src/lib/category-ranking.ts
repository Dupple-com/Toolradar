import { prisma } from "@/lib/prisma";

interface CategoryRanking {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  rank: number;
  totalInCategory: number;
}

export async function getToolCategoryRankings(toolId: string): Promise<CategoryRanking[]> {
  // Get the tool's categories
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!tool || tool.categories.length === 0) {
    return [];
  }

  const rankings: CategoryRanking[] = [];

  for (const categoryTool of tool.categories) {
    const category = categoryTool.category;

    // Get all tools in this category, ordered by community score
    const toolsInCategory = await prisma.categoryTool.findMany({
      where: {
        categoryId: category.id,
        tool: { status: "published" },
      },
      include: {
        tool: {
          select: {
            id: true,
            communityScore: true,
            reviewCount: true,
            upvotes: true,
          },
        },
      },
    });

    // Sort by community score (descending), then by review count, then by upvotes
    const sortedTools = toolsInCategory
      .map((ct) => ct.tool)
      .sort((a, b) => {
        if ((b.communityScore ?? 0) !== (a.communityScore ?? 0)) {
          return (b.communityScore ?? 0) - (a.communityScore ?? 0);
        }
        if (b.reviewCount !== a.reviewCount) {
          return b.reviewCount - a.reviewCount;
        }
        return b.upvotes - a.upvotes;
      });

    const rank = sortedTools.findIndex((t) => t.id === toolId) + 1;

    if (rank > 0) {
      rankings.push({
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        rank,
        totalInCategory: sortedTools.length,
      });
    }
  }

  // Sort rankings by rank (best first)
  return rankings.sort((a, b) => a.rank - b.rank);
}

export async function getCompanyToolsRankings(companyId: string) {
  const tools = await prisma.tool.findMany({
    where: { companyId, status: "published" },
    select: { id: true, name: true, slug: true },
  });

  const results = await Promise.all(
    tools.map(async (tool) => ({
      toolId: tool.id,
      toolName: tool.name,
      toolSlug: tool.slug,
      rankings: await getToolCategoryRankings(tool.id),
    }))
  );

  return results.filter((r) => r.rankings.length > 0);
}
