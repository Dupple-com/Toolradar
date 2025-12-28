import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Seventeenth batch of verified pricing from WebFetch (December 2025) - Low-Code & BI Tools
const verifiedPricing: Record<string, object> = {
  // Webflow - https://webflow.com/pricing (updated with more detail)
  "webflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://webflow.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["webflow.io domain", "2 pages", "50 CMS items", "1GB bandwidth"] },
      { name: "Basic", price: 14, period: "month", description: "Annual", features: ["Custom domain", "150 pages", "No CMS", "10GB bandwidth"] },
      { name: "CMS", price: 23, period: "month", description: "Annual", features: ["2000 CMS items", "50GB bandwidth", "Site search"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "Annual", features: ["20K CMS items", "2.5TB bandwidth", "File uploads"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom limits", "SLA", "Advanced security"] }
    ],
    notes: "Workspace plans from $19/mo"
  },

  // Softr - https://www.softr.io/pricing
  "softr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.softr.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 app", features: ["10 app users", "5K records", "Basic blocks"] },
      { name: "Basic", price: 49, period: "month", description: "Annual ($59 monthly)", features: ["3 apps", "20 users", "50K records", "Custom code"] },
      { name: "Professional", price: 139, period: "month", description: "Annual ($167 monthly)", features: ["Unlimited apps", "100 users", "500K records", "PWA"], highlighted: true },
      { name: "Business", price: 269, period: "month", description: "Annual ($323 monthly)", features: ["500 users", "1M records", "E-signatures"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "SAML", "Dedicated manager"] }
    ],
    notes: "30% off for education/nonprofit"
  },

  // Glide - https://www.glideapps.com/pricing
  "glide": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.glideapps.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited drafts", features: ["1 editor", "25K rows", "40+ components"] },
      { name: "Maker", price: 60, period: "month", description: "Starting price", features: ["Unlimited personal users", "3 apps", "500 updates"] },
      { name: "Business", price: 199, period: "month", description: "Annual", features: ["30 users included", "5K updates", "Workflows", "API"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Custom limits", "Account manager"] }
    ],
    notes: "$5/user, $0.02/update beyond included"
  },

  // Retool - https://retool.com/pricing
  "retool": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://retool.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users max", features: ["Unlimited apps", "500 workflow runs/mo", "5GB storage"] },
      { name: "Team", price: 9, period: "user/month", description: "Annual", features: ["5K workflow runs", "Staging env", "Versioning"], highlighted: true },
      { name: "Business", price: 46, period: "user/month", description: "Annual", features: ["Audit logs", "Portals", "Unlimited envs"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SAML/SSO", "Source control", "Custom branding"] }
    ],
    notes: "End users from €5/mo. 20% savings annually."
  },

  // Appsmith - https://www.appsmith.com/pricing
  "appsmith": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.appsmith.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 cloud users", features: ["5 workspaces", "3 Git repos", "Google SSO"] },
      { name: "Business", price: 15, period: "user/month", description: "Up to 99 users", features: ["Unlimited workspaces", "Custom roles", "Audit logs"], highlighted: true },
      { name: "Enterprise", price: 2500, period: "month", description: "100 users included", features: ["SAML/OIDC", "SCIM", "CI/CD", "SLA support"] }
    ],
    notes: "User-based pricing. No extra dev costs."
  },

  // ToolJet - https://www.tooljet.com/pricing
  "tooljet": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tooljet.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 builders", features: ["50 end users", "2 apps", "100 AI credits/mo"] },
      { name: "Starter", price: 19, period: "builder/month", description: "Annual", features: ["2K AI credits", "Unlimited add-ons"] },
      { name: "Pro", price: 79, period: "builder/month", description: "Annual", features: ["100 end users", "5 apps", "White labeling"] },
      { name: "Team", price: 199, period: "builder/month", description: "Annual", features: ["Unlimited users/apps", "SSO", "Audit logs"], highlighted: true }
    ],
    notes: "20% savings with annual billing"
  },

  // Budibase - https://www.budibase.com/pricing
  "budibase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.budibase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users cloud", features: ["Unlimited apps", "Unlimited automations", "Community support"] },
      { name: "Premium", price: 50, period: "creator/month", description: "Annual ($60 monthly)", features: ["No user limits", "Budibase AI", "Custom branding"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SCIM", "Audit logs", "Air-gapped", "SLA"] }
    ],
    notes: "Users: $5/mo. 20% off for nonprofits."
  },

  // NocoDB - https://www.nocodb.com/pricing
  "nocodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.nocodb.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 editors", features: ["1K records", "1GB storage", "100 webhooks/mo"] },
      { name: "Plus", price: 12, period: "month", description: "Annual ($15 monthly)", features: ["50K records", "20GB storage", "Unlimited seats after 9"], highlighted: true },
      { name: "Business", price: 24, period: "month", description: "Annual ($30 monthly)", features: ["300K records", "100GB", "SAML SSO"] },
      { name: "Enterprise", price: 1000, period: "month", description: "Starting price", features: ["Unlimited all", "White-labeling", "Air-gapped"] }
    ],
    notes: "Pay for 9 users, unlimited free after"
  },

  // Metabase - https://www.metabase.com/pricing
  "metabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.metabase.com/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full BI features", "Community support", "Basic embedding"] },
      { name: "Starter", price: 100, period: "month", description: "5 users included", features: ["Cloud-hosted", "3-day support", "Metabot AI"], highlighted: true },
      { name: "Pro", price: 575, period: "month", description: "10 users included", features: ["Row/column permissions", "White-label", "Interactive embedding"] },
      { name: "Enterprise", price: 20000, period: "year", description: "Starting price", features: ["Dedicated engineer", "Priority support", "Air-gapped"] }
    ],
    notes: "Additional users: $6-12/user/mo"
  },

  // Tableau - https://www.tableau.com/pricing/teams-orgs
  "tableau": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tableau.com/pricing/teams-orgs",
    tiers: [
      { name: "Viewer", price: 15, period: "user/month", description: "Annual", features: ["View dashboards", "Basic access"] },
      { name: "Explorer", price: 42, period: "user/month", description: "Annual", features: ["Edit dashboards", "Data exploration"] },
      { name: "Creator", price: 75, period: "user/month", description: "Annual", features: ["Full authoring", "Desktop + Prep", "Tableau Pulse"], highlighted: true },
      { name: "Enterprise Creator", price: 115, period: "user/month", description: "Annual", features: ["Data Management", "Advanced Management", "eLearning"] }
    ],
    notes: "Tableau+ with AI: Custom pricing"
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

  console.log("🔧 Starting verified pricing corrections batch 17 (Low-Code & BI Tools)...\n");

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
    message: "Verified pricing corrections batch 17 (Low-Code & BI Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
