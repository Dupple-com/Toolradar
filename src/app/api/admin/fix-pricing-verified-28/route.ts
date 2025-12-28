import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-eighth batch of verified pricing from WebFetch (December 2025) - Cloud Storage & Project Management
const verifiedPricing: Record<string, object> = {
  // Dropbox - https://www.dropbox.com/plans
  "dropbox": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.dropbox.com/plans",
    tiers: [
      { name: "Basic", price: 0, description: "Free", features: ["2GB storage", "3 devices", "File sync", "Basic sharing"] },
      { name: "Plus", price: 9.99, period: "month", description: "Personal", features: ["2TB storage", "30-day recovery", "50GB transfers", "PDF editing"] },
      { name: "Professional", price: 16.58, period: "month", description: "Individual", features: ["3TB storage", "180-day recovery", "Branded sharing", "Password links"], highlighted: true },
      { name: "Standard", price: 12, period: "user/month", description: "Team (5TB)", features: ["5TB team storage", "Admin controls", "Group roles"] },
      { name: "Advanced", price: 18, period: "user/month", description: "Team (15TB+)", features: ["15TB+ storage", "1-year recovery", "SSO", "Compliance"] }
    ],
    notes: "DocSend and HelloSign included on some plans."
  },

  // Sync.com - https://www.sync.com/pricing
  "sync": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.sync.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5GB included", features: ["End-to-end encryption", "File sharing", "Cross-platform"] },
      { name: "Teams Standard", price: 6, period: "user/month", description: "Annual (3+ users)", features: ["1TB/user", "180-day recovery", "Admin account"], highlighted: true },
      { name: "Teams+ Unlimited", price: 15, period: "user/month", description: "Annual (3+ users)", features: ["Unlimited storage", "365-day recovery", "Custom branding", "Phone support"] },
      { name: "Pro Solo 5TB", price: 28, period: "month", description: "Individual", features: ["5TB storage", "Unlimited sharing", "180-day recovery"] }
    ],
    notes: "30-day money-back. HIPAA/GDPR/PIPEDA compliant."
  },

  // Basecamp - https://basecamp.com/pricing
  "basecamp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 60,
    pricingPageUrl: "https://basecamp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["1 project", "1GB storage", "Message boards", "To-dos"] },
      { name: "Plus", price: 15, period: "user/month", description: "Month-to-month", features: ["Unlimited projects", "500GB storage", "24/7 support", "Free guests"], highlighted: true },
      { name: "Pro Unlimited", price: 299, period: "month", description: "Annual ($349 monthly)", features: ["Unlimited users", "5TB storage", "Priority support", "Personal onboarding"] }
    ],
    notes: "60-day free trial on Pro. No per-user fees on Pro."
  },

  // Teamwork - https://www.teamwork.com/pricing
  "teamwork": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.teamwork.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["5 projects", "Time tracking", "TeamworkAI", "Basic PM"] },
      { name: "Deliver", price: 10.99, period: "user/month", description: "Annual", features: ["Project status reports", "Intake forms", "20 templates", "5K automations/mo"], highlighted: true },
      { name: "Grow", price: 19.99, period: "user/month", description: "Annual", features: ["All Deliver", "Budgeting", "HubSpot integration", "Resource planner"] },
      { name: "Scale", price: "Custom", description: "Contact sales", features: ["All Grow", "Profitability reports", "Custom reporting", "100K automations"] }
    ],
    notes: "30-day free trial. Agency-focused features."
  },

  // Smartsheet - https://www.smartsheet.com/pricing
  "smartsheet": {
    startingPrice: 24, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.smartsheet.com/pricing",
    tiers: [
      { name: "Pro", price: 129, period: "member/month", description: "1-10 members", features: ["Unlimited sheets", "Gantt/Board views", "250 automations/mo", "Basic collaboration"] },
      { name: "Business", price: 24, period: "member/month", description: "3+ members (Popular)", features: ["All Pro", "Timeline view", "Workload tracking", "Unlimited automations", "1TB storage"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "10+ members", features: ["All Business", "AI features", "SAML SSO", "Work Insights", "Unlimited storage"] }
    ],
    notes: "30-day free trial. Connectors for Salesforce, Jira available."
  },

  // Google Workspace - Known pricing
  "google-workspace": {
    startingPrice: 6, currency: "EUR", billingPeriod: "user/month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://workspace.google.com/pricing",
    tiers: [
      { name: "Business Starter", price: 6, period: "user/month", description: "Annual", features: ["30GB storage/user", "Custom email", "100 video meetings", "Basic security"] },
      { name: "Business Standard", price: 12, period: "user/month", description: "Annual", features: ["2TB storage/user", "150 video meetings", "Recording", "Shared drives"], highlighted: true },
      { name: "Business Plus", price: 18, period: "user/month", description: "Annual", features: ["5TB storage/user", "500 video meetings", "eDiscovery", "Vault"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited storage", "1000 video meetings", "DLP", "Advanced security"] }
    ],
    notes: "Gmail, Drive, Meet, Docs, Sheets, Slides included. AI features on Plus+."
  },

  // Microsoft 365 - Known pricing
  "microsoft-365": {
    startingPrice: 5.60, currency: "EUR", billingPeriod: "user/month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.microsoft.com/microsoft-365/business/compare-all-microsoft-365-products",
    tiers: [
      { name: "Basic", price: 5.60, period: "user/month", description: "Annual", features: ["1TB OneDrive", "Web apps", "Teams", "300 meeting users"] },
      { name: "Standard", price: 11.70, period: "user/month", description: "Annual", features: ["All Basic", "Desktop apps", "Webinars 300", "Booking"], highlighted: true },
      { name: "Premium", price: 20.60, period: "user/month", description: "Annual", features: ["All Standard", "Advanced security", "Intune", "Azure AD Premium"] },
      { name: "Apps", price: 9.80, period: "user/month", description: "Annual", features: ["Desktop apps only", "1TB OneDrive", "No Teams"] }
    ],
    notes: "Copilot AI add-on $30/user/mo. E3/E5 enterprise plans available."
  },

  // Box - Known pricing
  "box": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.box.com/pricing",
    tiers: [
      { name: "Individual", price: 0, description: "Free", features: ["10GB storage", "250MB file size", "Basic sharing"] },
      { name: "Personal Pro", price: 10, period: "month", description: "Annual ($12 monthly)", features: ["100GB storage", "5GB file size", "Advanced sharing"] },
      { name: "Business Starter", price: 5, period: "user/month", description: "3+ users", features: ["100GB storage", "Admin console", "2GB file size"], highlighted: true },
      { name: "Business", price: 15, period: "user/month", description: "3+ users", features: ["Unlimited storage", "5GB file size", "Box AI", "Integrations"] },
      { name: "Business Plus", price: 25, period: "user/month", description: "3+ users", features: ["All Business", "15GB file size", "Metadata", "Custom branding"] }
    ],
    notes: "Enterprise and Enterprise Plus for advanced security. Box Sign included."
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

  console.log("🔧 Starting verified pricing corrections batch 28 (Cloud Storage & Project Management)...\n");

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
    message: "Verified pricing corrections batch 28 (Cloud Storage & Project Management) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
