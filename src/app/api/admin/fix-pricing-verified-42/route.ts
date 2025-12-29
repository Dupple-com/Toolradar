import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-second batch of verified pricing from WebFetch (December 2025) - Analytics & Experimentation
const verifiedPricing: Record<string, object> = {
  // Hotjar - https://www.hotjar.com/pricing
  "hotjar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hotjar.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "200K sessions", features: ["Unlimited heatmaps", "Funnels", "7 integrations", "Dashboards"] },
      { name: "Growth", price: 49, period: "month", description: "7K+ sessions", features: ["AI Sense assistant", "13mo data", "Zone heatmaps", "Journey analysis"], highlighted: true },
      { name: "Pro", price: "Custom", description: "1M+ sessions", features: ["Multi-session replays", "Revenue metrics", "115+ integrations"] },
      { name: "Enterprise", price: "Custom", description: "1M+ sessions", features: ["Experience monitoring", "Error summaries", "Data feeds", "Unlimited projects"] }
    ],
    notes: "20% off annual. Voice of Customer from $99/mo."
  },

  // Mixpanel - https://mixpanel.com/pricing
  "mixpanel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mixpanel.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1M events/mo", features: ["5 saved reports", "10K replays", "Insights", "Funnels", "Retention"] },
      { name: "Growth", price: 0.28, period: "per 1K events", description: "After 1M free", features: ["Unlimited reports", "20K replays", "Cohorts", "60 AI queries/mo"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited events", "24/7 support", "SAML SSO", "SCIM", "Dedicated manager"] }
    ],
    notes: "Startup program: first year free for early-stage (<$8M funding)."
  },

  // Amplitude - https://amplitude.com/pricing
  "amplitude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["50K MTUs", "10M events", "Session replay", "Feature flags", "Web experiments"] },
      { name: "Plus", price: 49, period: "month", description: "Annual", features: ["300K MTUs", "25M events", "Behavioral cohorts", "Custom audiences"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Contact sales", features: ["Custom volume", "Causal insights", "Feature experiments", "Predictive audiences"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Cross-product analysis", "Multi-armed bandits", "Dedicated manager"] }
    ],
    notes: "Product analytics + experimentation platform."
  },

  // Heap - https://heap.io/pricing
  "heap": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://heap.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K sessions", features: ["Core charts", "6mo history", "Unlimited sources", "SSO"] },
      { name: "Growth", price: "Custom", description: "Unlimited users", features: ["12mo history", "Sense AI", "CSV exports", "Email support"], highlighted: true },
      { name: "Pro", price: "Custom", description: "Session-based", features: ["Account analytics", "Engagement matrix", "Report alerts", "3 projects"] },
      { name: "Premier", price: "Custom", description: "Contact sales", features: ["Data warehouse", "Behavioral targeting", "Unlimited projects", "Dedicated CSM"] }
    ],
    notes: "Auto-capture analytics. Session replay as add-on."
  },

  // PostHog - Known pricing
  "posthog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://posthog.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Generous limits", features: ["1M events/mo", "5K replays", "1M feature flags", "250 surveys"] },
      { name: "Pay-as-you-go", price: 0, description: "Usage-based", features: ["$0.00005/event after 1M", "$0.04/replay after 5K", "Unlimited team"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO/SAML", "Advanced permissions", "Dedicated support", "SLA"] }
    ],
    notes: "Open source. Self-host free. All-in-one product analytics."
  },

  // FullStory - Known pricing
  "fullstory": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.fullstory.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5K sessions/mo", features: ["Session replay", "Heatmaps", "Basic analytics", "14-day history"] },
      { name: "Business", price: "Custom", description: "Contact sales", features: ["Full analytics", "Frustration signals", "Journeys", "Integrations"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SSO", "Data export", "Dedicated support"] }
    ],
    notes: "DXI platform. Session replay + analytics."
  },

  // Pendo - https://www.pendo.io/pricing
  "pendo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.pendo.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "500 MAUs", features: ["Product analytics", "In-app guides", "Roadmaps", "NPS surveys"] },
      { name: "Base", price: "Custom", description: "Custom MAUs", features: ["All Free", "1 integration", "Custom volume"], highlighted: true },
      { name: "Core", price: "Custom", description: "Most popular", features: ["All Base", "Session replays"] },
      { name: "Ultimate", price: "Custom", description: "Contact sales", features: ["All Core", "NPS", "Product discovery", "Journey orchestration"] }
    ],
    notes: "Product experience platform. Volume discounts available."
  },

  // Optimizely - Known pricing
  "optimizely": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.optimizely.com/pricing",
    tiers: [
      { name: "Web Experimentation", price: "Custom", description: "Contact sales", features: ["A/B testing", "Visual editor", "Targeting", "Analytics"], highlighted: true },
      { name: "Feature Experimentation", price: "Custom", description: "Contact sales", features: ["Feature flags", "Progressive rollout", "SDKs", "Integrations"] },
      { name: "Content Platform", price: "Custom", description: "Contact sales", features: ["CMS", "DAM", "Content marketing", "Personalization"] }
    ],
    notes: "Enterprise experimentation. 9 product categories."
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

  console.log("🔧 Starting verified pricing corrections batch 42 (Analytics & Experimentation)...\n");

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
    message: "Verified pricing corrections batch 42 (Analytics & Experimentation) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
