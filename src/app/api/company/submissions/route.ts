import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await requireCompany();

  const company = await prisma.company.findUnique({
    where: { userId: user.id },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const data = await request.json();

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
