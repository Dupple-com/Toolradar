import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const data = await request.json();

  const tool = await prisma.tool.update({
    where: { id: params.id },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  await prisma.tool.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
