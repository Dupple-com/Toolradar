import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 67: Analytics & BI Tools pricing
const verifiedPricing: Record<string, object> = {
  "google-analytics": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://marketingplatform.google.com/about/analytics",
    tiers: [
      { name: "Free", price: 0, description: "Standard", features: ["Unlimited hits", "Basic reports", "Audiences", "Conversions"], highlighted: true },
      { name: "Analytics 360", price: 12500, period: "month", description: "Enterprise", features: ["Unsampled data", "BigQuery export", "SLA"] }
    ],
    notes: "GA4 free for most sites. 360 for enterprise."
  },
  "plausible": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://plausible.io/#pricing",
    tiers: [
      { name: "10K", price: 9, period: "month", description: "10K views", features: ["10K pageviews", "Unlimited sites", "Privacy-first"], highlighted: true },
      { name: "100K", price: 19, period: "month", description: "100K views", features: ["100K pageviews", "All features", "Email reports"] }
    ],
    notes: "Privacy-focused. GDPR compliant."
  },
  "fathom": {
    startingPrice: 14, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://usefathom.com/pricing",
    tiers: [
      { name: "100K", price: 14, period: "month", description: "100K views", features: ["100K pageviews", "Unlimited sites", "Privacy-first"], highlighted: true },
      { name: "500K", price: 34, period: "month", description: "500K views", features: ["500K pageviews", "All features", "Email reports"] }
    ],
    notes: "Privacy-focused analytics. No cookie banners."
  },
  "umami": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://umami.is/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Free", features: ["Unlimited sites", "Unlimited data", "Full control"], highlighted: true },
      { name: "Cloud", price: 9, period: "month", description: "100K events", features: ["100K events", "Managed hosting", "Support"] }
    ],
    notes: "Open-source. Self-hosted free."
  },
  "simple-analytics": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.simpleanalytics.com/pricing",
    tiers: [
      { name: "Starter", price: 9, period: "month", description: "100K views", features: ["100K pageviews", "1 user", "Privacy-first"], highlighted: true },
      { name: "Business", price: 49, period: "month", description: "1M views", features: ["1M pageviews", "10 users", "API access"] }
    ],
    notes: "Privacy-focused. No cookies."
  },
  "matomo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 21,
    pricingPageUrl: "https://matomo.org/pricing",
    tiers: [
      { name: "On-Premise", price: 0, description: "Self-hosted", features: ["Unlimited users", "100% data ownership", "Full features"], highlighted: true },
      { name: "Cloud", price: 19, period: "month", description: "50K hits", features: ["50K hits", "Managed hosting", "Support"] }
    ],
    notes: "Open-source GA alternative. Self-hosted free."
  },
  "goatcounter": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.goatcounter.com",
    tiers: [
      { name: "Free", price: 0, description: "Non-commercial", features: ["Unlimited pageviews", "No tracking", "Privacy-first"], highlighted: true },
      { name: "Personal", price: 5, period: "month", description: "Commercial", features: ["Commercial use", "Priority support", "Custom domain"] }
    ],
    notes: "Free for non-commercial. Privacy-focused."
  },
  "mixpanel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mixpanel.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "20M events", features: ["20M events/mo", "Unlimited users", "Core reports"], highlighted: true },
      { name: "Growth", price: 20, period: "month", description: "Starting", features: ["100M events", "Advanced analytics", "Data pipeline"] }
    ],
    notes: "Product analytics. Generous free tier."
  },
  "amplitude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["50K MTUs", "Unlimited events", "Core analytics"], highlighted: true },
      { name: "Plus", price: 49, period: "month", description: "1K MTUs", features: ["Advanced analytics", "Cohorts", "Predictions"] }
    ],
    notes: "Product analytics. Free up to 50K MTUs."
  },
  "heap": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://heap.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K sessions", features: ["10K sessions/mo", "Auto-capture", "6 mo retention"] },
      { name: "Growth", price: 0, period: "custom", description: "Custom", features: ["More sessions", "12 mo retention", "Support"], highlighted: true }
    ],
    notes: "Auto-capture analytics. Free tier."
  },
  "posthog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://posthog.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1M events", features: ["1M events/mo", "Session recordings", "Feature flags"], highlighted: true },
      { name: "Scale", price: 0, period: "usage", description: "Pay as you go", features: ["$0.00031/event", "Unlimited", "Priority support"] }
    ],
    notes: "Open-source. Very generous free tier."
  },
  "june": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.june.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K MAU", features: ["1K active users", "Core analytics", "Slack alerts"] },
      { name: "Growth", price: 149, period: "month", description: "10K MAU", features: ["10K users", "Advanced reports", "API"], highlighted: true }
    ],
    notes: "B2B product analytics. Free tier."
  },
  "tableau": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.tableau.com/pricing",
    tiers: [
      { name: "Viewer", price: 15, period: "user/month", description: "View only", features: ["View dashboards", "Comments", "Subscriptions"] },
      { name: "Explorer", price: 42, period: "user/month", description: "Analyze", features: ["Create visualizations", "Web editing"], highlighted: true },
      { name: "Creator", price: 75, period: "user/month", description: "Full", features: ["Desktop app", "Prep builder", "All features"] }
    ],
    notes: "Enterprise BI. Part of Salesforce."
  },
  "power-bi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://powerbi.microsoft.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Desktop", features: ["Desktop app", "1GB storage", "Personal use"] },
      { name: "Pro", price: 10, period: "user/month", description: "Sharing", features: ["Share reports", "Collaborate", "10GB storage"], highlighted: true },
      { name: "Premium", price: 20, period: "user/month", description: "Scale", features: ["100GB storage", "AI features", "Paginated reports"] }
    ],
    notes: "Microsoft BI. Desktop free."
  },
  "looker": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://cloud.google.com/looker/pricing",
    tiers: [{ name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Semantic layer", "Data modeling", "Embedded analytics"], highlighted: true }],
    notes: "Enterprise BI from Google. Custom pricing."
  },
  "metabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.metabase.com/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full BI", "SQL queries", "Dashboards"], highlighted: true },
      { name: "Pro", price: 85, period: "month", description: "Self-hosted", features: ["SSO", "Permissions", "Embedding"] },
      { name: "Cloud", price: 85, period: "month", description: "Managed", features: ["Managed hosting", "All Pro features"] }
    ],
    notes: "Open-source BI. Self-hosted free."
  },
  "redash": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://redash.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Query editor", "Visualizations", "Dashboards", "Alerts"], highlighted: true }],
    notes: "Free and open source. Self-hosted."
  },
  "mode": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://mode.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited queries", "Community", "Public sharing"] },
      { name: "Studio", price: 0, period: "custom", description: "Teams", features: ["Team collaboration", "Private reports", "API"], highlighted: true }
    ],
    notes: "Collaborative analytics. Free for personal."
  },
  "hex": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://hex.tech/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["3 projects", "1 editor", "SQL + Python"] },
      { name: "Team", price: 50, period: "editor/month", description: "Teams", features: ["Unlimited projects", "Collaboration", "Git sync"], highlighted: true }
    ],
    notes: "Collaborative notebooks. Free tier."
  },
  "preset": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://preset.io/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "5 users", features: ["5 users", "Apache Superset", "20 dashboards"] },
      { name: "Professional", price: 20, period: "user/month", description: "Teams", features: ["Unlimited dashboards", "SSO", "Support"], highlighted: true }
    ],
    notes: "Managed Apache Superset. Free tier."
  },
  "lightdash": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lightdash.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Self-hosted", "dbt integration", "Charts"], highlighted: true },
      { name: "Cloud", price: 10, period: "user/month", description: "Managed", features: ["Managed hosting", "Support", "SSO"] }
    ],
    notes: "Open-source BI for dbt. Self-hosted free."
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
    message: "Pricing batch 67 (Analytics & BI) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
