import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 73: Container & Orchestration pricing
const verifiedPricing: Record<string, object> = {
  "docker": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.docker.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free", features: ["Unlimited public repos", "200 pulls/6h", "Docker Desktop"], highlighted: true },
      { name: "Pro", price: 5, period: "month", description: "Annual", features: ["5K pulls/day", "Unlimited teams", "Scout features"] },
      { name: "Team", price: 9, period: "user/month", description: "Annual", features: ["15K pulls/day", "RBAC", "Audit logs"] }
    ],
    notes: "Container platform. Free for personal."
  },
  "kubernetes": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://kubernetes.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Container orchestration", "Self-healing", "Service discovery", "Auto-scaling"], highlighted: true }],
    notes: "Free and open source. CNCF project."
  },
  "rancher": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.rancher.com/products/rancher",
    tiers: [
      { name: "Open Source", price: 0, description: "Free", features: ["Kubernetes management", "Multi-cluster", "Catalog"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["24/7 support", "SLA", "Consulting"] }
    ],
    notes: "Kubernetes management. Open source."
  },
  "portainer": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.portainer.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Docker/K8s mgmt", "1 environment", "Community support"], highlighted: true },
      { name: "Business", price: 0, period: "node/year", description: "$5/node/mo", features: ["Unlimited envs", "RBAC", "Registry mgmt"] }
    ],
    notes: "Container management UI. Free tier."
  },
  "podman": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://podman.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Daemonless", "Rootless", "Docker compatible", "Pods"], highlighted: true }],
    notes: "Free and open source. Red Hat."
  },
  "containerd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://containerd.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Container runtime", "CNCF graduated", "Industry standard"], highlighted: true }],
    notes: "Free and open source. CNCF graduated."
  },
  "helm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://helm.sh",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Package manager", "Charts", "Templating", "Releases"], highlighted: true }],
    notes: "Free and open source. CNCF project."
  },
  "k3s": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://k3s.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Lightweight K8s", "Edge/IoT", "Single binary", "ARM support"], highlighted: true }],
    notes: "Lightweight Kubernetes. CNCF sandbox."
  },
  "minikube": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://minikube.sigs.k8s.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Local K8s", "Multi-node", "Addons", "Multi-driver"], highlighted: true }],
    notes: "Local Kubernetes for development."
  },
  "kind": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://kind.sigs.k8s.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["K8s in Docker", "CI testing", "Multi-node", "Fast startup"], highlighted: true }],
    notes: "Kubernetes in Docker. For testing."
  },
  "docker-compose": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://docs.docker.com/compose",
    tiers: [{ name: "Free", price: 0, description: "Included", features: ["Multi-container apps", "YAML config", "Docker integration"], highlighted: true }],
    notes: "Free with Docker."
  },
  "docker-swarm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://docs.docker.com/engine/swarm",
    tiers: [{ name: "Free", price: 0, description: "Included", features: ["Container orchestration", "Native Docker", "Simple setup"], highlighted: true }],
    notes: "Free with Docker."
  },
  "nomad": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.hashicorp.com/products/nomad/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Free", features: ["Orchestration", "Multi-cloud", "Integrations"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Namespaces", "SSO", "Audit logging"] }
    ],
    notes: "HashiCorp orchestrator. Open source."
  },
  "eks": {
    startingPrice: 0.10, currency: "USD", billingPeriod: "hour", hasFreeTrial: false,
    pricingPageUrl: "https://aws.amazon.com/eks/pricing",
    tiers: [{ name: "Pay as you go", price: 0.10, period: "cluster/hour", description: "Usage", features: ["Managed K8s", "AWS integration", "Auto-scaling"], highlighted: true }],
    notes: "AWS managed Kubernetes. $72/mo per cluster."
  },
  "gke": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://cloud.google.com/kubernetes-engine/pricing",
    tiers: [
      { name: "Autopilot", price: 0.10, period: "cluster/hour", description: "Managed", features: ["Fully managed", "Per-pod billing", "Auto-scaling"], highlighted: true },
      { name: "Standard", price: 0.10, period: "cluster/hour", description: "Control", features: ["Node management", "GPU support", "More control"] }
    ],
    notes: "Google managed Kubernetes."
  },
  "aks": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://azure.microsoft.com/pricing/details/kubernetes-service",
    tiers: [{ name: "Free tier", price: 0, description: "Usage", features: ["Free control plane", "Pay for nodes", "Azure integration"], highlighted: true }],
    notes: "Azure Kubernetes. Free control plane."
  },
  "openshift": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://www.redhat.com/en/technologies/cloud-computing/openshift/pricing",
    tiers: [
      { name: "Developer Sandbox", price: 0, description: "Free trial", features: ["Free cluster", "30-day access", "Learning"] },
      { name: "Kubernetes", price: 0, period: "custom", description: "Custom", features: ["Enterprise K8s", "Support", "Security"], highlighted: true }
    ],
    notes: "Red Hat enterprise Kubernetes."
  },
  "fly-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fly.io/docs/about/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free", features: ["3 shared VMs", "160GB bandwidth", "3GB storage"], highlighted: true },
      { name: "Launch", price: 29, period: "month", description: "Starting", features: ["Dedicated VMs", "More bandwidth", "Priority support"] }
    ],
    notes: "Edge app platform. Generous free tier."
  },
  "railway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://railway.app/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "$5 credit", features: ["$5 credit/mo", "1GB RAM", "1GB disk"], highlighted: true },
      { name: "Pro", price: 5, period: "month", description: "Pay as you go", features: ["Usage-based", "8GB RAM", "Teams"] }
    ],
    notes: "Modern PaaS. Free tier with credits."
  },
  "render": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://render.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Static sites", features: ["Static sites", "100GB bandwidth", "Custom domains"], highlighted: true },
      { name: "Individual", price: 7, period: "month", description: "Web services", features: ["512MB RAM", "0.5 CPU", "Persistent disk"] }
    ],
    notes: "Modern cloud platform. Free static."
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
    message: "Pricing batch 73 (Container & Orchestration) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
