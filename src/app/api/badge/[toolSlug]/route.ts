import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Badge type configurations
const badgeConfig: Record<string, { label: string; color: string; icon: string; gradient: [string, string] }> = {
  "top-rated": {
    label: "Top Rated",
    color: "#f59e0b",
    icon: "★",
    gradient: ["#fbbf24", "#f59e0b"],
  },
  "rising-star": {
    label: "Rising Star",
    color: "#8b5cf6",
    icon: "🚀",
    gradient: ["#a78bfa", "#7c3aed"],
  },
  "best-value": {
    label: "Best Value",
    color: "#10b981",
    icon: "💎",
    gradient: ["#34d399", "#059669"],
  },
  "editors-choice": {
    label: "Editor's Choice",
    color: "#3b82f6",
    icon: "✓",
    gradient: ["#60a5fa", "#2563eb"],
  },
  trending: {
    label: "Trending",
    color: "#ef4444",
    icon: "🔥",
    gradient: ["#f87171", "#dc2626"],
  },
  selected: {
    label: "Toolradar Selected",
    color: "#6366f1",
    icon: "◆",
    gradient: ["#818cf8", "#4f46e5"],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const { searchParams } = new URL(request.url);
  const badgeType = searchParams.get("type") || "top-rated";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const style = searchParams.get("style") || "default"; // default, compact, dark

  const tool = await prisma.tool.findUnique({
    where: { slug: params.toolSlug, status: "published" },
    select: { name: true, slug: true },
  });

  if (!tool) {
    return new NextResponse("Tool not found", { status: 404 });
  }

  const config = badgeConfig[badgeType] || badgeConfig["top-rated"];
  const isDark = style === "dark";

  // Generate SVG badge
  const svg = style === "compact"
    ? generateCompactBadge(config, year, isDark)
    : generateDefaultBadge(config, year, tool.name, isDark);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function generateDefaultBadge(
  config: typeof badgeConfig[string],
  year: string,
  toolName: string,
  isDark: boolean
) {
  const bgColor = isDark ? "#1e293b" : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#1e293b";
  const subtextColor = isDark ? "#94a3b8" : "#64748b";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="100" viewBox="0 0 180 100">
  <defs>
    <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.gradient[0]}" />
      <stop offset="100%" style="stop-color:${config.gradient[1]}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="180" height="100" rx="12" fill="${bgColor}" filter="url(#shadow)"/>

  <!-- Badge icon circle -->
  <circle cx="35" cy="40" r="20" fill="url(#badgeGradient)"/>
  <text x="35" y="47" text-anchor="middle" font-size="18" fill="white">${config.icon}</text>

  <!-- Badge text -->
  <text x="65" y="35" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${config.color}">${config.label}</text>
  <text x="65" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="${subtextColor}">${year}</text>

  <!-- Toolradar branding -->
  <text x="90" y="85" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="${subtextColor}">toolradar.com</text>
</svg>
  `.trim();
}

function generateCompactBadge(
  config: typeof badgeConfig[string],
  year: string,
  isDark: boolean
) {
  const bgColor = isDark ? "#1e293b" : "#ffffff";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
  <defs>
    <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.gradient[0]}" />
      <stop offset="100%" style="stop-color:${config.gradient[1]}" />
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="120" height="40" rx="8" fill="${bgColor}" stroke="${config.color}" stroke-width="2"/>

  <circle cx="20" cy="20" r="12" fill="url(#badgeGradient)"/>
  <text x="20" y="25" text-anchor="middle" font-size="12" fill="white">${config.icon}</text>

  <text x="40" y="18" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="${config.color}">${config.label}</text>
  <text x="40" y="30" font-family="system-ui, sans-serif" font-size="8" fill="#64748b">${year} · toolradar</text>
</svg>
  `.trim();
}
