import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 68: Video & Media Tools pricing
const verifiedPricing: Record<string, object> = {
  "obs-studio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://obsproject.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Streaming", "Recording", "Virtual camera", "Plugins"], highlighted: true }],
    notes: "Free and open source. Industry standard."
  },
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["25 videos/person", "5 min limit", "Basic editing"] },
      { name: "Business", price: 12.50, period: "user/month", description: "Annual", features: ["Unlimited videos", "No time limit", "Engagement insights"], highlighted: true }
    ],
    notes: "Video messaging. Free tier limited."
  },
  "descript": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.descript.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 hour transcription", features: ["1 watermarked export", "Basic editing", "Screen recording"] },
      { name: "Creator", price: 12, period: "month", description: "Annual", features: ["10 hours transcription", "Unlimited exports", "Stock library"], highlighted: true }
    ],
    notes: "AI-powered video/audio editing."
  },
  "streamyard": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://streamyard.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1 destination", "20-hour limit", "StreamYard branding"] },
      { name: "Basic", price: 20, period: "month", description: "Monthly", features: ["3 destinations", "No branding", "Recordings"], highlighted: true }
    ],
    notes: "Browser-based live streaming."
  },
  "restream": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://restream.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 channels", features: ["2 channels", "Restream branding", "Basic analytics"] },
      { name: "Standard", price: 16, period: "month", description: "Annual", features: ["5 channels", "No branding", "Recording"], highlighted: true }
    ],
    notes: "Multi-platform streaming."
  },
  "cloudinary": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://cloudinary.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25 credits", features: ["25 credits/mo", "3 users", "Basic transformations"], highlighted: true },
      { name: "Plus", price: 89, period: "month", description: "225 credits", features: ["225 credits", "5 users", "Advanced features"] }
    ],
    notes: "Media management platform. Free tier."
  },
  "imgix": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://imgix.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1000 images", features: ["1000 origin images", "Basic transformations", "CDN"] },
      { name: "Starter", price: 10, period: "month", description: "Annual", features: ["10K images", "All features", "Priority CDN"], highlighted: true }
    ],
    notes: "Image processing and CDN."
  },
  "mux": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.mux.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Pay as you go", features: ["$0.00 to start", "Video encoding", "Streaming", "Analytics"], highlighted: true }
    ],
    notes: "Video infrastructure. Pay per use."
  },
  "vimeo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://vimeo.com/upgrade",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["500MB/week upload", "Unlimited views", "Basic privacy"] },
      { name: "Starter", price: 9, period: "month", description: "Annual", features: ["60 videos/year", "Advanced privacy", "Player customization"], highlighted: true }
    ],
    notes: "Video hosting platform. Free tier."
  },
  "wistia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://wistia.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 videos", features: ["3 videos", "250 plays/mo", "Basic player"] },
      { name: "Plus", price: 19, period: "month", description: "Annual", features: ["10 videos", "Unlimited plays", "Lead capture"], highlighted: true }
    ],
    notes: "Business video hosting."
  },
  "vidyard": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.vidyard.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["25 videos", "Screen recording", "Basic sharing"], highlighted: true },
      { name: "Pro", price: 19, period: "month", description: "Individual", features: ["Unlimited videos", "CTAs", "Analytics"] }
    ],
    notes: "Video for sales and marketing."
  },
  "bannerbear": {
    startingPrice: 49, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.bannerbear.com/pricing",
    tiers: [
      { name: "Starter", price: 49, period: "month", description: "1K images", features: ["1000 images/mo", "1 project", "API access"], highlighted: true },
      { name: "Pro", price: 149, period: "month", description: "10K images", features: ["10K images", "5 projects", "Priority support"] }
    ],
    notes: "Auto-generated images and videos."
  },
  "placid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://placid.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 images", features: ["50 images/mo", "1 project", "Watermark"] },
      { name: "Starter", price: 29, period: "month", description: "1K images", features: ["1000 images", "2 projects", "No watermark"], highlighted: true }
    ],
    notes: "Auto-generate images from templates."
  },
  "remotion": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.remotion.dev/license",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["React videos", "Full features", "Community support"], highlighted: true },
      { name: "Company", price: 15, period: "dev/month", description: "Per developer", features: ["Commercial use", "Priority support", "Team license"] }
    ],
    notes: "Programmatic video in React."
  },
  "ffmpeg": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://ffmpeg.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Video conversion", "Audio processing", "Streaming", "All formats"], highlighted: true }],
    notes: "Free and open source. Universal media tool."
  },
  "handbrake": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://handbrake.fr",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Video transcoding", "Presets", "Batch encoding", "Cross-platform"], highlighted: true }],
    notes: "Free and open source video transcoder."
  },
  "screenflow": {
    startingPrice: 169, currency: "USD", billingPeriod: "once", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.telestream.net/screenflow",
    tiers: [{ name: "Full License", price: 169, period: "once", description: "One-time", features: ["Screen recording", "Video editing", "Motion graphics", "Export options"], highlighted: true }],
    notes: "Mac screen recording. One-time purchase."
  },
  "camtasia": {
    startingPrice: 179.88, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 3,
    pricingPageUrl: "https://www.techsmith.com/store/camtasia",
    tiers: [
      { name: "Individual", price: 179.88, period: "year", description: "Annual", features: ["Screen recording", "Video editing", "Templates", "Assets"], highlighted: true },
      { name: "Perpetual", price: 299.99, period: "once", description: "One-time", features: ["Lifetime license", "1 year maintenance", "All features"] }
    ],
    notes: "Screen recording and video editing."
  },
  "snagit": {
    startingPrice: 62.99, currency: "USD", billingPeriod: "once", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.techsmith.com/store/snagit",
    tiers: [{ name: "Full License", price: 62.99, period: "once", description: "One-time", features: ["Screenshots", "Screen recording", "Annotations", "Templates"], highlighted: true }],
    notes: "Screenshot and recording tool."
  },
  "cleanshot": {
    startingPrice: 29, currency: "USD", billingPeriod: "once", hasFreeTrial: true,
    pricingPageUrl: "https://cleanshot.com",
    tiers: [
      { name: "One-time", price: 29, period: "once", description: "Basic", features: ["Screenshots", "Screen recording", "Annotations", "Cloud 1GB"] },
      { name: "Cloud", price: 8, period: "month", description: "Pro", features: ["Unlimited cloud", "Quick access", "Share links"], highlighted: true }
    ],
    notes: "Mac screenshot tool. One-time + cloud."
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
    message: "Pricing batch 68 (Video & Media) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
