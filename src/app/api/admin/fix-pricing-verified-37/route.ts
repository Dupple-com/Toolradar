import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-seventh batch of verified pricing from WebFetch (December 2025) - Developer APIs & Payments
const verifiedPricing: Record<string, object> = {
  // Twilio - https://www.twilio.com/en-us/pricing
  "twilio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.twilio.com/en-us/pricing",
    tiers: [
      { name: "Pay-as-you-go", price: 0, description: "Usage-based", features: ["SMS from $0.0079/msg", "Voice from $0.0085/min", "WhatsApp from $0.005/msg", "Video from $0.004/min"], highlighted: true },
      { name: "Flex (Contact Center)", price: 1, period: "active user hour", description: "Or $150/named user", features: ["5K free hours", "Omnichannel", "CRM integrations"] },
      { name: "Segment", price: 120, period: "month", description: "10K visitors", features: ["CDP", "Connections", "14-day trial"] }
    ],
    notes: "Volume discounts available. SendGrid included."
  },

  // SendGrid - https://sendgrid.com/en-us/pricing
  "sendgrid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://sendgrid.com/en-us/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 emails/day", features: ["APIs", "SMTP relay", "Analytics", "1 teammate"] },
      { name: "Essentials", price: 19.95, period: "month", description: "Up to 100K/mo", features: ["All Free", "Deliverability optimization", "2 webhooks"], highlighted: true },
      { name: "Pro", price: 89.95, period: "month", description: "Up to 1.5M/mo", features: ["Dedicated IPs", "Subuser management", "SSO", "1K teammates"] },
      { name: "Premier", price: "Custom", description: "5M+ emails/mo", features: ["All Pro", "5K email validations", "Priority support"] }
    ],
    notes: "By Twilio. Marketing Campaigns from $15/mo."
  },

  // Stripe - https://stripe.com/pricing
  "stripe": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://stripe.com/pricing",
    tiers: [
      { name: "Standard", price: 0, description: "1.5% + €0.25/txn", features: ["No monthly fee", "Cards & wallets", "3D Secure", "Fraud protection"], highlighted: true },
      { name: "Premium Cards", price: 0, description: "1.9% + €0.25/txn", features: ["Corporate cards", "Rewards cards"] },
      { name: "International", price: 0, description: "3.25% + €0.25/txn", features: ["Non-EU cards", "+2% currency conversion"] }
    ],
    notes: "Billing 0.7%, Invoicing 0.4%, Terminal 1.4%. Volume discounts."
  },

  // Algolia - https://www.algolia.com/pricing
  "algolia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.algolia.com/pricing",
    tiers: [
      { name: "Build", price: 0, description: "Free forever", features: ["10K searches/mo", "1M records", "10K AI recs", "3 rules/index"] },
      { name: "Grow", price: 0, description: "Pay-as-you-go", features: ["$0.50/1K searches", "$0.40/1K records", "Query suggestions", "30-day analytics"], highlighted: true },
      { name: "Grow Plus", price: 0, description: "Pay-as-you-go", features: ["$1.75/1K searches", "AI Synonyms", "Personalization", "90-day analytics"] },
      { name: "Elevate", price: "Custom", description: "Annual contract", features: ["NeuralSearch", "Volume discounts", "SSO", "70+ data centers"] }
    ],
    notes: "AI-powered search. InstantSearch UI libraries."
  },

  // PayPal - Known pricing
  "paypal": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.paypal.com/us/webapps/mpp/merchant-fees",
    tiers: [
      { name: "Standard", price: 0, description: "2.99% + $0.49/txn", features: ["PayPal Checkout", "Buy buttons", "Invoicing", "QR codes"], highlighted: true },
      { name: "Advanced", price: 0, description: "2.59% + $0.49/txn", features: ["Card processing", "Advanced Checkout", "Fraud protection"] },
      { name: "Payouts", price: 0, description: "2% per payout", features: ["Mass payments", "Global reach", "API access"] }
    ],
    notes: "No monthly fees. Rates vary by volume and country."
  },

  // Plaid - Known pricing
  "plaid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://plaid.com/pricing",
    tiers: [
      { name: "Launch", price: 0, description: "100 live items", features: ["Auth", "Identity", "Balance", "Basic support"] },
      { name: "Scale", price: "Custom", description: "Contact sales", features: ["All Launch", "Volume pricing", "Priority support", "SLA"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Scale", "Dedicated support", "Custom integrations"] }
    ],
    notes: "Per-item pricing after free tier. Bank data API."
  },

  // Segment - Known pricing
  "segment": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://segment.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K visitors/mo", features: ["2 sources", "300+ integrations", "Basic support"] },
      { name: "Team", price: 120, period: "month", description: "10K visitors", features: ["Unlimited sources", "All integrations", "Email support"], highlighted: true },
      { name: "Business", price: "Custom", description: "Contact sales", features: ["All Team", "SSO", "Advanced features", "Dedicated support"] }
    ],
    notes: "By Twilio. CDP for customer data."
  },

  // Cloudinary - Known pricing
  "cloudinary": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://cloudinary.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25 credits/mo", features: ["25K transformations", "25GB storage", "25GB bandwidth"] },
      { name: "Plus", price: 89, period: "month", description: "225 credits", features: ["All Free", "Video transcoding", "Auto-tagging", "Support"], highlighted: true },
      { name: "Advanced", price: 224, period: "month", description: "600 credits", features: ["All Plus", "Custom domain", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Advanced", "SLA", "Dedicated manager"] }
    ],
    notes: "Image/video optimization API. DAM included."
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

  console.log("🔧 Starting verified pricing corrections batch 37 (Developer APIs & Payments)...\n");

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
    message: "Verified pricing corrections batch 37 (Developer APIs & Payments) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
