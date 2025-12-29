import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 58: AI Tools & LLMs pricing
const verifiedPricing: Record<string, object> = {
  "openai-api": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://openai.com/pricing",
    tiers: [
      { name: "Pay as you go", price: 0, period: "usage", description: "API access", features: ["GPT-4o", "GPT-4", "DALL-E 3", "Whisper"], highlighted: true }
    ],
    notes: "Pay per token. GPT-4o: $5/1M input, $15/1M output."
  },
  "anthropic-api": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.anthropic.com/api",
    tiers: [
      { name: "Pay as you go", price: 0, period: "usage", description: "API access", features: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"], highlighted: true }
    ],
    notes: "Pay per token. Sonnet: $3/1M input, $15/1M output."
  },
  "google-gemini": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://ai.google.dev/pricing",
    tiers: [
      { name: "Free", price: 0, description: "15 RPM", features: ["Gemini 1.5 Flash", "Gemini 1.5 Pro", "15 requests/minute"], highlighted: true },
      { name: "Pay as you go", price: 0, period: "usage", description: "API access", features: ["Higher limits", "All models", "Priority access"] }
    ],
    notes: "Free tier with rate limits. Flash: $0.075/1M input."
  },
  "mistral-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mistral.ai/products",
    tiers: [
      { name: "Free Tier", price: 0, description: "API access", features: ["Open models", "1M tokens/mo", "Community support"], highlighted: true },
      { name: "Pay as you go", price: 0, period: "usage", description: "Production", features: ["All models", "Higher limits", "Priority support"] }
    ],
    notes: "Open models available. Mistral Large: $3/1M input."
  },
  "groq": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://groq.com",
    tiers: [
      { name: "Free", price: 0, description: "Rate limited", features: ["Llama 3", "Mixtral", "Ultra-fast inference"], highlighted: true },
      { name: "Pay as you go", price: 0, period: "usage", description: "Production", features: ["Higher limits", "Priority access"] }
    ],
    notes: "Ultra-fast inference. Free tier available."
  },
  "together-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.together.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "$5 credit", features: ["Open source models", "200+ models", "Free trial credits"], highlighted: true },
      { name: "Pay as you go", price: 0, period: "usage", description: "Production", features: ["All models", "Fine-tuning", "Dedicated"] }
    ],
    notes: "Open models at low cost. Llama 3.1 70B: $0.88/1M."
  },
  "replicate": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://replicate.com/pricing",
    tiers: [
      { name: "Pay as you go", price: 0, period: "usage", description: "Per second", features: ["Open models", "Custom models", "GPU hosting"], highlighted: true }
    ],
    notes: "Pay per second of compute. Run any model."
  },
  "hugging-face": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://huggingface.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Community", features: ["Model hub", "Spaces", "Inference API"], highlighted: true },
      { name: "Pro", price: 9, period: "month", description: "Individuals", features: ["ZeroGPU", "Persistent spaces", "Priority support"] },
      { name: "Enterprise", price: 20, period: "user/month", description: "Teams", features: ["Private models", "SSO", "Audit logs"] }
    ],
    notes: "Model hub free. Pro for more compute."
  },
  "openrouter": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://openrouter.ai/models",
    tiers: [
      { name: "Pay as you go", price: 0, period: "usage", description: "Per token", features: ["Unified API", "All providers", "Automatic routing"], highlighted: true }
    ],
    notes: "Unified API for all models. Provider pricing + markup."
  },
  "ollama": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://ollama.ai",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Run LLMs locally", "Llama/Mistral/etc", "API compatible", "No internet needed"], highlighted: true }],
    notes: "Free and open source. Run models locally."
  },
  "lm-studio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://lmstudio.ai",
    tiers: [{ name: "Free", price: 0, description: "Local use", features: ["GUI for local LLMs", "GGUF models", "API server", "Chat interface"], highlighted: true }],
    notes: "Free for personal use. Commercial license available."
  },
  "perplexity": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://perplexity.ai/pro",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Standard search", "5 Pro searches/day", "Basic sources"] },
      { name: "Pro", price: 20, period: "month", description: "Annual $200", features: ["Unlimited Pro", "GPT-4/Claude", "File upload"], highlighted: true }
    ],
    notes: "AI search engine. Pro for advanced models."
  },
  "chatgpt": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://openai.com/chatgpt/pricing",
    tiers: [
      { name: "Free", price: 0, description: "GPT-4o mini", features: ["Limited GPT-4o", "Basic features", "Web access"] },
      { name: "Plus", price: 20, period: "month", description: "GPT-4", features: ["Full GPT-4o", "DALL-E", "Advanced analysis"], highlighted: true },
      { name: "Team", price: 25, period: "user/month", description: "Annual", features: ["Workspace", "Admin console", "Data excluded from training"] }
    ],
    notes: "Consumer AI chat. Free tier uses GPT-4o mini."
  },
  "claude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://claude.ai",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["Claude 3.5 Sonnet", "Limited messages", "Basic features"] },
      { name: "Pro", price: 20, period: "month", description: "Priority", features: ["5x more usage", "Claude 3 Opus", "Priority access"], highlighted: true },
      { name: "Team", price: 30, period: "user/month", description: "Min 5 users", features: ["Higher limits", "Admin", "Billing controls"] }
    ],
    notes: "Claude consumer chat. Pro for heavier usage."
  },
  "midjourney": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://docs.midjourney.com/docs/plans",
    tiers: [
      { name: "Basic", price: 10, period: "month", description: "Hobby", features: ["3.3 hr fast GPU", "Commercial license", "Solo mode"] },
      { name: "Standard", price: 30, period: "month", description: "Popular", features: ["15 hr fast GPU", "Unlimited relax", "Stealth mode"], highlighted: true },
      { name: "Pro", price: 60, period: "month", description: "Power users", features: ["30 hr fast GPU", "12 concurrent jobs", "Priority queue"] }
    ],
    notes: "AI image generation. No free tier currently."
  },
  "dalle": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://openai.com/dall-e-3",
    tiers: [
      { name: "API", price: 0.04, period: "per image", description: "1024x1024", features: ["DALL-E 3", "High quality", "API access"], highlighted: true },
      { name: "ChatGPT Plus", price: 20, period: "month", description: "Included", features: ["Unlimited images", "Chat interface", "Editing tools"] }
    ],
    notes: "DALL-E 3: $0.04-$0.12/image depending on size."
  },
  "stable-diffusion": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://stability.ai",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Local generation", "SD XL", "ControlNet", "LoRA"], highlighted: true }],
    notes: "Free and open source. Run locally or via API."
  },
  "leonardo-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://leonardo.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "150 credits/day", features: ["150 tokens daily", "Basic models", "Community gallery"] },
      { name: "Apprentice", price: 12, period: "month", description: "Annual", features: ["8500 tokens/mo", "All models", "Priority queue"], highlighted: true },
      { name: "Artisan", price: 30, period: "month", description: "Annual", features: ["25000 tokens/mo", "Private mode", "API access"] }
    ],
    notes: "AI image generation. Generous free tier."
  },
  "runway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://runwayml.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "125 credits", features: ["Gen-3 Alpha", "Limited exports", "Basic tools"] },
      { name: "Standard", price: 12, period: "month", description: "Annual", features: ["625 credits/mo", "Unlimited exports", "Remove watermark"], highlighted: true },
      { name: "Pro", price: 28, period: "month", description: "Annual", features: ["2250 credits/mo", "4K exports", "Priority access"] }
    ],
    notes: "AI video generation. Gen-3 Alpha available."
  },
  "pika-labs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pika.art",
    tiers: [
      { name: "Free", price: 0, description: "250 credits/mo", features: ["Pika 1.0", "Watermark", "Basic features"] },
      { name: "Standard", price: 8, period: "month", description: "700 credits", features: ["No watermark", "Priority queue"], highlighted: true },
      { name: "Pro", price: 28, period: "month", description: "2000 credits", features: ["4K video", "Custom models", "API access"] }
    ],
    notes: "AI video generation. Free tier available."
  },
  "elevenlabs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://elevenlabs.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10K chars/mo", features: ["10K characters", "3 custom voices", "Attribution required"] },
      { name: "Starter", price: 5, period: "month", description: "30K chars", features: ["30K chars/mo", "10 custom voices", "Commercial license"], highlighted: true },
      { name: "Creator", price: 22, period: "month", description: "100K chars", features: ["100K chars/mo", "30 voices", "Projects"] }
    ],
    notes: "AI voice cloning and TTS. Free tier available."
  },
  "resemble-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.resemble.ai/pricing",
    tiers: [
      { name: "Pay as you go", price: 0.006, period: "per second", description: "Starting", features: ["Voice cloning", "Emotions", "API access"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["On-premise", "Custom voices", "Priority support"] }
    ],
    notes: "AI voice cloning. Pay per second of audio."
  },
  "speechify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://speechify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["Basic TTS", "Limited voices", "Mobile apps"] },
      { name: "Premium", price: 139, period: "year", description: "Annual", features: ["HD voices", "OCR scanning", "Unlimited listening"], highlighted: true }
    ],
    notes: "Text-to-speech reader. Free tier with limits."
  },
  "murf-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://murf.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Trial", features: ["10 minutes", "Limited voices", "No downloads"] },
      { name: "Basic", price: 19, period: "month", description: "Annual", features: ["24 hours/year", "All voices", "Commercial use"], highlighted: true },
      { name: "Pro", price: 26, period: "month", description: "Annual", features: ["48 hours/year", "Voice cloning", "API access"] }
    ],
    notes: "AI voiceover generator. 7-day free trial."
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
    message: "Pricing batch 58 (AI Tools & LLMs) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
