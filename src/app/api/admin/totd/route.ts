import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  await requireAdmin();

  const { toolId } = await request.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.tool.updateMany({
    where: {
      toolOfTheDay: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    data: { toolOfTheDay: null },
  });

  const tool = await prisma.tool.update({
    where: { id: toolId },
    data: { toolOfTheDay: new Date() },
  });

  return NextResponse.json(tool);
}
