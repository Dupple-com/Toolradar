import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 63: Security Tools pricing
const verifiedPricing: Record<string, object> = {
  "snyk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://snyk.io/plans",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["200 tests/mo", "Limited projects", "Community support"] },
      { name: "Team", price: 57, period: "user/month", description: "Teams", features: ["Unlimited tests", "Private repos", "API access"], highlighted: true }
    ],
    notes: "Open source scanning free. Team for private repos."
  },
  "trivy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://trivy.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Container scanning", "IaC scanning", "SBOM", "CI integration"], highlighted: true }],
    notes: "Free and open source. From Aqua Security."
  },
  "semgrep": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://semgrep.dev/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["OSS rules", "CLI", "Unlimited scans"], highlighted: true },
      { name: "Team", price: 40, period: "month", description: "10 users", features: ["Pro rules", "SAST", "SCA"] }
    ],
    notes: "Open-source code scanning. Free tier."
  },
  "sonarqube": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.sonarsource.com/plans-and-pricing",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["17 languages", "Quality gate", "Clean as you code"], highlighted: true },
      { name: "Developer", price: 150, period: "year", description: "Starting", features: ["Branch analysis", "PR decoration", "More languages"] }
    ],
    notes: "Community edition free. Enterprise pricing varies."
  },
  "sonarcloud": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.sonarsource.com/products/sonarcloud/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Public", features: ["Public repos", "All languages", "Unlimited analysis"] },
      { name: "Team", price: 10, period: "month", description: "Starting", features: ["Private repos", "100K LOC", "Branch analysis"], highlighted: true }
    ],
    notes: "Free for public repositories."
  },
  "dependabot": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/features/security",
    tiers: [{ name: "Free", price: 0, description: "GitHub native", features: ["Dependency updates", "Security alerts", "All languages", "Automatic PRs"], highlighted: true }],
    notes: "Free and included with GitHub."
  },
  "renovate": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.mend.io/renovate",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Dependency updates", "Multi-platform", "Automerge"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Enterprise", features: ["On-premise", "Support", "SLA"] }
    ],
    notes: "Open source. From Mend (formerly WhiteSource)."
  },
  "gitleaks": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gitleaks.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Secret scanning", "Git history", "CI integration", "Custom rules"], highlighted: true }],
    notes: "Free and open source. Detect secrets in git."
  },
  "trufflehog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://trufflesecurity.com",
    tiers: [
      { name: "Open Source", price: 0, description: "Free", features: ["Secret scanning", "700+ detectors", "Git history"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Dashboard", "RBAC", "Support"] }
    ],
    notes: "Open source secret scanner."
  },
  "owasp-zap": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.zaproxy.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["DAST", "API scanning", "CI/CD", "Automation"], highlighted: true }],
    notes: "Free and open source. OWASP flagship project."
  },
  "burp-suite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://portswigger.net/burp/pro",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Manual tools", "Basic scanning", "Community support"] },
      { name: "Professional", price: 449, period: "year", description: "Per user", features: ["Full scanner", "Extensions", "Support"], highlighted: true }
    ],
    notes: "Community edition free. Pro for full features."
  },
  "hashicorp-vault": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hashicorp.com/products/vault/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-managed", features: ["Secrets management", "Encryption", "Identity"], highlighted: true },
      { name: "HCP Vault", price: 0.03, period: "hour", description: "Cloud", features: ["Managed", "Auto-unseal", "HA"] }
    ],
    notes: "Open source free. HCP for managed cloud."
  },
  "infisical": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://infisical.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 team members", features: ["Unlimited secrets", "Basic integrations", "Community support"], highlighted: true },
      { name: "Pro", price: 5, period: "user/month", description: "Teams", features: ["SSO", "Audit logs", "IP allowlisting"] }
    ],
    notes: "Open-source secrets management. Free tier."
  },
  "doppler": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.doppler.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 seats", features: ["Unlimited secrets", "CLI", "Integrations"], highlighted: true },
      { name: "Team", price: 6, period: "user/month", description: "Teams", features: ["Audit logs", "Service accounts", "SSO"] }
    ],
    notes: "Secrets management. Free for 5 seats."
  },
  "1password-business": {
    startingPrice: 7.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://1password.com/business",
    tiers: [
      { name: "Teams", price: 19.95, period: "month", description: "Up to 10", features: ["10 users", "5GB storage", "Guest accounts"] },
      { name: "Business", price: 7.99, period: "user/month", description: "Per user", features: ["SSO", "Advanced reports", "Custom roles"], highlighted: true }
    ],
    notes: "Team password management."
  },
  "bitwarden": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://bitwarden.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited passwords", "2 users", "Core features"], highlighted: true },
      { name: "Teams", price: 4, period: "user/month", description: "Starting", features: ["Unlimited users", "Groups", "Directory connector"] }
    ],
    notes: "Open-source password manager. Free tier."
  },
  "falco": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://falco.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Runtime security", "Kubernetes native", "eBPF based", "CNCF project"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "wazuh": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://wazuh.com",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["SIEM", "XDR", "Compliance", "Cloud security"], highlighted: true },
      { name: "Cloud", price: 0, period: "custom", description: "Managed", features: ["Managed hosting", "Support", "SLA"] }
    ],
    notes: "Free and open source. Enterprise SIEM."
  },
  "crowdstrike": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.crowdstrike.com/falcon/pricing",
    tiers: [
      { name: "Falcon Go", price: 59.99, period: "device/year", description: "SMB", features: ["Endpoint protection", "Cloud security", "5 devices min"], highlighted: true }
    ],
    notes: "Enterprise endpoint protection."
  },
  "cloudflare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.cloudflare.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["CDN", "DDoS protection", "SSL", "Basic analytics"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "Professional", features: ["WAF", "Image optimization", "Mobile optimization"] },
      { name: "Business", price: 200, period: "month", description: "Business", features: ["Custom SSL", "100% uptime SLA", "PCI compliance"] }
    ],
    notes: "Free CDN and security. Pro for advanced features."
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
    message: "Pricing batch 63 (Security Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
