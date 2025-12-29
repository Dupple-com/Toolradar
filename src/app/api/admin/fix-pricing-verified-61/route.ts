import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 61: Design Tools pricing
const verifiedPricing: Record<string, object> = {
  "sketch": {
    startingPrice: 10, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.sketch.com/pricing",
    tiers: [
      { name: "Standard", price: 10, period: "editor/month", description: "For teams", features: ["Mac app", "Web app", "Unlimited viewers", "Libraries"], highlighted: true },
      { name: "Business", price: 22, period: "editor/month", description: "Orgs", features: ["SSO", "Invoicing", "Dedicated support"] }
    ],
    notes: "Mac-only design tool. Per-editor pricing."
  },
  "adobe-xd": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.adobe.com/products/xd.html",
    tiers: [
      { name: "Free", price: 0, description: "Limited", features: ["1 document", "2GB storage", "Basic features"], highlighted: true },
      { name: "Single App", price: 22.99, period: "month", description: "Annual", features: ["Unlimited documents", "100GB storage", "Coediting"] }
    ],
    notes: "Part of Adobe Creative Cloud. Free tier limited."
  },
  "affinity-designer": {
    startingPrice: 69.99, currency: "USD", billingPeriod: "once", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://affinity.serif.com/en-us/designer",
    tiers: [
      { name: "Desktop", price: 69.99, period: "once", description: "One-time", features: ["Vector design", "Mac or Windows", "No subscription"], highlighted: true },
      { name: "Universal License", price: 169.99, period: "once", description: "All apps", features: ["All 6 apps", "Mac + Windows + iPad", "Free updates"] }
    ],
    notes: "One-time purchase. No subscription."
  },
  "canva": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.canva.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["250K templates", "5GB storage", "Basic features"] },
      { name: "Pro", price: 12.99, period: "month", description: "Annual", features: ["All templates", "100GB storage", "Brand Kit"], highlighted: true },
      { name: "Teams", price: 14.99, period: "user/month", description: "Annual", features: ["All Pro", "Team folders", "Workflows"] }
    ],
    notes: "Browser-based design. Generous free tier."
  },
  "penpot": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://penpot.app",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Unlimited projects", "SVG native", "Prototyping", "Self-hosted option"], highlighted: true }],
    notes: "Free and open source. Web-based design."
  },
  "lunacy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://icons8.com/lunacy",
    tiers: [{ name: "Free", price: 0, description: "Free forever", features: ["All features", "Built-in graphics", "Sketch compatible", "Cross-platform"], highlighted: true }],
    notes: "Free forever. Alternative to Sketch."
  },
  "invision": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.invisionapp.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "3 docs", features: ["3 documents", "Basic prototyping", "Comments"], highlighted: true },
      { name: "Pro", price: 7.95, period: "month", description: "Unlimited", features: ["Unlimited docs", "All features", "Priority support"] }
    ],
    notes: "Prototyping and collaboration. Free tier."
  },
  "principle": {
    startingPrice: 5, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://principleformac.com",
    tiers: [{ name: "Subscription", price: 5, period: "month", description: "Mac only", features: ["Animated prototypes", "Mac app", "Auto code export"], highlighted: true }],
    notes: "Mac-only animation tool. Also $129 one-time."
  },
  "protopie": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.protopie.io/plans",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1 active project", "Basic prototyping", "Community support"] },
      { name: "Basic", price: 11, period: "month", description: "Annual", features: ["Unlimited projects", "All interactions", "Sharing"], highlighted: true },
      { name: "Pro", price: 30, period: "month", description: "Annual", features: ["Team features", "Analytics", "Plugins"] }
    ],
    notes: "Advanced prototyping tool. Free tier."
  },
  "rive": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://rive.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["3 files", "Community assets", "Basic features"] },
      { name: "General", price: 16, period: "month", description: "Annual", features: ["Unlimited files", "Private files", "All features"], highlighted: true }
    ],
    notes: "Interactive animations. Free tier."
  },
  "spline": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://spline.design/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Personal", features: ["Unlimited files", "2 exports/mo", "Community assets"] },
      { name: "Plus", price: 9, period: "month", description: "Creators", features: ["Unlimited exports", "Private files", "Custom domain"], highlighted: true }
    ],
    notes: "3D design for web. Free tier."
  },
  "blender": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.blender.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["3D modeling", "Animation", "Rendering", "Video editing"], highlighted: true }],
    notes: "Free and open source. Industry standard."
  },
  "inkscape": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://inkscape.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Vector graphics", "SVG native", "Cross-platform", "Extensions"], highlighted: true }],
    notes: "Free and open source. Vector editor."
  },
  "gimp": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.gimp.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Image editing", "Photo retouching", "Painting tools", "Extensions"], highlighted: true }],
    notes: "Free and open source. Photoshop alternative."
  },
  "krita": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://krita.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Digital painting", "Animation", "Brush engines", "Layer support"], highlighted: true }],
    notes: "Free and open source. Digital art."
  },
  "procreate": {
    startingPrice: 12.99, currency: "USD", billingPeriod: "once", hasFreeTrial: false,
    pricingPageUrl: "https://procreate.com",
    tiers: [{ name: "Procreate", price: 12.99, period: "once", description: "iPad", features: ["Digital painting", "Apple Pencil", "Animation", "Brushes"], highlighted: true }],
    notes: "One-time purchase. iPad only."
  },
  "adobe-illustrator": {
    startingPrice: 22.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.adobe.com/products/illustrator.html",
    tiers: [{ name: "Single App", price: 22.99, period: "month", description: "Annual", features: ["Vector design", "100GB cloud", "Adobe Fonts", "Creative Cloud"], highlighted: true }],
    notes: "Part of Creative Cloud. Industry standard."
  },
  "adobe-photoshop": {
    startingPrice: 22.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.adobe.com/products/photoshop.html",
    tiers: [
      { name: "Photography", price: 9.99, period: "month", description: "Annual", features: ["Photoshop", "Lightroom", "20GB cloud"] },
      { name: "Single App", price: 22.99, period: "month", description: "Annual", features: ["Photoshop", "100GB cloud", "Adobe Fonts"], highlighted: true }
    ],
    notes: "Photography plan includes Lightroom."
  },
  "photopea": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.photopea.com",
    tiers: [
      { name: "Free", price: 0, description: "With ads", features: ["All features", "Browser-based", "PSD support"], highlighted: true },
      { name: "Premium", price: 5, period: "month", description: "No ads", features: ["No ads", "All features", "Email support"] }
    ],
    notes: "Free browser Photoshop alternative."
  },
  "pixelmator-pro": {
    startingPrice: 49.99, currency: "USD", billingPeriod: "once", hasFreeTrial: true,
    pricingPageUrl: "https://www.pixelmator.com/pro",
    tiers: [{ name: "Pixelmator Pro", price: 49.99, period: "once", description: "Mac only", features: ["Image editing", "ML features", "Photos integration", "No subscription"], highlighted: true }],
    notes: "One-time purchase. Mac only."
  },
  "zeplin": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://zeplin.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 project", features: ["1 active project", "Unlimited users", "Basic features"] },
      { name: "Starter", price: 6, period: "seat/month", description: "3 projects", features: ["3 projects", "Components", "Flows"], highlighted: true },
      { name: "Organization", price: 10.75, period: "seat/month", description: "Unlimited", features: ["Unlimited projects", "SSO", "Admin controls"] }
    ],
    notes: "Design handoff for developers. Free tier."
  },
  "abstract": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.abstract.com/pricing",
    tiers: [{ name: "Standard", price: 15, period: "contributor/month", description: "Teams", features: ["Version control", "Branches", "Collections", "Sketch/XD support"], highlighted: true }],
    notes: "Version control for design files."
  },
  "lottie": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://lottiefiles.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["10 files/mo", "Basic editor", "Public workspace"] },
      { name: "Micro", price: 15, period: "month", description: "Creators", features: ["100 files/mo", "Private files", "Priority support"], highlighted: true }
    ],
    notes: "Animation library and tools. Free tier."
  },
  "fontjoy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fontjoy.com",
    tiers: [{ name: "Free", price: 0, description: "Web tool", features: ["Font pairing", "Deep learning", "Google Fonts", "Unlimited use"], highlighted: true }],
    notes: "Free font pairing tool. Web-based."
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
    message: "Pricing batch 61 (Design Tools) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
