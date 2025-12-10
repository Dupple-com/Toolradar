import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Get or create company
  let company = await prisma.company.findUnique({ where: { userId: user.id } });
  
  if (!company) {
    // Create company from website domain
    const url = new URL(data.website);
    company = await prisma.company.create({
      data: {
        name: data.name,
        domain: url.hostname,
        userId: user.id,
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

  return NextResponse.json(submission);
}
