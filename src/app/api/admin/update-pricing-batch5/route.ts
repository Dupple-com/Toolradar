import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 5: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "amazon-dynamodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/dynamodb/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Always free", features: ["25 GB storage", "25 WCUs", "25 RCUs", "200M requests/month"] },
      { name: "On-Demand", price: 1.25, period: "per 1M writes", description: "Pay-per-request", features: ["$0.25/1M reads", "Auto-scaling", "No capacity planning", "Serverless"], highlighted: true },
      { name: "Provisioned", price: 0.00065, period: "per WCU/hour", description: "Predictable workloads", features: ["$0.00013/RCU/hour", "Reserved capacity", "Up to 75% savings"] }
    ],
    notes: "50% price reduction in Jan 2025"
  },
  "amazon-redshift": {
    startingPrice: 0.25, currency: "USD", billingPeriod: "hour", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/redshift/pricing/",
    tiers: [
      { name: "Free Trial", price: 0, description: "2 months free", features: ["DC2.Large node", "Full features", "New customers"] },
      { name: "Serverless", price: 0.375, period: "per RPU/hour", description: "Pay-per-query", features: ["Min 4 RPUs", "Auto-scaling", "No infrastructure", "60-sec minimum"], highlighted: true },
      { name: "DC2.Large", price: 0.25, period: "hour", description: "On-demand", features: ["160GB SSD", "Best for <1TB", "Compute + storage"] },
      { name: "RA3", price: 0.543, period: "hour", description: "Managed storage", features: ["Decoupled compute", "$0.024/GB storage", "Unlimited scale"] }
    ]
  },
  "amazon-sagemaker": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/sagemaker/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "2 months", features: ["250 hrs notebooks", "50 hrs training", "125 hrs hosting", "ml.t3.medium"] },
      { name: "On-Demand", price: 0.23, period: "hour", description: "ml.m5.xlarge training", features: ["All instance types", "Pay for usage", "No commitment", "All features"], highlighted: true },
      { name: "Savings Plans", price: "Custom", description: "1-3 year terms", features: ["Up to 64% savings", "Flexible instances", "All components"] }
    ]
  },
  "anthropic-api": {
    startingPrice: 0.25, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.anthropic.com/pricing",
    tiers: [
      { name: "Haiku", price: 0.25, period: "per 1M input tokens", description: "Fast & affordable", features: ["$1.25/1M output", "Fastest model", "Simple tasks", "Cost-effective"] },
      { name: "Sonnet 4", price: 3, period: "per 1M input tokens", description: "Balanced", features: ["$15/1M output", "Most popular", "Complex tasks", "200K context"], highlighted: true },
      { name: "Opus 4.5", price: 15, period: "per 1M input tokens", description: "Most capable", features: ["$75/1M output", "Best reasoning", "Agentic tasks", "1M context"] }
    ],
    notes: "50% discount with Batch API. Pro subscription $20/month"
  },
  "apache-superset": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://superset.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full functionality", "Apache license", "Community support", "Self-managed"] },
      { name: "Preset", price: 25, period: "month per user", description: "Managed service", features: ["Hosted Superset", "Easy setup", "Managed updates", "Support included"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom deploy", features: ["Dedicated support", "Custom integrations", "SLA guarantee"] }
    ]
  },
  "aider": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: false, pricingPageUrl: "https://aider.chat/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["MIT license", "Bring your own API key", "All LLM providers", "Local models supported"], highlighted: true }
    ],
    notes: "Free tool. Pay only for LLM API usage (~$0.007/file processed)"
  },
  "amazon-codewhisperer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/codewhisperer/pricing/",
    tiers: [
      { name: "Individual", price: 0, description: "Free forever", features: ["Code suggestions", "Reference tracking", "50 scans/month", "All IDEs"] },
      { name: "Professional", price: 19, period: "month per user", description: "Teams", features: ["500 scans/month", "Admin controls", "SSO integration", "Policy management"], highlighted: true }
    ],
    notes: "Now part of Amazon Q Developer"
  },
  "appium": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://appium.io/",
    tiers: [
      { name: "Open Source", price: 0, description: "Free forever", features: ["Mobile testing", "Cross-platform", "All languages", "Active community"], highlighted: true }
    ],
    notes: "Free open-source. Third-party services may charge separately"
  },
  "archbee": {
    startingPrice: 50, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.archbee.com/pricing",
    tiers: [
      { name: "Growing", price: 50, period: "month", description: "3 members", features: ["Unlimited readers", "Custom domain", "10GB storage", "1 year history"] },
      { name: "Scaling", price: 200, period: "month", description: "3 members", features: ["20GB storage", "2 year history", "Custom CSS", "No branding"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom", features: ["SSO/SAML", "Dedicated support", "Custom integrations", "SLA"] }
    ],
    notes: "Extra members $4-8/month. AI features $20+/month add-on"
  },
  "ai21-labs": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.ai21.com/pricing/",
    tiers: [
      { name: "Free Trial", price: 0, description: "$10 credit", features: ["3 months validity", "All APIs", "SDK access", "Playground"] },
      { name: "Pay-As-You-Go", price: "Usage-based", description: "Per token", features: ["Jamba 1.5 Mini", "Jamba 1.5 Large", "30% less compute", "Fast inference"], highlighted: true }
    ]
  },
  "anyscale": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.anyscale.com/pricing",
    tiers: [
      { name: "Free Credits", price: 0, description: "$100 to start", features: ["Full platform access", "Ray runtime", "All features", "Community support"] },
      { name: "Pay-As-You-Go", price: "Usage-based", description: "Per compute", features: ["Spot instances", "Volume discounts", "Cost governance", "Team budgets"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom pricing", features: ["BYOC support", "Dedicated support", "SLA guarantee", "Custom contracts"] }
    ]
  },
  "apollo-studio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.apollographql.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning", features: ["60 req/min limit", "1 day retention", "Community support", "No credit card"] },
      { name: "Standard", price: 49, period: "month", description: "Production", features: ["Higher limits", "Longer retention", "Email support", "All features"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom", features: ["Unlimited scale", "Premium support", "Federation", "Custom SLA"] }
    ],
    notes: "Enterprise averages ~$57K/year"
  },
  "applitools": {
    startingPrice: 699, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://applitools.com/platform-pricing/",
    tiers: [
      { name: "Eyes Components", price: 699, period: "month", description: "Visual testing", features: ["Unlimited users", "Unlimited tests", "Component testing", "AI-powered"] },
      { name: "Eyes", price: 899, period: "month", description: "Full platform", features: ["Cross-browser", "Visual AI", "All integrations", "Unlimited executions"], highlighted: true },
      { name: "Autonomous", price: 969, period: "month", description: "AI testing", features: ["Autonomous tests", "Self-healing", "All Eyes features", "AI agent"] }
    ]
  },
  "appsignal": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://www.appsignal.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["50K requests", "1GB logging", "5-day retention", "All features"] },
      { name: "Starter", price: 23, period: "month", description: "Small apps", features: ["Higher limits", "Error tracking", "APM", "Dashboards"], highlighted: true },
      { name: "Growth", price: 59, period: "month", description: "Growing apps", features: ["More requests", "Longer retention", "All features"] },
      { name: "Pro", price: 139, period: "month", description: "Production", features: ["High volume", "Unlimited hosts", "Priority support"] }
    ],
    notes: "No overage fees. HIPAA/SAML add-ons available"
  },
  "adobe-color": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://color.adobe.com/",
    tiers: [
      { name: "Free", price: 0, description: "All features", features: ["Color wheel", "Extract from image", "Accessibility tools", "Adobe account required"], highlighted: true }
    ]
  },
  "anchor": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://anchor.fm/",
    tiers: [
      { name: "Free", price: 0, description: "Full platform", features: ["Unlimited hosting", "Distribution", "Monetization", "Analytics"], highlighted: true }
    ],
    notes: "Now part of Spotify for Podcasters"
  },
  "anchore": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://anchore.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Container scanning", "SBOM generation", "Basic policies", "CLI tools"] },
      { name: "Enterprise", price: "Custom", description: "Full platform", features: ["Policy management", "Compliance reports", "SSO/SAML", "Premium support"], highlighted: true }
    ]
  },
  "angellist": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://www.angellist.com/",
    tiers: [
      { name: "Free", price: 0, description: "Job seekers", features: ["Job search", "Company profiles", "Apply to jobs", "Startup network"], highlighted: true },
      { name: "Recruit Pro", price: "Custom", description: "Employers", features: ["Job postings", "Candidate search", "ATS features", "Analytics"] }
    ]
  },
  "apache-druid": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://druid.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Real-time analytics", "OLAP queries", "High performance", "Apache license"], highlighted: true }
    ],
    notes: "Commercial support available from vendors like Imply"
  },
  "apache-nifi": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://nifi.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Data flow automation", "Visual interface", "Extensible", "Apache license"], highlighted: true }
    ],
    notes: "Commercial support from Cloudera and others"
  },
  "apidog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://apidog.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["5 projects", "API design", "Mock server", "Basic features"] },
      { name: "Basic", price: 9, period: "month per user", description: "Small teams", features: ["Unlimited projects", "Cloud sync", "Team sharing", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["SSO", "Audit logs", "Custom deploy", "Dedicated support"] }
    ]
  },
  "aptabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://aptabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby projects", features: ["Up to 20K events/month", "Core analytics", "Privacy-focused", "No credit card"] },
      { name: "Pro", price: 14, period: "month", description: "Growing apps", features: ["100K events/month", "Advanced analytics", "Export data", "Priority support"], highlighted: true }
    ]
  },
  "around": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.around.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic meetings", features: ["Unlimited 1:1s", "45-min groups", "Screen sharing", "Core features"] },
      { name: "Pro", price: 12, period: "month per user", description: "Teams", features: ["Unlimited meetings", "Recording", "Transcription", "Integrations"], highlighted: true }
    ]
  },
  "askcodi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.askcodi.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Try it out", features: ["Limited queries", "Basic features", "Community support"] },
      { name: "Premium", price: 10, period: "month", description: "Full access", features: ["Unlimited queries", "All features", "Priority support", "All IDEs"], highlighted: true }
    ]
  },
  "atatus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.atatus.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["Limited data", "7-day retention", "Core features"] },
      { name: "Pro", price: 49, period: "month", description: "Production apps", features: ["APM", "RUM", "Logs", "14-day retention"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited data", "Custom retention", "SSO", "Priority support"] }
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
