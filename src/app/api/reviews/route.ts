import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Check if user already reviewed this tool
  const existingReview = await prisma.review.findFirst({
    where: { toolId: data.toolId, userId: user.id },
  });

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this tool" },
      { status: 400 }
    );
  }

  // Check if user is verified (e.g., via LinkedIn)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { accounts: true },
  });

  const isVerified = dbUser?.verified || 
    dbUser?.accounts.some(a => a.provider === "linkedin");

  const review = await prisma.review.create({
    data: {
      toolId: data.toolId,
      userId: user.id,
      overallRating: data.overallRating,
      easeOfUse: data.easeOfUse,
      valueForMoney: data.valueForMoney,
      features: data.features,
      customerSupport: data.customerSupport || null,
      title: data.title,
      pros: data.pros,
      cons: data.cons,
      useCases: data.useCases || null,
      verified: isVerified,
      verifiedAt: isVerified ? new Date() : null,
      verifiedBy: isVerified ? "linkedin" : null,
      status: "pending",
    },
  });

  return NextResponse.json(review);
}
