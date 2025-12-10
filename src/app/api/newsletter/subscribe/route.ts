import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email, categories = [] } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });

  if (existing) {
    if (existing.unsubscribed) {
      await prisma.subscriber.update({
        where: { email },
        data: { unsubscribed: false, categories },
      });
      return NextResponse.json({ message: "Resubscribed successfully" });
    }
    return NextResponse.json({ message: "Already subscribed" });
  }

  const verifyToken = crypto.randomUUID();

  await prisma.subscriber.create({
    data: { email, categories, verifyToken, verified: false },
  });

  return NextResponse.json({ message: "Subscribed successfully" });
}
