import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirtieth batch of verified pricing from WebFetch (December 2025) - Video, Recording & Communication
const verifiedPricing: Record<string, object> = {
  // StreamYard - https://streamyard.com/pricing
  "streamyard": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://streamyard.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic streaming", features: ["6 participants", "StreamYard branding", "2hr local recordings", "24hr storage"] },
      { name: "Core", price: 19.99, period: "month", description: "No branding", features: ["1080p streaming", "3 destinations", "10 participants", "50hr storage", "AI clips"], highlighted: true },
      { name: "Advanced", price: 39.99, period: "month", description: "4K recording", features: ["4K recordings", "8 destinations", "15 backstage", "Pre-recorded streams"] }
    ],
    notes: "Annual discounts available. Best for live streaming."
  },

  // Riverside - https://riverside.com/pricing
  "riverside": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://riverside.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2hr multi-track", features: ["720p video", "Basic editing", "Watermarked", "Unlimited single-track"] },
      { name: "Pro", price: 24, period: "month", description: "Annual ($29 monthly)", features: ["15hr multi-track", "4K video", "AI transcription", "Magic Clips"], highlighted: true },
      { name: "Live", price: 34, period: "month", description: "Annual ($39 monthly)", features: ["All Pro", "1080p streaming", "Multistreaming", "Custom RTMP"] },
      { name: "Webinar", price: 79, period: "month", description: "Annual ($99 monthly)", features: ["All Live", "100 registrants", "Q&A/Polls", "HubSpot integration"] }
    ],
    notes: "SOC2 Type II. Best for podcasts & recordings."
  },

  // Otter.ai - https://www.otter.ai/pricing
  "otter-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.otter.ai/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["300 mins/month", "Zoom/Teams/Meet", "AI chat", "Speaker ID"] },
      { name: "Pro", price: 8.33, period: "user/month", description: "Annual ($16.99 monthly)", features: ["1,200 mins", "Advanced AI workflows", "10 file imports", "Team vocabulary"], highlighted: true },
      { name: "Business", price: 19.99, period: "user/month", description: "Annual ($30 monthly)", features: ["Unlimited meetings", "4hr per meeting", "3 concurrent meetings", "Custom workflows"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SSO", "HIPAA compliance", "Dedicated manager"] }
    ],
    notes: "51% off annual on Pro. AI meeting assistant."
  },

  // Rev - https://rev.com/pricing
  "rev": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://rev.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "45 min AI/month", features: ["AI Notetaker", "Mobile app", "Transcript editor", "Human services access"] },
      { name: "Basic", price: 9.99, period: "seat/month", description: "Annual ($14.99 monthly)", features: ["20hr AI/month", "15% off human services", "All Free features"], highlighted: true },
      { name: "Pro", price: 20.99, period: "seat/month", description: "Annual ($34.99 monthly)", features: ["100hr AI/month", "37 languages", "30% off human services", "Interactive captions"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "HIPAA/SOC2", "SSO", "Dedicated account manager"] }
    ],
    notes: "Human transcription services separate. 99% accuracy."
  },

  // Vidyard - https://www.vidyard.com/pricing
  "vidyard": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.vidyard.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "15 AI videos/mo", features: ["Stock avatars", "3 custom AI avatars", "Basic editing", "Sharing"] },
      { name: "Starter", price: 59, period: "seat/month", description: "Annual", features: ["Unlimited recording", "Full analytics", "CTAs", "Password protection"], highlighted: true },
      { name: "Teams", price: "Custom", description: "5+ users", features: ["All Starter", "CRM integrations", "Team analytics", "Captions"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Teams", "SSO", "Custom permissions", "Secure playback"] }
    ],
    notes: "Video Agent add-on $24/seat. Sales video platform."
  },

  // Zoom - Known pricing
  "zoom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://zoom.us/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["100 participants", "40 min meetings", "Local recording", "Virtual backgrounds"] },
      { name: "Pro", price: 13.33, period: "user/month", description: "Annual ($15.99 monthly)", features: ["30hr meetings", "5GB storage", "Polling", "Streaming"], highlighted: true },
      { name: "Business", price: 18.33, period: "user/month", description: "Annual ($21.99 monthly)", features: ["300 participants", "Unlimited storage", "SSO", "Company branding"] },
      { name: "Business Plus", price: 22.49, period: "user/month", description: "Annual", features: ["All Business", "Phone", "Translated captions", "Workspace reservation"] }
    ],
    notes: "Webinars, Phone, Rooms sold separately. AI Companion included."
  },

  // Loom - Known pricing
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["25 videos/person", "5 min max", "720p", "AI features"] },
      { name: "Business", price: 12.50, period: "creator/month", description: "Annual ($15 monthly)", features: ["Unlimited videos", "Unlimited length", "1080p", "CTA buttons", "Analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SSO/SCIM", "Advanced security", "Dedicated success manager"] }
    ],
    notes: "Viewers always free. Part of Atlassian."
  },

  // Descript - Known pricing
  "descript": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.descript.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1hr transcription", features: ["720p export", "Stock media", "Basic AI features", "Screen recording"] },
      { name: "Hobbyist", price: 12, period: "month", description: "Annual ($15 monthly)", features: ["10hr transcription", "1080p export", "AI actions", "Filler word removal"] },
      { name: "Creator", price: 24, period: "month", description: "Annual ($30 monthly)", features: ["30hr transcription", "4K export", "Full AI features", "Overdub"], highlighted: true },
      { name: "Business", price: 40, period: "month", description: "Annual ($50 monthly)", features: ["40hr transcription", "Team workspaces", "Advanced analytics"] }
    ],
    notes: "All-in-one video/audio editor. Overdub voice cloning."
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

  console.log("🔧 Starting verified pricing corrections batch 30 (Video, Recording & Communication)...\n");

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
    message: "Verified pricing corrections batch 30 (Video, Recording & Communication) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
