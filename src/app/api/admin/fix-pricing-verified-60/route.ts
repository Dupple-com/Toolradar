import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 60: Email & Marketing pricing
const verifiedPricing: Record<string, object> = {
  "mailchimp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mailchimp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "500 contacts", features: ["500 contacts", "1000 sends/mo", "Basic templates"] },
      { name: "Essentials", price: 13, period: "month", description: "Starting", features: ["500 contacts", "5000 sends", "A/B testing"], highlighted: true },
      { name: "Standard", price: 20, period: "month", description: "Popular", features: ["500 contacts", "6000 sends", "Automation"] }
    ],
    notes: "Free tier for up to 500 contacts."
  },
  "sendgrid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://sendgrid.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100/day", features: ["100 emails/day", "APIs & SMTP", "Delivery optimization"], highlighted: true },
      { name: "Essentials", price: 19.95, period: "month", description: "40K/mo", features: ["40K emails", "Email support", "Automation"] },
      { name: "Pro", price: 89.95, period: "month", description: "100K/mo", features: ["100K emails", "Dedicated IP", "Subuser management"] }
    ],
    notes: "100 emails/day free forever."
  },
  "postmark": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://postmarkapp.com/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "100 emails", features: ["100 emails total", "All features", "No credit card"] },
      { name: "10K", price: 15, period: "month", description: "10K/mo", features: ["10K emails", "Unlimited users", "45 day retention"], highlighted: true },
      { name: "50K", price: 57.50, period: "month", description: "50K/mo", features: ["50K emails", "All features", "Better rates"] }
    ],
    notes: "Transactional email focus. High deliverability."
  },
  "resend": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://resend.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3K/mo", features: ["3000 emails/mo", "100 emails/day", "1 domain"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "50K/mo", features: ["50K emails", "Unlimited domains", "API"] }
    ],
    notes: "Developer-first email API. React Email."
  },
  "mailgun": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mailgun.com/pricing",
    tiers: [
      { name: "Trial", price: 0, description: "5K emails", features: ["5K emails/3mo", "All features", "No credit card"] },
      { name: "Foundation", price: 35, period: "month", description: "50K/mo", features: ["50K emails", "5 day retention", "24/7 support"], highlighted: true },
      { name: "Scale", price: 90, period: "month", description: "100K/mo", features: ["100K emails", "7 day retention", "Dedicated IP"] }
    ],
    notes: "Transactional and bulk email."
  },
  "ses": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://aws.amazon.com/ses/pricing",
    tiers: [
      { name: "Pay as you go", price: 0.10, period: "per 1K", description: "Outbound", features: ["$0.10/1K emails", "High deliverability", "AWS integration"], highlighted: true }
    ],
    notes: "AWS email service. Very cost effective at scale."
  },
  "convertkit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://convertkit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "10K subs", features: ["10K subscribers", "Unlimited emails", "Email support"] },
      { name: "Creator", price: 25, period: "month", description: "300 subs", features: ["Automation", "Integrations", "Priority support"], highlighted: true },
      { name: "Creator Pro", price: 50, period: "month", description: "300 subs", features: ["Advanced reporting", "Facebook ads", "Newsletter referrals"] }
    ],
    notes: "For creators. Free up to 10K subscribers."
  },
  "beehiiv": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.beehiiv.com/pricing",
    tiers: [
      { name: "Launch", price: 0, description: "2.5K subs", features: ["2500 subscribers", "Unlimited sends", "Custom domain"] },
      { name: "Grow", price: 49, period: "month", description: "Annual", features: ["10K subs", "Ad network", "API access"], highlighted: true },
      { name: "Scale", price: 99, period: "month", description: "Annual", features: ["100K subs", "Premium support", "Remove branding"] }
    ],
    notes: "Newsletter platform. Free for 2.5K subs."
  },
  "buttondown": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://buttondown.email/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 subs", features: ["100 subscribers", "Unlimited emails", "API access"], highlighted: true },
      { name: "Basic", price: 9, period: "month", description: "1K subs", features: ["1K subscribers", "Custom domain", "No branding"] },
      { name: "Standard", price: 29, period: "month", description: "5K subs", features: ["5K subscribers", "Analytics", "Automations"] }
    ],
    notes: "Simple newsletter tool. Free for 100 subs."
  },
  "substack": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://substack.com",
    tiers: [
      { name: "Free", price: 0, description: "10% paid", features: ["Free newsletters", "Paid subscriptions", "10% cut on paid"], highlighted: true }
    ],
    notes: "Free to use. 10% cut on paid subscriptions."
  },
  "loops": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://loops.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K contacts", features: ["1K contacts", "3K sends/mo", "Basic features"] },
      { name: "Starter", price: 25, period: "month", description: "5K contacts", features: ["5K contacts", "15K sends", "API access"], highlighted: true },
      { name: "Growth", price: 49, period: "month", description: "10K contacts", features: ["10K contacts", "Unlimited sends", "Team features"] }
    ],
    notes: "Email for SaaS. Free tier available."
  },
  "mailjet": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.mailjet.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "6K/mo", features: ["6K emails/mo", "200/day limit", "Unlimited contacts"] },
      { name: "Essential", price: 17, period: "month", description: "15K/mo", features: ["15K emails", "No daily limit", "No logo"], highlighted: true }
    ],
    notes: "Transactional and marketing email. Free tier."
  },
  "brevo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.brevo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "300/day", features: ["300 emails/day", "Unlimited contacts", "Email templates"] },
      { name: "Starter", price: 25, period: "month", description: "20K/mo", features: ["20K emails/mo", "No daily limit", "Basic reporting"], highlighted: true },
      { name: "Business", price: 65, period: "month", description: "20K/mo", features: ["Marketing automation", "A/B testing", "Landing pages"] }
    ],
    notes: "Formerly Sendinblue. Free tier with 300/day."
  },
  "klaviyo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.klaviyo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 contacts", features: ["250 contacts", "500 emails/mo", "Email support"] },
      { name: "Email", price: 20, period: "month", description: "251-500", features: ["5K emails", "All features", "Live support"], highlighted: true }
    ],
    notes: "E-commerce email marketing. Free for 250 contacts."
  },
  "drip": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.drip.com/pricing",
    tiers: [
      { name: "Basic", price: 39, period: "month", description: "2.5K people", features: ["2500 contacts", "Unlimited sends", "Email support"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "10K people", features: ["10K contacts", "All features", "Live chat"] }
    ],
    notes: "E-commerce CRM. 14-day free trial."
  },
  "mailerlite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.mailerlite.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K subs", features: ["1K subscribers", "12K emails/mo", "1 user"] },
      { name: "Growing Business", price: 10, period: "month", description: "500 subs", features: ["Unlimited emails", "3 users", "Auto-resend"], highlighted: true }
    ],
    notes: "Email marketing. Free for 1K subscribers."
  },
  "activecampaign": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.activecampaign.com/pricing",
    tiers: [
      { name: "Lite", price: 15, period: "month", description: "1K contacts", features: ["1K contacts", "Email marketing", "Automation"], highlighted: true },
      { name: "Plus", price: 49, period: "month", description: "1K contacts", features: ["Landing pages", "Forms", "CRM"] }
    ],
    notes: "Marketing automation. No free tier."
  },
  "hubspot-marketing": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.hubspot.com/pricing/marketing",
    tiers: [
      { name: "Free Tools", price: 0, description: "Basic", features: ["Forms", "Email marketing", "Limited features"] },
      { name: "Starter", price: 20, period: "month", description: "Annual", features: ["1K contacts", "Remove branding", "Landing pages"], highlighted: true },
      { name: "Professional", price: 890, period: "month", description: "Annual", features: ["2K contacts", "Automation", "A/B testing"] }
    ],
    notes: "Part of HubSpot CRM suite. Free tools available."
  },
  "customer-io": {
    startingPrice: 100, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://customer.io/pricing",
    tiers: [
      { name: "Essentials", price: 100, period: "month", description: "5K profiles", features: ["5K profiles", "1M emails", "Automation"], highlighted: true },
      { name: "Premium", price: 1000, period: "month", description: "Starting", features: ["More profiles", "Premium support", "Data warehouse sync"] }
    ],
    notes: "Behavioral email and messaging platform."
  },
  "hunter": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://hunter.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25 searches", features: ["25 searches/mo", "50 verifications", "Chrome extension"] },
      { name: "Starter", price: 49, period: "month", description: "500 searches", features: ["500 searches", "1K verifications", "API access"], highlighted: true }
    ],
    notes: "Find professional email addresses. Free tier."
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
    message: "Pricing batch 60 (Email & Marketing) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
