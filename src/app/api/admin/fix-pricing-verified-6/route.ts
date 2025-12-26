import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Sixth batch of verified pricing from WebFetch (December 2025) - Project Management & Support
const verifiedPricing: Record<string, object> = {
  // Monday.com - https://www.monday.com/pricing
  "monday": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.monday.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 2 seats", features: ["3 boards", "200+ templates", "Basic features"] },
      { name: "Basic", price: 9, period: "seat/month", description: "Billed annually", features: ["Unlimited boards", "5GB storage", "Prioritized support"] },
      { name: "Standard", price: 12, period: "seat/month", description: "Billed annually", features: ["Timeline & Gantt", "Guest access", "250 automations"], highlighted: true },
      { name: "Pro", price: 19, period: "seat/month", description: "Billed annually", features: ["Private boards", "Time tracking", "25K automations"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced security", "Enterprise features"] }
    ],
    notes: "18% discount for annual billing vs monthly"
  },

  // Smartsheet - https://smartsheet.com/pricing
  "smartsheet": {
    startingPrice: 129, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://smartsheet.com/pricing",
    tiers: [
      { name: "Pro", price: 129, period: "member/month", description: "1-10 members", features: ["Unlimited sheets", "Gantt & calendar views", "250 automations/mo"] },
      { name: "Business", price: 249, period: "member/month", description: "3+ members, Most popular", features: ["Timeline view", "Unlimited automations", "1 TB storage"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "10+ members", features: ["AI formulas", "SSO/SAML", "Unlimited storage"] }
    ]
  },

  // Shortcut - https://www.shortcut.com/pricing
  "shortcut": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.shortcut.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 10 users", features: ["Basic features", "Limited integrations"] },
      { name: "Team", price: 8.50, period: "month/user", description: "Yearly ($10 monthly)", features: ["Unlimited users", "All integrations", "Advanced features"], highlighted: true },
      { name: "Business", price: 12, period: "month/user", description: "Yearly ($16 monthly)", features: ["Priority support", "Business features"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Enterprise features", "Dedicated support"] }
    ]
  },

  // ClickUp - https://www.clickup.com/pricing
  "clickup": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.clickup.com/pricing",
    tiers: [
      { name: "Free Forever", price: 0, description: "Personal use", features: ["Unlimited tasks", "60MB storage", "Basic features"] },
      { name: "Unlimited", price: 7, period: "user/month", description: "Yearly", features: ["Unlimited storage", "Gantt charts", "Integrations"], highlighted: true },
      { name: "Business", price: 12, period: "user/month", description: "Yearly", features: ["SSO", "Mind maps", "Whiteboards"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["White labeling", "Advanced permissions"] }
    ],
    notes: "100% money-back guarantee. Up to 30% savings with yearly billing."
  },

  // Notion - https://www.notion.com/pricing
  "notion": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["Unlimited pages", "Share with 10 guests", "7-day history"] },
      { name: "Plus", price: 9.50, period: "member/month", description: "Small teams", features: ["Unlimited blocks", "Unlimited guests", "30-day history"], highlighted: true },
      { name: "Business", price: 19.50, period: "member/month", description: "Recommended", features: ["SAML SSO", "Private teamspaces", "90-day history"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced security", "Audit log", "Dedicated CSM"] }
    ],
    notes: "Save up to 20% with yearly billing"
  },

  // Airtable - https://www.airtable.com/pricing
  "airtable": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.airtable.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Unlimited bases", features: ["1,000 records/base", "Basic features", "Free viewers"] },
      { name: "Team", price: 20, period: "user/month", description: "Annual billing", features: ["50,000 records/base", "Priority support", "Extensions"], highlighted: true },
      { name: "Business", price: 45, period: "user/month", description: "Annual billing", features: ["100,000 records/base", "Advanced automation", "Admin controls"] },
      { name: "Enterprise Scale", price: "Custom", description: "Contact sales", features: ["500,000 records/base", "Dedicated support", "Advanced governance"] }
    ]
  },

  // Intercom - https://www.intercom.com/pricing
  "intercom": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.intercom.com/pricing",
    tiers: [
      { name: "Essential", price: 29, period: "seat/month", description: "Annual ($39 monthly)", features: ["Fin AI Agent $0.99/resolution", "Shared inbox", "Basic features"] },
      { name: "Advanced", price: 85, period: "seat/month", description: "Annual ($99 monthly)", features: ["Automation tools", "AI capabilities", "Workflows"], highlighted: true },
      { name: "Expert", price: 132, period: "seat/month", description: "Annual ($139 monthly)", features: ["Collaboration", "Security features", "Advanced reporting"] }
    ],
    notes: "Fin AI Agent: $0.99 per resolution. Add-ons: Proactive Support Plus $99/mo, Copilot $35/agent/mo"
  },

  // Help Scout - https://www.helpscout.com/pricing/
  "help-scout": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.helpscout.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["5 users max", "1 inbox", "1 Docs site"] },
      { name: "Standard", price: 25, period: "user/month", description: "Growing teams", features: ["Unlimited users", "Automation", "Reporting"] },
      { name: "Plus", price: 45, period: "user/month", description: "Popular", features: ["Multi-channel", "Advanced analytics", "Custom fields"], highlighted: true },
      { name: "Pro", price: 75, period: "user/month", description: "Enterprise scale", features: ["Security controls", "Enterprise features", "Premium support"] }
    ],
    notes: "AI Answers add-on: $0.75 per resolution"
  },

  // Crisp - https://crisp.chat/en/pricing/
  "crisp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://crisp.chat/en/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["2 seats", "Website chat", "Mobile apps"] },
      { name: "Mini", price: 45, period: "month/workspace", description: "Early-stage", features: ["4 seats", "Email inbox", "Chat triggers"] },
      { name: "Essentials", price: 95, period: "month/workspace", description: "Full-featured", features: ["10 seats", "AI chatbot", "Knowledge base"], highlighted: true },
      { name: "Plus", price: 295, period: "month/workspace", description: "Best value", features: ["20+ seats", "Unlimited AI resolutions", "White labeling"] }
    ],
    notes: "Additional agents: $10/month each"
  },

  // LiveChat - https://www.livechat.com/pricing/
  "livechat": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.livechat.com/pricing/",
    tiers: [
      { name: "Starter", price: 19, period: "person/month", description: "Annual ($25 monthly)", features: ["100 visitors tracked", "1 campaign", "60-day history"] },
      { name: "Team", price: 49, period: "person/month", description: "Annual ($59 monthly)", features: ["400 visitors", "Unlimited campaigns", "Unlimited history"], highlighted: true },
      { name: "Business", price: 79, period: "person/month", description: "Annual ($89 monthly)", features: ["1000 visitors", "Work scheduler", "SMS & Apple Messages"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Dedicated manager", "White-label", "HIPAA compliance"] }
    ]
  },

  // Zendesk - https://www.zendesk.com/pricing/
  "zendesk": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.zendesk.com/pricing/",
    tiers: [
      { name: "Support Team", price: 19, period: "agent/month", description: "Annual ($25 monthly)", features: ["Email support", "Ticket routing", "Basic reports"] },
      { name: "Suite Team", price: 55, period: "agent/month", description: "Annual", features: ["Messaging", "AI agents", "1000+ integrations"], highlighted: true },
      { name: "Suite Professional", price: 115, period: "agent/month", description: "Annual", features: ["Custom analytics", "Skills-based routing", "SLAs"] },
      { name: "Suite Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced AI", "Custom roles", "Sandbox"] }
    ]
  },

  // Tidio - https://www.tidio.com/pricing/
  "tidio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tidio.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Getting started", features: ["50 conversations", "10 seats", "Basic features"] },
      { name: "Starter", price: 24.17, period: "month", description: "Annual ($19.33/mo)", features: ["100 conversations", "10 seats", "Live chat"] },
      { name: "Growth", price: 49.17, period: "month", description: "Annual ($39.33/mo)", features: ["2000 conversations", "10 seats", "Analytics"], highlighted: true },
      { name: "Plus", price: 749, period: "month", description: "Custom volume", features: ["Custom conversations", "Custom seats", "Premium features"] }
    ],
    notes: "Lyro AI Agent add-on from $32.50/mo"
  },

  // Chatwoot - https://www.chatwoot.com/pricing
  "chatwoot": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 15,
    pricingPageUrl: "https://www.chatwoot.com/pricing",
    tiers: [
      { name: "Hacker", price: 0, description: "Up to 2 agents", features: ["500 conversations/mo", "30-day retention", "Basic features"] },
      { name: "Startups", price: 19, period: "agent/month", description: "Unlimited conversations", features: ["1-year retention", "All channels", "Collaboration"] },
      { name: "Business", price: 39, period: "agent/month", description: "Fair use policy", features: ["2-year retention", "Teams", "Automation"], highlighted: true },
      { name: "Enterprise", price: 99, period: "agent/month", description: "20+ agents", features: ["3-year retention", "SSO", "Dedicated manager"] }
    ]
  },

  // Asana - https://www.asana.com/pricing
  "asana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.asana.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Up to 2 users", features: ["Unlimited tasks", "Basic features", "Mobile apps"] },
      { name: "Starter", price: 10.99, period: "user/month", description: "Annual ($13.49 monthly)", features: ["Timeline view", "Dashboards", "Forms"], highlighted: true },
      { name: "Advanced", price: 24.99, period: "user/month", description: "Annual ($30.49 monthly)", features: ["Portfolios", "Goals", "Resource management"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Advanced security", "Custom branding", "Priority support"] }
    ]
  },

  // Trello - https://trello.com/pricing
  "trello": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://trello.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 collaborators", features: ["Unlimited cards", "Power-Ups", "Mobile apps"] },
      { name: "Standard", price: 5, period: "user/month", description: "Annual ($6 monthly)", features: ["Unlimited boards", "Card mirroring", "Automations"], highlighted: true },
      { name: "Premium", price: 10, period: "user/month", description: "Annual ($12.50 monthly)", features: ["AI features", "Admin controls", "Views"] },
      { name: "Enterprise", price: 210, period: "user/year", description: "Minimum, scales down", features: ["Enterprise security", "Atlassian Guard", "24/7 support"] }
    ]
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

  console.log("🔧 Starting verified pricing corrections batch 6 (Project Management & Support)...\n");

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
    message: "Verified pricing corrections batch 6 (Project Management & Support) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
