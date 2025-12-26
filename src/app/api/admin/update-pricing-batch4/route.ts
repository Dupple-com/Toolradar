import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 4: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "aws-lambda": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/lambda/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Always free", features: ["1M requests/month", "400,000 GB-seconds", "x86 and Graviton2", "No expiration"] },
      { name: "Pay-As-You-Go", price: 0.20, period: "per 1M requests", description: "Standard pricing", features: ["$0.0000166667/GB-sec", "Arm 20% cheaper", "Provisioned concurrency available", "Up to 17% savings with plans"], highlighted: true }
    ]
  },
  "axiom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://axiom.co/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Always free", features: ["500 GB/month ingest", "10 GB-hours query", "25 GB storage", "Community support"] },
      { name: "Team", price: 25, period: "month", description: "Getting started", features: ["Higher limits", "Team collaboration", "All features", "Email support"], highlighted: true },
      { name: "Basic", price: 99, period: "month", description: "5 TB included", features: ["5 TB data", "Volume discounts", "Priority support", "All integrations"] },
      { name: "Enterprise", price: "Custom", description: "Unlimited scale", features: ["Petabyte scale", "Dedicated support", "Custom contracts", "SLA guarantee"] }
    ],
    notes: "Up to 20x cost savings vs CloudWatch"
  },
  "bamboohr": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://www.bamboohr.com/pricing/",
    tiers: [
      { name: "Core", price: 10, period: "month per employee", description: "HR foundation", features: ["Employee records", "Workflows", "Basic ATS", "Standard reports"] },
      { name: "Pro", price: 15, period: "month per employee", description: "Advanced features", features: ["Performance tools", "AI assistance", "Satisfaction tracking", "Compensation planning"], highlighted: true },
      { name: "Elite", price: 22, period: "month per employee", description: "Full experience", features: ["Custom dashboards", "HR benchmarking", "300+ compliance courses", "Premium AI assistant"] }
    ],
    notes: "Flat $250/mo minimum for 25 or fewer employees. 15% nonprofit discount available"
  },
  "basecamp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://basecamp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["1 project", "1 GB storage", "Core features", "Limited scope"] },
      { name: "Plus", price: 15, period: "month per user", description: "Small teams", features: ["Unlimited projects", "500 GB storage/user", "Free guests & clients", "Mobile apps"], highlighted: true },
      { name: "Pro Unlimited", price: 299, period: "month", description: "Unlimited users", features: ["Fixed price", "5 TB storage", "24/7 priority support", "1:1 onboarding"] }
    ],
    notes: "10% nonprofit discount. Free for teachers and students"
  },
  "baserow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://baserow.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small projects", features: ["Unlimited databases", "3,000 rows (cloud)", "2 GB storage", "Community support"] },
      { name: "Premium", price: 10, period: "month per user", description: "Growing teams", features: ["50,000 rows/workspace", "20 GB storage", "Premium features", "Email support"], highlighted: true },
      { name: "Advanced", price: 20, period: "month per user", description: "Scaling teams", features: ["SSO/SAML", "Audit logging", "Custom integrations", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Self-hosted", features: ["Unlimited everything", "On-premise deploy", "Dedicated support", "Custom pricing"] }
    ]
  },
  "bear": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://bear.app/",
    tiers: [
      { name: "Free", price: 0, description: "Basic notes", features: ["Markdown editing", "All core features", "Local storage", "Limited export"] },
      { name: "Pro", price: 2.99, period: "month", description: "Power users", features: ["iCloud sync", "All export formats", "Note encryption", "Custom themes"], highlighted: true }
    ],
    notes: "Apple ecosystem only. $29.99/year option available"
  },
  "beehiiv": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://www.beehiiv.com/pricing",
    tiers: [
      { name: "Launch", price: 0, description: "Getting started", features: ["2,500 subscribers", "Unlimited sends", "3 newsletters", "Website builder"] },
      { name: "Scale", price: 49, period: "month", description: "Monetization", features: ["Scales with growth", "A/B testing", "Surveys", "AI writing"], highlighted: true },
      { name: "Max", price: 109, period: "month", description: "Power publishers", features: ["10 publications", "Remove branding", "Priority support", "NewsletterXP course"] },
      { name: "Enterprise", price: "Custom", description: "100K+ subscribers", features: ["Custom limits", "Dedicated support", "Custom integrations", "SLA"] }
    ],
    notes: "No email limits. 2.9% + $0.30 Stripe fee only"
  },
  "better-uptime": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://betterstack.com/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free forever", features: ["10 monitors", "3-min checks", "Email alerts", "1 integration"] },
      { name: "Freelance", price: 24, period: "month", description: "Solo developers", features: ["50 monitors", "30-sec checks", "Phone & SMS alerts", "Few integrations"], highlighted: true },
      { name: "Small Team", price: 64, period: "month", description: "Growing teams", features: ["100 monitors", "5 team members", "All integrations", "SSL monitoring"] },
      { name: "Business", price: 120, period: "month", description: "Organizations", features: ["Unlimited monitors", "Multiple teams", "All features", "Priority support"] }
    ]
  },
  "bigquery": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://cloud.google.com/bigquery/pricing",
    tiers: [
      { name: "Free Tier", price: 0, description: "Getting started", features: ["10 GiB storage/month", "1 TiB queries/month", "All core features", "No credit card"] },
      { name: "On-Demand", price: 6.25, period: "per TB", description: "Pay-as-you-go", features: ["First 1 TB free", "2,000 concurrent slots", "Standard support", "No commitment"], highlighted: true },
      { name: "Editions", price: 0.04, period: "per slot-hour", description: "Capacity pricing", features: ["Predictable costs", "Reserved capacity", "Up to 3-year discounts", "Enterprise features"] }
    ],
    notes: "Long-term storage 50% cheaper after 90 days"
  },
  "bitwarden": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://bitwarden.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Personal use", features: ["Unlimited passwords", "All devices", "Password generator", "Secure notes"] },
      { name: "Premium", price: 0.83, period: "month", description: "Advanced security", features: ["TOTP authenticator", "1 GB file storage", "Emergency access", "Priority support"], highlighted: true },
      { name: "Teams Starter", price: 20, period: "month for 10 users", description: "Small teams", features: ["Secure sharing", "Directory integration", "Event logs", "Admin tools"] },
      { name: "Enterprise", price: 6, period: "month per user", description: "Organizations", features: ["SSO/SAML", "Policy enforcement", "Self-host option", "Free Families plan"] }
    ],
    notes: "Premium is $10/year. Teams is $4/user/month for larger teams"
  },
  "azure-devops": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/",
    tiers: [
      { name: "Free", price: 0, description: "First 5 users", features: ["5 Basic users", "Unlimited stakeholders", "1 parallel job", "1,800 min/month"] },
      { name: "Basic", price: 6, period: "month per user", description: "Additional users", features: ["All core features", "Azure Repos", "Azure Boards", "Azure Pipelines"], highlighted: true },
      { name: "Basic + Test Plans", price: 52, period: "month per user", description: "Testing teams", features: ["All Basic features", "Test Plans", "Manual testing", "Exploratory testing"] }
    ],
    notes: "Free for Visual Studio subscribers. Pro-rated billing available"
  },
  "azure-functions": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/functions/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Monthly free grant", features: ["1M executions/month", "400,000 GB-seconds", "Consumption plan", "All features"] },
      { name: "Consumption", price: 0.20, period: "per 1M executions", description: "Pay-as-you-go", features: ["$0.000016/GB-sec", "Auto-scaling", "Pay for usage only", "Cold starts possible"], highlighted: true },
      { name: "Flex Consumption", price: 0.40, period: "per 1M executions", description: "GA 2025", features: ["Faster cold starts", "VNet integration", "Higher concurrency", "Always-ready option"] },
      { name: "Premium", price: "Varies", description: "Pre-warmed", features: ["No cold starts", "VNET connectivity", "Unlimited execution", "Dedicated instances"] }
    ]
  },
  "bigcommerce": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15, pricingPageUrl: "https://www.bigcommerce.com/essentials/pricing/",
    tiers: [
      { name: "Standard", price: 29, period: "month", description: "Up to $50K/year", features: ["Unlimited products", "3 storefronts", "24/7 support", "No transaction fees"] },
      { name: "Plus", price: 79, period: "month", description: "Up to $180K/year", features: ["Customer groups", "Abandoned cart saver", "5 storefronts", "All Standard features"], highlighted: true },
      { name: "Pro", price: 299, period: "month", description: "Up to $400K/year", features: ["8 storefronts", "Google customer reviews", "Product filtering", "All Plus features"] },
      { name: "Enterprise", price: "Custom", description: "Custom pricing", features: ["Unlimited GMV", "Custom storefronts", "Priority support", "API priority"] }
    ],
    notes: "Prices shown are annual billing. Monthly is 33% higher"
  },
  "aws-cdk": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://aws.amazon.com/cdk/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Infrastructure as code", "TypeScript, Python, Go, Java, C#", "AWS integration", "Community support"], highlighted: true }
    ],
    notes: "Free tool. Pay for AWS resources deployed"
  },
  "aws-cloudformation": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/cloudformation/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "AWS resources", features: ["Create AWS stacks", "No handler operations", "First-party resources", "Core functionality"] },
      { name: "Handler Operations", price: 0.0009, period: "per operation", description: "Third-party resources", features: ["Private extensions", "Third-party types", "Activated public extensions"], highlighted: true }
    ],
    notes: "Only pay for resources provisioned and handler operations"
  },
  "aws-secrets-manager": {
    startingPrice: 0.40, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://aws.amazon.com/secrets-manager/pricing/",
    tiers: [
      { name: "Per Secret", price: 0.40, period: "month per secret", description: "Secret storage", features: ["Automatic rotation", "Fine-grained policies", "Audit with CloudTrail", "Cross-region replication"], highlighted: true },
      { name: "API Calls", price: 0.05, period: "per 10,000 calls", description: "Access pricing", features: ["GetSecretValue", "All API operations", "SDK integration"] }
    ]
  },
  "azure": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "12 months free", features: ["$200 credit first 30 days", "Popular services free", "Always free services", "No commitment"] },
      { name: "Pay-As-You-Go", price: "Varies", description: "Usage-based", features: ["No upfront costs", "Per-second billing", "All services", "Cancel anytime"], highlighted: true },
      { name: "Reserved", price: "Custom", description: "1-3 year terms", features: ["Up to 72% savings", "Capacity guarantee", "Predictable billing"] },
      { name: "Enterprise", price: "Custom", description: "Enterprise agreement", features: ["Volume discounts", "Dedicated support", "Custom terms", "Hybrid benefits"] }
    ]
  },
  "azure-cosmos-db": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/cosmos-db/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Always free", features: ["1000 RU/s provisioned", "25 GB storage", "First account free", "All features"] },
      { name: "Serverless", price: 0.25, period: "per 1M RUs", description: "Intermittent traffic", features: ["Pay per request", "Auto-scaling", "No minimum", "Dev/test workloads"], highlighted: true },
      { name: "Provisioned", price: 0.008, period: "per 100 RU/s/hour", description: "Predictable workloads", features: ["Reserved capacity", "Up to 65% savings", "Autoscale option", "Production ready"] }
    ]
  },
  "azure-ml": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/machine-learning/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Getting started", features: ["Limited compute", "Managed notebooks", "AutoML", "Designer"] },
      { name: "Pay-As-You-Go", price: "Varies", description: "Usage-based", features: ["All compute options", "MLOps pipelines", "Model management", "Endpoints"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Advanced features", features: ["Private endpoints", "Customer-managed keys", "Dedicated capacity", "Premium support"] }
    ]
  },
  "azure-synapse": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/synapse-analytics/",
    tiers: [
      { name: "Serverless SQL", price: 5, period: "per TB processed", description: "Query data lake", features: ["Pay per query", "No infrastructure", "T-SQL support", "On-demand"], highlighted: true },
      { name: "Dedicated SQL", price: "Varies", description: "Data warehouse", features: ["100 DWU minimum", "Reserved capacity", "Predictable performance", "RA-GRS backup"] },
      { name: "Apache Spark", price: "Varies", description: "Big data analytics", features: ["Node-based pricing", "Auto-scaling", "Multiple languages", "ML integration"] }
    ]
  },
  "backendless": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://backendless.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Hobby projects", features: ["1,000 API calls/min", "1 GB storage", "1 GB database", "Community support"] },
      { name: "Springboard", price: 25, period: "month", description: "Growing apps", features: ["10,000 API calls/min", "10 GB storage", "10 GB database", "Email support"], highlighted: true },
      { name: "Cloud 9", price: 99, period: "month", description: "Production apps", features: ["50,000 API calls/min", "50 GB storage", "50 GB database", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited scale", "Dedicated servers", "SLA guarantee", "Custom terms"] }
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
