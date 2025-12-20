import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

// GET /api/lists - Get user's lists
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lists = await prisma.list.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tools: true } },
    },
  });

  return NextResponse.json(lists);
}

// POST /api/lists - Create a new list
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  if (!data.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const list = await prisma.list.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      public: data.public || false,
      userId: user.id,
    },
  });

  return NextResponse.json(list);
}
