import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twelfth batch of verified pricing from WebFetch (December 2025) - AI & Video Tools
const verifiedPricing: Record<string, object> = {
  // Claude - https://claude.com/pricing
  "claude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://claude.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic access", features: ["Web & mobile", "Code generation", "Web search"] },
      { name: "Pro", price: 17, period: "month", description: "Annual ($20 monthly)", features: ["Higher limits", "Claude Code", "Extended thinking"], highlighted: true },
      { name: "Max", price: 100, period: "month", description: "From", features: ["5-20x Pro limits", "Memory", "Early features"] },
      { name: "Team", price: 25, period: "seat/month", description: "5+ members", features: ["Collaboration", "Admin controls"] }
    ],
    notes: "API: Opus $5-25/MTok, Sonnet $3-15/MTok, Haiku $1-5/MTok"
  },

  // Jasper - https://www.jasper.ai/pricing
  "jasper": {
    startingPrice: 59, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.jasper.ai/pricing",
    tiers: [
      { name: "Pro", price: 59, period: "seat/month", description: "Annual ($69 monthly)", features: ["2 Brand Voices", "5 knowledge assets", "30+ languages"], highlighted: true },
      { name: "Business", price: "Custom", description: "12-month min", features: ["Unlimited voices", "API access", "SSO/SCIM", "Dedicated manager"] }
    ],
    notes: "SOC 2 compliant. 99% uptime."
  },

  // Writesonic - https://writesonic.com/pricing
  "writesonic": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://writesonic.com/pricing",
    tiers: [
      { name: "Lite", price: 39, period: "month", description: "Annual ($49 monthly)", features: ["15 AI articles", "6 SEO audits", "1 user"] },
      { name: "Standard", price: 79, period: "month", description: "Annual ($99 monthly)", features: ["30 AI articles", "15 SEO audits", "5 writing styles"] },
      { name: "Professional", price: 199, period: "month", description: "Annual ($249 monthly)", features: ["100 AI articles", "AI search tracking", "2 users"], highlighted: true },
      { name: "Advanced", price: 399, period: "month", description: "Annual ($499 monthly)", features: ["200 AI articles", "5 users", "Priority support"] }
    ],
    notes: "20% off with annual billing"
  },

  // Copy.ai - https://copy.ai/pricing
  "copy-ai": {
    startingPrice: 24, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://copy.ai/pricing",
    tiers: [
      { name: "Chat", price: 24, period: "month", description: "Annual ($29 monthly)", features: ["5 seats", "Unlimited words", "GPT-4, Claude, Gemini"], highlighted: true },
      { name: "Growth", price: 1000, period: "month", description: "$12K/year", features: ["75 seats", "20K workflow credits"] },
      { name: "Expansion", price: 2000, period: "month", description: "$24K/year", features: ["150 seats", "45K workflow credits"] },
      { name: "Scale", price: 3000, period: "month", description: "$36K/year", features: ["200 seats", "75K workflow credits"] }
    ]
  },

  // Replicate - https://replicate.com/pricing
  "replicate": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://replicate.com/pricing",
    tiers: [
      { name: "Pay as you go", price: 0, description: "No minimum", features: ["Public models", "Per-prediction billing", "Free tier available"], highlighted: true },
      { name: "FLUX Schnell", price: 0.003, period: "per image", description: "Fast generation", features: ["$3/1K images"] },
      { name: "FLUX Pro", price: 0.04, period: "per image", description: "High quality", features: ["Premium quality"] },
      { name: "GPU Hourly", price: 0.81, period: "per hour", description: "T4 GPU", features: ["Up to $5.49/hr H100"] }
    ],
    notes: "Enterprise: dedicated support, volume discounts"
  },

  // Runway - https://runwayml.com/pricing
  "runway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://runwayml.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "125 credits", features: ["Gen-4 Turbo", "3 projects", "5GB storage"] },
      { name: "Standard", price: 12, period: "month", description: "Annual ($15 monthly)", features: ["625 credits/mo", "All apps", "100GB storage"], highlighted: true },
      { name: "Pro", price: 28, period: "month", description: "Annual ($35 monthly)", features: ["2250 credits/mo", "Custom voices", "500GB storage"] },
      { name: "Unlimited", price: 76, period: "month", description: "Annual ($95 monthly)", features: ["Unlimited Gen-4", "Explore Mode", "Pro exports"] }
    ]
  },

  // Otter.ai - https://www.otter.ai/pricing
  "otter": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.otter.ai/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["300 min/mo", "Live transcription", "AI chat"] },
      { name: "Pro", price: 8.33, period: "user/month", description: "Annual ($16.99 monthly)", features: ["1200 min/mo", "Advanced AI", "10 imports"], highlighted: true },
      { name: "Business", price: 19.99, period: "user/month", description: "Annual ($30 monthly)", features: ["Unlimited meetings", "4hr/meeting", "Analytics"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["HIPAA", "SSO", "Dedicated CSM"] }
    ],
    notes: "51% savings with annual billing"
  },

  // Fireflies.ai - https://fireflies.ai/pricing
  "fireflies": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://fireflies.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["Unlimited transcription", "800 min storage", "Basic AI"] },
      { name: "Pro", price: 10, period: "month", description: "Annual ($18 monthly)", features: ["8K min storage", "Unlimited AI", "Downloads"], highlighted: true },
      { name: "Business", price: 19, period: "month", description: "Annual ($29 monthly)", features: ["Unlimited storage", "Video recording", "Analytics"] },
      { name: "Enterprise", price: 39, period: "month", description: "Annual", features: ["HIPAA", "SSO/SCIM", "Private storage"] }
    ]
  },

  // Synthesia - https://www.synthesia.io/pricing
  "synthesia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.synthesia.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 min/mo", features: ["9 avatars", "360 credits/mo", "AI Video Assistant"] },
      { name: "Starter", price: 18, period: "month", description: "Annual ($29 monthly)", features: ["10 min/mo", "125+ avatars", "AI Dubbing"], highlighted: true },
      { name: "Creator", price: 64, period: "month", description: "Annual ($89 monthly)", features: ["30 min/mo", "5 personal avatars", "API access"] },
      { name: "Enterprise", price: "Custom", description: "Unlimited", features: ["80+ languages", "SAML/SSO", "SCORM export"] }
    ],
    notes: "38% savings with annual billing"
  },

  // LiveKit - https://www.livekit.io/pricing
  "livekit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.livekit.io/pricing",
    tiers: [
      { name: "Build", price: 0, description: "1K agent min", features: ["5 concurrent", "1 deployment", "Community support"] },
      { name: "Ship", price: 50, period: "month", description: "5K agent min", features: ["20 concurrent", "2 deployments", "Email support"], highlighted: true },
      { name: "Scale", price: 500, period: "month", description: "50K agent min", features: ["1K concurrent", "HIPAA", "Metrics APIs"] },
      { name: "Enterprise", price: "Custom", description: "Unlimited", features: ["SSO", "SLA", "Dedicated support"] }
    ],
    notes: "Overage: $0.01/min. WebRTC: $0.0004-0.0005/min."
  },

  // Notion Calendar - Free (included with Notion)
  "notion-calendar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.notion.com/product/calendar",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Google Calendar sync", "Notion integration", "Scheduling links"], highlighted: true }
    ],
    notes: "Free standalone app. Premium features with Notion subscription."
  },

  // Rippling - https://www.rippling.com/pricing
  "rippling": {
    startingPrice: 8, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.rippling.com/pricing",
    tiers: [
      { name: "Platform", price: 8, period: "employee/month", description: "Core required", features: ["Employee directory", "Workflow automation", "Analytics"], highlighted: true },
      { name: "HR Cloud", price: "Custom", description: "Per module", features: ["Payroll", "Benefits", "Recruiting", "Performance"] },
      { name: "IT Cloud", price: "Custom", description: "Per module", features: ["Device management", "IAM", "Inventory"] },
      { name: "Finance Cloud", price: "Custom", description: "Per module", features: ["Corporate cards", "Expenses", "Bill Pay"] }
    ],
    notes: "Quote-based pricing. Each product purchased separately."
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🔧 Starting verified pricing corrections batch 12 (AI & Video Tools)...\n");

  let updated = 0;
  let notFound = 0;
  const errors: string[] = [];
  const notFoundList: string[] = [];
  const updatedList: string[] = [];

  for (const [slug, pricing] of Object.entries(verifiedPricing)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, name: true }
      });

      if (!tool) {
        notFoundList.push(slug);
        notFound++;
        continue;
      }

      await prisma.tool.update({
        where: { slug },
        data: { pricingDetails: pricing }
      });

      updatedList.push(tool.name);
      updated++;
    } catch (error) {
      errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Verified pricing corrections batch 12 (AI & Video Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
