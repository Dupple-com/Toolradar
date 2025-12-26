import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fifth batch of verified pricing from WebFetch (December 2025) - Email Marketing Tools
const verifiedPricing: Record<string, object> = {
  // Mailchimp - https://mailchimp.com/pricing/marketing/
  "mailchimp": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mailchimp.com/pricing/marketing/",
    tiers: [
      { name: "Free", price: 0, description: "250 contacts", features: ["500 emails/month", "1 user", "1 audience", "Email support (30 days)"] },
      { name: "Essentials", price: 11.10, period: "month", description: "Up to 50K contacts", features: ["10x contacts emails", "3 users", "3 audiences", "24/7 support"] },
      { name: "Standard", price: 17.08, period: "month", description: "14-day free trial", features: ["12x contacts emails", "5 users", "5 audiences", "200 automation steps"], highlighted: true },
      { name: "Premium", price: 298.84, period: "month", description: "Up to 250K contacts", features: ["15x contacts emails", "Unlimited users", "Priority phone support", "Migration services"] }
    ]
  },

  // Kit (ConvertKit) - https://kit.com/pricing
  "convertkit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://kit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "Up to 10K subscribers", features: ["1 automation", "1 sequence", "Unlimited landing pages", "Digital product sales"] },
      { name: "Creator", price: 33, period: "month", description: "$390/year (2 months free)", features: ["Unlimited automations", "2 users", "Remove branding", "24/7 chat support"], highlighted: true },
      { name: "Pro", price: 66, period: "month", description: "$790/year (2 months free)", features: ["Unlimited users", "Newsletter referral system", "Engagement scoring", "Priority support"] }
    ]
  },

  // GetResponse - https://www.getresponse.com/pricing
  "getresponse": {
    startingPrice: 13.12, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.getresponse.com/pricing",
    tiers: [
      { name: "Starter", price: 13.12, period: "month", description: "Annual (€16 monthly)", features: ["Unlimited emails", "AI content (3 uses)", "1 automation workflow", "3 users"] },
      { name: "Marketer", price: 44.28, period: "month", description: "Annual (€54 monthly)", features: ["Unlimited automations", "Advanced segmentation", "Abandoned cart", "5 users"], highlighted: true },
      { name: "Creator", price: 50.84, period: "month", description: "Annual (€62 monthly)", features: ["Website builder (5 sites)", "Course creator", "Webinars (100 attendees)"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SMS marketing", "Dedicated manager", "SSO", "Phone support"] }
    ]
  },

  // Drip - https://www.drip.com/pricing
  "drip": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.drip.com/pricing",
    tiers: [
      { name: "Base", price: 39, period: "month", description: "Up to 2,500 contacts", features: ["Unlimited email sends", "50 workflows", "Dynamic segments", "Free migration"], highlighted: true },
      { name: "Growth", price: 49, period: "month", description: "Up to 3,000 contacts", features: ["All base features", "Email support", "Onsite campaigns"] },
      { name: "Scale", price: 99, period: "month", description: "5,000+ contacts", features: ["Chat support", "All features", "API access"] }
    ],
    notes: "Pricing scales with contact list size"
  },

  // Brevo - https://www.brevo.com/pricing/
  "brevo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.brevo.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "300 emails/day", features: ["Email & SMS campaigns", "Drag & drop editor", "Basic reporting"] },
      { name: "Starter", price: 9, period: "month", description: "From 5K emails/mo", features: ["Marketing automation", "A/B testing", "1 landing page", "No Brevo logo"] },
      { name: "Standard", price: 25, period: "month", description: "From 5K emails/mo", features: ["WhatsApp & push", "10 user seats", "AI segmentation", "Phone support"], highlighted: true },
      { name: "Professional", price: 65, period: "month", description: "From 150K emails/mo", features: ["Multi-account", "Dedicated IP", "SSO/SAML", "CSM support"] }
    ]
  },

  // MailerLite - https://mailerlite.com/pricing
  "mailerlite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mailerlite.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 500 subscribers", features: ["12,000 emails/month", "1 user", "Email & chat (14 days)"] },
      { name: "Growing Business", price: 10, period: "month", description: "Save 10% annually", features: ["Unlimited emails", "3 users", "24/7 email support"], highlighted: true },
      { name: "Advanced", price: 20, period: "month", description: "Save 10% annually", features: ["Unlimited emails", "Unlimited users", "24/7 chat & email"] },
      { name: "Enterprise", price: "Custom", description: "100K+ subscribers", features: ["Dedicated manager", "Dedicated IP", "Onboarding consultation"] }
    ]
  },

  // Omnisend - https://www.omnisend.com/pricing/
  "omnisend": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.omnisend.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 250 contacts", features: ["500 emails/month", "$1 SMS credits", "500 push notifications"] },
      { name: "Standard", price: 16, period: "month", description: "Up to 500 contacts", features: ["6,000 emails/month", "Unlimited push", "24/7 support"], highlighted: true },
      { name: "Pro", price: 59, period: "month", description: "Up to 2,500 contacts", features: ["Unlimited emails", "Bonus SMS credits", "Personalized content"] }
    ],
    notes: "Pricing scales with contact list size"
  },

  // AWeber - https://www.aweber.com/pricing.htm
  "aweber": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.aweber.com/pricing.htm",
    tiers: [
      { name: "Lite", price: 15, period: "month", description: "500 subscribers", features: ["Email marketing", "Basic features", "Email support"] },
      { name: "Lite 1K", price: 25, period: "month", description: "1,000 subscribers", features: ["Email marketing", "Basic features"] },
      { name: "Plus", price: 30, period: "month", description: "500 subscribers", features: ["Advanced analytics", "Full automation", "Priority support"], highlighted: true },
      { name: "Plus 1K", price: 45, period: "month", description: "1,000 subscribers", features: ["All Plus features", "Scales with list size"] }
    ],
    notes: "Pricing scales with subscriber count. Done For You service: $20/mo + $79 setup"
  },

  // Flodesk - https://www.flodesk.com/pricing
  "flodesk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.flodesk.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic features", features: ["Forms & landing pages", "Audience segmentation", "Email sending"] },
      { name: "Lite", price: 25, period: "month", description: "Up to 1K subs ($25)", features: ["Unlimited emails", "Email analytics", "Max 25K subscribers"] },
      { name: "Pro", price: 28, period: "month", description: "Up to 1K subs", features: ["Unlimited workflows", "Advanced analytics", "Up to 255K subs"], highlighted: true },
      { name: "Everything", price: 54, period: "month", description: "Email + E-commerce", features: ["Unlimited checkouts", "Sales pages", "Subscriptions", "Payment processing"] }
    ],
    notes: "Annual billing gets 1 month free. Pricing scales with subscribers."
  },

  // Buttondown - https://buttondown.com/pricing
  "buttondown": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://buttondown.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 100 subscribers", features: ["Basic newsletter", "Limited features"] },
      { name: "Basic", price: 9, period: "month", description: "Up to 1,000 subscribers", features: ["Core features", "Email support"] },
      { name: "Standard", price: 29, period: "month", description: "Up to 5,000 subscribers", features: ["More subscribers", "Standard features"], highlighted: true },
      { name: "Professional", price: 79, period: "month", description: "Up to 10,000 subscribers", features: ["Professional features", "Priority support"] },
      { name: "Advanced", price: 139, period: "month", description: "Up to 20,000 subscribers", features: ["Advanced features", "All add-ons"] }
    ],
    notes: "Add-ons: tagging, paid subs, comments, analytics, automations ($9-79 each)"
  },

  // Loops - https://loops.so/pricing
  "loops": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://loops.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 1K contacts", features: ["4,000 sends/month", "All features", "Powered by Loops branding"] },
      { name: "Paid", price: "Contact for pricing", description: "Based on contacts", features: ["No additional charges for sends", "No team seat fees", "Transactional email included"], highlighted: true }
    ],
    notes: "Pricing based on subscribed contacts. Transactional email at no extra cost."
  },

  // Resend - https://www.resend.com/pricing
  "resend": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.resend.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3K emails/month", features: ["100 emails/day limit", "RESTful API", "SMTP relay"] },
      { name: "Pro", price: 20, period: "month", description: "50K emails/month", features: ["No daily limit", "Official SDKs", "$0.90/1K overage"], highlighted: true },
      { name: "Scale", price: 90, period: "month", description: "100K emails/month", features: ["No daily limit", "All Pro features", "$0.90/1K overage"] },
      { name: "Enterprise", price: "Custom", description: "Custom volume", features: ["Custom limits", "Dedicated support"] }
    ]
  },

  // Moosend - https://moosend.com/pricing/
  "moosend": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://moosend.com/pricing/",
    tiers: [
      { name: "Pro", price: 9, period: "month", description: "500 subscribers", features: ["Unlimited emails", "Automation", "Landing pages", "Transactional emails"], highlighted: true },
      { name: "Moosend+", price: "Custom", description: "Customizable", features: ["Pro + add-ons", "Dedicated IPs", "Audience discovery"] },
      { name: "Enterprise", price: "Custom", description: "Advanced needs", features: ["Priority support", "Deliverability optimization", "Custom solutions"] }
    ],
    notes: "Save 15% bi-annual, 20% annual. Email credits: $350 for 350K (never expire)"
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

  console.log("🔧 Starting verified pricing corrections batch 5 (Email Marketing)...\n");

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
    message: "Verified pricing corrections batch 5 (Email Marketing) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
