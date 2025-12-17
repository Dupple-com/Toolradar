import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { indexTool, removeTool } from "@/lib/meilisearch";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const data = await request.json();

  // Update categories if provided
  if (data.categoryIds !== undefined) {
    await prisma.categoryTool.deleteMany({
      where: { toolId: params.id },
    });
    if (data.categoryIds.length > 0) {
      await prisma.categoryTool.createMany({
        data: data.categoryIds.map((categoryId: string) => ({
          toolId: params.id,
          categoryId,
        })),
      });
    }
  }

  const tool = await prisma.tool.update({
    where: { id: params.id },
    data: {
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      description: data.description,
      logo: data.logo || null,
      website: data.website,
      pricing: data.pricing,
      status: data.status,
      editorialScore: data.editorialScore,
    },
    include: {
      categories: {
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });

  // Update MeiliSearch index
  try {
    if (tool.status === "published") {
      await indexTool(tool);
    } else {
      await removeTool(tool.id);
    }
  } catch (error) {
    console.error("Failed to update search index:", error);
  }

  return NextResponse.json(tool);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  await prisma.tool.delete({
    where: { id: params.id },
  });

  // Remove from MeiliSearch
  try {
    await removeTool(params.id);
  } catch (error) {
    console.error("Failed to remove from search index:", error);
  }

  return NextResponse.json({ success: true });
}
