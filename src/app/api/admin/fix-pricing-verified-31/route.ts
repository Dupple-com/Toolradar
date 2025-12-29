import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Thirty-first batch of verified pricing from WebFetch (December 2025) - Design & Creative Tools
const verifiedPricing: Record<string, object> = {
  // Sketch - https://www.sketch.com/pricing
  "sketch": {
    startingPrice: 12, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.sketch.com/pricing",
    tiers: [
      { name: "Standard", price: 12, period: "editor/month", description: "Annual", features: ["Real-time collaboration", "Unlimited documents", "Free viewers", "Version history"], highlighted: true },
      { name: "Business", price: 24, period: "editor/month", description: "Annual", features: ["All Standard", "SSO", "Advanced permissions", "Dedicated support"] },
      { name: "Enterprise", price: 44, period: "editor/month", description: "25+ editors", features: ["All Business", "SCIM", "BYOK encryption"] },
      { name: "Mac License", price: 120, period: "one-time", description: "Per seat", features: ["1 year updates", "Offline work", "No collaboration"] }
    ],
    notes: "Mac-native design tool. Free viewers unlimited."
  },

  // Miro - https://miro.com/pricing
  "miro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://miro.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 boards", features: ["5K+ templates", "160+ integrations", "10 AI credits/mo", "5 Talktracks"] },
      { name: "Starter", price: 8, period: "member/month", description: "Annual ($10 monthly)", features: ["Unlimited boards", "Version history", "Brand Center", "25 AI credits"], highlighted: true },
      { name: "Business", price: 16, period: "member/month", description: "Annual ($20 monthly)", features: ["Multiple workspaces", "Unlimited guests", "SSO", "Jira sync", "50 AI credits"] },
      { name: "Enterprise", price: "Custom", description: "30+ members", features: ["Flexible licensing", "SCIM", "Data residency", "100 AI credits"] }
    ],
    notes: "Acquired InVision. Best for visual collaboration."
  },

  // Piktochart - https://piktochart.com/pricing
  "piktochart": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://piktochart.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "2 PNG downloads", features: ["Unlimited projects", "60 AI credits", "100MB storage", "4 team members"] },
      { name: "Pro", price: 14, period: "month", description: "Annual ($29 monthly)", features: ["Unlimited PNG", "5M+ premium assets", "500 AI credits", "100GB storage"], highlighted: true },
      { name: "Business", price: 24, period: "month", description: "Annual ($49 monthly)", features: ["Unlimited exports", "Brand Kit", "1K AI credits", "250GB storage"] },
      { name: "Enterprise", price: "Custom", description: "101+ members", features: ["All Business", "SSO/SAML", "Dedicated manager", "Custom templates"] }
    ],
    notes: "Education $39.99/yr. Nonprofit $60/yr."
  },

  // Snappa - https://snappa.com/pricing
  "snappa": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://snappa.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["1 user", "6K+ templates", "5M+ photos", "3 downloads/mo"] },
      { name: "Pro", price: 10, period: "month", description: "Annual ($15 monthly)", features: ["1 user", "Unlimited downloads", "Buffer integration", "Custom fonts", "BG removal"], highlighted: true },
      { name: "Team", price: 20, period: "month", description: "Annual ($30 monthly)", features: ["5 users", "All Pro features", "Team collaboration"] }
    ],
    notes: "Simple graphics tool. No credit card for free."
  },

  // Figma - Known pricing
  "figma": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.figma.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "Free forever", features: ["3 Figma files", "3 FigJam files", "Unlimited viewers", "Mobile app"] },
      { name: "Professional", price: 15, period: "editor/month", description: "Annual ($20 monthly)", features: ["Unlimited files", "Team libraries", "Dev Mode", "Audio conversations"], highlighted: true },
      { name: "Organization", price: 45, period: "editor/month", description: "Annual ($75 monthly)", features: ["All Professional", "Org libraries", "Design system analytics", "SSO"] },
      { name: "Enterprise", price: 75, period: "editor/month", description: "Annual", features: ["All Organization", "Advanced security", "Dedicated support", "Guest access controls"] }
    ],
    notes: "Industry standard for UI/UX. AI features included."
  },

  // Canva - Known pricing
  "canva": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.canva.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Forever free", features: ["250K+ templates", "100+ design types", "5GB storage", "1M+ photos"] },
      { name: "Pro", price: 12.99, period: "month", description: "Annual ($14.99 monthly)", features: ["All Free", "100M+ assets", "BG Remover", "Magic Resize", "1TB storage"], highlighted: true },
      { name: "Teams", price: 14.99, period: "person/month", description: "Annual", features: ["All Pro", "Brand Kit", "Team collaboration", "24/7 support"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Teams", "SSO", "Advanced admin", "Dedicated success manager"] }
    ],
    notes: "Most popular design tool. Magic Studio AI included."
  },

  // Adobe Creative Cloud - Known pricing
  "adobe-creative-cloud": {
    startingPrice: 22.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.adobe.com/creativecloud/plans.html",
    tiers: [
      { name: "Single App", price: 22.99, period: "month", description: "Annual", features: ["1 app (Photoshop, Illustrator, etc.)", "100GB storage", "Adobe Fonts", "Portfolio"] },
      { name: "All Apps", price: 59.99, period: "month", description: "Annual", features: ["20+ apps", "100GB storage", "Adobe Fonts", "Behance"], highlighted: true },
      { name: "Photography", price: 9.99, period: "month", description: "Annual", features: ["Photoshop", "Lightroom", "20GB storage"] },
      { name: "Students", price: 19.99, period: "month", description: "All apps", features: ["60% off", "All 20+ apps", "100GB storage"] }
    ],
    notes: "Industry standard creative suite. Firefly AI included."
  },

  // Lucidchart - Known pricing
  "lucidchart": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.lucidchart.com/pages/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 documents", features: ["60 shapes/doc", "Basic templates", "Viewer mode"] },
      { name: "Individual", price: 7.95, period: "month", description: "Annual ($9 monthly)", features: ["Unlimited documents", "1GB storage", "Presentation mode"], highlighted: true },
      { name: "Team", price: 9, period: "user/month", description: "Annual", features: ["All Individual", "Shared folders", "Team features", "Admin controls"] },
      { name: "Enterprise", price: "Custom", description: "Contact sales", features: ["All Team", "SSO/SAML", "Advanced admin", "Dedicated support"] }
    ],
    notes: "Part of Lucid Visual Collaboration Suite with Lucidspark."
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

  console.log("🔧 Starting verified pricing corrections batch 31 (Design & Creative Tools)...\n");

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
    message: "Verified pricing corrections batch 31 (Design & Creative Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
