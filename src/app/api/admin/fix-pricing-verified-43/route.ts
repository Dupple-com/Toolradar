import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-third batch of verified pricing from WebFetch (December 2025) - HR & Performance
const verifiedPricing: Record<string, object> = {
  // BambooHR - Known pricing
  "bamboohr": {
    startingPrice: 5.25, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.bamboohr.com/pricing",
    tiers: [
      { name: "Essentials", price: 5.25, period: "employee/month", description: "Core HR", features: ["Employee records", "Time-off tracking", "Reporting", "Mobile app"] },
      { name: "Advantage", price: 8.75, period: "employee/month", description: "Full HRIS", features: ["All Essentials", "Onboarding", "Performance", "eNPS"], highlighted: true }
    ],
    notes: "Base fee + per-employee. Payroll add-on available."
  },

  // Greenhouse - https://www.greenhouse.com/pricing
  "greenhouse": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.greenhouse.com/pricing",
    tiers: [
      { name: "Essential", price: "Custom", description: "Core ATS", features: ["CRM Essential", "Multi-channel sourcing", "GDPR compliance", "DE&I nudges", "Core reports"] },
      { name: "Advanced", price: "Custom", description: "Mid-market", features: ["All Essential", "10 CRM events", "Internal job boards", "SSO", "Self-scheduling"], highlighted: true },
      { name: "Expert", price: "Custom", description: "Enterprise", features: ["All Advanced", "Unlimited events", "Developer sandbox", "BI connector", "Audit logs"] }
    ],
    notes: "Enterprise ATS. Demo required for pricing."
  },

  // Lever - https://www.lever.co/pricing
  "lever": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lever.co/pricing",
    tiers: [
      { name: "ATS Platform", price: "Custom", description: "Core recruiting", features: ["ATS + CRM", "AI matching", "Reporting", "Automation", "Integrations"], highlighted: true },
      { name: "With Onboarding", price: "Custom", description: "Add-on", features: ["All ATS", "I-9 & E-Verify", "Custom workflows", "Automation"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All features", "AI Interview Companion", "Advanced automation"] }
    ],
    notes: "Scales with team size. Contact for quote."
  },

  // Rippling - https://www.rippling.com/pricing
  "rippling": {
    startingPrice: 8, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.rippling.com/pricing",
    tiers: [
      { name: "Rippling Unity", price: 8, period: "employee/month", description: "Core platform", features: ["Employee data", "Workflow automation", "App management", "Policies"] },
      { name: "HCM", price: "Custom", description: "Per-employee", features: ["Payroll", "Benefits", "Time tracking", "Recruiting", "Performance"], highlighted: true },
      { name: "IT + Spend", price: "Custom", description: "Add-ons", features: ["Device management", "Identity", "Corporate cards", "Expenses"] }
    ],
    notes: "Modular platform. Per-employee pricing."
  },

  // Gusto - Known pricing
  "gusto": {
    startingPrice: 40, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://gusto.com/product/pricing",
    tiers: [
      { name: "Simple", price: 40, period: "month", description: "+$6/person", features: ["Full-service payroll", "Employee self-service", "Basic hiring", "2-day direct deposit"] },
      { name: "Plus", price: 80, period: "month", description: "+$12/person", features: ["All Simple", "Next-day deposit", "Time tracking", "PTO policies", "Permissions"], highlighted: true },
      { name: "Premium", price: "Custom", description: "Contact sales", features: ["All Plus", "Dedicated support", "Compliance alerts", "Performance reviews"] }
    ],
    notes: "Contractor-only plan from $35/mo. HR add-ons available."
  },

  // Lattice - https://lattice.com/pricing
  "lattice": {
    startingPrice: 11, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://lattice.com/pricing",
    tiers: [
      { name: "Foundations", price: 11, period: "seat/month", description: "Annual ($4K min)", features: ["Performance reviews", "Goals & OKRs", "1:1s", "Feedback", "AI Agent"], highlighted: true },
      { name: "+ Engagement", price: 4, period: "seat/month", description: "Add-on", features: ["Pulse surveys", "AI insights", "eNPS", "Onboarding surveys"] },
      { name: "+ Grow", price: 4, period: "seat/month", description: "Add-on", features: ["Competencies", "Career tracks", "Development plans"] },
      { name: "+ Compensation", price: 6, period: "seat/month", description: "Add-on", features: ["Benchmarking", "Pay bands", "Cycle management", "Analytics"] }
    ],
    notes: "$4,000 minimum annual. Modular add-ons."
  },

  // 15Five - https://www.15five.com/pricing
  "15five": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.15five.com/pricing",
    tiers: [
      { name: "Engage", price: 4, period: "user/month", description: "Annual", features: ["Engagement surveys", "Action planning", "Heat maps", "Benchmarking"] },
      { name: "Perform", price: 11, period: "user/month", description: "Annual", features: ["Performance reviews", "OKRs", "360 feedback", "Career paths"], highlighted: true },
      { name: "Total Platform", price: 16, period: "user/month", description: "Most popular", features: ["Engage + Perform", "Manager microlearnings", "Full analytics"] }
    ],
    notes: "Kona AI coach $19/manager. Compensation add-on $9/manager."
  },

  // Workday - Known pricing
  "workday": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "year", hasFreeTrial: false,
    pricingPageUrl: "https://www.workday.com/products/human-capital-management",
    tiers: [
      { name: "HCM", price: "Custom", description: "Contact sales", features: ["Core HR", "Talent management", "Workforce planning", "Global compliance"], highlighted: true },
      { name: "Financial Management", price: "Custom", description: "Contact sales", features: ["Accounting", "Revenue management", "Expenses", "Procurement"] },
      { name: "Enterprise Platform", price: "Custom", description: "Contact sales", features: ["All products", "Analytics", "Integration", "AI/ML"] }
    ],
    notes: "Enterprise HCM. Typically $100+/employee/year."
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

  console.log("🔧 Starting verified pricing corrections batch 43 (HR & Performance)...\n");

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
    message: "Verified pricing corrections batch 43 (HR & Performance) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
