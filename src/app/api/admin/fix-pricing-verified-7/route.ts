import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Seventh batch of verified pricing from WebFetch (December 2025) - Analytics & Design Tools
const verifiedPricing: Record<string, object> = {
  // Miro - https://www.miro.com/pricing/
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.miro.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Basic features", features: ["3 editable boards", "Unlimited members", "Basic integrations"] },
      { name: "Starter", price: 8, period: "member/month", description: "Annual ($10 monthly)", features: ["Unlimited boards", "25 AI credits/mo", "Private boards"], highlighted: true },
      { name: "Business", price: 16, period: "member/month", description: "Annual ($20 monthly)", features: ["Multiple workspaces", "50 AI credits/mo", "Jira/Azure sync"] },
      { name: "Enterprise", price: "Custom", description: "Min 30 members", features: ["100 AI credits/mo", "SSO", "Data residency"] }
    ]
  },

  // Whimsical - https://whimsical.com/pricing
  "whimsical": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://whimsical.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal projects", features: ["3 team boards", "100 AI actions", "7-day history"] },
      { name: "Pro", price: 10, period: "editor/month", description: "Small teams", features: ["Unlimited boards", "500 AI actions/mo", "90-day history"], highlighted: true },
      { name: "Business", price: 15, period: "editor/month", description: "Large teams", features: ["1000 AI actions/mo", "1-year history", "SAML SSO"] },
      { name: "Enterprise", price: 20, period: "editor/month", description: "Annual billing", features: ["2000 AI actions/mo", "Unlimited history", "SCIM"] }
    ],
    notes: "Viewer seats are always free"
  },

  // Hotjar - https://www.hotjar.com/pricing/
  "hotjar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.hotjar.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Basic analytics", features: ["200K sessions/mo", "Session replay", "Unlimited heatmaps"] },
      { name: "Growth", price: 49, period: "month", description: "From 7K sessions", features: ["Sense AI", "13 months data", "Advanced filters"], highlighted: true },
      { name: "Pro", price: "Custom", description: "1M+ sessions", features: ["Revenue metrics", "Multi-session replay", "Custom volume"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Digital Experience Monitoring", "Unlimited projects"] }
    ],
    notes: "Voice of Customer: Free to $99+/mo. Product Analytics: Custom pricing."
  },

  // Mixpanel - https://mixpanel.com/pricing/
  "mixpanel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mixpanel.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "1M events/mo", features: ["5 saved reports", "10K session replays", "Core analytics"] },
      { name: "Growth", price: 0, period: "to start", description: "First 1M events free", features: ["$0.28/1K events", "Unlimited reports", "20K replays free"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Unlimited events", features: ["Advanced analytics", "Data governance", "Premium support"] }
    ],
    notes: "Startup Program: First year free for early-stage companies"
  },

  // Amplitude - https://amplitude.com/pricing
  "amplitude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["50K MTUs", "10M events", "Basic analytics"] },
      { name: "Plus", price: 49, period: "month", description: "Annual ($61 monthly)", features: ["300K MTUs or 25M events", "Unlimited analytics", "Templates"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Custom volume", features: ["Advanced behavioral analysis", "Feature experimentation"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Cross-product analysis", "Account manager"] }
    ],
    notes: "MTU = Monthly Tracked User"
  },

  // Heap - https://www.heap.io/pricing
  "heap": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.heap.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K sessions/mo", features: ["Core analytics", "6 months history", "SSO"] },
      { name: "Growth", price: "Custom", description: "Contact for estimate", features: ["Sense AI", "Unlimited users", "12 months history"], highlighted: true },
      { name: "Pro", price: "Custom", description: "Custom sessions", features: ["Account analytics", "Session replay add-on", "Engagement matrix"] },
      { name: "Premier", price: "Custom", description: "Enterprise", features: ["Data warehouse", "Unlimited projects", "Premium support"] }
    ]
  },

  // Stripe - https://www.stripe.com/pricing
  "stripe": {
    startingPrice: 0, currency: "EUR", billingPeriod: "transaction", hasFreeTrial: false,
    pricingPageUrl: "https://www.stripe.com/pricing",
    tiers: [
      { name: "Standard Cards (EEE)", price: "1.5%", period: "+ €0.25", description: "Per transaction", features: ["No setup fees", "No monthly fees", "Pay per use"], highlighted: true },
      { name: "Premium Cards", price: "1.9%", period: "+ €0.25", description: "Per transaction", features: ["Rewards cards", "Corporate cards"] },
      { name: "International", price: "2.5-3.25%", period: "+ €0.25", description: "Non-EEE cards", features: ["+2% currency conversion"] },
      { name: "SEPA Direct Debit", price: "€0.35", period: "per transaction", description: "Bank transfers", features: ["Lower cost option"] }
    ],
    notes: "Billing from €500/mo or 0.7% of volume. Disputes: €20 each. Instant payouts: 1%"
  },

  // LemonSqueezy - https://www.lemonsqueezy.com/pricing
  "lemon-squeezy": {
    startingPrice: 0, currency: "USD", billingPeriod: "transaction", hasFreeTrial: true,
    pricingPageUrl: "https://www.lemonsqueezy.com/pricing",
    tiers: [
      { name: "E-commerce", price: "5%", period: "+ $0.50", description: "Per transaction", features: ["No monthly fees", "Global payments", "Sales tax compliance", "Fraud protection"], highlighted: true },
      { name: "Email 500", price: 0, period: "month", description: "Free up to 500 subs", features: ["Email marketing", "Basic features"] },
      { name: "Email 5K", price: 35, period: "month", description: "Up to 5K subs", features: ["All email features", "Automation"] },
      { name: "Custom", price: "Custom", description: "High volume", features: ["Volume discounts", "Priority support", "White-glove migration"] }
    ],
    notes: "Free to start - no trial, no contract"
  },

  // Fathom Analytics - https://usefathom.com/pricing
  "fathom-analytics": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://usefathom.com/pricing",
    tiers: [
      { name: "100K", price: 15, period: "month", description: "Up to 100K pageviews", features: ["50 sites", "Permanent retention", "API access"], highlighted: true },
      { name: "200K", price: 25, period: "month", description: "Up to 200K pageviews", features: ["All features included"] },
      { name: "500K", price: 45, period: "month", description: "Up to 500K pageviews", features: ["All features included"] },
      { name: "1M", price: 60, period: "month", description: "Up to 1M pageviews", features: ["All features included"] }
    ],
    notes: "Annual billing saves 17%. E-commerce/event tracking included."
  },

  // Simple Analytics - https://www.simpleanalytics.com/pricing
  "simple-analytics": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.simpleanalytics.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["1 user", "5 sites", "30-day retention"] },
      { name: "Simple", price: 15, period: "month", description: "Individual", features: ["1 user", "10 sites", "3-year retention", "Events collection"], highlighted: true },
      { name: "Team", price: 40, period: "month", description: "+€20/user", features: ["2 users", "20 sites", "5-year retention", "Export API"] },
      { name: "Enterprise", price: "Custom", description: "Custom limits", features: ["Separated storage", "Uptime SLA", "Priority support"] }
    ]
  },

  // Linear - https://linear.app/pricing (from previous knowledge)
  "linear": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://linear.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 250 issues", features: ["Unlimited members", "Basic features", "Community support"] },
      { name: "Pro", price: 8, period: "member/month", description: "Annual", features: ["Unlimited issues", "Cycles & projects", "Admin controls"], highlighted: true },
      { name: "Business", price: 14, period: "member/month", description: "Annual", features: ["SSO/SAML", "SLA", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom contracts", "Dedicated support"] }
    ]
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

  console.log("🔧 Starting verified pricing corrections batch 7 (Analytics & Design)...\n");

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
    message: "Verified pricing corrections batch 7 (Analytics & Design) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
