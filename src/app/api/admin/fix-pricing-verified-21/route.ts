import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-first batch of verified pricing from WebFetch (December 2025) - Developer Tools & Analytics
const verifiedPricing: Record<string, object> = {
  // Postman - https://www.postman.com/pricing
  "postman": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.postman.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 users", features: ["API client all protocols", "1 private API", "25 collection runs", "50 AI credits/user"] },
      { name: "Basic", price: 14, period: "user/month", description: "Annual ($19 monthly)", features: ["Unlimited invites", "3 private APIs", "10K mock requests", "400 AI credits"], highlighted: true },
      { name: "Professional", price: 29, period: "user/month", description: "Annual ($39 monthly)", features: ["RBAC", "10 private APIs", "90-day recovery", "Invite-only workspaces"] },
      { name: "Enterprise", price: 49, period: "user/month", description: "Annual only", features: ["SSO/SCIM/SAML", "Unlimited APIs", "API governance", "100K mock requests"] }
    ],
    notes: "Add-ons available: AI, Collection Runner, Flows, Security."
  },

  // Insomnia - https://insomnia.rest/pricing
  "insomnia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://insomnia.rest/pricing",
    tiers: [
      { name: "Essentials", price: 0, description: "3 users", features: ["Unlimited Git Sync", "Cloud/Local projects", "Inso CLI", "1K mock requests"] },
      { name: "Pro", price: 12, period: "user/month", description: "15% off annually", features: ["Unlimited users", "RBAC", "Unlimited orgs", "10K mock requests"], highlighted: true },
      { name: "Enterprise", price: 45, period: "user/month", description: "Up to 50 users self-serve", features: ["SSO (SAML/OIDC)", "SCIM", "Native vault integrations", "Unlimited mocks"] }
    ],
    notes: "Kong Gateway integration available."
  },

  // JetBrains - https://www.jetbrains.com/store
  "jetbrains": {
    startingPrice: 109, currency: "EUR", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/store",
    tiers: [
      { name: "Individual IDE", price: 109, period: "year", description: "Personal", features: ["PyCharm/WebStorm/GoLand", "40% off after 2 years", "Fallback license"] },
      { name: "IntelliJ IDEA Ultimate", price: 199, period: "year", description: "Personal", features: ["Java/Kotlin/Scala", "Database tools", "Web frameworks"], highlighted: true },
      { name: "All Products Pack", price: 299, period: "year", description: "Personal", features: ["All IDEs included", "40% off after 2 years", "Best value"] },
      { name: "JetBrains AI Pro", price: 100, period: "year", description: "Add-on", features: ["AI code completion", "Chat assistant", "Context-aware"] }
    ],
    notes: "Business pricing higher. Educational/OSS free."
  },

  // Mixpanel - https://mixpanel.com/pricing
  "mixpanel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mixpanel.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1M events/mo", features: ["5 saved reports", "10K session replays", "Basic analytics", "Funnels/retention"] },
      { name: "Growth", price: 0, period: "month", description: "Pay per event", features: ["Unlimited reports", "20K replays", "Behavioral cohorts", "Anomaly detection"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited events", "HIPAA compliance", "24/7 support", "SAML SSO"] }
    ],
    notes: "$0.28/1K events after 1M free. Startup plan: first year free."
  },

  // Amplitude - https://amplitude.com/pricing
  "amplitude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "50K MTUs", features: ["10M events", "Session Replay", "Unlimited feature flags", "Web experimentation"] },
      { name: "Plus", price: 49, period: "month", description: "Annual", features: ["300K MTUs", "25M events", "Unlimited analytics", "Behavioral cohorts"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Contact sales", features: ["Custom volume", "Causal insights", "Feature experimentation", "Real-time streaming"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Cross-product analysis", "Multi-armed bandit", "Account manager"] }
    ],
    notes: "MTU or event-based billing options."
  },

  // Heap - https://heap.io/pricing
  "heap": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://heap.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K sessions/mo", features: ["Core analytics", "Unlimited sources", "6-month history", "SSO"] },
      { name: "Growth", price: "Custom", description: "Contact for quote", features: ["All Free", "Sense AI", "Unlimited reports", "12-month history"], highlighted: true },
      { name: "Pro", price: "Custom", description: "Contact sales", features: ["Account analytics", "Session replay add-on", "Report alerts"] },
      { name: "Premier", price: "Custom", description: "Contact sales", features: ["Data warehouse sync", "Behavioral targeting", "Dedicated CSM"] }
    ],
    notes: "Session-based pricing. Add-ons: Replays, Heatmaps, Connect."
  },

  // Sentry - https://sentry.io/pricing
  "sentry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://sentry.io/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "1 user only", features: ["Error monitoring", "Tracing", "Email alerts", "10 dashboards"] },
      { name: "Team", price: 26, period: "month", description: "Annual", features: ["Unlimited users", "Integrations", "Seer AI debugger", "50K errors"], highlighted: true },
      { name: "Business", price: 80, period: "month", description: "Annual", features: ["90-day lookback", "Anomaly detection", "SAML/SCIM", "Unlimited dashboards"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Technical account manager", "Custom data limits", "Dedicated support"] }
    ],
    notes: "Pay-as-you-go: Logs $0.50/GB, Cron $0.78/monitor."
  },

  // Hotjar - https://www.hotjar.com/pricing
  "hotjar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hotjar.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "200K sessions", features: ["Session Replay", "Unlimited heatmaps", "Funnels", "100 survey responses"] },
      { name: "Growth", price: 49, period: "month", description: "7K sessions", features: ["Sense AI", "13-month data", "Zone heatmaps", "Journey analysis"], highlighted: true },
      { name: "Pro", price: "Custom", description: "1M+ sessions", features: ["Revenue metrics", "Precision filtering", "115+ integrations"] },
      { name: "Enterprise", price: "Custom", description: "1M+ sessions", features: ["Error summaries", "Data feeds", "Unlimited projects"] }
    ],
    notes: "20% off annual. Voice of Customer add-on from $99/mo."
  },

  // Vercel - https://vercel.com/pricing
  "vercel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://vercel.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Personal projects", features: ["Automatic CI/CD", "Global CDN", "WAF & DDoS", "1M edge requests/mo"] },
      { name: "Pro", price: 20, period: "month", description: "+ usage", features: ["$20 credit included", "Team collaboration", "Faster builds", "10M edge requests", "1TB transfer"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SCIM/Directory Sync", "99.99% SLA", "Multi-region compute", "Managed WAF"] }
    ],
    notes: "Usage-based pricing after included credits."
  },

  // Netlify - https://www.netlify.com/pricing
  "netlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.netlify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "300 credits/mo", features: ["Deploy from AI/Git/API", "Unlimited previews", "Functions included"] },
      { name: "Personal", price: 9, period: "month", description: "1K credits", features: ["7-day analytics", "Priority email support"] },
      { name: "Pro", price: 20, period: "member/month", description: "3K credits", features: ["3+ concurrent builds", "30-day analytics", "Private repos"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["99.99% SLA", "High-perf builds", "SSO/SCIM", "24/7 support"] }
    ],
    notes: "Credit-based billing. Deploy: 15 credits, Bandwidth: 10/GB."
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

  console.log("🔧 Starting verified pricing corrections batch 21 (Developer Tools & Analytics)...\n");

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
    message: "Verified pricing corrections batch 21 (Developer Tools & Analytics) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
