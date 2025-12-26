import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Eighth batch of verified pricing from WebFetch (December 2025) - Developer & Hosting Tools
const verifiedPricing: Record<string, object> = {
  // Vercel - https://vercel.com/pricing
  "vercel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://vercel.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free forever", features: ["Automatic CI/CD", "Global CDN", "DDoS mitigation", "Traffic insights"] },
      { name: "Pro", price: 20, period: "month", description: "+ usage", features: ["$20 usage credit", "Team collaboration", "Faster builds", "Cold start prevention"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SCIM sync", "99.99% SLA", "Multi-region compute", "Advanced support"] }
    ]
  },

  // Netlify - https://www.netlify.com/pricing/
  "netlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.netlify.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "300 credits/mo", features: ["Build & deploy", "Basic features", "Community support"] },
      { name: "Personal", price: 9, period: "month", description: "1000 credits/mo", features: ["Analytics", "Priority support", "More builds"] },
      { name: "Pro", price: 20, period: "member/month", description: "3000 credits/mo", features: ["Private repos", "Concurrent builds", "Team features"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "99.99% SLA", features: ["Dedicated support", "Custom SLA", "Enterprise features"] }
    ],
    notes: "Credit-based usage for deploys, compute, bandwidth, and forms"
  },

  // Render - https://render.com/pricing
  "render": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://render.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Personal projects", features: ["Free static sites", "512MB services", "Shared resources"] },
      { name: "Professional", price: 19, period: "user/month", description: "Production apps", features: ["Faster builds", "More resources", "Team features"], highlighted: true },
      { name: "Organization", price: 29, period: "user/month", description: "High traffic", features: ["Compliance needs", "More control", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Critical apps", features: ["Enterprise security", "Custom SLAs", "Dedicated support"] }
    ],
    notes: "Web services from $7/mo. Prorated by the second."
  },

  // Railway - https://railway.com/pricing
  "railway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://railway.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "$5 trial credit", features: ["30-day trial", "0.5GB RAM", "1 vCPU per service"] },
      { name: "Hobby", price: 5, period: "month min", description: "Includes $5 credit", features: ["8GB RAM/service", "8 vCPU/service", "Personal projects"], highlighted: true },
      { name: "Pro", price: 20, period: "month min", description: "Includes $20 credit", features: ["32GB RAM/service", "Unlimited seats", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Dedicated VMs", "SSO", "HIPAA BAAs"] }
    ],
    notes: "Usage-based: Memory $0.000004/GB/sec, CPU $0.000008/vCPU/sec"
  },

  // Fly.io - https://fly.io/docs/about/pricing/
  "fly-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://fly.io/docs/about/pricing/",
    tiers: [
      { name: "Pay as you go", price: 0, description: "Usage-based", features: ["Billed by second", "Global deployment", "Free tier available"], highlighted: true },
      { name: "Reservations", price: 36, period: "year", description: "40% discount", features: ["$5/mo credit", "Committed usage", "Best value"] }
    ],
    notes: "Shared CPU from $2/mo. GPUs: A10 $1.50/hr, A100 $2.50-3.50/hr. Volumes $0.15/GB/mo."
  },

  // Supabase - https://supabase.com/pricing
  "supabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50K MAUs", features: ["500MB database", "5GB egress", "1GB file storage", "2 active projects"] },
      { name: "Pro", price: 25, period: "month", description: "100K MAUs", features: ["8GB disk", "250GB egress", "7-day backups", "$10 compute credit"], highlighted: true },
      { name: "Team", price: 599, period: "month", description: "SOC2 compliant", features: ["SSO", "Priority support", "14-day backups"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Designated manager", "99.9% SLA", "24/7 support"] }
    ],
    notes: "Custom domain $10/mo. PITR from $100/mo."
  },

  // PlanetScale - https://planetscale.com/pricing
  "planetscale": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://planetscale.com/pricing",
    tiers: [
      { name: "Single Node", price: 5, period: "month", description: "Non-HA", features: ["PostgreSQL", "Basic features", "Development use"] },
      { name: "PS-5 HA", price: 15, period: "month", description: "3-node cluster", features: ["1/16 vCPU", "512MB memory", "High availability"], highlighted: true },
      { name: "Scaler Pro", price: "Pay as you go", description: "Up to 12% discount", features: ["10GB included", "$0.50/GB storage", "$0.06/GB egress"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["BYO cloud", "Migration help", "Slack support"] }
    ]
  },

  // DigitalOcean - https://www.digitalocean.com/pricing
  "digitalocean": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.digitalocean.com/pricing",
    tiers: [
      { name: "Droplets", price: 4, period: "month", description: "VPS starting", features: ["1 vCPU", "512MB RAM", "10GB SSD"], highlighted: true },
      { name: "App Platform", price: 0, period: "month", description: "Free tier", features: ["Static sites", "Containers", "Auto-scaling"] },
      { name: "Managed DB", price: 15, period: "month", description: "Postgres/MySQL", features: ["Automated backups", "High availability"] },
      { name: "Kubernetes", price: 12, period: "month", description: "Per cluster", features: ["Managed K8s", "Load balancing"] }
    ],
    notes: "GPU Droplets from $1.49/GPU/hr. Object storage from $5/mo."
  },

  // Heroku - https://www.heroku.com/pricing
  "heroku": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.heroku.com/pricing",
    tiers: [
      { name: "Eco", price: 5, period: "month", description: "0.5GB RAM", features: ["Sleeps after 30min", "1000 dyno hours", "Good for learning"] },
      { name: "Basic", price: 7, period: "month", description: "0.5GB RAM", features: ["No sleep", "Always on", "Basic features"], highlighted: true },
      { name: "Standard-1X", price: 25, period: "month", description: "0.5GB RAM", features: ["Horizontal scaling", "Preboot", "Metrics"] },
      { name: "Performance-M", price: 250, period: "month", description: "2.5GB RAM", features: ["Dedicated resources", "Auto-scaling", "Production-ready"] }
    ],
    notes: "Postgres from $5/mo. Redis from $3/mo. Kafka from $100/mo."
  },

  // GitHub - https://github.com/pricing
  "github": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://github.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["Unlimited repos", "2000 CI/CD minutes", "500MB packages", "Community support"] },
      { name: "Team", price: 4, period: "user/month", description: "First 12 months", features: ["3000 CI/CD minutes", "2GB packages", "Code owners", "Web support"], highlighted: true },
      { name: "Enterprise", price: 21, period: "user/month", description: "First 12 months", features: ["50000 CI/CD minutes", "50GB packages", "SAML SSO", "Premium support"] }
    ],
    notes: "Copilot, Advanced Security, Codespaces available as add-ons"
  },

  // GitLab - https://about.gitlab.com/pricing/
  "gitlab": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://about.gitlab.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Personal projects", features: ["400 compute min/mo", "10 GiB storage", "5 users"] },
      { name: "Premium", price: 29, period: "user/month", description: "Annual billing", features: ["10K compute min/mo", "Unlimited users", "AI Code Suggestions"], highlighted: true },
      { name: "Ultimate", price: "Custom", description: "Contact sales", features: ["50K compute min/mo", "Unlimited guests", "Advanced security"] }
    ],
    notes: "Duo Pro $19/user/mo. Extra compute $10/1K min. Storage $5/10 GiB."
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

  console.log("🔧 Starting verified pricing corrections batch 8 (Developer & Hosting)...\n");

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
    message: "Verified pricing corrections batch 8 (Developer & Hosting) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
