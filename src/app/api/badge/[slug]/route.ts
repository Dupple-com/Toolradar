import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      editorialScore: true,
      communityScore: true,
      badges: { select: { type: true } },
    },
  });

  if (!tool) {
    return new NextResponse("Tool not found", { status: 404 });
  }

  const badge = tool.badges[0];
  const badgeType = badge?.type || "rated";
  const score = tool.editorialScore || Math.round((tool.communityScore || 0) * 20);

  const js = `
(function() {
  var container = document.currentScript.parentElement;
  var badge = document.createElement('a');
  badge.href = 'https://toolradar.com/tools/${params.slug}';
  badge.target = '_blank';
  badge.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:500;';
  badge.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>Toolradar ${badgeType === 'selected' ? 'Selected' : badgeType === 'top-rated' ? 'Top Rated' : 'Rated'} ${score ? score + '/100' : ''}</span>';
  container.appendChild(badge);
})();
`;

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
