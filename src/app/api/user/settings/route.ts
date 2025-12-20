import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

const DAYS_BETWEEN_NAME_CHANGES = 30;

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Get current user data to check name change eligibility
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, nameChangedAt: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if name is being changed
  const isNameChanging = data.name !== dbUser.name;

  if (isNameChanging) {
    // Check cooldown period
    if (dbUser.nameChangedAt) {
      const daysSinceLastChange = Math.floor(
        (Date.now() - new Date(dbUser.nameChangedAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastChange < DAYS_BETWEEN_NAME_CHANGES) {
        const daysRemaining = DAYS_BETWEEN_NAME_CHANGES - daysSinceLastChange;
        return NextResponse.json(
          { error: `You can change your name in ${daysRemaining} days` },
          { status: 400 }
        );
      }
    }
  }

  // Update user (username is NOT updatable)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      bio: data.bio || null,
      emailNewTools: data.emailNewTools,
      emailWeeklyDigest: data.emailWeeklyDigest,
      // Update nameChangedAt only if name actually changed
      ...(isNameChanging && { nameChangedAt: new Date() }),
    },
  });

  return NextResponse.json({ success: true });
}
