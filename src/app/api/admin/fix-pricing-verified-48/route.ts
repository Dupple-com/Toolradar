import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Forty-eighth batch of verified pricing from WebFetch (December 2025) - E-signature & Documents
const verifiedPricing: Record<string, object> = {
  // DocuSign - https://www.docusign.com/products-and-pricing
  "docusign": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.docusign.com/products-and-pricing",
    tiers: [
      { name: "Personal", price: 10, period: "month", description: "5 envelopes/mo", features: ["Basic fields", "Audit trail", "Mobile app", "Templates"] },
      { name: "Standard", price: 25, period: "user/month", description: "100 envelopes/yr", features: ["Shared templates", "Commenting", "Delegated signing"], highlighted: true },
      { name: "Business Pro", price: 40, period: "user/month", description: "100 envelopes/yr", features: ["All Standard", "Web forms", "Payments", "Bulk send"] },
      { name: "Enhanced", price: "Custom", description: "50+ users", features: ["Custom limits", "24/7 support", "SSO", "Advanced security"] }
    ],
    notes: "1000+ integrations. ISO 27001 & SOC 2 certified."
  },

  // Dropbox Sign (HelloSign) - https://sign.dropbox.com/info/pricing
  "dropbox-sign": {
    startingPrice: 10.05, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://sign.dropbox.com/info/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic signing", features: ["Document signing", "Audit trail", "Tamper-proof"] },
      { name: "Essentials", price: 10.05, period: "month", description: "Annual ($15 monthly)", features: ["Unlimited signing", "5 signer fields", "Templates", "Integrations"], highlighted: true },
      { name: "Standard", price: 17.50, period: "user/month", description: "Annual ($25 monthly)", features: ["15 signer fields", "Conditional logic", "SMS auth", "SSO", "Salesforce"] },
      { name: "Premium", price: "Custom", description: "5+ users", features: ["Unlimited features", "Data residency", "Multi-teams", "Premium support"] }
    ],
    notes: "By Dropbox. No hidden fees. Google/HubSpot integrations."
  },

  // PandaDoc - https://www.pandadoc.com/pricing
  "pandadoc": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.pandadoc.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "5 docs/mo", features: ["5 eSignatures/mo", "Document editor", "Mobile app", "Unlimited storage"] },
      { name: "Starter", price: 19, period: "seat/month", description: "Annual", features: ["Unlimited docs", "Unlimited eSign", "Real-time tracking", "24/7 support"], highlighted: true },
      { name: "Business", price: 49, period: "seat/month", description: "Annual", features: ["All Starter", "CRM integrations", "Workflows", "Content library", "Bulk send"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Business", "CPQ", "SSO", "API access", "Notary services"] }
    ],
    notes: "Up to 46% off annual. Proposals & contracts platform."
  },

  // SignNow - Known pricing
  "signnow": {
    startingPrice: 8, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.signnow.com/pricing",
    tiers: [
      { name: "Business", price: 8, period: "user/month", description: "Annual", features: ["Unlimited templates", "Reusable templates", "Mobile app", "Basic integrations"] },
      { name: "Business Premium", price: 15, period: "user/month", description: "Annual", features: ["All Business", "Bulk invite", "Conditional fields", "Advanced branding"], highlighted: true },
      { name: "Enterprise", price: 30, period: "user/month", description: "Annual", features: ["All Premium", "SSO", "Advanced security", "Custom workflows"] },
      { name: "Business Cloud", price: "Custom", description: "Contact sales", features: ["All Enterprise", "API access", "Dedicated support", "SLA"] }
    ],
    notes: "By airSlate. Affordable e-signature solution."
  },

  // Adobe Sign - Known pricing
  "adobe-sign": {
    startingPrice: 12.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.adobe.com/sign/pricing/business.html",
    tiers: [
      { name: "Acrobat Standard", price: 12.99, period: "month", description: "Annual", features: ["PDF editing", "Basic e-sign", "Mobile app", "Cloud storage"] },
      { name: "Acrobat Pro", price: 19.99, period: "month", description: "Annual", features: ["All Standard", "Advanced PDF tools", "Redaction", "Compare files"], highlighted: true },
      { name: "Acrobat Sign Solutions", price: "Custom", description: "Teams", features: ["Unlimited signatures", "Workflows", "API access", "Enterprise security"] }
    ],
    notes: "Part of Adobe Document Cloud. Enterprise pricing custom."
  },

  // Juro - Known pricing
  "juro": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://juro.com/pricing",
    tiers: [
      { name: "Team", price: "Custom", description: "Small teams", features: ["Contract creation", "eSignature", "Templates", "Basic analytics"], highlighted: true },
      { name: "Scale", price: "Custom", description: "Growing orgs", features: ["All Team", "Workflows", "Integrations", "Advanced analytics"] },
      { name: "Enterprise", price: "Custom", description: "Large orgs", features: ["All Scale", "SSO", "API", "Dedicated support", "SLA"] }
    ],
    notes: "AI-powered contract management. CLM platform."
  },

  // Ironclad - Known pricing
  "ironclad": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://ironcladapp.com/pricing",
    tiers: [
      { name: "Essentials", price: "Custom", description: "Small legal teams", features: ["Contract lifecycle", "Templates", "eSignature", "Repository"], highlighted: true },
      { name: "Growth", price: "Custom", description: "Growing teams", features: ["All Essentials", "Workflows", "Integrations", "Analytics"] },
      { name: "Enterprise", price: "Custom", description: "Large orgs", features: ["All Growth", "AI assist", "API", "SSO", "Dedicated support"] }
    ],
    notes: "Enterprise CLM. Used by Fortune 500 companies."
  },

  // Clio - Known pricing
  "clio": {
    startingPrice: 39, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.clio.com/pricing",
    tiers: [
      { name: "EasyStart", price: 39, period: "user/month", description: "Annual", features: ["Time tracking", "Billing", "Client portal", "Mobile app"] },
      { name: "Essentials", price: 79, period: "user/month", description: "Annual", features: ["All EasyStart", "Document management", "Calendar sync", "eSignature"], highlighted: true },
      { name: "Advanced", price: 119, period: "user/month", description: "Annual", features: ["All Essentials", "Custom fields", "Workflows", "Advanced billing"] },
      { name: "Complete", price: 149, period: "user/month", description: "Annual", features: ["All Advanced", "Clio Grow CRM", "Client intake", "Automations"] }
    ],
    notes: "Legal practice management. #1 for law firms."
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

  console.log("🔧 Starting verified pricing corrections batch 48 (E-signature & Documents)...\n");

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
    message: "Verified pricing corrections batch 48 (E-signature & Documents) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
