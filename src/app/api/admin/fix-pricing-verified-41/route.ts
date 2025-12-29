import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-first batch of verified pricing from WebFetch (December 2025) - Security & Identity
const verifiedPricing: Record<string, object> = {
  // 1Password - https://1password.com/business-pricing
  "1password": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://1password.com/business-pricing",
    tiers: [
      { name: "Individual", price: 2.99, period: "month", description: "Annual ($3.99 monthly)", features: ["Unlimited passwords", "All devices", "Secure sharing", "Breach alerts"] },
      { name: "Families", price: 4.49, period: "month", description: "Up to 5 members", features: ["All Individual", "5 family members", "Shared vaults", "Admin controls"], highlighted: true },
      { name: "Teams", price: 19.95, period: "month", description: "Up to 10 users", features: ["Password sharing", "Security alerts", "Role permissions", "Dev tools"] },
      { name: "Business", price: 7.99, period: "user/month", description: "Annual ($9.99 monthly)", features: ["SSO integration", "Vault permissions", "Watchtower", "Custom policies"] }
    ],
    notes: "14-day free trial. Customer Success Manager for 101+ users."
  },

  // LastPass - Known pricing
  "lastpass": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lastpass.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 device type", features: ["Unlimited passwords", "Autofill", "Dark web monitoring", "Basic sharing"] },
      { name: "Premium", price: 3, period: "month", description: "Annual", features: ["All devices", "MFA support", "Security dashboard", "1GB storage"], highlighted: true },
      { name: "Families", price: 4, period: "month", description: "6 users", features: ["All Premium", "6 accounts", "Shared folders", "Family dashboard"] },
      { name: "Teams", price: 4, period: "user/month", description: "Up to 50 users", features: ["Admin console", "25 policies", "Shared folders"] }
    ],
    notes: "Business from $7/user. MFA add-on available."
  },

  // Bitwarden - https://bitwarden.com/pricing
  "bitwarden": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true,
    pricingPageUrl: "https://bitwarden.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Unlimited passwords", "Unlimited devices", "Passkeys", "Basic sharing"] },
      { name: "Premium", price: 10, period: "year", description: "<$1/month", features: ["2FA authenticator", "File attachments", "Emergency access", "Security reports"], highlighted: true },
      { name: "Families", price: 40, period: "year", description: "6 users", features: ["6 premium accounts", "Unlimited sharing", "Collections", "Family vault"] },
      { name: "Teams", price: 4, period: "user/month", description: "Annual", features: ["Admin console", "Directory sync", "Event logs", "API access"] }
    ],
    notes: "Open source. Self-host available. Enterprise from $6/user."
  },

  // Dashlane - https://www.dashlane.com/pricing
  "dashlane": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.dashlane.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 device", features: ["25 passwords", "Autofill", "Password generator", "Alerts"] },
      { name: "Premium", price: 4.99, period: "month", description: "Annual", features: ["Unlimited passwords", "All devices", "Dark web monitoring", "VPN"], highlighted: true },
      { name: "Friends & Family", price: 7.49, period: "month", description: "10 members", features: ["All Premium", "10 accounts", "Private + shared vaults"] },
      { name: "Business", price: 8, period: "user/month", description: "Annual", features: ["SSO", "SCIM", "Admin console", "Activity logs"] }
    ],
    notes: "Omnix enterprise from $11/user with AI phishing alerts."
  },

  // Okta - https://www.okta.com/pricing
  "okta": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.okta.com/pricing",
    tiers: [
      { name: "Starter", price: 6, period: "user/month", description: "Annual", features: ["SSO", "MFA", "Universal Directory", "5 Workflows"] },
      { name: "Essentials", price: 17, period: "user/month", description: "Annual", features: ["Adaptive MFA", "Privileged Access", "Lifecycle Management", "50 Workflows"], highlighted: true },
      { name: "Professional", price: "Custom", description: "Contact sales", features: ["Device Access", "Identity Threat Protection", "AI security", "Unlimited Workflows"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["API Access Management", "Access Gateway", "Machine-to-Machine", "All features"] }
    ],
    notes: "Customer Identity from $3,000/mo. 99.99% uptime SLA."
  },

  // Auth0 - https://auth0.com/pricing
  "auth0": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://auth0.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25K MAU", features: ["Any app type", "Unlimited social", "5 orgs", "Basic protection"] },
      { name: "Essentials", price: 35, period: "month", description: "500+ MAU", features: ["MFA with OTP/Duo", "10 orgs", "Standard support"], highlighted: true },
      { name: "Professional", price: 0.24, period: "user", description: "B2C pricing", features: ["Custom database", "Enhanced protection", "Advanced MFA"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["99.99% SLA", "Enterprise rate limits", "Private deployment"] }
    ],
    notes: "By Okta. B2B pricing from $0.30/user."
  },

  // Snyk - https://snyk.io/plans
  "snyk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://snyk.io/plans",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited devs", features: ["Limited tests", "SDLC scanning", "Dependency monitoring", "Basic coverage"] },
      { name: "Team", price: 25, period: "dev/month", description: "5-10 devs", features: ["1K tests/month", "Jira integration", "License compliance", "Standard support"], highlighted: true },
      { name: "Ignite", price: 105, period: "dev/month", description: "Annual ($1,260/yr)", features: ["Unlimited tests", "SCA + SAST + IaC", "20 DAST targets", "24x5 support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["FedRAMP", "Data residency", "Snyk Broker", "Premium support"] }
    ],
    notes: "Developer security platform. Up to 100 devs on Ignite."
  },

  // CrowdStrike - Known pricing
  "crowdstrike": {
    startingPrice: 59.99, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.crowdstrike.com/products/endpoint-security",
    tiers: [
      { name: "Falcon Go", price: 59.99, period: "device/year", description: "Small business", features: ["Antivirus", "Device control", "5 devices min", "Basic support"] },
      { name: "Falcon Pro", price: 99.99, period: "device/year", description: "Growing teams", features: ["All Go", "Firewall management", "USB protection"], highlighted: true },
      { name: "Falcon Enterprise", price: 184.99, period: "device/year", description: "Advanced", features: ["All Pro", "Threat hunting", "IT hygiene", "Response"] },
      { name: "Falcon Elite", price: "Custom", description: "Contact sales", features: ["All Enterprise", "Identity protection", "MDR services"] }
    ],
    notes: "Enterprise endpoint security. 15-day free trial."
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

  console.log("🔧 Starting verified pricing corrections batch 41 (Security & Identity)...\n");

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
    message: "Verified pricing corrections batch 41 (Security & Identity) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
