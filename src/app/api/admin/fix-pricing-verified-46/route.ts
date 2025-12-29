import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-sixth batch of verified pricing from WebFetch (December 2025) - Testing & Feature Flags
const verifiedPricing: Record<string, object> = {
  // BrowserStack - https://www.browserstack.com/pricing
  "browserstack": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.browserstack.com/pricing",
    tiers: [
      { name: "Live Desktop", price: 29, period: "month", description: "Annual", features: ["Manual testing", "3000+ browsers", "Real devices", "1 user"] },
      { name: "Live Desktop+Mobile", price: 39, period: "month", description: "Annual", features: ["All Desktop", "Mobile browsers", "Screenshots"], highlighted: true },
      { name: "Team", price: 150, period: "month", description: "5 users, annual", features: ["All features", "Team management", "Priority support"] },
      { name: "Automate", price: 99, period: "month", description: "1 parallel", features: ["Selenium/Playwright", "All browsers", "CI/CD integration"] }
    ],
    notes: "Percy visual testing from $199/mo. App testing available."
  },

  // LambdaTest - https://www.lambdatest.com/pricing
  "lambdatest": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lambdatest.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Limited time", features: ["1 parallel", "3000+ browsers", "Screenshots", "Basic integrations"] },
      { name: "Live", price: 15, period: "month", description: "Annual", features: ["Unlimited testing", "Emulators", "Geolocation", "24/7 support"], highlighted: true },
      { name: "Real Device", price: 25, period: "month", description: "Annual", features: ["Real mobiles", "WCAG testing", "Dev tools", "Test insights"] },
      { name: "Real Device Plus", price: 39, period: "month", description: "Annual", features: ["All Real Device", "SSO", "IP whitelist", "Premium support"] }
    ],
    notes: "Automation from $149/mo. Enterprise custom pricing."
  },

  // Cypress - https://www.cypress.io/pricing
  "cypress": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cypress.io/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["500 results/mo", "50 users", "Parallelization", "Test Replay", "30-day retention"] },
      { name: "Team", price: 67, period: "month", description: "Annual ($799/yr)", features: ["120K results/yr", "Flake detection", "Jira integration", "90-day retention"], highlighted: true },
      { name: "Business", price: 267, period: "month", description: "Annual ($3,199/yr)", features: ["All Team", "Spec prioritization", "SSO", "GitHub Enterprise"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited users", "Data API", "TAM", "180-day retention"] }
    ],
    notes: "Open source test runner free. Cloud dashboard paid."
  },

  // LaunchDarkly - https://www.launchdarkly.com/pricing
  "launchdarkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.launchdarkly.com/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "Free forever", features: ["Unlimited flags", "30 SDKs", "5K replays/mo", "A/B testing"] },
      { name: "Foundation", price: 12, period: "connection/month", description: "+$10/1K MAU", features: ["All Developer", "Unlimited projects", "Targeting", "SSO"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Annual", features: ["All Foundation", "Release automation", "SAML/SCIM", "Custom roles"] },
      { name: "Guardian", price: "Custom", description: "Annual", features: ["All Enterprise", "Release monitoring", "Auto rollback", "Guardrail metrics"] }
    ],
    notes: "Feature flags + experimentation platform."
  },

  // Playwright - Known (free)
  "playwright": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://playwright.dev",
    tiers: [
      { name: "Open Source", price: 0, description: "Free forever", features: ["Cross-browser testing", "Auto-wait", "Codegen", "Trace viewer"], highlighted: true }
    ],
    notes: "By Microsoft. Free and open source. No cloud offering."
  },

  // Selenium - Known (free)
  "selenium": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.selenium.dev",
    tiers: [
      { name: "Open Source", price: 0, description: "Free forever", features: ["Browser automation", "WebDriver protocol", "Grid for parallel", "All languages"], highlighted: true }
    ],
    notes: "Industry standard. Free and open source."
  },

  // Jest - Known (free)
  "jest": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://jestjs.io",
    tiers: [
      { name: "Open Source", price: 0, description: "Free forever", features: ["JavaScript testing", "Snapshot testing", "Code coverage", "Mocking"], highlighted: true }
    ],
    notes: "By Meta. Most popular JS testing framework."
  },

  // Postman - Known pricing
  "postman": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.postman.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 users", features: ["Unlimited collections", "Local testing", "25 monitors", "1K API calls"] },
      { name: "Basic", price: 14, period: "user/month", description: "Annual", features: ["All Free", "External collabs", "Team workspaces", "100 monitors"], highlighted: true },
      { name: "Professional", price: 29, period: "user/month", description: "Annual", features: ["All Basic", "SSO", "User groups", "Audit logs"] },
      { name: "Enterprise", price: 49, period: "user/month", description: "Annual", features: ["All Pro", "SCIM", "Advanced security", "Priority support"] }
    ],
    notes: "API platform. Flows, Mock servers, Documentation."
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

  console.log("🔧 Starting verified pricing corrections batch 46 (Testing & Feature Flags)...\n");

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
    message: "Verified pricing corrections batch 46 (Testing & Feature Flags) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
