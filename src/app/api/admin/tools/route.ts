import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { indexTool } from "@/lib/meilisearch";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const data = await request.json();

  const tool = await prisma.tool.create({
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
      categories: data.categoryIds?.length
        ? {
            create: data.categoryIds.map((categoryId: string) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : undefined,
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

  // Index in MeiliSearch if published
  if (tool.status === "published") {
    try {
      await indexTool(tool);
    } catch (error) {
      console.error("Failed to index tool:", error);
    }

    // Submit to IndexNow for instant indexing
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

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tools);
}
