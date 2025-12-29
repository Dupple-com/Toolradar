import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 57: DevOps & CI/CD pricing
const verifiedPricing: Record<string, object> = {
  "github": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://github.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Public & private", features: ["Unlimited repos", "2000 CI/CD minutes", "500MB packages"], highlighted: true },
      { name: "Team", price: 4, period: "user/month", description: "Teams", features: ["Protected branches", "3000 CI minutes", "2GB packages"] },
      { name: "Enterprise", price: 21, period: "user/month", description: "Enterprise", features: ["50K CI minutes", "50GB packages", "SAML SSO"] }
    ],
    notes: "Free tier very generous. Actions minutes included."
  },
  "gitlab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://about.gitlab.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individual", features: ["400 CI/CD minutes", "5GB storage", "5 users"], highlighted: true },
      { name: "Premium", price: 29, period: "user/month", description: "Teams", features: ["10K CI minutes", "50GB storage", "Code owners"] },
      { name: "Ultimate", price: 99, period: "user/month", description: "Enterprise", features: ["50K CI minutes", "250GB storage", "Security scanning"] }
    ],
    notes: "Complete DevOps platform. Self-hosted available free."
  },
  "bitbucket": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/bitbucket/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["Unlimited private repos", "50 build minutes", "1GB LFS"] },
      { name: "Standard", price: 3, period: "user/month", description: "Growing teams", features: ["2500 build minutes", "5GB LFS", "Deployment permissions"], highlighted: true },
      { name: "Premium", price: 6, period: "user/month", description: "Scaling", features: ["3500 build minutes", "10GB LFS", "Merge checks"] }
    ],
    notes: "Git hosting from Atlassian. Integrates with Jira."
  },
  "circleci": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://circleci.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["6000 build min/mo", "30 jobs", "Linux/Windows/Mac"], highlighted: true },
      { name: "Performance", price: 15, period: "month", description: "Starting", features: ["Unlimited builds", "Custom concurrency", "Premium support"] },
      { name: "Scale", price: 0, period: "custom", description: "Enterprise", features: ["Dedicated resources", "SSO", "SLA"] }
    ],
    notes: "Generous free tier. Pay for compute time."
  },
  "travis-ci": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.travis-ci.com/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "10K credits", features: ["Public repos", "Limited builds", "Community support"] },
      { name: "Hobby", price: 69, period: "month", description: "25K credits", features: ["Private repos", "Email support"], highlighted: true },
      { name: "Bootstrap", price: 129, period: "month", description: "50K credits", features: ["More credits", "Priority support"] }
    ],
    notes: "Credit-based pricing. Free for open source."
  },
  "jenkins": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.jenkins.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Self-hosted CI/CD", "1800+ plugins", "Pipeline as code", "Extensible"], highlighted: true }],
    notes: "Free and open source. Self-hosted."
  },
  "teamcity": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.jetbrains.com/teamcity/buy",
    tiers: [
      { name: "Professional", price: 0, description: "Free", features: ["100 build configs", "3 agents", "Full features"], highlighted: true },
      { name: "Enterprise", price: 1999, period: "year", description: "Starting", features: ["Unlimited configs", "Custom agents", "Priority support"] }
    ],
    notes: "Free for 100 build configs. From JetBrains."
  },
  "drone": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.drone.io",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Container-native CI", "Pipeline as YAML", "GitHub/GitLab/Bitbucket"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Enterprise", features: ["Paid support", "Enterprise features"] }
    ],
    notes: "Free and open source. Container-native CI."
  },
  "semaphore": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://semaphoreci.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["1300 min/mo", "1 concurrent job", "Community support"] },
      { name: "Startup", price: 25, period: "month", description: "Teams", features: ["Unlimited jobs", "Priority support", "Secrets"], highlighted: true },
      { name: "Scaleup", price: 100, period: "month", description: "Scaling", features: ["Custom machines", "Audit logs", "RBAC"] }
    ],
    notes: "Fast CI/CD. Free tier for open source."
  },
  "buildkite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://buildkite.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Unlimited builds", "Self-hosted agents", "Community support"], highlighted: true },
      { name: "Team", price: 15, period: "user/month", description: "Teams", features: ["Team features", "SSO", "Audit logs"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Dedicated support", "SLA", "Custom contracts"] }
    ],
    notes: "Bring your own runners. Free for open source."
  },
  "azure-devops": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["Azure Pipelines", "Azure Repos", "1 parallel job"], highlighted: true },
      { name: "Basic", price: 6, period: "user/month", description: "Per user", features: ["Test Plans", "Artifacts", "More parallel jobs"] }
    ],
    notes: "Free for 5 users. Microsoft hosted runners."
  },
  "github-actions": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/features/actions",
    tiers: [
      { name: "Free", price: 0, description: "Public repos", features: ["Unlimited minutes", "Self-hosted runners", "6 concurrent jobs"], highlighted: true },
      { name: "Free (private)", price: 0, description: "2000 min/mo", features: ["Linux/Windows/Mac", "500MB storage"] }
    ],
    notes: "Included with GitHub. Free for public repos."
  },
  "terraform": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hashicorp.com/products/terraform/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["IaC", "State management", "Provider ecosystem"], highlighted: true },
      { name: "Cloud Free", price: 0, description: "500 resources", features: ["Remote state", "Remote runs", "1 concurrent run"] },
      { name: "Cloud Team", price: 20, period: "user/month", description: "Teams", features: ["Unlimited resources", "Team management", "Sentinel"] }
    ],
    notes: "CLI is free. Cloud has free tier."
  },
  "pulumi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.pulumi.com/pricing",
    tiers: [
      { name: "Individual", price: 0, description: "Free", features: ["Unlimited resources", "3 stacks", "Community support"], highlighted: true },
      { name: "Team", price: 50, period: "month", description: "Base", features: ["Unlimited stacks", "3 members", "Deployments"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["SSO", "Self-hosted", "SLA"] }
    ],
    notes: "IaC with real programming languages. Free tier."
  },
  "ansible": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.ansible.com/products/automation-platform",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Automation", "Playbooks", "Modules"], highlighted: true },
      { name: "Automation Platform", price: 0, period: "custom", description: "Enterprise", features: ["Controller", "Hub", "Analytics"] }
    ],
    notes: "Core is free. Platform pricing is custom."
  },
  "argo-cd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://argoproj.github.io/cd",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["GitOps", "Kubernetes native", "Multi-cluster", "RBAC"], highlighted: true }],
    notes: "Free and open source. GitOps for Kubernetes."
  },
  "flux-cd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fluxcd.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["GitOps", "Progressive delivery", "Multi-tenancy", "CNCF project"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "spinnaker": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://spinnaker.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Multi-cloud", "Canary analysis", "Pipeline management"], highlighted: true }],
    notes: "Free and open source. From Netflix."
  },
  "harbor": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://goharbor.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Container registry", "Vulnerability scanning", "Replication", "RBAC"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "docker-hub": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.docker.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free", features: ["1 private repo", "Unlimited public", "200 pulls/6hr"], highlighted: true },
      { name: "Pro", price: 5, period: "month", description: "Annual", features: ["Unlimited private", "5000 pulls/day", "Scout"] },
      { name: "Team", price: 9, period: "user/month", description: "Annual", features: ["Unlimited pulls", "Team management", "Build"] }
    ],
    notes: "Container registry. Free tier with rate limits."
  },
  "quay": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://quay.io/plans",
    tiers: [
      { name: "Developer", price: 0, description: "Free", features: ["Unlimited public", "Security scanning", "Build triggers"], highlighted: true },
      { name: "Micro", price: 6, period: "month", description: "5 private", features: ["5 private repos", "Robot accounts"] }
    ],
    notes: "Container registry from Red Hat. Free for public."
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
    message: "Pricing batch 57 (DevOps & CI/CD) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
