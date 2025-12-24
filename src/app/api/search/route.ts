import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const pricing = searchParams.get("pricing");
  const category = searchParams.get("category"); // category slug
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const filters: string[] = ['status = "published"'];

  if (pricing && pricing !== "all") {
    filters.push(`pricing = "${pricing}"`);
  }

  if (category && category !== "all") {
    filters.push(`categorySlugs = "${category}"`);
  }

  const sortOptions: string[] = [];
  if (sort === "score") sortOptions.push("editorialScore:desc");
  else if (sort === "recent") sortOptions.push("createdAt:desc");
  else if (sort === "trending") sortOptions.push("weeklyUpvotes:desc");
  else if (sort === "upvotes") sortOptions.push("upvotes:desc");

  try {
    const results = await searchTools(query, {
      filters: filters.join(" AND "),
      sort: sortOptions.length > 0 ? sortOptions : undefined,
      limit,
      offset,
    });

    // Cache search results for 5 minutes, stale-while-revalidate for 1 hour
    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ hits: [], estimatedTotalHits: 0 });
  }
}

// Get categories for filter dropdown
export async function POST() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: {
          select: { tools: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Cache categories for 1 hour
    return NextResponse.json({ categories }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ categories: [] });
  }
}
