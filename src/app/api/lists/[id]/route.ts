import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

// GET /api/lists/[id] - Get a specific list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await prisma.list.findFirst({
    where: {
      id,
      OR: [{ userId: user.id }, { public: true }],
    },
    include: {
      tools: {
        include: { tool: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  return NextResponse.json(list);
}

// PUT /api/lists/[id] - Update a list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const list = await prisma.list.findFirst({
    where: { id, userId: user.id },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  const data = await request.json();

  const updated = await prisma.list.update({
    where: { id },
    data: {
      name: data.name?.trim() || list.name,
      description: data.description?.trim() ?? list.description,
      public: data.public ?? list.public,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/lists/[id] - Delete a list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const list = await prisma.list.findFirst({
    where: { id, userId: user.id },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  await prisma.list.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
