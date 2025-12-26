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

  // Corrected Clutch pricing from actual website
  const correctedPricing = {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://clutch.io/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "Individuals",
        features: [
          "1 seat",
          "Unlimited projects",
          "Community templates/libraries",
          "Connect to any backend",
          "Style and theme",
          "Custom code",
          "Publish to subdomain",
          "Community support"
        ]
      },
      {
        name: "Pro",
        price: 20,
        period: "month per seat",
        description: "Billed yearly ($25 monthly)",
        features: [
          "Everything in Free",
          "Team members",
          "Team roles/permissions",
          "Team private libraries",
          "Unlimited revision history",
          "Multiple environments",
          "Private component hosting",
          "Publish to npm",
          "Export as production code"
        ],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: null,
        period: "custom",
        description: "Large organizations",
        features: [
          "Everything in Pro",
          "Unlimited seats",
          "SSO",
          "Custom hosting options",
          "Professional services",
          "Dedicated account manager"
        ]
      }
    ],
    notes: "Early Adopter Lifetime Deal: $349 one-time per seat (Pro plan)"
  };

  try {
    const result = await prisma.tool.update({
      where: { slug: "clutch" },
      data: { pricingDetails: correctedPricing }
    });

    return NextResponse.json({
      success: true,
      message: "Clutch pricing corrected",
      tool: result.name
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
