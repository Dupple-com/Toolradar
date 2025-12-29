import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 56: Communication & Collaboration pricing
const verifiedPricing: Record<string, object> = {
  "slack": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://slack.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Small teams", features: ["90-day history", "10 integrations", "1:1 calls"] },
      { name: "Pro", price: 8.75, period: "user/month", description: "Annual", features: ["Unlimited history", "Unlimited integrations", "Group calls"], highlighted: true },
      { name: "Business+", price: 15, period: "user/month", description: "Annual", features: ["SAML SSO", "Compliance", "Priority support"] }
    ],
    notes: "Free tier limited to 90 days message history."
  },
  "discord": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://discord.com/nitro",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Text/Voice/Video", "Screen share", "Communities"], highlighted: true },
      { name: "Nitro Basic", price: 2.99, period: "month", description: "Enhanced", features: ["Custom emoji", "50MB uploads", "HD video"] },
      { name: "Nitro", price: 9.99, period: "month", description: "Full", features: ["100MB uploads", "4K streaming", "Server boosts"] }
    ],
    notes: "Core platform is free. Nitro for extra features."
  },
  "zoom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://zoom.us/pricing",
    tiers: [
      { name: "Basic", price: 0, description: "Personal", features: ["100 participants", "40-min limit", "Unlimited 1:1"] },
      { name: "Pro", price: 15.99, period: "user/month", description: "Annual", features: ["30-hour meetings", "Cloud storage", "Reports"], highlighted: true },
      { name: "Business", price: 21.99, period: "user/month", description: "Annual", features: ["300 participants", "Branding", "SSO"] }
    ],
    notes: "Free tier has 40-minute limit on group calls."
  },
  "google-meet": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://workspace.google.com/pricing.html",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["100 participants", "60-min limit", "Google account required"], highlighted: true },
      { name: "Business Starter", price: 6, period: "user/month", description: "Annual", features: ["24-hour meetings", "100 participants", "30GB Drive"] }
    ],
    notes: "Part of Google Workspace. Free tier available."
  },
  "microsoft-teams": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["100 participants", "60-min meetings", "5GB storage"] },
      { name: "Essentials", price: 4, period: "user/month", description: "Annual", features: ["300 participants", "30-hour meetings", "10GB storage"], highlighted: true },
      { name: "Business Basic", price: 6, period: "user/month", description: "Annual", features: ["300 participants", "1TB storage", "Recording"] }
    ],
    notes: "Free tier available. Part of Microsoft 365."
  },
  "whereby": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://whereby.com/information/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["1 room", "45-min meetings", "100 participants"] },
      { name: "Pro", price: 8.99, period: "month", description: "Professionals", features: ["3 rooms", "Unlimited time", "Recording"], highlighted: true },
      { name: "Business", price: 11.99, period: "month", description: "Teams", features: ["Unlimited rooms", "Branding", "Analytics"] }
    ],
    notes: "No downloads needed. Browser-based video calls."
  },
  "around": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.around.co/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited meetings", "Screen share", "Floating heads"], highlighted: true },
      { name: "Pro", price: 9.50, period: "user/month", description: "Teams", features: ["Admin controls", "SSO", "Priority support"] }
    ],
    notes: "Floating video bubbles. Free for individuals."
  },
  "loom": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free", features: ["25 videos", "5 min limit", "Basic features"] },
      { name: "Business", price: 15, period: "user/month", description: "Annual", features: ["Unlimited videos", "Custom branding", "Analytics"], highlighted: true },
      { name: "Enterprise", price: 0, period: "custom", description: "Custom", features: ["SSO/SCIM", "Advanced security", "Dedicated support"] }
    ],
    notes: "Async video messaging. Free tier with limits."
  },
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://miro.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Casual use", features: ["3 boards", "Anonymous viewers", "Templates"] },
      { name: "Starter", price: 8, period: "user/month", description: "Annual", features: ["Unlimited boards", "Private sharing", "Custom templates"], highlighted: true },
      { name: "Business", price: 16, period: "user/month", description: "Annual", features: ["Smart diagramming", "SSO", "Attention management"] }
    ],
    notes: "Visual collaboration whiteboard. Free tier available."
  },
  "figma": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.figma.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["3 Figma files", "3 FigJam files", "Unlimited viewers"] },
      { name: "Professional", price: 15, period: "editor/month", description: "Annual", features: ["Unlimited files", "Private projects", "Dev mode"], highlighted: true },
      { name: "Organization", price: 45, period: "editor/month", description: "Annual", features: ["Design systems", "Branching", "SSO"] }
    ],
    notes: "Design and prototyping. Free tier for 3 files."
  },
  "notion": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.so/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited pages", "5MB uploads", "7-day history"] },
      { name: "Plus", price: 10, period: "user/month", description: "Annual", features: ["Unlimited uploads", "30-day history", "100 guests"], highlighted: true },
      { name: "Business", price: 18, period: "user/month", description: "Annual", features: ["SAML SSO", "Private spaces", "90-day history"] }
    ],
    notes: "Notes, docs, wikis. Generous free tier."
  },
  "coda": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://coda.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited docs", "Collaborative editing", "Basic packs"] },
      { name: "Pro", price: 10, period: "doc-maker/month", description: "Annual", features: ["Unlimited tables", "All packs", "Private docs"], highlighted: true },
      { name: "Team", price: 30, period: "doc-maker/month", description: "Annual", features: ["Admin controls", "Cross-doc sync", "Priority support"] }
    ],
    notes: "All-in-one doc. Free tier available."
  },
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://clickup.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited tasks", "100MB storage", "2FA"] },
      { name: "Unlimited", price: 7, period: "user/month", description: "Annual", features: ["Unlimited storage", "Dashboards", "Integrations"], highlighted: true },
      { name: "Business", price: 12, period: "user/month", description: "Annual", features: ["Goals", "Workload", "Timelines"] }
    ],
    notes: "Project management. Generous free tier."
  },
  "asana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://asana.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Individuals", features: ["Unlimited tasks", "List view", "Basic dashboards"] },
      { name: "Starter", price: 10.99, period: "user/month", description: "Annual", features: ["Timeline", "Workflows", "Forms"], highlighted: true },
      { name: "Advanced", price: 24.99, period: "user/month", description: "Annual", features: ["Portfolios", "Goals", "Advanced reporting"] }
    ],
    notes: "Project management. Free for basic use."
  },
  "linear": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://linear.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 250 issues", features: ["Unlimited members", "All integrations", "API access"] },
      { name: "Standard", price: 8, period: "user/month", description: "Annual", features: ["Unlimited issues", "Priority support", "SSO"], highlighted: true },
      { name: "Plus", price: 14, period: "user/month", description: "Annual", features: ["Insights", "Time estimates", "Guest access"] }
    ],
    notes: "Modern issue tracking. Free for small projects."
  },
  "monday": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://monday.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 users", features: ["Up to 3 boards", "Unlimited docs", "200+ templates"] },
      { name: "Basic", price: 9, period: "user/month", description: "Annual", features: ["Unlimited items", "5GB storage", "Dashboard"], highlighted: true },
      { name: "Standard", price: 12, period: "user/month", description: "Annual", features: ["Timeline", "Calendar", "Automations"] }
    ],
    notes: "Work OS platform. Free for 2 users."
  },
  "trello": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://trello.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited cards", "10 boards/workspace", "Unlimited Power-Ups"] },
      { name: "Standard", price: 5, period: "user/month", description: "Annual", features: ["Unlimited boards", "Advanced checklists", "Custom fields"], highlighted: true },
      { name: "Premium", price: 10, period: "user/month", description: "Annual", features: ["Dashboard view", "Timeline", "Admin controls"] }
    ],
    notes: "Kanban boards. Generous free tier."
  },
  "basecamp": {
    startingPrice: 15, currency: "USD", billingPeriod: "user/month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://basecamp.com/pricing",
    tiers: [
      { name: "Basecamp", price: 15, period: "user/month", description: "Per user", features: ["Projects", "Messages", "Schedules", "Docs"], highlighted: true },
      { name: "Basecamp Pro Unlimited", price: 349, period: "month", description: "Flat rate", features: ["Unlimited users", "All features", "1:1 onboarding"] }
    ],
    notes: "Project management. $349/mo flat for unlimited users."
  },
  "height": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://height.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited members", features: ["Unlimited tasks", "All views", "Integrations"], highlighted: true },
      { name: "Team", price: 8.50, period: "user/month", description: "Annual", features: ["Advanced automation", "Private lists", "Priority support"] }
    ],
    notes: "Modern project management. Free tier very generous."
  },
  "todoist": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://todoist.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["5 projects", "5 collaborators", "Basic features"] },
      { name: "Pro", price: 4, period: "month", description: "Annual", features: ["300 projects", "25 collaborators", "Reminders"], highlighted: true },
      { name: "Business", price: 6, period: "user/month", description: "Annual", features: ["Team workspace", "Admin controls", "Priority support"] }
    ],
    notes: "Personal task manager. Free tier available."
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
    message: "Pricing batch 56 (Communication & Collaboration) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
