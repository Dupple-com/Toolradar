import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fifteenth batch of verified pricing from WebFetch (December 2025) - Project Management & Forms
const verifiedPricing: Record<string, object> = {
  // Airtable - https://www.airtable.com/pricing
  "airtable": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1000 records/base", features: ["1GB attachments", "14-day history", "100 automations/mo"] },
      { name: "Team", price: 20, period: "user/month", description: "Annual ($24 monthly)", features: ["50K records/base", "20GB attachments", "25K automations"], highlighted: true },
      { name: "Business", price: 45, period: "user/month", description: "Annual ($54 monthly)", features: ["100K records/base", "100GB attachments", "100K automations"] },
      { name: "Enterprise Scale", price: "Custom", description: "Contact sales", features: ["500K records/base", "1TB attachments", "Dedicated support"] }
    ]
  },

  // ClickUp - https://www.clickup.com/pricing
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.clickup.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "Personal use", features: ["60MB storage", "Unlimited tasks", "Basic features"] },
      { name: "Unlimited", price: 7, period: "user/month", description: "Annual", features: ["Unlimited storage", "Gantt charts", "Integrations"], highlighted: true },
      { name: "Business", price: 12, period: "user/month", description: "Annual", features: ["SSO", "Mind maps", "Whiteboards"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["White labeling", "HIPAA", "Advanced permissions"] }
    ],
    notes: "100% money-back guarantee. 30% savings with yearly billing."
  },

  // Asana - https://asana.com/pricing
  "asana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://asana.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "1-2 users", features: ["Unlimited tasks", "List/board/calendar", "Mobile apps"] },
      { name: "Starter", price: 10.99, period: "user/month", description: "Annual ($13.49 monthly)", features: ["Timeline/Gantt", "Workflow builder", "Asana AI"], highlighted: true },
      { name: "Advanced", price: 24.99, period: "user/month", description: "Annual ($30.49 monthly)", features: ["Goals", "Portfolios", "Approvals"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SAML", "24/7 support", "Data export"] }
    ]
  },

  // Teamwork - https://www.teamwork.com/pricing
  "teamwork": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.teamwork.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users max", features: ["5 projects", "Basic PM", "Time tracking"] },
      { name: "Deliver", price: 10.99, period: "user/month", description: "Annual", features: ["Status reports", "Teams", "5K automations"], highlighted: true },
      { name: "Grow", price: 19.99, period: "user/month", description: "Annual", features: ["Budgeting", "HubSpot", "20K automations"] },
      { name: "Scale", price: "Custom", description: "Contact sales", features: ["100K automations", "Premium features"] }
    ]
  },

  // Jotform - https://www.jotform.com/pricing/
  "jotform": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.jotform.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["5 forms", "100 submissions/mo", "Basic features"] },
      { name: "Bronze", price: 39, period: "month", description: "Annual saves 50%", features: ["25 forms", "1000 submissions", "More integrations"] },
      { name: "Silver", price: 49, period: "month", description: "Annual saves 50%", features: ["50 forms", "2500 submissions", "Advanced features"], highlighted: true },
      { name: "Gold", price: 129, period: "month", description: "Annual saves 50%", features: ["100 forms", "10K submissions", "HIPAA optional"] }
    ],
    notes: "50% off for nonprofits/education"
  },

  // Tally - https://www.tally.so/pricing
  "tally": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tally.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited", features: ["Unlimited forms", "Unlimited submissions", "Stripe payments", "Integrations"] },
      { name: "Pro", price: 20, period: "month", description: "€250/year", features: ["Remove branding", "Custom domains", "Team collaboration"], highlighted: true },
      { name: "Business", price: 65, period: "month", description: "€790/year", features: ["Data retention control", "Email verification", "90-day history"] }
    ],
    notes: "Most generous free tier for forms"
  },

  // Formstack - https://www.formstack.com/pricing
  "formstack": {
    startingPrice: 42, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.formstack.com/pricing",
    tiers: [
      { name: "Forms", price: 42, period: "month", description: "Annual ($83 monthly)", features: ["1 user", "25 forms", "1000 submissions"] },
      { name: "Suite", price: 125, period: "month", description: "Annual ($250 monthly)", features: ["3 users", "100 forms", "Workflows"], highlighted: true },
      { name: "Documents", price: 42, period: "month", description: "Annual ($83 monthly)", features: ["50 merges/mo", "10 templates"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Dedicated CSM"] }
    ],
    notes: "50% off annual with code SAVENOW"
  },

  // SurveyMonkey - https://www.surveymonkey.com/pricing/
  "surveymonkey": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.surveymonkey.com/pricing/",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["10 questions/survey", "40 responses/survey", "Basic features"] },
      { name: "Team Advantage", price: 30, period: "user/month", description: "Annual, 3+ users", features: ["50K responses/year", "Shared library", "Collaboration"], highlighted: true },
      { name: "Team Premier", price: 75, period: "user/month", description: "Annual, 3+ users", features: ["100K responses/year", "White label", "Multilingual"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "Custom subdomain", "Advanced admin"] }
    ],
    notes: "Individual plans from €42/mo"
  },

  // Calendly - https://www.calendly.com/pricing
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["1 event type", "1 calendar", "Mobile apps"] },
      { name: "Standard", price: 10, period: "seat/month", description: "Annual ($12 monthly)", features: ["Unlimited events", "6 calendars", "24/7 chat"], highlighted: true },
      { name: "Teams", price: 16, period: "seat/month", description: "Annual ($20 monthly)", features: ["Round-robin", "Salesforce", "SSO add-on"] },
      { name: "Enterprise", price: 15000, period: "year", description: "Starting price", features: ["Dedicated support", "SAML", "Domain control"] }
    ]
  },

  // Vidyard - https://www.vidyard.com/pricing/
  "vidyard": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.vidyard.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Basic features", features: ["15 AI videos/mo", "Stock avatars", "Basic editing"] },
      { name: "Starter", price: 59, period: "seat/month", description: "Annual", features: ["Unlimited recording", "Full analytics", "Team performance"], highlighted: true },
      { name: "Teams", price: "Custom", description: "5+ members", features: ["CRM integrations", "Advanced analytics", "Captions"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "IP access control", "Unlimited integrations"] }
    ],
    notes: "Video Agent add-on: $24/seat/mo"
  },

  // Screencastify - https://www.screencastify.com/pricing
  "screencastify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.screencastify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 videos max", features: ["30-min recordings", "Basic sharing", "Privacy controls"] },
      { name: "Starter", price: 7, period: "user/month", description: "Annual ($19 monthly)", features: ["Unlimited videos", "60-min recordings", "No watermark"], highlighted: true },
      { name: "Pro", price: 10, period: "user/month", description: "Annual ($25 monthly)", features: ["180-min recordings", "AI enhancements", "Transcripts"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "LMS integrations", "Admin controls"] }
    ],
    notes: "FERPA/COPPA compliant for education"
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

  console.log("🔧 Starting verified pricing corrections batch 15 (Project Management & Forms)...\n");

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
    message: "Verified pricing corrections batch 15 (Project Management & Forms) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
