import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate embeddable widget for a tool
export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "default";

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
  const rating = tool.communityScore?.toFixed(1) || "0.0";

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#6366f1";
    if (s >= 40) return "#f59e0b";
    return "#94a3b8";
  };

  const scoreColor = score > 0 ? getScoreColor(score) : "#94a3b8";

  // Score arc calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const styles = {
    default: {
      bg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      subtext: "#64748b",
      accent: "#6366f1",
    },
    minimal: {
      bg: "#ffffff",
      border: "#f1f5f9",
      text: "#0f172a",
      subtext: "#64748b",
      accent: "#6366f1",
    },
    dark: {
      bg: "#0f172a",
      border: "#334155",
      text: "#f8fafc",
      subtext: "#94a3b8",
      accent: "#818cf8",
    },
    blue: {
      bg: "#1e40af",
      border: "#3b82f6",
      text: "#f0f9ff",
      subtext: "#bfdbfe",
      accent: "#60a5fa",
    },
  };

  const s = styles[style as keyof typeof styles] || styles.default;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="220" height="70" rx="10" fill="${s.bg}" filter="url(#shadow)" stroke="${s.border}" stroke-width="1"/>

  <!-- Left: Logo + Brand -->
  <g transform="translate(14, 14)">
    <!-- Radar icon -->
    <circle cx="12" cy="12" r="12" fill="${s.accent}"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="${s.bg}" stroke-width="1.5" opacity="0.4"/>
    <circle cx="12" cy="12" r="2.5" fill="${s.bg}"/>
    <line x1="12" y1="12" x2="19" y2="5" stroke="${s.bg}" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- Tool name + rating -->
  <g transform="translate(44, 18)">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="${s.text}">${tool.name.length > 14 ? tool.name.substring(0, 14) + "..." : tool.name}</text>
    <text y="18" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="${s.subtext}">
      <tspan fill="#fbbf24">★</tspan> ${rating} · toolradar.com
    </text>
  </g>

  <!-- Score circle -->
  <g transform="translate(178, 35)">
    <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${s.border}" stroke-width="3"/>
    <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${scoreColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" transform="rotate(-90)"/>
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="${scoreColor}">${score}</text>
  </g>
</svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
