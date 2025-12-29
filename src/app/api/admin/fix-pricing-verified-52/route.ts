import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 52: CMS & Headless platforms pricing
const verifiedPricing: Record<string, object> = {
  "strapi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://strapi.io/pricing-cloud",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["Unlimited users", "Full API access", "Community support"] },
      { name: "Team", price: 99, period: "month", description: "Strapi Cloud", features: ["3 seats", "10GB storage", "Priority support"], highlighted: true },
      { name: "Pro", price: 499, period: "month", description: "Cloud", features: ["5 seats", "50GB storage", "SSO", "Audit logs"] }
    ],
    notes: "Self-hosted is free. Cloud plans for managed hosting."
  },
  "sanity": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.sanity.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["3 users", "10K API requests/mo", "10GB bandwidth"] },
      { name: "Team", price: 15, period: "user/month", description: "Min 5 users", features: ["100K API requests", "100GB bandwidth", "Custom domain"], highlighted: true },
      { name: "Business", price: 99, period: "user/month", description: "Enterprise", features: ["Unlimited API", "SSO", "SLA", "Dedicated support"] }
    ],
    notes: "Pay-as-you-grow pricing with generous free tier."
  },
  "contentful": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.contentful.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["5 users", "25K records", "2 locales"] },
      { name: "Basic", price: 300, period: "month", description: "Small teams", features: ["20 users", "50K records", "8 locales"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited users", "Custom limits", "SSO", "SLA"] }
    ],
    notes: "Enterprise pricing is custom. Basic at $300/mo."
  },
  "storyblok": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.storyblok.com/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free forever", features: ["1 user", "1 space", "Visual editor"] },
      { name: "Entry", price: 99, period: "month", description: "Small teams", features: ["5 users", "Custom domain", "Priority support"], highlighted: true },
      { name: "Business", price: 449, period: "month", description: "Growing teams", features: ["10 users", "Advanced permissions", "Workflows"] }
    ],
    notes: "Visual editing is available on all tiers."
  },
  "prismic": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://prismic.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 user", "100 documents", "Slice Machine"] },
      { name: "Starter", price: 7, period: "month", description: "Small sites", features: ["3 users", "Custom types", "Scheduling"], highlighted: true },
      { name: "Medium", price: 100, period: "month", description: "Teams", features: ["Unlimited users", "1K documents", "Priority support"] }
    ],
    notes: "Per-repo pricing. Slice Machine included free."
  },
  "directus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://directus.io/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Self-hosted", features: ["Unlimited everything", "Open source", "Community support"] },
      { name: "Professional", price: 99, period: "month", description: "Directus Cloud", features: ["Standard support", "Managed hosting"], highlighted: true },
      { name: "Enterprise", price: 499, period: "month", description: "Cloud", features: ["Premium support", "SSO", "White labeling"] }
    ],
    notes: "100% open source. Self-hosting is fully free."
  },
  "payload": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://payloadcms.com/cloud-pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Unlimited everything", "TypeScript", "Full control"] },
      { name: "Standard", price: 35, period: "month", description: "Payload Cloud", features: ["1 project", "50GB storage", "Email support"], highlighted: true },
      { name: "Pro", price: 199, period: "month", description: "Teams", features: ["5 projects", "500GB storage", "Priority support"] }
    ],
    notes: "Open source. Cloud is optional managed hosting."
  },
  "ghost": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://ghost.org/pricing",
    tiers: [
      { name: "Self-hosted", price: 0, description: "Free forever", features: ["Unlimited everything", "Full control", "Open source"] },
      { name: "Starter", price: 9, period: "month", description: "Creators", features: ["500 members", "Newsletters", "Memberships"], highlighted: true },
      { name: "Creator", price: 25, period: "month", description: "Growing", features: ["1K members", "Custom integrations", "Priority support"] },
      { name: "Team", price: 50, period: "month", description: "Teams", features: ["5K members", "Unlimited staff", "Advanced analytics"] }
    ],
    notes: "Ghost(Pro) pricing. Self-hosted is free and open source."
  },
  "keystonejs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://keystonejs.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["GraphQL API", "Admin UI", "TypeScript", "Fully extensible"], highlighted: true }],
    notes: "Free and open source. Self-hosted only."
  },
  "hygraph": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://hygraph.com/pricing",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["3 users", "1M API calls", "5 environments"] },
      { name: "Self-service", price: 299, period: "month", description: "Teams", features: ["5 users", "10M API calls", "Custom roles"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited", "SSO", "SLA", "Dedicated support"] }
    ],
    notes: "GraphQL-native CMS. Formerly GraphCMS."
  },
  "datocms": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.datocms.com/pricing",
    tiers: [
      { name: "Developer", price: 0, description: "Free", features: ["1 project", "100 records", "10K API calls/mo"] },
      { name: "Professional", price: 199, period: "month", description: "Teams", features: ["Unlimited records", "2M API calls", "Collaboration"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Custom limits", "SSO", "Premium support"] }
    ],
    notes: "Strong image processing and CDN included."
  },
  "tinacms": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://tina.io/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["2 users", "Git-backed", "Visual editing"] },
      { name: "Team", price: 29, period: "user/month", description: "Teams", features: ["Unlimited projects", "Editorial workflow", "Support"], highlighted: true }
    ],
    notes: "Git-backed CMS. Free for small projects."
  },
  "builder-io": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.builder.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 user", "Basic components", "Community support"] },
      { name: "Team", price: 99, period: "month", description: "Teams", features: ["3 users", "Advanced components", "Custom code"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited users", "SSO", "SLA"] }
    ],
    notes: "Visual headless CMS and page builder."
  },
  "webflow-cms": {
    startingPrice: 23, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://webflow.com/pricing",
    tiers: [
      { name: "CMS", price: 23, period: "month", description: "Billed yearly", features: ["2K items", "Dynamic pages", "CMS API"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "Billed yearly", features: ["10K items", "Form submissions", "Site search"] },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["Unlimited", "SSO", "Priority support"] }
    ],
    notes: "CMS plan includes hosting and designer."
  },
  "docusaurus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://docusaurus.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["React-based", "Markdown/MDX", "Versioning", "i18n"], highlighted: true }],
    notes: "Free and open source from Meta."
  },
  "nextra": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://nextra.site",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Next.js based", "MDX support", "Full-text search", "Dark mode"], highlighted: true }],
    notes: "Free and open source documentation generator."
  },
  "vuepress": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://vuepress.vuejs.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Vue-powered", "Markdown", "Plugins", "Themes"], highlighted: true }],
    notes: "Free and open source from Vue.js team."
  },
  "gitbook": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.gitbook.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Public docs", "Git sync", "Custom domain"] },
      { name: "Plus", price: 6.70, period: "user/month", description: "Annual", features: ["Private spaces", "PDF export", "Analytics"], highlighted: true },
      { name: "Pro", price: 12.50, period: "user/month", description: "Annual", features: ["SAML SSO", "Visitor auth", "Custom scripts"] }
    ],
    notes: "Knowledge management and documentation platform."
  },
  "readme": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://readme.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1 project", "API reference", "Basic metrics"] },
      { name: "Startup", price: 99, period: "month", description: "Growing teams", features: ["3 projects", "Custom domain", "API logs"], highlighted: true },
      { name: "Business", price: 399, period: "month", description: "Teams", features: ["10 projects", "SSO", "Audit logs"] }
    ],
    notes: "Developer hub for API documentation."
  },
  "mintlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://mintlify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Hobby", features: ["1 project", "Basic analytics", "Community support"] },
      { name: "Startup", price: 120, period: "month", description: "Startups", features: ["Unlimited pages", "Custom domain", "API playground"], highlighted: true },
      { name: "Growth", price: 400, period: "month", description: "Scaling", features: ["Multiple docs", "Advanced analytics", "Priority support"] }
    ],
    notes: "Modern documentation that updates automatically."
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
    message: "Pricing batch 52 (CMS & Headless) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
