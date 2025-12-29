import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 71: API & Integration Tools pricing
const verifiedPricing: Record<string, object> = {
  "zapier": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://zapier.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 tasks", features: ["100 tasks/mo", "5 Zaps", "Single-step"] },
      { name: "Starter", price: 19.99, period: "month", description: "Annual", features: ["750 tasks", "20 Zaps", "Multi-step"], highlighted: true },
      { name: "Professional", price: 49, period: "month", description: "Annual", features: ["2K tasks", "Unlimited Zaps", "Paths"] }
    ],
    notes: "Automation platform. Free tier limited."
  },
  "make": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.make.com/en/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1K ops", features: ["1K ops/mo", "2 scenarios", "100MB data"] },
      { name: "Core", price: 9, period: "month", description: "Annual", features: ["10K ops", "Unlimited scenarios", "1GB data"], highlighted: true }
    ],
    notes: "Visual automation. Formerly Integromat."
  },
  "n8n": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://n8n.io/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Open source", features: ["Unlimited workflows", "Self-hosted", "All features"], highlighted: true },
      { name: "Starter", price: 20, period: "month", description: "2.5K executions", features: ["Cloud hosted", "5 workflows", "Support"] }
    ],
    notes: "Open-source automation. Self-hosted free."
  },
  "pipedream": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pipedream.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Generous", features: ["10K credits/mo", "Unlimited workflows", "100+ apps"], highlighted: true },
      { name: "Basic", price: 19, period: "month", description: "Annual", features: ["50K credits", "Priority support", "Longer history"] }
    ],
    notes: "Developer-focused automation."
  },
  "tray-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://tray.io/pricing",
    tiers: [{ name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Universal automation", "API platform", "Enterprise security"], highlighted: true }],
    notes: "Enterprise automation platform."
  },
  "workato": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.workato.com/pricing",
    tiers: [{ name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited recipes", "Enterprise connectors", "On-premise agents"], highlighted: true }],
    notes: "Enterprise automation and integration."
  },
  "rapidapi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://rapidapi.com/products/api-hub-pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["1M API calls", "Standard support", "All APIs"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "Monthly", features: ["3M calls", "Priority support", "Analytics"] }
    ],
    notes: "API marketplace. Free tier."
  },
  "postman-api": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.postman.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individual", features: ["Unlimited collections", "1K API calls", "3 users"], highlighted: true },
      { name: "Basic", price: 14, period: "user/month", description: "Annual", features: ["Unlimited API calls", "Roles", "Integrations"] }
    ],
    notes: "API platform. Free for individuals."
  },
  "kong": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://konghq.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["API gateway", "Plugins", "Community support"], highlighted: true },
      { name: "Plus", price: 0, period: "custom", description: "Enterprise", features: [" Enterprise plugins", "Support", "GUI"] }
    ],
    notes: "Open-source API gateway."
  },
  "gravitee": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.gravitee.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["API management", "Gateway", "Developer portal"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Advanced features", "Support", "SLA"] }
    ],
    notes: "Open-source API management."
  },
  "stoplight": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://stoplight.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["5 projects", "Unlimited users", "Basic features"] },
      { name: "Starter", price: 99, period: "month", description: "Team", features: ["10 projects", "Custom branding", "SSO"], highlighted: true }
    ],
    notes: "API design platform."
  },
  "swagger": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://swagger.io/tools/swaggerhub/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Swagger Editor", "Swagger UI", "Codegen"], highlighted: true },
      { name: "SwaggerHub", price: 0, period: "custom", description: "Teams", features: ["Collaboration", "Hosting", "Versioning"] }
    ],
    notes: "OpenAPI tools. Open source core."
  },
  "webhook-site": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://webhook.site",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["500 requests/day", "Temporary URLs", "JSON viewer"], highlighted: true },
      { name: "Pro", price: 9, period: "month", description: "Annual", features: ["Unlimited requests", "Custom URLs", "API access"] }
    ],
    notes: "Webhook testing tool."
  },
  "ngrok": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://ngrok.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 domain", "20K requests/mo", "Basic features"], highlighted: true },
      { name: "Personal", price: 8, period: "month", description: "Monthly", features: ["3 domains", "Unlimited requests", "Reserved domains"] }
    ],
    notes: "Secure tunnels for localhost."
  },
  "localtunnel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://localtunnel.me",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Localhost tunnel", "Random subdomain", "No signup"], highlighted: true }],
    notes: "Free and open source."
  },
  "mockoon": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mockoon.com/pro",
    tiers: [
      { name: "Open Source", price: 0, description: "Free", features: ["Mock APIs", "Desktop app", "CLI"], highlighted: true },
      { name: "Pro", price: 25, period: "month", description: "Cloud sync", features: ["Cloud sync", "Team sharing", "Enterprise support"] }
    ],
    notes: "API mocking tool. Open source."
  },
  "mockapi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mockapi.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 project", features: ["1 project", "4 resources", "Basic features"] },
      { name: "Basic", price: 4, period: "month", description: "Monthly", features: ["3 projects", "Unlimited resources", "Custom domains"], highlighted: true }
    ],
    notes: "Mock API generator."
  },
  "apiary": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://apiary.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 API project", "Mock server", "Documentation"] },
      { name: "Team", price: 99, period: "month", description: "5 users", features: ["5 projects", "Team collaboration", "Traffic inspector"], highlighted: true }
    ],
    notes: "API design and documentation."
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
    message: "Pricing batch 71 (API & Integration) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
