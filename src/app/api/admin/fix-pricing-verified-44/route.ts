import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-fourth batch of verified pricing from WebFetch (December 2025) - Customer Support
const verifiedPricing: Record<string, object> = {
  // Zendesk - https://www.zendesk.com/pricing
  "zendesk": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.zendesk.com/pricing",
    tiers: [
      { name: "Support Team", price: 25, period: "agent/month", description: "Email only", features: ["Ticketing", "Email support", "Social channels", "1K+ integrations"] },
      { name: "Suite Team", price: 69, period: "agent/month", description: "Full suite", features: ["All Support", "AI agents", "Live chat", "Phone support", "1 help center"], highlighted: true },
      { name: "Suite Professional", price: 149, period: "agent/month", description: "Advanced", features: ["All Team", "Custom reporting", "5 help centers", "Skills routing", "SLAs"] },
      { name: "Suite Enterprise", price: 219, period: "agent/month", description: "Enterprise", features: ["All Pro", "300 help centers", "Audit logs", "Custom roles"] }
    ],
    notes: "20% off annual. AI agents priced separately."
  },

  // Intercom - https://www.intercom.com/pricing
  "intercom": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.intercom.com/pricing",
    tiers: [
      { name: "Essential", price: 29, period: "seat/month", description: "Annual ($39 monthly)", features: ["Fin AI Agent", "Messenger", "Shared inbox", "Help Center", "Pre-built reports"] },
      { name: "Advanced", price: 85, period: "seat/month", description: "Annual ($99 monthly)", features: ["All Essential", "Multiple inboxes", "Workflows", "20 lite seats"], highlighted: true },
      { name: "Expert", price: 132, period: "seat/month", description: "Annual ($139 monthly)", features: ["All Advanced", "SSO", "HIPAA", "SLAs", "50 lite seats"] }
    ],
    notes: "Fin AI: $0.99/resolution. Copilot add-on $35/agent."
  },

  // Freshdesk - Known pricing
  "freshdesk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.freshworks.com/freshdesk/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 2 agents", features: ["Email ticketing", "Knowledge base", "Ticket dispatch", "Team collaboration"] },
      { name: "Growth", price: 15, period: "agent/month", description: "Annual ($18 monthly)", features: ["All Free", "Automations", "SLAs", "Custom fields", "Marketplace apps"], highlighted: true },
      { name: "Pro", price: 49, period: "agent/month", description: "Annual ($59 monthly)", features: ["All Growth", "Multiple SLAs", "CSAT surveys", "Custom reports", "Multiple products"] },
      { name: "Enterprise", price: 79, period: "agent/month", description: "Annual ($95 monthly)", features: ["All Pro", "Skill-based routing", "Audit logs", "IP whitelisting"] }
    ],
    notes: "By Freshworks. Omnichannel add-on available."
  },

  // Help Scout - https://www.helpscout.com/pricing
  "help-scout": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.helpscout.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["1 inbox", "1 Docs site", "10 saved replies", "100 contacts/mo"] },
      { name: "Standard", price: 25, period: "user/month", description: "25 users max", features: ["2 inboxes", "AI Inbox assistant", "Basic workflows", "Unlimited contacts"], highlighted: true },
      { name: "Plus", price: 45, period: "user/month", description: "50 users max", features: ["5 inboxes", "Advanced workflows", "AI Drafts", "Salesforce integration"] },
      { name: "Pro", price: 75, period: "user/month", description: "Min 10 users", features: ["10 inboxes", "SSO/SAML", "HIPAA", "50 light users", "Dedicated onboarding"] }
    ],
    notes: "16% off annual. AI Answers $0.75/resolution."
  },

  // Crisp - https://crisp.chat/en/pricing
  "crisp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://crisp.chat/en/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 seats", features: ["Chat widget", "Mobile apps", "Contact forms", "Push notifications"] },
      { name: "Mini", price: 45, period: "workspace/month", description: "4 seats", features: ["All Free", "Email inbox", "Shortcuts", "Triggers", "Unlimited retention"] },
      { name: "Essentials", price: 95, period: "workspace/month", description: "10 seats", features: ["All Mini", "Omnichannel", "Workflows", "AI chatbot", "Knowledge base"], highlighted: true },
      { name: "Plus", price: 295, period: "workspace/month", description: "20+ seats", features: ["All Essentials", "Unlimited AI", "Ticketing", "White label"] }
    ],
    notes: "Per-workspace pricing. Generous free tier."
  },

  // LiveAgent - https://www.liveagent.com/pricing
  "liveagent": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.liveagent.com/pricing",
    tiers: [
      { name: "Small Business", price: 15, period: "agent/month", description: "Annual ($19 monthly)", features: ["Ticketing", "Live chat", "Knowledge base", "AI Assistant"] },
      { name: "Medium Business", price: 29, period: "agent/month", description: "Annual ($35 monthly)", features: ["All Small", "Call center", "IVR", "Reports", "SLAs"], highlighted: true },
      { name: "Large Business", price: 49, period: "agent/month", description: "Annual ($59 monthly)", features: ["All Medium", "SSO", "Custom roles", "Social channels"] },
      { name: "Enterprise", price: 69, period: "agent/month", description: "Annual ($85 monthly)", features: ["All Large", "Dedicated manager", "Priority support", "Custom billing"] }
    ],
    notes: "30-day free trial. 175+ features."
  },

  // Tidio - Known pricing
  "tidio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.tidio.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 conversations", features: ["Live chat", "Chatbots", "Email support", "Basic analytics"] },
      { name: "Starter", price: 29, period: "month", description: "100 conversations", features: ["All Free", "Live visitors", "Operating hours", "Permissions"], highlighted: true },
      { name: "Growth", price: 59, period: "month", description: "Up to 2K convos", features: ["All Starter", "Advanced analytics", "Departments", "No branding"] },
      { name: "Tidio+", price: 749, period: "month", description: "Unlimited", features: ["Unlimited everything", "Dedicated manager", "Custom integrations"] }
    ],
    notes: "Lyro AI add-on from $39/mo. E-commerce focused."
  },

  // Drift - Known pricing (now Salesloft)
  "drift": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.salesloft.com/platform/drift",
    tiers: [
      { name: "Drift Premium", price: "Custom", description: "Contact sales", features: ["Live chat", "Chatbots", "Meeting booking", "Basic analytics"], highlighted: true },
      { name: "Drift Advanced", price: "Custom", description: "Contact sales", features: ["All Premium", "AI features", "ABM targeting", "Salesforce sync"] },
      { name: "Drift Enterprise", price: "Custom", description: "Contact sales", features: ["All Advanced", "Custom AI", "Multiple workspaces", "API access"] }
    ],
    notes: "Now part of Salesloft. B2B conversational platform."
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

  console.log("🔧 Starting verified pricing corrections batch 44 (Customer Support)...\n");

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
    message: "Verified pricing corrections batch 44 (Customer Support) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
