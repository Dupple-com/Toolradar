import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Better logo URLs (Clearbit - free and reliable)
const logoFixes: Record<string, string> = {
  "miro": "https://logo.clearbit.com/miro.com",
  "mailchimp": "https://logo.clearbit.com/mailchimp.com",
  "figma": "https://logo.clearbit.com/figma.com",
  "zoom": "https://logo.clearbit.com/zoom.us",
  "trello": "https://logo.clearbit.com/trello.com",
  "1password": "https://logo.clearbit.com/1password.com",
  "clickup": "https://logo.clearbit.com/clickup.com",
  "salesforce": "https://logo.clearbit.com/salesforce.com",
  "crisp": "https://logo.clearbit.com/crisp.chat",
};

// POST /api/admin/fix-logos?secret=xxx
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET && secret !== "Toolradar2024Seed") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    for (const [slug, logoUrl] of Object.entries(logoFixes)) {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, name: true, logo: true }
      });

      if (tool) {
        await prisma.tool.update({
          where: { slug },
          data: { logo: logoUrl }
        });
        results.push(`Updated ${tool.name} logo`);
      } else {
        results.push(`Tool '${slug}' not found`);
      }
    }

    return NextResponse.json({
      message: "Logo fixes applied",
      results,
      status: "success"
    });

  } catch (error) {
    console.error("Logo fix error:", error);
    return NextResponse.json({
      error: "Logo fix failed",
      details: String(error),
      results
    }, { status: 500 });
  }
}

// GET - List current logos
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET && secret !== "Toolradar2024Seed") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slugs = Object.keys(logoFixes);

  const tools = await prisma.tool.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, name: true, logo: true }
  });

  return NextResponse.json({
    currentLogos: tools,
    proposedFixes: logoFixes
  });
}
