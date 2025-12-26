import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fourth batch of verified pricing from WebFetch (December 2025)
const verifiedPricing: Record<string, object> = {
  // Sketch - https://www.sketch.com/pricing/
  "sketch": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.sketch.com/pricing/",
    tiers: [
      { name: "Standard", price: 12, period: "month per editor", description: "Annual billing", features: ["For individuals", "Unlimited viewers", "Cloud collaboration"] },
      { name: "Business", price: 24, period: "month per editor", description: "Growing teams", features: ["SSO", "Priority support", "Admin controls"], highlighted: true },
      { name: "Enterprise", price: 44, period: "month per editor", description: "25+ editors", features: ["Dedicated support", "Custom terms", "Enterprise features"] },
      { name: "Mac-only", price: 120, period: "one-time", description: "Perpetual license", features: ["Offline use", "1 year updates", "No collaboration"] }
    ]
  },

  // Softr - https://www.softr.io/pricing
  "softr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.softr.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Try no-code", features: ["1 published app", "10 app users", "Basic features"] },
      { name: "Basic", price: 59, period: "month", description: "Simple projects", features: ["3 published apps", "Payments", "Custom code"] },
      { name: "Professional", price: 167, period: "month", description: "Portals & tools", features: ["Unlimited apps", "100 app users", "Charts", "E-signatures"], highlighted: true },
      { name: "Business", price: 323, period: "month", description: "Scale", features: ["500 app users", "1M database records", "Global data restrictions"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Dedicated CSM", "Compliance"] }
    ]
  },

  // Glide - https://www.glideapps.com/pricing
  "glide": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.glideapps.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learn to create", features: ["Basic features", "Limited users"] },
      { name: "Business", price: 199, period: "month", description: "Best value, annual", features: ["30 users included", "Additional users $5-6/mo", "Turn spreadsheets into tools"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Deploy at scale", features: ["Custom integrations", "Dedicated support", "Enterprise features"] }
    ]
  },

  // Ghost - https://ghost.org/pricing/
  "ghost": {
    startingPrice: 18, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://ghost.org/pricing/",
    tiers: [
      { name: "Starter", price: 18, period: "month", description: "Solo blogs", features: ["Free custom domain", "Basic features", "Email support"] },
      { name: "Publisher", price: 29, period: "month", description: "Custom publications", features: ["Custom themes", "Paid subscriptions", "Advanced analytics"], highlighted: true },
      { name: "Business", price: 199, period: "month", description: "Teams scaling up", features: ["Priority support", "Team features", "Advanced features"] },
      { name: "Custom", price: "Custom", description: "Complex needs", features: ["Enterprise features", "Dedicated support"] }
    ]
  },

  // Beehiiv - https://www.beehiiv.com/pricing
  "beehiiv": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.beehiiv.com/pricing",
    tiers: [
      { name: "Launch", price: 0, description: "Free tier", features: ["2,500 subscribers", "Basic features", "Beehiiv branding"] },
      { name: "Scale", price: 43, period: "month", description: "Most Popular, annual", features: ["Custom branding", "Advanced analytics", "Ad network"], highlighted: true },
      { name: "Max", price: 96, period: "month", description: "Best Value, annual", features: ["Priority support", "Advanced features", "More subscribers"] },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["Custom limits", "Dedicated support"] }
    ]
  },

  // Substack - https://substack.com/going-paid
  "substack": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: false,
    pricingPageUrl: "https://substack.com/going-paid",
    tiers: [
      { name: "Free to Start", price: "10%", period: "of revenue", description: "Writers keep 90%", features: ["No setup fees", "Keep 90% of revenue", "Only pay when earning", "Credit card fees apply"], highlighted: true }
    ],
    notes: "Substack takes 10% of paid subscription revenue plus credit card processing fees"
  },

  // Memberful - https://www.memberful.com/pricing/
  "memberful": {
    startingPrice: 49, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.memberful.com/pricing/",
    tiers: [
      { name: "Standard", price: 49, period: "month", description: "+ 4.9% transaction fee", features: ["All features included", "Unlimited members", "Month-to-month billing", "No contracts"], highlighted: true }
    ],
    notes: "4.9% per successful charge + Stripe processing fees. Volume discounts for $1M+ annual revenue"
  },

  // Patreon - https://www.patreon.com/pricing
  "patreon": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: false,
    pricingPageUrl: "https://www.patreon.com/pricing",
    tiers: [
      { name: "Creator", price: "10%", period: "of earnings", description: "Free to start", features: ["Pay only when earning", "10% of Patreon income", "+ payment processing fees", "Memberships & products"], highlighted: true }
    ],
    notes: "10% platform fee + payment processing, currency conversion, and payout fees"
  },

  // Teachable - https://www.teachable.com/pricing
  "teachable": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.teachable.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "Annual ($39 monthly)", features: ["7.5% transaction fee", "Basic features", "Email support"] },
      { name: "Builder", price: 69, period: "month", description: "Annual ($89 monthly)", features: ["0% transaction fee", "Coupons", "Graded quizzes"], highlighted: true },
      { name: "Growth", price: 139, period: "month", description: "Annual ($189 monthly)", features: ["0% transaction fee", "Upsells", "Advanced reports"] },
      { name: "Advanced", price: 309, period: "month", description: "Annual ($399 monthly)", features: ["0% transaction fee", "Custom user roles", "Advanced analytics"] }
    ]
  },

  // Thinkific - https://www.thinkific.com/pricing/
  "thinkific": {
    startingPrice: 36, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.thinkific.com/pricing/",
    tiers: [
      { name: "Basic", price: 36, period: "month", description: "Annual (€48 monthly)", features: ["1 community", "5 digital downloads", "Basic features"] },
      { name: "Start", price: 73, period: "month", description: "Annual (€97 monthly)", features: ["Unlimited live events", "Membership programs", "Recurring revenue"], highlighted: true },
      { name: "Grow", price: 146, period: "month", description: "Annual (€195 monthly)", features: ["3 communities", "White-labeling", "Advanced commerce"] },
      { name: "Plus", price: "Custom", description: "Contact sales", features: ["Unlimited users", "SCORM compliance", "Dedicated onboarding"] }
    ]
  },

  // Kajabi - https://www.kajabi.com/pricing
  "kajabi": {
    startingPrice: 89, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.kajabi.com/pricing",
    tiers: [
      { name: "Kickstarter", price: 89, period: "month", description: "Getting started", features: ["1 product", "1 website", "Basic features"] },
      { name: "Basic", price: 179, period: "month", description: "Growing business", features: ["3 products", "3 pipelines", "10,000 contacts"], highlighted: true },
      { name: "Growth", price: 249, period: "month", description: "Scaling up", features: ["15 products", "15 pipelines", "25,000 contacts"] },
      { name: "Pro", price: 499, period: "month", description: "Full platform", features: ["100 products", "100 pipelines", "100,000 contacts"] }
    ],
    notes: "No hidden fees, no revenue sharing"
  },

  // Podia - https://www.podia.com/pricing
  "podia": {
    startingPrice: 33, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.podia.com/pricing",
    tiers: [
      { name: "Mover", price: 33, period: "month", description: "Annual ($39 monthly)", features: ["5% transaction fees", "Website", "Unlimited products", "Email marketing"] },
      { name: "Shaker", price: 75, period: "month", description: "Annual ($89 monthly)", features: ["0% transaction fees", "Affiliate marketing", "PayPal payments"], highlighted: true }
    ],
    notes: "Email included free up to 100 subscribers, then $7/mo for 500 subs"
  },

  // Circle - https://www.circle.so/pricing
  "circle": {
    startingPrice: 89, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.circle.so/pricing",
    tiers: [
      { name: "Professional", price: 89, period: "month", description: "Annual billing", features: ["Community platform", "Basic features", "Standard support"] },
      { name: "Business", price: 199, period: "month", description: "Annual billing", features: ["Advanced features", "Priority support", "Custom branding"], highlighted: true },
      { name: "Enterprise", price: 419, period: "month", description: "Annual billing", features: ["Enterprise features", "Dedicated support", "Custom terms"] },
      { name: "Plus Branded App", price: "Custom", description: "Contact sales", features: ["White-label mobile app", "Full customization"] }
    ]
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

  console.log("🔧 Starting verified pricing corrections batch 4...\n");

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
    message: "Verified pricing corrections batch 4 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
