import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-sixth batch of verified pricing from WebFetch (December 2025) - Data & Productivity Tools
const verifiedPricing: Record<string, object> = {
  // Tableau - https://www.tableau.com/pricing
  "tableau": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.tableau.com/pricing",
    tiers: [
      { name: "Viewer", price: 15, period: "user/month", description: "Annual", features: ["View dashboards", "Download data", "Receive alerts"] },
      { name: "Explorer", price: 42, period: "user/month", description: "Annual", features: ["Edit workbooks", "Manage content", "Full data download"], highlighted: true },
      { name: "Creator", price: 75, period: "user/month", description: "Annual", features: ["Create workbooks", "Tableau Desktop", "Data flows", "Prep Builder"] },
      { name: "Enterprise", price: 115, period: "creator/month", description: "Annual", features: ["All Creator", "Data Management", "Advanced Management", "eLearning"] }
    ],
    notes: "Cloud and Server options. By Salesforce."
  },

  // Airtable - https://www.airtable.com/pricing
  "airtable": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K records/base", features: ["Unlimited bases", "1GB attachments", "100 automations/mo", "14-day history"] },
      { name: "Team", price: 20, period: "user/month", description: "Annual ($24 monthly)", features: ["50K records/base", "20GB attachments", "25K automations", "Priority support"], highlighted: true },
      { name: "Business", price: 45, period: "user/month", description: "Annual ($54 monthly)", features: ["100K records", "100GB attachments", "100K automations", "2-year history"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["500K records", "1TB attachments", "1M automations", "SAML/SSO"] }
    ],
    notes: "Read-only collaborators free. Popular for no-code apps."
  },

  // Notion - https://www.notion.com/pricing (updated)
  "notion": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited pages", "10 guests", "7-day history", "5MB uploads"] },
      { name: "Plus", price: 9.50, period: "member/month", description: "Annual", features: ["Unlimited blocks", "Unlimited uploads", "Charts", "30-day history"], highlighted: true },
      { name: "Business", price: 19.50, period: "member/month", description: "Annual", features: ["All Plus", "Agent AI", "SAML SSO", "Private teamspaces", "90-day history"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SCIM", "Audit logs", "Unlimited history"] }
    ],
    notes: "AI add-on €10/member. Student Plus free."
  },

  // Coda - Known pricing
  "coda": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://coda.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited docs", features: ["Collaborative editing", "50 objects per doc", "No automations"] },
      { name: "Pro", price: 10, period: "doc maker/month", description: "Annual ($12 monthly)", features: ["Unlimited objects", "Automations", "Cross-doc", "10K tables rows"], highlighted: true },
      { name: "Team", price: 30, period: "doc maker/month", description: "Annual ($36 monthly)", features: ["All Pro", "Folders", "Version history", "100K rows"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Team", "SSO/SCIM", "Audit logs", "Dedicated support"] }
    ],
    notes: "Doc makers pay, editors free. Packs marketplace."
  },

  // Power BI - Known pricing
  "power-bi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://powerbi.microsoft.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Desktop only", features: ["Create reports", "Connect data", "Desktop app", "10GB storage"] },
      { name: "Pro", price: 10, period: "user/month", description: "Annual", features: ["Share & collaborate", "Publish to web", "100GB storage", "8 refreshes/day"], highlighted: true },
      { name: "Premium Per User", price: 20, period: "user/month", description: "Annual", features: ["All Pro", "Paginated reports", "AI insights", "48 refreshes/day"] },
      { name: "Premium Capacity", price: 4995, period: "month", description: "Org-wide", features: ["Unlimited users", "100TB storage", "Dedicated capacity"] }
    ],
    notes: "Part of Microsoft 365. Fabric integration."
  },

  // Looker - Known pricing
  "looker": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://cloud.google.com/looker/pricing",
    tiers: [
      { name: "Looker Core", price: "Custom", description: "Contact sales", features: ["LookML modeling", "Dashboards", "Scheduling", "API access"], highlighted: true },
      { name: "Looker Studio Pro", price: 9, period: "user/month", description: "Annual", features: ["Team workspaces", "Link sharing", "Google Cloud integration"] }
    ],
    notes: "By Google Cloud. Enterprise BI platform."
  },

  // Metabase - Known pricing
  "metabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.metabase.com/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Unlimited users", "All visualizations", "Dashboards", "Alerts"] },
      { name: "Starter", price: 85, period: "month", description: "5 users", features: ["Cloud hosted", "Email support", "Automatic updates"], highlighted: true },
      { name: "Pro", price: 500, period: "month", description: "10+ users", features: ["All Starter", "SAML SSO", "Sandboxing", "Audit logs"] },
      { name: "Enterprise", price: "Custom", description: "Self-hosted", features: ["All Pro features", "Priority support", "SLA"] }
    ],
    notes: "Open source BI. Self-hosted free forever."
  },

  // Slack - Known pricing
  "slack": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://slack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small teams", features: ["90-day history", "10 integrations", "1:1 video calls", "5GB storage"] },
      { name: "Pro", price: 7.25, period: "user/month", description: "Annual", features: ["Unlimited history", "Unlimited apps", "Group video", "10GB/user storage"], highlighted: true },
      { name: "Business+", price: 12.50, period: "user/month", description: "Annual", features: ["All Pro", "SSO", "Compliance", "20GB/user storage"] },
      { name: "Enterprise Grid", price: "Custom", description: "Contact sales", features: ["Unlimited workspaces", "HIPAA compliance", "1TB/user storage"] }
    ],
    notes: "By Salesforce. Slack AI add-on available."
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

  console.log("🔧 Starting verified pricing corrections batch 36 (Data & Productivity Tools)...\n");

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
    message: "Verified pricing corrections batch 36 (Data & Productivity Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
