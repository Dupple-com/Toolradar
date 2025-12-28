import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twenty-fourth batch of verified pricing from WebFetch (December 2025) - Customer Support & Help Desk
const verifiedPricing: Record<string, object> = {
  // Zendesk - https://www.zendesk.com/pricing
  "zendesk": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.zendesk.com/pricing",
    tiers: [
      { name: "Support Team", price: 19, period: "agent/month", description: "Annual ($25 monthly)", features: ["Email support", "Ticketing", "Basic automation"] },
      { name: "Suite Team", price: 55, period: "agent/month", description: "Annual ($69 monthly)", features: ["AI automation", "Omnichannel", "Help center"], highlighted: true },
      { name: "Suite Professional", price: 115, period: "agent/month", description: "Annual ($149 monthly)", features: ["All Suite Team", "Custom analytics", "SLA management"] },
      { name: "Suite Enterprise", price: 169, period: "agent/month", description: "Annual ($219 monthly)", features: ["All Professional", "AI change management", "Sandbox"] }
    ],
    notes: "Sell CRM plans also available. Volume discounts."
  },

  // Intercom - https://www.intercom.com/pricing
  "intercom": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.intercom.com/pricing",
    tiers: [
      { name: "Essential", price: 29, period: "seat/month", description: "Annual ($39 monthly)", features: ["Fin AI Agent", "Shared inbox", "Basic automation"] },
      { name: "Advanced", price: 85, period: "seat/month", description: "Annual ($99 monthly)", features: ["All Essential", "20 Lite seats", "Advanced workflows"], highlighted: true },
      { name: "Expert", price: 132, period: "seat/month", description: "Annual ($139 monthly)", features: ["All Advanced", "50 Lite seats", "Enterprise features"] }
    ],
    notes: "Fin AI Agent: $0.99/resolution. Copilot add-on: $35/agent/mo."
  },

  // Help Scout - https://www.helpscout.com/pricing
  "help-scout": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.helpscout.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 users", features: ["1 inbox", "1 Docs site", "Basic features"] },
      { name: "Standard", price: 25, period: "user/month", description: "Annual", features: ["Multiple inboxes", "Basic workflows", "Unlimited tags"] },
      { name: "Plus", price: 45, period: "user/month", description: "Annual (Popular)", features: ["Advanced workflows", "AI Drafts", "Salesforce/Jira integration"], highlighted: true },
      { name: "Pro", price: 75, period: "user/month", description: "Annual", features: ["Unlimited workflows", "SSO/SAML", "HIPAA compliance"] }
    ],
    notes: "16% off annual. AI Answers: $0.75/resolution."
  },

  // Crisp - https://www.crisp.chat/en/pricing
  "crisp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.crisp.chat/en/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 agents", features: ["Live chat", "Shared inbox", "Mobile apps", "Contact forms"] },
      { name: "Mini", price: 45, period: "workspace/month", description: "4 agents", features: ["Email inbox", "Canned responses", "Chat triggers"] },
      { name: "Essentials", price: 95, period: "workspace/month", description: "10 agents", features: ["Omnichannel", "AI chatbot", "Knowledge base", "Analytics"], highlighted: true },
      { name: "Plus", price: 295, period: "workspace/month", description: "20+ agents", features: ["Unlimited AI", "Ticketing", "100+ integrations", "White-label"] }
    ],
    notes: "Flat pricing per workspace. Extra agents: $10/mo."
  },

  // Tidio - https://www.tidio.com/pricing
  "tidio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.tidio.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "50 conversations", features: ["10 seats", "Live chat", "Basic features"] },
      { name: "Starter", price: 24.17, period: "month", description: "100 conversations", features: ["10 seats", "Analytics", "Visitors list"] },
      { name: "Growth", price: 49.17, period: "month", description: "2K conversations", features: ["10 seats", "Advanced analytics", "Permissions"], highlighted: true },
      { name: "Plus", price: 749, period: "month", description: "Custom", features: ["Custom seats", "Dedicated manager", "Custom branding"] }
    ],
    notes: "Lyro AI from $32.50/mo. Flows from $24.17/mo. 2 months free annual."
  },

  // LiveAgent - https://www.liveagent.com/pricing
  "liveagent": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.liveagent.com/pricing",
    tiers: [
      { name: "Small Business", price: 15, period: "agent/month", description: "Annual ($19 monthly)", features: ["Ticketing", "Live chat", "Knowledge base", "AI features"] },
      { name: "Medium Business", price: 29, period: "agent/month", description: "Annual ($35 monthly)", features: ["All Small", "Call center", "IVR", "SLA", "Reports"], highlighted: true },
      { name: "Large Business", price: 49, period: "agent/month", description: "Annual ($59 monthly)", features: ["All Medium", "SSO", "Custom roles", "Social channels"] },
      { name: "Enterprise", price: 69, period: "agent/month", description: "Annual ($85 monthly)", features: ["All features", "Dedicated manager", "Priority support"] }
    ],
    notes: "No setup fees. Social channels extra on lower tiers."
  },

  // Front - https://front.com/pricing
  "front": {
    startingPrice: 25, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://front.com/pricing",
    tiers: [
      { name: "Starter", price: 25, period: "seat/month", description: "Annual (10 seats max)", features: ["Single channel", "Shared inbox", "Basic analytics", "Knowledge base"] },
      { name: "Professional", price: 65, period: "seat/month", description: "Annual (50 seats max)", features: ["Omnichannel", "Advanced analytics", "20 automation rules"], highlighted: true },
      { name: "Enterprise", price: 105, period: "seat/month", description: "Annual only", features: ["Unlimited seats", "AI Copilot included", "Smart QA/CSAT", "Custom roles"] }
    ],
    notes: "AI Autopilot: $0.89/resolution. Add-ons from $10-20/seat/mo."
  },

  // Freshdesk - Known pricing
  "freshdesk": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.freshdesk.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "10 agents", features: ["Email ticketing", "Knowledge base", "Basic automation"] },
      { name: "Growth", price: 15, period: "agent/month", description: "Annual ($18 monthly)", features: ["All Free", "Collision detection", "SLA management", "Marketplace apps"], highlighted: true },
      { name: "Pro", price: 49, period: "agent/month", description: "Annual ($59 monthly)", features: ["All Growth", "Round-robin", "CSAT surveys", "Custom reports"] },
      { name: "Enterprise", price: 79, period: "agent/month", description: "Annual ($95 monthly)", features: ["All Pro", "Skill-based routing", "Sandbox", "Audit log"] }
    ],
    notes: "Freddy AI add-ons available. Omnichannel suite separate."
  },

  // Hubspot Service Hub - Known pricing
  "hubspot-service": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hubspot.com/pricing/service",
    tiers: [
      { name: "Free Tools", price: 0, description: "Core features", features: ["Ticketing", "Live chat", "Calling SDK", "Basic bots"] },
      { name: "Starter", price: 15, period: "seat/month", description: "Annual", features: ["All Free", "Email templates", "Canned snippets", "Simple automation"], highlighted: true },
      { name: "Professional", price: 90, period: "month", description: "1 seat included", features: ["Help desk", "Knowledge base", "Customer portal", "SLA"] },
      { name: "Enterprise", price: 130, period: "seat/month", description: "Annual", features: ["All Professional", "Playbooks", "Custom objects", "Goals"] }
    ],
    notes: "CRM Suite bundles available. Onboarding fees for higher tiers."
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

  console.log("🔧 Starting verified pricing corrections batch 24 (Customer Support & Help Desk)...\n");

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
    message: "Verified pricing corrections batch 24 (Customer Support & Help Desk) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
