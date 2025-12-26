import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Batch 10: 30 tools pricing data
const pricingData: Record<string, object> = {
  "culture-amp": {
    startingPrice: 30,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "quote-based",
    pricingPageUrl: "https://www.cultureamp.com/platform/plans-and-pricing",
    tiers: [
      { name: "Engage", price: null, period: "custom", description: "Employee engagement", features: ["Surveys", "Analytics", "Benchmarking"] },
      { name: "Perform", price: null, period: "custom", description: "Performance management", features: ["Goals", "Reviews", "Feedback"] },
      { name: "Develop", price: null, period: "custom", description: "Growth & development", features: ["Learning", "Career paths", "Skills"] },
      { name: "People Analytics", price: null, period: "custom", description: "Full insights", features: ["Turnover models", "Advanced analytics"], highlighted: true }
    ],
    notes: "~$9-14 PEPM. Annual costs $4,500-$42,000 depending on size. Contact for quote."
  },
  "customerio": {
    startingPrice: 100,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://customer.io/pricing",
    tiers: [
      { name: "Essentials", price: 100, period: "month", description: "Starting at", features: ["5,000 profiles", "1M emails", "Visual workflow builder", "2 object types"] },
      { name: "Premium", price: 1000, period: "month", description: "Annual billing", features: ["Custom profiles", "10 object types", "HIPAA compliance", "90-day onboarding"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "~$28k-55k/year", features: ["Custom everything", "Dedicated support", "SLA"] }
    ],
    notes: "Startup program: 1 year free if <$10M funding. Overage: $0.009/profile."
  },
  "customer-io": {
    startingPrice: 100,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://customer.io/pricing",
    tiers: [
      { name: "Essentials", price: 100, period: "month", description: "Starting at", features: ["5,000 profiles", "1M emails", "Visual workflow builder"] },
      { name: "Premium", price: 1000, period: "month", description: "Annual billing", features: ["Custom profiles", "HIPAA compliance", "Premium integrations"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large scale", features: ["Custom everything", "Dedicated support"] }
    ],
    notes: "Same as customerio - duplicate slug."
  },
  "cypress": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.cypress.io/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "MIT License", features: ["Cypress App", "Browser testing", "Full features", "Local runs"] },
      { name: "Team", price: 67, period: "month", description: "Cloud recording", features: ["500 test results", "Parallelization", "Flake detection"] },
      { name: "Business", price: null, period: "custom", description: "Growing teams", features: ["More test results", "Advanced features", "SSO"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "~$23k-45k/year", features: ["Unlimited", "Priority support", "Custom SLA"] }
    ],
    notes: "Open source free. Cloud: $6/1,000 test results. Enterprise discounts 28-48%."
  },
  "d-id": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.d-id.com/pricing/studio/",
    tiers: [
      { name: "Free Trial", price: 0, description: "14 days", features: ["Limited credits", "Watermark", "Basic features"] },
      { name: "Lite", price: 4.70, period: "month", description: "Billed annually", features: ["40 credits", "No watermark", "Basic avatars"] },
      { name: "Pro", price: 16, period: "month", description: "Content creators", features: ["15 min video", "120+ languages", "Premium avatars"], highlighted: true },
      { name: "Advanced", price: 108, period: "month", description: "Professionals", features: ["100 min video", "API access", "Priority support"] },
      { name: "Enterprise", price: null, period: "custom", description: "Scale", features: ["Custom limits", "Dedicated support"] }
    ]
  },
  "dalle": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "usage-based",
    pricingPageUrl: "https://openai.com/api/pricing/",
    tiers: [
      { name: "DALL-E 3 HD", price: null, period: "per image", description: "$0.080/image 1024x1024", features: ["High quality", "1024x1024 or 1024x1792"] },
      { name: "DALL-E 3 Standard", price: null, period: "per image", description: "$0.040/image", features: ["Standard quality", "Fast generation"], highlighted: true },
      { name: "DALL-E 2", price: null, period: "per image", description: "$0.020/image 1024x1024", features: ["Legacy model", "Lower cost"] }
    ],
    notes: "Pay-per-image via OpenAI API. ChatGPT Plus ($20/mo) includes DALL-E access."
  },
  "dnsimple": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://dnsimple.com/pricing",
    tiers: [
      { name: "Solo", price: 0, period: "pay-as-you-go", description: "1 user", features: ["$0.50/zone/month", "$0.10/1M queries", "No base fee"] },
      { name: "Teams", price: 29, period: "month", description: "Per seat", features: ["Multiple users", "Team management", "All integrations"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Organizations", features: ["Custom seats", "SLA", "Priority support"] }
    ],
    notes: "Domain registration priced separately per TLD."
  },
  "dagster": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://dagster.io/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full orchestration", "All features", "Community support"] },
      { name: "Solo", price: 10, period: "month", description: "Cloud", features: ["7,500 free credits", "$0.04/extra credit", "1 user"] },
      { name: "Starter", price: null, period: "usage-based", description: "Teams", features: ["30,000 free credits", "$0.03/extra credit", "Multiple users"], highlighted: true },
      { name: "Pro", price: null, period: "custom", description: "Enterprise", features: ["Custom credits", "SLA", "Dedicated support"] }
    ],
    notes: "Serverless compute: $0.033/min. Enterprise pricing negotiated."
  },
  "dashlane": {
    startingPrice: 4.99,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.dashlane.com/pricing",
    tiers: [
      { name: "Premium", price: 4.99, period: "month", description: "Individuals", features: ["Unlimited passwords", "VPN included", "Dark web monitoring", "All devices"] },
      { name: "Friends & Family", price: 7.49, period: "month", description: "Up to 10 accounts", features: ["All Premium features", "Family dashboard", "Shared vaults"], highlighted: true },
      { name: "Business", price: 8, period: "month per user", description: "Billed annually", features: ["Admin console", "SSO/SCIM", "Group sharing"] },
      { name: "Omnix", price: 11, period: "month per user", description: "Advanced security", features: ["All Business features", "Advanced policies", "Phishing alerts"] }
    ],
    notes: "Free plan retired Sept 2025. Business requires annual billing."
  },
  "databricks": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://www.databricks.com/product/pricing",
    tiers: [
      { name: "Community Edition", price: 0, description: "Learning", features: ["Limited features", "Training", "Open source"] },
      { name: "Jobs Compute", price: null, period: "per DBU", description: "$0.07-0.15/DBU", features: ["Scheduled workloads", "30-50% cheaper", "Automated jobs"], highlighted: true },
      { name: "All-Purpose", price: null, period: "per DBU", description: "$0.20-0.40/DBU", features: ["Interactive workloads", "Notebooks", "Exploration"] },
      { name: "SQL Compute", price: null, period: "per DBU", description: "$0.22-0.65/DBU", features: ["BI queries", "SQL analytics", "Dashboards"] }
    ],
    notes: "DBU pricing + cloud infrastructure. Pre-purchase commits save up to 37%. Budget 2-3x DBU costs."
  },
  "datocms": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.datocms.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["2 editors", "300 records", "10GB traffic", "100k API calls"] },
      { name: "Professional", price: 199, period: "month", description: "€199/month", features: ["11 projects", "More records", "Overages allowed"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Custom billing", features: ["Custom limits", "SLA", "Priority support"] }
    ],
    notes: "50% off for non-profits/education. 30% agency discount. Real-world: ~$1k-2k/year."
  },
  "debugbear": {
    startingPrice: 79,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.debugbear.com/pricing",
    tiers: [
      { name: "Starter", price: 79, period: "month", description: "Small sites", features: ["Synthetic testing", "Core Web Vitals", "Alerts"] },
      { name: "Professional", price: 125, period: "month", description: "Growing sites", features: ["4,000 tests", "RUM analytics", "30+ locations"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large scale", features: ["Custom limits", "Dedicated support"] }
    ],
    notes: "Web performance & Core Web Vitals monitoring. No credit card for trial."
  },
  "deel": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.deel.com/pricing/",
    tiers: [
      { name: "Deel HR", price: 0, description: "Free forever", features: ["Global HR ops", "Onboarding", "Org charts", "Time off management"] },
      { name: "US Payroll", price: 19, period: "month per employee", description: "Domestic", features: ["Payroll processing", "Tax filing", "Compliance"] },
      { name: "Global Payroll", price: 29, period: "month per employee", description: "International", features: ["Multi-country", "Local compliance", "Currency handling"], highlighted: true },
      { name: "EOR", price: 599, period: "month", description: "Employer of Record", features: ["Hire without entity", "Full compliance", "Benefits"] }
    ],
    notes: "No long-term commitment. US PEO from $89/employee. Add-ons available."
  },
  "deepsource": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://deepsource.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Public repos", "Code analysis", "Basic features"] },
      { name: "Pro", price: 12, period: "month per user", description: "Private repos", features: ["All analyzers", "<5% false positives", "Secrets detection"] },
      { name: "Team", price: 24, period: "month per user", description: "Teams", features: ["All Pro features", "Priority support", "Advanced reports"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Self-hosted option", features: ["On-premise", "SSO", "Custom policies"] }
    ]
  },
  "deno-deploy": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://deno.com/deploy/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["1M requests/month", "100GB bandwidth", "1GB KV storage", "Commercial use OK"] },
      { name: "Pro", price: 20, period: "month", description: "Growing apps", features: ["5M requests/month", "$2/extra 1M requests", "More bandwidth"], highlighted: true },
      { name: "Builder", price: 200, period: "month", description: "Scale", features: ["20M requests/month", "300GB bandwidth", "Priority support"] }
    ],
    notes: "Edge serverless for JS/TS/Wasm. Spending limits coming Oct 2025."
  },
  "dependabot": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "free",
    pricingPageUrl: "https://github.com/features/security",
    tiers: [
      { name: "Free", price: 0, description: "GitHub included", features: ["Dependency updates", "Security alerts", "All public repos", "Private repos included"] }
    ],
    notes: "Free for all GitHub users. Part of GitHub Advanced Security for enterprises."
  },
  "detox": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://github.com/wix/Detox",
    tiers: [
      { name: "Open Source", price: 0, description: "MIT License", features: ["E2E testing", "React Native", "iOS & Android", "Full features"] }
    ],
    notes: "Free and open-source mobile E2E testing framework by Wix."
  },
  "devcycle": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://devcycle.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small projects", features: ["Unlimited seats", "Usage-based", "Basic features"] },
      { name: "Startup", price: null, period: "usage-based", description: "Growing teams", features: ["1,000 free MAUs", "10,000 free events", "Audit logging"], highlighted: true },
      { name: "Business", price: null, period: "usage-based", description: "Multiple teams", features: ["Permissions", "Advanced features"] },
      { name: "Enterprise", price: null, period: "custom", description: "Governance needs", features: ["SLA", "Custom policies", "Enterprise support"] }
    ],
    notes: "Usage-based, not seat-based. 50% off LaunchDarkly price through June 2025."
  },
  "devin": {
    startingPrice: 20,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://devin.ai/pricing/",
    tiers: [
      { name: "Core", price: 20, period: "month", description: "Pay-as-you-go", features: ["~9 ACUs included", "$2.25/extra ACU", "Individual developers"] },
      { name: "Team", price: 500, period: "month", description: "Multiple projects", features: ["250 ACUs", "$2/extra ACU", "API access", "Team collaboration"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Scale", features: ["Custom ACUs", "Priority support", "SLA"] }
    ],
    notes: "ACU = Agent Compute Unit. ~15 min active work = 1 ACU. Price dropped from $500 in April 2025."
  },
  "dgraph": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://dgraph.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Development", features: ["1GB storage", "GraphQL API", "Basic features"] },
      { name: "Shared", price: 39, period: "month", description: "Small apps", features: ["5GB storage", "Shared cluster", "Backups"], highlighted: true },
      { name: "Dedicated", price: 295, period: "month", description: "Production", features: ["Dedicated cluster", "High availability", "Premium support"] }
    ],
    notes: "Native GraphQL database. Self-hosted version is free open source."
  },
  "directus": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://directus.io/pricing",
    tiers: [
      { name: "Self-Hosted", price: 0, description: "BSL 1.1 License", features: ["Full features", "<$5M revenue free", "Community support"] },
      { name: "Cloud Starter", price: 15, period: "month", description: "Small projects", features: ["Managed hosting", "Auto-scaling", "Global CDN"] },
      { name: "Professional", price: 49, period: "month", description: "Production", features: ["More resources", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Dedicated", features: ["Custom hardware", "SLA", "Tailored solution"] }
    ],
    notes: "Commercial license required if >$5M revenue/funding in production."
  },
  "discord": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://discord.com/nitro",
    tiers: [
      { name: "Free", price: 0, description: "Core features", features: ["Voice/video chat", "Text channels", "Communities", "Basic features"] },
      { name: "Nitro Basic", price: 2.99, period: "month", description: "Enhanced chat", features: ["Custom emoji", "50MB uploads", "Custom profiles"] },
      { name: "Nitro", price: 9.99, period: "month", description: "Full experience", features: ["500MB uploads", "HD streaming", "2 server boosts", "Custom themes"], highlighted: true }
    ],
    notes: "Annual: $29.99 (Basic), $99.99 (Nitro). Localized pricing varies by country."
  },
  "discourse": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.discourse.org/pricing",
    tiers: [
      { name: "Self-Hosted", price: 0, description: "Open source", features: ["100% free", "Full control", "Community support"] },
      { name: "Starter", price: 25, period: "month", description: "Basic hosting", features: ["Managed hosting", "Basic plugins", "Email support"] },
      { name: "Standard", price: 100, period: "month", description: "Growing communities", features: ["More plugins", "Priority support"], highlighted: true },
      { name: "Business", price: 300, period: "month", description: "High traffic", features: ["Enterprise plugins", "SLA", "Dedicated support"] }
    ],
    notes: "50% non-profit discount, 85% education discount. Enterprise ~$10k/year average."
  },
  "divvy": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.divvy.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Spend management", features: ["Corporate cards", "Expense management", "Budgeting", "No monthly fee"] }
    ],
    notes: "Now part of Bill.com. Free corporate card and expense management platform."
  },
  "dixa": {
    startingPrice: null,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "quote-based",
    pricingPageUrl: "https://www.dixa.com/pricing",
    tiers: [
      { name: "Essential", price: null, period: "per agent", description: "Core features", features: ["Omnichannel inbox", "Basic routing", "Knowledge base"] },
      { name: "Growth", price: null, period: "per agent", description: "Growing teams", features: ["Advanced routing", "Analytics", "Integrations"], highlighted: true },
      { name: "Ultimate", price: null, period: "per agent", description: "Enterprise", features: ["AI features", "Custom workflows", "Dedicated support"] }
    ],
    notes: "Contact for pricing. Customer service platform."
  },
  "docker-hub": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.docker.com/pricing/",
    tiers: [
      { name: "Personal", price: 0, description: "Free", features: ["Unlimited public repos", "100 pulls/hour", "Community support"] },
      { name: "Pro", price: 9, period: "month", description: "Developers", features: ["Unlimited pulls", "5,000 private repos", "Scout & Build Cloud"], highlighted: true },
      { name: "Team", price: 15, period: "month per user", description: "Teams", features: ["Team management", "Audit logs", "All features"] },
      { name: "Business", price: 24, period: "month per user", description: "Enterprise", features: ["SSO/SCIM", "Image Access Management", "Hardened images"] }
    ],
    notes: "Updated Dec 2024. Pro increased from $5, Team from $9. Includes full Docker suite."
  },
  "docsify": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://docsify.js.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "MIT License", features: ["Documentation generator", "No build required", "Plugin system", "Full features"] }
    ],
    notes: "Free and open-source documentation site generator."
  },
  "docusign": {
    startingPrice: 10,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://ecom.docusign.com/plans-and-pricing/esignature",
    tiers: [
      { name: "Personal", price: 10, period: "month", description: "Billed annually ($15 monthly)", features: ["5 envelopes/month", "Reusable templates", "Mobile app"] },
      { name: "Standard", price: 25, period: "month per user", description: "Billed annually ($45 monthly)", features: ["100 envelopes/user/year", "Team templates", "Comments"] },
      { name: "Business Pro", price: 40, period: "month per user", description: "Billed annually ($65 monthly)", features: ["All Standard", "SMS auth", "Payment collection"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["API access", "Admin tools", "SSO", "Advanced branding"] }
    ],
    notes: "Add-ons: SMS notifications $0.40/delivery, ID verification $2.50/attempt."
  },
  "docusaurus": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://docusaurus.io/",
    tiers: [
      { name: "Open Source", price: 0, description: "MIT License", features: ["Static site generator", "React-based", "Documentation sites", "Blog support"] }
    ],
    notes: "Free and open-source by Meta. Used by many major projects."
  },
  "doppler": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.doppler.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 3 users", features: ["Secrets management", "Integrations", "Basic features"] },
      { name: "Team", price: 21, period: "month per user", description: "Growing teams", features: ["Unlimited users", "Audit logs", "Advanced features"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["SSO/SAML", "Custom policies", "Dedicated support"] }
    ],
    notes: "Per developer pricing, unlimited service accounts. Free tier reduced recently."
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    console.error("SEED_SECRET not set");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

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
        select: { id: true, name: true },
      });

      if (!tool) {
        results.notFound++;
        results.notFoundList.push(slug);
        continue;
      }

      await prisma.tool.update({
        where: { slug },
        data: {
          pricingDetails: pricing,
        },
      });

      results.updated++;
    } catch (error) {
      results.errors.push(`${slug}: ${error}`);
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
    total: Object.keys(pricingData).length,
  });
}
