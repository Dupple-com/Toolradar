import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { createNotification } from "@/lib/notifications";

// GET /api/reviews/[id]/replies - Get replies for a review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const replies = await prisma.reviewReply.findMany({
    where: { reviewId: id },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json(replies);
}

// POST /api/reviews/[id]/replies - Add a reply to a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  if (!data.content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // Get the review with tool info to check if user is vendor
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      tool: {
        include: {
          company: {
            include: { members: true },
          },
        },
      },
    },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // Check if user is a vendor (company member for this tool)
  const isVendor = review.tool.company?.members.some(
    (member) => member.userId === user.id
  );

  const reply = await prisma.reviewReply.create({
    data: {
      reviewId: id,
      userId: user.id,
      content: data.content.trim(),
      isVendorResponse: isVendor || false,
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Notify the review author (if not replying to own review)
  if (review.userId !== user.id) {
    const replierName = user.name || "Someone";
    await createNotification({
      userId: review.userId,
      type: "review_reply",
      title: "New Reply",
      message: `${replierName} replied to your review on ${review.tool.name}`,
      link: `/tools/${review.tool.slug}#review-${review.id}`,
    });
  }

  return NextResponse.json(reply);
}
