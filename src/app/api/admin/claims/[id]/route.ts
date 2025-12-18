import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { action, feedback } = await request.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (action === "reject" && !feedback?.trim()) {
    return NextResponse.json({ error: "Feedback is required for rejection" }, { status: 400 });
  }

  const claim = await prisma.claimRequest.findUnique({
    where: { id: params.id },
    include: { user: true, company: true },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (claim.status !== "pending") {
    return NextResponse.json({ error: "Claim has already been processed" }, { status: 400 });
  }

  if (action === "approve") {
    // Check if company is already claimed
    if (claim.company.claimedAt) {
      return NextResponse.json({ error: "Company has already been claimed" }, { status: 400 });
    }

    // Transaction: update claim, company, create member, update user role
    await prisma.$transaction(async (tx) => {
      // Update claim status
      await tx.claimRequest.update({
        where: { id: params.id },
        data: {
          status: "approved",
          reviewedBy: auth.user.id,
          reviewedAt: new Date(),
        },
      });

      // Update company as claimed
      await tx.company.update({
        where: { id: claim.companyId },
        data: {
          claimedAt: new Date(),
          claimedBy: claim.userId,
          userId: claim.userId,
        },
      });

      // Create company member as owner
      await tx.companyMember.create({
        data: {
          companyId: claim.companyId,
          userId: claim.userId,
          role: "owner",
        },
      });

      // Update user role to "company" if not admin
      if (claim.user.role !== "admin") {
        await tx.user.update({
          where: { id: claim.userId },
          data: { role: "company" },
        });
      }
    });

    return NextResponse.json({ success: true, message: "Claim approved" });
  } else {
    // Reject claim
    await prisma.claimRequest.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        reviewedBy: auth.user.id,
        reviewedAt: new Date(),
        feedback,
      },
    });

    return NextResponse.json({ success: true, message: "Claim rejected" });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const claim = await prisma.claimRequest.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, linkedinUrl: true } },
      company: { select: { id: true, name: true, domain: true, slug: true, logo: true } },
    },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  return NextResponse.json(claim);
}
