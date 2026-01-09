import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { notifyAdminNewSubmission } from "@/lib/notifications";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Verify Turnstile token
  if (!data.turnstileToken) {
    return NextResponse.json(
      { error: "Please complete the verification" },
      { status: 400 }
    );
  }

  const isValidToken = await verifyTurnstile(data.turnstileToken);
  if (!isValidToken) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 }
    );
  }

  // Get or create company
  let company = await prisma.company.findUnique({ where: { userId: user.id } });
  
  if (!company) {
    // Create company from website domain
    const url = new URL(data.website);
    const domain = url.hostname.replace(/^www\./, "");
    const slug = domain
      .replace(/\.[^.]+$/, "") // Remove TLD
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    company = await prisma.company.create({
      data: {
        name: data.name,
        slug,
        domain,
        userId: user.id,
        claimedAt: new Date(),
        claimedBy: user.id,
      },
    });

    // Create owner membership
    await prisma.companyMember.create({
      data: {
        companyId: company.id,
        userId: user.id,
        role: "owner",
      },
    });
  }

  const submission = await prisma.submission.create({
    data: {
      companyId: company.id,
      data: {
        name: data.name,
        website: data.website,
        tagline: data.tagline,
        description: data.description,
        pricing: data.pricing,
        logo: data.logo,
      },
      status: "pending",
    },
  });

  // Send admin notification email
  notifyAdminNewSubmission(
    company.name,
    data.name,
    user.email || user.name || "Unknown"
  ).catch(console.error);

  return NextResponse.json(submission);
}
