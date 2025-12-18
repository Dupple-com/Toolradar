import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { companyId, workEmail, jobTitle, linkedinUrl, additionalNotes } = data;

  if (!companyId) {
    return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
  }

  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  // Check if company is already claimed
  if (company.claimedAt) {
    return NextResponse.json({ error: "This company has already been claimed" }, { status: 400 });
  }

  // Check if user already has a pending claim for this company
  const existingClaim = await prisma.claimRequest.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId: user.id,
      },
    },
  });

  if (existingClaim) {
    return NextResponse.json({
      error: `You already have a ${existingClaim.status} claim for this company`
    }, { status: 400 });
  }

  // Check claim rate limit (max 3 pending claims per user)
  const pendingClaimsCount = await prisma.claimRequest.count({
    where: {
      userId: user.id,
      status: "pending",
    },
  });

  if (pendingClaimsCount >= 3) {
    return NextResponse.json({
      error: "You have reached the maximum number of pending claims (3)"
    }, { status: 400 });
  }

  // Create claim request
  const claim = await prisma.claimRequest.create({
    data: {
      companyId,
      userId: user.id,
      workEmail,
      jobTitle,
      linkedinUrl,
      additionalNotes,
      status: "pending",
    },
    include: {
      company: { select: { name: true, domain: true } },
    },
  });

  return NextResponse.json(claim, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's claim requests
  const claims = await prisma.claimRequest.findMany({
    where: { userId: user.id },
    include: {
      company: { select: { name: true, domain: true, slug: true, logo: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(claims);
}
