import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toolId } = await request.json();

  const existingVote = await prisma.vote.findUnique({
    where: { toolId_userId: { toolId, userId: user.id } },
  });

  if (existingVote) {
    await prisma.vote.delete({ where: { id: existingVote.id } });
    await prisma.tool.update({
      where: { id: toolId },
      data: { upvotes: { decrement: 1 }, weeklyUpvotes: { decrement: 1 } },
    });

    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    return NextResponse.json({ voted: false, votes: tool?.upvotes || 0 });
  }

  await prisma.vote.create({ data: { toolId, userId: user.id } });
  await prisma.tool.update({
    where: { id: toolId },
    data: { upvotes: { increment: 1 }, weeklyUpvotes: { increment: 1 } },
  });

  const tool = await prisma.tool.findUnique({ where: { id: toolId } });
  return NextResponse.json({ voted: true, votes: tool?.upvotes || 0 });
}
