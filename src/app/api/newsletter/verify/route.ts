import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?error=invalid-token", request.url));
  }

  const subscriber = await prisma.subscriber.findFirst({
    where: { verifyToken: token },
  });

  if (!subscriber) {
    return NextResponse.redirect(new URL("/?error=invalid-token", request.url));
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { verified: true, verifyToken: null },
  });

  return NextResponse.redirect(new URL("/?subscribed=true", request.url));
}
