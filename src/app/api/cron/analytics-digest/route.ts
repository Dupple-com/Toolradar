import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

// Secret for cron authorization
const CRON_SECRET = process.env.CRON_SECRET;

interface AnalyticsSummary {
  totalViews: number;
  totalUniqueViews: number;
  totalClicks: number;
  viewsChange: number; // percentage change vs previous period
  topTool: { name: string; views: number } | null;
  toolCount: number;
}

// Calculate analytics summary for a company
async function getCompanyAnalytics(companyId: string, days: number = 14): Promise<AnalyticsSummary> {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - days);
  periodStart.setHours(0, 0, 0, 0);

  const previousPeriodStart = new Date(periodStart);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

  // Get tools for this company
  const tools = await prisma.tool.findMany({
    where: { companyId, status: "published" },
    select: { id: true, name: true },
  });

  if (tools.length === 0) {
    return {
      totalViews: 0,
      totalUniqueViews: 0,
      totalClicks: 0,
      viewsChange: 0,
      topTool: null,
      toolCount: 0,
    };
  }

  const toolIds = tools.map((t) => t.id);

  // Current period analytics
  const currentPeriod = await prisma.toolAnalytics.groupBy({
    by: ["toolId"],
    where: {
      toolId: { in: toolIds },
      date: { gte: periodStart },
    },
    _sum: {
      views: true,
      uniqueViews: true,
      clicks: true,
    },
  });

  // Previous period analytics (for comparison)
  const previousPeriod = await prisma.toolAnalytics.aggregate({
    where: {
      toolId: { in: toolIds },
      date: { gte: previousPeriodStart, lt: periodStart },
    },
    _sum: {
      views: true,
    },
  });

  // Calculate totals
  const totals = currentPeriod.reduce(
    (acc, item) => ({
      views: acc.views + (item._sum.views || 0),
      uniqueViews: acc.uniqueViews + (item._sum.uniqueViews || 0),
      clicks: acc.clicks + (item._sum.clicks || 0),
    }),
    { views: 0, uniqueViews: 0, clicks: 0 }
  );

  // Find top performing tool
  let topTool: { name: string; views: number } | null = null;
  if (currentPeriod.length > 0) {
    const topPerformer = currentPeriod.reduce((max, item) =>
      (item._sum.views || 0) > (max._sum.views || 0) ? item : max
    );
    const toolInfo = tools.find((t) => t.id === topPerformer.toolId);
    if (toolInfo) {
      topTool = { name: toolInfo.name, views: topPerformer._sum.views || 0 };
    }
  }

  // Calculate percentage change
  const previousViews = previousPeriod._sum.views || 0;
  const viewsChange = previousViews > 0
    ? Math.round(((totals.views - previousViews) / previousViews) * 100)
    : totals.views > 0 ? 100 : 0;

  return {
    totalViews: totals.views,
    totalUniqueViews: totals.uniqueViews,
    totalClicks: totals.clicks,
    viewsChange,
    topTool,
    toolCount: tools.length,
  };
}

// Format the notification message
function formatDigestMessage(analytics: AnalyticsSummary): string {
  if (analytics.totalViews === 0) {
    return "No views in the last 2 weeks. Consider promoting your tools!";
  }

  const parts: string[] = [];

  // Main stat
  parts.push(`${analytics.totalViews.toLocaleString()} views`);

  // Change indicator
  if (analytics.viewsChange !== 0) {
    const arrow = analytics.viewsChange > 0 ? "+" : "";
    parts.push(`(${arrow}${analytics.viewsChange}% vs previous)`);
  }

  // Top tool
  if (analytics.topTool && analytics.toolCount > 1) {
    parts.push(`Top: ${analytics.topTool.name}`);
  }

  // Clicks
  if (analytics.totalClicks > 0) {
    parts.push(`${analytics.totalClicks} website clicks`);
  }

  return parts.join(" · ");
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all verified companies with tools
    const companies = await prisma.company.findMany({
      where: {
        verifiedAt: { not: null },
        tools: { some: { status: "published" } },
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    let notificationsSent = 0;
    let companiesProcessed = 0;

    for (const company of companies) {
      const analytics = await getCompanyAnalytics(company.id);

      // Skip if no activity at all
      if (analytics.totalViews === 0 && analytics.toolCount === 0) {
        continue;
      }

      companiesProcessed++;

      // Get all member user IDs (including legacy owner)
      const userIdSet = new Set(company.members.map((m) => m.userId));
      if (company.userId) userIdSet.add(company.userId);
      const userIds = Array.from(userIdSet);

      // Create notification title based on performance
      let title = "Your bi-weekly analytics";
      if (analytics.viewsChange > 20) {
        title = "Your tools are trending!";
      } else if (analytics.viewsChange < -20) {
        title = "Analytics update";
      }

      // Send notification to each member
      for (const userId of userIds) {
        const notification = await createNotification({
          userId,
          type: "analytics_digest",
          title,
          message: formatDigestMessage(analytics),
          link: "/company/analytics",
        });

        if (notification) {
          notificationsSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      companiesProcessed,
      notificationsSent,
    });
  } catch (error) {
    console.error("Failed to send analytics digest:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
