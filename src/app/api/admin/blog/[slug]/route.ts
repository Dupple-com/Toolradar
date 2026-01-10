import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  try {
    const post = await prisma.blogPost.delete({
      where: { slug: params.slug },
    });

    revalidatePath("/blog");

    return NextResponse.json({
      success: true,
      deleted: { id: post.id, slug: post.slug },
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 });
  }
}
