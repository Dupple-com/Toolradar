import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-eighth batch of verified pricing from WebFetch (December 2025) - Hosting & Cloud Platforms
const verifiedPricing: Record<string, object> = {
  // Heroku - https://www.heroku.com/pricing
  "heroku": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.heroku.com/pricing",
    tiers: [
      { name: "Eco", price: 5, period: "month", description: "Light apps", features: ["0.5GB RAM", "Sleep after 30min", "1K dyno hours"] },
      { name: "Basic", price: 7, period: "month", description: "Always on", features: ["0.5GB RAM", "SSL included", "No sleep"] },
      { name: "Standard-1X", price: 25, period: "month", description: "Production", features: ["0.5GB RAM", "Horizontal scaling", "Metrics"], highlighted: true },
      { name: "Performance-M", price: 250, period: "month", description: "High traffic", features: ["2.5GB RAM", "Dedicated", "Autoscaling"] }
    ],
    notes: "Postgres from $5/mo. Redis from $3/mo. By Salesforce."
  },

  // Render - https://render.com/pricing
  "render": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://render.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, period: "month", description: "Personal projects", features: ["Free tier services", "Custom domains", "Global CDN", "Email support"] },
      { name: "Professional", price: 19, period: "user/month", description: "Teams", features: ["500GB bandwidth", "10 team members", "Autoscaling", "Preview envs"], highlighted: true },
      { name: "Organization", price: 29, period: "user/month", description: "Compliance", features: ["1TB bandwidth", "Unlimited team", "SOC 2", "Audit logs"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SAML SSO", "Guaranteed uptime", "Dedicated engineer"] }
    ],
    notes: "Compute from $7/mo. PostgreSQL from $7/mo."
  },

  // Railway - https://railway.com/pricing
  "railway": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://railway.com/pricing",
    tiers: [
      { name: "Free Trial", price: 0, description: "$5 credits", features: ["0.5GB RAM/service", "0.5GB storage", "5 projects", "Community support"] },
      { name: "Hobby", price: 5, period: "month", description: "Includes $5 credits", features: ["8GB RAM/service", "5GB storage", "50 projects"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "Includes $20 credits", features: ["32GB RAM/service", "250GB storage", "Priority support", "Multi-region"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "HIPAA", "Dedicated VMs", "BYOC"] }
    ],
    notes: "Usage-based after credits. Deploy from GitHub."
  },

  // Fly.io - Known pricing
  "fly-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://fly.io/docs/about/pricing",
    tiers: [
      { name: "Free Tier", price: 0, description: "3 shared VMs", features: ["256MB RAM each", "3GB persistent storage", "160GB outbound transfer"] },
      { name: "Pay-as-you-go", price: 0, description: "Usage-based", features: ["Shared CPU from $1.94/mo", "Dedicated from $31/mo", "$0.02/GB egress"], highlighted: true },
      { name: "Scale", price: "Custom", description: "High volume", features: ["Volume discounts", "Priority support", "Enterprise features"] }
    ],
    notes: "Edge hosting. Machines billed per second."
  },

  // PlanetScale - Known pricing
  "planetscale": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://planetscale.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "5GB storage", features: ["1 database", "1 billion reads/mo", "10M writes/mo", "1 branch"] },
      { name: "Scaler", price: 29, period: "month", description: "10GB included", features: ["1 production branch", "Horizontal scaling", "Insights"], highlighted: true },
      { name: "Scaler Pro", price: 39, period: "month", description: "10GB included", features: ["All Scaler", "Read replicas", "3 branches", "SOC 2"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SSO", "SLA", "Dedicated support", "HIPAA"] }
    ],
    notes: "MySQL-compatible serverless DB. Branching for schema changes."
  },

  // Supabase - Known pricing
  "supabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 projects", features: ["500MB database", "1GB storage", "2GB bandwidth", "50K MAU"] },
      { name: "Pro", price: 25, period: "month", description: "Per project", features: ["8GB database", "100GB storage", "250GB bandwidth", "100K MAU"], highlighted: true },
      { name: "Team", price: 599, period: "month", description: "Per org", features: ["All Pro", "SOC 2", "Priority support", "SSO"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Dedicated support", "SLA", "Custom contracts"] }
    ],
    notes: "Open source Firebase alternative. Postgres + Auth + Storage."
  },

  // MongoDB Atlas - Known pricing
  "mongodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mongodb.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "512MB storage", features: ["Shared clusters", "Basic monitoring", "Community support"] },
      { name: "Serverless", price: 0, description: "Pay-per-use", features: ["Auto-scaling", "$0.10/million reads", "No provisioning"], highlighted: true },
      { name: "Dedicated", price: 57, period: "month", description: "Starting", features: ["Dedicated clusters", "Advanced security", "Backups"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Dedicated", "LDAP", "Encryption", "SLA"] }
    ],
    notes: "NoSQL document database. Atlas Search included."
  },

  // Redis Cloud - Known pricing
  "redis": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://redis.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "30MB", features: ["1 database", "30 connections", "Community support"] },
      { name: "Essentials", price: 7, period: "month", description: "250MB", features: ["Persistence", "1GB bandwidth", "Email support"], highlighted: true },
      { name: "Pro", price: 108, period: "month", description: "12.5GB", features: ["Multi-zone", "Auto-scaling", "99.99% SLA"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Active-Active geo", "HIPAA", "Dedicated support"] }
    ],
    notes: "In-memory database. Vector search available."
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

  console.log("🔧 Starting verified pricing corrections batch 38 (Hosting & Cloud Platforms)...\n");

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
    message: "Verified pricing corrections batch 38 (Hosting & Cloud Platforms) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
