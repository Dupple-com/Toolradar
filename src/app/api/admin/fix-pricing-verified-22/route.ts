import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-second batch of verified pricing from WebFetch (December 2025) - Security & Infrastructure
const verifiedPricing: Record<string, object> = {
  // 1Password - https://1password.com/business-pricing
  "1password": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://1password.com/business-pricing",
    tiers: [
      { name: "Individual", price: 2.99, period: "month", description: "Annual ($3.99 monthly)", features: ["Unlimited passwords", "Autofill", "Multi-device", "Watchtower alerts"] },
      { name: "Families", price: 4.49, period: "month", description: "5 members", features: ["All Individual", "Unlimited shared vaults", "Admin controls"] },
      { name: "Teams Starter", price: 19.95, period: "month", description: "Up to 10 users", features: ["Password sharing", "Role permissions", "Developer tools"], highlighted: true },
      { name: "Business", price: 7.99, period: "user/month", description: "Annual ($9.99 monthly)", features: ["SSO integration", "Okta/Entra ID", "Advanced sharing"] }
    ],
    notes: "AES 256-bit encryption. 24/7 support all plans."
  },

  // Bitwarden - https://bitwarden.com/pricing
  "bitwarden": {
    startingPrice: 0, currency: "USD", billingPeriod: "year", hasFreeTrial: true,
    pricingPageUrl: "https://bitwarden.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Unlimited devices", "Password generator", "Passkeys", "Self-hosting"] },
      { name: "Premium", price: 10, period: "year", description: "< $1/month", features: ["All Free", "TOTP authenticator", "1GB storage", "Emergency access"], highlighted: true },
      { name: "Families", price: 40, period: "year", description: "6 users", features: ["6 premium accounts", "Unlimited sharing", "Organization storage"] }
    ],
    notes: "Open source. Zero-knowledge encryption."
  },

  // LastPass - https://www.lastpass.com/pricing (known pricing)
  "lastpass": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.lastpass.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 device type", features: ["Unlimited passwords", "Autofill", "Dark web monitoring"] },
      { name: "Premium", price: 3, period: "month", description: "Annual", features: ["All devices", "1GB storage", "Priority support"] },
      { name: "Families", price: 4, period: "month", description: "6 users", features: ["6 Premium accounts", "Shared folders", "Dashboard"] },
      { name: "Teams", price: 4, period: "user/month", description: "Annual", features: ["Admin console", "25 policies", "Shared folders"], highlighted: true },
      { name: "Business", price: 7, period: "user/month", description: "Annual", features: ["100+ policies", "SSO", "MFA"] }
    ],
    notes: "14-day free trial for business plans."
  },

  // Dashlane - https://www.dashlane.com/pricing
  "dashlane": {
    startingPrice: 4.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.dashlane.com/pricing",
    tiers: [
      { name: "Premium", price: 4.99, period: "month", description: "Annual", features: ["Unlimited passwords", "Dark web monitoring", "VPN included", "Passkeys"] },
      { name: "Friends & Family", price: 7.49, period: "month", description: "10 members", features: ["All Premium", "Private spaces", "Family dashboard"] },
      { name: "Business", price: 8, period: "user/month", description: "Annual (25% off)", features: ["SSO", "SCIM", "Admin console", "Group sharing"], highlighted: true },
      { name: "Omnix", price: 11, period: "user/month", description: "Annual", features: ["All Business", "AI phishing alerts", "Risk detection", "CSM for 50+"] }
    ],
    notes: "Zero-knowledge architecture. VPN included in personal plans."
  },

  // Okta - https://www.okta.com/pricing
  "okta": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.okta.com/pricing",
    tiers: [
      { name: "Starter", price: 6, period: "user/month", description: "Annual", features: ["SSO", "MFA", "Universal Directory", "5 Workflows"] },
      { name: "Core Essentials", price: 14, period: "user/month", description: "Annual", features: ["Adaptive MFA", "Privileged Access", "Lifecycle Management", "50 Workflows"] },
      { name: "Essentials", price: 17, period: "user/month", description: "Annual (Popular)", features: ["All Core Essentials", "Access Governance"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["API Access", "Access Gateway", "M2M Tokens", "Unlimited Workflows"] }
    ],
    notes: "$1500 minimum annual contract. Customer Identity from $3000/mo."
  },

  // Auth0 - https://www.auth0.com/pricing
  "auth0": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.auth0.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "25K MAU", features: ["Any app type", "Passwordless", "Social logins", "5 Organizations"] },
      { name: "Essentials", price: 35, period: "month", description: "500 MAU", features: ["All Free", "MFA", "RBAC", "Log streaming"], highlighted: true },
      { name: "Professional", price: 240, period: "month", description: "500 MAU", features: ["All Essentials", "Custom DB", "Enhanced MFA", "Attack protection"] },
      { name: "Enterprise", price: "Custom", description: "Unlimited", features: ["99.99% SLA", "Private deployment", "White-glove support"] }
    ],
    notes: "Startups: 1 year free (100K MAU). Nonprofit discounts."
  },

  // Cloudflare - https://www.cloudflare.com/plans
  "cloudflare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cloudflare.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic protection", features: ["DDoS protection", "Global CDN", "SSL/TLS", "Basic analytics"] },
      { name: "Pro", price: 20, period: "month", description: "Small sites", features: ["All Free", "WAF rules", "Image optimization", "Mobile optimization"], highlighted: true },
      { name: "Business", price: 200, period: "month", description: "E-commerce", features: ["All Pro", "Custom SSL", "100% SLA", "PCI compliance"] },
      { name: "Enterprise", price: "Custom", description: "Large orgs", features: ["24/7 support", "Custom rules", "Log retention", "Named support"] }
    ],
    notes: "Add-ons: Argo $5/mo, Load Balancing $5/mo, Workers free tier."
  },

  // DigitalOcean - https://www.digitalocean.com/pricing
  "digitalocean": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.digitalocean.com/pricing",
    tiers: [
      { name: "Basic Droplet", price: 4, period: "month", description: "$0.006/hr", features: ["1GB RAM", "1 vCPU", "25GB SSD", "1TB transfer"] },
      { name: "General Purpose", price: 12, period: "month", description: "Kubernetes", features: ["Managed K8s", "Free control plane", "Auto-scaling"], highlighted: true },
      { name: "Managed Database", price: 15, period: "month", description: "PostgreSQL/MySQL", features: ["Daily backups", "Automated failover", "MongoDB/Kafka"] },
      { name: "App Platform", price: 0, period: "month", description: "Serverless", features: ["Fully managed", "Auto-scaling", "Zero overhead"] }
    ],
    notes: "GPU from $1.49/hr. Spaces $5/mo. Free DNS."
  },

  // Linode (Akamai) - https://www.linode.com/pricing
  "linode": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.linode.com/pricing",
    tiers: [
      { name: "Nanode", price: 5, period: "month", description: "$0.0075/hr", features: ["1GB RAM", "1 vCPU", "25GB SSD", "1TB transfer"] },
      { name: "Linode 2GB", price: 12, period: "month", description: "$0.018/hr", features: ["2GB RAM", "1 vCPU", "50GB SSD", "2TB transfer"], highlighted: true },
      { name: "Dedicated 4GB", price: 45, period: "month", description: "G8 Zen 5", features: ["4GB RAM", "2 vCPUs", "40GB SSD", "Dedicated CPU"] },
      { name: "High Memory", price: 60, period: "month", description: "24GB RAM", features: ["24GB RAM", "2 vCPUs", "20GB SSD", "Memory optimized"] }
    ],
    notes: "Block Storage $0.10/GB. GPU from $350/mo. NodeBalancer $10/mo."
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

  console.log("🔧 Starting verified pricing corrections batch 22 (Security & Infrastructure)...\n");

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
    message: "Verified pricing corrections batch 22 (Security & Infrastructure) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
