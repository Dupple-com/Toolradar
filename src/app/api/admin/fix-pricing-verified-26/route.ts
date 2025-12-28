import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-sixth batch of verified pricing from WebFetch (December 2025) - Forms, Scheduling & Productivity
const verifiedPricing: Record<string, object> = {
  // Calendly - https://calendly.com/pricing
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["1 event type", "1 calendar", "Video conferencing", "Mobile apps"] },
      { name: "Standard", price: 10, period: "seat/month", description: "Annual ($12 monthly)", features: ["Unlimited events", "6 calendars", "HubSpot/Stripe integration", "24/7 chat"], highlighted: true },
      { name: "Teams", price: 16, period: "seat/month", description: "Annual ($20 monthly)", features: ["All Standard", "Salesforce sync", "Round-robin", "Lead routing", "SSO add-on"] },
      { name: "Enterprise", price: 15000, period: "year", description: "Starting price", features: ["All Teams", "Dynamics integration", "Audit log", "Security reviews"] }
    ],
    notes: "16-20% off annual. Integrates with 750+ apps."
  },

  // Typeform - https://www.typeform.com/pricing
  "typeform": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.typeform.com/pricing",
    tiers: [
      { name: "Basic", price: 25, period: "month", description: "Annual ($29 monthly)", features: ["100 responses/mo", "1 user", "Unlimited forms", "Basic integrations"] },
      { name: "Plus", price: 50, period: "month", description: "Annual ($59 monthly)", features: ["1K responses/mo", "3 users", "Remove branding", "Custom subdomain"], highlighted: true },
      { name: "Business", price: 83, period: "month", description: "Annual ($99 monthly)", features: ["10K responses/mo", "5 users", "Drop-off rates", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom limits", "VIP support", "SSO", "HIPAA/GDPR"] }
    ],
    notes: "Growth plans from $166/mo for enrichment features."
  },

  // Jotform - https://www.jotform.com/pricing
  "jotform": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.jotform.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["5 forms", "100 submissions/mo", "1GB uploads", "Basic templates"] },
      { name: "Bronze", price: 39, period: "month", description: "25 forms", features: ["1K submissions/mo", "1TB uploads", "3 subusers", "Payments"], highlighted: true },
      { name: "Silver", price: 49, period: "month", description: "50 forms", features: ["2.5K submissions/mo", "10TB uploads", "10 subusers", "Advanced integrations"] },
      { name: "Gold", price: 129, period: "month", description: "100 forms", features: ["10K submissions/mo", "100TB uploads", "HIPAA compliance", "100 subusers"] }
    ],
    notes: "60% off annual. 50% nonprofit/education discount."
  },

  // SurveyMonkey - https://www.surveymonkey.com/pricing
  "surveymonkey": {
    startingPrice: 30, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.surveymonkey.com/pricing",
    tiers: [
      { name: "Team Advantage", price: 30, period: "user/month", description: "Annual (3+ users)", features: ["50K responses/year", "Unlimited surveys", "Collaboration", "Custom branding"], highlighted: true },
      { name: "Team Premier", price: 75, period: "user/month", description: "Annual (3+ users)", features: ["100K responses/year", "White-label", "SMS surveys", "Offline mode"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom limits", "SSO", "HIPAA", "Data center selection"] }
    ],
    notes: "Individual plans from €42/year. API access on Premier+."
  },

  // DocuSign - https://ecom.docusign.com/plans-and-pricing/esignature
  "docusign": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.docusign.com/products-and-pricing",
    tiers: [
      { name: "Personal", price: 10, period: "month", description: "Annual ($120/yr)", features: ["5 envelopes/mo", "Secure storage", "AI summary", "Templates"] },
      { name: "Standard", price: 25, period: "user/month", description: "Up to 50 users", features: ["100 envelopes/user/yr", "Team templates", "Real-time commenting"], highlighted: true },
      { name: "Business Pro", price: 40, period: "user/month", description: "Up to 50 users", features: ["All Standard", "Web forms", "Payment collection", "Bulk sending"] },
      { name: "Enhanced", price: "Custom", description: "Contact sales", features: ["Custom limits", "24/7 support", "SSO", "Salesforce integration"] }
    ],
    notes: "1B+ users worldwide. 99.99% SLA on enterprise."
  },

  // Grammarly - https://www.grammarly.com/plans
  "grammarly": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.grammarly.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic writing", features: ["Spelling & grammar", "Tone detection", "100 AI prompts"] },
      { name: "Pro", price: 12, period: "month", description: "7-day trial", features: ["Full-sentence rewrites", "Tone adjustments", "Plagiarism detection", "2K AI prompts/mo"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "Dedicated support", "BYOK encryption", "Unlimited AI prompts"] }
    ],
    notes: "Works in 500K+ apps. Browser extension included."
  },

  // Buffer - https://buffer.com/pricing
  "buffer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://buffer.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 channels", features: ["10 scheduled posts/channel", "100 ideas", "AI Assistant", "Basic analytics"] },
      { name: "Essentials", price: 5, period: "channel/month", description: "20% off annual", features: ["Unlimited posts", "Unlimited ideas", "Advanced analytics", "Hashtag manager"], highlighted: true },
      { name: "Team", price: 10, period: "channel/month", description: "20% off annual", features: ["All Essentials", "Unlimited users", "Approval workflows", "Branded reports"] }
    ],
    notes: "Volume discounts for more channels. 14-day trial."
  },

  // Evernote - https://www.evernote.com/compare-plans
  "evernote": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.evernote.com/compare-plans",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["50 notes", "1 notebook", "1 device", "250MB/mo uploads"] },
      { name: "Starter", price: 14.99, period: "month", description: "Or $99/yr", features: ["1K notes", "20 notebooks", "3 devices", "1GB storage"] },
      { name: "Advanced", price: 24.99, period: "month", description: "Or $249.99/yr", features: ["Unlimited notes", "Unlimited notebooks", "Unlimited devices", "AI features"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Advanced", "Data ownership", "SSO", "Dedicated support"] }
    ],
    notes: "Web Clipper free on all plans. Tasks & Calendar included."
  },

  // Todoist - https://todoist.com/pricing
  "todoist": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://todoist.com/pricing",
    tiers: [
      { name: "Beginner", price: 0, description: "Free forever", features: ["5 projects", "Smart quick add", "Task reminders", "3 filter views"] },
      { name: "Pro", price: 5, period: "month", description: "20% off annual", features: ["300 projects", "Calendar layout", "Task duration", "150 filter views"], highlighted: true },
      { name: "Business", price: 8, period: "user/month", description: "Annual billing", features: ["All Pro", "500 team projects", "Team activity logs", "Roles & permissions"] }
    ],
    notes: "90+ integrations. SOC2 Type II certified."
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

  console.log("🔧 Starting verified pricing corrections batch 26 (Forms, Scheduling & Productivity)...\n");

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
    message: "Verified pricing corrections batch 26 (Forms, Scheduling & Productivity) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
