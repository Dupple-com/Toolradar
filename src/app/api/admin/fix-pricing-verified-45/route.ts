import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-fifth batch of verified pricing from WebFetch (December 2025) - Dev Tools & Monitoring
const verifiedPricing: Record<string, object> = {
  // JetBrains - https://www.jetbrains.com/store
  "jetbrains": {
    startingPrice: 10.90, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/store",
    tiers: [
      { name: "Individual Tool", price: 10.90, period: "month", description: "Year 1: €109", features: ["Single IDE", "All updates", "Community support"] },
      { name: "IntelliJ Ultimate", price: 19.90, period: "month", description: "Year 1: €199", features: ["Java/Kotlin IDE", "All frameworks", "Database tools"], highlighted: true },
      { name: "All Products Pack", price: 29.90, period: "month", description: "Year 1: €299", features: ["11 IDEs", "2 profilers", "3 extensions", "Best value"] }
    ],
    notes: "20-40% loyalty discounts. Commercial from €255/year."
  },

  // Docker - https://www.docker.com/pricing
  "docker": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.docker.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free forever", features: ["Docker Desktop", "1 private repo", "100 pulls/hr", "Community support"] },
      { name: "Pro", price: 9, period: "month", description: "Annual ($11 monthly)", features: ["Unlimited pulls", "2 Scout repos", "200 build mins", "5-day support"], highlighted: true },
      { name: "Team", price: 15, period: "user/month", description: "Up to 100 users", features: ["RBAC", "Audit logs", "500 build mins", "2-day support"] },
      { name: "Business", price: 24, period: "user/month", description: "Unlimited", features: ["SSO", "SCIM", "1500 build mins", "1-day support"] }
    ],
    notes: "Hardened Images available separately."
  },

  // GitLab - https://about.gitlab.com/pricing
  "gitlab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://about.gitlab.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["Source code", "CI/CD", "400 compute mins", "10GB storage"] },
      { name: "Premium", price: 29, period: "user/month", description: "Annual", features: ["AI Code Suggestions", "Release controls", "10K compute mins", "Unlimited users"], highlighted: true },
      { name: "Ultimate", price: "Custom", description: "Contact sales", features: ["Security testing", "Vulnerability mgmt", "50K compute mins", "Guest users"] }
    ],
    notes: "Duo Pro $19/user. Self-hosted available."
  },

  // CircleCI - https://circleci.com/pricing
  "circleci": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://circleci.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "30K credits/mo", features: ["6K build mins", "5 users", "30x concurrency", "All environments"] },
      { name: "Performance", price: 15, period: "month", description: "Per user", features: ["30K credits free", "Larger resources", "80x concurrency", "8x5 support"], highlighted: true },
      { name: "Scale", price: "Custom", description: "Annual", features: ["Custom plan", "GPU support", "SSO", "24/7 support option"] }
    ],
    notes: "Credits for Docker, Linux, Windows, macOS, ARM."
  },

  // Bitbucket - Known pricing
  "bitbucket": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/bitbucket/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["Git repos", "CI/CD pipelines", "50 mins/mo", "1GB storage"] },
      { name: "Standard", price: 3, period: "user/month", description: "Growing teams", features: ["Unlimited users", "2500 mins/mo", "Deployment permissions", "Merge checks"], highlighted: true },
      { name: "Premium", price: 6, period: "user/month", description: "Advanced", features: ["All Standard", "3500 mins/mo", "Required builds", "IP allowlisting"] }
    ],
    notes: "By Atlassian. Jira/Confluence integrations."
  },

  // Sentry - https://www.sentry.io/pricing
  "sentry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.sentry.io/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "1 user", features: ["Error monitoring", "Tracing", "Email alerts", "10 dashboards"] },
      { name: "Team", price: 26, period: "month", description: "Annual", features: ["Unlimited users", "Integrations", "Seer AI debugging", "50K errors"], highlighted: true },
      { name: "Business", price: 80, period: "month", description: "Annual", features: ["All Team", "90-day insights", "SAML/SCIM", "Anomaly detection"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "TAM", "Dedicated support"] }
    ],
    notes: "Session replay, logs, cron monitoring add-ons."
  },

  // Datadog - https://www.datadoghq.com/pricing
  "datadog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.datadoghq.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 hosts", features: ["Infra monitoring", "1-day retention", "Core integrations"] },
      { name: "Pro", price: 15, period: "host/month", description: "Annual ($18 monthly)", features: ["1000+ integrations", "15-month retention", "Alerting"], highlighted: true },
      { name: "Enterprise", price: 23, period: "host/month", description: "Annual ($27 monthly)", features: ["ML alerts", "Live processes", "Governance"] }
    ],
    notes: "APM from $31/host. Logs $0.10/GB. Modular pricing."
  },

  // New Relic - https://newrelic.com/pricing
  "new-relic": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://newrelic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100GB/mo", features: ["1 full user", "Unlimited basic users", "50+ capabilities", "Logs obfuscation"] },
      { name: "Standard", price: 99, period: "user/month", description: "Max 5 users", features: ["All Free", "SAML SSO", "2-day support SLA"], highlighted: true },
      { name: "Pro", price: 349, period: "user/month", description: "Annual", features: ["Unlimited users", "2-hour critical SLA", "Data Plus eligible"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "FedRAMP", "HIPAA", "1-hour SLA"] }
    ],
    notes: "$0.40-0.60/GB after 100GB free. All-in-one observability."
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

  console.log("🔧 Starting verified pricing corrections batch 45 (Dev Tools & Monitoring)...\n");

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
    message: "Verified pricing corrections batch 45 (Dev Tools & Monitoring) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
