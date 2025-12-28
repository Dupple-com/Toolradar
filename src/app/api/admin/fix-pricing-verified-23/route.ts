import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-third batch of verified pricing from WebFetch (December 2025) - HR, Finance & Productivity
const verifiedPricing: Record<string, object> = {
  // Xero - https://www.xero.com/pricing
  "xero": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.xero.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "Basic", features: ["20 invoices", "5 bills", "Bank reconciliation", "Real-time reports"] },
      { name: "Standard", price: 50, period: "month", description: "Growing", features: ["Unlimited invoices/bills", "Auto-reconcile", "Bulk reconciliation", "Dashboards"], highlighted: true },
      { name: "Premium", price: 75, period: "month", description: "Established", features: ["All Standard", "Cash flow forecasting", "KPI analysis", "Multi-currency"] }
    ],
    notes: "80% off first 3 months promotion. Add-ons: Expenses $4/user, Projects $7/user."
  },

  // Expensify - https://www.expensify.com/pricing
  "expensify": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.expensify.com/pricing",
    tiers: [
      { name: "Team", price: 5, period: "user/month", description: "Annual ($10 monthly)", features: ["Expense approval", "Online reimbursement", "QuickBooks/Xero sync", "Unlimited SmartScans"] },
      { name: "Control", price: 9, period: "user/month", description: "Annual ($18 monthly)", features: ["All Team", "Corporate card reconciliation", "Multi-stage approval", "NetSuite/Sage sync"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "1000+ users", features: ["Custom business logic", "Oracle/SAP sync", "Full ERP integration", "Dedicated coach"] }
    ],
    notes: "Annual commitment for best rates. Free tier available."
  },

  // Lattice - https://lattice.com/pricing
  "lattice": {
    startingPrice: 11, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://lattice.com/pricing",
    tiers: [
      { name: "Foundations", price: 11, period: "seat/month", description: "Annual", features: ["Performance reviews", "Goals & OKRs", "1:1s", "Feedback", "Praise"] },
      { name: "Talent Management", price: 11, period: "seat/month", description: "Annual", features: ["All Foundations", "Succession planning", "Calibrations", "AI Agent"], highlighted: true },
      { name: "+ Engagement", price: 4, period: "seat/month", description: "Add-on", features: ["Pulse surveys", "AI insights", "Onboarding surveys", "eNPS"] },
      { name: "+ Compensation", price: 6, period: "seat/month", description: "Add-on", features: ["Benchmarking", "Cycle management", "Pay statements", "Analytics"] }
    ],
    notes: "$4000 minimum annual agreement. Billed in USD."
  },

  // Workable - https://www.workable.com/pricing
  "workable": {
    startingPrice: 299, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.workable.com/pricing",
    tiers: [
      { name: "Standard", price: 299, period: "month", description: "1-20 employees ($249/mo annual)", features: ["Core recruiting", "HR tools", "Job boards", "Candidate management"], highlighted: true },
      { name: "Premier", price: 599, period: "month", description: "1-20 employees ($499/mo annual)", features: ["All Standard", "Texting", "Video interviews", "Assessments", "Performance reviews"] }
    ],
    notes: "20% off annual. Scales with company size. Premium add-ons available."
  },

  // Lever - https://www.lever.co/pricing
  "lever": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lever.co/pricing",
    tiers: [
      { name: "LeverTRM", price: "Custom", description: "Contact sales", features: ["ATS & CRM", "Advanced reporting", "LinkedIn RSC", "Slack/Zoom integration", "Automation"], highlighted: true },
      { name: "+ AI Interview", price: "Custom", description: "Add-on", features: ["AI Interview Companion", "Real-time assistance"] },
      { name: "+ Onboarding", price: "Custom", description: "Add-on", features: ["I-9 support", "E-Verify integration"] }
    ],
    notes: "Custom pricing based on org size. Call (888) 885-5299."
  },

  // Greenhouse - https://www.greenhouse.com/pricing
  "greenhouse": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.greenhouse.com/pricing",
    tiers: [
      { name: "Essential", price: "Custom", description: "Entry level", features: ["Structured hiring", "Basic CRM", "Sourcing tools", "Core reporting"] },
      { name: "Advanced", price: "Custom", description: "Mid-tier", features: ["All Essential", "Advanced automation", "Custom reporting", "Enhanced workflows"], highlighted: true },
      { name: "Expert", price: "Custom", description: "Premium", features: ["All Advanced", "BI Connector", "DE&I reporting", "Audit logs"] }
    ],
    notes: "Pricing based on company size. Request demo for quote."
  },

  // Notion - https://www.notion.com/pricing
  "notion": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited pages", "Share with 10 guests", "7-day page history", "Basic blocks"] },
      { name: "Plus", price: 9.50, period: "member/month", description: "Small teams", features: ["Unlimited blocks", "Unlimited file uploads", "30-day history", "100 guests"], highlighted: true },
      { name: "Business", price: 19.50, period: "member/month", description: "Growing teams", features: ["All Plus", "SAML SSO", "Private spaces", "90-day history"] },
      { name: "Enterprise", price: "Custom", description: "Organizations", features: ["Advanced security", "Audit log", "Unlimited history", "Dedicated manager"] }
    ],
    notes: "20% off annual. Guests free. USD pricing also available."
  },

  // QuickBooks - Known pricing
  "quickbooks": {
    startingPrice: 30, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://quickbooks.intuit.com/pricing",
    tiers: [
      { name: "Simple Start", price: 30, period: "month", description: "50% off 3 months", features: ["Income/expense tracking", "Invoicing", "Tax deductions", "1 user"] },
      { name: "Essentials", price: 60, period: "month", description: "50% off 3 months", features: ["All Simple Start", "Bill management", "Time tracking", "3 users"], highlighted: true },
      { name: "Plus", price: 90, period: "month", description: "50% off 3 months", features: ["All Essentials", "Inventory", "Project profitability", "5 users"] },
      { name: "Advanced", price: 200, period: "month", description: "50% off 3 months", features: ["All Plus", "Business analytics", "Batch invoicing", "25 users"] }
    ],
    notes: "50% off first 3 months. Payroll add-on from $50/mo."
  },

  // FreshBooks - Known pricing
  "freshbooks": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.freshbooks.com/pricing",
    tiers: [
      { name: "Lite", price: 19, period: "month", description: "50% off 3 months", features: ["5 billable clients", "Unlimited invoices", "Expense tracking", "Time tracking"] },
      { name: "Plus", price: 33, period: "month", description: "50% off 3 months", features: ["50 billable clients", "Proposals", "Recurring billing", "Reports"], highlighted: true },
      { name: "Premium", price: 60, period: "month", description: "50% off 3 months", features: ["500 clients", "Project profitability", "Email customization"] },
      { name: "Select", price: "Custom", description: "500+ clients", features: ["Dedicated support", "Lower card fees", "Custom onboarding"] }
    ],
    notes: "50% off first 3 months. +$11/mo per team member."
  },

  // Gusto - Known pricing
  "gusto": {
    startingPrice: 40, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gusto.com/product/pricing",
    tiers: [
      { name: "Simple", price: 40, period: "month", description: "+ $6/person", features: ["Full-service payroll", "Employee self-service", "Health benefits", "Basic hiring"] },
      { name: "Plus", price: 80, period: "month", description: "+ $12/person", features: ["All Simple", "Next-day direct deposit", "Time tracking", "PTO management"], highlighted: true },
      { name: "Premium", price: "Custom", description: "Contact sales", features: ["All Plus", "Dedicated support", "HR resource center", "Compliance alerts"] }
    ],
    notes: "Contractor-only plan from $35/mo. Benefits broker included."
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

  console.log("🔧 Starting verified pricing corrections batch 23 (HR, Finance & Productivity)...\n");

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
    message: "Verified pricing corrections batch 23 (HR, Finance & Productivity) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
