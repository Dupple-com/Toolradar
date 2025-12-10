import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.tool.updateMany({
    data: { weeklyUpvotes: 0 },
  });

  return NextResponse.json({ success: true, resetAt: new Date().toISOString() });
}
