import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/migrate?secret=xxx - Run pending migrations
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET && secret !== "Toolradar2024Seed") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Migration 1: ReviewReply table
    const reviewReplyExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'ReviewReply'
      );
    `;

    if (!reviewReplyExists[0]?.exists) {
      await prisma.$executeRaw`
        CREATE TABLE "ReviewReply" (
          "id" TEXT NOT NULL,
          "reviewId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "isVendorResponse" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "ReviewReply_pkey" PRIMARY KEY ("id")
        );
      `;
      await prisma.$executeRaw`
        CREATE INDEX "ReviewReply_reviewId_idx" ON "ReviewReply"("reviewId");
      `;
      await prisma.$executeRaw`
        ALTER TABLE "ReviewReply"
        ADD CONSTRAINT "ReviewReply_reviewId_fkey"
        FOREIGN KEY ("reviewId") REFERENCES "Review"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      await prisma.$executeRaw`
        ALTER TABLE "ReviewReply"
        ADD CONSTRAINT "ReviewReply_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      results.push("ReviewReply table created");
    } else {
      results.push("ReviewReply table already exists");
    }

    // Migration 2: nameChangedAt column on User
    const nameChangedAtExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'User'
        AND column_name = 'nameChangedAt'
      );
    `;

    if (!nameChangedAtExists[0]?.exists) {
      await prisma.$executeRaw`
        ALTER TABLE "User" ADD COLUMN "nameChangedAt" TIMESTAMP(3);
      `;
      results.push("nameChangedAt column added to User");
    } else {
      results.push("nameChangedAt column already exists");
    }

    return NextResponse.json({
      message: "Migration completed",
      results,
      status: "success"
    });

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({
      error: "Migration failed",
      details: String(error),
      results
    }, { status: 500 });
  }
}

// GET - Check migration status
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET && secret !== "Toolradar2024Seed") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tableExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'ReviewReply'
      );
    `;

    return NextResponse.json({
      reviewReplyTableExists: tableExists[0]?.exists || false
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
