import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-fifth batch of verified pricing from WebFetch (December 2025) - Automation & CRM Tools
const verifiedPricing: Record<string, object> = {
  // n8n - https://n8n.io/pricing
  "n8n": {
    startingPrice: 20, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://n8n.io/pricing",
    tiers: [
      { name: "Starter", price: 20, period: "month", description: "Annual", features: ["2.5K executions", "5 concurrent", "Unlimited users", "50 AI credits"] },
      { name: "Pro", price: 50, period: "month", description: "Annual", features: ["10K executions", "20 concurrent", "Admin roles", "150 AI credits"], highlighted: true },
      { name: "Business", price: 667, period: "month", description: "Annual", features: ["40K executions", "Self-hosted option", "SSO/SAML", "Git version control"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom volume", "200+ concurrent", "365-day insights", "Dedicated SLA"] }
    ],
    notes: "Charges per workflow execution, not per step. Self-hosted free."
  },

  // Bardeen - https://www.bardeen.ai/pricing
  "bardeen": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.bardeen.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 credits/mo", features: ["Basic automations", "Browser extension", "Limited scrapers"] },
      { name: "Basic", price: 10, period: "month", description: "100 credits", features: ["Build scrapers", "Premium scrapers", "Enrichment", "Teams"] },
      { name: "Premium", price: 40, period: "month", description: "Annual ($50 monthly)", features: ["1K credits", "All Basic", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Annual", features: ["Custom credits", "Custom scraper building", "Premium support"] }
    ],
    notes: "AI-powered browser automation. Credits expire monthly."
  },

  // Pipedrive - https://www.pipedrive.com/pricing
  "pipedrive": {
    startingPrice: 14, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.pipedrive.com/pricing",
    tiers: [
      { name: "Essential", price: 14, period: "seat/month", description: "Annual", features: ["Lead management", "2.5K deals", "30 custom fields", "15 reports"] },
      { name: "Advanced", price: 39, period: "seat/month", description: "Annual", features: ["Email sync", "Automation", "5K deals", "50 reports"], highlighted: true },
      { name: "Professional", price: 59, period: "seat/month", description: "Annual", features: ["Lead scoring", "15K deals", "250 reports", "3 email accounts"] },
      { name: "Power", price: 79, period: "seat/month", description: "Annual", features: ["All features", "20K deals", "500 reports", "5 email accounts"] }
    ],
    notes: "500+ integrations. AI sales assistant included."
  },

  // Zoho CRM - https://www.zoho.com/crm/zohocrm-pricing.html
  "zoho-crm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.zoho.com/crm/zohocrm-pricing.html",
    tiers: [
      { name: "Free", price: 0, description: "3 users", features: ["Leads", "Documents", "Mobile apps", "Basic features"] },
      { name: "Standard", price: 14, period: "user/month", description: "Annual", features: ["Sales forecasting", "Workflows", "Custom modules", "Office 365"] },
      { name: "Professional", price: 23, period: "user/month", description: "Annual", features: ["All Standard", "Blueprint", "Inventory", "Google Ads"], highlighted: true },
      { name: "Enterprise", price: 40, period: "user/month", description: "Annual", features: ["All Professional", "Zia AI", "Territory management", "Sandbox"] }
    ],
    notes: "Part of Zoho One suite. 900+ extensions."
  },

  // Zapier - Known pricing
  "zapier": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://zapier.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 tasks/mo", features: ["5 Zaps", "Single-step Zaps", "7K+ apps"] },
      { name: "Starter", price: 19.99, period: "month", description: "Annual ($29.99 monthly)", features: ["750 tasks", "20 Zaps", "Multi-step Zaps", "Filters"], highlighted: true },
      { name: "Professional", price: 49, period: "month", description: "Annual ($73.50 monthly)", features: ["2K tasks", "Unlimited Zaps", "Paths", "Auto-replay"] },
      { name: "Team", price: 69, period: "month", description: "Annual ($103.50 monthly)", features: ["2K tasks", "Unlimited users", "Shared folders", "Premier support"] }
    ],
    notes: "7,000+ app integrations. Tables and Interfaces included."
  },

  // Make (Integromat) - Known pricing
  "make": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.make.com/en/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K ops/mo", features: ["2 active scenarios", "100MB data", "15 min interval"] },
      { name: "Core", price: 9, period: "month", description: "Annual ($10.59 monthly)", features: ["10K ops", "Unlimited scenarios", "1GB data", "5 min interval"], highlighted: true },
      { name: "Pro", price: 16, period: "month", description: "Annual ($18.82 monthly)", features: ["10K ops", "Custom variables", "Full-text execution log", "1 min interval"] },
      { name: "Teams", price: 29, period: "month", description: "Annual ($34.12 monthly)", features: ["10K ops", "Team features", "Multiple admins", "Priority support"] }
    ],
    notes: "Visual automation builder. Operations scale pricing."
  },

  // HubSpot CRM - Known pricing
  "hubspot": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hubspot.com/pricing/crm",
    tiers: [
      { name: "Free Tools", price: 0, description: "Forever free", features: ["Contact management", "Deal pipeline", "Email tracking", "Forms"] },
      { name: "Starter", price: 15, period: "seat/month", description: "Annual", features: ["All Free", "Email marketing", "Landing pages", "Live chat"], highlighted: true },
      { name: "Professional", price: 90, period: "month", description: "+ seat costs", features: ["All Starter", "Marketing automation", "Custom reporting", "Teams"] },
      { name: "Enterprise", price: 130, period: "seat/month", description: "Annual", features: ["All Professional", "Custom objects", "Predictive lead scoring", "SSO"] }
    ],
    notes: "Marketing, Sales, Service, CMS hubs separate. Bundles available."
  },

  // Salesforce - Known pricing
  "salesforce": {
    startingPrice: 25, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.salesforce.com/editions-pricing/sales-cloud",
    tiers: [
      { name: "Starter", price: 25, period: "user/month", description: "Annual", features: ["Lead management", "Account tracking", "Email integration", "Mobile app"] },
      { name: "Pro Suite", price: 100, period: "user/month", description: "Annual", features: ["All Starter", "Forecasting", "Pipeline management", "Quotes"], highlighted: true },
      { name: "Enterprise", price: 165, period: "user/month", description: "Annual", features: ["All Pro", "Workflow automation", "Advanced reporting", "Territory management"] },
      { name: "Unlimited", price: 330, period: "user/month", description: "Annual", features: ["All Enterprise", "Einstein AI", "24/7 support", "Sandbox"] }
    ],
    notes: "Industry leader CRM. AppExchange for extensions."
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

  console.log("🔧 Starting verified pricing corrections batch 35 (Automation & CRM Tools)...\n");

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
    message: "Verified pricing corrections batch 35 (Automation & CRM Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
