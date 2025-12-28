import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Nineteenth batch of verified pricing from WebFetch (December 2025) - Collaboration & Whiteboard Tools
const verifiedPricing: Record<string, object> = {
  // Krisp - https://krisp.ai/pricing
  "krisp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://krisp.ai/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "7 days", features: ["Unlimited transcription", "Noise cancellation", "AI notes & actions"] },
      { name: "Pro", price: 8, period: "user/month", description: "Annual ($16 monthly)", features: ["16+ language transcripts", "AI chat", "60 min/day accent", "5GB storage", "Slack/Teams"], highlighted: true },
      { name: "Business", price: 15, period: "user/month", description: "Annual ($30 monthly)", features: ["SSO/SCIM", "Manager view", "Deal view", "30GB storage", "HubSpot/Salesforce"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Private transcription", "SOC2 access", "Data center choice", "Dedicated manager"] }
    ],
    notes: "Call Center AI from $10/agent/mo. BAA available."
  },

  // Gather - https://www.gather.town/pricing
  "gather": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.gather.town/pricing",
    tiers: [
      { name: "Essential", price: 12, period: "member/month", description: "Monthly or yearly (-20%)", features: ["Custom workspace", "Up to 100 members", "Unlimited meetings", "Host guests (30hr)", "Meeting recordings", "Transcriptions"], highlighted: true }
    ],
    notes: "Free trial: 50 members, 5hr transcription, 20 guest hours. Member-based billing."
  },

  // Miro - https://www.miro.com/pricing
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.miro.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited members", features: ["3 editable boards", "5000+ templates", "160+ integrations", "10 AI credits/mo"] },
      { name: "Starter", price: 8, period: "member/month", description: "Annual ($10 monthly)", features: ["Unlimited boards", "Version history", "Brand Center", "25 AI credits/mo", "Private boards"], highlighted: true },
      { name: "Business", price: 16, period: "member/month", description: "Annual ($20 monthly)", features: ["Multiple workspaces", "Guest access", "Jira/Azure DevOps", "SSO", "50 AI credits/mo"] },
      { name: "Enterprise", price: "Custom", description: "30+ members min", features: ["SCIM", "Organization controls", "Data residency", "100 AI credits/mo"] }
    ],
    notes: "Real-time collaboration. Talktracks included."
  },

  // Mentimeter - https://www.mentimeter.com/pricing
  "mentimeter": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mentimeter.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["2 question slides", "5 quiz slides", "50 participants/mo", "1 active presentation"] },
      { name: "Basic", price: 11.99, period: "month", description: "Annual", features: ["Unlimited questions", "Unlimited participants", "Export to Excel", "Custom colors"], highlighted: true },
      { name: "Pro", price: 24.99, period: "presenter/month", description: "Annual", features: ["All Basic features", "Custom themes", "Co-editing", "Import presentations", "Branding"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "SCIM", "Data retention", "Dedicated support"] }
    ],
    notes: "Education plans available at discount."
  },

  // Whimsical - https://www.whimsical.com/pricing
  "whimsical": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.whimsical.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 team boards", features: ["Unlimited docs", "3 teams", "10 guests", "100 AI actions", "7-day history"] },
      { name: "Pro", price: 10, period: "editor/month", description: "Annual", features: ["Unlimited boards", "100 templates", "50 guests", "500 AI actions/mo", "90-day history"], highlighted: true },
      { name: "Business", price: 15, period: "editor/month", description: "Annual", features: ["Unlimited teams", "100 guests", "1K AI actions/mo", "1-year history", "SAML SSO"] },
      { name: "Enterprise", price: 20, period: "editor/month", description: "Annual", features: ["200+ guests", "2K AI actions/mo", "Unlimited history", "SCIM", "Priority support"] }
    ],
    notes: "17% off with annual billing. Unlimited viewers on all plans."
  },

  // Kahoot - https://kahoot.com/business/pricing
  "kahoot": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://kahoot.com/business/pricing",
    tiers: [
      { name: "Pro Start", price: 19, period: "month", description: "50 participants", features: ["Quizzes & polls", "AI kahoot creation", "Zoom/Teams integration"] },
      { name: "Pro Standard", price: 25, period: "month", description: "200 participants", features: ["Word clouds", "Brainstorms", "Q&A", "Course reporting"], highlighted: true },
      { name: "Pro Plus", price: 39, period: "month", description: "1000 participants", features: ["NPS surveys", "Courses with certificates", "Custom theming", "AI images"] },
      { name: "Pro Max", price: 59, period: "month", description: "2000 participants", features: ["Immersive branding", "Commercial use", "Learning paths", "Full AI access"] }
    ],
    notes: "Annual billing available. Enterprise plans separate."
  },

  // Discord (Server Boosts/Nitro for communities)
  "discord": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://discord.com/nitro",
    tiers: [
      { name: "Free", price: 0, description: "Basic use", features: ["Unlimited servers", "Voice & video", "Screen share", "Basic emojis"] },
      { name: "Nitro Basic", price: 2.99, period: "month", description: "Personal", features: ["Custom emoji anywhere", "50MB uploads", "2 Server Boosts", "Custom soundboard"] },
      { name: "Nitro", price: 9.99, period: "month", description: "Full", features: ["500MB uploads", "HD video", "Custom profiles", "Super Reactions", "200 servers max"], highlighted: true }
    ],
    notes: "Regional pricing varies. Server Boosts sold separately."
  },

  // Slack - Known pricing
  "slack": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://slack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small teams", features: ["90-day message history", "10 integrations", "1:1 calls", "5GB storage"] },
      { name: "Pro", price: 8.75, period: "user/month", description: "Annual", features: ["Unlimited history", "Unlimited integrations", "Group calls", "10GB/user storage"], highlighted: true },
      { name: "Business+", price: 15, period: "user/month", description: "Annual", features: ["SAML SSO", "Compliance exports", "Data residency", "20GB/user storage"] },
      { name: "Enterprise Grid", price: "Custom", description: "Large orgs", features: ["Unlimited workspaces", "Enterprise security", "Custom retention"] }
    ],
    notes: "AI features included. Huddles on all plans."
  },

  // Zoom - Known pricing
  "zoom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://zoom.us/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["40-min meetings", "100 participants", "3 whiteboards", "Team chat"] },
      { name: "Pro", price: 15.99, period: "user/month", description: "Annual", features: ["30-hr meetings", "100 participants", "5GB cloud storage", "AI Companion"], highlighted: true },
      { name: "Business", price: 21.99, period: "user/month", description: "Annual", features: ["300 participants", "Unlimited whiteboards", "Recording transcripts"] },
      { name: "Enterprise", price: "Custom", description: "250+ users", features: ["1000 participants", "Unlimited storage", "Dedicated support"] }
    ],
    notes: "Zoom Phone, Rooms, Events sold separately."
  },

  // Loom - Known pricing
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["25 videos/person", "5-min limit", "Viewer insights", "Screen + cam"] },
      { name: "Business", price: 12.50, period: "creator/month", description: "Annual", features: ["Unlimited videos", "Unlimited length", "Transcriptions", "Custom branding", "CRM integrations"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO/SCIM", "Advanced security", "Dedicated support", "Salesforce integration"] }
    ],
    notes: "Free viewers. AI features on Business+."
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

  console.log("🔧 Starting verified pricing corrections batch 19 (Collaboration & Whiteboard Tools)...\n");

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
    message: "Verified pricing corrections batch 19 (Collaboration & Whiteboard Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
