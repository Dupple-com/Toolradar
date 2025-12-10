import { prisma } from "./prisma";

export async function calculateTrendingScore(toolId: string): Promise<number> {
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    include: {
      votes: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      reviews: {
        where: {
          status: "approved",
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (!tool) return 0;

  // Trending score formula:
  // - Recent votes (last 7 days): 10 points each
  // - Recent reviews (last 30 days): 20 points each
  // - Editorial score bonus: score / 10
  // - Time decay: newer tools get a slight boost

  const recentVotes = tool.votes.length * 10;
  const recentReviews = tool.reviews.length * 20;
  const editorialBonus = (tool.editorialScore || 0) / 10;
  
  const daysSinceCreation = Math.floor(
    (Date.now() - tool.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );
  const timeBonus = Math.max(0, 50 - daysSinceCreation); // New tools get up to 50 bonus points

  return recentVotes + recentReviews + editorialBonus + timeBonus;
}

export async function updateAllTrendingScores() {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { id: true },
  });

  for (const tool of tools) {
    const score = await calculateTrendingScore(tool.id);
    // Store in weeklyUpvotes field for now (could add dedicated trending field)
    await prisma.tool.update({
      where: { id: tool.id },
      data: { weeklyUpvotes: Math.floor(score) },
    });
  }
}
