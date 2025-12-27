import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fourteenth batch of verified pricing from WebFetch (December 2025) - Design & CMS Tools
const verifiedPricing: Record<string, object> = {
  // Monday.com - https://www.monday.com/pricing
  "monday": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.monday.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 2 seats", features: ["3 boards", "1000 items", "500MB storage"] },
      { name: "Basic", price: 9, period: "seat/month", description: "Annual", features: ["Unlimited boards", "5GB storage", "Priority support"] },
      { name: "Standard", price: 12, period: "seat/month", description: "Annual", features: ["Timeline/Gantt", "Guest access", "250 automations"], highlighted: true },
      { name: "Pro", price: 19, period: "seat/month", description: "Annual", features: ["Private boards", "Time tracking", "25K automations"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced security", "Portfolio management"] }
    ],
    notes: "18% discount for annual billing. Minimum 3 users for paid plans."
  },

  // GitLab - https://about.gitlab.com/pricing/
  "gitlab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://about.gitlab.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["400 compute min/mo", "10 GiB storage", "Source code management"] },
      { name: "Premium", price: 29, period: "user/month", description: "Annual", features: ["10K compute min/mo", "AI suggestions", "Unlimited users"], highlighted: true },
      { name: "Ultimate", price: "Custom", description: "Contact sales", features: ["50K compute min/mo", "Security testing", "Compliance tools"] }
    ],
    notes: "Duo Pro add-on available for enhanced AI"
  },

  // Pixlr - https://pixlr.com/pricing/
  "pixlr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://pixlr.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "With ads", features: ["Basic editing", "Limited saves", "Watermarks"] },
      { name: "Plus", price: 1.49, period: "month", description: "Yearly ($2.49 monthly)", features: ["Ad-free", "80 AI credits/mo", "Unlimited saves"] },
      { name: "Premium", price: 6.49, period: "month", description: "Yearly ($9.99 monthly)", features: ["1000 AI credits/mo", "Private mode", "Full library"], highlighted: true },
      { name: "Team", price: 11.99, period: "month", description: "Yearly ($16.99 monthly)", features: ["5 premium seats", "Team features"] }
    ],
    notes: "Education: Free for verified institutions"
  },

  // Piktochart - https://www.piktochart.com/pricing/
  "piktochart": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.piktochart.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "7-day access", features: ["2 PNG downloads", "60 AI credits", "Unlimited projects"] },
      { name: "Pro", price: 14, period: "month", description: "Annual ($29 monthly)", features: ["Unlimited PNG", "500 AI credits", "5M+ assets"], highlighted: true },
      { name: "Business", price: 24, period: "month", description: "Annual ($49 monthly)", features: ["PNG, PDF, PPT", "1000 AI credits", "Brand kit"] },
      { name: "Enterprise", price: "Custom", description: "101+ members", features: ["SSO/SAML", "Custom templates", "Account manager"] }
    ],
    notes: "Education: $39.99/year. Nonprofit: $60/year."
  },

  // Prezi - https://www.prezi.com/pricing/
  "prezi": {
    startingPrice: 5, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.prezi.com/pricing/",
    tiers: [
      { name: "Standard", price: 5, period: "month", description: "Annual", features: ["500 AI credits", "Basic presentations", "Personal use"] },
      { name: "Plus", price: 15, period: "month", description: "Annual", features: ["Unlimited AI", "PPT conversion", "Desktop app"], highlighted: true },
      { name: "Premium", price: 25, period: "month", description: "Annual", features: ["Analytics", "Phone support", "Advanced training"] },
      { name: "Teams", price: 39, period: "user/month", description: "Annual", features: ["Collaboration", "Brand kit", "SSO"] }
    ],
    notes: "EDU plans from €4/mo"
  },

  // StoryChief - https://www.storychief.io/pricing
  "storychief": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.storychief.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic analytics", features: ["Social media analytics", "SEO analytics"] },
      { name: "Social Calendar", price: 19, period: "month", description: "Annual (€23 quarterly)", features: ["3 channels", "60 posts", "1000 AI credits"], highlighted: true },
      { name: "Team Social", price: 29, period: "seat/month", description: "Annual", features: ["Unlimited posts", "4 channels", "5000 AI credits"] },
      { name: "Team Editorial", price: 69, period: "seat/month", description: "Annual", features: ["100 articles/mo", "6 channels", "8000 AI credits"] }
    ],
    notes: "Agency plans from €49/customer/mo"
  },

  // Contentful - https://www.contentful.com/pricing/
  "contentful": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.contentful.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["10 users", "100K API calls/mo", "50GB bandwidth"] },
      { name: "Lite", price: 300, period: "month", description: "Small teams", features: ["20 users", "1M API calls/mo", "Comments"], highlighted: true },
      { name: "Premium", price: "Custom", description: "Contact sales", features: ["Unlimited API", "99.99% SLA", "24/7 support"] }
    ]
  },

  // Strapi - https://strapi.io/pricing-self-hosted
  "strapi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://strapi.io/pricing-self-hosted",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Unlimited content types", "REST & GraphQL", "RBAC"] },
      { name: "Growth", price: 45, period: "month", description: "3 seats included", features: ["AI (1000 credits)", "Live Preview", "Content History"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Review workflows", "Premium support"] }
    ],
    notes: "$15/mo per additional seat on Growth"
  },

  // Directus - https://directus.io/pricing/
  "directus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://directus.io/pricing/",
    tiers: [
      { name: "Self-Hosted", price: 0, description: "Free non-production", features: ["Open source", "Full features", "Community support"] },
      { name: "Professional", price: 99, period: "month", description: "Annual", features: ["5 studio users", "75K entries", "250K API calls"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom limits", "Premium SLAs", "Dedicated support"] }
    ],
    notes: "Commercial license required for production use >$5M revenue"
  },

  // Ghost - https://ghost.org/pricing/
  "ghost": {
    startingPrice: 18, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://ghost.org/pricing/",
    tiers: [
      { name: "Starter", price: 18, period: "month", description: "Solo blogs", features: ["1 staff user", "1000 members", "1 newsletter"] },
      { name: "Publisher", price: 29, period: "month", description: "Publications", features: ["3 staff users", "Custom themes", "Paid subscriptions"], highlighted: true },
      { name: "Business", price: 199, period: "month", description: "Teams", features: ["15 staff users", "10K members", "Priority support"] },
      { name: "Custom", price: "Custom", description: "Complex needs", features: ["Unlimited staff", "99.9% SLA", "SSO/SAML"] }
    ],
    notes: "0% transaction fees on paid subscriptions"
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

  console.log("🔧 Starting verified pricing corrections batch 14 (Design & CMS Tools)...\n");

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
    message: "Verified pricing corrections batch 14 (Design & CMS Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
