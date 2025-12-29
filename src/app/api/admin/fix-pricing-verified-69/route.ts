import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 69: Documentation & Knowledge Base pricing
const verifiedPricing: Record<string, object> = {
  "notion": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.notion.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited pages", "Share with 10 guests", "7-day history"] },
      { name: "Plus", price: 8, period: "user/month", description: "Annual", features: ["Unlimited guests", "30-day history", "100MB uploads"], highlighted: true },
      { name: "Business", price: 15, period: "user/month", description: "Annual", features: ["SAML SSO", "90-day history", "Private spaces"] }
    ],
    notes: "All-in-one workspace. Free for personal."
  },
  "confluence": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.atlassian.com/software/confluence/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 users", features: ["10 users", "2GB storage", "Basic features"] },
      { name: "Standard", price: 5.16, period: "user/month", description: "Annual", features: ["Unlimited users", "250GB", "Page analytics"], highlighted: true }
    ],
    notes: "Team wiki. Free for 10 users."
  },
  "gitbook": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.gitbook.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 public space", "Basic customization", "Community support"] },
      { name: "Plus", price: 6.70, period: "user/month", description: "Annual", features: ["Private spaces", "Custom domains", "Visitor auth"], highlighted: true }
    ],
    notes: "Documentation platform. Free tier."
  },
  "docusaurus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://docusaurus.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Static site", "MDX support", "Versioning", "Search"], highlighted: true }],
    notes: "Free and open source from Meta."
  },
  "mintlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mintlify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["1 user", "Public docs", "Basic analytics"] },
      { name: "Startup", price: 120, period: "month", description: "Starting", features: ["5 users", "Custom domains", "Analytics"], highlighted: true }
    ],
    notes: "Modern documentation platform."
  },
  "readme": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://readme.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1 project", "Basic features", "Community support"] },
      { name: "Startup", price: 99, period: "month", description: "Annual", features: ["3 projects", "Custom domains", "Basic analytics"], highlighted: true }
    ],
    notes: "API documentation platform."
  },
  "slite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://slite.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 docs", features: ["50 docs", "Unlimited members", "Basic features"] },
      { name: "Standard", price: 8, period: "member/month", description: "Annual", features: ["Unlimited docs", "Integrations", "Analytics"], highlighted: true }
    ],
    notes: "Team knowledge base. Free tier."
  },
  "coda": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://coda.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited docs", "Sharing", "Templates"], highlighted: true },
      { name: "Pro", price: 10, period: "doc maker/month", description: "Annual", features: ["Unlimited editors", "Packs", "Version history"] }
    ],
    notes: "Docs with app functionality. Free tier."
  },
  "outline": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.getoutline.com/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Open source", features: ["Full features", "Self-hosted", "No limits"], highlighted: true },
      { name: "Cloud", price: 6, period: "user/month", description: "Annual", features: ["Managed hosting", "SSO", "Support"] }
    ],
    notes: "Open-source wiki. Self-hosted free."
  },
  "bookstack": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.bookstackapp.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Self-hosted", "WYSIWYG editor", "Diagram drawing", "Multi-language"], highlighted: true }],
    notes: "Free and open source wiki platform."
  },
  "wiki-js": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://js.wiki",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Self-hosted", "100+ modules", "Git sync", "Auth providers"], highlighted: true }],
    notes: "Free and open source wiki engine."
  },
  "tettra": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://tettra.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 users", features: ["10 users", "50 pages", "Slack integration"] },
      { name: "Scaling", price: 8.33, period: "user/month", description: "Annual", features: ["Unlimited pages", "Analytics", "SSO"], highlighted: true }
    ],
    notes: "Knowledge base for teams. Free tier."
  },
  "guru": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.getguru.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 users", features: ["3 users", "Basic features", "Chrome extension"] },
      { name: "Builder", price: 10, period: "user/month", description: "Annual", features: ["Unlimited users", "Analytics", "Integrations"], highlighted: true }
    ],
    notes: "Knowledge management. Free for 3 users."
  },
  "slab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://slab.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 users", features: ["10 users", "Basic features", "Unlimited docs"] },
      { name: "Startup", price: 6.67, period: "user/month", description: "Annual", features: ["All integrations", "Analytics", "SAML"], highlighted: true }
    ],
    notes: "Modern knowledge base. Free tier."
  },
  "helpjuice": {
    startingPrice: 120, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://helpjuice.com/pricing",
    tiers: [
      { name: "Starter", price: 120, period: "month", description: "4 users", features: ["4 users", "All features", "AI search"], highlighted: true },
      { name: "Run-Up", price: 200, period: "month", description: "16 users", features: ["16 users", "All features", "Priority support"] }
    ],
    notes: "Enterprise knowledge base."
  },
  "document360": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://document360.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 accounts", features: ["2 team accounts", "50 articles", "Public docs"] },
      { name: "Standard", price: 149, period: "month", description: "3 accounts", features: ["3 accounts", "Unlimited articles", "Private docs"], highlighted: true }
    ],
    notes: "Knowledge base for software."
  },
  "archbee": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.archbee.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "Unlimited docs", "Basic features"] },
      { name: "Team", price: 8, period: "user/month", description: "Annual", features: ["Custom domains", "Advanced permissions", "Analytics"], highlighted: true }
    ],
    notes: "Developer documentation tool."
  },
  "nuclino": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.nuclino.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 items", features: ["50 items", "2GB storage", "Basic features"] },
      { name: "Standard", price: 5, period: "user/month", description: "Annual", features: ["Unlimited items", "10GB storage", "Integrations"], highlighted: true }
    ],
    notes: "Lightweight wiki. Free tier."
  },
  "clickup-docs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://clickup.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever", features: ["100MB storage", "Unlimited tasks", "Docs included"] },
      { name: "Unlimited", price: 7, period: "user/month", description: "Annual", features: ["Unlimited storage", "Unlimited integrations", "Dashboards"], highlighted: true }
    ],
    notes: "Docs built into ClickUp. Free tier."
  },
  "dropbox-paper": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.dropbox.com/paper",
    tiers: [{ name: "Free", price: 0, description: "With Dropbox", features: ["Real-time collaboration", "Task management", "Templates", "Dropbox integration"], highlighted: true }],
    notes: "Free with Dropbox account."
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
    message: "Pricing batch 69 (Documentation & Knowledge Base) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
