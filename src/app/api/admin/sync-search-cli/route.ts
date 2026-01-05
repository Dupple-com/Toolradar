import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initMeilisearch, indexTools, clearIndex, getIndexStats } from "@/lib/meilisearch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    return NextResponse.json({ error: "SEED_SECRET not configured" }, { status: 500 });
  }

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize MeiliSearch settings
    await initMeilisearch();

    // Clear existing index
    await clearIndex();

    // Fetch all published tools with categories
    const tools = await prisma.tool.findMany({
      where: { status: "published" },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Index all tools
    if (tools.length > 0) {
      await indexTools(tools);
    }

    // Get stats
    const stats = await getIndexStats();

    return NextResponse.json({
      success: true,
      message: `Indexed ${tools.length} tools`,
      stats,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync search index" },
      { status: 500 }
    );
  }
}
