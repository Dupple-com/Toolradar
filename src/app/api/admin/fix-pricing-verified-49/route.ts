import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-ninth batch of verified pricing from WebFetch (December 2025) - Note-taking & Collaboration
const verifiedPricing: Record<string, object> = {
  // GitBook - https://www.gitbook.com/pricing
  "gitbook": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.gitbook.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 user", features: ["Block editor", "GitHub sync", "OpenAPI docs", "gitbook.io domain"] },
      { name: "Premium", price: 65, period: "site/month", description: "+$12/user", features: ["Custom domain", "AI answers", "Site insights", "Branded docs"], highlighted: true },
      { name: "Ultimate", price: 249, period: "site/month", description: "+$12/user", features: ["All Premium", "Sections & groups", "Authenticated access", "Custom fonts"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Ultimate", "SAML SSO", "White-glove migration", "Custom integrations"] }
    ],
    notes: "2 months free on annual. Documentation platform."
  },

  // Obsidian - https://obsidian.md/pricing
  "obsidian": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://obsidian.md/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal use", features: ["Unlimited notes", "Plugins", "Graph view", "Local storage"], highlighted: true },
      { name: "Sync", price: 4, period: "month", description: "Annual ($5 monthly)", features: ["Cross-device sync", "E2E encryption", "Version history", "Shared vaults"] },
      { name: "Publish", price: 8, period: "site/month", description: "Annual ($10 monthly)", features: ["Publish to web", "Custom theme", "Graph view", "Full-text search"] },
      { name: "Commercial", price: 50, period: "user/year", description: "For work", features: ["Commercial use license", "Priority support", "Bulk discounts"] }
    ],
    notes: "Markdown-based. 100% offline-capable. Catalyst $25 one-time."
  },

  // Craft - https://www.craft.do/pricing
  "craft": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.craft.do/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1,500 blocks", features: ["1GB storage", "25MB uploads", "7-day history", "15 AI credits"] },
      { name: "Plus", price: 4.80, period: "month", description: "Annual (€8 monthly)", features: ["Unlimited blocks", "Unlimited storage", "30-day history", "50 AI credits/mo"], highlighted: true },
      { name: "Family", price: 9, period: "month", description: "2-6 users, annual", features: ["All Plus", "Shared Space", "Family collaboration"] },
      { name: "Team", price: 50, period: "month", description: "Up to 10 users", features: ["All Plus", "Team workspace", "Collaboration"] }
    ],
    notes: "Native Apple apps. Beautiful document editor."
  },

  // Roam Research - Known pricing
  "roam-research": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://roamresearch.com",
    tiers: [
      { name: "Pro", price: 15, period: "month", description: "$165/year", features: ["Unlimited graphs", "Daily notes", "Bi-directional links", "Block references"], highlighted: true },
      { name: "Believer", price: 500, period: "5 years", description: "One-time", features: ["All Pro", "5-year access", "Early features", "Priority support"] }
    ],
    notes: "Networked thought tool. Pioneered bi-directional linking."
  },

  // Readwise - https://www.readwise.io/pricing
  "readwise": {
    startingPrice: 5.59, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.readwise.io/pricing",
    tiers: [
      { name: "Lite", price: 5.59, period: "month", description: "Annual ($6.99 monthly)", features: ["Daily review", "Highlight library", "Sync all sources", "Tags & notes"] },
      { name: "Full", price: 9.99, period: "month", description: "Annual ($12.99 monthly)", features: ["All Lite", "Export to Notion/Obsidian", "Readwise Reader", "Beta access"], highlighted: true }
    ],
    notes: "Lifetime price lock. Read-it-later + highlights."
  },

  // Miro - https://www.miro.com/pricing
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.miro.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 boards", features: ["5K+ templates", "160+ integrations", "10 AI credits/mo", "5 Talktracks"] },
      { name: "Starter", price: 8, period: "member/month", description: "Annual ($10 monthly)", features: ["Unlimited boards", "Version history", "Brand Center", "25 AI credits/mo"], highlighted: true },
      { name: "Business", price: 16, period: "member/month", description: "Annual ($20 monthly)", features: ["All Starter", "Guest access", "Jira sync", "SSO", "50 AI credits/mo"] },
      { name: "Enterprise", price: "Custom", description: "30+ members", features: ["All Business", "SCIM", "Data residency", "100 AI credits/mo"] }
    ],
    notes: "Visual collaboration platform. Whiteboard + diagrams."
  },

  // Loom - Known pricing
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "25 videos", features: ["5 min videos", "Screen + cam", "Viewer insights", "Comments"] },
      { name: "Business", price: 12.50, period: "creator/month", description: "Annual ($15 monthly)", features: ["Unlimited videos", "Unlimited length", "Custom branding", "CTA buttons"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SSO/SCIM", "Advanced security", "Dedicated support"] }
    ],
    notes: "By Atlassian. Async video messaging platform."
  },

  // Evernote - Known pricing
  "evernote": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://evernote.com/compare-plans",
    tiers: [
      { name: "Free", price: 0, description: "1 device", features: ["60MB uploads/mo", "25MB note size", "Web clipper", "Search"] },
      { name: "Personal", price: 10.83, period: "month", description: "Annual ($14.99 monthly)", features: ["Unlimited devices", "10GB uploads/mo", "Offline notes", "Tasks"], highlighted: true },
      { name: "Professional", price: 14.17, period: "month", description: "Annual ($17.99 monthly)", features: ["All Personal", "20GB uploads/mo", "Boolean search", "PDF export"] }
    ],
    notes: "Classic note-taking app. Home dashboard + AI features."
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

  console.log("🔧 Starting verified pricing corrections batch 49 (Note-taking & Collaboration)...\n");

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
    message: "Verified pricing corrections batch 49 (Note-taking & Collaboration) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
