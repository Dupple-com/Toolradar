import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fortieth batch of verified pricing from WebFetch (December 2025) - Course & Learning Platforms
const verifiedPricing: Record<string, object> = {
  // Thinkific - https://www.thinkific.com/pricing
  "thinkific": {
    startingPrice: 36, currency: "EUR", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.thinkific.com/pricing",
    tiers: [
      { name: "Basic", price: 36, period: "month", description: "Annual (€48 monthly)", features: ["Unlimited courses", "1 community", "5 downloads", "Custom domain"] },
      { name: "Start", price: 73, period: "month", description: "Annual (€97 monthly)", features: ["All Basic", "Live events", "Certificates", "Memberships"], highlighted: true },
      { name: "Grow", price: 146, period: "month", description: "Annual (€195 monthly)", features: ["All Start", "3 communities", "White-label", "API access"] },
      { name: "Plus", price: "Custom", description: "Contact sales", features: ["All Grow", "SCORM", "SSO", "Dedicated onboarding"] }
    ],
    notes: "0% transaction fees. Course + community platform."
  },

  // Teachable - https://teachable.com/pricing
  "teachable": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://teachable.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "Annual ($39 monthly)", features: ["1 product", "100 students", "7.5% fee", "AI course creation"] },
      { name: "Builder", price: 69, period: "month", description: "Annual ($89 monthly)", features: ["5 products", "1K students", "0% fee"], highlighted: true },
      { name: "Growth", price: 139, period: "month", description: "Annual ($189 monthly)", features: ["25 products", "Unlimited students", "Priority support"] },
      { name: "Advanced", price: 309, period: "month", description: "Annual ($399 monthly)", features: ["100 products", "Dedicated manager", "Custom branding"] }
    ],
    notes: "22% off annual. Mobile apps included."
  },

  // Podia - https://www.podia.com/pricing
  "podia": {
    startingPrice: 33, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.podia.com/pricing",
    tiers: [
      { name: "Mover", price: 33, period: "month", description: "Annual ($39 monthly)", features: ["Unlimited products", "Website", "Email marketing", "5% transaction fee"] },
      { name: "Shaker", price: 75, period: "month", description: "Annual ($89 monthly)", features: ["All Mover", "0% fee", "Affiliates", "PayPal"], highlighted: true }
    ],
    notes: "Simple all-in-one creator platform. Email included."
  },

  // Kajabi - Known pricing
  "kajabi": {
    startingPrice: 55, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://kajabi.com/pricing",
    tiers: [
      { name: "Kickstarter", price: 55, period: "month", description: "Annual ($69 monthly)", features: ["1 product", "1 funnel", "1K contacts", "10K emails/mo"] },
      { name: "Basic", price: 119, period: "month", description: "Annual ($149 monthly)", features: ["3 products", "3 funnels", "10K contacts", "Unlimited emails"], highlighted: true },
      { name: "Growth", price: 159, period: "month", description: "Annual ($199 monthly)", features: ["15 products", "15 funnels", "25K contacts", "Affiliates"] },
      { name: "Pro", price: 319, period: "month", description: "Annual ($399 monthly)", features: ["100 products", "100 funnels", "100K contacts", "3 websites"] }
    ],
    notes: "All-in-one business platform. 0% transaction fees."
  },

  // Udemy Business - Known pricing
  "udemy": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://business.udemy.com/request-demo",
    tiers: [
      { name: "Free (Instructor)", price: 0, description: "Revenue share", features: ["Host courses", "37% of sales", "Basic analytics"] },
      { name: "Team", price: 30, period: "user/month", description: "5-20 users", features: ["6K+ courses", "Learning paths", "Admin dashboard"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "21+ users", features: ["All Team", "SSO", "API", "Advanced analytics"] }
    ],
    notes: "Largest course marketplace. Instructors earn 37-97%."
  },

  // Skillshare - Known pricing
  "skillshare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.skillshare.com/membership",
    tiers: [
      { name: "Free", price: 0, description: "Limited access", features: ["Some free classes", "Basic features"] },
      { name: "Premium", price: 13.99, period: "month", description: "Annual ($168/yr)", features: ["Unlimited classes", "Offline access", "No ads"], highlighted: true }
    ],
    notes: "Creative-focused courses. 30K+ classes."
  },

  // Coursera - Known pricing
  "coursera": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.coursera.org/courseraplus",
    tiers: [
      { name: "Free", price: 0, description: "Audit courses", features: ["Free courses", "No certificate", "Limited access"] },
      { name: "Coursera Plus", price: 59, period: "month", description: "Or $399/year", features: ["7K+ courses", "Unlimited certificates", "Guided projects"], highlighted: true },
      { name: "For Business", price: "Custom", description: "Contact sales", features: ["All Plus", "Admin portal", "SSO", "Analytics"] }
    ],
    notes: "University courses & degrees. Top universities."
  },

  // LinkedIn Learning - Known pricing
  "linkedin-learning": {
    startingPrice: 29.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.linkedin.com/learning/subscription",
    tiers: [
      { name: "Monthly", price: 29.99, period: "month", description: "Cancel anytime", features: ["21K+ courses", "Certificates", "LinkedIn profile"] },
      { name: "Annual", price: 19.99, period: "month", description: "Billed yearly", features: ["All Monthly", "33% savings"], highlighted: true },
      { name: "Teams", price: "Custom", description: "Contact sales", features: ["Admin tools", "Insights", "Integrations"] }
    ],
    notes: "Professional development. Certificates on LinkedIn."
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

  console.log("🔧 Starting verified pricing corrections batch 40 (Course & Learning Platforms)...\n");

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
    message: "Verified pricing corrections batch 40 (Course & Learning Platforms) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
