import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This endpoint logs the raw webhook payload for debugging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers: Record<string, string> = {};

    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Store in a simple way - create a "log" blog post with the payload
    const logEntry = await prisma.blogPost.create({
      data: {
        title: `WEBHOOK_LOG_${Date.now()}`,
        slug: `webhook-log-${Date.now()}`,
        excerpt: JSON.stringify(headers).substring(0, 500),
        content: JSON.stringify(body, null, 2),
        status: "draft",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Logged webhook payload",
      id: logEntry.id,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "POST to this endpoint to log webhook payloads",
  });
}
