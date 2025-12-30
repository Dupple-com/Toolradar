import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      name: true,
      website: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ tools, count: tools.length });
}
