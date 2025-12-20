import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/debug/accounts?secret=xxx&email=xxx
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const email = request.nextUrl.searchParams.get("email");

  if (secret !== "Toolradar2024Seed") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      verified: true,
      accounts: {
        select: {
          provider: true,
          providerAccountId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
