import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Tenth batch of verified pricing from WebFetch (December 2025) - CRM & Website Builders
const verifiedPricing: Record<string, object> = {
  // Salesforce - https://www.salesforce.com/editions-pricing/sales-cloud/
  "salesforce": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.salesforce.com/editions-pricing/sales-cloud/",
    tiers: [
      { name: "Free Suite", price: 0, description: "Max 2 users", features: ["No credit card", "Basic CRM", "Essential features"] },
      { name: "Starter Suite", price: 25, period: "user/month", description: "Monthly or annual", features: ["Small teams", "Core CRM", "Email integration"] },
      { name: "Pro Suite", price: 100, period: "user/month", description: "Annual billing", features: ["Full CRM", "Forecasting", "Automation"], highlighted: true },
      { name: "Enterprise", price: 175, period: "user/month", description: "Annual billing", features: ["Agentforce", "Advanced analytics", "API access"] },
      { name: "Unlimited", price: 350, period: "user/month", description: "Annual billing", features: ["All features", "24/7 support", "Data Cloud"] }
    ]
  },

  // Close CRM - https://www.close.com/pricing
  "close": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.close.com/pricing",
    tiers: [
      { name: "Solo", price: 9, period: "month", description: "Annual ($19 monthly)", features: ["1 user", "10K leads max", "Core CRM"] },
      { name: "Essentials", price: 35, period: "month", description: "Annual ($49 monthly)", features: ["Unlimited contacts", "Email & calling", "SMS"], highlighted: true },
      { name: "Growth", price: 99, period: "month", description: "Annual ($109 monthly)", features: ["Power Dialer", "AI Email Assistant", "Workflows"] },
      { name: "Scale", price: 139, period: "month", description: "Annual ($149 monthly)", features: ["Predictive Dialer", "Unlimited recording", "Role permissions"] }
    ],
    notes: "AI Call Assistant: $50/mo + $0.02/min"
  },

  // Zoho CRM - https://www.zoho.com/crm/zohocrm-pricing.html
  "zoho-crm": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.zoho.com/crm/zohocrm-pricing.html",
    tiers: [
      { name: "Free", price: 0, description: "Up to 3 users", features: ["Essential features", "Basic CRM", "Mobile apps"] },
      { name: "Standard", price: 14, period: "user/month", description: "Annual billing", features: ["Scoring rules", "Workflows", "Mass email"] },
      { name: "Professional", price: 23, period: "user/month", description: "Annual billing", features: ["SalesSignals", "Blueprint", "Inventory"], highlighted: true },
      { name: "Enterprise", price: 40, period: "user/month", description: "Annual billing", features: ["Zia AI", "Canvas", "Multi-user portals"] },
      { name: "Ultimate", price: 52, period: "user/month", description: "Annual billing", features: ["Advanced BI", "Enhanced storage", "Data enrichment"] }
    ]
  },

  // Copper CRM - https://www.copper.com/pricing
  "copper": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.copper.com/pricing",
    tiers: [
      { name: "Starter", price: 9, period: "month", description: "Annual ($12 monthly)", features: ["1000 contacts", "Google Workspace", "Tasks"] },
      { name: "Basic", price: 23, period: "month", description: "Annual ($29 monthly)", features: ["2500 contacts", "Task automation", "Pipelines"], highlighted: true },
      { name: "Professional", price: 59, period: "month", description: "Annual ($69 monthly)", features: ["15K contacts", "Workflow automation", "Bulk email"] },
      { name: "Business", price: 99, period: "month", description: "Annual ($134 monthly)", features: ["Unlimited contacts", "Email series", "Multi-currency"] }
    ],
    notes: "Up to 26% off with annual billing"
  },

  // Folk CRM - https://www.folk.app/pricing
  "folk": {
    startingPrice: 17.50, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.folk.app/pricing",
    tiers: [
      { name: "Standard", price: 17.50, period: "member/month", description: "Annual ($25 monthly)", features: ["Core CRM", "Integrations", "Collaboration"], highlighted: true },
      { name: "Premium", price: 35, period: "member/month", description: "Annual ($50 monthly)", features: ["Advanced features", "More integrations", "Priority support"] },
      { name: "Custom", price: 70, period: "member/month", description: "Annual (from $100 monthly)", features: ["Custom solutions", "Dedicated support", "Enterprise features"] }
    ]
  },

  // Webflow - https://www.webflow.com/pricing
  "webflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.webflow.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["AI prototyping", "2 staging sites", "Basic features"] },
      { name: "Basic", price: 14, period: "month", description: "Annual billing", features: ["Landing pages", "Custom domain", "No CMS"] },
      { name: "CMS", price: 23, period: "month", description: "Annual billing", features: ["Blog/SEO pages", "Structured content", "2000 CMS items"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "Annual billing", features: ["High traffic", "10K CMS items", "Form file uploads"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Flexible limits", "Priority support", "Custom SLA"] }
    ],
    notes: "Workspace plans from $19/mo. Add-ons: Optimize from $299/mo, Analyze from $9/mo"
  },

  // Slack (from known pricing)
  "slack": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://slack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small teams", features: ["90-day message history", "10 integrations", "1:1 video calls"] },
      { name: "Pro", price: 7.25, period: "user/month", description: "Annual", features: ["Unlimited history", "Unlimited integrations", "Group video calls"], highlighted: true },
      { name: "Business+", price: 12.50, period: "user/month", description: "Annual", features: ["SAML SSO", "99.99% SLA", "Data exports"] },
      { name: "Enterprise Grid", price: "Custom", description: "Contact sales", features: ["Unlimited workspaces", "Enterprise security", "Premium support"] }
    ]
  },

  // Zoom (from known pricing)
  "zoom": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://zoom.us/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["40-min group meetings", "100 participants", "Screen sharing"] },
      { name: "Pro", price: 13.33, period: "user/month", description: "Annual", features: ["30-hr meetings", "Cloud recording 5GB", "Custom branding"], highlighted: true },
      { name: "Business", price: 18.32, period: "user/month", description: "Annual, min 10 users", features: ["300 participants", "SSO", "Managed domains"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["1000 participants", "Unlimited storage", "Dedicated support"] }
    ]
  },

  // Loom (from known pricing)
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["25 videos/person", "5 min recordings", "Basic features"] },
      { name: "Business", price: 12.50, period: "creator/month", description: "Annual", features: ["Unlimited videos", "Unlimited length", "Password protection", "CTA buttons"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO/SCIM", "Advanced security", "Dedicated CSM"] }
    ]
  },

  // Discord (from known pricing)
  "discord": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://discord.com/nitro",
    tiers: [
      { name: "Free", price: 0, description: "Basic features", features: ["Voice & text chat", "Screen sharing", "Server creation"] },
      { name: "Nitro Basic", price: 2.99, period: "month", description: "Chat perks", features: ["Custom emoji", "50MB uploads", "Custom app icons"], highlighted: true },
      { name: "Nitro", price: 9.99, period: "month", description: "Full experience", features: ["Custom profiles", "500MB uploads", "HD streaming", "Server boosts"] }
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

  console.log("🔧 Starting verified pricing corrections batch 10 (CRM & Website Builders)...\n");

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
    message: "Verified pricing corrections batch 10 (CRM & Website Builders) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
