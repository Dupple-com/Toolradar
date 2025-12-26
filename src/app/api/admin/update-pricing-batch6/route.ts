import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 6: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "browserstack": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.browserstack.com/pricing",
    tiers: [
      { name: "Live Desktop", price: 29, period: "month", description: "Manual testing", features: ["3000+ browsers", "Real devices", "Local testing", "Screenshots"] },
      { name: "Live Desktop+Mobile", price: 39, period: "month", description: "Full manual", features: ["3500+ combinations", "iOS & Android", "Responsive testing", "Debug tools"], highlighted: true },
      { name: "Automate", price: 129, period: "month per parallel", description: "Automation", features: ["Selenium/Playwright", "All browsers", "CI/CD integration", "Unlimited tests"] },
      { name: "Enterprise", price: "Custom", description: "Large teams", features: ["SSO/SAML", "Dedicated support", "Custom SLA", "Volume discounts"] }
    ],
    notes: "25% annual discount. Team plans from $150/month"
  },
  "bubble": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://bubble.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["50K workload units", "Full editor", "No live deploy", "Bubble branding"] },
      { name: "Starter", price: 32, period: "month", description: "MVPs", features: ["175K WUs", "Custom domain", "Live deployment", "2 days logs"], highlighted: true },
      { name: "Growth", price: 134, period: "month", description: "Scaling", features: ["More WUs", "Advanced tools", "Team collab", "Better support"] },
      { name: "Team", price: 399, period: "month", description: "Teams", features: ["High WUs", "Extended logs", "Priority support", "All features"] }
    ],
    notes: "Annual discounts available. Enterprise custom pricing"
  },
  "budibase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://budibase.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["5 users (cloud)", "20 users (self-host)", "Unlimited apps", "Core features"] },
      { name: "Premium", price: 50, period: "month per creator", description: "Teams", features: ["$5/app user", "2M tokens", "Advanced features", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["Volume discounts", "On-premise", "SSO/SAML", "Dedicated support"] }
    ],
    notes: "Open source self-hosting available"
  },
  "buffer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://buffer.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["3 channels", "10 posts each", "Basic analytics", "Core features"] },
      { name: "Essentials", price: 5, period: "month per channel", description: "Creators", features: ["Unlimited posts", "Advanced analytics", "Engagement inbox", "AI assistant"], highlighted: true },
      { name: "Team", price: 10, period: "month per channel", description: "Teams", features: ["Unlimited users", "All features", "Team permissions", "Priority support"] }
    ],
    notes: "Per-channel pricing - more channels = lower per-channel cost"
  },
  "bugsnag": {
    startingPrice: 59, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.bugsnag.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["Limited events", "Basic features", "Community support"] },
      { name: "Starter", price: 59, period: "month", description: "Small teams", features: ["Event-based pricing", "Error tracking", "Stack traces", "Integrations"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Scaling", features: ["More events", "Performance spans", "Advanced features"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited events", "SSO", "Premium support", "SLA"] }
    ],
    notes: "Now part of SmartBear Insight Hub"
  },
  "builder-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.builder.io/m/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Try it out", features: ["14-day Pro trial", "Basic features", "Community support"] },
      { name: "Basic", price: 19, period: "month per user", description: "Individuals", features: ["500 code generations", "128K context", "30-day history", "1 space"] },
      { name: "Growth", price: 39, period: "month per user", description: "Teams", features: ["More features", "Team collab", "Advanced tools"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["SSO", "Custom roles", "Priority support", "Dedicated CSM"] }
    ]
  },
  "buildkite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://buildkite.com/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Up to 3 users", features: ["Unlimited builds", "Self-hosted agents", "Community support"] },
      { name: "Team", price: 9, period: "month per user", description: "Growing teams", features: ["All features", "Priority support", "SSO available"] },
      { name: "Business", price: 19, period: "month per user", description: "Scaling", features: ["Advanced features", "Pipeline signing", "Team management"], highlighted: true },
      { name: "Enterprise", price: 35, period: "month per user", description: "30+ users", features: ["Custom contracts", "Dedicated support", "SLA guarantee"] }
    ]
  },
  "bun": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://bun.com",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Full runtime", "Package manager", "Bundler", "Test runner", "MIT license"], highlighted: true }
    ],
    notes: "Acquired by Anthropic Dec 2025. Remains free and open source"
  },
  "blender": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://www.blender.org/",
    tiers: [
      { name: "Free", price: 0, description: "Open source forever", features: ["Full 3D suite", "Modeling, rigging, animation", "Rendering", "Video editing", "GPL license"], highlighted: true }
    ],
    notes: "Completely free. Support via Blender Foundation donations"
  },
  "bruno": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.usebruno.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["HTTP, REST, GraphQL", "Git integration", "Offline only", "Core features"] },
      { name: "Pro", price: 6, period: "month per user", description: "Teams", features: ["Git UI", "OAS generation", "Priority support"], highlighted: true },
      { name: "Ultimate", price: 11, period: "month per user", description: "Enterprise", features: ["Test reports", "Secret managers", "Premium support"] }
    ],
    notes: "Offline-first, no cloud sync. Alternative to Postman"
  },
  "acuity": {
    startingPrice: 16, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://acuityscheduling.com/pricing",
    tiers: [
      { name: "Emerging", price: 16, period: "month", description: "Starting out", features: ["1 calendar", "Unlimited appointments", "Self-scheduling", "Reminders"] },
      { name: "Growing", price: 27, period: "month", description: "Growing business", features: ["6 calendars", "Text reminders", "Packages", "Subscriptions"], highlighted: true },
      { name: "Powerhouse", price: 49, period: "month", description: "Teams", features: ["36 calendars", "Multiple timezones", "Advanced features", "Priority support"] }
    ],
    notes: "Part of Squarespace. Prices shown are annual"
  },
  "authelia": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://www.authelia.com/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["SSO/2FA", "Self-hosted", "LDAP/AD support", "Apache 2.0 license"], highlighted: true }
    ]
  },
  "automatisch": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://automatisch.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Unlimited workflows", "Core integrations", "Open source", "Community support"] },
      { name: "Cloud", price: 19, period: "month", description: "Managed", features: ["Hosted service", "More integrations", "Email support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["On-premise", "Priority support", "Custom integrations", "SLA"] }
    ],
    notes: "Open source Zapier alternative"
  },
  "avocode": {
    startingPrice: 14, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://avocode.com/pricing",
    tiers: [
      { name: "Solo", price: 14, period: "month", description: "Individuals", features: ["1 user", "Design handoff", "Inspect code", "Unlimited projects"] },
      { name: "Team", price: 8, period: "month per user", description: "Teams", features: ["3+ users", "Team sharing", "Version control", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["SSO", "Admin controls", "Dedicated support"] }
    ]
  },
  "begin": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://begin.com/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Serverless framework", "AWS deployment", "Full functionality", "MIT license"], highlighted: true }
    ]
  },
  "bench": {
    startingPrice: 299, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://bench.co/pricing",
    tiers: [
      { name: "Essentials", price: 299, period: "month", description: "Basic bookkeeping", features: ["Monthly bookkeeping", "Year-end financial package", "Unlimited support", "Expert team"] },
      { name: "Premium", price: 499, period: "month", description: "Full service", features: ["All Essentials", "Tax prep", "1:1 tax advisor", "Quarterly check-ins"], highlighted: true }
    ],
    notes: "Bookkeeping service, not software. Annual discounts available"
  },
  "bettermode": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://bettermode.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["Basic features", "Limited members", "Community support"] },
      { name: "Plus", price: 19, period: "month", description: "Growing communities", features: ["More members", "Custom domain", "Analytics"], highlighted: true },
      { name: "Pro", price: 49, period: "month", description: "Professional", features: ["Advanced features", "Priority support", "Integrations"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited members", "SSO", "Dedicated support"] }
    ]
  },
  "betty-blocks": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.bettyblocks.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["Sandbox environment", "Core features", "Community support"] },
      { name: "Professional", price: "Custom", description: "Production", features: ["Live deployment", "Custom domains", "Support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["SSO", "Dedicated environment", "SLA guarantee"] }
    ]
  },
  "bildr": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.bildr.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["Build & test", "Limited features", "Community support"] },
      { name: "Starter", price: 29, period: "month", description: "MVPs", features: ["1 published app", "Custom domain", "Basic support"] },
      { name: "Pro", price: 99, period: "month", description: "Production", features: ["Multiple apps", "Priority support", "Advanced features"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Teams", features: ["Unlimited apps", "SSO", "Dedicated support"] }
    ]
  },
  "bing-image-creator": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://www.bing.com/images/create",
    tiers: [
      { name: "Free", price: 0, description: "With Microsoft account", features: ["DALL-E 3 powered", "15 boosts/day", "Standard queue", "Commercial use limited"], highlighted: true },
      { name: "Copilot Pro", price: 20, period: "month", description: "Priority access", features: ["100 boosts/day", "Faster generation", "Designer integration", "All Microsoft 365"] }
    ]
  },
  "biome": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://biomejs.dev/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Linter", "Formatter", "Fast performance", "MIT license"], highlighted: true }
    ],
    notes: "Rust-based, replaces ESLint + Prettier"
  },
  "bitdefender": {
    startingPrice: 29.99, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://www.bitdefender.com/solutions/",
    tiers: [
      { name: "Antivirus Plus", price: 29.99, period: "year", description: "Basic protection", features: ["3 devices", "Real-time protection", "Web protection", "Anti-phishing"] },
      { name: "Internet Security", price: 44.99, period: "year", description: "Advanced", features: ["3 devices", "Firewall", "Parental controls", "Privacy tools"], highlighted: true },
      { name: "Total Security", price: 49.99, period: "year", description: "Complete", features: ["5 devices", "All platforms", "VPN included", "All features"] }
    ],
    notes: "First year discounts available"
  },
  "bito": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://bito.ai/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Limited queries", "Code completion", "IDE integration", "Community support"] },
      { name: "Pro", price: 15, period: "month", description: "Developers", features: ["Unlimited queries", "All features", "Priority support", "Custom prompts"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Teams", features: ["Team management", "SSO", "Admin controls", "Dedicated support"] }
    ]
  },
  "black": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://black.readthedocs.io/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Python formatter", "Opinionated style", "Fast", "MIT license"], highlighted: true }
    ]
  },
  "blackbox-ai": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.blackbox.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Code completion", "Limited queries", "Core features"] },
      { name: "Pro", price: 9.99, period: "month", description: "Full access", features: ["Unlimited queries", "All models", "Priority support"], highlighted: true }
    ]
  },
  "blameless": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.blameless.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Getting started", features: ["Basic SRE tools", "Limited features", "Community support"] },
      { name: "Pro", price: "Custom", description: "Teams", features: ["Incident management", "SLOs", "Retrospectives", "Integrations"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["SSO", "Advanced analytics", "Dedicated support", "SLA"] }
    ]
  },
  "branch": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.branch.io/pricing/",
    tiers: [
      { name: "Launch", price: 0, description: "Starting out", features: ["10K MAUs", "Deep linking", "Analytics", "Core features"] },
      { name: "Startup", price: "Usage-based", description: "Growing", features: ["Up to 1M MAUs", "All features", "Email support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Scale", features: ["Unlimited MAUs", "Premium support", "SLA guarantee", "Custom contracts"] }
    ]
  },
  "brex": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.brex.com/pricing",
    tiers: [
      { name: "Essentials", price: 0, description: "Core features", features: ["Corporate cards", "Expense management", "Reimbursements", "No fee"] },
      { name: "Premium", price: 12, period: "month per user", description: "Advanced", features: ["All Essentials", "Budgets", "Bill pay", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large orgs", features: ["ERP integrations", "Dedicated support", "Custom controls", "SLA"] }
    ]
  },
  "buddy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://buddy.works/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Solo developers", features: ["5 projects", "1 concurrent pipeline", "1GB cache", "Community support"] },
      { name: "Pro", price: 75, period: "month", description: "Teams", features: ["Unlimited projects", "3 concurrent", "Priority support", "SSO"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["On-premise", "Unlimited concurrency", "Dedicated support", "SLA"] }
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    updated: 0,
    notFound: 0,
    notFoundList: [] as string[],
    errors: [] as string[],
  };

  for (const [slug, pricing] of Object.entries(pricingData)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!tool) {
        results.notFound++;
        results.notFoundList.push(slug);
        continue;
      }

      await prisma.tool.update({
        where: { slug },
        data: {
          pricingDetails: pricing as any,
        },
      });

      results.updated++;
    } catch (error) {
      results.errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
    total: Object.keys(pricingData).length,
  });
}
