import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-seventh batch of verified pricing from WebFetch (December 2025) - Email Marketing
const verifiedPricing: Record<string, object> = {
  // Mailchimp - https://mailchimp.com/pricing
  "mailchimp": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mailchimp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 contacts", features: ["500 emails/mo", "1 audience", "1 user", "Email templates"] },
      { name: "Essentials", price: 11.11, period: "month", description: "Up to 50K contacts", features: ["10x contact emails", "4-step automations", "3 audiences", "24/7 support"], highlighted: true },
      { name: "Standard", price: 17.09, period: "month", description: "Up to 100K contacts", features: ["12x emails", "200-step flows", "Dynamic content", "5 audiences"] },
      { name: "Premium", price: 299.11, period: "month", description: "Up to 250K contacts", features: ["15x emails", "Unlimited users", "Phone support", "Custom integration"] }
    ],
    notes: "15% off annual for 10K+ contacts. Intuit company."
  },

  // Kit (ConvertKit) - https://kit.com/pricing
  "convertkit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://kit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "10K subscribers", features: ["Unlimited broadcasts", "Landing pages", "Sell digital products", "Email support"] },
      { name: "Creator", price: 33, period: "month", description: "1K subs ($390/yr)", features: ["Visual Automations", "2 users", "Remove branding", "100+ integrations"], highlighted: true },
      { name: "Pro", price: 66, period: "month", description: "1K subs ($790/yr)", features: ["All Creator", "A/B testing", "FB audiences", "Referral system", "Priority support"] }
    ],
    notes: "Rebranded from ConvertKit to Kit. Scales by subscriber count."
  },

  // Brevo (Sendinblue) - https://www.brevo.com/pricing
  "brevo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.brevo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "300 emails/day", features: ["Email editor", "Templates", "Forms", "Basic analytics"] },
      { name: "Starter", price: 9, period: "month", description: "5K emails/mo", features: ["No daily limit", "AI content", "Advanced segmentation"] },
      { name: "Business", price: 18, period: "month", description: "5K emails/mo", features: ["Marketing automation", "A/B testing", "Landing pages", "No Brevo logo"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "1M+ contacts", features: ["WhatsApp/Push", "10 users", "Phone support", "SSO"] }
    ],
    notes: "10% off annual. Formerly Sendinblue. SMS separate."
  },

  // GetResponse - https://www.getresponse.com/pricing
  "getresponse": {
    startingPrice: 13.12, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.getresponse.com/pricing",
    tiers: [
      { name: "Starter", price: 13.12, period: "month", description: "Annual (1K contacts)", features: ["Unlimited emails", "AI content", "1 automation", "Landing pages"] },
      { name: "Marketer", price: 44.28, period: "month", description: "Annual (1K contacts)", features: ["Unlimited automations", "Abandoned cart", "Sales funnels", "Web push"], highlighted: true },
      { name: "Creator", price: 50.84, period: "month", description: "Annual (1K contacts)", features: ["All Marketer", "Courses", "5 websites", "Webinars 100 attendees"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SMS marketing", "AI recommendations", "Dedicated support"] }
    ],
    notes: "18% off annual vs monthly. Scales by list size."
  },

  // AWeber - https://www.aweber.com/pricing.htm
  "aweber": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.aweber.com/pricing.htm",
    tiers: [
      { name: "Lite", price: 15, period: "month", description: "Up to 150K subs", features: ["10x email volume", "1 list", "3 automations", "1% transaction fee"] },
      { name: "Plus", price: 30, period: "month", description: "Unlimited subs", features: ["12x email volume", "Unlimited lists", "0.6% transaction fee", "Remove branding"], highlighted: true },
      { name: "Done For You", price: 20, period: "month", description: "+ $79 setup", features: ["All Plus", "Expert setup", "Weekly newsletter drafts", "1:1 call"] }
    ],
    notes: "High-volume custom pricing for 150K+ subscribers."
  },

  // Drip - https://www.drip.com/pricing
  "drip": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.drip.com/pricing",
    tiers: [
      { name: "2.5K People", price: 39, period: "month", description: "Base tier", features: ["Unlimited emails", "Dynamic segments", "50 workflows", "Open API"], highlighted: true },
      { name: "5K People", price: 89, period: "month", description: "Scaling", features: ["All base", "Chat support", "Unlimited sub-accounts"] },
      { name: "10K People", price: 154, period: "month", description: "Growing", features: ["All features", "Free migration", "Personalized onboarding"] }
    ],
    notes: "Ecommerce-focused. Scales by active contacts."
  },

  // ActiveCampaign - https://www.activecampaign.com/pricing
  "activecampaign": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.activecampaign.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "1K contacts", features: ["10x email sends", "5 automation actions", "Email & forms", "Basic CRM"] },
      { name: "Plus", price: 49, period: "month", description: "1K contacts", features: ["Unlimited automations", "Advanced segmentation", "Landing pages"], highlighted: true },
      { name: "Pro", price: 149, period: "month", description: "1K contacts", features: ["All Plus", "3 users", "Salesforce integration", "12x email sends"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "5 users", "Custom reporting", "Dedicated account team"] }
    ],
    notes: "WhatsApp plans from $15/mo. CRM included all plans."
  },

  // Klaviyo - Known pricing
  "klaviyo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.klaviyo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 contacts", features: ["500 emails/mo", "150 SMS credits", "Email support", "Core features"] },
      { name: "Email", price: 20, period: "month", description: "251-500 contacts", features: ["5K emails/mo", "Basic flows", "Reports", "Mobile push"], highlighted: true },
      { name: "Email + SMS", price: 35, period: "month", description: "251-500 contacts", features: ["All Email", "SMS campaigns", "1,250 SMS credits"] }
    ],
    notes: "Scales by contacts. Ecommerce-focused. Shopify Plus partner."
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

  console.log("🔧 Starting verified pricing corrections batch 27 (Email Marketing)...\n");

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
    message: "Verified pricing corrections batch 27 (Email Marketing) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
