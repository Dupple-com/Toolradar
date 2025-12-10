import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      username: data.username || null,
      bio: data.bio || null,
      emailNewTools: data.emailNewTools,
      emailWeeklyDigest: data.emailWeeklyDigest,
    },
  });

  return NextResponse.json({ success: true });
}
