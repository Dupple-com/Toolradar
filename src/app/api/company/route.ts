import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a company
  const existingMembership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
  });

  if (existingMembership) {
    return NextResponse.json({ error: "You already have a company" }, { status: 400 });
  }

  const existingCompany = await prisma.company.findUnique({
    where: { userId: user.id },
  });

  if (existingCompany) {
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

  // Check if slug already exists
  const existingSlug = await prisma.company.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  // Create company
  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug: finalSlug,
      domain,
      website,
      description: data.description || null,
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

  // Update user role
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "company" },
  });

  return NextResponse.json(company);
}
