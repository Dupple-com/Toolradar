import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const secret = request.headers.get("x-secret");

  if (secret !== process.env.OUTRANK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.blogPost.delete({
      where: { id: params.id },
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
