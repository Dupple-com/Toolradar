import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 66: Testing & QA Tools pricing
const verifiedPricing: Record<string, object> = {
  "playwright": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://playwright.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Cross-browser", "Auto-wait", "Tracing", "Codegen"], highlighted: true }],
    notes: "Free and open source from Microsoft."
  },
  "cypress": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cypress.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited local tests", "Time travel", "Real-time reloads"], highlighted: true },
      { name: "Team", price: 67, period: "month", description: "3 users", features: ["500 test results", "Flake detection", "Parallelization"] },
      { name: "Business", price: 250, period: "month", description: "5 users", features: ["2500 results", "SSO", "Priority support"] }
    ],
    notes: "Open source free. Cloud for test recording."
  },
  "selenium": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.selenium.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Browser automation", "WebDriver", "Grid", "IDE"], highlighted: true }],
    notes: "Free and open source. Industry standard."
  },
  "puppeteer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pptr.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Chrome automation", "Screenshots", "PDF generation", "Headless"], highlighted: true }],
    notes: "Free and open source from Google."
  },
  "jest": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://jestjs.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Zero config", "Snapshots", "Coverage", "Mocking"], highlighted: true }],
    notes: "Free and open source from Meta."
  },
  "vitest": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://vitest.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Vite native", "Jest compatible", "Fast", "TypeScript"], highlighted: true }],
    notes: "Free and open source. Vite-native testing."
  },
  "mocha": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mochajs.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Flexible", "Async support", "Browser support", "Reporters"], highlighted: true }],
    notes: "Free and open source. JavaScript test framework."
  },
  "testing-library": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://testing-library.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["React testing", "DOM testing", "User-centric", "Accessible queries"], highlighted: true }],
    notes: "Free and open source. Simple testing utilities."
  },
  "storybook": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.chromatic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Component dev", "Docs", "Testing", "Addons"], highlighted: true },
      { name: "Chromatic Free", price: 0, description: "5K snapshots", features: ["Visual testing", "UI review", "5000 snapshots/mo"] },
      { name: "Chromatic Pro", price: 149, period: "month", description: "35K snapshots", features: ["35K snapshots", "Unlimited projects", "Priority support"] }
    ],
    notes: "Open source. Chromatic for visual testing."
  },
  "browserstack": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.browserstack.com/pricing",
    tiers: [
      { name: "Live", price: 29, period: "month", description: "Manual testing", features: ["Real browsers", "Real devices", "Local testing"], highlighted: true },
      { name: "Automate", price: 129, period: "month", description: "Automation", features: ["Parallel tests", "Screenshots", "Integrations"] }
    ],
    notes: "Cross-browser testing platform."
  },
  "sauce-labs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://saucelabs.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited for OSS", "Real browsers", "Real devices"] },
      { name: "Team", price: 49, period: "user/month", description: "Teams", features: ["Parallel tests", "Debugging", "Analytics"], highlighted: true }
    ],
    notes: "Free for open source projects."
  },
  "lambdatest": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lambdatest.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["60 mins/mo", "Real browsers", "Screenshots"] },
      { name: "Live", price: 15, period: "month", description: "Annual", features: ["Unlimited testing", "Real devices", "Geolocation"], highlighted: true }
    ],
    notes: "Cross-browser testing. Free tier available."
  },
  "testim": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.testim.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Community", features: ["1000 runs/mo", "AI-powered", "Chrome only"] },
      { name: "Essential", price: 450, period: "month", description: "Teams", features: ["Unlimited runs", "All browsers", "Integrations"], highlighted: true }
    ],
    notes: "AI-powered test automation."
  },
  "mabl": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.mabl.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["25 test runs", "1 app", "Community support"] },
      { name: "Core", price: 500, period: "month", description: "Annual", features: ["Unlimited runs", "API testing", "Priority support"], highlighted: true }
    ],
    notes: "AI-powered test automation platform."
  },
  "postman": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.postman.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individual", features: ["Unlimited collections", "1K API calls", "3 users"], highlighted: true },
      { name: "Basic", price: 14, period: "user/month", description: "Annual", features: ["Unlimited API calls", "Roles", "Integrations"] },
      { name: "Professional", price: 29, period: "user/month", description: "Annual", features: ["Advanced roles", "SSO", "Audit logs"] }
    ],
    notes: "API platform. Free for individuals."
  },
  "insomnia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://insomnia.rest/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited requests", "Git sync", "Local storage"], highlighted: true },
      { name: "Individual", price: 5, period: "month", description: "Annual", features: ["E2E encryption", "Unlimited storage", "Priority support"] },
      { name: "Team", price: 8, period: "user/month", description: "Annual", features: ["Team sync", "RBAC", "Enterprise SSO"] }
    ],
    notes: "API client. Open source core."
  },
  "hoppscotch": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://hoppscotch.io",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["REST/GraphQL", "WebSocket", "Real-time", "History"], highlighted: true },
      { name: "Enterprise", price: 19, period: "user/month", description: "Self-hosted", features: ["Self-hosted", "SSO", "Audit logs"] }
    ],
    notes: "Open-source Postman alternative."
  },
  "k6": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://k6.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Local execution", "Scripting", "Metrics", "Thresholds"], highlighted: true },
      { name: "Cloud Free", price: 0, description: "50 VUh", features: ["50 VUh/mo", "Cloud execution", "Dashboards"] },
      { name: "Cloud", price: 99, period: "month", description: "500 VUh", features: ["500 VUh", "Team features", "Support"] }
    ],
    notes: "Open-source load testing. Cloud for scaling."
  },
  "gatling": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://gatling.io/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Free", features: ["Load testing", "Scala DSL", "Reports"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Cloud", "Real-time metrics", "Support"] }
    ],
    notes: "Open-source load testing tool."
  },
  "locust": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://locust.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Python scripting", "Distributed", "Web UI", "Real-time stats"], highlighted: true }],
    notes: "Free and open source. Python-based."
  },
  "artillery": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.artillery.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Load testing", "YAML config", "Plugins"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "Teams", features: ["Cloud runs", "Dashboards", "Team features"] }
    ],
    notes: "Open-source load testing. Cloud available."
  },
  "checkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.checklyhq.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["10K check runs", "5 checks", "1 min frequency"] },
      { name: "Team", price: 40, period: "month", description: "Starting", features: ["50K runs", "50 checks", "30s frequency"], highlighted: true }
    ],
    notes: "Synthetic monitoring. Free tier."
  },
  "percy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.browserstack.com/percy/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["5K snapshots", "Unlimited users", "Unlimited projects"], highlighted: true },
      { name: "Team", price: 399, period: "month", description: "Starting", features: ["25K snapshots", "Priority support", "Advanced"] }
    ],
    notes: "Visual testing. Free for open source."
  },
  "applitools": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://applitools.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["100 checkpoints", "AI visual testing", "1 user"] },
      { name: "Team", price: 0, period: "custom", description: "Custom", features: ["Unlimited checkpoints", "Cross-browser", "Support"], highlighted: true }
    ],
    notes: "AI-powered visual testing."
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
    message: "Pricing batch 66 (Testing & QA) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
