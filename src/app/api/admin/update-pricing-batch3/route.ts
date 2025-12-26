import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 3: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "ab-tasty": {
    startingPrice: 15000, currency: "EUR", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://www.abtasty.com/pricing/",
    tiers: [
      { name: "Custom", price: "Custom", description: "Traffic-based pricing", features: ["A/B testing", "Personalization", "Feature flags", "Complete analytics", "Unlimited experiments"], highlighted: true }
    ],
    notes: "Enterprise pricing, typically €15,000-€45,000/year depending on traffic"
  },
  "akamai": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.linode.com/pricing/",
    tiers: [
      { name: "Nanode", price: 5, period: "month", description: "Shared CPU", features: ["1 CPU", "1GB RAM", "25GB storage", "1TB transfer"] },
      { name: "Linode 2GB", price: 12, period: "month", description: "Shared CPU", features: ["1 CPU", "2GB RAM", "50GB storage", "2TB transfer"] },
      { name: "Dedicated 4GB", price: 36, period: "month", description: "Dedicated CPU", features: ["2 CPUs", "4GB RAM", "80GB storage", "4TB transfer"], highlighted: true },
      { name: "Enterprise CDN", price: "Custom", description: "Global CDN", features: ["Edge computing", "DDoS protection", "Web application firewall", "24/7 support"] }
    ]
  },
  "alibaba-cloud": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.alibabacloud.com/en/pricing",
    tiers: [
      { name: "Pay-As-You-Go", price: 0, description: "Usage-based", features: ["No upfront cost", "Pay for what you use", "Flexible scaling", "All services available"] },
      { name: "Subscription", price: "Varies", description: "Monthly/yearly", features: ["Up to 50% discount", "Reserved capacity", "Predictable billing"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Enterprise support", features: ["Dedicated support", "SLA guarantees", "Custom contracts"] }
    ]
  },
  "amazon-ses": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/ses/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "First 12 months", features: ["3,000 messages/month", "From EC2 hosted apps", "Standard features"] },
      { name: "Pay-As-You-Go", price: 0.10, period: "per 1,000 emails", description: "Standard sending", features: ["Unlimited emails", "$0.12/GB attachments", "Email tracking", "Dedicated IPs available"], highlighted: true },
      { name: "Dedicated IPs", price: 15, period: "month", description: "Per IP address", features: ["Better deliverability", "IP reputation control", "Managed warmup"] }
    ]
  },
  "ansible": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://www.redhat.com/en/technologies/management/ansible",
    tiers: [
      { name: "Community (AWX)", price: 0, description: "Open source", features: ["Core automation", "Playbook execution", "Inventory management", "Community support"] },
      { name: "Standard", price: 5000, period: "year", description: "Per 100 nodes", features: ["Red Hat support", "Certified content", "Automation controller", "Standard SLA"], highlighted: true },
      { name: "Premium", price: 14000, period: "year", description: "Per 100 nodes", features: ["24/7 support", "Premium SLA", "All features", "Dedicated TAM"] }
    ]
  },
  "apache-airflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://airflow.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full functionality", "Community support", "Self-managed infrastructure", "Apache license"] },
      { name: "AWS MWAA", price: 0.49, period: "hour", description: "Managed service", features: ["Fully managed", "Auto-scaling", "AWS integration", "Pay-as-you-go"], highlighted: true },
      { name: "Astronomer", price: 0.35, period: "hour", description: "Managed platform", features: ["Expert support", "Easy deployment", "Monitoring included", "Team features"] }
    ]
  },
  "apache-kafka": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.confluent.io/confluent-cloud/pricing/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full functionality", "Community support", "Self-managed", "Apache license"] },
      { name: "Confluent Standard", price: "Usage-based", description: "Cloud managed", features: ["Up to 1GBps", "500 partitions included", "Auto-scaling", "Basic support"], highlighted: true },
      { name: "Confluent Dedicated", price: "Custom", description: "Enterprise", features: ["Unlimited throughput", "Dedicated clusters", "Premium support", "60% lower TCO"] }
    ],
    notes: "Confluent Cloud typically €30,000-€60,000/year for enterprise"
  },
  "appcues": {
    startingPrice: 249, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.appcues.com/pricing",
    tiers: [
      { name: "Essentials", price: 249, period: "month", description: "For 2,500 MAU", features: ["Unlimited flows", "Basic analytics", "5 user segments", "Email support"] },
      { name: "Growth", price: 879, period: "month", description: "For 2,500 MAU", features: ["Onboarding checklists", "Advanced targeting", "Unlimited segments", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large organizations", features: ["Localization", "Unlimited licenses", "Dedicated CSM", "Custom integrations"] }
    ]
  },
  "appdynamics": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.appdynamics.com/pricing",
    tiers: [
      { name: "Infrastructure", price: 6, period: "month per core", description: "Basic monitoring", features: ["Server monitoring", "Cloud monitoring", "Network visibility", "Standard support"] },
      { name: "Premium", price: 33, period: "month per core", description: "Full APM", features: ["Application monitoring", "Database monitoring", "Code-level visibility", "All Infrastructure features"], highlighted: true },
      { name: "SAP Monitoring", price: 95, period: "month per core", description: "SAP edition", features: ["SAP performance", "Business monitoring", "All Premium features"] },
      { name: "RUM Add-on", price: 0.06, period: "per 1,000 tokens", description: "Real user monitoring", features: ["User experience", "Session replay", "Performance analytics"] }
    ]
  },
  "appsmith": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15, pricingPageUrl: "https://www.appsmith.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["Unlimited apps", "50+ integrations", "Git sync", "Community support"] },
      { name: "Business", price: 15, period: "month per user", description: "Growing teams", features: ["Workflows", "Custom roles", "Audit logs", "Email & chat support"], highlighted: true },
      { name: "Enterprise", price: 25, period: "month per user", description: "100+ users", features: ["SAML/OIDC", "SCIM provisioning", "Air-gapped deploy", "Dedicated support"] }
    ]
  },
  "appwrite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://appwrite.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Passion projects", features: ["2 projects", "500K reads/month", "250K writes/month", "Never paused"] },
      { name: "Pro", price: 25, period: "month per project", description: "Production apps", features: ["2TB bandwidth", "1.75M reads/month", "750K writes/month", "Email support"], highlighted: true },
      { name: "Scale", price: "Custom", description: "Growing businesses", features: ["Higher limits", "Priority support", "Advanced features", "SLA guarantee"] },
      { name: "Self-Hosted", price: 0, description: "Open source", features: ["No limits", "Full control", "Apache license", "Community support"] }
    ]
  },
  "attio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://attio.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 3 users", features: ["50,000 records", "250 workflow credits", "Core CRM features", "Community support"] },
      { name: "Plus", price: 29, period: "month per user", description: "Growing teams", features: ["No seat limits", "1,500 workflow credits", "Enhanced email", "Email support"], highlighted: true },
      { name: "Pro", price: 59, period: "month per user", description: "Scaling companies", features: ["10,000 workflow credits", "Email sequences", "Call intelligence", "Priority support"] },
      { name: "Enterprise", price: 119, period: "month per user", description: "Large organizations", features: ["Unlimited reporting", "SAML/SSO", "Advanced admin", "Dedicated support"] }
    ]
  },
  "argo-cd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://argoproj.github.io/cd/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["GitOps continuous delivery", "Kubernetes native", "Multi-cluster support", "Apache license"] },
      { name: "Akuity Platform", price: 99, period: "month per 10 apps", description: "Managed service", features: ["Fully managed", "Expert support", "Kargo stages", "5M AI tokens"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom deployment", features: ["Dedicated support", "Custom SLA", "Advanced security", "Training included"] }
    ]
  },
  "ashby": {
    startingPrice: 300, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.ashbyhq.com/pricing",
    tiers: [
      { name: "Foundations", price: 300, period: "month", description: "1-10 employees", features: ["ATS core features", "Scheduling", "Basic analytics", "Email support"] },
      { name: "Growth", price: "Custom", description: "Scaling teams", features: ["Advanced analytics", "Hiring manager seats", "All integrations", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large organizations", features: ["Dedicated implementation", "Custom workflows", "Advanced security", "Dedicated CSM"] }
    ],
    notes: "Typically $5-8 per employee per month"
  },
  "assemblyai": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.assemblyai.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "$50 credits", features: ["185 hours transcription", "333 hours streaming", "All core features", "Community support"] },
      { name: "Best", price: 0.37, period: "hour", description: "Highest accuracy", features: ["Premium transcription", "All languages", "Audio intelligence", "LeMUR access"], highlighted: true },
      { name: "Nano", price: 0.12, period: "hour", description: "Speed optimized", features: ["Fast processing", "Good accuracy", "Cost effective", "All features"] },
      { name: "Enterprise", price: "Custom", description: "High volume", features: ["Up to 50% discount", "Dedicated support", "Custom rate limits", "SLA guarantee"] }
    ]
  },
  "android-studio": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://developer.android.com/studio",
    tiers: [
      { name: "Free", price: 0, description: "Completely free", features: ["Full IDE features", "Android SDK", "Emulator", "Gemini AI assistant", "All updates included"], highlighted: true }
    ],
    notes: "Google Play Console costs $25 one-time to publish apps"
  },
  "apollo-graphql": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.apollographql.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Learning & prototyping", features: ["60 req/min limit", "1 day data retention", "All platform features", "No credit card needed"] },
      { name: "Standard", price: 2500, period: "month", description: "Production", features: ["250M requests/month", "Full data retention", "All features", "Standard support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Unlimited requests", "Federation support", "Premium support", "Custom contracts"] }
    ]
  },
  "appsflyer": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.appsflyer.com/pricing/",
    tiers: [
      { name: "Zero", price: 0, description: "Getting started", features: ["12K lifetime installs", "Core attribution", "Basic analytics", "30-day add-ons trial"] },
      { name: "Growth", price: 0.07, period: "per conversion", description: "Growing apps", features: ["12K free first year", "All ad networks", "Basic fraud protection", "Standard support"], highlighted: true },
      { name: "Enterprise", price: 0.03, period: "per conversion", description: "At scale", features: ["Volume discounts", "ROI360 Advanced", "Creative Premium", "Dedicated CSM"] }
    ]
  },
  "aqua-security": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://www.aquasec.com/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Non-production", features: ["Container scanning", "Kubernetes security", "Basic features", "Community support"] },
      { name: "Team", price: 10188, period: "year", description: "Small teams", features: ["Production use", "All scanning", "Compliance reports", "Standard support"], highlighted: true },
      { name: "Enterprise", price: 25188, period: "year", description: "Large organizations", features: ["Runtime protection", "Advanced policies", "Premium support", "Custom integrations"] }
    ],
    notes: "Also available on cloud marketplaces at $0.05-$0.33/node/hour"
  },
  "arangodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://arangodb.com/download-major/pricing/",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Multi-model database", "Graph, document, K/V", "AQL query language", "Apache 2 license"] },
      { name: "Enterprise", price: "Custom", description: "Self-managed", features: ["SmartGraphs", "360° encryption", "LDAP integration", "Enterprise support"], highlighted: true },
      { name: "Oasis", price: 0.20, period: "hour", description: "Managed cloud", features: ["Fully managed", "Auto-scaling", "All cloud providers", "24/7 support"] }
    ]
  },
  "ackee": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://ackee.electerious.com/",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Privacy-focused analytics", "No cookies", "Lightweight", "Open source MIT"], highlighted: true }
    ]
  },
  "any-do": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.any.do/premium/",
    tiers: [
      { name: "Free", price: 0, description: "Personal use", features: ["Basic tasks", "Daily planner", "Limited features", "Ads included"] },
      { name: "Premium", price: 5.99, period: "month", description: "Power users", features: ["Unlimited tasks", "Custom themes", "Location reminders", "Calendar sync"], highlighted: true },
      { name: "Teams", price: 4.99, period: "month per user", description: "Team collaboration", features: ["Shared projects", "Admin dashboard", "Team permissions", "Priority support"] }
    ]
  },
  "anytype": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://anytype.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Local-first", features: ["Unlimited objects", "1GB sync storage", "E2E encrypted", "Self-hosted option"] },
      { name: "Builder", price: 9, period: "month", description: "Power users", features: ["128GB sync storage", "Priority sync", "Early access features", "Email support"], highlighted: true },
      { name: "Co-Creator", price: 19, period: "month", description: "Collaboration", features: ["1TB sync storage", "Multiplayer spaces", "Priority support", "All features"] }
    ]
  },
  "architect": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://arc.codes/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Serverless framework", "AWS deployment", "Full functionality", "MIT license"], highlighted: true }
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
