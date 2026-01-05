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

    // Extract meta description (various formats)
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

    // Extract twitter:description as another fallback
    const twitterDescMatch = html.match(
      /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:description["'][^>]*>/i
    );

    // Extract h1 as last resort for description
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    // Extract og:title as fallback for title
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["'][^>]*>/i
    );

    const description = metaDescMatch?.[1] || ogDescMatch?.[1] || twitterDescMatch?.[1] || h1Match?.[1]?.trim() || null;
    const title = titleMatch?.[1]?.trim() || ogTitleMatch?.[1] || null;

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
