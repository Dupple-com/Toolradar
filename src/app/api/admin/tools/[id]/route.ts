import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { indexTool, removeTool } from "@/lib/meilisearch";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

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

  // Build update data object with only provided fields
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.logo !== undefined) updateData.logo = data.logo || null;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.pricing !== undefined) updateData.pricing = data.pricing;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.editorialScore !== undefined) updateData.editorialScore = data.editorialScore;

  const tool = await prisma.tool.update({
    where: { id: params.id },
    data: updateData,
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

  // Submit to IndexNow for instant indexing (only if published)
  if (tool.status === "published") {
    try {
      await submitUrlsToIndexNow([
        `/tools/${tool.slug}`,
        `/tools/${tool.slug}/alternatives`,
        `/tools/${tool.slug}/pricing`,
        `/tools/${tool.slug}/reviews`,
      ]);
    } catch (error) {
      console.error("Failed to submit to IndexNow:", error);
    }
  }

  return NextResponse.json(tool);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

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
