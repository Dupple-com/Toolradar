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
    return NextResponse.json({ error: "You already reviewed this tool" }, { status: 400 });
  }

  // Auto-verify if user connected via LinkedIn
  const linkedinAccount = await prisma.account.findFirst({
    where: { userId: user.id, provider: "linkedin" },
  });

  const review = await prisma.review.create({
    data: {
      toolId: data.toolId,
      userId: user.id,
      title: data.title,
      overallRating: data.overallRating,
      easeOfUse: data.easeOfUse,
      valueForMoney: data.valueForMoney,
      customerSupport: data.customerSupport || null,
      features: data.features,
      pros: data.pros,
      cons: data.cons,
      useCases: data.useCases || null,
      verified: !!linkedinAccount,
      verifiedBy: linkedinAccount ? "linkedin" : null,
      verifiedAt: linkedinAccount ? new Date() : null,
      status: "pending",
    },
  });

  return NextResponse.json(review);
}
