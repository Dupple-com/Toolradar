import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 70: Forms & Surveys pricing
const verifiedPricing: Record<string, object> = {
  "typeform": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.typeform.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["10 responses/mo", "Unlimited forms", "Basic logic"] },
      { name: "Basic", price: 25, period: "month", description: "Annual", features: ["100 responses", "File upload", "Payment"], highlighted: true },
      { name: "Plus", price: 50, period: "month", description: "Annual", features: ["1000 responses", "Branding removal", "Custom URLs"] }
    ],
    notes: "Beautiful interactive forms. Free tier."
  },
  "jotform": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.jotform.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["5 forms", "100 submissions/mo", "100MB storage"], highlighted: true },
      { name: "Bronze", price: 34, period: "month", description: "Annual", features: ["25 forms", "1K submissions", "10GB storage"] }
    ],
    notes: "Form builder. Generous free tier."
  },
  "google-forms": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.google.com/forms/about",
    tiers: [{ name: "Free", price: 0, description: "With Google account", features: ["Unlimited forms", "Unlimited responses", "Google Sheets integration"], highlighted: true }],
    notes: "Free with Google account."
  },
  "tally": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://tally.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited", features: ["Unlimited forms", "Unlimited responses", "Most features"], highlighted: true },
      { name: "Pro", price: 29, period: "month", description: "Annual", features: ["Custom domains", "Remove branding", "Team features"] }
    ],
    notes: "Free form builder. Very generous."
  },
  "surveymonkey": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.surveymonkey.com/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["10 questions/survey", "100 responses", "Basic features"] },
      { name: "Individual", price: 35, period: "month", description: "Annual", features: ["Unlimited questions", "15K responses/year", "Export"], highlighted: true }
    ],
    notes: "Survey platform. Free tier limited."
  },
  "airtable-forms": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1000 records/base", "1GB attachments", "Forms included"] },
      { name: "Team", price: 20, period: "seat/month", description: "Annual", features: ["50K records/base", "20GB", "Extensions"], highlighted: true }
    ],
    notes: "Forms linked to Airtable bases."
  },
  "paperform": {
    startingPrice: 20, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://paperform.co/pricing",
    tiers: [
      { name: "Essentials", price: 20, period: "month", description: "Annual", features: ["Unlimited forms", "1K submissions/mo", "Payments"], highlighted: true },
      { name: "Pro", price: 40, period: "month", description: "Annual", features: ["10K submissions", "Custom PDF", "Priority support"] }
    ],
    notes: "Beautiful forms with payments."
  },
  "cognito-forms": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.cognitoforms.com/pricing",
    tiers: [
      { name: "Individual", price: 0, description: "Free", features: ["Unlimited forms", "500 entries/mo", "Calculations"], highlighted: true },
      { name: "Pro", price: 15, period: "month", description: "Annual", features: ["2000 entries", "File uploads", "Custom branding"] }
    ],
    notes: "Free form builder with calculations."
  },
  "formstack": {
    startingPrice: 50, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.formstack.com/pricing",
    tiers: [
      { name: "Starter", price: 50, period: "month", description: "Annual", features: ["1 user", "20 forms", "1K submissions"], highlighted: true },
      { name: "Team", price: 83, period: "month", description: "Annual", features: ["5 users", "100 forms", "10K submissions"] }
    ],
    notes: "Enterprise form builder."
  },
  "wufoo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.wufoo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["5 forms", "100 entries/mo", "10 fields/form"] },
      { name: "Starter", price: 14.08, period: "month", description: "Annual", features: ["10 forms", "1K entries", "Payments"], highlighted: true }
    ],
    notes: "Simple form builder. Free tier."
  },
  "fillout": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.fillout.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K responses", features: ["1K responses/mo", "Unlimited forms", "Most features"], highlighted: true },
      { name: "Starter", price: 19, period: "month", description: "Annual", features: ["5K responses", "Custom domains", "Zapier"] }
    ],
    notes: "Modern form builder. Generous free tier."
  },
  "formspark": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://formspark.io/#pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 submissions", features: ["250 submissions", "Unlimited forms", "Spam protection"], highlighted: true },
      { name: "Personal", price: 25, period: "once", description: "1K submissions", features: ["1K submissions", "No monthly fee", "File uploads"] }
    ],
    notes: "Static form backend. Free tier."
  },
  "formspree": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://formspree.io/plans",
    tiers: [
      { name: "Free", price: 0, description: "50 submissions", features: ["50 submissions/mo", "Unlimited forms", "Email only"], highlighted: true },
      { name: "Gold", price: 10, period: "month", description: "Monthly", features: ["1K submissions", "File uploads", "AJAX support"] }
    ],
    notes: "Form backend for developers."
  },
  "basin": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://usebasin.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 submissions", features: ["100 submissions/mo", "Unlimited forms", "Spam filtering"], highlighted: true },
      { name: "Pro", price: 9, period: "month", description: "Monthly", features: ["5K submissions", "Integrations", "File uploads"] }
    ],
    notes: "Form backend service."
  },
  "getform": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://getform.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 submissions", features: ["50 submissions/mo", "1 form", "Email notifications"], highlighted: true },
      { name: "Starter", price: 9, period: "month", description: "Monthly", features: ["1K submissions", "Unlimited forms", "File uploads"] }
    ],
    notes: "Form backend for static sites."
  },
  "reform": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.reform.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 responses", features: ["100 responses/mo", "Unlimited forms", "Basic logic"] },
      { name: "Starter", price: 19, period: "month", description: "Annual", features: ["1K responses", "Custom branding", "Webhooks"], highlighted: true }
    ],
    notes: "Form builder for teams."
  },
  "heyflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://heyflow.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 leads", features: ["100 leads/mo", "1 flow", "HeyFlow branding"] },
      { name: "Starter", price: 59, period: "month", description: "Annual", features: ["500 leads", "3 flows", "Custom branding"], highlighted: true }
    ],
    notes: "Interactive flow builder."
  },
  "involve-me": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.involve.me/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 submissions", features: ["100 submissions/mo", "Basic features", "Branding"] },
      { name: "Starter", price: 29, period: "month", description: "Annual", features: ["1K submissions", "Custom branding", "Integrations"], highlighted: true }
    ],
    notes: "Interactive content builder."
  },
  "tripetto": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://tripetto.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Trial", features: ["Limited responses", "Basic features", "Tripetto branding"] },
      { name: "Pro", price: 99, period: "year", description: "Annual", features: ["5K responses", "Custom branding", "Integrations"], highlighted: true }
    ],
    notes: "Conversational form builder."
  },
  "feathery": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.feathery.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 submissions", features: ["100 submissions/mo", "Unlimited forms", "Basic features"] },
      { name: "Startup", price: 49, period: "month", description: "Annual", features: ["2500 submissions", "Custom branding", "Logic"], highlighted: true }
    ],
    notes: "No-code form builder."
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
    message: "Pricing batch 70 (Forms & Surveys) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
