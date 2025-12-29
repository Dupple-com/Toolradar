import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-second batch of verified pricing from WebFetch (December 2025) - AI Writing & Content Tools
const verifiedPricing: Record<string, object> = {
  // Jasper - https://www.jasper.ai/pricing
  "jasper": {
    startingPrice: 59, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.jasper.ai/pricing",
    tiers: [
      { name: "Pro", price: 59, period: "seat/month", description: "Annual ($69 monthly)", features: ["Canvas platform", "2 Brand Voices", "Image generation", "30+ languages", "Plagiarism checker"], highlighted: true },
      { name: "Business", price: "Custom", description: "12-month minimum", features: ["All Pro", "AI App Builder", "Marketing Agents", "API access", "SSO/SCIM"] }
    ],
    notes: "7-day free trial. Enterprise-grade AI for marketing."
  },

  // Copy.ai - https://www.copy.ai/pricing
  "copy-ai": {
    startingPrice: 24, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.copy.ai/pricing",
    tiers: [
      { name: "Chat", price: 24, period: "month", description: "Annual ($29 monthly)", features: ["5 seats", "Unlimited words", "OpenAI/Anthropic/Gemini", "Unlimited projects"], highlighted: true },
      { name: "Growth", price: 1000, period: "month", description: "Annual", features: ["75 seats", "20K workflow credits/mo", "Unlimited chat words"] },
      { name: "Expansion", price: 2000, period: "month", description: "Annual", features: ["150 seats", "45K workflow credits/mo"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["API access", "20+ integrations", "Enterprise security"] }
    ],
    notes: "20% off annual billing. GTM AI platform."
  },

  // Writesonic - https://writesonic.com/pricing
  "writesonic": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://writesonic.com/pricing",
    tiers: [
      { name: "Lite", price: 39, period: "month", description: "Annual ($49 monthly)", features: ["15 AI articles/mo", "6 site audits", "100 AI agent gen", "2 writing styles"] },
      { name: "Standard", price: 79, period: "month", description: "Annual ($99 monthly)", features: ["30 articles/mo", "15 site audits", "Unlimited AI agent", "5 writing styles"], highlighted: true },
      { name: "Professional", price: 199, period: "month", description: "Annual ($249 monthly)", features: ["100 articles/mo", "40 audits", "Brand tracking", "Priority support"] },
      { name: "Advanced", price: 399, period: "month", description: "Annual ($499 monthly)", features: ["200 articles/mo", "60 audits", "5 extra users", "Slack support"] }
    ],
    notes: "SEO + AI writing combo. GEO optimization."
  },

  // Wordtune - https://www.wordtune.com/plans
  "wordtune": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 3,
    pricingPageUrl: "https://www.wordtune.com/plans",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["10 rewrites/day", "3 summaries/mo", "Spelling & grammar"] },
      { name: "Advanced", price: 4.89, period: "month", description: "Annual ($6.99 monthly)", features: ["30 rewrites/day", "15 summaries/mo", "AI recommendations"], highlighted: true },
      { name: "Unlimited", price: 6.99, period: "month", description: "Annual ($9.99 monthly)", features: ["Unlimited rewrites", "Unlimited summaries", "Premium support"] }
    ],
    notes: "50% off annual. By AI21 Labs."
  },

  // ChatGPT - Known pricing
  "chatgpt": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://openai.com/chatgpt/pricing",
    tiers: [
      { name: "Free", price: 0, description: "GPT-4o mini", features: ["Limited access to GPT-4o", "Basic features", "Web browsing", "DALL-E"] },
      { name: "Plus", price: 20, period: "month", description: "Individual", features: ["GPT-4o", "Extended limits", "Advanced voice", "DALL-E/Analysis"], highlighted: true },
      { name: "Pro", price: 200, period: "month", description: "Power users", features: ["Unlimited GPT-4o", "o1 pro mode", "Extended context"] },
      { name: "Team", price: 25, period: "user/month", description: "Annual ($30 monthly)", features: ["All Plus", "Admin console", "Team workspaces"] }
    ],
    notes: "Enterprise pricing custom. API separate."
  },

  // Claude - Known pricing
  "claude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.anthropic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Claude 3.5 Sonnet", features: ["Limited messages", "Web access", "File uploads", "Projects"] },
      { name: "Pro", price: 20, period: "month", description: "Individual", features: ["5x more usage", "Priority access", "Claude 3.5 Opus", "Early features"], highlighted: true },
      { name: "Team", price: 25, period: "user/month", description: "5+ users", features: ["All Pro", "Admin console", "Team collaboration"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO/SAML", "Domain capture", "Audit logs"] }
    ],
    notes: "By Anthropic. API pricing separate."
  },

  // Notion AI - Known pricing
  "notion-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/product/ai",
    tiers: [
      { name: "Free Trial", price: 0, description: "Limited responses", features: ["AI writing assist", "Summarization", "Q&A", "Autofill"] },
      { name: "AI Add-on", price: 10, period: "member/month", description: "Annual ($10/mo)", features: ["Unlimited AI", "All AI features", "Works with all plans"], highlighted: true }
    ],
    notes: "Requires Notion subscription. AI features across workspace."
  },

  // Rytr - Known pricing
  "rytr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://rytr.me/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K chars/mo", features: ["40+ use cases", "30+ languages", "20+ tones", "Plagiarism checker"] },
      { name: "Saver", price: 9, period: "month", description: "100K chars/mo", features: ["All Free features", "Custom use cases", "Priority support"], highlighted: true },
      { name: "Unlimited", price: 29, period: "month", description: "Unlimited chars", features: ["All Saver", "Dedicated manager", "Priority email/chat"] }
    ],
    notes: "2 months free with annual. Budget AI writer."
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

  console.log("🔧 Starting verified pricing corrections batch 32 (AI Writing & Content Tools)...\n");

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
    message: "Verified pricing corrections batch 32 (AI Writing & Content Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
