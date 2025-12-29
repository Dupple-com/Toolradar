import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 72: Code Hosting & Version Control pricing
const verifiedPricing: Record<string, object> = {
  "github": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://github.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited repos", "2K Actions minutes", "500MB packages"], highlighted: true },
      { name: "Team", price: 4, period: "user/month", description: "Teams", features: ["3K Actions minutes", "2GB packages", "Code owners"] },
      { name: "Enterprise", price: 21, period: "user/month", description: "Enterprise", features: ["50K Actions minutes", "50GB packages", "SAML SSO"] }
    ],
    notes: "World's largest code hosting. Free tier generous."
  },
  "gitlab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://about.gitlab.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "400 CI/CD minutes", "5GB storage"] },
      { name: "Premium", price: 29, period: "user/month", description: "Annual", features: ["Unlimited users", "10K minutes", "50GB storage"], highlighted: true }
    ],
    notes: "Complete DevOps platform. Free tier limited."
  },
  "bitbucket": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/bitbucket/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "50 build minutes", "1GB LFS"] },
      { name: "Standard", price: 3, period: "user/month", description: "Annual", features: ["Unlimited users", "2500 minutes", "5GB LFS"], highlighted: true }
    ],
    notes: "Atlassian code hosting. Free for 5 users."
  },
  "sourcehut": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://sourcehut.org/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Git hosting", "CI/CD", "Mailing lists"], highlighted: true },
      { name: "Paid", price: 20, period: "year", description: "Support", features: ["Priority support", "Larger limits", "Support project"] }
    ],
    notes: "Minimal code forge. Free for OSS."
  },
  "gitea": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gitea.io",
    tiers: [{ name: "Free", price: 0, description: "Self-hosted", features: ["Git hosting", "CI/CD", "Packages", "Wikis"], highlighted: true }],
    notes: "Free and open source. Self-hosted."
  },
  "gogs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gogs.io",
    tiers: [{ name: "Free", price: 0, description: "Self-hosted", features: ["Git hosting", "Lightweight", "Cross-platform"], highlighted: true }],
    notes: "Painless self-hosted Git. Open source."
  },
  "codeberg": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://codeberg.org",
    tiers: [{ name: "Free", price: 0, description: "Non-profit", features: ["Git hosting", "CI/CD", "Pages", "Open source"], highlighted: true }],
    notes: "Non-profit Git hosting. Free."
  },
  "sr-ht": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://sr.ht",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Git/Mercurial", "CI/CD", "Mailing lists"], highlighted: true },
      { name: "Supporter", price: 2, period: "month", description: "Support", features: ["Priority support", "Sustain project"] }
    ],
    notes: "Hacker-focused code forge."
  },
  "perforce": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.perforce.com/products/helix-core/free-version-control",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "20 workspaces", "Full features"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited users", "Enterprise support", "SLA"] }
    ],
    notes: "Enterprise version control. Free for 5."
  },
  "plastic-scm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.plasticscm.com/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Unlimited repos", "3 users", "Gluon support"], highlighted: true },
      { name: "Cloud", price: 9, period: "user/month", description: "Monthly", features: ["Unlimited users", "Cloud hosting", "Support"] }
    ],
    notes: "Version control for games/art. Free tier."
  },
  "fossil": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fossil-scm.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Version control", "Wiki", "Bug tracking", "Forum"], highlighted: true }],
    notes: "All-in-one SCM. Free and open source."
  },
  "azure-devops": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://azure.microsoft.com/pricing/details/devops/azure-devops-services",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "Unlimited repos", "1 parallel job"], highlighted: true },
      { name: "Basic", price: 6, period: "user/month", description: "Monthly", features: ["Unlimited users", "Test plans", "More pipelines"] }
    ],
    notes: "Microsoft DevOps. Free for 5 users."
  },
  "aws-codecommit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://aws.amazon.com/codecommit/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 active users", "50GB storage", "10K requests"], highlighted: true },
      { name: "Pay as you go", price: 0.001, period: "per request", description: "Usage", features: ["$1/user", "$.06/GB", "Unlimited"] }
    ],
    notes: "AWS Git hosting. Free tier."
  },
  "google-cloud-source": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://cloud.google.com/source-repositories/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 users", "50GB storage", "Unlimited repos"], highlighted: true },
      { name: "Pay as you go", price: 1, period: "user/month", description: "Usage", features: ["$1/user", "$.10/GB storage"] }
    ],
    notes: "GCP Git hosting. Free for 5 users."
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
    message: "Pricing batch 72 (Code Hosting & VCS) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
