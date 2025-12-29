import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 65: Productivity & Scheduling pricing
const verifiedPricing: Record<string, object> = {
  "calendly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://calendly.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["1 calendar", "1 event type", "Unlimited meetings"] },
      { name: "Standard", price: 10, period: "user/month", description: "Annual", features: ["Unlimited event types", "Reminders", "Integrations"], highlighted: true },
      { name: "Teams", price: 16, period: "user/month", description: "Annual", features: ["Round robin", "Routing", "Analytics"] }
    ],
    notes: "Free for basic scheduling. Paid for teams."
  },
  "cal-com": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://cal.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Individuals", features: ["Unlimited bookings", "Cal.com subdomain", "Google/Outlook sync"], highlighted: true },
      { name: "Team", price: 12, period: "user/month", description: "Teams", features: ["Custom domains", "Round robin", "Team analytics"] }
    ],
    notes: "Open-source Calendly alternative. Free tier."
  },
  "savvycal": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://savvycal.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Basic scheduling", "1 calendar", "Personalization"] },
      { name: "Individual", price: 12, period: "month", description: "Annual", features: ["Unlimited links", "Workflows", "Integrations"], highlighted: true }
    ],
    notes: "Scheduling that prioritizes recipients."
  },
  "tidycal": {
    startingPrice: 29, currency: "USD", billingPeriod: "once", hasFreeTrial: false,
    pricingPageUrl: "https://tidycal.com",
    tiers: [{ name: "Lifetime", price: 29, period: "once", description: "One-time", features: ["Unlimited bookings", "Unlimited calendars", "All features"], highlighted: true }],
    notes: "One-time payment. No subscription."
  },
  "youcanbook-me": {
    startingPrice: 10.80, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://youcanbook.me/pricing",
    tiers: [{ name: "Pro", price: 10.80, period: "month", description: "Annual", features: ["Unlimited bookings", "Custom branding", "Integrations"], highlighted: true }],
    notes: "Simple online booking. 14-day trial."
  },
  "reclaim": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://reclaim.ai/pricing",
    tiers: [
      { name: "Free", price: 0, description: "3 habits", features: ["3 habits", "Basic scheduling", "1 calendar"] },
      { name: "Starter", price: 8, period: "user/month", description: "Annual", features: ["Unlimited habits", "Tasks", "Slack"], highlighted: true }
    ],
    notes: "AI calendar assistant. Free tier."
  },
  "motion": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.usemotion.com/pricing",
    tiers: [
      { name: "Individual", price: 19, period: "month", description: "Annual", features: ["AI scheduling", "Task management", "Projects"], highlighted: true },
      { name: "Team", price: 12, period: "user/month", description: "Annual", features: ["Shared projects", "Team calendar", "Admin"] }
    ],
    notes: "AI calendar and task manager."
  },
  "fantastical": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://flexibits.com/fantastical",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Calendar view", "1 calendar set", "Basic features"] },
      { name: "Premium", price: 6.99, period: "month", description: "Annual $57", features: ["All calendars", "Tasks", "Weather"], highlighted: true }
    ],
    notes: "Apple calendar app. Free tier limited."
  },
  "raycast": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.raycast.com/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free forever", features: ["Extensions", "Snippets", "Clipboard history"], highlighted: true },
      { name: "Pro", price: 8, period: "month", description: "Annual", features: ["AI", "Cloud sync", "Themes"] }
    ],
    notes: "Mac launcher. Free for personal use."
  },
  "alfred": {
    startingPrice: 0, currency: "USD", billingPeriod: "once", hasFreeTrial: false,
    pricingPageUrl: "https://www.alfredapp.com/powerpack",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["App launching", "Web search", "Calculator"] },
      { name: "Powerpack", price: 34, period: "once", description: "Single", features: ["Workflows", "Clipboard", "Snippets"], highlighted: true },
      { name: "Mega Supporter", price: 59, period: "once", description: "Lifetime", features: ["Free updates", "All features", "Supporter badge"] }
    ],
    notes: "Mac productivity app. One-time purchase."
  },
  "textexpander": {
    startingPrice: 3.33, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://textexpander.com/pricing",
    tiers: [
      { name: "Individual", price: 3.33, period: "month", description: "Annual $40", features: ["Unlimited snippets", "All platforms", "Sync"], highlighted: true },
      { name: "Team", price: 8.33, period: "user/month", description: "Annual", features: ["Shared snippets", "Usage stats", "Admin"] }
    ],
    notes: "Text expansion tool. All platforms."
  },
  "1password": {
    startingPrice: 2.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://1password.com/pricing",
    tiers: [
      { name: "Individual", price: 2.99, period: "month", description: "Annual", features: ["Unlimited passwords", "1GB storage", "All devices"] },
      { name: "Families", price: 4.99, period: "month", description: "Annual", features: ["5 family members", "Sharing", "Recovery"], highlighted: true }
    ],
    notes: "Password manager. No free tier."
  },
  "dashlane": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.dashlane.com/plans",
    tiers: [
      { name: "Free", price: 0, description: "1 device", features: ["25 passwords", "1 device", "Form filling"] },
      { name: "Premium", price: 4.99, period: "month", description: "Annual", features: ["Unlimited passwords", "VPN", "Dark web monitoring"], highlighted: true }
    ],
    notes: "Password manager. Free tier limited."
  },
  "lastpass": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.lastpass.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "1 device type", features: ["Unlimited passwords", "Mobile or desktop", "Password generator"] },
      { name: "Premium", price: 3, period: "month", description: "Annual", features: ["All devices", "1GB storage", "Priority support"], highlighted: true }
    ],
    notes: "Password manager. Free tier device-limited."
  },
  "obsidian": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://obsidian.md/pricing",
    tiers: [
      { name: "Personal", price: 0, description: "Free forever", features: ["Unlimited notes", "Plugins", "Local storage"], highlighted: true },
      { name: "Sync", price: 4, period: "month", description: "Annual $48", features: ["End-to-end sync", "10GB storage", "Version history"] },
      { name: "Publish", price: 8, period: "month", description: "Annual $96", features: ["Publish notes", "Custom domain", "SEO"] }
    ],
    notes: "Note-taking app. Core is free forever."
  },
  "roam-research": {
    startingPrice: 15, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://roamresearch.com/#/pricing",
    tiers: [
      { name: "Pro", price: 15, period: "month", description: "Or $165/year", features: ["Unlimited notes", "Full features", "API access"], highlighted: true },
      { name: "Believer", price: 500, period: "5 years", description: "One-time", features: ["5 years access", "Believer badge", "Early access"] }
    ],
    notes: "Networked note-taking. No free tier."
  },
  "logseq": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://logseq.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Unlimited notes", "Graph view", "Local-first", "Plugins"], highlighted: true }],
    notes: "Free and open source. Local-first."
  },
  "craft": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://www.craft.do/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Starter", features: ["Limited blocks", "1 space", "Basic features"] },
      { name: "Pro", price: 4.99, period: "month", description: "Annual", features: ["Unlimited blocks", "Unlimited spaces", "AI assist"], highlighted: true }
    ],
    notes: "Apple native docs app. Free tier."
  },
  "things-3": {
    startingPrice: 49.99, currency: "USD", billingPeriod: "once", hasFreeTrial: false,
    pricingPageUrl: "https://culturedcode.com/things",
    tiers: [
      { name: "Mac", price: 49.99, period: "once", description: "One-time", features: ["Full features", "iCloud sync"], highlighted: true },
      { name: "iPhone", price: 9.99, period: "once", description: "One-time", features: ["Full features", "Widgets"] },
      { name: "iPad", price: 19.99, period: "once", description: "One-time", features: ["Full features", "Widgets"] }
    ],
    notes: "Task manager. One-time purchase per platform."
  },
  "omnifocus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://www.omnigroup.com/omnifocus",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Basic features", "Limited projects", "View only on web"] },
      { name: "Pro", price: 9.99, period: "month", description: "Subscription", features: ["All features", "Custom perspectives", "Sync"], highlighted: true },
      { name: "Standard", price: 49.99, period: "once", description: "Per platform", features: ["Core features", "Per platform purchase"] }
    ],
    notes: "GTD task manager. Apple devices."
  },
  "ticktick": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://ticktick.com/about/upgrade",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Lists", "Tags", "Reminders", "2 calendars"] },
      { name: "Premium", price: 2.79, period: "month", description: "Annual $28", features: ["Unlimited calendars", "Themes", "Duration tracking"], highlighted: true }
    ],
    notes: "Task manager with Pomodoro. Free tier."
  },
  "any-do": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.any.do/premium",
    tiers: [
      { name: "Free", price: 0, description: "Basic", features: ["Basic tasks", "Limited features", "Sync"] },
      { name: "Premium", price: 2.99, period: "month", description: "Annual", features: ["Recurring tasks", "Themes", "Unlimited lists"], highlighted: true }
    ],
    notes: "Simple task manager. Free tier."
  },
  "streaks": {
    startingPrice: 4.99, currency: "USD", billingPeriod: "once", hasFreeTrial: false,
    pricingPageUrl: "https://streaksapp.com",
    tiers: [{ name: "Full App", price: 4.99, period: "once", description: "One-time", features: ["12 habits", "Health app integration", "Widgets", "Shortcuts"], highlighted: true }],
    notes: "Habit tracker for Apple. One-time."
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
    message: "Pricing batch 65 (Productivity & Scheduling) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
