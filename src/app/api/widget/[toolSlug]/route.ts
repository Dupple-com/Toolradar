import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate embeddable widget for a tool
export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") || "light"; // light, dark
  const format = searchParams.get("format") || "badge"; // badge, bar, compact, minimal

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

  const themes = {
    light: {
      bg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      subtext: "#64748b",
      accent: "#6366f1",
      accentDark: "#4f46e5",
    },
    dark: {
      bg: "#0f172a",
      border: "#334155",
      text: "#f8fafc",
      subtext: "#94a3b8",
      accent: "#818cf8",
      accentDark: "#6366f1",
    },
  };

  const t = themes[theme as keyof typeof themes] || themes.light;

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
  const starRating = Math.max(0, Math.round((score / 100) * 5));
  const starsStr = [0,1,2,3,4].map(i => i < starRating ? "★" : "☆").join("");

  let svg = "";

  if (format === "badge") {
    // Vertical rectangle badge
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${t.accent}"/>
      <stop offset="100%" style="stop-color:${t.accentDark}"/>
    </linearGradient>
    <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.15"/></filter>
  </defs>
  <rect width="150" height="200" rx="12" fill="${t.bg}" filter="url(#sh)"/>
  <rect width="150" height="44" rx="12" fill="url(#grad)"/>
  <rect y="32" width="150" height="12" fill="url(#grad)"/>
  <text x="75" y="28" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700" fill="white" letter-spacing="1">TOOLRADAR</text>
  <circle cx="75" cy="100" r="34" fill="${t.bg}" stroke="${t.accent}" stroke-width="3"/>
  <text x="75" y="110" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="${t.text}">${score}</text>
  <text x="75" y="150" text-anchor="middle" font-family="system-ui" font-size="16" fill="#fbbf24">${starsStr}</text>
  <text x="75" y="172" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="12" font-weight="600" fill="${t.text}">${label}</text>
  <text x="75" y="190" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="${t.subtext}">${tool.name.length > 18 ? tool.name.substring(0, 18) + "…" : tool.name}</text>
</svg>`;
  } else if (format === "bar") {
    // Horizontal bar style (like Trustpilot)
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="60" viewBox="0 0 280 60">
  <defs><filter id="sh"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.1"/></filter></defs>
  <rect width="280" height="60" rx="8" fill="${t.bg}" filter="url(#sh)" stroke="${t.border}" stroke-width="1"/>
  <rect x="8" y="8" width="44" height="44" rx="6" fill="${t.accent}"/>
  <text x="30" y="36" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="800" fill="white">${score}</text>
  <text x="64" y="24" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="600" fill="${t.text}">${tool.name}</text>
  <text x="64" y="42" font-family="system-ui" font-size="14" fill="#fbbf24">${starsStr}</text>
  <text x="140" y="42" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="${t.subtext}">${label}</text>
  <g transform="translate(230, 20)">
    <circle cx="10" cy="10" r="10" fill="${t.accent}" opacity="0.15"/>
    <circle cx="10" cy="10" r="5" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.5"/>
    <circle cx="10" cy="10" r="2" fill="${t.accent}"/>
  </g>
  <text x="258" y="44" font-family="system-ui,-apple-system,sans-serif" font-size="7" fill="${t.subtext}">toolradar</text>
</svg>`;
  } else if (format === "compact") {
    // Square compact style
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs><filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/></filter></defs>
  <rect width="120" height="120" rx="12" fill="${t.bg}" filter="url(#sh)" stroke="${t.border}" stroke-width="1"/>
  <rect x="0" y="0" width="120" height="28" rx="12" fill="${t.accent}"/>
  <rect x="0" y="14" width="120" height="14" fill="${t.accent}"/>
  <text x="60" y="19" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="9" font-weight="700" fill="white" letter-spacing="0.5">TOOLRADAR</text>
  <text x="60" y="62" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="800" fill="${t.text}">${score}</text>
  <text x="60" y="82" text-anchor="middle" font-family="system-ui" font-size="12" fill="#fbbf24">${starsStr}</text>
  <text x="60" y="100" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="9" font-weight="500" fill="${t.subtext}">${tool.name.length > 14 ? tool.name.substring(0, 14) + "…" : tool.name}</text>
</svg>`;
  } else {
    // Minimal inline style
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40">
  <rect width="160" height="40" rx="6" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
  <circle cx="20" cy="20" r="12" fill="${t.accent}"/>
  <text x="20" y="25" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700" fill="white">${score}</text>
  <text x="40" y="18" font-family="system-ui" font-size="11" fill="#fbbf24">${starsStr}</text>
  <text x="40" y="30" font-family="system-ui,-apple-system,sans-serif" font-size="8" fill="${t.subtext}">toolradar.com</text>
</svg>`;
  }

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
