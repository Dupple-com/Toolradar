import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Verified pricing from WebFetch on actual pricing pages (December 2025)
const verifiedPricing: Record<string, object> = {
  // Better Stack - https://betterstack.com/pricing
  "better-stack": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://betterstack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["10 monitors & heartbeats", "1 status page", "Slack & email alerts", "100,000 exceptions/month", "3 GB logs (3-day retention)"] },
      { name: "Responder", price: 29, period: "month", description: "Annual billing", features: ["Unlimited phone/SMS alerts", "Uptime monitoring", "Incident management", "Single responder"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom deployment", features: ["SAML SSO", "Dedicated deployments", "Advanced features"] }
    ],
    notes: "Telemetry bundles available: Nano $25/mo, Micro $100/mo, Mega $210/mo, Tera $420/mo"
  },

  // Calendly - https://www.calendly.com/pricing
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["1 event type", "1 calendar connection", "Video conferencing", "Mobile apps"] },
      { name: "Standard", price: 10, period: "month per seat", description: "Billed yearly ($12 monthly)", features: ["Unlimited event types", "6 calendar connections", "Stripe/PayPal payments", "Automated reminders"], highlighted: true },
      { name: "Teams", price: 16, period: "month per seat", description: "Billed yearly ($20 monthly)", features: ["Salesforce integration", "Round-robin meetings", "Lead qualification/routing", "Advanced admin"] },
      { name: "Enterprise", price: 15000, period: "year", description: "Starting price", features: ["SAML SSO", "Audit logs", "Domain control", "Dedicated support"] }
    ]
  },

  // Chameleon - https://www.chameleon.io/pricing
  "chameleon": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.chameleon.io/pricing",
    tiers: [
      { name: "Demos Free", price: 0, description: "Interactive demos", features: ["Unlimited Interactive Demos", "CTAs & email capture", "Engagement tracking"] },
      { name: "Startup", price: 279, period: "month", description: "Scales with MTUs", features: ["Unlimited Tours & Tooltips", "5 Microsurveys", "1 Launcher", "Custom CSS"], highlighted: true },
      { name: "Growth", price: 12000, period: "year", description: "Growing teams", features: ["All Experiences Unlimited", "A/B Testing", "Rate Limiting", "Customer Success support"] },
      { name: "Enterprise", price: "Custom", description: "Large organizations", features: ["Unlimited Seats", "Roles & Permissions", "Localization", "Account-switching"] }
    ]
  },

  // Chargebee - https://www.chargebee.com/pricing/
  "chargebee": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://www.chargebee.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "First $250K billing free", features: ["0.75% on billing after $250K", "Flexible billing", "Checkout", "35+ payment gateways"] },
      { name: "Performance", price: 7188, period: "year", description: "Up to $100K billing/month", features: ["Advance invoices", "Smart dunning", "Migration support", "Engineering consultation"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large organizations", features: ["Multi-entity support", "Account hierarchy", "On-demand discounting", "Contract terms"] }
    ]
  },

  // CircleCI - https://circleci.com/pricing/
  "circleci": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://circleci.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["6,000 build minutes", "Up to 5 active users", "30x concurrency", "Multiple environments"] },
      { name: "Performance", price: 15, period: "month", description: "Starting price", features: ["30,000 free credits/month", "5 included users", "80x concurrency", "Bulk credit discounts"], highlighted: true },
      { name: "Scale", price: "Custom", description: "Annual billing", features: ["Custom plans", "Enterprise controls", "GPU access", "24/7 support option"] }
    ]
  },

  // ClickUp - https://www.clickup.com/pricing
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.clickup.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "For personal use", features: ["60MB storage", "Unlimited tasks", "Collaborative docs", "24/7 support"] },
      { name: "Unlimited", price: 7, period: "month per user", description: "Billed yearly", features: ["Unlimited storage", "Unlimited integrations", "Gantt charts", "Goals & portfolios"], highlighted: true },
      { name: "Business", price: 12, period: "month per user", description: "Popular", features: ["Google SSO", "Unlimited dashboards", "Advanced automation", "Workload management"] },
      { name: "Enterprise", price: "Custom", description: "For large teams", features: ["White labeling", "Advanced permissions", "HIPAA available", "Dedicated CSM"] }
    ]
  },

  // Close CRM - https://www.close.com/pricing
  "close": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.close.com/pricing",
    tiers: [
      { name: "Solo", price: 9, period: "month", description: "Annual ($19 monthly)", features: ["1 user only", "Up to 10k leads", "Core CRM features"] },
      { name: "Essentials", price: 35, period: "month", description: "Annual ($49 monthly)", features: ["Unlimited contacts", "Multiple pipelines", "Built-in calling & SMS"] },
      { name: "Growth", price: 99, period: "month", description: "Annual ($109 monthly)", features: ["Automated workflows", "Power Dialer", "AI Email Assistant"], highlighted: true },
      { name: "Scale", price: 139, period: "month", description: "Annual ($149 monthly)", features: ["Role-based access", "Predictive Dialer", "Unlimited call recording"] }
    ]
  },

  // Contentful - https://www.contentful.com/pricing/
  "contentful": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.contentful.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["10 users", "2 roles", "100K API calls/month", "50 GB CDN bandwidth"] },
      { name: "Lite", price: 300, period: "month", description: "For small teams", features: ["20 users", "3 roles", "1M API calls/month", "100 GB CDN bandwidth"], highlighted: true },
      { name: "Premium", price: "Custom", description: "For enterprises", features: ["Custom users/roles", "Unlimited API calls", "99.99% uptime SLA", "Dedicated CSM"] }
    ]
  },

  // Kit (ConvertKit) - https://kit.com/pricing
  "convertkit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://kit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "Free forever", features: ["Up to 10,000 subscribers", "1 basic automation", "Unlimited landing pages", "Audience tagging"] },
      { name: "Creator", price: 33, period: "month", description: "Annual $390/year", features: ["Unlimited automations", "2 users", "Remove branding", "100+ integrations"], highlighted: true },
      { name: "Pro", price: 66, period: "month", description: "Annual $790/year", features: ["Unlimited users", "Advanced A/B testing", "Referral system", "Deliverability reporting"] }
    ]
  },

  // Copper CRM - https://www.copper.com/pricing
  "copper": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.copper.com/pricing",
    tiers: [
      { name: "Starter", price: 9, period: "month", description: "Annual ($12 monthly)", features: ["1,000 contacts", "Google Workspace integration", "Tasks", "Mobile apps"] },
      { name: "Basic", price: 23, period: "month", description: "Annual ($29 monthly)", features: ["2,500 contacts", "Sales pipelines", "Workflow automation"], highlighted: true },
      { name: "Professional", price: 59, period: "month", description: "Annual ($69 monthly)", features: ["15,000 contacts", "Bulk email", "Custom integrations"] },
      { name: "Business", price: 99, period: "month", description: "Annual ($134 monthly)", features: ["Unlimited contacts", "Email series", "Custom reports", "Multi-currency"] }
    ]
  },

  // Cursor - https://www.cursor.com/pricing
  "cursor": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cursor.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free forever", features: ["One-week Pro trial", "Limited Agent requests", "Limited Tab completions"] },
      { name: "Pro", price: 20, period: "month", description: "For developers", features: ["Extended Agent limits", "Unlimited Tab completions", "Background Agents", "Max context windows"], highlighted: true },
      { name: "Pro+", price: 60, period: "month", description: "Recommended", features: ["3x usage on all models", "Everything in Pro"] },
      { name: "Ultra", price: 200, period: "month", description: "Power users", features: ["20x usage on all models", "Priority access to new features"] },
      { name: "Teams", price: 40, period: "month per user", description: "For teams", features: ["Centralized billing", "Usage analytics", "SAML/OIDC SSO", "Role-based access"] }
    ]
  },

  // Docker - https://www.docker.com/pricing/
  "docker": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.docker.com/pricing/",
    tiers: [
      { name: "Personal", price: 0, description: "Free forever", features: ["Docker Desktop", "Docker Scout (1 repo)", "100 Docker Hub pulls/hr", "1 private repo"] },
      { name: "Pro", price: 9, period: "month per user", description: "Annual ($11 monthly)", features: ["Build Cloud (200 min)", "Testcontainers (100 min)", "2 Scout repos", "Unlimited pulls"], highlighted: true },
      { name: "Team", price: 15, period: "month per user", description: "Most popular", features: ["Up to 100 users", "Audit logs", "Build Cloud (500 min)", "Unlimited Scout repos"] },
      { name: "Business", price: 24, period: "month per user", description: "Enterprise", features: ["Unlimited users", "SSO", "SCIM", "Enhanced security", "Build Cloud (1500 min)"] }
    ]
  },

  // Doppler - https://www.doppler.com/pricing
  "doppler": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.doppler.com/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "Free for 3 users", features: ["$8/month additional user", "Doppler CLI", "50 service tokens", "3-day activity log"] },
      { name: "Team", price: 21, period: "month per user", description: "14-day trial", features: ["SAML SSO", "Role-based access", "90-day activity log", "Automatic rotation"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["SCIM", "Dynamic secrets", "SIEM forwarding", "Dedicated manager"] }
    ]
  },

  // Drip - https://www.drip.com/pricing
  "drip": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.drip.com/pricing",
    tiers: [
      { name: "Starter", price: 39, period: "month", description: "1-2,500 contacts", features: ["Unlimited email sends", "Email support", "Dynamic segments", "Up to 50 workflows"], highlighted: true }
    ],
    notes: "Usage-based pricing scales with list size: 2,500-3,000 +$10/mo, 4,000-5,000 +$15/mo, etc."
  },

  // GitHub - https://www.github.com/pricing
  "github": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://github.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Unlimited public/private repos", "Dependabot security", "2,000 CI/CD minutes/month", "500MB Packages storage"] },
      { name: "Team", price: 4, period: "month per user", description: "First 12 months", features: ["GitHub Codespaces", "Repository rules", "Multiple PR reviewers", "3,000 CI/CD minutes"], highlighted: true },
      { name: "Enterprise", price: 21, period: "month per user", description: "Starting price", features: ["Data residency", "Enterprise Managed Users", "SAML SSO", "50,000 CI/CD minutes"] }
    ]
  },

  // Grafana - https://www.grafana.com/pricing/
  "grafana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://grafana.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["All Grafana Cloud services", "Limited usage", "14-day retention", "Community support"] },
      { name: "Pro", price: 19, period: "month", description: "Plus usage", features: ["8×5 email support", "13 months metrics retention", "30 days logs/traces", "99.5% uptime SLA"], highlighted: true },
      { name: "Enterprise", price: 25000, period: "year", description: "Spend commitment", features: ["Premium support", "Custom retention", "Federal/BYOC options", "Custom SLA"] }
    ],
    notes: "Metrics: $6.50/1k series (Pro), Logs/Traces: $0.50/GB"
  },

  // Grammarly - https://www.grammarly.com/plans
  "grammarly": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.grammarly.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic writing", features: ["Grammar/spelling checks", "Tone visibility", "100 AI prompts/month"] },
      { name: "Pro", price: 12, period: "month", description: "7-day trial", features: ["Tone adjustment", "Full-sentence rewrites", "Plagiarism detection", "2,000 AI prompts/month"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Dedicated support", "BYOK encryption", "Custom roles", "Unlimited AI prompts"] }
    ]
  },

  // Gumroad - https://gumroad.com/pricing
  "gumroad": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: false,
    pricingPageUrl: "https://gumroad.com/pricing",
    tiers: [
      { name: "Standard", price: "10% + $0.50", period: "per transaction", description: "Direct sales", features: ["No monthly fees", "Digital products", "Memberships", "Tax handling"], highlighted: true },
      { name: "Marketplace", price: "30%", period: "per transaction", description: "Discovery sales", features: ["New customers find you", "Featured in marketplace", "No extra fees"] }
    ],
    notes: "Gumroad handles sales tax collection and remittance worldwide since Jan 2025"
  },

  // Hasura - https://hasura.io/pricing
  "hasura": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://hasura.io/pricing",
    tiers: [
      { name: "DDN Free", price: 0, description: "Always free", features: ["Unlimited models", "1 supergraph developer", "15-min observability", "Unlimited API requests"] },
      { name: "DDN Base", price: 5, period: "month per active model", description: "For teams", features: ["Unlimited developers", "30-day observability", "Schema registry", "SSO"], highlighted: true },
      { name: "DDN Advanced", price: 30, period: "month per active model", description: "Multi-team", features: ["Federated collaboration", "Multi-repo CI/CD", "Team access controls"] }
    ]
  },

  // Hotjar - https://www.hotjar.com/pricing/
  "hotjar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hotjar.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For personal projects", features: ["Up to 200k sessions", "10k session replays", "Heatmaps", "7 integrations"] },
      { name: "Growth", price: 49, period: "month", description: "20% annual discount", features: ["7k-240k sessions", "Sense AI", "13 months data access", "9 integrations"], highlighted: true },
      { name: "Pro", price: "Custom", description: "Contact sales", features: ["1M+ sessions", "Revenue metrics", "115+ integrations"] },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["Digital experience monitoring", "Data feeds", "Unlimited projects"] }
    ]
  },

  // Intercom - https://www.intercom.com/pricing
  "intercom": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.intercom.com/pricing",
    tiers: [
      { name: "Essential", price: 29, period: "month per seat", description: "Annual ($39 monthly)", features: ["Fin AI Agent ($0.99/resolution)", "Messenger", "Shared inbox", "Ticketing", "Prebuilt reports"] },
      { name: "Advanced", price: 85, period: "month per seat", description: "Annual ($99 monthly)", features: ["Multiple team inboxes", "Workflow automation", "Multilingual help center", "20 free Lite seats"], highlighted: true },
      { name: "Expert", price: 132, period: "month per seat", description: "Annual ($139 monthly)", features: ["SSO", "HIPAA support", "SLAs", "Multibrand messenger", "50 free Lite seats"] }
    ]
  },

  // Miro - https://www.miro.com/pricing/
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.miro.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["3 editable boards", "5,000+ templates", "160+ integrations", "10 AI credits/month"] },
      { name: "Starter", price: 8, period: "month per member", description: "Billed annually ($10 monthly)", features: ["Unlimited boards", "Version history", "Brand Center", "25 AI credits/month"], highlighted: true },
      { name: "Business", price: 16, period: "month per member", description: "Billed annually ($20 monthly)", features: ["Multiple workspaces", "Unlimited guest access", "Jira/Azure sync", "SSO", "50 AI credits/month"] },
      { name: "Enterprise", price: "Custom", description: "Min 30 members", features: ["SCIM provisioning", "Data residency", "100 AI credits/month", "24/7 premium support"] }
    ]
  },

  // Mixpanel - https://mixpanel.com/pricing/
  "mixpanel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mixpanel.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 1M events", features: ["5 saved reports/seat", "10K session replays", "Core analytics"] },
      { name: "Growth", price: 0.28, period: "per 1K events", description: "First 1M free", features: ["Unlimited reports", "20K session replays", "Cohorts", "Behavioral analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Up to 1 trillion events", "24/7 support", "HIPAA compliance", "Dedicated CSM"] }
    ]
  },

  // monday.com - https://monday.com/pricing
  "monday": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://monday.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 2 seats", features: ["Up to 3 boards", "200+ templates", "Up to 1,000 items"] },
      { name: "Basic", price: 9, period: "month per seat", description: "Billed annually", features: ["Unlimited items", "5GB storage", "Prioritized support"], highlighted: true },
      { name: "Standard", price: 12, period: "month per seat", description: "Billed annually", features: ["Timeline & Gantt views", "250 automations/month", "Guest access"] },
      { name: "Pro", price: 19, period: "month per seat", description: "Most Popular", features: ["Private boards", "25,000 automations/month", "Time tracking", "Formula Column"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["250,000 automations", "Multi-level permissions", "24/7 support"] }
    ]
  },

  // MongoDB - https://www.mongodb.com/pricing
  "mongodb-atlas": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://www.mongodb.com/pricing",
    tiers: [
      { name: "Free (M0)", price: 0, description: "Forever free", features: ["512 MB storage", "Shared RAM", "Up to 100 ops/sec"] },
      { name: "Flex", price: 0.011, period: "hour", description: "Up to $30/month", features: ["5GB storage", "Shared RAM", "Burst capacity", "Dev/test workloads"] },
      { name: "Dedicated (M10+)", price: 0.08, period: "hour", description: "From $57/month", features: ["10GB+ storage", "Dedicated resources", "99.995% SLA", "Auto-scaling"], highlighted: true },
      { name: "Enterprise Advanced", price: "Custom", description: "On-premises", features: ["Full control", "Ops Manager", "Enterprise security", "Commercial license"] }
    ]
  },

  // Netlify - https://www.netlify.com/pricing/
  "netlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.netlify.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For personal projects", features: ["300 credits/month", "Unlimited deploy previews", "Custom domains with SSL", "Global CDN"] },
      { name: "Personal", price: 9, period: "month", description: "For real traffic", features: ["1,000 credits/month", "Smart secret detection", "7-day analytics", "Priority email support"] },
      { name: "Pro", price: 20, period: "month per member", description: "For teams", features: ["3,000 credits/member", "Private repos", "3+ concurrent builds", "30-day analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For scale", features: ["99.99% SLA", "SSO & SCIM", "24/7 dedicated support"] }
    ]
  },

  // Notion - https://www.notion.com/pricing
  "notion": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["Limited blocks for teams", "5MB file uploads", "1 notion.site domain", "Basic 2-step verification"] },
      { name: "Plus", price: 9.50, period: "month per member", description: "Save 20% annually", features: ["Unlimited blocks", "Unlimited file uploads", "5 notion.site domains", "2-step verification"], highlighted: true },
      { name: "Business", price: 19.50, period: "month per member", description: "Recommended", features: ["SAML SSO", "Granular permissions", "Notion AI", "AI meeting notes"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["User provisioning", "Advanced controls", "Audit logs", "Domain management"] }
    ]
  },

  // PagerDuty - https://www.pagerduty.com/pricing/
  "pagerduty": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.pagerduty.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["100 SMS/phone notifications", "1 on-call schedule", "700+ integrations", "Mobile app"] },
      { name: "Professional", price: 21, period: "month per user", description: "Annual ($25 monthly)", features: ["Unlimited notifications", "Multiple schedules", "SSO", "1,000 PD Advance credits"], highlighted: true },
      { name: "Business", price: 41, period: "month per user", description: "Annual ($49 monthly)", features: ["Custom incident types", "Advanced admin", "5,000 PD Advance credits"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced workflows", "20,000 PD Advance credits", "Premium status pages"] }
    ]
  },

  // Postman - https://www.postman.com/pricing/
  "postman": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.postman.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Up to 3 users", features: ["API client (HTTP, GraphQL, gRPC)", "Collections", "50 AI credits/month", "1K mock server requests"] },
      { name: "Basic", price: 14, period: "month per user", description: "Annual ($19 monthly)", features: ["Unlimited teammates", "10K mock server requests", "400 AI credits/month", "3 private APIs"], highlighted: true },
      { name: "Professional", price: 29, period: "month per user", description: "Annual ($39 monthly)", features: ["RBAC", "10 private APIs", "90-day collection recovery"] },
      { name: "Enterprise", price: 49, period: "month per user", description: "Annual only", features: ["SSO & SCIM", "API governance", "100K mock server requests", "Unlimited APIs"] }
    ]
  },

  // Prisma - https://www.prisma.io/pricing - CORRECTED
  "prisma": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.prisma.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["100,000 operations", "500 MB storage", "5 databases", "No credit card required"] },
      { name: "Starter", price: 10, period: "month", description: "For small projects", features: ["1M operations (then $0.08/10K)", "10 GB storage", "10 databases"] },
      { name: "Pro", price: 49, period: "month", description: "For production", features: ["10M operations (then $0.02/10K)", "50 GB storage", "100 databases", "Daily backups"], highlighted: true },
      { name: "Business", price: 129, period: "month", description: "For scale", features: ["50M operations (then $0.01/10K)", "100 GB storage", "1,000 databases", "30-day backups", "Premium support"] }
    ]
  },

  // Railway - https://railway.com/pricing
  "railway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://railway.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "$5 trial credits", features: ["0.5 GB RAM per service", "1 vCPU per service", "0.5 GB volume storage"] },
      { name: "Hobby", price: 5, period: "month", description: "Includes $5 usage", features: ["Up to 8 GB RAM", "5 GB volume storage", "Community support"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "Includes $20 usage", features: ["Up to 32 GB RAM", "250 GB volume storage", "Priority support", "Granular access control"] },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["SSO", "Audit logs", "HIPAA BAAs", "Dedicated VMs"] }
    ]
  },

  // Render - https://www.render.com/pricing
  "render": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.render.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free", features: ["100 GB bandwidth", "500 pipeline minutes", "2 custom domains", "Community support"] },
      { name: "Professional", price: 19, period: "month per user", description: "Plus compute", features: ["500 GB bandwidth", "Horizontal autoscaling", "Up to 10 team members", "Chat support"], highlighted: true },
      { name: "Organization", price: 29, period: "month per user", description: "Plus compute", features: ["1 TB bandwidth", "Unlimited team members", "SOC 2 & ISO 27001", "Audit logs"] },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["Guaranteed uptime", "Dedicated engineer", "SAML SSO & SCIM"] }
    ]
  },

  // Retool - https://retool.com/pricing
  "retool": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://retool.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["Unlimited apps", "500 workflow runs/month", "5GB data storage", "100 AI prompts/user"] },
      { name: "Team", price: 9, period: "month per user", description: "Annual discount", features: ["5,000 workflow runs", "Staging environment", "200 AI prompts/user"], highlighted: true },
      { name: "Business", price: 46, period: "month per user", description: "Annual discount", features: ["Audit logging", "Rich permissions", "Unlimited environments"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SAML/OIDC SSO", "Source control", "Custom branding", "400 AI prompts/user"] }
    ]
  },

  // Sentry - https://www.sentry.io/pricing/
  "sentry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://sentry.io/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Free forever", features: ["1 user only", "5k errors/month", "5GB logs", "10 custom dashboards"] },
      { name: "Team", price: 26, period: "month", description: "Annual ($29 monthly)", features: ["Unlimited users", "50k errors", "Third-party integrations", "Seer AI agent"], highlighted: true },
      { name: "Business", price: 80, period: "month", description: "Annual ($89 monthly)", features: ["90-day lookback", "Unlimited dashboards", "SAML + SCIM"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Technical account manager", "Dedicated support"] }
    ]
  },

  // SendGrid - https://www.sendgrid.com/pricing
  "sendgrid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://sendgrid.com/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "60 days", features: ["Up to 100 emails/day", "Analytics", "1 additional teammate"] },
      { name: "Essentials", price: 19.95, period: "month", description: "Starting price", features: ["50K emails/month", "Domain authentication", "2 event webhooks"], highlighted: true },
      { name: "Pro", price: 89.95, period: "month", description: "Growing businesses", features: ["100K emails/month", "Dedicated IP", "SSO", "Phone support"] },
      { name: "Premier", price: "Custom", description: "5M+ emails/month", features: ["Custom volume", "Dedicated account manager", "Priority support"] }
    ]
  },

  // Stripe - https://stripe.com/pricing
  "stripe": {
    startingPrice: 0, currency: "EUR", billingPeriod: "usage", hasFreeTrial: false,
    pricingPageUrl: "https://stripe.com/pricing",
    tiers: [
      { name: "Standard EU", price: "1.5% + €0.25", period: "per transaction", description: "Domestic EU cards", features: ["No setup fees", "No monthly fees", "3D Secure included", "Authorization Boost"], highlighted: true },
      { name: "Premium EU", price: "1.9% + €0.25", period: "per transaction", description: "Premium EU cards", features: ["All standard features", "Premium card support"] },
      { name: "International", price: "3.25% + €0.25", period: "per transaction", description: "Non-EU cards", features: ["+2% for currency conversion"] },
      { name: "Enterprise", price: "Custom", description: "Volume-based", features: ["Volume discounts", "IC+ pricing", "Multi-product discounts"] }
    ],
    notes: "SEPA transfers: €0.35/transaction, Disputes: €20 each"
  },

  // Supabase - https://supabase.com/pricing
  "supabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Passion projects", features: ["50,000 MAUs", "500 MB database", "5 GB egress", "1 GB file storage", "Max 2 active projects"] },
      { name: "Pro", price: 25, period: "month", description: "Includes $10 compute", features: ["100,000 MAUs", "8 GB disk", "250 GB egress", "100 GB storage", "7-day backups"], highlighted: true },
      { name: "Team", price: 599, period: "month", description: "Enterprise features", features: ["SOC2", "HIPAA add-on", "SSO", "14-day backups", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["Dedicated support", "Uptime SLAs", "BYO Cloud", "24/7 support"] }
    ]
  },

  // Vercel - https://vercel.com/pricing
  "vercel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://vercel.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free forever", features: ["Automatic CI/CD", "Web Application Firewall", "Global CDN", "1M edge requests/month", "100GB data transfer"] },
      { name: "Pro", price: 20, period: "month", description: "Plus usage", features: ["$20 usage credit", "Team collaboration", "Faster builds", "10M edge requests/month", "1TB data transfer"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Guest access controls", "SCIM & Directory Sync", "Multi-region compute", "99.99% SLA", "Custom environments"] }
    ]
  },

  // Webflow - https://www.webflow.com/pricing
  "webflow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.webflow.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["Webflow.io domain", "2 pages", "50 CMS items", "1GB bandwidth"] },
      { name: "Basic", price: 14, period: "month", description: "Billed yearly", features: ["Custom domain", "150 pages", "No CMS", "10GB bandwidth"] },
      { name: "CMS", price: 23, period: "month", description: "Popular", features: ["Custom domain", "2,000 CMS items", "50GB bandwidth", "Site search"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "For scale", features: ["300 pages", "20,000 CMS items", "2.5TB bandwidth"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Enterprise scale", "Advanced security", "Guaranteed SLA"] }
    ]
  },

  // Zendesk - https://www.zendesk.com/pricing/
  "zendesk": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.zendesk.com/pricing/",
    tiers: [
      { name: "Support Team", price: 19, period: "month", description: "Annual ($25 monthly)", features: ["Email & ticketing", "Facebook & X", "Macros", "1,000+ integrations"] },
      { name: "Suite Team", price: 55, period: "month", description: "Annual ($69 monthly)", features: ["AI agents (30%+ automation)", "Messaging + live chat", "Phone support", "1 help center"], highlighted: true },
      { name: "Suite Professional", price: 115, period: "month", description: "Annual ($149 monthly)", features: ["Up to 5 help centers", "Skills-based routing", "SLAs", "HIPAA compliance"] },
      { name: "Suite Enterprise", price: 169, period: "month", description: "Annual ($219 monthly)", features: ["300 help centers", "Sandbox", "Custom roles", "Audit logs"] }
    ]
  },

  // Algolia - https://www.algolia.com/pricing/ - CORRECTED
  "algolia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.algolia.com/pricing/",
    tiers: [
      { name: "Build", price: 0, description: "Free/Development", features: ["10K search requests/month", "1M records", "10K AI Recommendation requests", "3 rules per index"] },
      { name: "Grow", price: 0.50, period: "per 1K requests", description: "Pay-as-you-go", features: ["10K/month included", "$0.40/1K records", "10 rules/index", "30-day analytics"], highlighted: true },
      { name: "Grow Plus", price: 1.75, period: "per 1K requests", description: "New tier", features: ["10K rules/index", "AI Synonyms & Ranking", "Personalization", "90-day analytics"] },
      { name: "Elevate", price: "Custom", description: "Enterprise", features: ["NeuralSearch", "AI Collections", "70+ global data centers", "SSO & SLA"] }
    ]
  },

  // LaunchDarkly - https://www.launchdarkly.com/pricing/ - CORRECTED
  "launchdarkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://launchdarkly.com/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Free forever", features: ["Unlimited seats & flags", "30 SDKs", "5K session replays", "A/B testing"] },
      { name: "Foundation", price: 12, period: "month per service", description: "+$10/1K client MAU", features: ["Unlimited projects", "User/device targeting", "Scalable observability", "SSO"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Annual contract", features: ["Advanced targeting", "Release automation", "Workflows & approvals", "SAML/SCIM"] },
      { name: "Guardian", price: "Custom", description: "Annual contract", features: ["Release monitoring", "Guardrail metrics", "Automatic rollback"] }
    ]
  },

  // Clutch - https://clutch.io/pricing - ALREADY FIXED
  "clutch": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://clutch.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["1 seat", "Unlimited projects", "Community templates/libraries", "Connect to any backend", "Community support"] },
      { name: "Pro", price: 20, period: "month per seat", description: "Billed yearly ($25 monthly)", features: ["Team members", "Team roles/permissions", "Team private libraries", "Multiple environments", "Export as production code"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Large organizations", features: ["Unlimited seats", "SSO", "Custom hosting", "Dedicated account manager"] }
    ],
    notes: "Early Adopter Lifetime Deal: $349 one-time per seat (Pro plan)"
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

  console.log("🔧 Starting verified pricing corrections...\n");

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
    message: "Verified pricing corrections applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
