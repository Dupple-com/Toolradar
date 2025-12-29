import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 59: Observability & Monitoring pricing
const verifiedPricing: Record<string, object> = {
  "grafana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://grafana.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Unlimited dashboards", "All visualizations", "Alerting"], highlighted: true },
      { name: "Cloud Free", price: 0, description: "10K metrics", features: ["10K series", "50GB logs", "3 users"] },
      { name: "Cloud Pro", price: 29, period: "month", description: "Starting", features: ["50K series", "100GB logs", "8 users"] }
    ],
    notes: "Self-hosted is fully free. Cloud has free tier."
  },
  "prometheus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://prometheus.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Time series DB", "PromQL", "Alerting", "Service discovery"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "datadog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.datadoghq.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 hosts", features: ["1-day retention", "Core integrations", "5 hosts limit"] },
      { name: "Pro", price: 15, period: "host/month", description: "Annual", features: ["15-month retention", "500+ integrations", "Alerts"], highlighted: true },
      { name: "Enterprise", price: 23, period: "host/month", description: "Annual", features: ["Watchdog", "SLOs", "Compliance"] }
    ],
    notes: "Per-host pricing. Free for up to 5 hosts."
  },
  "new-relic": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://newrelic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "100GB/mo", features: ["100GB data ingest", "1 full user", "Unlimited basic users"], highlighted: true },
      { name: "Standard", price: 99, period: "user/month", description: "Annual", features: ["Data Plus", "Streaming export", "Compliance"] },
      { name: "Pro", price: 349, period: "user/month", description: "Annual", features: ["All features", "SLA", "Enterprise support"] }
    ],
    notes: "Generous free tier. 100GB/month data included."
  },
  "dynatrace": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.dynatrace.com/pricing",
    tiers: [
      { name: "Full Stack", price: 69, period: "host/month", description: "Starting", features: ["APM", "Infrastructure", "Real user monitoring", "AI-powered"], highlighted: true }
    ],
    notes: "15-day free trial. Per-host pricing."
  },
  "splunk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.splunk.com/en_us/products/pricing.html",
    tiers: [
      { name: "Free", price: 0, description: "500MB/day", features: ["500MB daily ingest", "No alerts", "60 days retention"], highlighted: true },
      { name: "Cloud", price: 0, period: "workload", description: "Custom", features: ["Unlimited data", "Alerts", "SVCs"] }
    ],
    notes: "Free tier with 500MB/day. Enterprise pricing is custom."
  },
  "elastic-apm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.elastic.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["APM", "Distributed tracing", "All features"], highlighted: true },
      { name: "Cloud Standard", price: 95, period: "month", description: "Starting", features: ["Managed hosting", "Auto-scaling", "Support"] }
    ],
    notes: "Self-managed is free. Cloud has consumption pricing."
  },
  "honeycomb": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.honeycomb.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "20M events", features: ["20M events/mo", "BubbleUp", "SLOs"], highlighted: true },
      { name: "Pro", price: 130, period: "month", description: "Starting", features: ["100M events", "Advanced retention", "Team features"] }
    ],
    notes: "Observability for distributed systems. Free tier."
  },
  "sentry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://sentry.io/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "Free", features: ["5K errors", "1 user", "30 day retention"] },
      { name: "Team", price: 26, period: "month", description: "Starting", features: ["50K errors", "Unlimited users", "90 day retention"], highlighted: true },
      { name: "Business", price: 80, period: "month", description: "Growing", features: ["100K errors", "SSO", "Priority support"] }
    ],
    notes: "Error tracking. Free tier available."
  },
  "bugsnag": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.bugsnag.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "7.5K events", features: ["7500 events/mo", "2 projects", "7 day retention"] },
      { name: "Team", price: 59, period: "month", description: "Starting", features: ["25K events", "Unlimited projects", "90 day retention"], highlighted: true }
    ],
    notes: "Error monitoring. Free tier available."
  },
  "rollbar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://rollbar.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5K events", features: ["5K events/mo", "30 day retention", "1 user"] },
      { name: "Essentials", price: 12.50, period: "month", description: "Starting", features: ["25K events", "Unlimited users", "90 days"], highlighted: true }
    ],
    notes: "Error tracking. Free tier with 5K events."
  },
  "raygun": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://raygun.com/pricing",
    tiers: [
      { name: "Small Business", price: 4, period: "month", description: "Billed yearly", features: ["10K error events", "100K sessions", "1 user"], highlighted: true },
      { name: "Startup", price: 16, period: "month", description: "Billed yearly", features: ["50K events", "500K sessions", "2 users"] }
    ],
    notes: "Error and performance monitoring. 14-day trial."
  },
  "jaeger": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.jaegertracing.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Distributed tracing", "Service dependency", "Root cause analysis", "Multi-backend"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "zipkin": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://zipkin.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Distributed tracing", "Latency tracking", "Service dependencies"], highlighted: true }],
    notes: "Free and open source. From Twitter."
  },
  "opentelemetry": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://opentelemetry.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Traces, metrics, logs", "Vendor neutral", "Auto-instrumentation", "CNCF project"], highlighted: true }],
    notes: "Free and open source. Standard for observability."
  },
  "loki": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://grafana.com/oss/loki",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Log aggregation", "Label-based", "Grafana native", "Low cost"], highlighted: true }],
    notes: "Free and open source. From Grafana Labs."
  },
  "signoz": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://signoz.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["Full features", "Unlimited data", "OpenTelemetry native"], highlighted: true },
      { name: "Teams", price: 199, period: "month", description: "Starting", features: ["Managed cloud", "Support", "SSO"] }
    ],
    notes: "Open-source alternative to Datadog."
  },
  "uptrace": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://uptrace.dev/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Open source", "Traces, metrics, logs", "Unlimited data"], highlighted: true },
      { name: "Cloud", price: 0, period: "usage", description: "Pay as you go", features: ["Managed", "Support", "Free tier included"] }
    ],
    notes: "Open-source APM. Self-hosted free."
  },
  "logtail": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://betterstack.com/logtail/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1GB/mo", features: ["1GB logs/mo", "3 day retention", "Alerting"], highlighted: true },
      { name: "Team", price: 24, period: "month", description: "Starting", features: ["30GB logs", "30 day retention", "Dashboard"] }
    ],
    notes: "From Better Stack. Built on ClickHouse."
  },
  "papertrail": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.papertrail.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "50MB/mo", features: ["50MB/mo", "7 day search", "48hr retention"] },
      { name: "Pro", price: 7, period: "month", description: "1GB", features: ["1GB/mo", "1 week search", "1 year archive"], highlighted: true }
    ],
    notes: "Cloud log management. Free tier available."
  },
  "logz-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://logz.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "1GB/day", features: ["1GB/day", "ELK-based", "3 day retention"], highlighted: true },
      { name: "Pro", price: 89, period: "month", description: "Starting", features: ["More data", "14 day retention", "AI ops"] }
    ],
    notes: "Based on ELK stack. Free tier with 1GB/day."
  },
  "graylog": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://graylog.org/pricing",
    tiers: [
      { name: "Open", price: 0, description: "Self-hosted", features: ["Log management", "Search", "Dashboards", "Alerts"], highlighted: true },
      { name: "Operations", price: 1250, period: "month", description: "Starting", features: ["Enterprise features", "Support", "More retention"] }
    ],
    notes: "Open source self-hosted. Enterprise plans available."
  },
  "fluentd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.fluentd.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Unified logging", "500+ plugins", "Reliable delivery", "CNCF project"], highlighted: true }],
    notes: "Free and open source. CNCF graduated project."
  },
  "vector": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://vector.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["High performance", "Transform data", "Multi-cloud", "Rust-based"], highlighted: true }],
    notes: "Free and open source. From Datadog."
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
    message: "Pricing batch 59 (Observability & Monitoring) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
