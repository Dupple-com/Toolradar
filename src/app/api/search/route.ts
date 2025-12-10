import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/meilisearch";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const pricing = searchParams.get("pricing");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const filters: string[] = ['status = "published"'];
  if (pricing) {
    filters.push(`pricing = "${pricing}"`);
  }

  const sortOptions: string[] = [];
  if (sort === "score") sortOptions.push("editorialScore:desc");
  else if (sort === "recent") sortOptions.push("createdAt:desc");
  else if (sort === "trending") sortOptions.push("weeklyUpvotes:desc");

  try {
    const results = await searchTools(query, {
      filters: filters.join(" AND "),
      sort: sortOptions.length > 0 ? sortOptions : undefined,
      limit,
      offset,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ hits: [], estimatedTotalHits: 0 });
  }
}
