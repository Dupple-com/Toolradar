import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Second batch of verified pricing from WebFetch (December 2025)
const verifiedPricing: Record<string, object> = {
  // Salesforce - https://www.salesforce.com/editions-pricing/sales-cloud/
  "salesforce": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.salesforce.com/editions-pricing/sales-cloud/",
    tiers: [
      { name: "Free Suite", price: 0, description: "Max 2 users", features: ["Basic lead/contact management", "Slack integration", "Simple email"] },
      { name: "Starter Suite", price: 25, period: "month per user", description: "Unlimited users", features: ["AI email sync", "Lead routing", "Dynamic marketing analytics"] },
      { name: "Pro Suite", price: 100, period: "month per user", description: "Growing businesses", features: ["Customization", "Quoting/forecasting", "AppExchange access"], highlighted: true },
      { name: "Enterprise", price: 175, period: "month per user", description: "Large organizations", features: ["Advanced pipeline", "Conversation intelligence", "Agentforce"] },
      { name: "Unlimited", price: 350, period: "month per user", description: "Full platform", features: ["Predictive AI", "Sales engagement", "Premier support"] }
    ]
  },

  // Airtable - https://www.airtable.com/pricing
  "airtable": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["Unlimited bases", "1,000 records/base", "1GB attachments", "100 automations/month"] },
      { name: "Team", price: 20, period: "month per user", description: "Annual ($24 monthly)", features: ["50,000 records/base", "20GB attachments", "25,000 automations", "365-day history"], highlighted: true },
      { name: "Business", price: 45, period: "month per user", description: "Annual ($54 monthly)", features: ["100,000 records/base", "100GB attachments", "100,000 automations", "2-year history"] },
      { name: "Enterprise Scale", price: "Custom", description: "Large orgs", features: ["500,000 records/base", "1TB attachments", "1M automations", "SAML/SSO", "Dedicated CSM"] }
    ]
  },

  // Asana - https://www.asana.com/pricing
  "asana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.asana.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Up to 2 users", features: ["Task management", "Projects", "Mobile apps", "Basic integrations"] },
      { name: "Starter", price: 10.99, period: "month per user", description: "Annual ($13.49 monthly)", features: ["AI features", "Timeline/Gantt views", "Workflow builder", "Dashboards"], highlighted: true },
      { name: "Advanced", price: 24.99, period: "month per user", description: "Annual ($30.49 monthly)", features: ["Goals", "Portfolios", "Time tracking", "Approvals", "Proofing"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Resource management", "SAML", "Custom branding", "24/7 support"] }
    ]
  },

  // Trello - https://trello.com/pricing
  "trello": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://trello.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 10 collaborators", features: ["Unlimited cards", "Up to 10 boards", "Basic automation", "Mobile apps"] },
      { name: "Standard", price: 5, period: "month per user", description: "Annual ($6 monthly)", features: ["Unlimited boards", "AI Quick Capture", "Custom fields", "Card mirroring"], highlighted: true },
      { name: "Premium", price: 10, period: "month per user", description: "Annual ($12.50 monthly)", features: ["AI features", "Calendar/Timeline views", "Dashboard view", "Admin controls"] },
      { name: "Enterprise", price: 17.50, period: "month per user", description: "Starting price", features: ["Unlimited workspaces", "SSO via Atlassian Guard", "24/7 support"] }
    ]
  },

  // Dropbox - https://www.dropbox.com/plans
  "dropbox": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.dropbox.com/plans",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["2 GB storage", "Basic sync", "Mobile access"] },
      { name: "Plus", price: 9.99, period: "month", description: "Personal", features: ["2 TB storage", "PDF editing", "3 signature requests/month"] },
      { name: "Professional", price: 16.58, period: "month", description: "Billed annually", features: ["3 TB storage", "180-day recovery", "100 GB transfers", "Branded sharing"], highlighted: true },
      { name: "Standard", price: 12, period: "month per user", description: "Teams", features: ["5 TB team total", "Team folders", "Admin controls"] },
      { name: "Advanced", price: 18, period: "month per user", description: "Teams", features: ["15 TB minimum", "1-year recovery", "E2E encryption", "SSO"] }
    ]
  },

  // 1Password - https://www.1password.com/business-pricing
  "1password": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.1password.com/business-pricing",
    tiers: [
      { name: "Individual", price: 2.99, period: "month", description: "Annual ($3.99 monthly)", features: ["Generate passwords", "Autofill", "Multi-device", "Breach alerts"] },
      { name: "Families", price: 4.49, period: "month", description: "Up to 5 members", features: ["Unlimited shared vaults", "Admin controls", "Recovery options"] },
      { name: "Teams Starter", price: 19.95, period: "month", description: "Up to 10 users", features: ["Password sharing", "Security alerts", "Role-based permissions"], highlighted: true },
      { name: "Business", price: 7.99, period: "month per user", description: "Annual ($9.99 monthly)", features: ["SSO integration", "Watchtower alerts", "Custom roles"] }
    ]
  },

  // Typeform - https://www.typeform.com/pricing/
  "typeform": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.typeform.com/pricing/",
    tiers: [
      { name: "Basic", price: 25, period: "month", description: "Billed yearly ($29 monthly)", features: ["100 responses/month", "1 user", "Unlimited typeforms"] },
      { name: "Plus", price: 50, period: "month", description: "Billed yearly ($59 monthly)", features: ["1,000 responses", "3 users", "Remove branding", "Custom subdomain"], highlighted: true },
      { name: "Business", price: 83, period: "month", description: "Billed yearly ($99 monthly)", features: ["10,000 responses", "5 users", "Drop-off rates", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Custom terms", features: ["Tailored response limits", "SSO", "HIPAA/GDPR compliance"] }
    ]
  },

  // SurveyMonkey - https://www.surveymonkey.com/pricing/
  "surveymonkey": {
    startingPrice: 30, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.surveymonkey.com/pricing/",
    tiers: [
      { name: "Team Advantage", price: 30, period: "month per user", description: "Annual (16% savings)", features: ["50,000 responses/year", "Unlimited surveys", "AI-powered building", "Sentiment analysis"] },
      { name: "Team Premier", price: 75, period: "month per user", description: "Annual (24% savings)", features: ["100,000 responses/year", "Multilingual surveys", "Crosstabs", "Rule-based tagging"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "HIPAA compliance", "Advanced security", "Premium onboarding"] }
    ]
  },

  // Auth0 - https://www.auth0.com/pricing
  "auth0": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://auth0.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 25,000 MAU", features: ["Unlimited social connections", "Passwordless auth", "5 Organizations", "Community support"] },
      { name: "B2C Essentials", price: 35, period: "month", description: "Up to 500 MAU base", features: ["MFA (OTP, Duo)", "10 Organizations", "Standard support"], highlighted: true },
      { name: "B2C Professional", price: 240, period: "month", description: "Up to 500 MAU base", features: ["Custom database connections", "Enhanced attack protection", "RBAC"] },
      { name: "Enterprise", price: "Custom", description: "Unlimited users", features: ["99.99% SLA", "Unlimited organizations", "Private deployment", "Premier support"] }
    ]
  },

  // Amplitude - https://www.amplitude.com/pricing
  "amplitude": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["50K MTUs, 10M events", "Session Replay", "Unlimited feature flags", "Web Experimentation"] },
      { name: "Plus", price: 49, period: "month", description: "Pay annually", features: ["Up to 300K MTUs or 25M events", "Unlimited analytics", "Behavioral cohorts", "Online support"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Custom volume", features: ["Advanced behavioral analysis", "Feature Experimentation", "Predictive audiences"] },
      { name: "Enterprise", price: "Custom", description: "Custom volume", features: ["Cross-product analysis", "Advanced data controls", "Multi-armed bandit", "Account manager"] }
    ]
  },

  // Customer.io - https://www.customer.io/pricing/
  "customer-io": {
    startingPrice: 100, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.customer.io/pricing/",
    tiers: [
      { name: "Essentials", price: 100, period: "month", description: "Billed monthly", features: ["5,000 profiles", "1M emails/month", "Visual workflow builder", "Email support"] },
      { name: "Premium", price: 1000, period: "month", description: "Billed yearly", features: ["Custom profiles", "HIPAA compliance", "Premium integrations", "90-day onboarding"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Best rates", "Migration support", "Dedicated hardware", "Priority support"] }
    ]
  },

  // Mailgun - https://www.mailgun.com/pricing/
  "mailgun": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mailgun.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "100 emails/day", features: ["Basic API access", "1 custom domain", "Ticket support"] },
      { name: "Basic", price: 15, period: "month", description: "10K emails included", features: ["No daily limits", "RESTful APIs", "SMTP relay", "$1.80/1K overage"] },
      { name: "Foundation", price: 35, period: "month", description: "50K emails included", features: ["1,000 sending domains", "Email templates", "5-day logs", "$1.30/1K overage"], highlighted: true },
      { name: "Scale", price: 90, period: "month", description: "100K emails included", features: ["SAML SSO", "5,000 validations", "Dedicated IP pools", "30-day logs"] }
    ]
  },

  // Okta - https://www.okta.com/pricing/
  "okta": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.okta.com/pricing/",
    tiers: [
      { name: "Starter", price: 6, period: "month per user", description: "Workforce Identity", features: ["Single Sign-On", "Multi-Factor Authentication", "Universal Directory", "5 Workflows"] },
      { name: "Core Essentials", price: 14, period: "month per user", description: "Enhanced security", features: ["Adaptive MFA", "Privileged Access", "Lifecycle Management", "50 Workflows"] },
      { name: "Essentials", price: 17, period: "month per user", description: "Most Popular", features: ["All Core features", "Access Governance", "Enhanced security"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["API Access Management", "Access Gateway", "M2M tokens", "Unlimited Workflows"] }
    ],
    notes: "Minimum $1,500 annual contract"
  },

  // Twilio (detailed SMS) - https://www.twilio.com/en-us/sms/pricing/us
  "twilio": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://www.twilio.com/en-us/pricing",
    tiers: [
      { name: "Pay-As-You-Go", price: "Usage-based", description: "No monthly fees", features: ["SMS: $0.0083/segment", "Voice: $0.0085/min", "Carrier fees: $0.003-0.005", "Volume discounts available"], highlighted: true }
    ],
    notes: "Phone numbers: $1.15/mo (long code), $2.15/mo (toll-free). 1M+ messages: $0.0073/segment"
  },

  // MongoDB - correct slug
  "mongodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true,
    pricingPageUrl: "https://www.mongodb.com/pricing",
    tiers: [
      { name: "Free (M0)", price: 0, description: "Forever free", features: ["512 MB storage", "Shared RAM", "Up to 100 ops/sec"] },
      { name: "Flex", price: 0.011, period: "hour", description: "Up to $30/month", features: ["5GB storage", "Shared RAM", "Burst capacity", "Dev/test workloads"] },
      { name: "Dedicated (M10+)", price: 0.08, period: "hour", description: "From $57/month", features: ["10GB+ storage", "Dedicated resources", "99.995% SLA", "Auto-scaling"], highlighted: true },
      { name: "Enterprise Advanced", price: "Custom", description: "On-premises", features: ["Full control", "Ops Manager", "Enterprise security", "Commercial license"] }
    ]
  },

  // Better Uptime - correct slug
  "better-uptime": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://betterstack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["10 monitors & heartbeats", "1 status page", "Slack & email alerts", "100,000 exceptions/month"] },
      { name: "Responder", price: 29, period: "month", description: "Annual billing ($34 monthly)", features: ["Unlimited phone/SMS alerts", "Uptime monitoring", "Incident management"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Custom deployment", features: ["SAML SSO", "Dedicated deployments", "Advanced features"] }
    ],
    notes: "Telemetry bundles: Nano $25/mo, Micro $100/mo, Mega $210/mo, Tera $420/mo"
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

  console.log("🔧 Starting verified pricing corrections batch 2...\n");

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
    message: "Verified pricing corrections batch 2 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
