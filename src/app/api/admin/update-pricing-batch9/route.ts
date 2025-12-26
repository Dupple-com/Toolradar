import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Batch 9: 30 tools pricing data
const pricingData: Record<string, object> = {
  "codium-ai": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.qodo.ai/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Free forever", features: ["250 credits/month", "Code completion", "IDE integration", "Basic support"] },
      { name: "Teams", price: 19, period: "month per user", description: "Advanced features", features: ["2,500 credits/month", "PR-Agent Pro", "Test generation", "GPT-4 chat"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Custom credits", "SSO/SAML", "Data retention", "Priority support"] }
    ],
    notes: "Rebranded to Qodo. Supports 40+ languages, works best with Python, JS, TypeScript."
  },
  "cohere": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://cohere.com/pricing",
    tiers: [
      { name: "Trial", price: 0, description: "Evaluation only", features: ["Rate limited", "Non-commercial use", "API access", "All models"] },
      { name: "Production", price: null, period: "pay-as-you-go", description: "At scale", features: ["Command R+: $3/1M input", "Command R: $0.15/1M input", "Rerank & Embed", "No rate limits"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Custom deployments", features: ["Dedicated instances", "Private deployment", "Custom models", "SLA"] }
    ],
    notes: "Command R+: $3/$15 per 1M tokens (input/output). Command R: $0.15/$0.60 per 1M tokens."
  },
  "colossyan": {
    startingPrice: 19,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.colossyan.com/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "Try it out", features: ["5 min video", "Limited avatars", "Basic features"] },
      { name: "Starter", price: 19, period: "month", description: "Billed annually", features: ["10 min video/month", "70+ AI avatars", "3 custom avatars", "1 voice clone"] },
      { name: "Business", price: 70, period: "month", description: "Billed annually", features: ["30 min video/month", "170+ AI avatars", "Interactive videos", "Auto translations"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Unlimited", features: ["Unlimited video", "200+ avatars", "Brand kits", "SSO"] }
    ]
  },
  "comet-ml": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.comet.com/site/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["100GB storage", "Core experiment tracking", "Model registry", "Community support"] },
      { name: "Pro", price: 19, period: "month per user", description: "Growing teams", features: ["1,500 training hours", "500GB storage", "Up to 10 users", "Email support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Unlimited usage", "Production monitoring", "SSO", "Dedicated support"] }
    ],
    notes: "Free Pro plan for academic users (researchers, students, educators)."
  },
  "commerce-layer": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "year",
    hasFreeTrial: true,
    pricingModel: "quote-based",
    pricingPageUrl: "https://commercelayer.io/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "Getting started", features: ["Test environment", "API access", "Documentation", "Community support"] },
      { name: "Growth", price: null, period: "custom", description: "Scaling businesses", features: ["Production access", "Multiple markets", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "~$40,000+/year", features: ["Dedicated infrastructure", "Custom SLA", "Enterprise support"] }
    ],
    notes: "Enterprise headless commerce platform. Pricing typically $40,000+ annually."
  },
  "commerce-js": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://commercejs.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Development", features: ["API access", "Product catalog", "Cart & checkout", "Community support"] },
      { name: "Growth", price: null, period: "custom", description: "Production", features: ["Production use", "Multiple channels", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Scale", features: ["Custom SLA", "Dedicated support", "Advanced features"] }
    ],
    notes: "API-first ecommerce platform. Contact for production pricing."
  },
  "composer": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://getcomposer.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Free forever", features: ["PHP dependency manager", "Packagist access", "Autoloading", "Full features"] }
    ],
    notes: "Free and open-source PHP dependency manager. No paid tiers."
  },
  "concourse": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "open-source",
    pricingPageUrl: "https://concourse-ci.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Apache 2.0 license", "Container-based CI/CD", "100+ integrations", "Full features"] },
      { name: "CentralCI Managed", price: 699, period: "month", description: "Managed service", features: ["Fully managed", "No ops overhead", "Enterprise support"], highlighted: true },
      { name: "VMware Tanzu", price: null, period: "custom", description: "Enterprise support", features: ["LTS releases", "VMware support", "Enterprise features"] }
    ],
    notes: "Open source CI/CD. Managed options available via CentralCI or VMware Tanzu."
  },
  "configcat": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://configcat.com/pricing",
    tiers: [
      { name: "Forever Free", price: 0, description: "Getting started", features: ["Unlimited users", "All features", "Config downloads limit", "Community support"] },
      { name: "Pro", price: null, period: "based on usage", description: "Growing teams", features: ["Higher download limits", "Priority support", "No per-seat pricing"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Custom limits", "SLA", "Dedicated support"] }
    ],
    notes: "Pricing based on config downloads, not MAU or seats. Much cheaper than LaunchDarkly."
  },
  "confluent": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://www.confluent.io/confluent-cloud/pricing/",
    tiers: [
      { name: "Standard", price: null, period: "usage-based", description: "Production teams", features: ["Up to 1GBps throughput", "500 partitions included", "Multi-AZ", "Pay-as-you-go"], highlighted: true },
      { name: "Dedicated", price: null, period: "usage-based", description: "Enterprise", features: ["Beyond 1GBps", "Private networking", "Custom SLA", "CKU-based pricing"] },
      { name: "Enterprise", price: null, period: "commitment", description: "Large scale", features: ["Annual commitment discounts", "Dedicated support", "Enterprise features"] }
    ],
    notes: "$1,000 free credits for new users. Billing: eCKUs/hour + storage + networking."
  },
  "containerd": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://containerd.io/",
    tiers: [
      { name: "Open Source", price: 0, description: "CNCF Graduated", features: ["Container runtime", "OCI compliant", "Docker/K8s compatible", "Apache 2.0 license"] }
    ],
    notes: "Free and open-source container runtime. CNCF graduated project."
  },
  "contentful": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.contentful.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["1 Starter Space", "Limited users", "Community support"] },
      { name: "Basic", price: 300, period: "month", description: "Small teams", features: ["More spaces", "API limits increase", "Email support"], highlighted: true },
      { name: "Premium", price: null, period: "custom", description: "~$60,000+/year", features: ["Unlimited users", "Premium support", "SLA", "Advanced security"] }
    ],
    notes: "Enterprise pricing typically $60k-$450k/year based on needs. Support tiers extra."
  },
  "continue": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://hub.continue.dev/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Solo developers", features: ["Open source", "IDE extensions", "Any model support", "Local deployment"] },
      { name: "Teams", price: 10, period: "month per developer", description: "Team collaboration", features: ["Centralized management", "Shared assistants", "Team analytics"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["SSO/SAML", "On-premise", "Custom policies", "Enterprise support"] }
    ],
    notes: "Open source (20k+ GitHub stars). Supports local or cloud models. Used by Siemens, Morningstar."
  },
  "contractpodai": {
    startingPrice: null,
    currency: "USD",
    billingPeriod: "year",
    hasFreeTrial: true,
    pricingModel: "quote-based",
    pricingPageUrl: "https://contractpodai.com/pricing",
    tiers: [
      { name: "Professional", price: null, period: "custom", description: "Mid-market", features: ["Contract management", "AI extraction", "Workflow automation"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large enterprises", features: ["Advanced AI", "Custom integrations", "Dedicated support", "SLA"], highlighted: true }
    ],
    notes: "Enterprise contract lifecycle management. Contact for pricing."
  },
  "contractbook": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://contractbook.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["5 documents/month", "E-signatures", "Basic templates"] },
      { name: "Essential", price: 39, period: "month per user", description: "Small teams", features: ["Unlimited documents", "Custom templates", "Integrations"] },
      { name: "Business", price: 79, period: "month per user", description: "Growing teams", features: ["Approval workflows", "Advanced analytics", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["SSO", "API access", "Dedicated success manager"] }
    ]
  },
  "convert": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 15,
    pricingPageUrl: "https://www.convert.com/pricing/",
    tiers: [
      { name: "Kickstart", price: 99, period: "month", description: "Getting started", features: ["Up to 50k visitors", "A/B testing", "Multivariate tests", "Unlimited projects"] },
      { name: "Specialist", price: 449, period: "month", description: "Growing", features: ["Up to 400k visitors", "Advanced targeting", "Priority support"], highlighted: true },
      { name: "Leader", price: 999, period: "month", description: "Scaling", features: ["Up to 1M visitors", "Custom solutions", "Dedicated support"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large scale", features: ["Custom visitors", "SLA", "Full API access"] }
    ]
  },
  "convertkit": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://kit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "Free forever", features: ["Up to 10,000 subscribers", "Unlimited emails", "Landing pages", "1 automation"] },
      { name: "Creator", price: 33, period: "month", description: "Starting at (1k subs)", features: ["Unlimited automations", "Paid recommendations", "Chat support"], highlighted: true },
      { name: "Creator Pro", price: 66, period: "month", description: "Starting at (1k subs)", features: ["A/B testing", "Advanced analytics", "Engagement scoring", "Facebook audiences"] }
    ],
    notes: "Rebranded to Kit. 35% price increase Oct 2025. Pricing scales with subscriber count."
  },
  "convex": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.convex.dev/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["Real-time sync", "TypeScript-native", "Vector search", "Core features"] },
      { name: "Professional", price: 25, period: "month per member", description: "Growing teams", features: ["Higher limits", "Priority support", "Preview deployments", "Enterprise security"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Advanced telemetry", "SSO", "Audit logs", "Custom SLA"] }
    ],
    notes: "Startup program: 1 year free Professional, 30% off usage up to $30k."
  },
  "coolify": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://coolify.io/pricing/",
    tiers: [
      { name: "Self-Hosted", price: 0, description: "Free forever", features: ["All features", "Unlimited servers", "No locked features", "Open source"] },
      { name: "Cloud", price: 5, period: "month base", description: "Managed by Coolify", features: ["2 servers included", "$3/additional server", "Managed updates", "Support"], highlighted: true }
    ],
    notes: "Self-hosted is 100% free. Cloud is bring-your-own-servers + management."
  },
  "coolors": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://coolors.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic access", features: ["5 colors per palette", "10 saved palettes", "Ads shown", "Basic tools"] },
      { name: "Pro", price: 3, period: "month", description: "Billed annually ($36/year)", features: ["10 colors per palette", "Unlimited palettes", "No ads", "AI features", "Pro profile"], highlighted: true }
    ],
    notes: "Monthly billing: $5/month. Pro unlocks across website, apps, and plugins."
  },
  "copper": {
    startingPrice: 9,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.copper.com/pricing",
    tiers: [
      { name: "Starter", price: 9, period: "month per seat", description: "Billed annually", features: ["Google Workspace integration", "1,000 contacts", "Basic pipeline", "Mobile apps"] },
      { name: "Basic", price: 23, period: "month per seat", description: "Billed annually", features: ["2,500 contacts", "Task automation", "Workflow automation"] },
      { name: "Professional", price: 59, period: "month per seat", description: "Billed annually", features: ["15,000 contacts", "Bulk emails", "Advanced reports"], highlighted: true },
      { name: "Business", price: 99, period: "month per seat", description: "Billed annually", features: ["Unlimited contacts", "Custom reports", "Premium support"] }
    ],
    notes: "Built for Google Workspace. Annual billing saves ~26%."
  },
  "couchdb": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://couchdb.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Apache 2.0", features: ["Document database", "Multi-master sync", "RESTful HTTP API", "Full features"] }
    ],
    notes: "Free Apache open-source database. Managed services available from providers like plusserver."
  },
  "couchbase": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://www.couchbase.com/pricing/",
    tiers: [
      { name: "Community", price: 0, description: "Up to 5 nodes", features: ["Free deployment", "Core features", "Community support"] },
      { name: "Capella", price: null, period: "usage-based", description: "Cloud DBaaS", features: ["Credit-based billing", "Auto-scaling", "Managed service"], highlighted: true },
      { name: "Enterprise Self-Hosted", price: 2499, period: "one-time + subscription", description: "On-premise", features: ["Full control", "Enterprise support", "All features"] }
    ],
    notes: "Capella: ~$0.07/GB backup + compute credits. Self-hosted from $0.32/hr/node."
  },
  "count": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://count.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Basic analytics", "Limited queries", "Community support"] },
      { name: "Team", price: null, period: "per user", description: "Teams", features: ["Unlimited queries", "Collaboration", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["SSO", "Custom integrations", "Dedicated support"] }
    ],
    notes: "Visual data analytics platform. Contact for team/enterprise pricing."
  },
  "countly": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://countly.com/pricing",
    tiers: [
      { name: "Lite", price: 0, description: "Open source", features: ["Up to 1,000 MAU", "20+ analytics tools", "Self-hosted option"] },
      { name: "Flex", price: 80, period: "month", description: "Starting at 2k MAU", features: ["MAU-based pricing", "Core analytics", "Add-on features"], highlighted: true },
      { name: "Enterprise", price: null, period: "data points based", description: "Large scale", features: ["Data point pricing", "Unlimited MAU", "Full compliance", "Dedicated support"] }
    ],
    notes: "Flex tiers: $80 (2k MAU) to $4,300 (160k MAU). Enterprise uses data point pricing."
  },
  "craft": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "year",
    hasFreeTrial: true,
    pricingPageUrl: "https://craftcms.com/pricing",
    tiers: [
      { name: "Solo", price: 0, description: "Personal projects", features: ["Single user", "Full CMS features", "Community support"] },
      { name: "Team", price: 299, period: "year", description: "Small teams", features: ["Up to 5 users", "All features", "1 year updates"] },
      { name: "Pro", price: 299, period: "year", description: "Professional", features: ["Unlimited users", "User permissions", "GraphQL API"], highlighted: true },
      { name: "Commerce", price: 999, period: "year", description: "E-commerce", features: ["Full e-commerce", "Subscriptions", "Multi-currency"] }
    ],
    notes: "Updates $99/year after first year. Commerce Pro also available."
  },
  "cronitor": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://cronitor.io/pricing",
    tiers: [
      { name: "Hacker", price: 0, description: "Free forever", features: ["5 monitors", "Email & Slack alerts", "1-month retention"] },
      { name: "Business", price: null, period: "usage-based", description: "$2/monitor + $5/user", features: ["Unlimited API requests", "12-month retention", "All integrations"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Custom quote", features: ["Custom limits", "SLA", "Priority support"] }
    ],
    notes: "Example: 300 jobs + 10 users = $650/month. No data volume fees."
  },
  "crossplane": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://www.crossplane.io/",
    tiers: [
      { name: "Open Source", price: 0, description: "Apache 2.0", features: ["Cloud-native control plane", "K8s-based", "Multi-cloud", "CNCF Graduated"] },
      { name: "UXP (Upbound)", price: 0, description: "Enterprise distro", features: ["Enterprise features", "Drop-in replacement", "Free open source"] },
      { name: "Upbound Commercial", price: null, period: "custom", description: "Enterprise support", features: ["Commercial support", "SLA", "Enterprise features"], highlighted: true }
    ],
    notes: "CNCF graduated project. Requires K8s cluster (adds infrastructure costs)."
  },
  "crowdstrike": {
    startingPrice: 59.99,
    currency: "USD",
    billingPeriod: "year",
    hasFreeTrial: true,
    freeTrialDays: 15,
    pricingPageUrl: "https://www.crowdstrike.com/en-us/pricing/",
    tiers: [
      { name: "Falcon Go", price: 59.99, period: "year per device", description: "Up to 100 devices", features: ["Next-gen AV", "Device control", "Basic protection"] },
      { name: "Falcon Pro", price: 99, period: "year per device", description: "Enterprise starting", features: ["NGAV", "Threat intelligence", "Ransomware protection"], highlighted: true },
      { name: "Falcon Enterprise", price: 184.99, period: "year per device", description: "Full protection", features: ["EDR", "Threat hunting", "Advanced analytics"] },
      { name: "Falcon Complete MDR", price: null, period: "custom", description: "Managed service", features: ["24/7 MDR", "Response team", "Full management"] }
    ],
    notes: "Annual billing. Multi-year discounts up to 10%. Enterprise ~$8k-$14k/year."
  },
  "crystallize": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://crystallize.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["Development access", "GraphQL API", "Basic features"] },
      { name: "Growth", price: 299, period: "month", description: "Starting at", features: ["Production use", "PIM features", "Subscriptions", "Support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large scale", features: ["Dedicated CSM", "SLA", "Custom consulting"] }
    ],
    notes: "Usage-based headless commerce. Complex product modeling & subscriptions."
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
