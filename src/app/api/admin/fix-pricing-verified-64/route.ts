import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 64: Website Builders & Hosting pricing
const verifiedPricing: Record<string, object> = {
  "vercel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://vercel.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Personal", features: ["Unlimited sites", "100GB bandwidth", "Serverless functions"] },
      { name: "Pro", price: 20, period: "user/month", description: "Teams", features: ["1TB bandwidth", "Password protection", "Preview deploys"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["SLA", "Advanced security", "Dedicated support"] }
    ],
    notes: "Free for personal projects. Commercial use requires Pro."
  },
  "netlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.netlify.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Personal", features: ["100GB bandwidth", "300 build minutes", "1 member"] },
      { name: "Pro", price: 19, period: "member/month", description: "Teams", features: ["1TB bandwidth", "25K build minutes", "Backgrounds"], highlighted: true }
    ],
    notes: "Generous free tier. Pro for team features."
  },
  "github-pages": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pages.github.com",
    tiers: [{ name: "Free", price: 0, description: "Free", features: ["Static hosting", "Custom domain", "HTTPS", "GitHub integration"], highlighted: true }],
    notes: "Free static hosting from GitHub."
  },
  "cloudflare-pages": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pages.cloudflare.com",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited", features: ["Unlimited bandwidth", "500 builds/mo", "Unlimited sites"], highlighted: true },
      { name: "Pro", price: 20, period: "month", description: "Per domain", features: ["5000 builds/mo", "Web analytics", "More functions"] }
    ],
    notes: "Unlimited bandwidth on free tier."
  },
  "aws-amplify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://aws.amazon.com/amplify/pricing",
    tiers: [
      { name: "Free Tier", price: 0, description: "12 months", features: ["1000 build minutes", "15GB hosting", "5GB storage"], highlighted: true },
      { name: "Pay as you go", price: 0.01, period: "per build minute", description: "Usage", features: ["$0.023/GB hosting", "$0.25/GB storage"] }
    ],
    notes: "12-month free tier. Pay for usage after."
  },
  "squarespace": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.squarespace.com/pricing",
    tiers: [
      { name: "Personal", price: 12, period: "month", description: "Annual", features: ["Unlimited pages", "Free domain", "SSL"] },
      { name: "Business", price: 18, period: "month", description: "Annual", features: ["E-commerce", "Professional email", "Analytics"], highlighted: true }
    ],
    notes: "Website builder with templates."
  },
  "wix": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.wix.com/upgrade/website",
    tiers: [
      { name: "Free", price: 0, description: "Wix ads", features: ["Wix subdomain", "500MB storage", "Wix ads"] },
      { name: "Combo", price: 16, period: "month", description: "Annual", features: ["Custom domain", "2GB storage", "No ads"], highlighted: true },
      { name: "Unlimited", price: 22, period: "month", description: "Annual", features: ["Unlimited bandwidth", "10GB storage", "Site booster"] }
    ],
    notes: "Free with Wix branding. Paid for custom domain."
  },
  "wordpress-com": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://wordpress.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["WordPress.com subdomain", "1GB storage", "Ads shown"] },
      { name: "Personal", price: 4, period: "month", description: "Annual", features: ["Custom domain", "6GB storage", "No ads"], highlighted: true },
      { name: "Premium", price: 8, period: "month", description: "Annual", features: ["Custom CSS", "13GB storage", "Monetization"] }
    ],
    notes: "Free with WordPress.com subdomain."
  },
  "carrd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://carrd.co",
    tiers: [
      { name: "Free", price: 0, description: "3 sites", features: ["3 sites", "Carrd subdomain", "Basic features"], highlighted: true },
      { name: "Pro Lite", price: 9, period: "year", description: "Annual", features: ["10 sites", "Custom domains", "No branding"] },
      { name: "Pro Standard", price: 19, period: "year", description: "Annual", features: ["25 sites", "Forms", "Google Analytics"] }
    ],
    notes: "Simple one-page sites. Very affordable."
  },
  "super": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://super.so/pricing",
    tiers: [
      { name: "Personal", price: 12, period: "month", description: "1 site", features: ["1 Notion site", "Custom domain", "SEO"], highlighted: true },
      { name: "Team", price: 16, period: "month", description: "Per site", features: ["Password protection", "Custom code", "Team members"] }
    ],
    notes: "Turn Notion into a website."
  },
  "typedream": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://typedream.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 site", features: ["1 site", "Typedream subdomain", "Basic features"] },
      { name: "Launch", price: 15, period: "month", description: "1 site", features: ["Custom domain", "No branding", "Forms"], highlighted: true }
    ],
    notes: "No-code website builder. Free tier."
  },
  "hostinger": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.hostinger.com/web-hosting",
    tiers: [
      { name: "Single", price: 2.99, period: "month", description: "4 years", features: ["1 website", "50GB storage", "Free domain"] },
      { name: "Premium", price: 3.99, period: "month", description: "4 years", features: ["100 websites", "100GB storage", "Weekly backups"], highlighted: true }
    ],
    notes: "Budget hosting. Prices require long commitment."
  },
  "namecheap": {
    startingPrice: 1.58, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.namecheap.com/hosting/shared",
    tiers: [
      { name: "Stellar", price: 1.58, period: "month", description: "First year", features: ["3 websites", "20GB SSD", "Free CDN"] },
      { name: "Stellar Plus", price: 2.48, period: "month", description: "First year", features: ["Unlimited sites", "Unmetered SSD", "AutoBackup"], highlighted: true }
    ],
    notes: "Domain registrar with hosting."
  },
  "siteground": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.siteground.com/web-hosting.htm",
    tiers: [
      { name: "StartUp", price: 2.99, period: "month", description: "Promo", features: ["1 website", "10GB space", "Free SSL"] },
      { name: "GrowBig", price: 4.99, period: "month", description: "Promo", features: ["Unlimited sites", "20GB space", "Staging"], highlighted: true }
    ],
    notes: "Quality WordPress hosting. Promo prices."
  },
  "bluehost": {
    startingPrice: 2.95, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.bluehost.com/hosting/shared",
    tiers: [
      { name: "Basic", price: 2.95, period: "month", description: "3 years", features: ["1 website", "50GB SSD", "Free domain"] },
      { name: "Plus", price: 5.45, period: "month", description: "3 years", features: ["Unlimited sites", "Unmetered SSD", "Spam protection"], highlighted: true }
    ],
    notes: "WordPress recommended host. Long-term pricing."
  },
  "dreamhost": {
    startingPrice: 2.95, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 97,
    pricingPageUrl: "https://www.dreamhost.com/hosting/shared",
    tiers: [
      { name: "Starter", price: 2.95, period: "month", description: "3 years", features: ["1 website", "50GB SSD", "Free domain"] },
      { name: "Unlimited", price: 5.95, period: "month", description: "3 years", features: ["Unlimited sites", "Unlimited storage", "Email"], highlighted: true }
    ],
    notes: "97-day money-back guarantee."
  },
  "a2-hosting": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.a2hosting.com/web-hosting",
    tiers: [
      { name: "Startup", price: 2.99, period: "month", description: "3 years", features: ["1 website", "100GB SSD", "Free SSL"] },
      { name: "Drive", price: 5.99, period: "month", description: "3 years", features: ["Unlimited sites", "Unlimited SSD", "Free site migration"], highlighted: true }
    ],
    notes: "Fast hosting with Turbo servers."
  },
  "kinsta": {
    startingPrice: 35, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://kinsta.com/plans",
    tiers: [
      { name: "Starter", price: 35, period: "month", description: "1 site", features: ["1 WordPress site", "25K visits", "10GB storage"] },
      { name: "Pro", price: 70, period: "month", description: "2 sites", features: ["2 sites", "50K visits", "20GB storage"], highlighted: true }
    ],
    notes: "Premium managed WordPress hosting."
  },
  "wpengine": {
    startingPrice: 20, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://wpengine.com/plans",
    tiers: [
      { name: "Startup", price: 20, period: "month", description: "Annual", features: ["1 site", "25K visits", "10GB storage"] },
      { name: "Professional", price: 40, period: "month", description: "Annual", features: ["3 sites", "75K visits", "15GB storage"], highlighted: true }
    ],
    notes: "Enterprise WordPress hosting."
  },
  "pantheon": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://pantheon.io/plans/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Sandbox", features: ["Dev environments", "Drupal/WordPress", "Community support"] },
      { name: "Basic", price: 41, period: "month", description: "Annual", features: ["1 site", "20K visits", "SSL"], highlighted: true }
    ],
    notes: "Drupal and WordPress hosting."
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
    message: "Pricing batch 64 (Website Builders & Hosting) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
