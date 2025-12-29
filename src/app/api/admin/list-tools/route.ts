import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      pricingDetails: true,
    },
    orderBy: { name: "asc" }
  });

  const withPricing = tools.filter(t => t.pricingDetails !== null).length;
  const withoutPricing = tools.filter(t => t.pricingDetails === null);
  const shortTaglines = tools.filter(t => !t.tagline || t.tagline.length < 20);

  return NextResponse.json({
    total: tools.length,
    withPricing,
    withoutPricing: withoutPricing.length,
    needsPricing: withoutPricing.map(t => t.slug),
    shortTaglines: shortTaglines.length,
    needsTagline: shortTaglines.map(t => t.slug),
    allSlugs: tools.map(t => t.slug)
  });
}
