import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toolId } = await request.json();

  const existing = await prisma.favorite.findUnique({
    where: { userId_toolId: { userId: user.id, toolId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, toolId } });
    return NextResponse.json({ favorited: true });
  }
}
