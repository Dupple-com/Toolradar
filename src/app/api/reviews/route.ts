import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Validation
  if (!data.toolId || !data.overallRating || !data.title || !data.pros || !data.cons) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (data.pros.length < 50 || data.cons.length < 50) {
    return NextResponse.json(
      { error: "Pros and cons must be at least 50 characters each" },
      { status: 400 }
    );
  }

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

  // Determine verification status
  let isVerified = false;
  let verifiedBy = null;

  // Check for LinkedIn account connection
  if (dbUser?.accounts.some(a => a.provider === "linkedin")) {
    isVerified = true;
    verifiedBy = "linkedin";
  }
  // Check if user provided LinkedIn URL
  else if (data.linkedinUrl && data.linkedinUrl.includes("linkedin.com")) {
    isVerified = true;
    verifiedBy = "linkedin_url";
  }
  // Check if user is manually verified
  else if (dbUser?.verified) {
    isVerified = true;
    verifiedBy = "manual";
  }

  // Get tool to check email domain verification
  const tool = await prisma.tool.findUnique({
    where: { id: data.toolId },
    select: { website: true },
  });

  // Check work email domain match
  if (tool?.website && dbUser?.email) {
    try {
      const toolDomain = new URL(tool.website).hostname.replace("www.", "");
      const emailDomain = dbUser.email.split("@")[1];
      if (emailDomain && toolDomain.includes(emailDomain.split(".")[0])) {
        // User email domain matches tool domain - could be a vendor
        // Mark as verified but with a flag
        isVerified = true;
        verifiedBy = "email_domain_match";
      }
    } catch {
      // Invalid URL, skip domain check
    }
  }

  const review = await prisma.review.create({
    data: {
      toolId: data.toolId,
      userId: user.id,
      overallRating: data.overallRating,
      easeOfUse: data.easeOfUse || 0,
      valueForMoney: data.valueForMoney || 0,
      features: data.features || 0,
      customerSupport: data.customerSupport || null,
      recommendScore: data.recommendScore || null,
      title: data.title,
      pros: data.pros,
      cons: data.cons,
      useCases: data.useCases || null,
      // Verification context
      usageDuration: data.usageDuration || null,
      companySize: data.companySize || null,
      userRole: data.userRole || null,
      linkedinUrl: data.linkedinUrl || null,
      // Verification status
      verified: isVerified,
      verifiedAt: isVerified ? new Date() : null,
      verifiedBy: verifiedBy,
      status: "pending",
    },
  });

  return NextResponse.json(review);
}
