import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Batch 8: 30 tools pricing data
const pricingData: Record<string, object> = {
  "onepassword-secrets": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://developer.1password.com/docs/connect/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "Up to 3 vault access credits", features: ["3 vault access credits", "Service accounts", "Connect servers"] },
      { name: "Usage-Based", price: null, period: "per credit", description: "Pay per vault access credit", features: ["Tiered pricing based on credits", "Monthly billing", "Pro-rated refunds"] }
    ],
    notes: "Vault access credits = access tokens × vaults accessed"
  },
  "chromatic": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.chromatic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["5,000 snapshots/month", "Unlimited Storybooks", "Unlimited collaborators", "Git & CI integration"] },
      { name: "Starter", price: 149, period: "month", description: "Small teams", features: ["25,000 snapshots/month", "Chrome testing", "Component version tracking"], highlighted: true },
      { name: "Pro", price: 349, period: "month", description: "Growing teams", features: ["50,000 snapshots/month", "Firefox testing", "Priority support"] },
      { name: "Enterprise", price: 649, period: "month", description: "Large orgs", features: ["100,000+ snapshots", "IE11 testing", "SSO", "Custom integrations"] }
    ]
  },
  "cinema-4d": {
    startingPrice: 59.91,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.maxon.net/en/buy",
    tiers: [
      { name: "Cinema 4D", price: 59.91, period: "month", description: "Billed annually ($719/year)", features: ["Full 3D modeling", "Animation tools", "Redshift GPU included", "Regular updates"], highlighted: true },
      { name: "Maxon One", price: 105.41, period: "month", description: "Complete suite", features: ["Cinema 4D + Redshift", "ZBrush", "Red Giant Complete", "Forger"] }
    ],
    notes: "Monthly billing available at $169/month for Maxon One"
  },
  "circle": {
    startingPrice: 49,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://circle.so/pricing",
    tiers: [
      { name: "Basic", price: 49, period: "month", description: "Getting started", features: ["Limited members", "Community features", "4% transaction fee"] },
      { name: "Professional", price: 99, period: "month", description: "Growing communities", features: ["Unlimited members", "Workflow automation", "2% transaction fee"], highlighted: true },
      { name: "Business", price: 199, period: "month", description: "Scaling", features: ["Custom profile fields", "Advanced analytics", "1% transaction fee"] },
      { name: "Enterprise", price: 399, period: "month", description: "Large communities", features: ["Priority support", "Custom integrations", "0.5% transaction fee"] }
    ]
  },
  "circleci": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://circleci.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Open source & hobby", features: ["6,000 build minutes/month", "30 jobs", "Linux & macOS"] },
      { name: "Performance", price: 15, period: "month", description: "Growing teams", features: ["Up to 80,000 credits/month", "All resource classes", "Docker layer caching"], highlighted: true },
      { name: "Scale", price: null, period: "custom", description: "Enterprise", features: ["Custom credits", "Dedicated support", "Self-hosted runners", "Audit logs"] }
    ],
    notes: "Credits-based pricing: 5-80 credits/min depending on resource class"
  },
  "clair": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingModel: "open-source",
    pricingPageUrl: "https://github.com/quay/clair",
    tiers: [
      { name: "Open Source", price: 0, description: "Apache 2.0 License", features: ["Container vulnerability scanning", "Multi-distro support", "49+ languages", "OCI & Docker support"] }
    ],
    notes: "Free open-source container vulnerability scanner. Commercial support available via Red Hat Quay."
  },
  "clari": {
    startingPrice: 100,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "quote-based",
    pricingPageUrl: "https://www.clari.com/",
    tiers: [
      { name: "Revenue Forecasting Essentials", price: 68, period: "month per user", description: "Core forecasting (~$820/year)", features: ["Pipeline management", "Forecasting", "Analytics"] },
      { name: "Revenue Forecasting Growth", price: 175, period: "month per user", description: "Advanced (~$2,105/year)", features: ["Advanced analytics", "AI insights", "Custom reporting"], highlighted: true },
      { name: "Full Platform", price: 310, period: "month per user", description: "With Copilot + Groove", features: ["Conversation intelligence", "Sales engagement", "Complete revenue platform"] }
    ],
    notes: "Quote-based pricing. Volume discounts at 75+, 150+, 300+ users."
  },
  "clearml": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://clear.ml/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Up to 3 users", "100GB storage", "1M API calls/month", "Experiment tracking"] },
      { name: "Pro", price: 15, period: "month per user", description: "Small teams", features: ["Up to 10 users", "120GB storage", "Cloud autoscaling", "Hyperparameter optimization"], highlighted: true },
      { name: "Scale", price: null, period: "custom", description: "Large teams", features: ["Unlimited users", "Advanced infrastructure", "Priority support"] },
      { name: "Enterprise", price: null, period: "custom", description: "Enterprise", features: ["On-premise deployment", "SSO/SAML", "Dedicated support"] }
    ]
  },
  "clearbit": {
    startingPrice: 45,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://www.hubspot.com/products/marketing/data-enrichment",
    tiers: [
      { name: "Breeze Starter", price: 45, period: "month", description: "100 credits/month", features: ["100 enrichment credits", "HubSpot Starter required", "Basic enrichment"] },
      { name: "Business", price: 1667, period: "month", description: "~$20,000/year", features: ["Higher credit volume", "API access", "Advanced enrichment"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Custom pricing", features: ["Custom credits", "Dedicated support", "Custom integrations"] }
    ],
    notes: "Now Breeze Intelligence by HubSpot. Requires HubSpot subscription. Credits don't roll over."
  },
  "clearscope": {
    startingPrice: 189,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.clearscope.io/pricing",
    tiers: [
      { name: "Essentials", price: 189, period: "month", description: "Getting started", features: ["100 content inventory pages", "50 keyword discoveries", "Unlimited users", "AI content outlines"] },
      { name: "Business", price: 399, period: "month", description: "Growing teams", features: ["300 content inventory pages", "Dedicated account manager", "Priority support"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large organizations", features: ["Custom page limits", "SSO", "Crawler whitelisting", "Custom integrations"] }
    ],
    notes: "No free trial. Additional pages at $15-25 per 100 pages."
  },
  "clickhouse": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://clickhouse.com/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Development workloads", features: ["1 replica", "8 GiB RAM", "2 vCPU", "Pay-as-you-go compute"] },
      { name: "Scale", price: null, period: "usage-based", description: "Production workloads", features: ["Multiple replicas", "Independent scaling", "Advanced features"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "High compliance needs", features: ["Custom SLA", "Disaster recovery", "Hardware control"] }
    ],
    notes: "Open source is free. Cloud pricing: compute per minute + ~$25/TiB storage."
  },
  "clicky": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 21,
    pricingPageUrl: "https://clicky.com/help/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 website", features: ["Up to 3,000 daily page views", "Basic analytics", "Real-time data"] },
      { name: "Pro", price: 9.99, period: "month", description: "10 websites", features: ["Up to 10,000 daily views", "All analytics features", "API access"] },
      { name: "Pro Plus", price: 14.99, period: "month", description: "10 websites", features: ["Heatmaps", "Uptime monitoring", "Advanced features"], highlighted: true },
      { name: "Pro Platinum", price: 19.99, period: "month", description: "30 websites", features: ["Up to 10,000 daily views/site", "All features", "Priority support"] }
    ],
    notes: "Annual billing saves ~20%. Custom pricing for 1M+ daily page views."
  },
  "clio": {
    startingPrice: 39,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 7,
    pricingPageUrl: "https://www.clio.com/pricing/",
    tiers: [
      { name: "EasyStart", price: 39, period: "month per user", description: "Billed annually ($49 monthly)", features: ["Basic case management", "Time tracking", "Client intake"] },
      { name: "Essentials", price: 89, period: "month per user", description: "Core features", features: ["All EasyStart features", "Billing & payments", "Document management"], highlighted: true },
      { name: "Advanced", price: 129, period: "month per user", description: "Growing firms", features: ["All Essentials", "Custom fields", "Advanced reporting"] },
      { name: "Complete", price: 159, period: "month per user", description: "Full suite", features: ["All Advanced", "Clio Grow CRM", "Client portal"] }
    ],
    notes: "Bundle discounts available (15%+ off). Separate add-ons for Accounting, Draft, and AI features."
  },
  "clip-studio-paint": {
    startingPrice: 0.99,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.clipstudio.net/en/purchase/",
    tiers: [
      { name: "PRO Monthly", price: 4.99, period: "month", description: "Single device", features: ["Illustration tools", "Comic tools", "Animation (24 frames)", "All platforms"] },
      { name: "PRO Perpetual", price: 49.99, period: "one-time", description: "Own forever", features: ["All PRO features", "One-time purchase", "Optional Update Pass"], highlighted: true },
      { name: "EX Perpetual", price: 219, period: "one-time", description: "Professional", features: ["Multi-page management", "Unlimited animation", "3D tools", "Team features"] }
    ],
    notes: "Annual plans available. PRO: $26.99/year. EX: $76.99/year. Frequent sales (50% off)."
  },
  "clipdrop": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://clipdrop.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic usage", features: ["100 uses/day per feature", "Stable Diffusion XL (watermark)", "Background removal", "Image upscaler x2"] },
      { name: "Pro", price: 9, period: "month", description: "Billed annually", features: ["1,500 SDXL uses/day", "1,000 HD tool uses/day", "No watermarks", "Skip queue"], highlighted: true }
    ],
    notes: "API available with credit-based pricing. Now owned by Jasper.ai."
  },
  "clockify": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 7,
    pricingPageUrl: "https://clockify.me/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited users", features: ["Time tracking", "Unlimited projects", "Reports", "Apps & integrations"] },
      { name: "Basic", price: 3.99, period: "month per user", description: "Billed annually", features: ["Time audit", "Kiosk", "Add time for others", "Admin controls"] },
      { name: "Standard", price: 5.49, period: "month per user", description: "Billed annually", features: ["Time off tracking", "Invoicing", "Scheduling", "Forecasting"], highlighted: true },
      { name: "Pro", price: 7.99, period: "month per user", description: "Billed annually", features: ["GPS tracking", "Screenshots", "Labor costs", "Budget alerts"] },
      { name: "Enterprise", price: 11.99, period: "month per user", description: "Billed annually", features: ["SSO/SAML", "Custom subdomain", "Audit log", "Priority support"] }
    ]
  },
  "clockwise": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.getclockwise.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "Core features", features: ["Focus time protection", "Meeting scheduling", "Calendar analytics", "Slack integration"] },
      { name: "Teams", price: 6.75, period: "month per user", description: "Billed annually", features: ["Flexible meetings", "Automatic focus time", "Team scheduling links"], highlighted: true },
      { name: "Business", price: 11.5, period: "month per user", description: "Billed annually", features: ["Admin controls", "Custom contracts", "Priority support"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["SSO/SCIM", "Custom invoicing", "Centralized provisioning"] }
    ],
    notes: "Volume discounts: 10% at 250 users, up to 25% at 1000+ users. Nonprofit discounts available."
  },
  "close": {
    startingPrice: 9,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.close.com/pricing",
    tiers: [
      { name: "Solo", price: 9, period: "month per user", description: "Billed annually ($19 monthly)", features: ["Core CRM", "Lead limits", "Basic outreach", "Built-in calling"] },
      { name: "Essentials", price: 35, period: "month per user", description: "Billed annually ($49 monthly)", features: ["Unlimited contacts/leads", "Email sequences", "Pipelines"], highlighted: true },
      { name: "Growth", price: 99, period: "month per user", description: "Billed annually ($109 monthly)", features: ["Workflow automation", "Power Dialer", "AI tools", "Call coaching"] },
      { name: "Scale", price: 139, period: "month per user", description: "Billed annually ($149 monthly)", features: ["25 pipelines", "Predictive dialing", "SSO/2FA", "Dedicated success manager"] }
    ],
    notes: "Annual billing saves ~35%. Additional organizations at $50/month."
  },
  "cloudflare-dns": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.cloudflare.com/plans/",
    tiers: [
      { name: "Free", price: 0, description: "Personal sites", features: ["Free DNS hosting", "Free SSL", "DDoS protection", "CDN caching"] },
      { name: "Pro", price: 20, period: "month", description: "Professional", features: ["Enhanced security", "Image optimization", "Mobile optimization"], highlighted: true },
      { name: "Business", price: 200, period: "month", description: "E-commerce", features: ["100% uptime SLA", "Custom SSL", "WAF rulesets"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large companies", features: ["24/7 support", "Custom solutions", "Dedicated team"] }
    ],
    notes: "DNS is free. Domain registration at cost (~$9.77/year for .com)."
  },
  "cloudflare-stream": {
    startingPrice: 5,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://developers.cloudflare.com/stream/pricing/",
    tiers: [
      { name: "Pay-as-you-go", price: 5, period: "month", description: "1,000 min storage", features: ["$5 per 1,000 min stored", "$1 per 1,000 min delivered", "No encoding fees", "No bandwidth fees"], highlighted: true },
      { name: "Starter Bundle", price: 10, period: "month", description: "5,000 minutes", features: ["5,000 min included", "$1 per 1,000 additional", "AI captions included"] }
    ],
    notes: "Pro/Business plans include 100 free storage min + 10,000 delivery min. Volume pricing available."
  },
  "cloudflare-workers": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://workers.cloudflare.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["100,000 requests/day", "10ms CPU time", "Workers KV included", "Static assets free"] },
      { name: "Paid", price: 5, period: "month", description: "Production", features: ["10M requests/month included", "30s CPU time", "Durable Objects", "No egress fees"], highlighted: true },
      { name: "Workers for Platforms", price: 25, period: "month", description: "Multi-tenant apps", features: ["Dispatch workers", "Custom subdomains", "Usage isolation"] }
    ],
    notes: "Pay for CPU time only, not I/O wait time. Workers AI at $0.011/1,000 Neurons."
  },
  "cloudinary": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://cloudinary.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["25 credits/month", "100MB video limit", "Basic transformations"] },
      { name: "Plus", price: 99, period: "month", description: "Growing teams", features: ["225 credits/month", "2GB video limit", "Advanced optimization"], highlighted: true },
      { name: "Advanced", price: 249, period: "month", description: "Scaling", features: ["600 credits/month", "40GB video limit", "Multi-CDN"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Custom credits", "SLA", "Dedicated support"] }
    ],
    notes: "DAM features available. Media Optimizer starts at $49/month."
  },
  "cockroachdb": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingModel: "usage-based",
    pricingPageUrl: "https://www.cockroachlabs.com/pricing/",
    tiers: [
      { name: "Basic (Free)", price: 0, description: "Development", features: ["50M request units/month", "10 GiB storage free", "Serverless", "Auto-scales to zero"] },
      { name: "Standard", price: null, period: "usage-based", description: "Production", features: ["Pay-as-you-go", "Multi-region", "99.9% SLA"], highlighted: true },
      { name: "Advanced", price: null, period: "usage-based", description: "Mission-critical", features: ["Unlimited vCPU scaling", "99.999% SLA", "Enterprise security"] },
      { name: "Enterprise Self-Hosted", price: null, period: "annual subscription", description: "On-premise", features: ["Full control", "Dedicated support", "Custom SLA"] }
    ],
    notes: "Open source edition available. Cloud pricing changed Dec 2024: unbundled data transfer, backups, CDC."
  },
  "coda": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://coda.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["Unlimited docs", "1GB storage/doc", "Coda AI trial", "Collaborative editing"] },
      { name: "Pro", price: 10, period: "month per Doc Maker", description: "Billed annually", features: ["Unlimited doc size", "30-day version history", "Custom domains", "Pro Packs"], highlighted: true },
      { name: "Team", price: 30, period: "month per Doc Maker", description: "Billed annually", features: ["Unlimited automations", "Folder access", "Cross-doc syncing", "Group training"] },
      { name: "Enterprise", price: null, period: "custom", description: "Starts ~$12,000/year", features: ["SSO/SAML", "Advanced security", "Admin controls", "Dedicated support"] }
    ],
    notes: "Only Doc Makers pay - Editors and Viewers are free."
  },
  "codacy": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.codacy.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Public repos", "Basic code analysis", "GitHub/GitLab/Bitbucket"] },
      { name: "Pro", price: 18, period: "month per user", description: "Teams", features: ["Private repos", "49 languages", "Security scanning", "Integrations"], highlighted: true },
      { name: "Enterprise", price: 40, period: "month per user", description: "Large orgs", features: ["SSO/SAML", "On-premise option", "Priority support", "Custom rules"] }
    ],
    notes: "Per-seat licensing for active Git contributors. On-prem ~2.5x cloud pricing."
  },
  "codeclimate": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://codeclimate.com/quality/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Public repos", "Basic analysis", "Community support"] },
      { name: "Team", price: 16.67, period: "month", description: "Small teams", features: ["Private repos", "Quality metrics", "Test coverage"], highlighted: true },
      { name: "Enterprise", price: null, period: "custom", description: "Large orgs", features: ["Self-hosted option", "SSO", "Priority support"] }
    ],
    notes: "Velocity analytics: $449-649/year for startups/companies. Enterprise often $96k+/year."
  },
  "codesandbox": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://codesandbox.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free forever", features: ["Unlimited public sandboxes", "400 VM credits/month", "Devboxes", "Repositories"] },
      { name: "Pro", price: 9, period: "month", description: "Billed annually ($12 monthly)", features: ["Private sandboxes", "4,000 VM credits/month", "6GB RAM VMs"], highlighted: true },
      { name: "Builder", price: 119, period: "month", description: "Heavy usage", features: ["40,000 VM credits/month", "16GB RAM VMs", "Priority support"] }
    ],
    notes: "VM credits: $0.015 each. Educational/OSS discounts available."
  },
  "codefresh": {
    startingPrice: 99,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 45,
    pricingPageUrl: "https://codefresh.io/pricing/",
    tiers: [
      { name: "GitOps Professional", price: 347.5, period: "month", description: "~$4,170/year", features: ["5 runtimes/clusters", "200 Argo CD apps", "4,500 K8s resources"], highlighted: true },
      { name: "Additional Clusters", price: 125, period: "month per cluster", description: "$1,500/year", features: ["Add destination clusters"] },
      { name: "Additional Apps", price: 125, period: "month per 100 apps", description: "$1,500/year", features: ["Beyond 200 apps"] },
      { name: "Enterprise", price: null, period: "custom", description: "Large scale", features: ["Unlimited resources", "Dedicated support", "Custom SLAs"] }
    ],
    notes: "Median enterprise spend ~$49k/year. Classic CI/CD from $99/month."
  },
  "clutch": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "year",
    hasFreeTrial: false,
    pricingModel: "listing-based",
    pricingPageUrl: "https://clutch.co/",
    tiers: [
      { name: "Free Listing", price: 0, description: "Basic presence", features: ["Company profile", "Client reviews", "Search visibility"] },
      { name: "Clutch Plus", price: 1500, period: "year", description: "Enhanced visibility", features: ["Verified badge", "Priority ranking", "Analytics dashboard"], highlighted: true },
      { name: "Clutch Sponsor", price: 1800, period: "year+", description: "Premium placement", features: ["Sponsored listings", "Category leadership", "Lead generation"] }
    ],
    notes: "Free for buyers searching for agencies. Pricing is for service providers/agencies listing."
  },
  "coschedule": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://coschedule.com/pricing",
    tiers: [
      { name: "Free Calendar", price: 0, description: "Individuals", features: ["1 social profile", "15 scheduled messages", "Basic calendar"] },
      { name: "Social Calendar", price: 29, period: "month per user", description: "Social publishing", features: ["3 social profiles", "Unlimited scheduling", "Best time scheduling"], highlighted: true },
      { name: "Content Calendar", price: 39, period: "month per user", description: "Team content", features: ["5 social profiles", "Approval workflows", "Custom views"] },
      { name: "Marketing Suite Growth", price: 190, period: "month", description: "Full platform", features: ["All calendars", "Asset organizer", "Work organizer"] }
    ],
    notes: "Annual billing saves 20%. Nonprofit discount 30% off. X/Twitter profiles billed separately."
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
