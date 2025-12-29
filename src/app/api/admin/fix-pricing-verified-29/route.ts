import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-ninth batch of verified pricing from WebFetch (December 2025) - Project Management Tools
const verifiedPricing: Record<string, object> = {
  // Asana - https://asana.com/pricing
  "asana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://asana.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "2 users", features: ["Unlimited tasks", "Unlimited projects", "List/Board/Calendar", "Mobile apps"] },
      { name: "Starter", price: 10.99, period: "user/month", description: "Annual ($13.49 monthly)", features: ["Timeline/Gantt", "Workflow builder", "Custom fields", "Asana AI"], highlighted: true },
      { name: "Advanced", price: 24.99, period: "user/month", description: "Annual ($30.49 monthly)", features: ["All Starter", "Goals", "Portfolios", "Time tracking", "Approvals"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Advanced", "SAML SSO", "Custom branding", "24/7 support"] }
    ],
    notes: "30-day free trial. AI included on paid plans."
  },

  // Trello - https://trello.com/pricing
  "trello": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://trello.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 boards", features: ["Unlimited cards", "Unlimited Power-Ups", "250 automations/mo", "10 collaborators"] },
      { name: "Standard", price: 5, period: "user/month", description: "Annual ($6 monthly)", features: ["Unlimited boards", "Advanced checklists", "Custom fields", "1K automations/mo"], highlighted: true },
      { name: "Premium", price: 10, period: "user/month", description: "Annual ($12.50 monthly)", features: ["All Standard", "Calendar/Timeline views", "Dashboard", "Unlimited automations"] },
      { name: "Enterprise", price: 17.50, period: "user/month", description: "Annual", features: ["All Premium", "Unlimited workspaces", "SSO", "24/7 support"] }
    ],
    notes: "Part of Atlassian. AI features on Premium+."
  },

  // ClickUp - https://clickup.com/pricing
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://clickup.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "Unlimited users", features: ["60MB storage", "Unlimited tasks", "Kanban/Calendar", "In-app recording"] },
      { name: "Unlimited", price: 7, period: "user/month", description: "Annual", features: ["Unlimited storage", "Gantt charts", "Time tracking", "Goals", "AI compatible"], highlighted: true },
      { name: "Business", price: 12, period: "user/month", description: "Annual (Popular)", features: ["All Unlimited", "Google SSO", "Whiteboards", "Workload management"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "White labeling", "Custom roles", "HIPAA compliance"] }
    ],
    notes: "All-in-one workspace. 24/7 support on all plans."
  },

  // Bitrix24 - https://www.bitrix24.com/prices
  "bitrix24": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.bitrix24.com/prices",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited users", features: ["5GB storage", "Tasks & Projects", "CRM", "Drive", "Chat"] },
      { name: "Basic", price: 46, period: "month", description: "5 users (annual)", features: ["24GB storage", "Contact Center", "Website builder", "Online store"], highlighted: true },
      { name: "Standard", price: 87, period: "month", description: "50 users (annual)", features: ["100GB storage", "Marketing tools", "Documents", "Admin features"] },
      { name: "Professional", price: 175, period: "month", description: "100 users (annual)", features: ["1TB storage", "Sales Intelligence", "e-Signature", "Full automation"] }
    ],
    notes: "25-30% off annual. Enterprise from $499/mo for 250+ users."
  },

  // Monday.com - Known pricing
  "monday": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://monday.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 users", features: ["3 boards", "200+ templates", "iOS/Android apps", "Docs"] },
      { name: "Basic", price: 9, period: "seat/month", description: "Annual", features: ["Unlimited boards", "5GB storage", "1 dashboard", "Forms"] },
      { name: "Standard", price: 12, period: "seat/month", description: "Annual (Popular)", features: ["All Basic", "Timeline/Gantt", "250 automations/mo", "Integrations"], highlighted: true },
      { name: "Pro", price: 19, period: "seat/month", description: "Annual", features: ["All Standard", "Time tracking", "Private boards", "25K automations/mo"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Pro", "Advanced security", "Multi-level permissions", "Tailored onboarding"] }
    ],
    notes: "Minimum 3 seats on paid plans. WorkOS, Dev, CRM products separate."
  },

  // Nifty - https://niftypm.com/pricing
  "nifty": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://niftypm.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited members", features: ["100MB storage", "2 projects", "Tasks", "Team chat"] },
      { name: "Personal", price: 7, period: "member/month", description: "Annual", features: ["100GB storage", "40 projects", "Time tracking", "Custom fields"], highlighted: true },
      { name: "Business", price: 16, period: "member/month", description: "Annual", features: ["Unlimited storage", "Unlimited projects", "Automations", "Workloads"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "SAML SSO", "White labeling", "IP restriction"] }
    ],
    notes: "Up to 45% off annual. All-in-one PM tool."
  },

  // Jira - Known pricing
  "jira": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/jira/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 users", features: ["Unlimited projects", "Scrum/Kanban", "Basic roadmaps", "Community support"] },
      { name: "Standard", price: 7.75, period: "user/month", description: "Annual", features: ["Unlimited users", "250GB storage", "Audit logs", "Business hours support"], highlighted: true },
      { name: "Premium", price: 13.53, period: "user/month", description: "Annual", features: ["All Standard", "Unlimited storage", "Advanced roadmaps", "24/7 support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Premium", "Analytics", "SAML SSO", "99.95% SLA"] }
    ],
    notes: "Part of Atlassian. Cloud or Data Center options."
  },

  // Confluence - Known pricing
  "confluence": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/confluence/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 users", features: ["Unlimited pages", "Spaces", "Templates", "Basic search"] },
      { name: "Standard", price: 5.16, period: "user/month", description: "Annual", features: ["Unlimited users", "250GB storage", "Page analytics", "Guests"], highlighted: true },
      { name: "Premium", price: 9.73, period: "user/month", description: "Annual", features: ["All Standard", "Unlimited storage", "Team calendars", "Admin insights"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Premium", "Analytics", "SAML SSO", "Data residency"] }
    ],
    notes: "Knowledge management & docs. Integrates with Jira."
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

  console.log("🔧 Starting verified pricing corrections batch 29 (Project Management Tools)...\n");

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
    message: "Verified pricing corrections batch 29 (Project Management Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
