import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Pricing data collected from official sources (December 2025)
const pricingData: Record<string, {
  startingPrice?: number;
  currency?: string;
  billingPeriod?: string;
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
  pricingPageUrl?: string;
  tiers?: Array<{
    name: string;
    price: number | string;
    period?: string;
    description?: string;
    features?: string[];
    highlighted?: boolean;
  }>;
}> = {
  // === PRODUCTIVITY & NOTES ===
  "notion": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.notion.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals getting started",
        features: ["Unlimited pages & blocks", "7-day page history", "10 guest collaborators", "5MB file uploads"]
      },
      {
        name: "Plus",
        price: 10,
        period: "month",
        description: "For small teams",
        features: ["Unlimited blocks for teams", "30-day page history", "100 guest collaborators", "Unlimited file uploads"],
        highlighted: true
      },
      {
        name: "Business",
        price: 18,
        period: "month",
        description: "For growing teams",
        features: ["SAML SSO", "Private teamspaces", "90-day page history", "250 guest collaborators", "Notion AI included"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Advanced security", "SCIM provisioning", "Unlimited page history", "Dedicated success manager"]
      }
    ]
  },

  "slack": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://slack.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For small teams trying Slack",
        features: ["90 days of message history", "10 app integrations", "1:1 voice & video calls"]
      },
      {
        name: "Pro",
        price: 8.75,
        period: "month",
        description: "For small teams",
        features: ["Unlimited message history", "Unlimited apps", "Group video calls", "Screen sharing"],
        highlighted: true
      },
      {
        name: "Business+",
        price: 15,
        period: "month",
        description: "For larger teams",
        features: ["SAML SSO", "Data exports", "24/7 support", "Slack AI included"]
      },
      {
        name: "Enterprise Grid",
        price: "Custom",
        description: "For large enterprises",
        features: ["Unlimited workspaces", "Enterprise security", "HIPAA compliance", "24/7 priority support"]
      }
    ]
  },

  "figma": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.figma.com/pricing/",
    tiers: [
      {
        name: "Starter",
        price: 0,
        description: "For individuals",
        features: ["3 Figma files", "3 FigJam files", "Unlimited personal files", "Unlimited collaborators"]
      },
      {
        name: "Professional",
        price: 15,
        period: "month",
        description: "For professional designers",
        features: ["Unlimited Figma files", "Unlimited version history", "Team libraries", "Dev Mode"],
        highlighted: true
      },
      {
        name: "Organization",
        price: 45,
        period: "month",
        description: "For design teams",
        features: ["Org-wide libraries", "Design system analytics", "Private plugins", "SSO & advanced admin"]
      },
      {
        name: "Enterprise",
        price: 75,
        period: "month",
        description: "For large companies",
        features: ["Advanced security", "Dedicated support", "Custom contracts", "99.9% uptime SLA"]
      }
    ]
  },

  "github": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://github.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals and small teams",
        features: ["Unlimited public/private repos", "2,000 CI/CD minutes/month", "500MB package storage", "Community support"]
      },
      {
        name: "Team",
        price: 4,
        period: "month",
        description: "For growing teams",
        features: ["3,000 CI/CD minutes/month", "2GB package storage", "Protected branches", "Code owners"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: 21,
        period: "month",
        description: "For large organizations",
        features: ["50,000 CI/CD minutes/month", "50GB package storage", "SAML SSO", "Advanced auditing"]
      }
    ]
  },

  "linear": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://linear.app/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For small teams",
        features: ["Up to 250 active issues", "Unlimited members", "All integrations", "API access"]
      },
      {
        name: "Standard",
        price: 8,
        period: "month",
        description: "For growing teams",
        features: ["Unlimited issues", "Guest accounts", "Advanced security", "Priority support"],
        highlighted: true
      },
      {
        name: "Plus",
        price: 14,
        period: "month",
        description: "For scaling teams",
        features: ["Advanced roadmaps", "Project insights", "Team analytics", "Custom workflows"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["SAML SSO", "SCIM provisioning", "Audit logs", "Dedicated support"]
      }
    ]
  },

  "vercel": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://vercel.com/pricing",
    tiers: [
      {
        name: "Hobby",
        price: 0,
        description: "For personal projects",
        features: ["100GB bandwidth", "Serverless functions", "Automatic HTTPS", "Instant rollbacks"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For professional developers",
        features: ["1TB bandwidth", "Team collaboration", "Preview deployments", "Advanced analytics"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Custom SLAs", "Advanced security", "Dedicated support", "Multi-region failover"]
      }
    ]
  },

  "airtable": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://airtable.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["1,000 records per base", "1GB attachments/base", "100 automation runs/month", "Interface Designer"]
      },
      {
        name: "Team",
        price: 20,
        period: "month",
        description: "For small teams",
        features: ["50,000 records per base", "20GB attachments/base", "25,000 automation runs", "Extensions"],
        highlighted: true
      },
      {
        name: "Business",
        price: 45,
        period: "month",
        description: "For growing companies",
        features: ["125,000 records per base", "100GB attachments/base", "100,000 automation runs", "SAML SSO"]
      },
      {
        name: "Enterprise Scale",
        price: "Custom",
        description: "For large organizations",
        features: ["500,000 records per base", "1,000GB attachments", "500,000 automation runs", "Advanced admin"]
      }
    ]
  },

  "supabase": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://supabase.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For hobby projects",
        features: ["500MB database", "1GB file storage", "50,000 monthly active users", "Community support"]
      },
      {
        name: "Pro",
        price: 25,
        period: "month",
        description: "For production apps",
        features: ["8GB database", "100GB file storage", "100,000 monthly active users", "Email support"],
        highlighted: true
      },
      {
        name: "Team",
        price: 599,
        period: "month",
        description: "For scaling teams",
        features: ["SOC2 compliance", "SSO", "Priority support", "28-day log retention"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Custom SLAs", "Dedicated support", "Custom contracts", "SLA guarantees"]
      }
    ]
  },

  "cursor": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://cursor.com/pricing",
    tiers: [
      {
        name: "Hobby",
        price: 0,
        description: "For trying Cursor",
        features: ["2,000 completions/month", "50 slow premium requests", "Basic models access"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For professional developers",
        features: ["Unlimited completions", "500 fast premium requests", "GPT-4, Claude access", "Priority support"],
        highlighted: true
      },
      {
        name: "Business",
        price: 40,
        period: "month",
        description: "For teams",
        features: ["Team billing", "Admin dashboard", "SSO/SAML", "Privacy mode"]
      }
    ]
  },

  "zapier": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://zapier.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["100 tasks/month", "2-step Zaps", "AI features", "5 Zaps"]
      },
      {
        name: "Professional",
        price: 29.99,
        period: "month",
        description: "For power users",
        features: ["750 tasks/month", "Multi-step Zaps", "Premium apps", "Webhooks"],
        highlighted: true
      },
      {
        name: "Team",
        price: 103.50,
        period: "month",
        description: "For teams",
        features: ["2,000 tasks/month", "Unlimited users", "Shared folders", "SAML SSO"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Unlimited users", "Advanced permissions", "Annual task limits", "Dedicated support"]
      }
    ]
  },

  "calendly": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://calendly.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["1 event type", "1 calendar connection", "Unlimited meetings"]
      },
      {
        name: "Standard",
        price: 10,
        period: "month",
        description: "For professionals",
        features: ["Unlimited event types", "Calendar integrations", "Automated reminders", "Custom branding"],
        highlighted: true
      },
      {
        name: "Teams",
        price: 16,
        period: "month",
        description: "For teams",
        features: ["Round robin scheduling", "Team pages", "Salesforce integration", "Admin controls"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["SSO/SAML", "Audit logs", "Microsoft Dynamics", "Dedicated support"]
      }
    ]
  },

  "intercom": {
    startingPrice: 29,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.intercom.com/pricing",
    tiers: [
      {
        name: "Essential",
        price: 29,
        period: "month",
        description: "For startups",
        features: ["Shared inbox", "Basic chatbot", "Help center", "Email support"]
      },
      {
        name: "Advanced",
        price: 85,
        period: "month",
        description: "For growing teams",
        features: ["Workflow automation", "Multiple inboxes", "Multilingual help center", "20 Lite seats"],
        highlighted: true
      },
      {
        name: "Expert",
        price: 132,
        period: "month",
        description: "For support teams",
        features: ["SSO/SAML", "HIPAA compliance", "SLA rules", "50 Lite seats"]
      }
    ]
  },

  "posthog": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://posthog.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For startups",
        features: ["1M events/month", "5K session recordings", "1M feature flags", "Unlimited seats"]
      },
      {
        name: "Paid",
        price: "Usage-based",
        description: "Pay as you grow",
        features: ["Unlimited events", "Email support", "7-year retention", "6 projects"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["SAML SSO", "Dedicated support", "Custom MSA", "SLA guarantees"]
      }
    ]
  },

  "resend": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://resend.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For trying Resend",
        features: ["3,000 emails/month", "100 emails/day", "1 domain", "7-day logs"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For production",
        features: ["50,000 emails/month", "Unlimited domains", "3-day logs", "Webhooks"],
        highlighted: true
      },
      {
        name: "Scale",
        price: 90,
        period: "month",
        description: "For high volume",
        features: ["100,000 emails/month", "7-day logs", "Dedicated IP available", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Custom volume", "Custom retention", "SLA", "Dedicated support"]
      }
    ]
  },

  "raycast": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.raycast.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For everyone",
        features: ["All extensions", "Clipboard history", "Window management", "Calculator & snippets"]
      },
      {
        name: "Pro",
        price: 8,
        period: "month",
        description: "For power users",
        features: ["Raycast AI", "Cloud sync", "Custom themes", "Unlimited clipboard"],
        highlighted: true
      },
      {
        name: "Teams",
        price: 12,
        period: "month",
        description: "For teams",
        features: ["Shared extensions", "Team snippets", "Team quicklinks", "Admin controls"]
      }
    ]
  },

  // === DESIGN ===
  "canva": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://www.canva.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For casual designers",
        features: ["250,000+ templates", "100+ design types", "5GB cloud storage", "Basic AI tools"]
      },
      {
        name: "Pro",
        price: 15,
        period: "month",
        description: "For professionals",
        features: ["All premium templates", "Brand Kit", "Background remover", "1TB storage"],
        highlighted: true
      },
      {
        name: "Teams",
        price: 10,
        period: "month",
        description: "For teams (min 3 people)",
        features: ["Everything in Pro", "Team folders", "Approval workflows", "Brand controls"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["SSO", "Advanced brand controls", "Unlimited storage", "Dedicated support"]
      }
    ]
  },

  "miro": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://miro.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["3 editable boards", "Unlimited team members", "Core integrations", "Basic templates"]
      },
      {
        name: "Starter",
        price: 8,
        period: "month",
        description: "For small teams",
        features: ["Unlimited boards", "Private boards", "Video chat", "Custom templates"],
        highlighted: true
      },
      {
        name: "Business",
        price: 16,
        period: "month",
        description: "For organizations",
        features: ["Everything in Starter", "SSO", "Guest access", "Advanced security"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large enterprises",
        features: ["Data governance", "Audit logs", "Dedicated support", "Custom contracts"]
      }
    ]
  },

  // === AI ===
  "chatgpt": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://openai.com/chatgpt/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For everyone",
        features: ["GPT-4o mini", "Limited messages", "Web browsing", "Basic analysis"]
      },
      {
        name: "Plus",
        price: 20,
        period: "month",
        description: "For individuals",
        features: ["GPT-4o & GPT-4", "DALL-E image generation", "Advanced voice", "Higher limits"],
        highlighted: true
      },
      {
        name: "Pro",
        price: 200,
        period: "month",
        description: "For power users",
        features: ["Unlimited GPT-4o", "o1 pro mode", "Extended thinking", "Priority access"]
      },
      {
        name: "Team",
        price: 25,
        period: "month",
        description: "For teams",
        features: ["Everything in Plus", "Workspace", "Admin console", "Data excluded from training"]
      }
    ]
  },

  "claude": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://claude.ai/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For trying Claude",
        features: ["Claude 3.5 Sonnet", "Limited usage", "Web & mobile apps", "File uploads"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For individuals",
        features: ["5x more usage", "Claude 3 Opus access", "Priority access", "Projects"],
        highlighted: true
      },
      {
        name: "Team",
        price: 25,
        period: "month",
        description: "For teams",
        features: ["Everything in Pro", "Higher limits", "Admin tools", "User management"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["SSO/SAML", "Domain verification", "Extended context", "Custom contracts"]
      }
    ]
  },

  "midjourney": {
    startingPrice: 10,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.midjourney.com/account/",
    tiers: [
      {
        name: "Basic",
        price: 10,
        period: "month",
        description: "For hobbyists",
        features: ["200 image generations/month", "General commercial terms", "Access to member gallery"]
      },
      {
        name: "Standard",
        price: 30,
        period: "month",
        description: "For regular users",
        features: ["15h fast GPU time/month", "Unlimited relaxed generations", "Stealth mode"],
        highlighted: true
      },
      {
        name: "Pro",
        price: 60,
        period: "month",
        description: "For professionals",
        features: ["30h fast GPU time/month", "Stealth mode", "Mega-generations"]
      },
      {
        name: "Mega",
        price: 120,
        period: "month",
        description: "For heavy users",
        features: ["60h fast GPU time/month", "Everything in Pro", "Maximum speed"]
      }
    ]
  },

  // === DATABASES ===
  "planetscale": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://planetscale.com/pricing",
    tiers: [
      {
        name: "Hobby",
        price: 0,
        description: "For development",
        features: ["1 database", "5GB storage", "1 billion row reads/month", "10 million row writes"]
      },
      {
        name: "Scaler",
        price: 29,
        period: "month",
        description: "For production",
        features: ["Unlimited databases", "10GB storage", "Autoscaling", "Daily backups"],
        highlighted: true
      },
      {
        name: "Scaler Pro",
        price: 59,
        period: "month",
        description: "For growing apps",
        features: ["25GB storage", "Multi-region", "12-hour restore", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Single-tenant clusters", "Custom contracts", "Dedicated support", "SLA"]
      }
    ]
  },

  "neon": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://neon.tech/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For hobbyists",
        features: ["0.5 GB storage", "Shared compute", "1 project", "Community support"]
      },
      {
        name: "Launch",
        price: 19,
        period: "month",
        description: "For side projects",
        features: ["10GB storage", "300 compute hours", "10 projects", "Email support"],
        highlighted: true
      },
      {
        name: "Scale",
        price: 69,
        period: "month",
        description: "For production",
        features: ["50GB storage", "750 compute hours", "50 projects", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["Custom storage", "Dedicated support", "SLA", "Custom contracts"]
      }
    ]
  },

  // === CLOUD & DEVOPS ===
  "railway": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://railway.app/pricing",
    tiers: [
      {
        name: "Hobby",
        price: 0,
        description: "For experiments",
        features: ["$5 free credits", "500 execution hours", "1GB memory", "Community support"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For production",
        features: ["$20 included credits", "Team support", "Priority builds", "Custom domains"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large teams",
        features: ["Unlimited members", "SSO", "Audit logs", "Dedicated support"]
      }
    ]
  },

  "render": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://render.com/pricing",
    tiers: [
      {
        name: "Individual",
        price: 0,
        description: "For personal projects",
        features: ["Free static sites", "Free PostgreSQL (90 days)", "Free Redis (90 days)", "Community support"]
      },
      {
        name: "Team",
        price: 19,
        period: "month",
        description: "For teams",
        features: ["Unlimited members", "Team management", "Priority support", "Usage-based pricing"],
        highlighted: true
      },
      {
        name: "Organization",
        price: 29,
        period: "month",
        description: "For organizations",
        features: ["SSO", "Audit logs", "Custom contracts", "Dedicated support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["HIPAA compliance", "SLA", "Custom security", "Account team"]
      }
    ]
  },

  // === E-COMMERCE ===
  "gumroad": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://gumroad.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "Pay as you sell",
        features: ["10% + $0.50 per sale", "Digital products", "Memberships", "Email updates"]
      },
      {
        name: "Premium",
        price: 10,
        period: "month",
        description: "Lower fees",
        features: ["5% + $0.50 per sale", "Custom domains", "Advanced analytics", "Priority support"],
        highlighted: true
      }
    ]
  },

  "lemon-squeezy": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.lemonsqueezy.com/pricing",
    tiers: [
      {
        name: "Standard",
        price: 0,
        description: "For everyone",
        features: ["5% + 50c per transaction", "Merchant of record", "Tax compliance", "Fraud protection"]
      },
      {
        name: "Growth",
        price: "3.5%",
        description: "For high volume",
        features: ["3.5% + 50c per transaction", "Lower fees", "Priority support", "Custom features"],
        highlighted: true
      }
    ]
  },

  // === PROJECT MANAGEMENT ===
  "asana": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://asana.com/pricing",
    tiers: [
      {
        name: "Personal",
        price: 0,
        description: "For individuals",
        features: ["Unlimited tasks", "Unlimited projects", "Unlimited storage", "Basic workflows"]
      },
      {
        name: "Starter",
        price: 10.99,
        period: "month",
        description: "For small teams",
        features: ["Timeline view", "Dashboards", "Forms", "Rules automation"],
        highlighted: true
      },
      {
        name: "Advanced",
        price: 24.99,
        period: "month",
        description: "For scaling teams",
        features: ["Goals", "Portfolios", "Workload", "Custom rules"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["SAML SSO", "Data export", "Admin controls", "Custom branding"]
      }
    ]
  },

  "monday": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://monday.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["Up to 2 seats", "3 boards", "Unlimited docs", "200+ templates"]
      },
      {
        name: "Basic",
        price: 9,
        period: "month",
        description: "For small teams",
        features: ["Unlimited items", "5GB storage", "Dashboard 1 board", "Prioritized support"]
      },
      {
        name: "Standard",
        price: 12,
        period: "month",
        description: "For teams",
        features: ["Timeline & Gantt", "Calendar view", "Automations", "Integrations"],
        highlighted: true
      },
      {
        name: "Pro",
        price: 19,
        period: "month",
        description: "For complex workflows",
        features: ["Private boards", "Time tracking", "Formula column", "Chart view"]
      }
    ]
  },

  "clickup": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://clickup.com/pricing",
    tiers: [
      {
        name: "Free Forever",
        price: 0,
        description: "For personal use",
        features: ["100MB storage", "Unlimited tasks", "Unlimited members", "Collaborative docs"]
      },
      {
        name: "Unlimited",
        price: 7,
        period: "month",
        description: "For small teams",
        features: ["Unlimited storage", "Unlimited dashboards", "Guests", "Goals"],
        highlighted: true
      },
      {
        name: "Business",
        price: 12,
        period: "month",
        description: "For mid-size teams",
        features: ["Google SSO", "Advanced automations", "Time tracking", "Custom exporting"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: ["White labeling", "HIPAA compliance", "MSA & HIPAA", "Dedicated support"]
      }
    ]
  },

  "trello": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://trello.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["Unlimited cards", "Up to 10 boards", "Unlimited Power-Ups", "Unlimited storage"]
      },
      {
        name: "Standard",
        price: 5,
        period: "month",
        description: "For small teams",
        features: ["Unlimited boards", "Advanced checklists", "Custom fields", "Saved searches"],
        highlighted: true
      },
      {
        name: "Premium",
        price: 10,
        period: "month",
        description: "For teams",
        features: ["Views", "Admin controls", "Simple data export", "Priority support"]
      },
      {
        name: "Enterprise",
        price: 17.50,
        period: "month",
        description: "For organizations",
        features: ["Unlimited workspaces", "Multi-board guests", "Attachment permissions", "Power-Up admin"]
      }
    ]
  },

  "jira": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.atlassian.com/software/jira/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For small teams",
        features: ["Up to 10 users", "2GB storage", "Community support", "Scrum & Kanban"]
      },
      {
        name: "Standard",
        price: 7.53,
        period: "month",
        description: "For growing teams",
        features: ["Up to 35,000 users", "250GB storage", "Project roles", "Audit logs"],
        highlighted: true
      },
      {
        name: "Premium",
        price: 13.53,
        period: "month",
        description: "For scaling teams",
        features: ["Unlimited storage", "Advanced roadmaps", "Sandbox", "99.9% SLA"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited sites", "Centralized security", "Atlassian Analytics", "24/7 support"]
      }
    ]
  },

  // === COMMUNICATION ===
  "loom": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.loom.com/pricing",
    tiers: [
      {
        name: "Starter",
        price: 0,
        description: "For individuals",
        features: ["25 videos/person", "5 min recording limit", "Basic analytics"]
      },
      {
        name: "Business",
        price: 12.50,
        period: "month",
        description: "For teams",
        features: ["Unlimited videos", "Unlimited recording", "Engagement insights", "Custom branding"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For organizations",
        features: ["SSO", "Admin controls", "Advanced security", "Dedicated support"]
      }
    ]
  },

  "zoom": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://zoom.us/pricing",
    tiers: [
      {
        name: "Basic",
        price: 0,
        description: "For individuals",
        features: ["100 participants", "40 min group meetings", "Unlimited 1:1", "Chat"]
      },
      {
        name: "Pro",
        price: 13.33,
        period: "month",
        description: "For small teams",
        features: ["100 participants", "30h meetings", "5GB cloud recording", "AI Companion"],
        highlighted: true
      },
      {
        name: "Business",
        price: 18.32,
        period: "month",
        description: "For small businesses",
        features: ["300 participants", "Unlimited cloud recording", "Company branding", "SSO"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large enterprises",
        features: ["1000 participants", "Unlimited cloud", "Webinars", "Dedicated support"]
      }
    ]
  },

  // === MARKETING & EMAIL ===
  "mailchimp": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://mailchimp.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For beginners",
        features: ["500 contacts", "1,000 emails/month", "Basic templates", "1 audience"]
      },
      {
        name: "Essentials",
        price: 13,
        period: "month",
        description: "For growing businesses",
        features: ["500 contacts", "5,000 emails/month", "A/B testing", "24/7 support"],
        highlighted: true
      },
      {
        name: "Standard",
        price: 20,
        period: "month",
        description: "For scaling businesses",
        features: ["500 contacts", "6,000 emails/month", "Advanced automations", "Predictive segmentation"]
      },
      {
        name: "Premium",
        price: 350,
        period: "month",
        description: "For large businesses",
        features: ["10,000 contacts", "150,000 emails/month", "Advanced analytics", "Priority support"]
      }
    ]
  },

  "hubspot": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.hubspot.com/pricing",
    tiers: [
      {
        name: "Free Tools",
        price: 0,
        description: "For getting started",
        features: ["Free CRM", "Email marketing", "Forms", "Live chat"]
      },
      {
        name: "Starter",
        price: 15,
        period: "month",
        description: "For small teams",
        features: ["1,000 marketing contacts", "Email automation", "Landing pages", "Ad management"],
        highlighted: true
      },
      {
        name: "Professional",
        price: 800,
        period: "month",
        description: "For growing businesses",
        features: ["2,000 marketing contacts", "ABM tools", "Custom reporting", "A/B testing"]
      },
      {
        name: "Enterprise",
        price: 3600,
        period: "month",
        description: "For large enterprises",
        features: ["10,000 marketing contacts", "Predictive lead scoring", "Custom objects", "Sandboxes"]
      }
    ]
  },

  // === CUSTOMER SUPPORT ===
  "zendesk": {
    startingPrice: 19,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.zendesk.com/pricing/",
    tiers: [
      {
        name: "Support Team",
        price: 19,
        period: "month",
        description: "For small teams",
        features: ["Ticketing system", "Email support", "Customer history", "Pre-built reports"]
      },
      {
        name: "Suite Team",
        price: 55,
        period: "month",
        description: "For growing teams",
        features: ["Help center", "Live chat", "Social messaging", "Pre-built dashboards"],
        highlighted: true
      },
      {
        name: "Suite Growth",
        price: 89,
        period: "month",
        description: "For scaling teams",
        features: ["Multiple ticket forms", "SLA management", "Business hours", "Custom analytics"]
      },
      {
        name: "Suite Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Skills-based routing", "Custom roles", "Sandbox", "Advanced security"]
      }
    ]
  },

  "crisp": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://crisp.chat/en/pricing/",
    tiers: [
      {
        name: "Basic",
        price: 0,
        description: "For personal use",
        features: ["2 seats", "Website chat", "Contact form", "Mobile apps"]
      },
      {
        name: "Pro",
        price: 25,
        period: "month",
        description: "For startups",
        features: ["4 seats", "Chatbot", "Audio/video calls", "Triggers"],
        highlighted: true
      },
      {
        name: "Unlimited",
        price: 95,
        period: "month",
        description: "For companies",
        features: ["20 seats", "Knowledge base", "CRM integration", "Analytics"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited seats", "SLA", "Dedicated support", "Custom contracts"]
      }
    ]
  },

  // === ANALYTICS ===
  "amplitude": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      {
        name: "Starter",
        price: 0,
        description: "For getting started",
        features: ["50K MTUs", "Core analytics", "Unlimited users", "Community support"]
      },
      {
        name: "Plus",
        price: 49,
        period: "month",
        description: "For growing companies",
        features: ["1,000 MTUs", "Advanced charts", "Custom events", "Email support"],
        highlighted: true
      },
      {
        name: "Growth",
        price: "Custom",
        description: "For scaling businesses",
        features: ["Custom MTUs", "Behavioral cohorts", "Predictive analytics", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["SSO", "Custom contracts", "Dedicated support", "Data governance"]
      }
    ]
  },

  "mixpanel": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://mixpanel.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["20M events/month", "Core reports", "Unlimited seats", "Community support"]
      },
      {
        name: "Growth",
        price: 20,
        period: "month",
        description: "For growing companies",
        features: ["100M events/month", "Group analytics", "Data pipelines", "Email support"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["SSO/SCIM", "Advanced permissions", "Dedicated support", "Custom contracts"]
      }
    ]
  },

  "plausible": {
    startingPrice: 9,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://plausible.io/#pricing",
    tiers: [
      {
        name: "10K pageviews",
        price: 9,
        period: "month",
        description: "For small sites",
        features: ["Up to 10K pageviews/month", "Unlimited websites", "Privacy-focused", "No cookies"]
      },
      {
        name: "100K pageviews",
        price: 19,
        period: "month",
        description: "For growing sites",
        features: ["Up to 100K pageviews/month", "Goals & events", "Email reports", "Priority support"],
        highlighted: true
      },
      {
        name: "1M pageviews",
        price: 69,
        period: "month",
        description: "For popular sites",
        features: ["Up to 1M pageviews/month", "All features", "API access", "Priority support"]
      }
    ]
  },

  "hotjar": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 15,
    pricingPageUrl: "https://www.hotjar.com/pricing/",
    tiers: [
      {
        name: "Basic",
        price: 0,
        description: "For personal projects",
        features: ["35 daily sessions", "Heatmaps", "Recordings", "Surveys"]
      },
      {
        name: "Plus",
        price: 32,
        period: "month",
        description: "For low-traffic sites",
        features: ["100 daily sessions", "Events API", "Filter & segment", "Page targeting"],
        highlighted: true
      },
      {
        name: "Business",
        price: 80,
        period: "month",
        description: "For growing businesses",
        features: ["500 daily sessions", "Frustration signals", "Custom integration", "Priority support"]
      },
      {
        name: "Scale",
        price: 171,
        period: "month",
        description: "For high-traffic sites",
        features: ["500+ daily sessions", "SSO", "API", "Dedicated support"]
      }
    ]
  },

  // === FORMS ===
  "typeform": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.typeform.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["10 responses/month", "1 user", "Basic templates", "Typeform branding"]
      },
      {
        name: "Basic",
        price: 25,
        period: "month",
        description: "For individuals",
        features: ["100 responses/month", "1 user", "Custom themes", "Hidden fields"],
        highlighted: true
      },
      {
        name: "Plus",
        price: 50,
        period: "month",
        description: "For small teams",
        features: ["1,000 responses/month", "3 users", "Logic jumps", "File upload"]
      },
      {
        name: "Business",
        price: 83,
        period: "month",
        description: "For teams",
        features: ["10,000 responses/month", "5 users", "Priority support", "Custom domains"]
      }
    ]
  },

  "tally": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://tally.so/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For everyone",
        features: ["Unlimited forms", "Unlimited submissions", "No branding", "All form blocks"]
      },
      {
        name: "Pro",
        price: 29,
        period: "month",
        description: "For power users",
        features: ["Custom domains", "File upload (10GB)", "Webhooks", "Partial submissions"],
        highlighted: true
      }
    ]
  },

  // === SECURITY & AUTH ===
  "1password": {
    startingPrice: 2.99,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://1password.com/pricing",
    tiers: [
      {
        name: "Individual",
        price: 2.99,
        period: "month",
        description: "For individuals",
        features: ["Unlimited passwords", "All devices", "365-day history", "24/7 support"]
      },
      {
        name: "Families",
        price: 4.99,
        period: "month",
        description: "For families",
        features: ["5 family members", "Shared vaults", "Account recovery", "Parental controls"],
        highlighted: true
      },
      {
        name: "Teams",
        price: 19.95,
        period: "month",
        description: "For teams",
        features: ["Up to 10 users", "Admin controls", "Vault sharing", "Priority support"]
      },
      {
        name: "Business",
        price: 7.99,
        period: "month",
        description: "For businesses",
        features: ["Unlimited users", "SSO", "Custom groups", "Usage reports"]
      }
    ]
  },

  "clerk": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://clerk.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For side projects",
        features: ["10,000 MAUs", "Pre-built UI", "Social login", "Community support"]
      },
      {
        name: "Pro",
        price: 25,
        period: "month",
        description: "For production apps",
        features: ["10,000+ MAUs", "Remove Clerk branding", "Enhanced sessions", "Email support"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Custom MAUs", "SSO", "SAML", "Dedicated support"]
      }
    ]
  },

  "auth0": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 22,
    pricingPageUrl: "https://auth0.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["25,000 MAUs", "Social connections", "Custom domains", "Basic MFA"]
      },
      {
        name: "Essential",
        price: 35,
        period: "month",
        description: "For growing apps",
        features: ["1,000 MAUs", "Unlimited social", "Enhanced MFA", "Premium support"],
        highlighted: true
      },
      {
        name: "Professional",
        price: 240,
        period: "month",
        description: "For businesses",
        features: ["1,000 MAUs", "Enterprise connections", "Custom MFA", "99.99% SLA"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited MAUs", "Dedicated tenants", "Managed services", "Custom contracts"]
      }
    ]
  },

  // === WRITING & AI ===
  "grammarly": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 7,
    pricingPageUrl: "https://www.grammarly.com/plans",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For basic writing",
        features: ["Grammar & spelling", "Tone detection", "Basic suggestions", "Browser extension"]
      },
      {
        name: "Premium",
        price: 12,
        period: "month",
        description: "For individuals",
        features: ["Advanced suggestions", "Plagiarism detection", "Vocabulary ideas", "Full-sentence rewrites"],
        highlighted: true
      },
      {
        name: "Business",
        price: 15,
        period: "month",
        description: "For teams",
        features: ["Everything in Premium", "Style guides", "Admin controls", "Analytics"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["SSO", "SCIM", "Custom security", "Dedicated support"]
      }
    ]
  },

  "elevenlabs": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://elevenlabs.io/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For trying out",
        features: ["10,000 characters/month", "3 custom voices", "Non-commercial use"]
      },
      {
        name: "Starter",
        price: 5,
        period: "month",
        description: "For creators",
        features: ["30,000 characters/month", "10 custom voices", "Commercial license"],
        highlighted: true
      },
      {
        name: "Creator",
        price: 22,
        period: "month",
        description: "For professionals",
        features: ["100,000 characters/month", "30 custom voices", "Dubbing studio"]
      },
      {
        name: "Pro",
        price: 99,
        period: "month",
        description: "For heavy users",
        features: ["500,000 characters/month", "160 custom voices", "Usage analytics"]
      }
    ]
  },

  "perplexity": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.perplexity.ai/pro",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For casual use",
        features: ["Limited Pro searches", "Standard model", "Web browsing", "Basic sources"]
      },
      {
        name: "Pro",
        price: 20,
        period: "month",
        description: "For power users",
        features: ["Unlimited Pro searches", "GPT-4 & Claude", "File uploads", "API access"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For organizations",
        features: ["Team management", "SSO", "API priority", "Dedicated support"]
      }
    ]
  },

  // === DEVELOPER TOOLS ===
  "postman": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.postman.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["3 users", "Unlimited collections", "1000 API calls/month", "Community support"]
      },
      {
        name: "Basic",
        price: 14,
        period: "month",
        description: "For small teams",
        features: ["Up to 15 users", "10,000 API calls/month", "Role-based access", "Email support"],
        highlighted: true
      },
      {
        name: "Professional",
        price: 29,
        period: "month",
        description: "For teams",
        features: ["Up to 20 users", "100,000 API calls/month", "SSO", "Custom domains"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited users", "Unlimited API calls", "SCIM", "Dedicated support"]
      }
    ]
  },

  "docker": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.docker.com/pricing/",
    tiers: [
      {
        name: "Personal",
        price: 0,
        description: "For individuals",
        features: ["Unlimited public repos", "200 pulls/6 hours", "Community support"]
      },
      {
        name: "Pro",
        price: 5,
        period: "month",
        description: "For developers",
        features: ["Unlimited private repos", "5,000 pulls/day", "Docker Scout", "Email support"],
        highlighted: true
      },
      {
        name: "Team",
        price: 9,
        period: "month",
        description: "For teams",
        features: ["Unlimited pulls", "Access controls", "Activity logs", "Admin tools"]
      },
      {
        name: "Business",
        price: 24,
        period: "month",
        description: "For enterprises",
        features: ["SSO", "Image Access Mgmt", "Hardened Desktop", "24/7 support"]
      }
    ]
  },

  "sentry": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://sentry.io/pricing/",
    tiers: [
      {
        name: "Developer",
        price: 0,
        description: "For individuals",
        features: ["5K errors/month", "1 user", "Community support", "14-day retention"]
      },
      {
        name: "Team",
        price: 26,
        period: "month",
        description: "For small teams",
        features: ["50K errors/month", "Unlimited users", "Performance monitoring", "Email support"],
        highlighted: true
      },
      {
        name: "Business",
        price: 80,
        period: "month",
        description: "For growing teams",
        features: ["100K errors/month", "SSO", "Custom dashboards", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited errors", "On-premise option", "Dedicated support", "SLA"]
      }
    ]
  },

  "datadog": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://www.datadoghq.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["5 hosts", "1-day retention", "Core metrics", "Community support"]
      },
      {
        name: "Pro",
        price: 15,
        period: "month",
        description: "Per host",
        features: ["15-month retention", "Out-of-box dashboards", "Alerting", "Team support"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: 23,
        period: "month",
        description: "Per host",
        features: ["Custom enrichment", "Advanced permissions", "Live process", "Priority support"]
      }
    ]
  },

  // === NO-CODE ===
  "webflow": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://webflow.com/pricing",
    tiers: [
      {
        name: "Starter",
        price: 0,
        description: "For learning",
        features: ["2 pages", "Webflow subdomain", "Form submissions", "Staging"]
      },
      {
        name: "Basic",
        price: 14,
        period: "month",
        description: "For simple sites",
        features: ["150 pages", "Custom domain", "CMS items", "SSL"],
        highlighted: true
      },
      {
        name: "CMS",
        price: 23,
        period: "month",
        description: "For content sites",
        features: ["150 pages", "2,000 CMS items", "10K form submissions", "Site search"]
      },
      {
        name: "Business",
        price: 39,
        period: "month",
        description: "For businesses",
        features: ["150 pages", "10,000 CMS items", "Custom code", "Form file uploads"]
      }
    ]
  },

  "framer": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.framer.com/pricing/",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For learning",
        features: ["2 pages", "Framer subdomain", "Basic CMS", "Community support"]
      },
      {
        name: "Mini",
        price: 5,
        period: "month",
        description: "For side projects",
        features: ["3 pages", "Custom domain", "1,000 CMS items", "Basic analytics"],
        highlighted: true
      },
      {
        name: "Basic",
        price: 15,
        period: "month",
        description: "For personal sites",
        features: ["10 pages", "No Framer badge", "10K CMS items", "Password protection"]
      },
      {
        name: "Pro",
        price: 30,
        period: "month",
        description: "For professionals",
        features: ["Unlimited pages", "Advanced SEO", "Localization", "Priority support"]
      }
    ]
  },

  "retool": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://retool.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For individuals",
        features: ["5 users", "Unlimited apps", "All components", "Community support"]
      },
      {
        name: "Team",
        price: 10,
        period: "month",
        description: "For small teams",
        features: ["5+ users", "Git sync", "App themes", "Email support"],
        highlighted: true
      },
      {
        name: "Business",
        price: 50,
        period: "month",
        description: "For businesses",
        features: ["SSO", "Audit logs", "Custom branding", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Self-hosted option", "Dedicated support", "Custom contracts", "SLA"]
      }
    ]
  },

  "n8n": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 14,
    pricingPageUrl: "https://n8n.io/pricing",
    tiers: [
      {
        name: "Community",
        price: 0,
        description: "Self-hosted",
        features: ["Unlimited workflows", "All integrations", "Community support", "Self-hosted only"]
      },
      {
        name: "Starter",
        price: 20,
        period: "month",
        description: "For getting started",
        features: ["2,500 executions", "5 active workflows", "Cloud hosted", "Email support"],
        highlighted: true
      },
      {
        name: "Pro",
        price: 50,
        period: "month",
        description: "For growing teams",
        features: ["10K executions", "15 active workflows", "Team features", "Priority support"]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For enterprises",
        features: ["Unlimited executions", "SSO", "Audit logs", "Dedicated support"]
      }
    ]
  },

  "make": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    pricingPageUrl: "https://www.make.com/en/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For getting started",
        features: ["1,000 operations/month", "2 active scenarios", "100MB data transfer", "Community support"]
      },
      {
        name: "Core",
        price: 9,
        period: "month",
        description: "For individuals",
        features: ["10,000 operations/month", "Unlimited scenarios", "1GB data", "Email support"],
        highlighted: true
      },
      {
        name: "Pro",
        price: 16,
        period: "month",
        description: "For teams",
        features: ["10,000 operations/month", "Custom variables", "Priority execution", "Priority support"]
      },
      {
        name: "Teams",
        price: 29,
        period: "month",
        description: "For organizations",
        features: ["10,000 operations/month", "Team features", "Advanced admin", "Dedicated support"]
      }
    ]
  },

  // Additional tools with basic pricing
  "stripe": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "transaction",
    hasFreeTrial: false,
    pricingPageUrl: "https://stripe.com/pricing",
    tiers: [
      {
        name: "Integrated",
        price: "2.9% + 30c",
        description: "Per successful charge",
        features: ["No setup fees", "No monthly fees", "Global payments", "Full dashboard"]
      },
      {
        name: "Customized",
        price: "Custom",
        description: "For high volume",
        features: ["Volume discounts", "Custom pricing", "Dedicated support", "Account management"],
        highlighted: true
      }
    ]
  },

  "shopify": {
    startingPrice: 29,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 3,
    pricingPageUrl: "https://www.shopify.com/pricing",
    tiers: [
      {
        name: "Basic",
        price: 29,
        period: "month",
        description: "For new businesses",
        features: ["Unlimited products", "2 staff accounts", "Online store", "Sales channels"]
      },
      {
        name: "Shopify",
        price: 79,
        period: "month",
        description: "For growing businesses",
        features: ["5 staff accounts", "Professional reports", "Lower transaction fees"],
        highlighted: true
      },
      {
        name: "Advanced",
        price: 299,
        period: "month",
        description: "For scaling businesses",
        features: ["15 staff accounts", "Advanced reports", "Third-party shipping rates"]
      },
      {
        name: "Plus",
        price: 2300,
        period: "month",
        description: "For high-volume merchants",
        features: ["Unlimited staff", "Automation tools", "Custom checkout", "Dedicated support"]
      }
    ]
  },

  "obsidian": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://obsidian.md/pricing",
    tiers: [
      {
        name: "Personal",
        price: 0,
        description: "For individuals",
        features: ["All core features", "Community plugins", "Local storage", "Mobile apps"]
      },
      {
        name: "Catalyst",
        price: 25,
        period: "one-time",
        description: "Early access supporter",
        features: ["Insider builds", "Community badge", "Support development"]
      },
      {
        name: "Sync",
        price: 4,
        period: "month",
        description: "Add-on for syncing",
        features: ["End-to-end encryption", "Version history", "Selective sync"],
        highlighted: true
      },
      {
        name: "Publish",
        price: 8,
        period: "month",
        description: "Add-on for publishing",
        features: ["Custom domains", "Password protection", "Google Analytics"]
      }
    ]
  },

  "dropbox": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://www.dropbox.com/plans",
    tiers: [
      {
        name: "Basic",
        price: 0,
        description: "For getting started",
        features: ["2GB storage", "Sync across devices", "File sharing"]
      },
      {
        name: "Plus",
        price: 11.99,
        period: "month",
        description: "For individuals",
        features: ["2TB storage", "30-day history", "Offline folders"],
        highlighted: true
      },
      {
        name: "Professional",
        price: 19.99,
        period: "month",
        description: "For professionals",
        features: ["3TB storage", "Smart Sync", "Watermarking"]
      },
      {
        name: "Business",
        price: 15,
        period: "month",
        description: "Per user",
        features: ["9TB+ storage", "Admin tools", "SSO"]
      }
    ]
  },

  "salesforce": {
    startingPrice: 25,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: true,
    freeTrialDays: 30,
    pricingPageUrl: "https://www.salesforce.com/products/sales/pricing/",
    tiers: [
      {
        name: "Starter",
        price: 25,
        period: "month",
        description: "For small teams",
        features: ["Basic CRM", "Email integration", "Mobile app", "Reports"]
      },
      {
        name: "Professional",
        price: 80,
        period: "month",
        description: "For complete CRM",
        features: ["Pipeline management", "Forecasting", "Quotes", "Collaboration"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: 165,
        period: "month",
        description: "For customization",
        features: ["Workflow automation", "Advanced reporting", "API access", "Custom apps"]
      },
      {
        name: "Unlimited",
        price: 330,
        period: "month",
        description: "For enterprise",
        features: ["24/7 support", "Unlimited customization", "AI features", "Data storage"]
      }
    ]
  },

  "descript": {
    startingPrice: 0,
    currency: "USD",
    billingPeriod: "month",
    hasFreeTrial: false,
    pricingPageUrl: "https://www.descript.com/pricing",
    tiers: [
      {
        name: "Free",
        price: 0,
        description: "For trying out",
        features: ["1 hour transcription", "1 watermark-free export", "Screen recording"]
      },
      {
        name: "Hobbyist",
        price: 12,
        period: "month",
        description: "For creators",
        features: ["10 hours transcription", "Unlimited exports", "Studio Sound"],
        highlighted: true
      },
      {
        name: "Creator",
        price: 24,
        period: "month",
        description: "For professionals",
        features: ["30 hours transcription", "Overdub", "AI features"]
      },
      {
        name: "Business",
        price: 40,
        period: "month",
        description: "For teams",
        features: ["Unlimited transcription", "Custom Overdub voices", "Team features"]
      }
    ]
  },
};

async function updatePricing() {
  console.log("💰 Starting pricing update...\n");

  let updated = 0;
  let notFound = 0;

  for (const [slug, pricing] of Object.entries(pricingData)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, name: true }
      });

      if (!tool) {
        console.log(`  ⚠️  Tool not found: ${slug}`);
        notFound++;
        continue;
      }

      await prisma.tool.update({
        where: { slug },
        data: {
          pricingDetails: pricing as object
        }
      });

      console.log(`  ✅ Updated: ${tool.name}`);
      updated++;
    } catch (error) {
      console.error(`  ❌ Error updating ${slug}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  - Updated: ${updated} tools`);
  console.log(`  - Not found: ${notFound} tools`);
  console.log(`  - Total pricing entries: ${Object.keys(pricingData).length}`);
  console.log("\n✨ Pricing update completed!");
}

updatePricing()
  .catch((e) => {
    console.error("❌ Error during pricing update:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
