import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  // Simple protection - use the same secret as webhook
  if (secret !== process.env.OUTRANK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/blog/category/[slug]", "page");

    return NextResponse.json({
      success: true,
      message: "Blog pages revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to revalidate",
      details: String(error),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST with x-revalidate-secret header to trigger revalidation"
  });
}
