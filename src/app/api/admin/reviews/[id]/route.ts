import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { status } = await request.json();

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { status },
  });

  // Update tool community score if approved
  if (status === "approved") {
    // Use aggregate for better performance - single query instead of fetching all reviews
    const stats = await prisma.review.aggregate({
      where: { toolId: review.toolId, status: "approved" },
      _avg: { overallRating: true },
      _count: true,
    });

    if (stats._count > 0) {
      await prisma.tool.update({
        where: { id: review.toolId },
        data: {
          communityScore: stats._avg.overallRating || 0,
          reviewCount: stats._count,
        },
      });
    }
  }

  return NextResponse.json(review);
}
