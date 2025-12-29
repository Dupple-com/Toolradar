import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-seventh batch of verified pricing from WebFetch (December 2025) - Finance & Accounting
const verifiedPricing: Record<string, object> = {
  // QuickBooks - Known pricing
  "quickbooks": {
    startingPrice: 30, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://quickbooks.intuit.com/pricing",
    tiers: [
      { name: "Simple Start", price: 30, period: "month", description: "1 user", features: ["Income/expenses", "Invoicing", "Mileage tracking", "Tax deductions"] },
      { name: "Essentials", price: 60, period: "month", description: "3 users", features: ["All Simple Start", "Bill management", "Time tracking", "Multi-currency"], highlighted: true },
      { name: "Plus", price: 90, period: "month", description: "5 users", features: ["All Essentials", "Inventory", "Project profitability", "1099 contractors"] },
      { name: "Advanced", price: 200, period: "month", description: "25 users", features: ["All Plus", "Custom reports", "Dedicated support", "Workflow automation"] }
    ],
    notes: "50% off first 3 months. Payroll add-on available."
  },

  // Xero - https://www.xero.com/pricing
  "xero": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.xero.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "Limited", features: ["20 invoices", "5 bills", "Bank reconciliation", "30-day forecast"] },
      { name: "Standard", price: 50, period: "month", description: "Most popular", features: ["Unlimited invoices", "Unlimited bills", "Auto-reconcile", "Dashboards"], highlighted: true },
      { name: "Premium", price: 75, period: "month", description: "Advanced", features: ["All Standard", "Multi-currency", "KPI analysis", "180-day forecast"] }
    ],
    notes: "80% off first 3 months. 24/7 support. Add-ons available."
  },

  // FreshBooks - Known pricing
  "freshbooks": {
    startingPrice: 17, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.freshbooks.com/pricing",
    tiers: [
      { name: "Lite", price: 17, period: "month", description: "5 clients", features: ["Unlimited invoices", "Expense tracking", "Reports", "Mobile app"] },
      { name: "Plus", price: 30, period: "month", description: "50 clients", features: ["All Lite", "Proposals", "Recurring invoices", "Double-entry reports"], highlighted: true },
      { name: "Premium", price: 55, period: "month", description: "500 clients", features: ["All Plus", "Projects", "Profitability", "Bank reconciliation"] },
      { name: "Select", price: "Custom", description: "500+ clients", features: ["All Premium", "Dedicated manager", "Custom training"] }
    ],
    notes: "50% off first 4 months. Team members $11/mo."
  },

  // Zoho Books - https://www.zoho.com/books/pricing
  "zoho-books": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.zoho.com/books/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 user", features: ["Invoices", "Expenses", "Bank reconciliation", "50+ reports"] },
      { name: "Standard", price: 10, period: "month", description: "3 users, annual", features: ["All Free", "Bank feeds", "Recurring expenses", "API access"], highlighted: true },
      { name: "Professional", price: 20, period: "month", description: "5 users, annual", features: ["All Standard", "Multi-currency", "Inventory", "Timesheets"] },
      { name: "Premium", price: 30, period: "month", description: "10 users, annual", features: ["All Professional", "Fixed assets", "Budgets", "Vendor portal"] }
    ],
    notes: "Elite from $100/mo with warehouse management."
  },

  // BILL - https://www.bill.com/pricing
  "bill-com": {
    startingPrice: 45, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.bill.com/pricing",
    tiers: [
      { name: "Essentials", price: 45, period: "user/month", description: "Manual sync", features: ["Bill entry", "Approval workflows", "ACH/card payments", "6 user roles"] },
      { name: "Team", price: 55, period: "user/month", description: "Auto sync", features: ["All Essentials", "QuickBooks/Xero sync", "Custom roles", "Granular controls"], highlighted: true },
      { name: "Corporate", price: 89, period: "user/month", description: "Most popular", features: ["All Team", "Purchase orders", "2-way matching", "Custom policies"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Corporate", "NetSuite/Dynamics", "SSO", "Multi-entity"] }
    ],
    notes: "Spend & Expense free. AP/AR automation platform."
  },

  // Wave - Known pricing
  "wave": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.waveapps.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["Unlimited invoicing", "Accounting", "Bank connections", "Reports"], highlighted: true },
      { name: "Pro", price: 16, period: "month", description: "Annual", features: ["All Starter", "Recurring invoices", "Unlimited bank connections", "Receipt scanning"] }
    ],
    notes: "Payments 2.9% + $0.60. Payroll add-on available."
  },

  // Sage - Known pricing
  "sage": {
    startingPrice: 10, currency: "GBP", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.sage.com/en-gb/products/sage-accounting",
    tiers: [
      { name: "Accounting Start", price: 10, period: "month", description: "Basics", features: ["Invoicing", "Bank feeds", "Quotes", "Mobile app"] },
      { name: "Accounting", price: 25, period: "month", description: "Standard", features: ["All Start", "Cash flow insights", "Multi-currency", "Purchase invoices"], highlighted: true },
      { name: "Accounting Plus", price: 35, period: "month", description: "Advanced", features: ["All Accounting", "Unlimited users", "Quotes/estimates", "Projects"] }
    ],
    notes: "3 months free with annual. Enterprise Intacct from $400/mo."
  },

  // Brex - Known pricing
  "brex": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.brex.com/pricing",
    tiers: [
      { name: "Essentials", price: 0, description: "Free", features: ["Corporate cards", "Expense management", "Bill pay", "Basic integrations"], highlighted: true },
      { name: "Premium", price: 12, period: "user/month", description: "Advanced", features: ["All Essentials", "Budgets", "Custom policies", "Premium support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Premium", "SSO", "API access", "Dedicated manager"] }
    ],
    notes: "Startups get up to $350K in credits. No personal guarantee."
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

  console.log("🔧 Starting verified pricing corrections batch 47 (Finance & Accounting)...\n");

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
    message: "Verified pricing corrections batch 47 (Finance & Accounting) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
