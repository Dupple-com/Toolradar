import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  await requireAdmin();

  const data = await request.json();

  const tool = await prisma.tool.create({
    data: {
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      description: data.description,
      logo: data.logo || null,
      website: data.website,
      pricing: data.pricing,
      status: data.status,
      editorialScore: data.editorialScore,
    },
  });

  return NextResponse.json(tool);
}

export async function GET() {
  await requireAdmin();

  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tools);
}
