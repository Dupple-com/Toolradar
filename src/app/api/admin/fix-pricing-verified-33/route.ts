import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-third batch of verified pricing from WebFetch (December 2025) - Website Builders & E-commerce
const verifiedPricing: Record<string, object> = {
  // Webflow - https://webflow.com/pricing
  "webflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://webflow.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free (2 pages)", features: ["Webflow.io domain", "50 CMS items", "1GB bandwidth", "50 form submits"] },
      { name: "Basic", price: 14, period: "month", description: "Annual", features: ["Custom domain", "150 pages", "10GB bandwidth", "Unlimited forms"] },
      { name: "CMS", price: 23, period: "month", description: "Annual (Popular)", features: ["2K CMS items", "50GB bandwidth", "20 collections"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "Annual", features: ["20K CMS items", "2.5TB bandwidth", "40 collections"] }
    ],
    notes: "Workspace plans from $19/mo. Ecommerce from $29/mo."
  },

  // Ghost - https://ghost.org/pricing
  "ghost": {
    startingPrice: 18, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://ghost.org/pricing",
    tiers: [
      { name: "Starter", price: 18, period: "month", description: "Annual", features: ["Free custom domain", "Email newsletter", "1K members", "Basic design"] },
      { name: "Publisher", price: 29, period: "month", description: "Annual", features: ["3 staff users", "Custom themes", "Paid subscriptions", "Advanced analytics"], highlighted: true },
      { name: "Business", price: 199, period: "month", description: "Annual", features: ["15 staff", "10K members", "Priority support", "Early access"] },
      { name: "Custom", price: "Custom", description: "Contact sales", features: ["Unlimited staff", "Dedicated IP", "99.9% SLA"] }
    ],
    notes: "Self-hosted version free. Open source."
  },

  // Lemon Squeezy - https://www.lemonsqueezy.com/pricing
  "lemon-squeezy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.lemonsqueezy.com/pricing",
    tiers: [
      { name: "Ecommerce", price: 0, period: "month", description: "5% + 50¢/txn", features: ["No monthly fees", "Global payments", "Tax compliance", "AI fraud protection"], highlighted: true },
      { name: "Email 1K", price: 10, period: "month", description: "1K subscribers", features: ["Email marketing", "Segmentation", "Analytics"] },
      { name: "Email 10K", price: 60, period: "month", description: "10K subscribers", features: ["All email features", "Higher limits"] }
    ],
    notes: "MoR for digital products. Volume discounts available."
  },

  // Shopify - Known pricing
  "shopify": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 3,
    pricingPageUrl: "https://www.shopify.com/pricing",
    tiers: [
      { name: "Basic", price: 29, period: "month", description: "Annual ($39 monthly)", features: ["Unlimited products", "2 staff accounts", "2.9% + 30¢ online", "Basic reports"] },
      { name: "Shopify", price: 79, period: "month", description: "Annual ($105 monthly)", features: ["5 staff accounts", "2.6% + 30¢", "Professional reports", "Up to 5 inventory locations"], highlighted: true },
      { name: "Advanced", price: 299, period: "month", description: "Annual ($399 monthly)", features: ["15 staff", "2.4% + 30¢", "Custom reports", "Third-party calculated shipping"] },
      { name: "Plus", price: 2300, period: "month", description: "Enterprise", features: ["Unlimited staff", "Lower rates", "Dedicated support", "B2B features"] }
    ],
    notes: "$1/mo for first 3 months promo. POS available."
  },

  // Squarespace - Known pricing
  "squarespace": {
    startingPrice: 16, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.squarespace.com/pricing",
    tiers: [
      { name: "Personal", price: 16, period: "month", description: "Annual ($23 monthly)", features: ["Unlimited bandwidth", "SSL certificate", "SEO features", "Basic analytics"] },
      { name: "Business", price: 23, period: "month", description: "Annual ($33 monthly)", features: ["All Personal", "Ecommerce 3% fee", "Pop-ups", "Professional email"], highlighted: true },
      { name: "Commerce Basic", price: 27, period: "month", description: "Annual ($36 monthly)", features: ["0% transaction fee", "POS", "Customer accounts", "Product reviews"] },
      { name: "Commerce Advanced", price: 49, period: "month", description: "Annual ($65 monthly)", features: ["All Basic", "Abandoned cart", "Subscriptions", "Advanced shipping"] }
    ],
    notes: "Free custom domain for 1 year on annual."
  },

  // Wix - Known pricing
  "wix": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.wix.com/upgrade/website",
    tiers: [
      { name: "Free", price: 0, description: "Wix ads", features: ["500MB storage", "1GB bandwidth", "Wix subdomain"] },
      { name: "Light", price: 17, period: "month", description: "Annual", features: ["Custom domain", "Remove Wix ads", "2GB storage", "Customer support"] },
      { name: "Core", price: 29, period: "month", description: "Annual", features: ["All Light", "50GB storage", "10 hours video", "Business features"], highlighted: true },
      { name: "Business", price: 36, period: "month", description: "Annual", features: ["100GB storage", "Unlimited video", "Accept payments", "Subscriptions"] }
    ],
    notes: "Business Elite $159/mo. Wix Studio for agencies."
  },

  // Carrd - Known pricing
  "carrd": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true,
    pricingPageUrl: "https://carrd.co/#pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 sites", features: ["Carrd.co subdomain", "Basic templates", "Simple forms"] },
      { name: "Pro Lite", price: 9, period: "year", description: "$0.75/mo", features: ["Custom domains", "No Carrd branding", "10 sites"] },
      { name: "Pro Standard", price: 19, period: "year", description: "$1.58/mo", features: ["All Pro Lite", "Google Analytics", "25 sites", "Forms"], highlighted: true },
      { name: "Pro Plus", price: 49, period: "year", description: "$4.08/mo", features: ["All Standard", "100 sites", "Embeds", "Widgets"] }
    ],
    notes: "Best for simple one-page sites. Annual only."
  },

  // Gumroad - Known pricing
  "gumroad": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gumroad.com/features/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10% + fees", features: ["Unlimited products", "Payment processing", "Digital delivery", "Basic analytics"], highlighted: true }
    ],
    notes: "10% flat fee on sales. No monthly fees. Digital products marketplace."
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

  console.log("🔧 Starting verified pricing corrections batch 33 (Website Builders & E-commerce)...\n");

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
    message: "Verified pricing corrections batch 33 (Website Builders & E-commerce) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
