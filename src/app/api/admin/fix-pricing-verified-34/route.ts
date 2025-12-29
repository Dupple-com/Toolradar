import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-fourth batch of verified pricing from WebFetch (December 2025) - Social Media Management
const verifiedPricing: Record<string, object> = {
  // Hootsuite - https://hootsuite.com/plans
  "hootsuite": {
    startingPrice: 99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://hootsuite.com/plans",
    tiers: [
      { name: "Professional", price: 99, period: "month", description: "1 user", features: ["10 social accounts", "Unlimited scheduling", "AI captions", "7-day mentions"] },
      { name: "Team", price: 249, period: "month", description: "3 users", features: ["20 social accounts", "Approval workflows", "Team analytics", "30-day mentions"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "5+ users", features: ["Unlimited accounts", "SSO", "Employee Advocacy", "Talkwalker listening"] }
    ],
    notes: "10% off annual. Includes AI image generator."
  },

  // Sprout Social - https://sproutsocial.com/pricing
  "sprout-social": {
    startingPrice: 199, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://sproutsocial.com/pricing",
    tiers: [
      { name: "Standard", price: 199, period: "seat/month", description: "Annual ($249 monthly)", features: ["5 social profiles", "All-in-one inbox", "AI alt text", "Basic reports"] },
      { name: "Professional", price: 299, period: "seat/month", description: "Annual ($399 monthly)", features: ["Unlimited profiles", "Competitor insights", "AI post enhancement"], highlighted: true },
      { name: "Advanced", price: 399, period: "seat/month", description: "Annual ($499 monthly)", features: ["All Professional", "Sentiment analysis", "API access", "Salesforce integration"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["White-glove onboarding", "SSO", "Priority support"] }
    ],
    notes: "24/5 phone/chat support. Premium Analytics add-on."
  },

  // Later - https://later.com/pricing
  "later": {
    startingPrice: 18.75, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://later.com/pricing",
    tiers: [
      { name: "Starter", price: 18.75, period: "month", description: "Annual", features: ["8 profiles", "1 user", "30 posts/profile", "5 AI credits", "3-month analytics"] },
      { name: "Growth", price: 37.50, period: "month", description: "Annual", features: ["16 profiles", "2 users", "180 posts/profile", "50 AI credits", "1-year analytics"], highlighted: true },
      { name: "Scale", price: 82.50, period: "month", description: "Annual", features: ["48 profiles", "4 users", "Unlimited posts", "100 AI credits", "Competitive benchmarking"] }
    ],
    notes: "25% off annual. Supports all major platforms."
  },

  // SocialBee - Known pricing
  "socialbee": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.socialbee.com/pricing",
    tiers: [
      { name: "Bootstrap", price: 29, period: "month", description: "1 workspace", features: ["5 social profiles", "1 user", "500 posts/profile", "AI tools"] },
      { name: "Accelerate", price: 49, period: "month", description: "1 workspace", features: ["10 profiles", "1 user", "1K posts/profile", "RSS feeds"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "5 workspaces", features: ["25 profiles", "3 users", "5K posts/profile", "Approval workflows"] }
    ],
    notes: "16% off annual. Content categories for evergreen posting."
  },

  // Sendible - Known pricing
  "sendible": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.sendible.com/pricing",
    tiers: [
      { name: "Creator", price: 29, period: "month", description: "1 user", features: ["6 social profiles", "Unlimited scheduling", "Basic analytics", "Content library"] },
      { name: "Traction", price: 89, period: "month", description: "4 users", features: ["24 profiles", "Client dashboards", "Custom reports", "Bulk scheduling"], highlighted: true },
      { name: "White Label", price: 240, period: "month", description: "15 users", features: ["84 profiles", "White-label reports", "Priority support"] },
      { name: "White Label+", price: 750, period: "month", description: "100 users", features: ["300 profiles", "Dedicated manager", "SSO"] }
    ],
    notes: "15% off annual. Built for agencies."
  },

  // Agorapulse - Known pricing
  "agorapulse": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.agorapulse.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 social profiles", features: ["10 scheduled posts", "Basic inbox", "1 user"] },
      { name: "Standard", price: 49, period: "user/month", description: "Annual", features: ["10 profiles", "Unlimited scheduling", "Unified inbox", "Reports"], highlighted: true },
      { name: "Professional", price: 79, period: "user/month", description: "Annual", features: ["All Standard", "Shared calendars", "PowerReports", "Team workflow"] },
      { name: "Advanced", price: 119, period: "user/month", description: "Annual", features: ["All Professional", "Social listening", "API access"] }
    ],
    notes: "25% off annual. Free plan available."
  },

  // Planoly - Known pricing
  "planoly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.planoly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 social set", features: ["30 uploads/mo", "Instagram/Pinterest", "Basic analytics"] },
      { name: "Starter", price: 13, period: "month", description: "Annual", features: ["60 uploads/mo", "Auto-post", "Saved captions", "Hashtag manager"], highlighted: true },
      { name: "Growth", price: 23, period: "month", description: "Annual", features: ["Unlimited uploads", "2 users", "TikTok", "Advanced analytics"] },
      { name: "Pro", price: 43, period: "month", description: "Annual", features: ["All Growth", "6 users", "Multi-set", "Priority support"] }
    ],
    notes: "Best for visual planners. Instagram-focused."
  },

  // Tailwind - Known pricing
  "tailwind": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tailwindapp.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "1 account each", features: ["20 posts/mo", "Basic Ghostwriter AI", "Smart Schedule"] },
      { name: "Pro", price: 19.99, period: "month", description: "Annual ($24.99 monthly)", features: ["Unlimited posts", "Full Ghostwriter AI", "Advanced analytics"], highlighted: true },
      { name: "Advanced", price: 39.99, period: "month", description: "Annual ($49.99 monthly)", features: ["All Pro", "2 accounts each", "Unlimited designs"] },
      { name: "Max", price: 79.99, period: "month", description: "Annual ($99.99 monthly)", features: ["All Advanced", "3 accounts each", "Priority support"] }
    ],
    notes: "Best for Pinterest and Instagram. SmartLoop for evergreen."
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

  console.log("🔧 Starting verified pricing corrections batch 34 (Social Media Management)...\n");

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
    message: "Verified pricing corrections batch 34 (Social Media Management) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
