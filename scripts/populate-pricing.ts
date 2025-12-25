import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Pricing templates based on tool category and pricing type
const PRICING_TEMPLATES = {
  // Developer Tools
  "developer-tools": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Core features", "Community support", "Public projects"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["5 projects", "Basic features", "Community support"] },
        { name: "Pro", price: 12, period: "month", features: ["Unlimited projects", "Advanced features", "Priority support"], highlighted: true },
        { name: "Team", price: 29, period: "user/month", features: ["Everything in Pro", "Team collaboration", "Admin controls"] }
      ]
    },
    paid: {
      startingPrice: 9,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Starter", price: 9, period: "month", features: ["Basic features", "Email support", "5 projects"] },
        { name: "Professional", price: 29, period: "month", features: ["Advanced features", "Priority support", "Unlimited projects"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Custom integrations", "Dedicated support", "SLA guarantee"] }
      ]
    }
  },

  // AI & Automation
  "ai-automation": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Limited requests", "Basic models", "Community support"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: false,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Limited credits", "Basic features", "Standard models"] },
        { name: "Plus", price: 20, period: "month", features: ["More credits", "Advanced models", "Faster responses"], highlighted: true },
        { name: "Pro", price: 49, period: "month", features: ["Unlimited credits", "All models", "API access"] }
      ]
    },
    paid: {
      startingPrice: 19,
      hasFreeTrial: true,
      freeTrialDays: 7,
      tiers: [
        { name: "Starter", price: 19, period: "month", features: ["1,000 credits", "Basic models", "Email support"] },
        { name: "Growth", price: 49, period: "month", features: ["5,000 credits", "Advanced models", "Priority support"], highlighted: true },
        { name: "Scale", price: 199, period: "month", features: ["25,000 credits", "All models", "Dedicated support"] }
      ]
    }
  },

  // Project Management
  "project-management": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Up to 10 users", "Basic boards", "1GB storage"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Up to 10 users", "Basic features", "2GB storage"] },
        { name: "Standard", price: 10, period: "user/month", features: ["Unlimited users", "Advanced views", "Timeline"], highlighted: true },
        { name: "Premium", price: 17, period: "user/month", features: ["Dashboards", "Workload view", "Admin controls"] }
      ]
    },
    paid: {
      startingPrice: 8,
      hasFreeTrial: true,
      freeTrialDays: 30,
      tiers: [
        { name: "Basic", price: 8, period: "user/month", features: ["Core features", "5GB storage", "Email support"] },
        { name: "Business", price: 16, period: "user/month", features: ["Advanced features", "50GB storage", "Priority support"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited storage", "SSO", "Dedicated success manager"] }
      ]
    }
  },

  // Design
  "design": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Basic tools", "Limited exports", "Community templates"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 30,
      tiers: [
        { name: "Starter", price: 0, period: "forever", features: ["3 projects", "Basic features", "Limited exports"] },
        { name: "Professional", price: 15, period: "editor/month", features: ["Unlimited projects", "Advanced tools", "Version history"], highlighted: true },
        { name: "Organization", price: 45, period: "editor/month", features: ["Design systems", "Centralized admin", "SSO"] }
      ]
    },
    paid: {
      startingPrice: 12,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Individual", price: 12, period: "month", features: ["Core features", "Cloud storage", "Email support"] },
        { name: "Team", price: 22, period: "user/month", features: ["Team libraries", "Collaboration", "Admin dashboard"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Advanced security", "Dedicated support", "Custom training"] }
      ]
    }
  },

  // Marketing
  "marketing": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Basic features", "Limited contacts", "Community support"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Up to 500 contacts", "Basic email", "Landing pages"] },
        { name: "Starter", price: 25, period: "month", features: ["1,000 contacts", "Automation", "A/B testing"], highlighted: true },
        { name: "Professional", price: 65, period: "month", features: ["5,000 contacts", "Advanced automation", "Analytics"] }
      ]
    },
    paid: {
      startingPrice: 29,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Basic", price: 29, period: "month", features: ["Core features", "1,000 contacts", "Email support"] },
        { name: "Pro", price: 79, period: "month", features: ["Advanced features", "5,000 contacts", "Priority support"], highlighted: true },
        { name: "Enterprise", price: 199, period: "month", features: ["Unlimited contacts", "Custom integrations", "Dedicated manager"] }
      ]
    }
  },

  // Communication
  "communication": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Unlimited messages", "1:1 calls", "Basic features"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: false,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Unlimited messages", "10 integrations", "90-day history"] },
        { name: "Pro", price: 8.75, period: "user/month", features: ["Unlimited history", "Unlimited integrations", "Group calls"], highlighted: true },
        { name: "Business+", price: 15, period: "user/month", features: ["SAML SSO", "Data exports", "24/7 support"] }
      ]
    },
    paid: {
      startingPrice: 5,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Essentials", price: 5, period: "user/month", features: ["Unlimited messages", "File sharing", "Basic calls"] },
        { name: "Business", price: 12.50, period: "user/month", features: ["Advanced calling", "Webinars", "Recording"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Advanced compliance", "Unlimited storage", "Premium support"] }
      ]
    }
  },

  // Analytics
  "analytics": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Basic reports", "Limited data retention", "Standard support"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["10K events/month", "Basic analytics", "7-day retention"] },
        { name: "Growth", price: 45, period: "month", features: ["100K events", "Advanced analytics", "1-year retention"], highlighted: true },
        { name: "Pro", price: 150, period: "month", features: ["1M events", "Predictive analytics", "Unlimited retention"] }
      ]
    },
    paid: {
      startingPrice: 39,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Starter", price: 39, period: "month", features: ["50K events", "Core reports", "Email support"] },
        { name: "Business", price: 99, period: "month", features: ["250K events", "Custom dashboards", "Priority support"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited events", "Data warehouse", "Dedicated support"] }
      ]
    }
  },

  // Productivity
  "productivity": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Core features", "Basic storage", "Community support"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 7,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Basic features", "5GB storage", "Mobile apps"] },
        { name: "Plus", price: 10, period: "month", features: ["Advanced features", "50GB storage", "Priority support"], highlighted: true },
        { name: "Business", price: 18, period: "user/month", features: ["Admin tools", "100GB storage", "SSO"] }
      ]
    },
    paid: {
      startingPrice: 7,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Personal", price: 7, period: "month", features: ["All features", "10GB storage", "Email support"] },
        { name: "Professional", price: 12, period: "month", features: ["Priority features", "100GB storage", "Priority support"], highlighted: true },
        { name: "Team", price: 20, period: "user/month", features: ["Team features", "1TB storage", "Admin console"] }
      ]
    }
  },

  // Default template for other categories
  "default": {
    free: {
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Core features", "Community support"] }
      ]
    },
    freemium: {
      startingPrice: 0,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Free", price: 0, period: "forever", features: ["Basic features", "Limited usage"] },
        { name: "Pro", price: 15, period: "month", features: ["Advanced features", "Priority support"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Custom solutions", "Dedicated support"] }
      ]
    },
    paid: {
      startingPrice: 10,
      hasFreeTrial: true,
      freeTrialDays: 14,
      tiers: [
        { name: "Starter", price: 10, period: "month", features: ["Basic features", "Email support"] },
        { name: "Professional", price: 25, period: "month", features: ["Advanced features", "Priority support"], highlighted: true },
        { name: "Enterprise", price: "Custom", features: ["Custom features", "Dedicated support"] }
      ]
    }
  }
};

async function populatePricing() {
  console.log("Starting pricing population...\n");

  // Get all tools with their categories
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    include: {
      categories: {
        include: { category: { select: { slug: true } } },
        take: 1,
      },
    },
  });

  console.log(`Found ${tools.length} tools to update\n`);

  let updated = 0;
  let skipped = 0;

  for (const tool of tools) {
    // Skip if already has pricing details
    if (tool.pricingDetails) {
      skipped++;
      continue;
    }

    // Get category slug or default
    const categorySlug = tool.categories[0]?.category?.slug || "default";

    // Get pricing template
    const categoryTemplates = PRICING_TEMPLATES[categorySlug as keyof typeof PRICING_TEMPLATES] || PRICING_TEMPLATES.default;
    const pricingTemplate = categoryTemplates[tool.pricing as keyof typeof categoryTemplates];

    if (!pricingTemplate) {
      console.log(`No template for ${tool.name} (${tool.pricing})`);
      skipped++;
      continue;
    }

    // Add some variation to prices (±20%)
    const variation = 0.8 + Math.random() * 0.4;
    const adjustedTemplate = JSON.parse(JSON.stringify(pricingTemplate));

    if (adjustedTemplate.startingPrice) {
      adjustedTemplate.startingPrice = Math.round(adjustedTemplate.startingPrice * variation);
    }

    if (adjustedTemplate.tiers) {
      for (const tier of adjustedTemplate.tiers) {
        if (typeof tier.price === "number" && tier.price > 0) {
          tier.price = Math.round(tier.price * variation);
        }
      }
    }

    // Update tool
    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        pricingDetails: adjustedTemplate,
      },
    });

    updated++;

    if (updated % 100 === 0) {
      console.log(`Updated ${updated} tools...`);
    }
  }

  console.log(`\nDone! Updated ${updated} tools, skipped ${skipped}`);
}

populatePricing()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
