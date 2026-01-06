import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate embeddable widget for a tool
export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "default"; // default, minimal, dark

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
  const rating = tool.communityScore?.toFixed(1) || "0.0";

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e"; // green
    if (s >= 60) return "#6366f1"; // indigo
    if (s >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const scoreColor = getScoreColor(score);

  // Score arc calculation (circle progress)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const styles = {
    default: {
      bg: "#ffffff",
      cardBg: "#f8fafc",
      border: "#e2e8f0",
      text: "#0f172a",
      subtext: "#64748b",
      accent: "#6366f1",
      logoGradient: ["#818cf8", "#6366f1"],
    },
    minimal: {
      bg: "#ffffff",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      subtext: "#64748b",
      accent: "#6366f1",
      logoGradient: ["#818cf8", "#6366f1"],
    },
    dark: {
      bg: "#0f172a",
      cardBg: "#1e293b",
      border: "#334155",
      text: "#f8fafc",
      subtext: "#94a3b8",
      accent: "#818cf8",
      logoGradient: ["#a5b4fc", "#818cf8"],
    },
    blue: {
      bg: "#1e3a5f",
      cardBg: "#234b6e",
      border: "#2d5a80",
      text: "#f0f9ff",
      subtext: "#93c5fd",
      accent: "#60a5fa",
      logoGradient: ["#93c5fd", "#3b82f6"],
    },
  };

  const s = styles[style as keyof typeof styles] || styles.default;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="100" viewBox="0 0 280 100">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${s.logoGradient[0]}"/>
      <stop offset="100%" style="stop-color:${s.logoGradient[1]}"/>
    </linearGradient>
    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${scoreColor}"/>
      <stop offset="100%" style="stop-color:${scoreColor}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.08"/>
    </filter>
    <clipPath id="roundedRect">
      <rect x="0" y="0" width="280" height="100" rx="12"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="280" height="100" rx="12" fill="${s.bg}" filter="url(#shadow)"/>

  <!-- Left section with logo and info -->
  <g>
    <!-- Toolradar Logo (Radar icon) -->
    <circle cx="28" cy="28" r="16" fill="url(#logoGradient)"/>
    <circle cx="28" cy="28" r="8" fill="none" stroke="${s.bg}" stroke-width="1.5" opacity="0.5"/>
    <circle cx="28" cy="28" r="3" fill="${s.bg}"/>
    <line x1="28" y1="28" x2="38" y2="18" stroke="${s.bg}" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Brand name -->
    <text x="50" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.5" fill="${s.accent}">TOOLRADAR</text>
    <text x="50" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="${s.subtext}">Verified Rating</text>
  </g>

  <!-- Divider line -->
  <line x1="0" y1="50" x2="280" y2="50" stroke="${s.border}" stroke-width="1"/>

  <!-- Bottom section -->
  <g transform="translate(0, 50)">
    <!-- Tool name -->
    <text x="16" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="${s.text}">${tool.name.length > 18 ? tool.name.substring(0, 18) + "..." : tool.name}</text>

    <!-- Reviews -->
    <g transform="translate(16, 36)">
      ${generateStars(parseFloat(rating), s.accent, s.border)}
      <text x="62" y="8" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="${s.subtext}">${rating} (${reviewText})</text>
    </g>
  </g>

  <!-- Score circle on the right -->
  <g transform="translate(232, 50)">
    <!-- Background circle -->
    <circle cx="0" cy="0" r="${radius}" fill="${s.cardBg}" stroke="${s.border}" stroke-width="2"/>

    <!-- Progress arc -->
    <circle
      cx="0"
      cy="0"
      r="${radius}"
      fill="none"
      stroke="url(#scoreGradient)"
      stroke-width="4"
      stroke-linecap="round"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${dashOffset}"
      transform="rotate(-90)"
    />

    <!-- Score text -->
    <text x="0" y="4" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="${scoreColor}">${score}</text>
    <text x="0" y="16" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="7" fill="${s.subtext}">/100</text>
  </g>

  <!-- Backlink -->
  <g transform="translate(268, 28)">
    <text x="0" y="-10" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="${s.subtext}">toolradar.com</text>
    <text x="0" y="0" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="${s.accent}">View Profile →</text>
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

// Generate star rating SVG
function generateStars(rating: number, activeColor: string, inactiveColor: string): string {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.round(rating) ? activeColor : inactiveColor;
    stars.push(`
      <path
        transform="translate(${(i - 1) * 12}, 0) scale(0.5)"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="${fill}"
      />
    `);
  }
  return stars.join("");
}
