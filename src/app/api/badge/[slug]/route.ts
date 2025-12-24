import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: {
      badges: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!tool) {
    return new NextResponse("Tool not found", { status: 404 });
  }

  const badge = tool.badges[0];
  const badgeType = badge?.type || "selected";

  const script = `
(function() {
  var container = document.currentScript.parentElement;
  var badge = document.createElement('a');
  badge.href = 'https://toolradar.com/tools/${tool.slug}';
  badge.target = '_blank';
  badge.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;text-decoration:none;font-family:system-ui,sans-serif;';
  badge.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#7c3aed"><circle cx="12" cy="12" r="10"/><path fill="white" d="M9 12l2 2 4-4"/></svg><span style="color:#333;font-size:14px;font-weight:500;">${badgeType === "top-rated" ? "Top Rated on" : badgeType === "trending" ? "Trending on" : "Featured on"} Toolradar</span>';
  container.appendChild(badge);
})();
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
