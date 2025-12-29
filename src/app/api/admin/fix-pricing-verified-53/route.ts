import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 53: Cloud Infrastructure pricing
const verifiedPricing: Record<string, object> = {
  "hetzner": {
    startingPrice: 4.51, currency: "EUR", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.hetzner.com/cloud",
    tiers: [
      { name: "CX22", price: 4.51, period: "month", description: "2 vCPU, 4GB", features: ["2 vCPU", "4GB RAM", "40GB SSD", "20TB traffic"], highlighted: true },
      { name: "CX32", price: 8.39, period: "month", description: "4 vCPU, 8GB", features: ["4 vCPU", "8GB RAM", "80GB SSD", "20TB traffic"] },
      { name: "Dedicated", price: 39, period: "month", description: "Starting", features: ["Intel/AMD CPUs", "Full control", "Root access"] }
    ],
    notes: "European cloud with excellent price-performance."
  },
  "digitalocean": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://www.digitalocean.com/pricing",
    tiers: [
      { name: "Basic Droplet", price: 4, period: "month", description: "1 vCPU, 512MB", features: ["1 vCPU", "512MB RAM", "10GB SSD"] },
      { name: "Regular", price: 6, period: "month", description: "1 vCPU, 1GB", features: ["1 vCPU", "1GB RAM", "25GB SSD", "1TB transfer"], highlighted: true },
      { name: "Premium", price: 8, period: "month", description: "1 vCPU, 2GB", features: ["1 vCPU", "2GB RAM", "50GB NVMe"] }
    ],
    notes: "$200 credit for 60 days on signup."
  },
  "vultr": {
    startingPrice: 2.50, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.vultr.com/pricing",
    tiers: [
      { name: "Cloud Compute", price: 2.50, period: "month", description: "512MB", features: ["1 vCPU", "512MB RAM", "10GB SSD"] },
      { name: "Regular", price: 5, period: "month", description: "1GB", features: ["1 vCPU", "1GB RAM", "25GB SSD", "1TB bandwidth"], highlighted: true },
      { name: "High Frequency", price: 6, period: "month", description: "1GB HF", features: ["1 vCPU", "1GB RAM", "32GB NVMe", "3GHz+"] }
    ],
    notes: "$100-$300 credit available with promo codes."
  },
  "linode": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.linode.com/pricing",
    tiers: [
      { name: "Nanode", price: 5, period: "month", description: "1GB Shared", features: ["1 vCPU", "1GB RAM", "25GB storage", "1TB transfer"], highlighted: true },
      { name: "Linode 2GB", price: 12, period: "month", description: "2GB Shared", features: ["1 vCPU", "2GB RAM", "50GB storage"] },
      { name: "Dedicated 4GB", price: 36, period: "month", description: "Dedicated", features: ["2 CPU cores", "4GB RAM", "80GB storage"] }
    ],
    notes: "Now part of Akamai. $100 credit for new signups."
  },
  "render": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://render.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Static sites", features: ["100GB bandwidth", "Auto deploys", "SSL"] },
      { name: "Starter", price: 7, period: "month", description: "Web services", features: ["512MB RAM", "0.5 CPU", "Persistent disk"], highlighted: true },
      { name: "Standard", price: 25, period: "month", description: "Production", features: ["2GB RAM", "1 CPU", "Auto-scaling"] }
    ],
    notes: "Static sites free. Free tier for web services with limitations."
  },
  "flyio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fly.io/docs/about/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["3 shared VMs", "3GB storage", "160GB bandwidth"] },
      { name: "Pay as you go", price: 1.94, period: "month", description: "Per shared VM", features: ["256MB RAM", "Edge deployment", "Auto-scaling"], highlighted: true }
    ],
    notes: "Edge deployment platform. Free tier available."
  },
  "railway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://railway.app/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free", features: ["500 hours/mo", "1GB RAM", "100GB bandwidth"] },
      { name: "Pro", price: 20, period: "month", description: "Teams", features: ["Unlimited deploys", "Autoscaling", "Team features"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["SOC2", "SSO", "Dedicated support"] }
    ],
    notes: "Usage-based after $5 credit. Great for quick deployments."
  },
  "upcloud": {
    startingPrice: 5, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 3,
    pricingPageUrl: "https://upcloud.com/pricing",
    tiers: [
      { name: "Developer", price: 5, period: "month", description: "1 CPU", features: ["1 CPU", "1GB RAM", "25GB MaxIOPS"], highlighted: true },
      { name: "General Purpose", price: 10, period: "month", description: "2 CPU", features: ["2 CPU", "2GB RAM", "50GB storage"] },
      { name: "High Memory", price: 20, period: "month", description: "2 CPU, 8GB", features: ["2 CPU", "8GB RAM", "80GB storage"] }
    ],
    notes: "European cloud with 100% SLA guarantee."
  },
  "scaleway": {
    startingPrice: 0.0025, currency: "EUR", billingPeriod: "hour", hasFreeTrial: false,
    pricingPageUrl: "https://www.scaleway.com/en/pricing",
    tiers: [
      { name: "STARDUST1", price: 1.83, period: "month", description: "1vCPU, 1GB", features: ["1 vCPU", "1GB RAM", "10GB local", "100Mbps"] },
      { name: "DEV1-S", price: 7.99, period: "month", description: "2 vCPU, 2GB", features: ["2 vCPU", "2GB RAM", "20GB SSD"], highlighted: true },
      { name: "GP1-XS", price: 21, period: "month", description: "4 vCPU, 16GB", features: ["4 vCPU", "16GB RAM", "150GB SSD"] }
    ],
    notes: "French cloud provider. Serverless offerings available."
  },
  "oracle-cloud": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.oracle.com/cloud/free",
    tiers: [
      { name: "Always Free", price: 0, description: "Free tier", features: ["2 AMD VMs", "4 Arm VMs", "200GB storage", "10TB bandwidth"], highlighted: true },
      { name: "Flex VM", price: 0.0576, period: "OCPU/hour", description: "Pay as you go", features: ["Flexible shapes", "AMD/Arm", "NVMe storage"] }
    ],
    notes: "Generous always-free tier with 4 Arm instances."
  },
  "ovhcloud": {
    startingPrice: 3.50, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.ovhcloud.com/en/public-cloud/prices",
    tiers: [
      { name: "Starter", price: 3.50, period: "month", description: "Sandbox", features: ["1 vCore", "2GB RAM", "20GB SSD"] },
      { name: "Discovery", price: 8.50, period: "month", description: "Dev", features: ["2 vCores", "4GB RAM", "40GB SSD"], highlighted: true },
      { name: "General Purpose", price: 25, period: "month", description: "Production", features: ["4 vCores", "15GB RAM", "100GB SSD"] }
    ],
    notes: "European cloud with data sovereignty focus."
  },
  "coolify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://coolify.io/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Free forever", features: ["Unlimited servers", "Unlimited apps", "Full control"], highlighted: true },
      { name: "Cloud", price: 5, period: "month", description: "Managed", features: ["2 servers", "Unlimited apps", "Managed updates"] },
      { name: "Cloud Pro", price: 25, period: "month", description: "Teams", features: ["10 servers", "Team features", "Priority support"] }
    ],
    notes: "Open-source alternative to Heroku/Vercel."
  },
  "dokku": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://dokku.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Self-hosted PaaS", "Docker-based", "Heroku buildpacks", "Git push deploy"], highlighted: true }],
    notes: "Free and open source. Self-hosted mini-Heroku."
  },
  "caprover": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://caprover.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Self-hosted PaaS", "One-click apps", "Free SSL", "Docker Swarm"], highlighted: true }],
    notes: "Free and open source. Easy to use PaaS."
  },
  "kubernetes": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://kubernetes.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Container orchestration", "Auto-scaling", "Self-healing", "Rolling updates"], highlighted: true }],
    notes: "Free and open source. Cloud providers charge for managed K8s."
  },
  "k3s": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://k3s.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Lightweight K8s", "Single binary", "IoT/Edge ready", "Low memory"], highlighted: true }],
    notes: "Free lightweight Kubernetes from Rancher."
  },
  "rancher": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.rancher.com/products/rancher",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Multi-cluster", "Full UI", "Community support"], highlighted: true },
      { name: "Prime", price: 0, period: "custom", description: "Enterprise", features: ["24/7 support", "LTS releases", "Security patches"] }
    ],
    notes: "Free and open source. Enterprise support available."
  },
  "portainer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 5,
    pricingPageUrl: "https://www.portainer.io/pricing-new",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["5 nodes", "Docker/K8s", "Web UI"], highlighted: true },
      { name: "Business", price: 5, period: "node/month", description: "Annual", features: ["Unlimited nodes", "RBAC", "Support"] }
    ],
    notes: "Free for 5 nodes. Container management UI."
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
    message: "Pricing batch 53 (Cloud Infrastructure) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
