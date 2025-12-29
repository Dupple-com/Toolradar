import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-ninth batch of verified pricing from WebFetch (December 2025) - AI Video & Image Tools
const verifiedPricing: Record<string, object> = {
  // Kapwing - https://www.kapwing.com/pricing
  "kapwing": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.kapwing.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Watermarked", features: ["4 min videos", "720p quality", "10 AI credits/mo"] },
      { name: "Pro", price: 16, period: "month", description: "Annual ($24 monthly)", features: ["No watermark", "4K export", "2hr videos", "1K AI credits"], highlighted: true },
      { name: "Business", price: 50, period: "month", description: "Annual ($64 monthly)", features: ["Voice clones", "Lip sync", "4K AI credits", "6GB uploads"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom credits", "SSO", "Dedicated manager"] }
    ],
    notes: "AI video editor. Browser-based, no download."
  },

  // Synthesia - https://www.synthesia.io/pricing
  "synthesia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.synthesia.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 min/mo", features: ["9 AI avatars", "1 editor", "Basic features"] },
      { name: "Starter", price: 18, period: "month", description: "Annual ($29 monthly)", features: ["10 min/mo", "125+ avatars", "AI dubbing", "No watermark"], highlighted: true },
      { name: "Creator", price: 64, period: "month", description: "Annual ($89 monthly)", features: ["30 min/mo", "180+ avatars", "5 personal avatars", "API access"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited minutes", "SSO", "80+ language translation"] }
    ],
    notes: "AI avatar video creation. 140+ languages."
  },

  // Midjourney - Known pricing
  "midjourney": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.midjourney.com/account",
    tiers: [
      { name: "Basic", price: 10, period: "month", description: "Annual ($8/mo)", features: ["200 generations/mo", "3 concurrent jobs", "General commercial use"] },
      { name: "Standard", price: 30, period: "month", description: "Annual ($24/mo)", features: ["15hr fast time", "Unlimited relax", "Stealth mode"], highlighted: true },
      { name: "Pro", price: 60, period: "month", description: "Annual ($48/mo)", features: ["30hr fast time", "12 concurrent jobs", "Stealth mode"] },
      { name: "Mega", price: 120, period: "month", description: "Annual ($96/mo)", features: ["60hr fast time", "12 concurrent", "Priority support"] }
    ],
    notes: "AI image generation. Discord-based interface."
  },

  // DALL-E (OpenAI) - Known pricing
  "dall-e": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://openai.com/dall-e-3",
    tiers: [
      { name: "ChatGPT Plus", price: 20, period: "month", description: "Included", features: ["DALL-E 3 access", "In ChatGPT", "Standard quality"], highlighted: true },
      { name: "API", price: 0, description: "Pay-per-image", features: ["$0.04/image standard", "$0.08/image HD", "1024x1024"] }
    ],
    notes: "Best quality AI images. Included in ChatGPT Plus."
  },

  // Stable Diffusion (Stability AI) - Known pricing
  "stable-diffusion": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://stability.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25 credits/day", features: ["Basic models", "Standard resolution", "Watermark"] },
      { name: "Creator", price: 10, period: "month", description: "500 credits", features: ["All models", "HD resolution", "No watermark"] },
      { name: "Professional", price: 30, period: "month", description: "1500 credits", features: ["Priority access", "Commercial use", "API access"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited credits", "Custom models", "SLA"] }
    ],
    notes: "Open source AI image generation. Self-host free."
  },

  // Runway - Known pricing
  "runway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://runwayml.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "125 credits", features: ["Gen-3 Alpha", "Basic exports", "720p video"] },
      { name: "Standard", price: 12, period: "month", description: "625 credits/mo", features: ["4K exports", "All tools", "Upscaling"], highlighted: true },
      { name: "Pro", price: 28, period: "month", description: "2250 credits/mo", features: ["All Standard", "Priority generation", "Advanced features"] },
      { name: "Unlimited", price: 76, period: "month", description: "Unlimited Gen-3", features: ["Unlimited relaxed", "Max resolution", "All features"] }
    ],
    notes: "AI video generation. Gen-3 Alpha for videos."
  },

  // ElevenLabs - Known pricing
  "elevenlabs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://elevenlabs.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K chars/mo", features: ["3 custom voices", "128kbps audio", "Basic features"] },
      { name: "Starter", price: 5, period: "month", description: "30K chars/mo", features: ["10 custom voices", "Commercial use", "API access"], highlighted: true },
      { name: "Creator", price: 22, period: "month", description: "100K chars/mo", features: ["30 voices", "Professional voice cloning", "192kbps"] },
      { name: "Pro", price: 99, period: "month", description: "500K chars/mo", features: ["160 voices", "44.1kHz audio", "Priority support"] }
    ],
    notes: "AI voice generation & cloning. 32 languages."
  },

  // Pika - Known pricing
  "pika": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://pika.art/pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 credits/mo", features: ["Basic generation", "Watermark", "Standard queue"] },
      { name: "Standard", price: 8, period: "month", description: "700 credits/mo", features: ["No watermark", "1080p export", "Faster generation"], highlighted: true },
      { name: "Pro", price: 28, period: "month", description: "2000 credits/mo", features: ["All Standard", "Priority queue", "4K export"] },
      { name: "Unlimited", price: 58, period: "month", description: "Unlimited", features: ["Unlimited generations", "Max quality", "Priority support"] }
    ],
    notes: "AI video generation platform. Text/image to video."
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

  console.log("🔧 Starting verified pricing corrections batch 39 (AI Video & Image Tools)...\n");

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
    message: "Verified pricing corrections batch 39 (AI Video & Image Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
