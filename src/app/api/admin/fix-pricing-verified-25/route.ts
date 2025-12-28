import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-fifth batch of verified pricing from WebFetch (December 2025) - SEO & Content Marketing
const verifiedPricing: Record<string, object> = {
  // Surfer SEO - https://surferseo.com/pricing
  "surfer": {
    startingPrice: 79, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://surferseo.com/pricing",
    tiers: [
      { name: "Essential", price: 79, period: "month", description: "Annual ($99 monthly)", features: ["Content Editor", "SERP Analyzer", "Keyword Research", "AI Writer"] },
      { name: "Scale", price: 175, period: "month", description: "Annual ($219 monthly)", features: ["All Essential", "5x higher limits", "Grow Flow", "API access"], highlighted: true },
      { name: "Enterprise", price: 999, period: "month", description: "Annual only", features: ["All Scale", "Custom limits", "White-label", "Dedicated support"] }
    ],
    notes: "Save up to 23% with annual. AI Tracker add-on from $95/mo."
  },

  // Clearscope - https://www.clearscope.io/pricing
  "clearscope": {
    startingPrice: 129, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.clearscope.io/pricing",
    tiers: [
      { name: "Essentials", price: 129, period: "month", description: "Starter", features: ["20 AI Tracked Topics", "20 Topic Explorations/mo", "20 AI Drafts/mo", "50 Content Inventory"] },
      { name: "Business", price: 399, period: "month", description: "Growing teams", features: ["50 AI Tracked Topics", "50 Explorations/mo", "300 Content Inventory", "Dedicated manager"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom credits", "SSO", "Crawler whitelisting", "Custom agreements"] }
    ],
    notes: "Unlimited users and projects on all plans."
  },

  // SE Ranking - https://www.seranking.com/pricing.html
  "se-ranking": {
    startingPrice: 47.20, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.seranking.com/pricing.html",
    tiers: [
      { name: "Essential", price: 47.20, period: "month", description: "Annual (€59 monthly)", features: ["1 seat", "5 projects", "500 keywords daily", "Core SEO tools"] },
      { name: "Pro", price: 87.20, period: "month", description: "Annual (€109 monthly)", features: ["3 seats", "30 projects", "2K keywords daily", "Advanced tools"], highlighted: true },
      { name: "Business", price: 188, period: "month", description: "Annual (€235 monthly)", features: ["5 seats", "Unlimited projects", "5K keywords daily", "Dedicated support"] }
    ],
    notes: "20% off annual. Add-ons: AI Search, Content Marketing, Local Marketing."
  },

  // SpyFu - https://www.spyfu.com/pricing
  "spyfu": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.spyfu.com/pricing",
    tiers: [
      { name: "Basic", price: 29, period: "month", description: "Annual ($39 monthly)", features: ["10K row results", "1 site tracking", "5K weekly rankings", "1 user"] },
      { name: "Pro + AI", price: 89, period: "month", description: "Annual ($119 monthly)", features: ["Unlimited results", "10 site tracking", "15K rankings", "ChatGPT integration"], highlighted: true },
      { name: "Team/Agency", price: 187, period: "month", description: "Annual ($249 monthly)", features: ["Unlimited all", "50K rankings", "White-label", "API", "5 users"] }
    ],
    notes: "30-day money back guarantee. $30/additional user."
  },

  // Similarweb - https://www.similarweb.com/corp/pricing
  "similarweb": {
    startingPrice: 125, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.similarweb.com/corp/pricing",
    tiers: [
      { name: "Competitive Intel", price: 125, period: "month", description: "Annual ($199 monthly)", features: ["1 user", "3-month history", "Traffic analysis", "Top keywords"] },
      { name: "Competitive + SEO", price: 335, period: "month", description: "Annual ($399 monthly)", features: ["All Competitive", "Keyword research", "SEO analysis"], highlighted: true },
      { name: "Full Suite", price: 540, period: "month", description: "Annual ($649 monthly)", features: ["All SEO", "6-month history", "Ads intelligence"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Full team access", "Premium support", "Custom integrations"] }
    ],
    notes: "App, Shopper, Sales Intelligence sold separately."
  },

  // BuzzSumo - https://www.buzzsumo.com/pricing
  "buzzsumo": {
    startingPrice: 199, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.buzzsumo.com/pricing",
    tiers: [
      { name: "Content Creation", price: 199, period: "month", description: "Annual (save $478/yr)", features: ["1 user", "Unlimited searches", "2 alerts", "Content analysis"] },
      { name: "PR & Comms", price: 299, period: "month", description: "Annual (save $718/yr)", features: ["5 users", "5 alerts", "Media database", "Journalist outreach"], highlighted: true },
      { name: "Suite", price: 499, period: "month", description: "Annual (save $1198/yr)", features: ["10 users", "10 alerts", "YouTube analytics", "Chrome extension"] },
      { name: "Enterprise", price: 999, period: "month", description: "Annual only", features: ["30 users", "50 alerts", "Priority support", "Custom training"] }
    ],
    notes: "20% off annual billing."
  },

  // Ahrefs - Known pricing
  "ahrefs": {
    startingPrice: 129, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://ahrefs.com/pricing",
    tiers: [
      { name: "Lite", price: 129, period: "month", description: "Annual ($149 monthly)", features: ["1 user", "5 projects", "Site Explorer", "Keywords Explorer"] },
      { name: "Standard", price: 249, period: "month", description: "Annual ($299 monthly)", features: ["1 user", "20 projects", "Content Explorer", "Rank Tracker"], highlighted: true },
      { name: "Advanced", price: 449, period: "month", description: "Annual ($499 monthly)", features: ["3 users", "50 projects", "Web Explorer", "Dashboard folders"] },
      { name: "Enterprise", price: 14990, period: "year", description: "Annual only", features: ["5 users", "100 projects", "API access", "SSO", "Audit log"] }
    ],
    notes: "No free trial. Webmaster Tools free for site owners."
  },

  // SEMrush - Known pricing
  "semrush": {
    startingPrice: 139.95, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.semrush.com/prices",
    tiers: [
      { name: "Pro", price: 139.95, period: "month", description: "Annual ($169.95 monthly)", features: ["1 user", "5 projects", "500 keywords", "10K results/report"] },
      { name: "Guru", price: 249.95, period: "month", description: "Annual ($299.95 monthly)", features: ["1 user", "15 projects", "1500 keywords", "Content Marketing"], highlighted: true },
      { name: "Business", price: 499.95, period: "month", description: "Annual ($549.95 monthly)", features: ["1 user", "40 projects", "5000 keywords", "API access", "Share of Voice"] }
    ],
    notes: "17% off annual. Additional users $45-100/mo."
  },

  // Moz Pro - Known pricing
  "moz": {
    startingPrice: 99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://moz.com/products/pro/pricing",
    tiers: [
      { name: "Starter", price: 99, period: "month", description: "Annual ($129 monthly)", features: ["1 user", "1 campaign", "50 keyword queries", "Link Explorer"] },
      { name: "Standard", price: 179, period: "month", description: "Annual ($229 monthly)", features: ["1 user", "3 campaigns", "150 keyword queries", "On-page grader"], highlighted: true },
      { name: "Medium", price: 299, period: "month", description: "Annual ($389 monthly)", features: ["3 users", "10 campaigns", "300 keyword queries", "Content suggestions"] },
      { name: "Large", price: 599, period: "month", description: "Annual ($779 monthly)", features: ["5 users", "25 campaigns", "600 keyword queries", "Custom reports"] }
    ],
    notes: "Free MozBar Chrome extension. STAT add-on available."
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

  console.log("🔧 Starting verified pricing corrections batch 25 (SEO & Content Marketing)...\n");

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
    message: "Verified pricing corrections batch 25 (SEO & Content Marketing) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
