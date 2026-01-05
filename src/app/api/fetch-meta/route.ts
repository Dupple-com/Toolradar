import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Toolradar/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch website" },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract meta description
    const metaDescMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i
    );

    // Extract og:description as fallback
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["'][^>]*>/i
    );

    // Extract title as fallback
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const description = metaDescMatch?.[1] || ogDescMatch?.[1] || null;
    const title = titleMatch?.[1]?.trim() || null;

    return NextResponse.json({
      description,
      title,
    });
  } catch (error) {
    console.error("Error fetching meta:", error);
    return NextResponse.json(
      { error: "Failed to fetch website metadata" },
      { status: 500 }
    );
  }
}
