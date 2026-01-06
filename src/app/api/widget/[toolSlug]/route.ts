import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate embeddable widget for a tool
export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "default"; // default, minimal, dark
  const showScore = searchParams.get("score") !== "false";
  const showReviews = searchParams.get("reviews") !== "false";

  const tool = await prisma.tool.findUnique({
    where: { slug: params.toolSlug, status: "published" },
    select: {
      name: true,
      slug: true,
      editorialScore: true,
      communityScore: true,
      reviewCount: true,
    },
  });

  if (!tool) {
    return new NextResponse("Tool not found", { status: 404 });
  }

  const score = tool.editorialScore || Math.round((tool.communityScore || 0) * 20);
  const reviewText = tool.reviewCount === 1 ? "1 review" : `${tool.reviewCount} reviews`;

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e"; // green
    if (s >= 60) return "#3b82f6"; // blue
    if (s >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const scoreColor = getScoreColor(score);

  const styles = {
    default: {
      bg: "#ffffff",
      border: "#e2e8f0",
      text: "#1e293b",
      subtext: "#64748b",
    },
    minimal: {
      bg: "transparent",
      border: "transparent",
      text: "#1e293b",
      subtext: "#64748b",
    },
    dark: {
      bg: "#1e293b",
      border: "#334155",
      text: "#f8fafc",
      subtext: "#94a3b8",
    },
  };

  const s = styles[style as keyof typeof styles] || styles.default;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
  <defs>
    <style>
      .toolradar-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .toolradar-title { font-size: 11px; font-weight: 600; fill: ${s.text}; }
      .toolradar-score { font-size: 24px; font-weight: 700; fill: ${scoreColor}; }
      .toolradar-label { font-size: 9px; fill: ${s.subtext}; }
      .toolradar-reviews { font-size: 10px; fill: ${s.subtext}; }
      .toolradar-brand { font-size: 8px; fill: ${s.subtext}; }
    </style>
  </defs>

  <rect x="0" y="0" width="200" height="80" rx="8" fill="${s.bg}" stroke="${s.border}" stroke-width="1"/>

  <!-- Toolradar Logo/Brand -->
  <text x="12" y="18" class="toolradar-widget toolradar-brand">TOOLRADAR</text>

  <!-- Tool Name -->
  <text x="12" y="36" class="toolradar-widget toolradar-title">${tool.name}</text>

  ${showScore ? `
  <!-- Score -->
  <text x="12" y="62" class="toolradar-widget toolradar-score">${score}</text>
  <text x="48" y="56" class="toolradar-widget toolradar-label">/100</text>
  ` : ''}

  ${showReviews && tool.reviewCount > 0 ? `
  <!-- Reviews -->
  <text x="${showScore ? 80 : 12}" y="62" class="toolradar-widget toolradar-reviews">★ ${tool.communityScore?.toFixed(1) || 'N/A'} (${reviewText})</text>
  ` : ''}

  <!-- Link hint -->
  <text x="188" y="72" text-anchor="end" class="toolradar-widget toolradar-brand">→</text>
</svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
