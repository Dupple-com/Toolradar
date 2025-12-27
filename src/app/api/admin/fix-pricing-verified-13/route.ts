import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirteenth batch of verified pricing from WebFetch (December 2025) - Productivity & Note-taking Tools
const verifiedPricing: Record<string, object> = {
  // tawk.to - https://www.tawk.to/pricing/
  "tawk-to": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.tawk.to/pricing/",
    tiers: [
      { name: "Free Forever", price: 0, description: "Full featured", features: ["Unlimited agents", "45+ languages", "Video/voice chat", "Screen sharing"], highlighted: true },
      { name: "Hired Agents", price: 1, period: "per hour", description: "Optional", features: ["Professional agents", "24/7 coverage", "Trained staff"] },
      { name: "Remove Branding", price: 19, period: "month", description: "Optional", features: ["White label", "Custom branding"] }
    ],
    notes: "99% of users are on free tier. AI Assist available as add-on."
  },

  // Evernote - https://www.evernote.com/compare-plans
  "evernote": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.evernote.com/compare-plans",
    tiers: [
      { name: "Free", price: 0, description: "50 notes", features: ["1 device", "20MB/month", "Basic features"] },
      { name: "Starter", price: 8.33, period: "month", description: "$99/year", features: ["1000 notes", "3 devices", "1GB/month"], highlighted: true },
      { name: "Advanced", price: 20.83, period: "month", description: "$249.99/year", features: ["Unlimited notes", "Unlimited devices", "AI features"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Advanced security", "Dedicated support"] }
    ]
  },

  // Todoist - https://www.todoist.com/pricing
  "todoist": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.todoist.com/pricing",
    tiers: [
      { name: "Beginner", price: 0, description: "Free forever", features: ["5 projects", "3 filters", "1 week history"] },
      { name: "Pro", price: 5, period: "month", description: "Annual (€60/yr)", features: ["300 projects", "150 filters", "Calendar layout", "Reminders"], highlighted: true },
      { name: "Business", price: 8, period: "user/month", description: "Annual", features: ["500 team projects", "Team workspace", "Admin controls"] }
    ],
    notes: "SOC2 Type II certified"
  },

  // Any.do - https://www.any.do/premium
  "any-do": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.any.do/premium",
    tiers: [
      { name: "Free", price: 0, description: "Basic tasks", features: ["Task management", "Basic features", "Mobile apps"] },
      { name: "Premium Monthly", price: 5.99, period: "month", description: "Billed monthly", features: ["Recurring reminders", "Custom themes", "Color tags"] },
      { name: "Premium 6-Month", price: 4.49, period: "month", description: "Billed 6-monthly", features: ["All premium features", "WhatsApp reminders"] },
      { name: "Premium Annual", price: 2.99, period: "month", description: "Billed annually", features: ["50% savings", "Location reminders", "Unlimited planner"], highlighted: true }
    ]
  },

  // TickTick - https://www.ticktick.com/about/upgrade
  "ticktick": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.ticktick.com/about/upgrade",
    tiers: [
      { name: "Free", price: 0, description: "Basic features", features: ["Task management", "Calendar", "Pomodoro timer"] },
      { name: "Premium Monthly", price: 3.99, period: "month", description: "Billed monthly", features: ["Custom filters", "Calendar views", "Activity history"] },
      { name: "Premium Annual", price: 2.99, period: "month", description: "$35.99/year", features: ["All premium features", "10+ themes", "Calendar widgets"], highlighted: true }
    ]
  },

  // Obsidian - https://obsidian.md/pricing
  "obsidian": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://obsidian.md/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free forever", features: ["Local-first", "No sign-up", "Plugins", "Community themes"] },
      { name: "Sync", price: 4, period: "month", description: "Annual ($5 monthly)", features: ["Cross-device sync", "E2E encryption", "Version history"], highlighted: true },
      { name: "Publish", price: 8, period: "month", description: "Annual ($10 monthly)", features: ["Web publishing", "Custom themes", "Graph view"] },
      { name: "Commercial", price: 50, period: "user/year", description: "For businesses", features: ["Commercial use", "Priority support"] }
    ],
    notes: "40% discount for education/nonprofit"
  },

  // Craft - https://www.craft.do/pricing
  "craft": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.craft.do/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1500 blocks", features: ["1GB storage", "7-day history", "15 AI credits/mo"] },
      { name: "Plus", price: 4.80, period: "month", description: "Annual (€8 monthly)", features: ["Unlimited blocks", "30-day history", "50 AI credits"], highlighted: true },
      { name: "Family", price: 9, period: "month", description: "2-6 accounts", features: ["All Plus features", "Shared Space"] },
      { name: "Team", price: 50, period: "month", description: "10-25 accounts", features: ["Team collaboration", "All Plus features"] }
    ]
  },

  // InVideo - https://invideo.io/pricing
  "invideo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://invideo.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "With watermark", features: ["2 video min/week", "1 AI credit/week", "4 exports/week"] },
      { name: "Business", price: 20, period: "month", description: "Annual ($30 monthly)", features: ["No watermark", "60 HD exports/mo", "10 iStock/mo"], highlighted: true },
      { name: "Unlimited", price: 48, period: "month", description: "Annual ($60 monthly)", features: ["Unlimited exports", "120 iStock/mo", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom solutions", "Advanced security"] }
    ]
  },

  // ActiveCampaign - https://www.activecampaign.com/pricing
  "activecampaign": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.activecampaign.com/pricing",
    tiers: [
      { name: "Starter", price: 15, period: "month", description: "1000 contacts", features: ["Email marketing", "Basic automation", "10x email sends"] },
      { name: "Plus", price: 49, period: "month", description: "1000 contacts", features: ["Advanced automation", "A/B testing", "Unlimited sends"], highlighted: true },
      { name: "Pro", price: 79, period: "month", description: "1000 contacts", features: ["Predictive sending", "Advanced integrations", "12x email sends"] },
      { name: "Enterprise", price: 145, period: "month", description: "1000 contacts", features: ["Dedicated support", "Custom reports", "15x email sends"] }
    ],
    notes: "Pricing scales with contact count"
  },

  // AWS - https://aws.amazon.com/free/
  "aws": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://aws.amazon.com/free/",
    tiers: [
      { name: "Free Tier", price: 0, description: "12 months", features: ["750 hrs EC2/mo", "5GB S3", "1M Lambda requests"], highlighted: true },
      { name: "Pay as you go", price: 0, description: "No minimum", features: ["150+ services", "Per-second billing", "Volume discounts"] }
    ],
    notes: "$200 credits for new customers. Always-free tier includes 30+ services."
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

  console.log("🔧 Starting verified pricing corrections batch 13 (Productivity & Note-taking)...\n");

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
    message: "Verified pricing corrections batch 13 (Productivity & Note-taking) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
