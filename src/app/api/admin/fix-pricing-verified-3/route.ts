import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Third batch of verified pricing from WebFetch (December 2025)
const verifiedPricing: Record<string, object> = {
  // Apollo GraphQL - https://www.apollographql.com/pricing
  "apollo-graphql": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.apollographql.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Up to 3 users", "1 day data retention", "Community support", "Schema Registry"] },
      { name: "Developer", price: 5, period: "per million requests", description: "$50 credit on signup", features: ["Up to 10 users", "7 days retention", "Developer support (8×5)"], highlighted: true },
      { name: "Standard", price: "Custom", description: "Contact sales", features: ["Up to 30 users", "90 days retention", "SSO & SAML", "Standard SLA"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited users", "18 months retention", "24/7 support", "Business SLA"] }
    ]
  },

  // Appcues - https://www.appcues.com/pricing
  "appcues": {
    startingPrice: 300, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.appcues.com/pricing",
    tiers: [
      { name: "Start", price: 300, period: "month", description: "1,000 MAU, annual", features: ["5 user licenses", "50 published experiences", "Email support", "Basic integrations"] },
      { name: "Grow", price: 750, period: "month", description: "1,000 MAU, annual", features: ["15 user licenses", "100 published experiences", "A/B Testing", "Premium integrations"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom implementation", features: ["Unlimited licenses", "150+ experiences", "90-day onboarding", "Dedicated CSM"] }
    ],
    notes: "Pricing scales with Monthly Active Users (MAU)"
  },

  // Pendo - https://www.pendo.io/pricing/
  "pendo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.pendo.io/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 500 MAU", features: ["Product analytics", "In-app guides", "NPS surveys (Pendo-branded)", "Mobile & web apps"] },
      { name: "Base", price: "Custom", description: "Custom MAU", features: ["Analytics", "In-app guides", "One integration"] },
      { name: "Core", price: "Custom", description: "Most Popular", features: ["Session replays", "Everything in Base"], highlighted: true },
      { name: "Ultimate", price: "Custom", description: "Advanced", features: ["NPS", "Product discovery", "Journey orchestration", "Data sync"] }
    ]
  },

  // Segment - https://www.segment.com/pricing/connections/
  "segment": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.segment.com/pricing/connections/",
    tiers: [
      { name: "Free", price: 0, description: "1,000 MTUs", features: ["2 sources", "700+ integrations", "500K Reverse ETL records"] },
      { name: "Team", price: 120, period: "month", description: "10,000 MTUs", features: ["Unlimited sources", "Public API", "1M Reverse ETL records"], highlighted: true },
      { name: "Business", price: "Custom", description: "Custom volume", features: ["SSO & granular permissions", "HIPAA-eligible", "Regional infrastructure"] }
    ],
    notes: "Additional MTUs: $12/1K (10K-25K), $11/1K (25K-100K), $10/1K (100K+)"
  },

  // n8n - https://n8n.io/pricing/
  "n8n": {
    startingPrice: 20, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://n8n.io/pricing/",
    tiers: [
      { name: "Starter", price: 20, period: "month", description: "Annual billing", features: ["2,500 workflow executions", "5 concurrent executions", "1 shared project"] },
      { name: "Pro", price: 50, period: "month", description: "Annual billing", features: ["10,000 executions", "20 concurrent", "3 shared projects"], highlighted: true },
      { name: "Business", price: 667, period: "month", description: "Annual billing", features: ["40,000 executions", "Self-hosted option", "6 shared projects"] },
      { name: "Enterprise", price: "Custom", description: "Custom volume", features: ["Custom executions", "Dedicated support"] }
    ],
    notes: "Pay for full executions, not for each step"
  },

  // Pipedrive - https://www.pipedrive.com/pricing
  "pipedrive": {
    startingPrice: 14, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.pipedrive.com/pricing",
    tiers: [
      { name: "Lite", price: 14, period: "month per user", description: "Annual ($24 monthly)", features: ["Lead/deal management", "Pipeline management", "Basic reports"] },
      { name: "Growth", price: 39, period: "month per user", description: "Annual", features: ["Email automation", "Sequences", "Forecasting"] },
      { name: "Premium", price: 59, period: "month per user", description: "Annual", features: ["Lead generation", "Scoring", "Multi-email tools"], highlighted: true },
      { name: "Ultimate", price: 79, period: "month per user", description: "Annual ($99 monthly)", features: ["Enhanced security", "Phone enrichment", "Extended support"] }
    ],
    notes: "Add-ons: LeadBooster €32.50+, Projects €6.67+, Campaigns €13.33+"
  },

  // Jotform - https://www.jotform.com/pricing/
  "jotform": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.jotform.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["5 forms", "100 submissions/month", "100 MB storage"] },
      { name: "Bronze", price: 39, period: "month", description: "For individuals", features: ["25 forms", "1,000 submissions", "1 GB storage"] },
      { name: "Silver", price: 49, period: "month", description: "For small teams", features: ["50 forms", "2,500 submissions", "10 GB storage"], highlighted: true },
      { name: "Gold", price: 129, period: "month", description: "For businesses", features: ["100 forms", "10,000 submissions", "100 GB storage"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited forms", "Unlimited submissions", "Custom storage"] }
    ]
  },

  // Tally - https://www.tally.so/pricing
  "tally": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tally.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited forms", features: ["Unlimited forms & submissions", "Conditional logic", "Signatures", "File uploads"] },
      { name: "Pro", price: 20, period: "month", description: "Save 17% annually", features: ["Remove branding", "Custom domains", "Team collaboration", "Premium integrations"], highlighted: true },
      { name: "Business", price: 65, period: "month", description: "Save 17% annually", features: ["Everything in Pro", "Data retention control", "Email verification", "90-day version history"] }
    ]
  },

  // Lemlist - https://www.lemlist.com/pricing
  "lemlist": {
    startingPrice: 55, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.lemlist.com/pricing",
    tiers: [
      { name: "Email Pro", price: 55, period: "month per user", description: "Annual ($69 monthly)", features: ["Email outreach", "Personalization", "Sequences"] },
      { name: "Multichannel Expert", price: 79, period: "month per user", description: "Annual ($99 monthly)", features: ["Email + LinkedIn", "Multi-step campaigns", "Advanced analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Min 5 seats", features: ["Custom integrations", "Dedicated support", "Volume discounts"] }
    ]
  },

  // Basecamp - https://www.basecamp.com/pricing
  "basecamp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://www.basecamp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "One project", features: ["1 project at a time", "Basic features"] },
      { name: "Plus", price: 15, period: "month per user", description: "Month-to-month", features: ["Unlimited projects", "Guests/clients free", "All features"] },
      { name: "Pro Unlimited", price: 299, period: "month", description: "Annual ($349 monthly)", features: ["Unlimited users", "Unlimited projects", "5TB storage", "Priority support"], highlighted: true }
    ]
  },

  // Teamwork - https://www.teamwork.com/pricing
  "teamwork": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.teamwork.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Free forever", features: ["Basic project management", "Limited features"] },
      { name: "Deliver", price: 10.99, period: "month per user", description: "Annual (save 20%)", features: ["Unlimited projects", "Time tracking", "Milestones"], highlighted: true },
      { name: "Grow", price: 19.99, period: "month per user", description: "Annual (save 20%)", features: ["Resource scheduling", "Retainers", "Advanced reports"] },
      { name: "Scale", price: "Custom", description: "Contact sales", features: ["Enterprise features", "Dedicated support"] }
    ]
  },

  // Toggl Track - https://www.toggl.com/track/pricing/
  "toggl-track": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.toggl.com/track/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["Time tracking", "Basic reports", "Mobile apps"] },
      { name: "Starter", price: 9, period: "month per user", description: "Save 10% annually", features: ["Billable rates", "Project templates", "Time rounding"] },
      { name: "Premium", price: 18, period: "month per user", description: "Best value", features: ["Saved reports", "Scheduled reports", "Labor cost"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Book a demo", features: ["SSO", "Priority support", "Expert training"] }
    ]
  },

  // Clockify - https://clockify.me/pricing
  "clockify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://clockify.me/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited users", features: ["Unlimited tracking", "Unlimited projects", "Basic reports"] },
      { name: "Basic", price: 3.99, period: "month per seat", description: "Annual ($4.99 monthly)", features: ["Time audit", "Time off tracking", "Targets"] },
      { name: "Standard", price: 5.49, period: "month per seat", description: "Annual ($6.99 monthly)", features: ["GPS tracking", "Forecasting", "Scheduling"], highlighted: true },
      { name: "Pro", price: 7.99, period: "month per seat", description: "Annual ($9.99 monthly)", features: ["Labor costs", "Budget alerts", "Custom fields"] },
      { name: "Enterprise", price: 11.99, period: "month per seat", description: "Annual ($14.99 monthly)", features: ["SSO", "Audit log", "Priority support"] }
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

  console.log("🔧 Starting verified pricing corrections batch 3...\n");

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
    message: "Verified pricing corrections batch 3 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
