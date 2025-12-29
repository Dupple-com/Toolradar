import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 54: Database Tools pricing
const verifiedPricing: Record<string, object> = {
  "postgresql": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.postgresql.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Full-featured RDBMS", "ACID compliant", "JSON support", "Extensions"], highlighted: true }],
    notes: "Free and open source. Self-hosted."
  },
  "mysql": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.mysql.com",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["Full database", "InnoDB engine", "Replication"], highlighted: true },
      { name: "Enterprise", price: 5000, period: "year", description: "Starting", features: ["Advanced security", "Monitoring", "Support"] }
    ],
    notes: "Community edition is free. Enterprise has annual licensing."
  },
  "mariadb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://mariadb.com/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Open source", features: ["MySQL compatible", "Storage engines", "Replication"], highlighted: true },
      { name: "SkySQL", price: 65, period: "month", description: "Managed", features: ["Cloud hosted", "Auto-scaling", "Support"] }
    ],
    notes: "Community free. SkySQL for managed cloud."
  },
  "mongodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mongodb.com/pricing",
    tiers: [
      { name: "Atlas Free", price: 0, description: "512MB", features: ["512MB storage", "Shared cluster", "Basic support"] },
      { name: "Serverless", price: 0.10, period: "per million reads", description: "Pay per use", features: ["Auto-scaling", "Pay for what you use"], highlighted: true },
      { name: "Dedicated", price: 57, period: "month", description: "Starting", features: ["Dedicated cluster", "10GB+", "Advanced features"] }
    ],
    notes: "Free tier with 512MB. Serverless for variable workloads."
  },
  "redis": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://redis.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["In-memory store", "Data structures", "Pub/Sub"], highlighted: true },
      { name: "Redis Cloud Free", price: 0, description: "30MB", features: ["30MB storage", "1 DB", "Community support"] },
      { name: "Redis Cloud", price: 5, period: "month", description: "Starting", features: ["100MB+", "Multi-AZ", "Support"] }
    ],
    notes: "Free self-hosted. Redis Cloud has free tier."
  },
  "neon": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://neon.tech/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["0.5GB storage", "1 project", "Branching", "Autoscaling to 0"], highlighted: true },
      { name: "Launch", price: 19, period: "month", description: "Startups", features: ["10GB storage", "Unlimited projects", "Point-in-time recovery"] },
      { name: "Scale", price: 69, period: "month", description: "Growing", features: ["50GB storage", "Autoscaling", "IP Allow"] }
    ],
    notes: "Serverless Postgres with database branching."
  },
  "supabase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["500MB database", "1GB storage", "2 projects"] },
      { name: "Pro", price: 25, period: "month", description: "Production", features: ["8GB database", "100GB storage", "Daily backups"], highlighted: true },
      { name: "Team", price: 599, period: "month", description: "Teams", features: ["Unlimited projects", "SOC2", "Priority support"] }
    ],
    notes: "Firebase alternative. Includes auth, storage, edge functions."
  },
  "planetscale": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://planetscale.com/pricing",
    tiers: [
      { name: "Scaler", price: 29, period: "month", description: "Starting", features: ["10GB storage", "Database branching", "1B row reads"], highlighted: true },
      { name: "Scaler Pro", price: 39, period: "month", description: "Production", features: ["10GB storage", "HA replicas", "PCI compliance"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Single tenant", "SSO", "SLA"] }
    ],
    notes: "MySQL-compatible. No longer has free tier."
  },
  "turso": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://turso.tech/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["9GB total storage", "500 databases", "1B row reads"], highlighted: true },
      { name: "Scaler", price: 29, period: "month", description: "Production", features: ["24GB storage", "10K databases", "Unlimited reads"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Dedicated", "SSO", "SLA"] }
    ],
    notes: "Edge SQLite. Generous free tier."
  },
  "upstash": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://upstash.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["10K commands/day", "256MB", "Global"], highlighted: true },
      { name: "Pay as you go", price: 0.20, period: "per 100K requests", description: "Scale", features: ["Unlimited commands", "Durable storage", "Multi-region"] },
      { name: "Pro", price: 140, period: "month", description: "Business", features: ["Higher limits", "Fixed pricing", "Support"] }
    ],
    notes: "Serverless Redis, Kafka, and QStash."
  },
  "cockroachdb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.cockroachlabs.com/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Free tier", features: ["10GB storage", "50M RUs", "Serverless"], highlighted: true },
      { name: "Standard", price: 0, period: "pay as you go", description: "Production", features: ["Auto-scaling", "99.99% SLA", "Backups"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Dedicated", "SSO", "Premium support"] }
    ],
    notes: "Distributed SQL. Free tier with 10GB."
  },
  "timescaledb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.timescale.com/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Free", features: ["Time-series", "PostgreSQL extension", "Full features"], highlighted: true },
      { name: "Cloud", price: 29, period: "month", description: "Starting", features: ["Dynamic storage", "Auto backups", "Managed"] }
    ],
    notes: "Free self-hosted. Cloud starts at $29/mo."
  },
  "questdb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://questdb.io/cloud",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Time-series DB", "SQL queries", "High performance"], highlighted: true },
      { name: "Cloud", price: 75, period: "month", description: "Starting", features: ["Managed hosting", "Monitoring", "Support"] }
    ],
    notes: "Fast time-series database. Free self-hosted."
  },
  "influxdb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.influxdata.com/influxdb-pricing",
    tiers: [
      { name: "Free", price: 0, description: "Serverless", features: ["Time series", "5 dashboards", "30 days retention"], highlighted: true },
      { name: "Usage-based", price: 0, period: "varies", description: "Scale", features: ["Pay for writes/queries", "Longer retention", "Unlimited dashboards"] }
    ],
    notes: "Time-series database. Free tier available."
  },
  "singlestore": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.singlestore.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free tier", features: ["$600 credit", "Vector search", "Shared compute"] },
      { name: "Standard", price: 0, period: "pay as you go", description: "Production", features: ["Reserved compute", "Dedicated", "Unlimited scale"], highlighted: true }
    ],
    notes: "Real-time analytics database with free starter tier."
  },
  "neo4j": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://neo4j.com/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Graph database", "Cypher query", "Single instance"] },
      { name: "AuraDB Free", price: 0, description: "Cloud", features: ["50K nodes", "175K relationships", "Cloud hosted"], highlighted: true },
      { name: "AuraDB Pro", price: 65, period: "month", description: "Starting", features: ["Larger graphs", "Auto-scaling", "Support"] }
    ],
    notes: "Graph database. Free tier in cloud."
  },
  "dgraph": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://dgraph.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Shared", features: ["1GB data", "GraphQL", "5K queries/day"], highlighted: true },
      { name: "Dedicated", price: 99, period: "month", description: "Starting", features: ["Dedicated instance", "100GB+", "Unlimited queries"] }
    ],
    notes: "Distributed graph database with GraphQL."
  },
  "faunadb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fauna.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["100K read ops", "50K write ops", "500K compute ops"], highlighted: true },
      { name: "Pay as you go", price: 0, period: "usage", description: "Scale", features: ["Per operation pricing", "Global replication", "ACID transactions"] }
    ],
    notes: "Serverless document database. Free tier available."
  },
  "duckdb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://duckdb.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["In-process analytics", "SQL", "Parquet/CSV support", "Python/R bindings"], highlighted: true }],
    notes: "Free and open source. In-process OLAP database."
  },
  "sqlite": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.sqlite.org",
    tiers: [{ name: "Free", price: 0, description: "Public domain", features: ["Embedded database", "Zero-config", "Cross-platform", "ACID compliant"], highlighted: true }],
    notes: "Free and public domain. Most used database."
  },
  "airtable": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Unlimited bases", "1200 records/base", "2GB attachments"] },
      { name: "Team", price: 20, period: "user/month", description: "Annual", features: ["50K records/base", "20GB attachments", "Timeline view"], highlighted: true },
      { name: "Business", price: 45, period: "user/month", description: "Annual", features: ["125K records/base", "1000GB attachments", "Admin panel"] }
    ],
    notes: "Spreadsheet-database hybrid. Free tier available."
  },
  "nocodb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://nocodb.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "Self-hosted", features: ["Unlimited bases", "Unlimited records", "API access"], highlighted: true },
      { name: "Cloud", price: 8, period: "user/month", description: "Hosted", features: ["Managed hosting", "Unlimited workspaces", "Support"] }
    ],
    notes: "Open-source Airtable alternative. Self-hosted free."
  },
  "baserow": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://baserow.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Cloud free", features: ["Unlimited rows", "API access", "3000 rows/table"], highlighted: true },
      { name: "Premium", price: 5, period: "user/month", description: "Annual", features: ["Unlimited tables", "Row comments", "Calendar view"] },
      { name: "Self-hosted", price: 0, description: "Free", features: ["Unlimited everything", "Full control", "No limits"] }
    ],
    notes: "Open-source Airtable alternative. Generous free tier."
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
    message: "Pricing batch 54 (Database Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
