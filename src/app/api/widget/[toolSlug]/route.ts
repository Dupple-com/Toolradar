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

  // Rating label based on score
  const getLabel = (s: number) => {
    if (s >= 90) return "Excellent";
    if (s >= 75) return "Very Good";
    if (s >= 60) return "Good";
    if (s >= 40) return "Average";
    return "New";
  };
  const label = getLabel(score);

  // Stars (1-5) based on score
  const starRating = Math.max(1, Math.round((score / 100) * 5));

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="190" viewBox="0 0 160 190">
  <defs>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${s.accent}"/>
      <stop offset="100%" style="stop-color:${style === "dark" ? "#4f46e5" : style === "blue" ? "#1d4ed8" : "#4f46e5"}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Badge shape -->
  <path d="M80 0 L160 30 L160 140 L80 190 L0 140 L0 30 Z" fill="${s.bg}" filter="url(#shadow)"/>
  <path d="M80 0 L160 30 L160 140 L80 190 L0 140 L0 30 Z" fill="none" stroke="${s.border}" stroke-width="1"/>

  <!-- Top ribbon -->
  <path d="M80 0 L160 30 L160 50 L80 20 L0 50 L0 30 Z" fill="url(#badgeGrad)"/>

  <!-- Toolradar text in ribbon -->
  <text x="80" y="38" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="white" letter-spacing="1">TOOLRADAR</text>

  <!-- Score circle -->
  <circle cx="80" cy="85" r="32" fill="${s.bg}" stroke="${s.accent}" stroke-width="3"/>
  <text x="80" y="93" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="${s.text}">${score}</text>

  <!-- Stars -->
  <g transform="translate(40, 125)">
    ${[0,1,2,3,4].map(i => `<text x="${i * 18}" font-family="system-ui" font-size="16" fill="${i < starRating ? '#fbbf24' : s.border}">★</text>`).join("")}
  </g>

  <!-- Label -->
  <text x="80" y="155" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${s.text}">${label}</text>

  <!-- Tool name -->
  <text x="80" y="172" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="${s.subtext}">${tool.name.length > 16 ? tool.name.substring(0, 16) + "…" : tool.name}</text>
</svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
