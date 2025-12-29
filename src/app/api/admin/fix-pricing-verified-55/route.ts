import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 55: E-commerce & Payments pricing
const verifiedPricing: Record<string, object> = {
  "shopify": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 3,
    pricingPageUrl: "https://www.shopify.com/pricing",
    tiers: [
      { name: "Basic", price: 29, period: "month", description: "New businesses", features: ["10 inventory locations", "2% card rates", "Basic reports"] },
      { name: "Shopify", price: 79, period: "month", description: "Growing", features: ["Professional reports", "5 staff", "Lower rates"], highlighted: true },
      { name: "Advanced", price: 299, period: "month", description: "Scaling", features: ["15 staff", "Custom reports", "Lowest rates"] }
    ],
    notes: "Plus from $2000/mo. 3-day free trial, then $1/mo for 3 months."
  },
  "woocommerce": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://woocommerce.com/pricing",
    tiers: [
      { name: "Core", price: 0, description: "Free plugin", features: ["Full e-commerce", "WordPress integration", "Unlimited products"], highlighted: true }
    ],
    notes: "Free plugin. Hosting and extensions extra."
  },
  "bigcommerce": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.bigcommerce.com/essentials/pricing",
    tiers: [
      { name: "Standard", price: 29, period: "month", description: "Starting out", features: ["Unlimited products", "No transaction fees", "POS"] },
      { name: "Plus", price: 79, period: "month", description: "Growing", features: ["Customer groups", "Abandoned cart", "Stored cards"], highlighted: true },
      { name: "Pro", price: 299, period: "month", description: "Scaling", features: ["Google reviews", "Custom SSL", "Product filtering"] }
    ],
    notes: "No transaction fees. Sales limits per tier."
  },
  "magento": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://business.adobe.com/products/magento/pricing.html",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Full platform", "Extensions", "Community support"], highlighted: true },
      { name: "Commerce", price: 22000, period: "year", description: "Starting", features: ["Cloud hosting", "B2B features", "Adobe support"] }
    ],
    notes: "Open Source is free. Adobe Commerce for enterprises."
  },
  "prestashop": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.prestashop.com/en/pricing",
    tiers: [
      { name: "Classic", price: 0, description: "Self-hosted", features: ["Open source", "Full control", "Community modules"], highlighted: true },
      { name: "Hosted", price: 24, period: "month", description: "Managed", features: ["Cloud hosting", "Support", "Updates included"] }
    ],
    notes: "Open source and free to self-host."
  },
  "opencart": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.opencart.com",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["Full e-commerce", "Extensions", "Multi-store"], highlighted: true }
    ],
    notes: "Free and open source. Self-hosted."
  },
  "medusa": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://medusajs.com",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Headless commerce", "API-first", "Extensible"], highlighted: true },
      { name: "Cloud", price: 50, period: "month", description: "Starting", features: ["Managed hosting", "Support", "Auto-scaling"] }
    ],
    notes: "Open-source Shopify alternative. TypeScript-based."
  },
  "saleor": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://saleor.io/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["GraphQL API", "Headless", "Full features"], highlighted: true },
      { name: "Cloud", price: 99, period: "month", description: "Managed", features: ["Hosted", "Support", "Updates"] }
    ],
    notes: "GraphQL-first e-commerce. Python/Django."
  },
  "vendure": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.vendure.io",
    tiers: [{ name: "Open Source", price: 0, description: "Self-hosted", features: ["Headless commerce", "TypeScript", "GraphQL API", "Extensible"], highlighted: true }],
    notes: "Free and open source. TypeScript/NestJS."
  },
  "swell": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.swell.is/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["1000 orders/mo", "Full API", "Storefront themes"] },
      { name: "Standard", price: 299, period: "month", description: "Growing", features: ["10K orders/mo", "Multiple storefronts", "Priority support"], highlighted: true }
    ],
    notes: "Headless e-commerce. Free up to 1000 orders."
  },
  "stripe": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://stripe.com/pricing",
    tiers: [
      { name: "Integrated", price: 0, period: "2.9% + 30¢", description: "Per transaction", features: ["Cards", "Wallets", "Buy now pay later"], highlighted: true },
      { name: "Invoicing", price: 0, period: "0.4% or 0.5%", description: "Per invoice", features: ["Invoice creation", "Payment tracking", "Reminders"] }
    ],
    notes: "No monthly fees. Per-transaction pricing."
  },
  "paddle": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.paddle.com/pricing",
    tiers: [
      { name: "Standard", price: 0, period: "5% + 50¢", description: "Per transaction", features: ["Global payments", "Tax compliance", "Fraud protection"], highlighted: true }
    ],
    notes: "Merchant of record. Handles taxes globally."
  },
  "lemon-squeezy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.lemonsqueezy.com/pricing",
    tiers: [
      { name: "Standard", price: 0, period: "5% + 50¢", description: "Per transaction", features: ["Digital products", "Subscriptions", "Tax handling"], highlighted: true }
    ],
    notes: "Merchant of record for digital products."
  },
  "gumroad": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gumroad.com/features/pricing",
    tiers: [
      { name: "Free", price: 0, period: "10%", description: "Per sale", features: ["Unlimited products", "Instant payouts", "Email marketing"], highlighted: true }
    ],
    notes: "No monthly fee. 10% flat fee per sale."
  },
  "snipcart": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://snipcart.com/pricing",
    tiers: [
      { name: "Standard", price: 0, period: "2%", description: "Or $10/mo min", features: ["Any website", "Abandoned carts", "Custom checkout"], highlighted: true }
    ],
    notes: "2% transaction fee or $10/mo minimum."
  },
  "square": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://squareup.com/us/en/payments/in-person",
    tiers: [
      { name: "Free", price: 0, period: "2.6% + 10¢", description: "In person", features: ["POS app", "Inventory", "Basic reports"], highlighted: true },
      { name: "Plus", price: 60, period: "month", description: "Restaurants", features: ["Table management", "Menu management", "Team management"] }
    ],
    notes: "Free POS. Transaction fees apply."
  },
  "printful": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.printful.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Pay per order", features: ["No minimums", "200+ products", "Mockup generator"], highlighted: true },
      { name: "Growth", price: 24.99, period: "month", description: "Growing brands", features: ["20% discounts", "Branding tools", "Priority support"] }
    ],
    notes: "Print-on-demand. Pay only for orders."
  },
  "printify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://printify.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 stores", features: ["Unlimited designs", "5 stores", "Self-service"], highlighted: true },
      { name: "Premium", price: 29, period: "month", description: "Scaling", features: ["Up to 20% discount", "10 stores", "Custom branding"] }
    ],
    notes: "Print-on-demand. Free tier available."
  },
  "ecwid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.ecwid.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 products", features: ["10 products", "2 categories", "Mobile app"] },
      { name: "Venture", price: 19, period: "month", description: "Annual", features: ["100 products", "Discount coupons", "Staff accounts"], highlighted: true },
      { name: "Business", price: 39, period: "month", description: "Annual", features: ["2500 products", "Product variations", "Inventory tracking"] }
    ],
    notes: "Add e-commerce to any website."
  },
  "payhip": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://payhip.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, period: "5%", description: "Per sale", features: ["Unlimited products", "Digital & physical", "Memberships"], highlighted: true },
      { name: "Plus", price: 29, period: "month", description: "2% fee", features: ["Lower fees", "Custom domain", "Priority support"] },
      { name: "Pro", price: 99, period: "month", description: "0% fee", features: ["No transaction fees", "White-label", "API access"] }
    ],
    notes: "Digital products and memberships. Free tier with 5% fee."
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
    message: "Pricing batch 55 (E-commerce & Payments) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
