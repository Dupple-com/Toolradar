import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Eighteenth batch of verified pricing from WebFetch (December 2025) - E-commerce & Website Builders
const verifiedPricing: Record<string, object> = {
  // Weebly - https://www.weebly.com/pricing
  "weebly": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.weebly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic use", features: ["Free SSL", "3rd party embed", "Community forum"] },
      { name: "Professional", price: 14, period: "month", description: "Annual (€18 monthly)", features: ["Custom domain", "Advanced stats", "Ad removal", "Password protection"], highlighted: true },
      { name: "Performance", price: 25, period: "month", description: "Annual (€32 monthly)", features: ["All Professional", "Inventory management", "Abandoned cart", "Priority phone support"] }
    ],
    notes: "All plans include shopping cart, unlimited items, SEO tools"
  },

  // Carrd - https://carrd.co/pro
  "carrd": {
    startingPrice: 9, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://carrd.co/pro",
    tiers: [
      { name: "Pro Lite", price: 9, period: "year", description: "3 sites", features: ["Premium URLs", "No branding", "Video uploads", "Unlimited elements"] },
      { name: "Pro Standard", price: 19, period: "year", description: "10 sites", features: ["Custom domains", "Forms", "Widgets", "Google Analytics"], highlighted: true },
      { name: "Pro Plus", price: 49, period: "year", description: "25 sites", features: ["Advanced forms", "Password protection", "Redirects", "Site files"] }
    ],
    notes: "Scale up to 1000 sites ($599/year). Best value for simple landing pages."
  },

  // Strikingly - https://www.strikingly.com/pricing
  "strikingly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.strikingly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited sites", features: ["500MB storage", "5GB bandwidth", "Sell 1 product", "5% transaction fees"] },
      { name: "Pro", price: 16, period: "month", description: "Annual", features: ["3 Pro sites", "20GB storage", "300 products", "2% fees", "Custom domain"], highlighted: true },
      { name: "VIP", price: 49, period: "month", description: "Annual", features: ["5 VIP sites", "100GB storage", "500 products", "0% fees", "Priority support"] }
    ],
    notes: "Domain add-on: $24.95/year. Custom email: $25/year."
  },

  // Ecwid - https://www.ecwid.com/pricing
  "ecwid": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.ecwid.com/pricing",
    tiers: [
      { name: "Starter", price: 5, period: "month", description: "10 products", features: ["70+ templates", "Email support", "company.site domain"] },
      { name: "Venture", price: 25, period: "month", description: "Annual ($30 monthly)", features: ["100 products", "Digital goods", "Instagram/Facebook", "Live chat"], highlighted: true },
      { name: "Business", price: 45, period: "month", description: "Annual ($55 monthly)", features: ["2500 products", "Subscriptions", "2 staff", "Abandoned cart"] },
      { name: "Unlimited", price: 105, period: "month", description: "Annual ($130 monthly)", features: ["Unlimited products", "POS selling", "Unlimited staff", "Priority support"] }
    ],
    notes: "No setup or transaction fees. 70+ payment providers."
  },

  // Volusion - https://www.volusion.com/pricing
  "volusion": {
    startingPrice: 35, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.volusion.com/pricing",
    tiers: [
      { name: "Personal", price: 35, period: "month", description: "$50K GMV/year", features: ["100 products", "1 staff", "Live chat & email"] },
      { name: "Professional", price: 79, period: "month", description: "$100K GMV/year", features: ["5000 products", "5 staff", "Import/export", "CRM"], highlighted: true },
      { name: "Business", price: 299, period: "month", description: "$400K GMV/year", features: ["Unlimited products", "15 staff", "API access", "Ratings & reviews"] },
      { name: "Prime", price: "Custom", description: "Unlimited GMV", features: ["Unlimited staff", "VIP response", "Dedicated CSM"] }
    ],
    notes: "Free hosting, SSL, unlimited bandwidth, PCI compliance"
  },

  // Sellfy - https://www.sellfy.com/pricing
  "sellfy": {
    startingPrice: 22, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.sellfy.com/pricing",
    tiers: [
      { name: "Starter", price: 22, period: "month", description: "Annual ($29 monthly)", features: ["$10K annual sales", "Unlimited products", "2K email credits", "Custom domain"] },
      { name: "Business", price: 59, period: "month", description: "Annual ($79 monthly)", features: ["$50K annual sales", "Upselling", "Cart abandonment", "10K email credits", "Remove branding"], highlighted: true },
      { name: "Premium", price: 119, period: "month", description: "Annual ($159 monthly)", features: ["$200K annual sales", "Product migration", "50K email credits", "Priority support"] }
    ],
    notes: "0% transaction fees. Supports digital, physical, subscriptions, print-on-demand."
  },

  // Payhip - https://payhip.com/pricing
  "payhip": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://payhip.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "+5% transaction fee", features: ["All features", "Unlimited products", "Unlimited revenue"] },
      { name: "Plus", price: 29, period: "month", description: "+2% transaction fee", features: ["All features", "Unlimited products", "Unlimited revenue"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "0% transaction fee", features: ["All features", "Unlimited products", "Unlimited revenue"] }
    ],
    notes: "No feature-gating. PayPal/Stripe fees apply separately."
  },

  // Podia - https://www.podia.com/pricing
  "podia": {
    startingPrice: 33, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.podia.com/pricing",
    tiers: [
      { name: "Mover", price: 33, period: "month", description: "Annual ($39 monthly)", features: ["Website", "Unlimited products", "Email marketing", "5% transaction fee"] },
      { name: "Shaker", price: 75, period: "month", description: "Annual ($89 monthly)", features: ["0% transaction fee", "Affiliate marketing", "PayPal integration", "All Mover features"], highlighted: true }
    ],
    notes: "Free email marketing up to 100 subscribers. Scales with list size."
  },

  // Hostinger - https://www.hostinger.com/web-hosting
  "hostinger": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.hostinger.com/web-hosting",
    tiers: [
      { name: "Premium", price: 2.99, period: "month", description: "48-month term", features: ["3 websites", "20GB SSD", "Free domain", "Free SSL", "Weekly backups"] },
      { name: "Business", price: 3.99, period: "month", description: "48-month term", features: ["50 websites", "50GB NVMe", "Daily backups", "AI ecommerce builder", "Free CDN"], highlighted: true },
      { name: "Cloud Startup", price: 7.99, period: "month", description: "48-month term", features: ["100 websites", "100GB NVMe", "4GB RAM", "Dedicated IP", "Priority support"] }
    ],
    notes: "Renews at higher rates. Free migration. AI Website Builder included."
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

  console.log("🔧 Starting verified pricing corrections batch 18 (E-commerce & Website Builders)...\n");

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
    message: "Verified pricing corrections batch 18 (E-commerce & Website Builders) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
