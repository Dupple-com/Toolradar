import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 7: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "cal-com": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://cal.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited calendars", "Unlimited events", "Workflow automation", "Stripe payments"] },
      { name: "Teams", price: 15, period: "month per user", description: "Small teams", features: ["Round-robin", "Routing forms", "Insights", "Team features"], highlighted: true },
      { name: "Organizations", price: 37, period: "month per user", description: "Large teams", features: ["SSO/SAML", "SCIM", "HIPAA/SOC 2", "Advanced controls"] },
      { name: "Enterprise", price: "Custom", description: "Custom", features: ["Self-hosting", "API access", "Dedicated support", "Custom contracts"] }
    ],
    notes: "Open source. Self-hosting available free"
  },
  "chargebee": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.chargebee.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "Up to $250K billing", features: ["Core billing", "Payment gateways", "Basic features", "0.75% overage after"] },
      { name: "Performance", price: 599, period: "month", description: "Up to $100K/mo", features: ["Consolidated invoicing", "Smart dunning", "Custom domain", "0.75% overage"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large scale", features: ["Multi-entity", "Custom API limits", "Account hierarchies", "Custom terms"] }
    ],
    notes: "Annual commitment required for Performance. RevRec and Retention add-ons available"
  },
  "chatwoot": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15, pricingPageUrl: "https://www.chatwoot.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["MIT license", "All core features", "Community support", "Unlimited agents"] },
      { name: "Premium Support", price: 19, period: "month per agent", description: "Self-hosted", features: ["Custom branding", "Priority email", "All features"], highlighted: true },
      { name: "Enterprise", price: 99, period: "month per agent", description: "Enterprise", features: ["Dedicated manager", "Phone support", "Advanced security", "SLA"] }
    ],
    notes: "Cloud version also available. Open source alternative to Intercom"
  },
  "checkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.checklyhq.com/pricing/",
    tiers: [
      { name: "Hobby", price: 0, description: "Small projects", features: ["Basic monitoring", "Core alerting", "Community support"] },
      { name: "Team", price: 0.80, period: "per 10K checks", description: "Teams", features: ["Private locations", "Visual testing", "Slack/Teams alerts", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Scale", features: ["SSO/SAML", "Custom SLA", "Dedicated support", "Advanced MaC"] }
    ],
    notes: "Playwright-based synthetic monitoring"
  },
  "bunnycdn": {
    startingPrice: 0.01, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://bunny.net/pricing/",
    tiers: [
      { name: "Standard", price: 0.01, period: "per GB", description: "Pay-as-you-go", features: ["119+ edge locations", "25ms latency", "DDoS protection", "No minimum"], highlighted: true },
      { name: "High Volume", price: 0.005, period: "per GB", description: "Enterprise", features: ["Lower rates", "Priority support", "Custom features", "SLA guarantee"] }
    ],
    notes: "1/4 cost of competitors. Regional pricing varies"
  },
  "burp-suite": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://portswigger.net/burp",
    tiers: [
      { name: "Community", price: 0, description: "Learning", features: ["Manual testing", "Core tools", "Basic features", "Community support"] },
      { name: "Professional", price: 475, period: "year", description: "Professionals", features: ["Full scanner", "All tools", "Extensions", "Support"], highlighted: true },
      { name: "Enterprise", price: 6040, period: "year", description: "Teams", features: ["CI/CD integration", "Unlimited users", "DAST", "Up to $49,999/yr"] }
    ],
    notes: "Price increase effective March 2025"
  },
  "caddy": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://caddyserver.com/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Automatic HTTPS", "HTTP/3", "Reverse proxy", "No enterprise paywall"], highlighted: true }
    ],
    notes: "Sponsorship-based funding. No licensing fees"
  },
  "chroma": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.trychroma.com/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Vector database", "Full-text search", "AI embeddings", "Python-native"] },
      { name: "Cloud", price: 0, description: "$5 free credits", features: ["Serverless", "Auto-scaling", "Managed", "Fast queries"], highlighted: true }
    ],
    notes: "2025 Rust-core rewrite: 4x faster"
  },
  "carrd": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://carrd.co",
    tiers: [
      { name: "Free", price: 0, description: "1 site", features: ["carrd.co subdomain", "Basic templates", "50 components", "Branding"] },
      { name: "Pro Lite", price: 9, period: "year", description: "3 sites", features: ["No branding", "Premium templates", "More components"] },
      { name: "Pro Standard", price: 19, period: "year", description: "10 sites", features: ["Custom domains", "Forms", "Email collection"], highlighted: true },
      { name: "Pro Plus", price: 49, period: "year", description: "25 sites", features: ["Code export", "Redirects", "Advanced features"] }
    ],
    notes: "Scales to 1000 sites. 10x cheaper than competitors"
  },
  "buttondown": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://buttondown.email/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 100 subs", features: ["100 subscribers", "Unlimited emails", "RSS import", "Core features"] },
      { name: "Basic", price: 9, period: "month", description: "1,000 subs", features: ["Custom domain", "API access", "Zapier", "No branding"], highlighted: true },
      { name: "Professional", price: 29, period: "month", description: "5,000 subs", features: ["Team members", "Surveys", "Advanced analytics"] },
      { name: "Enterprise", price: 79, period: "month", description: "10,000+ subs", features: ["Priority support", "Custom integrations", "SLA"] }
    ]
  },
  "cabin": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://withcabin.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small sites", features: ["Basic analytics", "Privacy-focused", "No cookies", "Core features"] },
      { name: "Pro", price: 19, period: "month", description: "Growing sites", features: ["More pageviews", "Team access", "Priority support"], highlighted: true }
    ],
    notes: "Privacy-first, carbon-aware analytics"
  },
  "cachet": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://cachethq.io/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Status page", "Incidents", "Metrics", "Self-hosted"], highlighted: true }
    ],
    notes: "Open source status page. Laravel-based"
  },
  "calibre": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15, pricingPageUrl: "https://calibreapp.com/pricing",
    tiers: [
      { name: "Starter", price: 50, period: "month", description: "Small teams", features: ["Performance monitoring", "Core Web Vitals", "Alerts", "Basic features"] },
      { name: "Team", price: 150, period: "month", description: "Teams", features: ["More tests", "API access", "Integrations", "Priority support"], highlighted: true },
      { name: "Business", price: 350, period: "month", description: "Large teams", features: ["Unlimited tests", "SSO", "SLA", "Dedicated support"] }
    ]
  },
  "capacities": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://capacities.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited notes", "Core features", "Mobile apps", "Community"] },
      { name: "Pro", price: 8, period: "month", description: "Power users", features: ["AI features", "Priority support", "Early access", "More storage"], highlighted: true }
    ],
    notes: "Object-based note-taking"
  },
  "carbon-black": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://www.vmware.com/products/carbon-black.html",
    tiers: [
      { name: "Cloud", price: "Custom", description: "Cloud-native", features: ["Endpoint protection", "EDR", "NGAV", "Cloud workload"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "On-premise", features: ["Full control", "Custom deploy", "Advanced features", "Support"] }
    ],
    notes: "VMware product. Contact sales for pricing"
  },
  "cargo": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://doc.rust-lang.org/cargo/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Rust package manager", "Build system", "crates.io", "MIT/Apache 2.0"], highlighted: true }
    ]
  },
  "carta": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://carta.com/pricing/",
    tiers: [
      { name: "Launch", price: 0, description: "Startups", features: ["Cap table", "Up to 25 stakeholders", "409A basic", "Core features"] },
      { name: "Starter", price: 299, period: "month", description: "Growing", features: ["More stakeholders", "Full 409A", "Scenario modeling"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Scaling", features: ["Unlimited stakeholders", "Advanced features", "Integrations"] },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["Custom terms", "Dedicated support", "API access"] }
    ]
  },
  "cassandra": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://cassandra.apache.org/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["NoSQL database", "High availability", "Linear scale", "Apache license"], highlighted: true }
    ],
    notes: "Commercial support from DataStax"
  },
  "cdktf": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://developer.hashicorp.com/terraform/cdktf",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["IaC with code", "TypeScript/Python/Go", "Terraform backend", "MPL 2.0"], highlighted: true }
    ],
    notes: "Part of Terraform ecosystem. Cloud tiers available"
  },
  "cdnjs": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://cdnjs.com/",
    tiers: [
      { name: "Free", price: 0, description: "Public CDN", features: ["Free JS libraries", "Cloudflare-backed", "Global edge", "No signup"], highlighted: true }
    ]
  },
  "cert-manager": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://cert-manager.io/",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["K8s certificates", "Let's Encrypt", "Auto-renewal", "Apache 2.0"], highlighted: true }
    ],
    notes: "CNCF project. Enterprise support from Jetstack"
  },
  "certbot": {
    startingPrice: 0, currency: "USD", billingPeriod: "free", hasFreeTrial: false, pricingPageUrl: "https://certbot.eff.org/",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Let's Encrypt client", "Auto-renewal", "All platforms", "EFF project"], highlighted: true }
    ]
  },
  "chameleon": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.chameleon.io/pricing",
    tiers: [
      { name: "Startup", price: 279, period: "month", description: "2,000 MAUs", features: ["Tours", "Tooltips", "Basic analytics", "Core features"] },
      { name: "Growth", price: 899, period: "month", description: "10,000 MAUs", features: ["Surveys", "Launchers", "Integrations", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Unlimited", features: ["SSO", "Dedicated CSM", "Custom contracts", "SLA"] }
    ]
  },
  "chanty": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.chanty.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Small teams", features: ["Up to 5 users", "Unlimited messages", "Voice calls", "Core features"] },
      { name: "Business", price: 4, period: "month per user", description: "Growing teams", features: ["Unlimited users", "Video calls", "Task management", "Integrations"], highlighted: true }
    ]
  },
  "charthop": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.charthop.com/pricing",
    tiers: [
      { name: "Core", price: 8, period: "month per employee", description: "Org charts", features: ["Org charts", "Directory", "Basic analytics", "Integrations"], highlighted: true },
      { name: "Pro", price: 16, period: "month per employee", description: "Advanced", features: ["Comp planning", "Performance", "Workforce planning"] },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["SSO", "Advanced security", "Custom support"] }
    ]
  },
  "checkmarx": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://checkmarx.com/",
    tiers: [
      { name: "One", price: "Custom", description: "AppSec platform", features: ["SAST", "SCA", "IaC Security", "API Security"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large orgs", features: ["All features", "On-premise", "Priority support", "Custom SLA"] }
    ],
    notes: "Contact sales for pricing. Enterprise SAST leader"
  },
  "chef": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true, pricingPageUrl: "https://www.chef.io/products/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Community", features: ["Core Chef", "Community support", "Basic features"] },
      { name: "Enterprise", price: "Custom", description: "Enterprise", features: ["All products", "Premium support", "Compliance", "SLA"], highlighted: true }
    ],
    notes: "Progress Software product"
  },
  "chili-piper": {
    startingPrice: 30, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.chilipiper.com/pricing",
    tiers: [
      { name: "Instant Booker", price: 30, period: "month per user", description: "Basic scheduling", features: ["1-click booking", "Calendar sync", "Email integration"] },
      { name: "Concierge", price: 50, period: "month per user", description: "Inbound routing", features: ["Form routing", "Round-robin", "Handoff"], highlighted: true },
      { name: "Distro", price: 50, period: "month per user", description: "Lead routing", features: ["Lead distribution", "CRM sync", "Analytics"] }
    ]
  },
  "amazon-neptune": {
    startingPrice: 0.1, currency: "USD", billingPeriod: "hour", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/neptune/pricing/",
    tiers: [
      { name: "On-Demand", price: 0.10, period: "per db.r5.large hour", description: "Pay-as-you-go", features: ["Graph database", "Auto-scaling", "High availability", "All features"], highlighted: true },
      { name: "Serverless", price: "Usage-based", description: "Auto-scaling", features: ["NCU-based pricing", "Scale to zero", "No capacity planning"] }
    ]
  },
  "bunny-stream": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://bunny.net/stream/",
    tiers: [
      { name: "Pay-As-You-Go", price: 0, description: "Usage-based", features: ["$0.005/min encoding", "$0.01/GB delivery", "Adaptive streaming", "No minimum"], highlighted: true }
    ],
    notes: "Part of bunny.net. 14-day free trial"
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
