import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Track a website click
export async function POST(request: NextRequest) {
  try {
    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: "Tool ID required" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert analytics record for today
    await prisma.toolAnalytics.upsert({
      where: {
        toolId_date: {
          toolId,
          date: today,
        },
      },
      update: {
        clicks: { increment: 1 },
      },
      create: {
        toolId,
        date: today,
        clicks: 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track click:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
