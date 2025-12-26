import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Ninth batch of verified pricing from WebFetch (December 2025) - Productivity & Security Tools
const verifiedPricing: Record<string, object> = {
  // Calendly - https://www.calendly.com/pricing
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["1 event type", "1 calendar", "Mobile apps"] },
      { name: "Standard", price: 10, period: "seat/month", description: "Annual ($12 monthly)", features: ["Unlimited events", "Multiple calendars", "Reminders"], highlighted: true },
      { name: "Teams", price: 16, period: "seat/month", description: "Annual ($20 monthly)", features: ["Salesforce integration", "Admin features", "Round robin"] },
      { name: "Enterprise", price: 15000, period: "year min", description: "Large companies", features: ["Custom routing", "Dynamics support", "Dedicated manager"] }
    ]
  },

  // Typeform - https://www.typeform.com/pricing/
  "typeform": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.typeform.com/pricing/",
    tiers: [
      { name: "Basic", price: 29, period: "month", description: "Getting started", features: ["Unlimited typeforms", "100 responses/mo", "Basic features"] },
      { name: "Plus", price: 59, period: "month", description: "More responses", features: ["1000 responses/mo", "Custom branding", "Priority support"], highlighted: true },
      { name: "Business", price: 99, period: "month", description: "Full power", features: ["10000 responses/mo", "Advanced analytics", "Salesforce integration"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited responses", "SSO", "Dedicated support"] }
    ],
    notes: "Growth plans from $199/mo. 16% savings with yearly billing."
  },

  // DocuSign - https://www.docusign.com/products-and-pricing
  "docusign": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.docusign.com/products-and-pricing",
    tiers: [
      { name: "Personal", price: 10, period: "month", description: "5 envelopes/mo", features: ["Single user", "Basic e-signature", "Mobile apps"] },
      { name: "Standard", price: 25, period: "user/month", description: "100 envelopes/yr", features: ["Up to 50 users", "Reminders", "Templates"], highlighted: true },
      { name: "Business Pro", price: 40, period: "user/month", description: "100 envelopes/yr", features: ["Bulk send", "Advanced fields", "Payment collection"] },
      { name: "Enhanced", price: "Custom", description: "Contact sales", features: ["Enterprise features", "API access", "Custom integrations"] }
    ]
  },

  // PandaDoc - https://www.pandadoc.com/pricing/
  "pandadoc": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.pandadoc.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "60 docs/year", features: ["Unlimited seats", "E-signatures", "Mobile apps"] },
      { name: "Starter", price: 19, period: "seat/month", description: "Annual billing", features: ["Unlimited docs", "Templates", "Analytics"], highlighted: true },
      { name: "Business", price: 49, period: "seat/month", description: "Annual billing", features: ["Custom quotes", "CRM integrations", "Approval workflows"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Per-doc pricing", "SSO", "Dedicated support"] }
    ],
    notes: "Save up to 46% with annual billing"
  },

  // Dropbox - https://www.dropbox.com/plans
  "dropbox": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.dropbox.com/plans",
    tiers: [
      { name: "Basic", price: 0, description: "2 GB storage", features: ["Free forever", "Sync across devices", "File sharing"] },
      { name: "Plus", price: 9.99, period: "month", description: "2 TB storage", features: ["1 user", "PDF editing", "Offline access"], highlighted: true },
      { name: "Professional", price: 16.58, period: "month", description: "3 TB storage", features: ["1 user", "Smart Sync", "Watermarking"] },
      { name: "Standard", price: 12, period: "user/month", description: "5 TB team", features: ["Min 3 users", "Admin controls", "Team folders"] }
    ]
  },

  // 1Password - https://www.1password.com/pricing
  "1password": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.1password.com/pricing",
    tiers: [
      { name: "Individual", price: 2.99, period: "month", description: "Annual ($3.99 monthly)", features: ["Unlimited passwords", "All devices", "1 GB storage"] },
      { name: "Families", price: 4.49, period: "month", description: "Annual ($5.99 monthly)", features: ["5 family members", "Shared vaults", "Recovery options"], highlighted: true },
      { name: "Teams Starter", price: 19.95, period: "month", description: "Up to 10 users", features: ["Admin controls", "Shared vaults", "Security reports"] },
      { name: "Business", price: 7.99, period: "user/month", description: "Annual ($9.99 monthly)", features: ["Unlimited users", "SSO", "Advanced controls"] }
    ]
  },

  // Bitwarden - https://bitwarden.com/pricing/
  "bitwarden": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://bitwarden.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["Unlimited passwords", "Unlimited devices", "Open source"] },
      { name: "Premium", price: 0.83, period: "month", description: "$10/year", features: ["2FA authenticator", "1 GB storage", "Emergency access"], highlighted: true },
      { name: "Families", price: 3.33, period: "month", description: "$40/year, 6 users", features: ["All Premium features", "6 accounts", "Unlimited sharing"] }
    ],
    notes: "Zero-knowledge encryption. Business plans available."
  },

  // Grammarly - https://www.grammarly.com/plans
  "grammarly": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.grammarly.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic corrections", features: ["Spelling & grammar", "Writing tone", "100 AI prompts/mo"] },
      { name: "Pro", price: 12, period: "month", description: "7-day trial", features: ["Sentence rewrites", "Tone adjustment", "Plagiarism check", "2000 AI prompts/mo"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited AI", "BYOK encryption", "DLP", "Dedicated support"] }
    ]
  },

  // Sentry - https://www.sentry.io/pricing/
  "sentry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.sentry.io/pricing/",
    tiers: [
      { name: "Developer", price: 0, description: "Solo devs", features: ["1 user", "5K errors", "Basic features"] },
      { name: "Team", price: 26, period: "month", description: "Scaling apps", features: ["Unlimited users", "50K errors", "Integrations"], highlighted: true },
      { name: "Business", price: 80, period: "month", description: "Powerful debugging", features: ["100K errors", "Insights", "Unlimited dashboards"] },
      { name: "Enterprise", price: "Custom", description: "Advanced needs", features: ["TAM", "Dedicated support", "Custom SLAs"] }
    ],
    notes: "20% discount with annual billing"
  },

  // New Relic - https://newrelic.com/pricing
  "new-relic": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://newrelic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100 GB/mo", features: ["1 full user", "Unlimited basic users", "50+ capabilities"] },
      { name: "Standard", price: 10, period: "month", description: "First full user", features: ["5 users max", "$99/user additional", "$0.40/GB data"] },
      { name: "Pro", price: 349, period: "user/month", description: "Annual commit", features: ["Unlimited users", "2-hr critical SLA", "Data Plus eligible"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["FedRAMP/HIPAA", "1-hr critical SLA", "Priority routing"] }
    ],
    notes: "100 GB free monthly. Data Plus: $0.60/GB with extended retention."
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

  console.log("🔧 Starting verified pricing corrections batch 9 (Productivity & Security)...\n");

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
    message: "Verified pricing corrections batch 9 (Productivity & Security) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
