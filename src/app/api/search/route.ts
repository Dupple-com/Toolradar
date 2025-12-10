import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/meilisearch";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const pricing = searchParams.get("pricing");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!q) {
    return NextResponse.json({ hits: [], estimatedTotalHits: 0 });
  }

  try {
    const filters = pricing
      ? `pricing = "${pricing}" AND status = "published"`
      : 'status = "published"';

    const results = await searchTools(q, { filters, limit });
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ hits: [], estimatedTotalHits: 0, error: "Search unavailable" });
  }
}
