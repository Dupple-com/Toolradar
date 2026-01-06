import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to notify company owners (runs async)
async function notifyCompanyOwnersAboutComparison(toolIds: string[]) {
  try {
    const tools = await prisma.tool.findMany({
      where: { id: { in: toolIds } },
      include: {
        company: {
          include: {
            members: {
              where: { role: "owner" },
            },
          },
        },
      },
    });

    const toolNames = tools.map((t) => t.name);

    for (const tool of tools) {
      if (tool.company?.members) {
        const otherTools = toolNames.filter((n) => n !== tool.name).join(", ");
        for (const member of tool.company.members) {
          // Check if notification preference exists and allows comparison alerts
          try {
            const prefs = await prisma.notificationPreference.findUnique({
              where: { userId: member.userId },
            });
            if (prefs?.comparison_alert === false) continue;
          } catch {
            // Table might not exist yet, continue with notification
          }

          await prisma.notification.create({
            data: {
              userId: member.userId,
              type: "comparison_alert",
              title: "Your tool was compared",
              message: `${tool.name} was compared with ${otherTools}`,
              link: `/company/analytics`,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error notifying about comparison:", error);
  }
}

// Track various analytics events
export async function POST(request: NextRequest) {
  try {
    const { type, toolIds, searchQuery } = await request.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === "comparison" && toolIds?.length >= 2) {
      // Track comparison for each tool
      for (const toolId of toolIds) {
        await prisma.toolAnalytics.upsert({
          where: { toolId_date: { toolId, date: today } },
          update: { comparisons: { increment: 1 } },
          create: { toolId, date: today, comparisons: 1 },
        });
      }

      // Notify company owners about the comparison (async, don't wait)
      notifyCompanyOwnersAboutComparison(toolIds).catch(console.error);

      return NextResponse.json({ success: true });
    }

    if (type === "search" && toolIds?.length && searchQuery) {
      // Track search appearance and save the search term
      for (const toolId of toolIds) {
        await prisma.toolAnalytics.upsert({
          where: { toolId_date: { toolId, date: today } },
          update: { searchAppears: { increment: 1 } },
          create: { toolId, date: today, searchAppears: 1 },
        });

        // Store search term for analytics
        await prisma.searchTerm.upsert({
          where: { toolId_term: { toolId, term: searchQuery.toLowerCase().trim() } },
          update: { count: { increment: 1 }, lastSearchedAt: new Date() },
          create: { toolId, term: searchQuery.toLowerCase().trim(), count: 1 },
        });
      }

      return NextResponse.json({ success: true });
    }

    if (type === "view" && toolIds?.length === 1) {
      const toolId = toolIds[0];
      await prisma.toolAnalytics.upsert({
        where: { toolId_date: { toolId, date: today } },
        update: { views: { increment: 1 } },
        create: { toolId, date: today, views: 1 },
      });

      return NextResponse.json({ success: true });
    }

    if (type === "click" && toolIds?.length === 1) {
      const toolId = toolIds[0];
      await prisma.toolAnalytics.upsert({
        where: { toolId_date: { toolId, date: today } },
        update: { clicks: { increment: 1 } },
        create: { toolId, date: today, clicks: 1 },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid tracking type" }, { status: 400 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
