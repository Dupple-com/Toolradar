import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 74: Browser Extensions & Dev Tools pricing
const verifiedPricing: Record<string, object> = {
  "react-devtools": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://react.dev/learn/react-developer-tools",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["Component tree", "Props/State", "Profiler", "Chrome/Firefox"], highlighted: true }],
    notes: "Free browser extension from React team."
  },
  "redux-devtools": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/reduxjs/redux-devtools",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["Time travel", "Action log", "State diff", "Import/Export"], highlighted: true }],
    notes: "Free browser extension."
  },
  "vue-devtools": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://devtools.vuejs.org",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["Component tree", "Vuex/Pinia", "Router", "Timeline"], highlighted: true }],
    notes: "Free browser extension from Vue team."
  },
  "lighthouse": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://developer.chrome.com/docs/lighthouse",
    tiers: [{ name: "Free", price: 0, description: "Built-in", features: ["Performance audit", "Accessibility", "SEO", "PWA checks"], highlighted: true }],
    notes: "Free. Built into Chrome DevTools."
  },
  "web-vitals": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://web.dev/vitals",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["LCP", "FID", "CLS", "Real-time metrics"], highlighted: true }],
    notes: "Free extension from Google."
  },
  "wappalyzer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.wappalyzer.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Extension", features: ["Tech detection", "Browser extension", "Basic lookup"] },
      { name: "Pro", price: 99, period: "month", description: "API", features: ["API access", "Bulk lookup", "Lead lists"], highlighted: true }
    ],
    notes: "Technology profiler. Extension free."
  },
  "builtwith": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://builtwith.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Extension", features: ["Basic detection", "Browser extension", "Tech lookup"] },
      { name: "Basic", price: 295, period: "month", description: "API", features: ["API access", "5K lookups", "Tech reports"], highlighted: true }
    ],
    notes: "Technology lookup. Extension free."
  },
  "json-viewer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://chrome.google.com/webstore",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["JSON formatting", "Syntax highlighting", "Collapsible tree", "Search"], highlighted: true }],
    notes: "Free browser extension."
  },
  "octotree": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.octotree.io",
    tiers: [
      { name: "Free", price: 0, description: "Public repos", features: ["File tree", "GitHub integration", "Code navigation"] },
      { name: "Pro", price: 4, period: "month", description: "Annual", features: ["Private repos", "Multiple themes", "Bookmarks"], highlighted: true }
    ],
    notes: "GitHub code tree. Free for public."
  },
  "refined-github": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/refined-github/refined-github",
    tiers: [{ name: "Free", price: 0, description: "Extension", features: ["GitHub enhancements", "Keyboard shortcuts", "UI improvements"], highlighted: true }],
    notes: "Free and open source."
  },
  "github-copilot": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://github.com/features/copilot",
    tiers: [
      { name: "Individual", price: 10, period: "month", description: "Monthly", features: ["Code completion", "Chat", "All IDEs"], highlighted: true },
      { name: "Business", price: 19, period: "user/month", description: "Monthly", features: ["Organization policies", "Admin console", "IP indemnity"] }
    ],
    notes: "AI coding assistant. Free for students/OSS."
  },
  "tabnine": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tabnine.com/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["Short completions", "All IDEs", "Local models"] },
      { name: "Pro", price: 12, period: "month", description: "Annual", features: ["Full completions", "Chat", "Code review"], highlighted: true }
    ],
    notes: "AI code completion. Free tier."
  },
  "codeium": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://codeium.com/pricing",
    tiers: [
      { name: "Individual", price: 0, description: "Free forever", features: ["Unlimited completions", "Chat", "All IDEs"], highlighted: true },
      { name: "Teams", price: 12, period: "user/month", description: "Annual", features: ["Admin console", "Usage analytics", "Support"] }
    ],
    notes: "Free AI coding assistant."
  },
  "amazon-codewhisperer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://aws.amazon.com/codewhisperer/pricing",
    tiers: [
      { name: "Individual", price: 0, description: "Free", features: ["Unlimited suggestions", "Security scans", "All IDEs"], highlighted: true },
      { name: "Professional", price: 19, period: "user/month", description: "Monthly", features: ["Admin controls", "SSO", "Policy management"] }
    ],
    notes: "AWS AI coding. Free for individuals."
  },
  "continue-dev": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://continue.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Code completion", "Chat", "Custom models", "Local LLMs"], highlighted: true }],
    notes: "Free and open source AI assistant."
  },
  "sourcegraph": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://about.sourcegraph.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Code search", "Cody AI", "Basic features"], highlighted: true },
      { name: "Pro", price: 9, period: "user/month", description: "Monthly", features: ["Unlimited Cody", "Private repos", "Batch changes"] }
    ],
    notes: "Code search and AI. Free tier."
  },
  "liveshare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://visualstudio.microsoft.com/services/live-share",
    tiers: [{ name: "Free", price: 0, description: "VS Code", features: ["Real-time collab", "Shared terminal", "Voice chat", "Debugging"], highlighted: true }],
    notes: "Free with VS Code."
  },
  "codepen": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://codepen.io/features/pro",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["Unlimited pens", "Public projects", "Embed pens"] },
      { name: "Pro", price: 8, period: "month", description: "Annual", features: ["Private pens", "Asset hosting", "Collab mode"], highlighted: true }
    ],
    notes: "Frontend playground. Free tier."
  },
  "codesandbox": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://codesandbox.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited sandboxes", "Public projects", "Live preview"] },
      { name: "Pro", price: 12, period: "month", description: "Annual", features: ["Private sandboxes", "GitHub sync", "Custom RAM"], highlighted: true }
    ],
    notes: "Cloud IDE. Free tier."
  },
  "stackblitz": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://stackblitz.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited projects", "Web containers", "GitHub import"] },
      { name: "Personal", price: 12, period: "month", description: "Annual", features: ["Private projects", "Full Node.js", "More memory"], highlighted: true }
    ],
    notes: "Instant dev environments. Free tier."
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
    message: "Pricing batch 74 (Browser Extensions & Dev Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
