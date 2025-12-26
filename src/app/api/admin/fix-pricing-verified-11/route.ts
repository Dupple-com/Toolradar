import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Eleventh batch of verified pricing from WebFetch (December 2025) - Design, Automation & Social Media
const verifiedPricing: Record<string, object> = {
  // Sketch - https://www.sketch.com/pricing/
  "sketch": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.sketch.com/pricing/",
    tiers: [
      { name: "Standard", price: 12, period: "editor/month", description: "Billed yearly", features: ["Real-time collaboration", "Unlimited docs", "Version history", "Developer handoff"], highlighted: true },
      { name: "Business", price: 24, period: "editor/month", description: "Billed yearly", features: ["SSO", "Advanced permissions", "Dedicated support"] },
      { name: "Enterprise", price: 44, period: "editor/month", description: "25+ editors", features: ["SCIM provisioning", "BYOK encryption", "Unlimited workspaces"] },
      { name: "Private Cloud", price: 74, period: "editor/month", description: "50+ editors", features: ["Private cloud", "Custom hosting", "All enterprise features"] }
    ],
    notes: "Mac-only license: $120 one-time (1 year updates)"
  },

  // n8n - https://n8n.io/pricing/
  "n8n": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://n8n.io/pricing/",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["Unlimited workflows", "Unlimited executions", "Open source"] },
      { name: "Starter", price: 20, period: "month", description: "Cloud", features: ["2,500 executions", "5 concurrent", "1 shared project"], highlighted: true },
      { name: "Pro", price: 50, period: "month", description: "Cloud", features: ["10K executions", "20 concurrent", "3 shared projects"] },
      { name: "Business", price: 667, period: "month", description: "Self-hosted", features: ["40K executions", "SSO/SAML/LDAP", "Git version control"] }
    ],
    notes: "Unlike other tools, n8n charges per execution, not per step"
  },

  // Buffer - https://buffer.com/pricing
  "buffer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://buffer.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 channels", features: ["10 posts per channel", "100 ideas", "1 user"] },
      { name: "Essentials", price: 5, period: "channel/month", description: "Per channel", features: ["Unlimited posts", "Unlimited ideas", "Analytics"], highlighted: true },
      { name: "Team", price: 10, period: "channel/month", description: "Per channel", features: ["Unlimited users", "Approval workflows", "Custom permissions"] }
    ],
    notes: "20% off with annual billing. Volume discounts available."
  },

  // Sprout Social - https://sproutsocial.com/pricing/
  "sprout-social": {
    startingPrice: 199, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://sproutsocial.com/pricing/",
    tiers: [
      { name: "Standard", price: 199, period: "month", description: "$249 monthly", features: ["5 social profiles", "Keyword monitoring", "Optimal send times"] },
      { name: "Professional", price: 299, period: "month", description: "$399 monthly", features: ["Unlimited profiles", "Competitor insights", "AI post enhancement"], highlighted: true },
      { name: "Advanced", price: 399, period: "month", description: "$499 monthly", features: ["AI reply enhancement", "Sentiment analysis", "Sprout API"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["White-glove onboarding", "Priority support", "Dedicated SSO"] }
    ]
  },

  // Later - https://www.later.com/pricing/
  "later": {
    startingPrice: 18.75, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.later.com/pricing/",
    tiers: [
      { name: "Starter", price: 18.75, period: "month", description: "Yearly ($25 monthly)", features: ["1 social set (8 profiles)", "30 posts/profile", "5 AI credits"], highlighted: true },
      { name: "Growth", price: 37.50, period: "month", description: "Yearly ($50 monthly)", features: ["2 social sets", "180 posts/profile", "50 AI credits", "Social inbox"] },
      { name: "Scale", price: 82.50, period: "month", description: "Yearly ($110 monthly)", features: ["6 social sets", "Unlimited posts", "100 AI credits", "20 competitors"] }
    ],
    notes: "25% off with annual billing"
  },

  // SendGrid - https://sendgrid.com/en-us/pricing
  "sendgrid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://sendgrid.com/en-us/pricing",
    tiers: [
      { name: "Free", price: 0, description: "60-day trial", features: ["Basic features", "1 teammate", "1 webhook"] },
      { name: "Essentials", price: 19.95, period: "month", description: "Email API", features: ["2 webhooks", "Support", "More features"], highlighted: true },
      { name: "Pro", price: 89.95, period: "month", description: "Email API", features: ["Dedicated IPs", "SSO", "1000 teammates"] },
      { name: "Premier", price: "Custom", description: "5M+ emails/mo", features: ["5000 validations", "High volume", "Premium support"] }
    ],
    notes: "Marketing Campaigns from $15/mo"
  },

  // Mailgun - https://www.mailgun.com/pricing/
  "mailgun": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mailgun.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "100 emails/day", features: ["Basic APIs", "SMTP relay", "1 custom domain"] },
      { name: "Basic", price: 15, period: "month", description: "10K emails", features: ["No daily limits", "5 inbound routes", "$1.80/1K overage"], highlighted: true },
      { name: "Foundation", price: 35, period: "month", description: "50K emails", features: ["1000 domains", "Template builder", "5-day logs"] },
      { name: "Scale", price: 90, period: "month", description: "100K emails", features: ["SAML SSO", "Dedicated IPs", "30-day logs"] }
    ]
  },

  // Postmark - https://postmarkapp.com/pricing
  "postmark": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://postmarkapp.com/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "100 emails/mo", features: ["No expiration", "Basic features", "API & SMTP"] },
      { name: "Basic", price: 15, period: "month", description: "10K emails", features: ["4 users", "5 servers", "$1.80/1K overage"], highlighted: true },
      { name: "Pro", price: 16.50, period: "month", description: "Most popular", features: ["6 users", "10 servers", "Inbound email"] },
      { name: "Platform", price: 18, period: "month", description: "Unlimited", features: ["Unlimited users", "Unlimited servers", "$1.20/1K overage"] }
    ],
    notes: "Dedicated IPs from $50/mo (300K+ emails required)"
  },

  // Twilio - https://www.twilio.com/en-us/pricing
  "twilio": {
    startingPrice: 0, currency: "USD", billingPeriod: "transaction", hasFreeTrial: true,
    pricingPageUrl: "https://www.twilio.com/en-us/pricing",
    tiers: [
      { name: "SMS", price: 0.0083, period: "per message", description: "Send or receive", features: ["Pay as you go", "No monthly fees", "Volume discounts"], highlighted: true },
      { name: "Voice Inbound", price: 0.0085, period: "per minute", description: "Receive calls", features: ["Global coverage", "Call recording", "IVR"] },
      { name: "Voice Outbound", price: 0.014, period: "per minute", description: "Make calls", features: ["200+ countries", "Call analytics", "Transcription"] },
      { name: "WhatsApp", price: 0.005, period: "per message", description: "Send or receive", features: ["Business API", "Rich media", "Templates"] }
    ],
    notes: "SIP Trunking: $0.0045-$0.007/min. Free to start."
  },

  // Basecamp - https://basecamp.com/pricing
  "basecamp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://basecamp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 project", features: ["1 GB storage", "All core features", "Mobile apps"] },
      { name: "Plus", price: 15, period: "user/month", description: "Employees only", features: ["Unlimited projects", "500 GB storage", "24/7 support"], highlighted: true },
      { name: "Pro Unlimited", price: 299, period: "month", description: "Fixed price", features: ["Unlimited users", "5 TB storage", "Timesheet included"] }
    ],
    notes: "Non-profits: 10% off. Education: Free."
  },

  // Cloudflare - https://www.cloudflare.com/plans/
  "cloudflare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cloudflare.com/plans/",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Basic DDoS", "Free SSL", "Global CDN", "DNS"] },
      { name: "Pro", price: 20, period: "month", description: "Small sites", features: ["Advanced DDoS", "WAF", "Priority support"], highlighted: true },
      { name: "Business", price: 200, period: "month", description: "E-commerce", features: ["Enhanced DDoS", "2hr response SLA", "Rate limiting"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom solutions", "24/7 support", "Advanced security"] }
    ],
    notes: "Add-ons: Argo $5/mo, Load Balancing $5/mo, Workers free tier"
  },

  // Grafana - https://grafana.com/pricing/
  "grafana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://grafana.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "14-day retention", features: ["Community support", "10K metrics", "50GB logs"] },
      { name: "Pro", price: 19, period: "month", description: "+ usage", features: ["8x5 support", "13-month retention", "99.5% SLA"], highlighted: true },
      { name: "Enterprise", price: 25000, period: "year", description: "Minimum", features: ["Premium support", "Custom SLA", "BYOC option"] }
    ],
    notes: "Metrics: $6.50/1K series. Logs: $0.50/GB ingested."
  },

  // Datadog - https://www.datadoghq.com/pricing/
  "datadog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.datadoghq.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "5 hosts max", features: ["1-day retention", "Basic metrics", "5 hosts"] },
      { name: "Pro", price: 15, period: "host/month", description: "Annual", features: ["15-month retention", "1000+ integrations", "100 custom metrics"], highlighted: true },
      { name: "Enterprise", price: 23, period: "host/month", description: "Annual", features: ["ML alerts", "Live Processes", "200 custom metrics"] }
    ],
    notes: "APM from $31/host. Logs from $0.10/GB. On-demand +20%."
  },

  // PagerDuty - https://www.pagerduty.com/pricing/
  "pagerduty": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.pagerduty.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "5 users max", features: ["100 intl notifications", "1 schedule", "700+ integrations"] },
      { name: "Professional", price: 21, period: "user/month", description: "Annual ($25 monthly)", features: ["Status page", "SSO", "Ticketing integrations"], highlighted: true },
      { name: "Business", price: 41, period: "user/month", description: "Annual ($49 monthly)", features: ["Custom fields", "Multi-year data", "Internal status pages"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Full chat", "100 incident types", "ServiceNow sync"] }
    ],
    notes: "AIOps add-on from $699/mo"
  },

  // Snyk - https://snyk.io/plans/
  "snyk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://snyk.io/plans/",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited devs", features: ["200 Open Source tests/mo", "100 Code tests/mo", "IDE plugins"] },
      { name: "Team", price: 25, period: "dev/month", description: "5-10 devs", features: ["1000 tests/mo each", "Jira integration", "Priority support"], highlighted: true },
      { name: "Ignite", price: 105, period: "dev/month", description: "$1,260/year", features: ["Unlimited tests", "SBOM", "Risk prioritization"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Full platform", "Custom limits", "Dedicated support"] }
    ]
  },

  // LaunchDarkly - https://www.launchdarkly.com/pricing/
  "launchdarkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.launchdarkly.com/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Free forever", features: ["Unlimited seats", "Unlimited flags", "30 SDKs", "5K replays/mo"] },
      { name: "Foundation", price: 12, period: "month", description: "+ $10/1K MAU", features: ["Unlimited projects", "SSO", "Scalable usage"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced targeting", "SAML/SCIM", "Custom roles"] },
      { name: "Guardian", price: "Custom", description: "Contact sales", features: ["Release Monitoring", "Auto rollback", "Guardrail metrics"] }
    ]
  },

  // WordPress.com - https://wordpress.com/pricing/
  "wordpress": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://wordpress.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "1 GB storage", features: ["Unlimited pages", "Basic features", "wordpress.com subdomain"] },
      { name: "Personal", price: 4, period: "month", description: "Yearly", features: ["6 GB storage", "Custom domain", "Ad-free"], highlighted: true },
      { name: "Premium", price: 8, period: "month", description: "Yearly", features: ["13 GB storage", "Premium themes", "Google Analytics"] },
      { name: "Business", price: 25, period: "month", description: "Yearly", features: ["50 GB storage", "Plugins", "SSH/SFTP access"] }
    ],
    notes: "Commerce: €45/mo. Enterprise from $25K/year."
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

  console.log("🔧 Starting verified pricing corrections batch 11 (Design, Automation & Social Media)...\n");

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
    message: "Verified pricing corrections batch 11 (Design, Automation & Social Media) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
