import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  const data = await request.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name || null,
      username: data.username || null,
      bio: data.bio || null,
      linkedinUrl: data.linkedinUrl || null,
      emailNewTools: data.emailNewTools,
      emailWeeklyDigest: data.emailWeeklyDigest,
    },
  });

  return NextResponse.json(updated);
}
