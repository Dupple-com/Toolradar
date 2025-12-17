import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const { status } = await request.json();

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { status },
  });

  // Update tool community score if approved
  if (status === "approved") {
    const tool = await prisma.tool.findUnique({
      where: { id: review.toolId },
      include: { reviews: { where: { status: "approved" } } },
    });

    if (tool) {
      const avgScore =
        tool.reviews.reduce((sum, r) => sum + r.overallRating, 0) /
        tool.reviews.length;

      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          communityScore: avgScore,
          reviewCount: tool.reviews.length,
        },
      });
    }
  }

  return NextResponse.json(review);
}
