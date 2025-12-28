import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Sixteenth batch of verified pricing from WebFetch (December 2025) - Sales & Outreach Tools
const verifiedPricing: Record<string, object> = {
  // Lemlist - https://www.lemlist.com/pricing
  "lemlist": {
    startingPrice: 55, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.lemlist.com/pricing",
    tiers: [
      { name: "Email Pro", price: 55, period: "user/month", description: "Yearly ($69 monthly)", features: ["Unlimited email follow-ups", "3 sending emails", "200 enrichment credits"] },
      { name: "Multichannel Expert", price: 79, period: "user/month", description: "Yearly ($99 monthly)", features: ["LinkedIn automation", "5 sending emails", "400 enrichment credits"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "5+ seats min", features: ["Account manager", "Advanced API", "SSO/SAML"] }
    ],
    notes: "Includes lemwarm email warm-up for free"
  },

  // Apollo.io - https://www.apollo.io/pricing
  "apollo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.apollo.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited features", features: ["50 credits", "5 mobile credits", "Email campaigns"] },
      { name: "Basic", price: 49, period: "month", description: "Entry level", features: ["Contact access", "CRM integrations", "More credits"], highlighted: true },
      { name: "Professional", price: 99, period: "month", description: "Advanced", features: ["Sales automation", "AI insights", "Engagement tracking"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom integrations", "Security", "Governance"] }
    ],
    notes: "Credit-based system. Cancel/upgrade anytime."
  },

  // Instantly.ai - https://www.instantly.ai/pricing
  "instantly": {
    startingPrice: 30, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.instantly.ai/pricing",
    tiers: [
      { name: "Growth", price: 30, period: "month", description: "Yearly ($37 monthly)", features: ["5K emails/mo", "1K contacts", "Unlimited accounts"], highlighted: true },
      { name: "Hypergrowth", price: 77.60, period: "month", description: "Yearly ($97 monthly)", features: ["100K emails/mo", "25K contacts", "Advanced features"] },
      { name: "Light Speed", price: 286.30, period: "month", description: "Yearly ($358 monthly)", features: ["500K emails/mo", "100K contacts", "SISR System"] },
      { name: "Enterprise", price: "Custom", description: "500K+ emails", features: ["Dedicated manager", "Custom limits"] }
    ],
    notes: "Unlimited email accounts & warmup on all plans"
  },

  // Smartlead - https://www.smartlead.ai/pricing
  "smartlead": {
    startingPrice: 32.50, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.smartlead.ai/pricing",
    tiers: [
      { name: "Basic", price: 32.50, period: "month", description: "Annual ($39 monthly)", features: ["2K active leads", "6K emails/mo", "Unlimited warmup"] },
      { name: "Pro", price: 78.30, period: "month", description: "Annual ($94 monthly)", features: ["30K active leads", "150K emails/mo", "ChatGPT4", "API"], highlighted: true },
      { name: "Custom", price: 174, period: "month", description: "Starting price", features: ["12M leads", "60M emails", "Custom CRM"] }
    ],
    notes: "White-labeling: $29/client/mo"
  },

  // Woodpecker - https://www.woodpecker.co/pricing/
  "woodpecker": {
    startingPrice: 24, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.woodpecker.co/pricing/",
    tiers: [
      { name: "Starter", price: 24, period: "month", description: "Monthly ($35 annual)", features: ["500 prospects", "6K emails/mo", "2 warm-ups"] },
      { name: "Growth", price: 126, period: "month", description: "Monthly ($188 annual)", features: ["10K+ prospects", "120K emails/mo", "20 warm-ups"], highlighted: true },
      { name: "Scale", price: 903, period: "month", description: "Monthly", features: ["1M prospects", "1.2M emails/mo", "135 warm-ups"] },
      { name: "Max", price: 6666, period: "month", description: "Monthly", features: ["Unlimited all", "Dedicated manager"] }
    ],
    notes: "100 Lead Finder credits free monthly"
  },

  // Hunter.io - https://hunter.io/pricing
  "hunter": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://hunter.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 credits/mo", features: ["1 email account", "500 recipients", "Regular support"] },
      { name: "Starter", price: 34, period: "month", description: "Yearly (€49 monthly)", features: ["2K credits/mo", "3 email accounts", "Priority support"], highlighted: true },
      { name: "Growth", price: 104, period: "month", description: "Yearly (€149 monthly)", features: ["10K credits/mo", "10 email accounts"] },
      { name: "Scale", price: 209, period: "month", description: "Yearly (€299 monthly)", features: ["25K credits/mo", "20 email accounts"] }
    ],
    notes: "Unlimited team members. Credits valid 12 months."
  },

  // Waalaxy - https://waalaxy.com/pricing/
  "waalaxy": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://waalaxy.com/pricing/",
    tiers: [
      { name: "Freemium", price: 0, description: "80 invites/mo", features: ["LinkedIn automation", "Message templates", "25 email credits"] },
      { name: "Pro", price: 19, period: "user/month", description: "Monthly", features: ["300 invites/mo", "CRM sync", "Unlimited campaigns"], highlighted: true },
      { name: "Advanced", price: 49, period: "user/month", description: "Monthly", features: ["800 invites/mo", "Live chat support"] },
      { name: "Business", price: 69, period: "user/month", description: "Monthly", features: ["500 email credits", "Cold email sequences", "Multi-sender"] }
    ],
    notes: "50% off yearly. 20% off quarterly."
  },

  // Gong - https://www.gong.io/pricing/
  "gong": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.gong.io/pricing/",
    tiers: [
      { name: "Custom", price: "Custom", description: "Per-user pricing", features: ["Revenue AI", "Call recording", "Deal intelligence", "Free integrations"], highlighted: true }
    ],
    notes: "Per-user license + platform fee. Contact for quote."
  },

  // Outreach - https://www.outreach.io/pricing
  "outreach": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.outreach.io/pricing",
    tiers: [
      { name: "Engage", price: "Custom", description: "Core engagement", features: ["Sequences", "Automation", "CRM sync"] },
      { name: "Call", price: "Custom", description: "Usage-based", features: ["Integrated dialer", "Call monitoring", "AI summaries"] },
      { name: "Meet", price: "Custom", description: "Conversation intel", features: ["Recording", "Transcription", "AI assist"], highlighted: true },
      { name: "Deal", price: "Custom", description: "Deal management", features: ["Health scoring", "Activity tracking"] }
    ],
    notes: "Per-user licensing. No platform fees."
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

  console.log("🔧 Starting verified pricing corrections batch 16 (Sales & Outreach)...\n");

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
    message: "Verified pricing corrections batch 16 (Sales & Outreach) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
