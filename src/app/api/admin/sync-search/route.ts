import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { initMeilisearch, indexTools, clearIndex, getIndexStats } from "@/lib/meilisearch";

export async function POST() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

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

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const stats = await getIndexStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get index stats" },
      { status: 500 }
    );
  }
}
