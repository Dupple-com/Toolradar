import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Track a tool page view
export async function POST(request: NextRequest) {
  try {
    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: "Tool ID required" }, { status: 400 });
    }

    // Get visitor fingerprint from headers for unique view tracking
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const visitorHash = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 32);

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
        views: { increment: 1 },
      },
      create: {
        toolId,
        date: today,
        views: 1,
        uniqueViews: 1,
      },
    });

    // Track unique view using a simple daily cache key
    // In production, you'd want Redis or similar for this
    const uniqueKey = `view:${toolId}:${today.toISOString().split("T")[0]}:${visitorHash}`;

    // Check if this visitor already viewed today (using a simple approach)
    // For now, we'll just increment unique views once per IP/UA combo per day
    // A more robust solution would use Redis SET with TTL
    const existingView = await prisma.toolAnalytics.findUnique({
      where: {
        toolId_date: {
          toolId,
          date: today,
        },
      },
    });

    // Simple heuristic: if views > uniqueViews * 3, don't increment uniqueViews
    // This prevents over-counting but isn't perfect
    if (existingView && existingView.views <= existingView.uniqueViews * 3) {
      await prisma.toolAnalytics.update({
        where: {
          toolId_date: {
            toolId,
            date: today,
          },
        },
        data: {
          uniqueViews: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track view:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
