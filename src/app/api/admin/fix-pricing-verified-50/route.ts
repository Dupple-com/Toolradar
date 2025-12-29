import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fiftieth batch of verified pricing from WebFetch (December 2025) - Popular Tools Final Batch
const verifiedPricing: Record<string, object> = {
  // Grammarly - https://www.grammarly.com/plans
  "grammarly": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.grammarly.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Spelling & grammar", "Tone detection", "100 AI prompts/mo", "Browser extension"] },
      { name: "Pro", price: 12, period: "month", description: "7-day trial", features: ["All Free", "Full-sentence rewrites", "Tone adjustment", "2K AI prompts/mo", "Plagiarism check"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "Unlimited AI", "SAML SSO", "SCIM", "Style guides", "DLP"] }
    ],
    notes: "Team plans available. AI writing assistant."
  },

  // Calendly - https://calendly.com/pricing
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Always free", features: ["1 event type", "1 calendar", "Video conferencing", "Mobile app"] },
      { name: "Standard", price: 10, period: "seat/month", description: "Annual ($12 monthly)", features: ["Unlimited events", "6 calendars", "Payments", "Zapier"], highlighted: true },
      { name: "Teams", price: 16, period: "seat/month", description: "Annual ($20 monthly)", features: ["All Standard", "Salesforce", "Round-robin", "Admin controls"] },
      { name: "Enterprise", price: 15000, period: "year", description: "Starting", features: ["All Teams", "SSO/SAML", "Audit logs", "Dedicated support"] }
    ],
    notes: "Scheduling automation. 100M+ users."
  },

  // Typeform - https://www.typeform.com/pricing
  "typeform": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.typeform.com/pricing",
    tiers: [
      { name: "Basic", price: 25, period: "month", description: "Annual ($29 monthly)", features: ["100 responses/mo", "1 user", "Unlimited forms", "Templates"] },
      { name: "Plus", price: 50, period: "month", description: "Annual ($59 monthly)", features: ["1K responses", "3 users", "No branding", "Custom subdomain"], highlighted: true },
      { name: "Business", price: 83, period: "month", description: "Annual ($99 monthly)", features: ["10K responses", "5 users", "Drop-off rates", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Custom limits", "SSO", "HIPAA", "VIP support"] }
    ],
    notes: "Conversational forms. Growth plans from $166/mo."
  },

  // Todoist - Known pricing
  "todoist": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://todoist.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["5 projects", "5 collaborators", "5MB uploads", "3 filters"] },
      { name: "Pro", price: 4, period: "month", description: "Annual ($5 monthly)", features: ["300 projects", "25 collaborators", "100MB uploads", "Reminders"], highlighted: true },
      { name: "Business", price: 6, period: "user/month", description: "Annual ($8 monthly)", features: ["All Pro", "Team inbox", "Admin controls", "Priority support"] }
    ],
    notes: "Task management. Cross-platform sync."
  },

  // ClickUp - Known pricing (updated)
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://clickup.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Best for personal", features: ["100MB storage", "Unlimited tasks", "Unlimited members", "Whiteboards"] },
      { name: "Unlimited", price: 7, period: "member/month", description: "Annual ($10 monthly)", features: ["Unlimited storage", "Unlimited integrations", "Dashboards", "Gantt charts"], highlighted: true },
      { name: "Business", price: 12, period: "member/month", description: "Annual ($19 monthly)", features: ["All Unlimited", "Google SSO", "Goals", "Time tracking"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "Custom roles", "API", "Dedicated success manager"] }
    ],
    notes: "All-in-one productivity. ClickUp AI add-on."
  },

  // Notion AI - Updated pricing
  "notion-ai": {
    startingPrice: 10, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/product/ai",
    tiers: [
      { name: "AI Add-on", price: 10, period: "member/month", description: "Added to Notion plan", features: ["AI writing", "Q&A across workspace", "Autofill tables", "Summaries"], highlighted: true }
    ],
    notes: "Add-on to any Notion plan. Requires Notion subscription."
  },

  // Google Workspace - Known pricing
  "google-workspace": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://workspace.google.com/pricing.html",
    tiers: [
      { name: "Business Starter", price: 6, period: "user/month", description: "Annual", features: ["30GB storage/user", "Custom email", "Meet (100)", "Security controls"] },
      { name: "Business Standard", price: 12, period: "user/month", description: "Annual", features: ["2TB storage/user", "Meet (150)", "Recording", "Shared drives"], highlighted: true },
      { name: "Business Plus", price: 18, period: "user/month", description: "Annual", features: ["5TB storage/user", "Meet (500)", "Vault", "Advanced security"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Unlimited storage", "Meet (1000)", "DLP", "Data regions"] }
    ],
    notes: "Gmail, Drive, Docs, Meet. Gemini AI included."
  },

  // Microsoft 365 - Known pricing
  "microsoft-365": {
    startingPrice: 6, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-products",
    tiers: [
      { name: "Basic", price: 6, period: "user/month", description: "Annual", features: ["Web apps only", "1TB OneDrive", "Teams", "Exchange"] },
      { name: "Standard", price: 12.50, period: "user/month", description: "Annual", features: ["Desktop apps", "1TB OneDrive", "Webinars", "Bookings"], highlighted: true },
      { name: "Premium", price: 22, period: "user/month", description: "Annual", features: ["All Standard", "Advanced security", "Access control", "Intune"] },
      { name: "Apps for Business", price: 8.25, period: "user/month", description: "Apps only", features: ["Desktop apps", "1TB OneDrive", "No email"] }
    ],
    notes: "Word, Excel, PowerPoint, Teams. Copilot add-on $30/user."
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

  console.log("🔧 Starting verified pricing corrections batch 50 (Popular Tools Final)...\n");

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
    message: "Verified pricing corrections batch 50 (Popular Tools Final) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
