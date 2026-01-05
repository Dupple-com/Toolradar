import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a verified company
  const existingMembership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
    include: { company: true },
  });

  if (existingMembership?.company?.verifiedAt) {
    return NextResponse.json({ error: "You already have a company" }, { status: 400 });
  }

  // Check if user has a pending company (unverified)
  const existingCompany = await prisma.company.findUnique({
    where: { userId: user.id },
  });

  // Delete existing unverified company if any
  if (existingCompany && !existingCompany.verifiedAt) {
    await prisma.companyMember.deleteMany({ where: { companyId: existingCompany.id } });
    await prisma.company.delete({ where: { id: existingCompany.id } });
  } else if (existingCompany?.verifiedAt) {
    return NextResponse.json({ error: "You already have a company" }, { status: 400 });
  }

  const data = await request.json();

  // Normalize website URL
  let website = data.website;
  if (!website.startsWith("http://") && !website.startsWith("https://")) {
    website = `https://${website}`;
  }

  // Create slug from website domain
  const url = new URL(website);
  const domain = url.hostname.replace(/^www\./, "");
  const slug = domain
    .replace(/\.[^.]+$/, "") // Remove TLD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check if domain already claimed by verified company
  const existingDomain = await prisma.company.findUnique({ where: { domain } });
  if (existingDomain?.verifiedAt) {
    return NextResponse.json({ error: "This domain is already claimed" }, { status: 400 });
  }

  // Delete unverified company with same domain if exists
  if (existingDomain && !existingDomain.verifiedAt) {
    await prisma.companyMember.deleteMany({ where: { companyId: existingDomain.id } });
    await prisma.company.delete({ where: { id: existingDomain.id } });
  }

  // Check if slug already exists
  const existingSlug = await prisma.company.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  // Generate verification token
  const verificationToken = randomBytes(32).toString("hex");

  // Create company (unverified)
  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug: finalSlug,
      domain,
      website,
      description: data.description || null,
      userId: user.id,
      verificationToken,
      // NOT setting claimedAt or verifiedAt - company is pending
    },
  });

  // Create owner membership (but company is still unverified)
  await prisma.companyMember.create({
    data: {
      companyId: company.id,
      userId: user.id,
      role: "owner",
    },
  });

  return NextResponse.json({
    company,
    redirectTo: `/company/verify?token=${verificationToken}`,
  });
}
