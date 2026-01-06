import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getActiveCompany(user.id);
  if (!company?.verifiedAt) {
    return NextResponse.json({ error: "Company not verified" }, { status: 403 });
  }

  try {
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Response content is required" }, { status: 400 });
    }

    // Get the review and verify it belongs to a tool owned by the company
    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
      include: { tool: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.tool.companyId !== company.id) {
      return NextResponse.json({ error: "Not authorized to reply to this review" }, { status: 403 });
    }

    // Check if a vendor response already exists
    const existingReply = await prisma.reviewReply.findFirst({
      where: {
        reviewId: params.reviewId,
        isVendorResponse: true,
      },
    });

    if (existingReply) {
      // Update existing response
      const reply = await prisma.reviewReply.update({
        where: { id: existingReply.id },
        data: { content: content.trim() },
      });
      return NextResponse.json({ success: true, reply });
    }

    // Create new vendor response
    const reply = await prisma.reviewReply.create({
      data: {
        reviewId: params.reviewId,
        userId: user.id,
        content: content.trim(),
        isVendorResponse: true,
      },
    });

    // Notify the review author
    await prisma.notification.create({
      data: {
        userId: review.userId,
        type: "review_reply",
        title: `${company.name} responded to your review`,
        message: `The vendor responded to your review of ${review.tool.name}`,
        link: `/tools/${review.tool.slug}/reviews`,
      },
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Error creating review reply:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getActiveCompany(user.id);
  if (!company?.verifiedAt) {
    return NextResponse.json({ error: "Company not verified" }, { status: 403 });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
      include: { tool: true },
    });

    if (!review || review.tool.companyId !== company.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Delete vendor response
    await prisma.reviewReply.deleteMany({
      where: {
        reviewId: params.reviewId,
        isVendorResponse: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review reply:", error);
    return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
  }
}
