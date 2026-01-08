import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

// POST /api/lists/[id]/tools/[toolId] - Add tool to list
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; toolId: string } }
) {
  const { id, toolId } = params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify list ownership
  const list = await prisma.list.findFirst({
    where: { id, userId: user.id },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  // Check if tool exists
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
  });

  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  // Check if already in list
  const existing = await prisma.listTool.findUnique({
    where: { listId_toolId: { listId: id, toolId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Tool already in list" }, { status: 400 });
  }

  // Get max order
  const maxOrder = await prisma.listTool.findFirst({
    where: { listId: id },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const listTool = await prisma.listTool.create({
    data: {
      listId: id,
      toolId,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(listTool);
}

// DELETE /api/lists/[id]/tools/[toolId] - Remove tool from list
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; toolId: string } }
) {
  const { id, toolId } = params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify list ownership
  const list = await prisma.list.findFirst({
    where: { id, userId: user.id },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  await prisma.listTool.deleteMany({
    where: { listId: id, toolId },
  });

  return NextResponse.json({ success: true });
}
