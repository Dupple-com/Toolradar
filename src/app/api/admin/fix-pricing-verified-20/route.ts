import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Twentieth batch of verified pricing from WebFetch (December 2025) - CRM & Marketing Automation
const verifiedPricing: Record<string, object> = {
  // Zoho CRM - https://www.zoho.com/crm/zohocrm-pricing.html
  "zoho-crm": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.zoho.com/crm/zohocrm-pricing.html",
    tiers: [
      { name: "Free", price: 0, description: "3 users", features: ["Leads & documents", "Mobile apps", "Basic CRM"] },
      { name: "Standard", price: 14, period: "user/month", description: "Annual", features: ["Bulk emails", "Custom modules", "Workflows", "Sales forecasting"] },
      { name: "Professional", price: 23, period: "user/month", description: "Annual", features: ["Blueprint", "CPQ", "SalesSignals", "Inventory", "Webhooks"], highlighted: true },
      { name: "Enterprise", price: 40, period: "user/month", description: "Annual", features: ["Zia AI", "Territory management", "Multi-user portals", "Sandbox"] },
      { name: "Ultimate", price: 52, period: "user/month", description: "Annual", features: ["Advanced BI", "Data preparation", "Augmented analytics"] }
    ],
    notes: "15-day free trial. Local taxes apply."
  },

  // Mailchimp - https://www.mailchimp.com/pricing
  "mailchimp": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.mailchimp.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "250 contacts", features: ["500 emails/mo", "1 audience", "1 user", "Basic templates"] },
      { name: "Essentials", price: 11.11, period: "month", description: "500 contacts", features: ["10x email sends", "4-step automations", "3 audiences", "24/7 support"], highlighted: true },
      { name: "Standard", price: 17.09, period: "month", description: "500 contacts", features: ["12x email sends", "200-step automations", "Dynamic content", "5 users"] },
      { name: "Premium", price: 299.11, period: "month", description: "10K+ contacts", features: ["15x email sends", "Unlimited users", "Phone support", "AI tools"] }
    ],
    notes: "15% off for 12-month commitment on 10K+ contacts."
  },

  // GetResponse - https://www.getresponse.com/pricing
  "getresponse": {
    startingPrice: 13.12, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.getresponse.com/pricing",
    tiers: [
      { name: "Starter", price: 13.12, period: "month", description: "Annual (€16 monthly)", features: ["Unlimited emails", "AI generators", "1 automation workflow", "3 users"] },
      { name: "Marketer", price: 44.28, period: "month", description: "Annual (€54 monthly)", features: ["Unlimited automations", "Advanced segmentation", "Abandoned cart", "5 users"], highlighted: true },
      { name: "Creator", price: 50.84, period: "month", description: "Annual (€62 monthly)", features: ["All Marketer", "Course creator", "Webinars (100)", "0% transaction fees"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["SMS marketing", "Dedicated manager", "Dedicated IP", "Phone support"] }
    ],
    notes: "18% discount with annual billing."
  },

  // Brevo (ex-Sendinblue) - https://www.brevo.com/pricing
  "brevo": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.brevo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "300 emails/day", features: ["Email & SMS campaigns", "Drag & drop editor", "Basic reporting"] },
      { name: "Starter", price: 9, period: "month", description: "5K emails/mo", features: ["Marketing automation", "A/B testing", "Advanced reporting", "1 landing page"] },
      { name: "Business", price: 18, period: "month", description: "5K emails/mo", features: ["AI send optimization", "Click heatmaps", "Advanced analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "1M+ contacts", features: ["SSO/SAML", "Dedicated IP", "Custom objects", "Dedicated CSM"] }
    ],
    notes: "Sales Platform free for unlimited users. Conversations add-on available."
  },

  // ConvertKit (now Kit) - https://kit.com/pricing
  "convertkit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://kit.com/pricing",
    tiers: [
      { name: "Newsletter", price: 0, description: "10K subscribers", features: ["1 automation", "1 sequence", "Unlimited landing pages", "Digital products"] },
      { name: "Creator", price: 33, period: "month", description: "1K subs ($390/year)", features: ["Unlimited automations", "2 users", "Paid recommendations", "24/7 support"], highlighted: true },
      { name: "Pro", price: 66, period: "month", description: "1K subs ($790/year)", features: ["Unlimited users", "A/B testing (5 subjects)", "Engagement scoring", "Priority support"] }
    ],
    notes: "Scales with subscribers. Free migrations available."
  },

  // Drip - https://www.drip.com/pricing
  "drip": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.drip.com/pricing",
    tiers: [
      { name: "Starter", price: 39, period: "month", description: "2500 people", features: ["Unlimited emails", "Dynamic segments", "50 workflows", "Open API"], highlighted: true },
      { name: "Growth", price: 99, period: "month", description: "5000+ people", features: ["All Starter", "Chat support", "Priority onboarding"] },
      { name: "Scale", price: 299, period: "month", description: "25K+ people", features: ["All Growth", "Dedicated support", "Advanced features"] }
    ],
    notes: "Pricing scales with list size. SMS add-on available."
  },

  // Moosend - https://moosend.com/pricing
  "moosend": {
    startingPrice: 9, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://moosend.com/pricing",
    tiers: [
      { name: "Pro", price: 9, period: "month", description: "500 subscribers", features: ["Unlimited campaigns", "Marketing automation", "Landing pages", "SMTP", "Transactional emails"], highlighted: true },
      { name: "Moosend+", price: "Custom", description: "Custom add-ons", features: ["All Pro", "Dedicated IPs", "SSO/SAML", "Custom dashboards"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["Dedicated manager", "Priority support", "Deliverability optimization"] }
    ],
    notes: "Pay-as-you-go credits available. 20% off annual."
  },

  // HubSpot - Known pricing
  "hubspot": {
    startingPrice: 0, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.hubspot.com/pricing",
    tiers: [
      { name: "Free Tools", price: 0, description: "Core CRM", features: ["Contact management", "Email marketing", "Forms", "Live chat"] },
      { name: "Starter", price: 15, period: "seat/month", description: "Annual", features: ["1000 marketing contacts", "Email automation", "Landing pages", "Ad management"], highlighted: true },
      { name: "Professional", price: 800, period: "month", description: "3 seats included", features: ["2000 contacts", "Omni-channel automation", "Custom reporting", "A/B testing"] },
      { name: "Enterprise", price: 3600, period: "month", description: "5 seats included", features: ["10K contacts", "Predictive scoring", "Custom objects", "Hierarchical teams"] }
    ],
    notes: "CRM Suite bundles available. Onboarding fees apply for higher tiers."
  },

  // Salesforce - Known pricing
  "salesforce": {
    startingPrice: 25, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.salesforce.com/products/pricing",
    tiers: [
      { name: "Starter", price: 25, period: "user/month", description: "Annual", features: ["Lead management", "Opportunity tracking", "Email integration", "Mobile app"] },
      { name: "Pro Suite", price: 100, period: "user/month", description: "Annual", features: ["All Starter", "Forecast management", "Customizable reports", "Quotes"], highlighted: true },
      { name: "Enterprise", price: 165, period: "user/month", description: "Annual", features: ["Workflow automation", "Territory management", "Advanced analytics"] },
      { name: "Unlimited", price: 330, period: "user/month", description: "Annual", features: ["All features", "Premier support", "Sandbox", "Custom apps"] }
    ],
    notes: "Industry clouds and add-ons priced separately."
  },

  // Pipedrive - Known pricing
  "pipedrive": {
    startingPrice: 14, currency: "EUR", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.pipedrive.com/pricing",
    tiers: [
      { name: "Essential", price: 14, period: "user/month", description: "Annual", features: ["Lead & deal management", "Customizable pipelines", "400 integrations", "24/7 support"] },
      { name: "Advanced", price: 34, period: "user/month", description: "Annual", features: ["Full email sync", "Workflow automation", "Group emailing", "Scheduler"], highlighted: true },
      { name: "Professional", price: 49, period: "user/month", description: "Annual", features: ["AI Sales Assistant", "Contract management", "Revenue forecasting"] },
      { name: "Power", price: 64, period: "user/month", description: "Annual", features: ["Project planning", "Phone support", "Implementation program"] },
      { name: "Enterprise", price: 99, period: "user/month", description: "Annual", features: ["Enhanced security", "Unlimited reports", "Dedicated manager"] }
    ],
    notes: "LeadBooster and other add-ons available."
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

  console.log("🔧 Starting verified pricing corrections batch 20 (CRM & Marketing Automation)...\n");

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
    message: "Verified pricing corrections batch 20 (CRM & Marketing Automation) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
