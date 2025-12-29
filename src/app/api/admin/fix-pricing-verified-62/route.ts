import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 62: No-Code/Low-Code pricing
const verifiedPricing: Record<string, object> = {
  "webflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://webflow.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "2 projects", features: ["2 unhosted projects", "Staging only", "100 CMS items"] },
      { name: "Basic", price: 18, period: "month", description: "Annual", features: ["Custom domain", "500 form subs", "25K visits"], highlighted: true },
      { name: "CMS", price: 29, period: "month", description: "Annual", features: ["2K CMS items", "3 content editors", "API access"] }
    ],
    notes: "Site plans for hosting. Free for unhosted sites."
  },
  "framer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.framer.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Staging", features: ["Free staging", "1 project", "Framer badge"] },
      { name: "Mini", price: 5, period: "month", description: "Annual", features: ["Custom domain", "1K visitors", "No badge"], highlighted: true },
      { name: "Basic", price: 15, period: "month", description: "Annual", features: ["10K visitors", "20 CMS items", "Localization"] }
    ],
    notes: "Website builder. Free for staging sites."
  },
  "bubble": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://bubble.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["Bubble branding", "Limited", "Development only"] },
      { name: "Starter", price: 32, period: "month", description: "Annual", features: ["Custom domain", "API access", "Basic logs"], highlighted: true },
      { name: "Growth", price: 134, period: "month", description: "Annual", features: ["2 units", "10GB storage", "Scheduled workflows"] }
    ],
    notes: "Full-stack no-code. Free for learning."
  },
  "glide": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.glideapps.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited apps", "Limited rows", "Glide branding"] },
      { name: "Starter", price: 25, period: "month", description: "Annual", features: ["No branding", "25K rows", "Custom domain"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "Annual", features: ["Unlimited rows", "Roles", "API access"] }
    ],
    notes: "Apps from spreadsheets. Free tier."
  },
  "adalo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.adalo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["Unlimited apps", "200 actions", "Adalo branding"] },
      { name: "Starter", price: 45, period: "month", description: "Annual", features: ["No branding", "Custom domain", "5K actions"], highlighted: true },
      { name: "Professional", price: 65, period: "month", description: "Annual", features: ["App Store publish", "Unlimited actions", "Custom fonts"] }
    ],
    notes: "Native app builder. Free for learning."
  },
  "softr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.softr.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 app", features: ["1 app", "5 users", "Softr branding"] },
      { name: "Basic", price: 59, period: "month", description: "Annual", features: ["3 apps", "Custom domain", "No branding"], highlighted: true },
      { name: "Professional", price: 139, period: "month", description: "Annual", features: ["10 apps", "Unlimited users", "Memberships"] }
    ],
    notes: "Apps from Airtable. Free tier."
  },
  "stacker": {
    startingPrice: 59, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.stackerhq.com/pricing",
    tiers: [
      { name: "Starter", price: 59, period: "month", description: "5 users", features: ["5 team users", "1 app", "Customer portal"], highlighted: true },
      { name: "Team", price: 199, period: "month", description: "20 users", features: ["20 users", "3 apps", "Custom branding"] }
    ],
    notes: "Customer portals on spreadsheets."
  },
  "retool": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://retool.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "Unlimited apps", "Self-hosted"] },
      { name: "Team", price: 10, period: "user/month", description: "Standard", features: ["Unlimited users", "Version history", "Audit logs"], highlighted: true },
      { name: "Business", price: 50, period: "user/month", description: "Enterprise", features: ["SSO", "Environments", "Custom branding"] }
    ],
    notes: "Internal tools builder. Free for 5 users."
  },
  "appsmith": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.appsmith.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited apps", "Unlimited users", "Self-hosted"], highlighted: true },
      { name: "Business", price: 40, period: "user/month", description: "Annual", features: ["Cloud hosted", "SSO", "Audit logs"] }
    ],
    notes: "Open-source internal tool builder."
  },
  "tooljet": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tooljet.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited apps", "Unlimited users", "Self-hosted"], highlighted: true },
      { name: "Cloud", price: 20, period: "user/month", description: "Managed", features: ["Managed hosting", "Support", "Backups"] }
    ],
    notes: "Open-source low-code platform."
  },
  "budibase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://budibase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited apps", "Unlimited users", "Self-hosted"], highlighted: true },
      { name: "Premium", price: 50, period: "month", description: "5 users", features: ["Cloud hosting", "SSO", "Custom branding"] }
    ],
    notes: "Open-source internal tools platform."
  },
  "n8n": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://n8n.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["Unlimited workflows", "All nodes", "Fair-use policy"], highlighted: true },
      { name: "Starter", price: 20, period: "month", description: "Cloud", features: ["5 workflows", "2.5K executions", "Support"] },
      { name: "Pro", price: 50, period: "month", description: "Cloud", features: ["15 workflows", "10K executions", "All features"] }
    ],
    notes: "Workflow automation. Self-hosted free."
  },
  "zapier": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://zapier.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 tasks", features: ["100 tasks/mo", "5 Zaps", "2-step Zaps"] },
      { name: "Starter", price: 29.99, period: "month", description: "Annual", features: ["750 tasks", "20 Zaps", "Multi-step"], highlighted: true },
      { name: "Professional", price: 73.50, period: "month", description: "Annual", features: ["2K tasks", "Unlimited Zaps", "Paths"] }
    ],
    notes: "Automation platform. Free tier available."
  },
  "make": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.make.com/en/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K ops", features: ["1K ops/mo", "2 scenarios", "5 min interval"] },
      { name: "Core", price: 10.59, period: "month", description: "Annual", features: ["10K ops", "Unlimited scenarios", "1 min interval"], highlighted: true },
      { name: "Pro", price: 18.82, period: "month", description: "Annual", features: ["10K ops", "Custom functions", "Priority"] }
    ],
    notes: "Formerly Integromat. Automation platform."
  },
  "pipedream": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pipedream.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "300 credits", features: ["300 credits/day", "Unlimited workflows", "All integrations"], highlighted: true },
      { name: "Basic", price: 29, period: "month", description: "Annual", features: ["8400 credits/mo", "2 always-on", "Support"] },
      { name: "Advanced", price: 99, period: "month", description: "Annual", features: ["20K credits/mo", "Workspaces", "Team features"] }
    ],
    notes: "Connect APIs with code. Generous free tier."
  },
  "xano": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.xano.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["1 instance", "10K records", "50K API calls"] },
      { name: "Launch", price: 85, period: "month", description: "Annual", features: ["5 instances", "100K records", "Unlimited API"], highlighted: true },
      { name: "Scale", price: 170, period: "month", description: "Annual", features: ["10 instances", "500K records", "Branches"] }
    ],
    notes: "No-code backend. Free tier."
  },
  "supabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["500MB database", "1GB storage", "2 projects"] },
      { name: "Pro", price: 25, period: "month", description: "Production", features: ["8GB database", "100GB storage", "Daily backups"], highlighted: true }
    ],
    notes: "Open-source Firebase alternative."
  },
  "pocketbase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pocketbase.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Real-time DB", "Auth", "File storage", "Single file"], highlighted: true }],
    notes: "Free and open source. Single Go binary."
  },
  "flutterflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://flutterflow.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Unlimited projects", "Preview mode", "Community support"] },
      { name: "Standard", price: 30, period: "month", description: "Annual", features: ["Code download", "Custom code", "Integrations"], highlighted: true },
      { name: "Pro", price: 70, period: "month", description: "Annual", features: ["Team features", "Git sync", "Branches"] }
    ],
    notes: "Build Flutter apps visually. Free tier."
  },
  "draftbit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://draftbit.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["2 apps", "Expo builds", "Community"] },
      { name: "Starter", price: 19, period: "month", description: "Annual", features: ["Unlimited apps", "Export code", "No branding"], highlighted: true }
    ],
    notes: "Mobile app builder. Free tier."
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
    message: "Pricing batch 62 (No-Code/Low-Code) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
