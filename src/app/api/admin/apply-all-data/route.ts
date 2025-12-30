import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes timeout

// All verified pricing data (664 tools)
const allPricing: Record<string, {
  startingPrice: number | string | null;
  currency?: string;
  billingPeriod?: string;
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
  pricingPageUrl?: string;
  notes?: string;
  tiers?: Array<{
    name: string;
    price?: number | string;
    period?: string;
    description?: string;
    highlighted?: boolean;
    features?: string[];
  }>;
}> = {
  "better-stack": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://betterstack.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Getting started",
        "features": [
          "10 monitors & heartbeats",
          "1 status page",
          "Slack & email alerts",
          "100,000 exceptions/month",
          "3 GB logs (3-day retention)"
        ]
      },
      {
        "name": "Responder",
        "price": 29,
        "period": "month",
        "description": "Annual billing",
        "features": [
          "Unlimited phone/SMS alerts",
          "Uptime monitoring",
          "Incident management",
          "Single responder"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Custom deployment",
        "features": [
          "SAML SSO",
          "Dedicated deployments",
          "Advanced features"
        ]
      }
    ],
    "notes": "Telemetry bundles available: Nano $25/mo, Micro $100/mo, Mega $210/mo, Tera $420/mo"
  },
  "calendly": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.calendly.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Always free",
        "features": [
          "1 event type",
          "1 calendar",
          "Mobile apps"
        ]
      },
      {
        "name": "Standard",
        "price": 10,
        "period": "seat/month",
        "description": "Annual ($12 monthly)",
        "features": [
          "Unlimited events",
          "Multiple calendars",
          "Reminders"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": 16,
        "period": "seat/month",
        "description": "Annual ($20 monthly)",
        "features": [
          "Salesforce integration",
          "Admin features",
          "Round robin"
        ]
      },
      {
        "name": "Enterprise",
        "price": 15000,
        "period": "year min",
        "description": "Large companies",
        "features": [
          "Custom routing",
          "Dynamics support",
          "Dedicated manager"
        ]
      }
    ]
  },
  "chameleon": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.chameleon.io/pricing",
    "tiers": [
      {
        "name": "Demos Free",
        "price": 0,
        "description": "Interactive demos",
        "features": [
          "Unlimited Interactive Demos",
          "CTAs & email capture",
          "Engagement tracking"
        ]
      },
      {
        "name": "Startup",
        "price": 279,
        "period": "month",
        "description": "Scales with MTUs",
        "features": [
          "Unlimited Tours & Tooltips",
          "5 Microsurveys",
          "1 Launcher",
          "Custom CSS"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 12000,
        "period": "year",
        "description": "Growing teams",
        "features": [
          "All Experiences Unlimited",
          "A/B Testing",
          "Rate Limiting",
          "Customer Success support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large organizations",
        "features": [
          "Unlimited Seats",
          "Roles & Permissions",
          "Localization",
          "Account-switching"
        ]
      }
    ]
  },
  "chargebee": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "usage",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.chargebee.com/pricing/",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "First $250K billing free",
        "features": [
          "0.75% on billing after $250K",
          "Flexible billing",
          "Checkout",
          "35+ payment gateways"
        ]
      },
      {
        "name": "Performance",
        "price": 7188,
        "period": "year",
        "description": "Up to $100K billing/month",
        "features": [
          "Advance invoices",
          "Smart dunning",
          "Migration support",
          "Engineering consultation"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large organizations",
        "features": [
          "Multi-entity support",
          "Account hierarchy",
          "On-demand discounting",
          "Contract terms"
        ]
      }
    ]
  },
  "circleci": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://circleci.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "6000 build min/mo",
          "30 jobs",
          "Linux/Windows/Mac"
        ],
        "highlighted": true
      },
      {
        "name": "Performance",
        "price": 15,
        "period": "month",
        "description": "Starting",
        "features": [
          "Unlimited builds",
          "Custom concurrency",
          "Premium support"
        ]
      },
      {
        "name": "Scale",
        "price": 0,
        "period": "custom",
        "description": "Enterprise",
        "features": [
          "Dedicated resources",
          "SSO",
          "SLA"
        ]
      }
    ],
    "notes": "Generous free tier. Pay for compute time."
  },
  "clickup": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.clickup.com/pricing",
    "tiers": [
      {
        "name": "Free Forever",
        "price": 0,
        "description": "Personal use",
        "features": [
          "Unlimited tasks",
          "60MB storage",
          "Basic features"
        ]
      },
      {
        "name": "Unlimited",
        "price": 7,
        "period": "user/month",
        "description": "Yearly",
        "features": [
          "Unlimited storage",
          "Gantt charts",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 12,
        "period": "user/month",
        "description": "Yearly",
        "features": [
          "SSO",
          "Mind maps",
          "Whiteboards"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "White labeling",
          "Advanced permissions"
        ]
      }
    ],
    "notes": "100% money-back guarantee. Up to 30% savings with yearly billing."
  },
  "close": {
    "startingPrice": 9,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.close.com/pricing",
    "tiers": [
      {
        "name": "Solo",
        "price": 9,
        "period": "month",
        "description": "Annual ($19 monthly)",
        "features": [
          "1 user",
          "10K leads max",
          "Core CRM"
        ]
      },
      {
        "name": "Essentials",
        "price": 35,
        "period": "month",
        "description": "Annual ($49 monthly)",
        "features": [
          "Unlimited contacts",
          "Email & calling",
          "SMS"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 99,
        "period": "month",
        "description": "Annual ($109 monthly)",
        "features": [
          "Power Dialer",
          "AI Email Assistant",
          "Workflows"
        ]
      },
      {
        "name": "Scale",
        "price": 139,
        "period": "month",
        "description": "Annual ($149 monthly)",
        "features": [
          "Predictive Dialer",
          "Unlimited recording",
          "Role permissions"
        ]
      }
    ],
    "notes": "AI Call Assistant: $50/mo + $0.02/min"
  },
  "contentful": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.contentful.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "5 users",
          "25K records",
          "2 locales"
        ]
      },
      {
        "name": "Basic",
        "price": 300,
        "period": "month",
        "description": "Small teams",
        "features": [
          "20 users",
          "50K records",
          "8 locales"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited users",
          "Custom limits",
          "SSO",
          "SLA"
        ]
      }
    ],
    "notes": "Enterprise pricing is custom. Basic at $300/mo."
  },
  "convertkit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://convertkit.com/pricing",
    "tiers": [
      {
        "name": "Newsletter",
        "price": 0,
        "description": "10K subs",
        "features": [
          "10K subscribers",
          "Unlimited emails",
          "Email support"
        ]
      },
      {
        "name": "Creator",
        "price": 25,
        "period": "month",
        "description": "300 subs",
        "features": [
          "Automation",
          "Integrations",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Creator Pro",
        "price": 50,
        "period": "month",
        "description": "300 subs",
        "features": [
          "Advanced reporting",
          "Facebook ads",
          "Newsletter referrals"
        ]
      }
    ],
    "notes": "For creators. Free up to 10K subscribers."
  },
  "copper": {
    "startingPrice": 9,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.copper.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 9,
        "period": "month",
        "description": "Annual ($12 monthly)",
        "features": [
          "1000 contacts",
          "Google Workspace",
          "Tasks"
        ]
      },
      {
        "name": "Basic",
        "price": 23,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "2500 contacts",
          "Task automation",
          "Pipelines"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 59,
        "period": "month",
        "description": "Annual ($69 monthly)",
        "features": [
          "15K contacts",
          "Workflow automation",
          "Bulk email"
        ]
      },
      {
        "name": "Business",
        "price": 99,
        "period": "month",
        "description": "Annual ($134 monthly)",
        "features": [
          "Unlimited contacts",
          "Email series",
          "Multi-currency"
        ]
      }
    ],
    "notes": "Up to 26% off with annual billing"
  },
  "cursor": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://cursor.com/pricing",
    "tiers": [
      {
        "name": "Hobby",
        "price": 0,
        "description": "Free",
        "features": [
          "2K completions",
          "50 slow requests",
          "Basic AI"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Annual $16/mo",
        "features": [
          "Unlimited completions",
          "500 fast requests",
          "GPT-4/Claude"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 40,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "All Pro",
          "Admin controls",
          "SSO",
          "Priority support"
        ]
      }
    ],
    "notes": "AI-first code editor based on VS Code."
  },
  "docker": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.docker.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited public repos",
          "200 pulls/6h",
          "Docker Desktop"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 5,
        "period": "month",
        "description": "Annual",
        "features": [
          "5K pulls/day",
          "Unlimited teams",
          "Scout features"
        ]
      },
      {
        "name": "Team",
        "price": 9,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "15K pulls/day",
          "RBAC",
          "Audit logs"
        ]
      }
    ],
    "notes": "Container platform. Free for personal."
  },
  "doppler": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.doppler.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 seats",
        "features": [
          "Unlimited secrets",
          "CLI",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 6,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Audit logs",
          "Service accounts",
          "SSO"
        ]
      }
    ],
    "notes": "Secrets management. Free for 5 seats."
  },
  "drip": {
    "startingPrice": 39,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.drip.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 39,
        "period": "month",
        "description": "2.5K people",
        "features": [
          "2500 contacts",
          "Unlimited sends",
          "Email support"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "10K people",
        "features": [
          "10K contacts",
          "All features",
          "Live chat"
        ]
      }
    ],
    "notes": "E-commerce CRM. 14-day free trial."
  },
  "github": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://github.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever free",
        "features": [
          "Unlimited repos",
          "2000 CI/CD minutes",
          "500MB packages",
          "Community support"
        ]
      },
      {
        "name": "Team",
        "price": 4,
        "period": "user/month",
        "description": "First 12 months",
        "features": [
          "3000 CI/CD minutes",
          "2GB packages",
          "Code owners",
          "Web support"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 21,
        "period": "user/month",
        "description": "First 12 months",
        "features": [
          "50000 CI/CD minutes",
          "50GB packages",
          "SAML SSO",
          "Premium support"
        ]
      }
    ],
    "notes": "Copilot, Advanced Security, Codespaces available as add-ons"
  },
  "grafana": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://grafana.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited dashboards",
          "All visualizations",
          "Alerting"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud Free",
        "price": 0,
        "description": "10K metrics",
        "features": [
          "10K series",
          "50GB logs",
          "3 users"
        ]
      },
      {
        "name": "Cloud Pro",
        "price": 29,
        "period": "month",
        "description": "Starting",
        "features": [
          "50K series",
          "100GB logs",
          "8 users"
        ]
      }
    ],
    "notes": "Self-hosted is fully free. Cloud has free tier."
  },
  "grammarly": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.grammarly.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic corrections",
        "features": [
          "Spelling & grammar",
          "Writing tone",
          "100 AI prompts/mo"
        ]
      },
      {
        "name": "Pro",
        "price": 12,
        "period": "month",
        "description": "7-day trial",
        "features": [
          "Sentence rewrites",
          "Tone adjustment",
          "Plagiarism check",
          "2000 AI prompts/mo"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Unlimited AI",
          "BYOK encryption",
          "DLP",
          "Dedicated support"
        ]
      }
    ]
  },
  "gumroad": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gumroad.com/features/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "period": "10%",
        "description": "Per sale",
        "features": [
          "Unlimited products",
          "Instant payouts",
          "Email marketing"
        ],
        "highlighted": true
      }
    ],
    "notes": "No monthly fee. 10% flat fee per sale."
  },
  "hasura": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://hasura.io/pricing",
    "tiers": [
      {
        "name": "DDN Free",
        "price": 0,
        "description": "Always free",
        "features": [
          "Unlimited models",
          "1 supergraph developer",
          "15-min observability",
          "Unlimited API requests"
        ]
      },
      {
        "name": "DDN Base",
        "price": 5,
        "period": "month per active model",
        "description": "For teams",
        "features": [
          "Unlimited developers",
          "30-day observability",
          "Schema registry",
          "SSO"
        ],
        "highlighted": true
      },
      {
        "name": "DDN Advanced",
        "price": 30,
        "period": "month per active model",
        "description": "Multi-team",
        "features": [
          "Federated collaboration",
          "Multi-repo CI/CD",
          "Team access controls"
        ]
      }
    ]
  },
  "hotjar": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.hotjar.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic analytics",
        "features": [
          "200K sessions/mo",
          "Session replay",
          "Unlimited heatmaps"
        ]
      },
      {
        "name": "Growth",
        "price": 49,
        "period": "month",
        "description": "From 7K sessions",
        "features": [
          "Sense AI",
          "13 months data",
          "Advanced filters"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": "Custom",
        "description": "1M+ sessions",
        "features": [
          "Revenue metrics",
          "Multi-session replay",
          "Custom volume"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large scale",
        "features": [
          "Digital Experience Monitoring",
          "Unlimited projects"
        ]
      }
    ],
    "notes": "Voice of Customer: Free to $99+/mo. Product Analytics: Custom pricing."
  },
  "intercom": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.intercom.com/pricing",
    "tiers": [
      {
        "name": "Essential",
        "price": 29,
        "period": "seat/month",
        "description": "Annual ($39 monthly)",
        "features": [
          "Fin AI Agent $0.99/resolution",
          "Shared inbox",
          "Basic features"
        ]
      },
      {
        "name": "Advanced",
        "price": 85,
        "period": "seat/month",
        "description": "Annual ($99 monthly)",
        "features": [
          "Automation tools",
          "AI capabilities",
          "Workflows"
        ],
        "highlighted": true
      },
      {
        "name": "Expert",
        "price": 132,
        "period": "seat/month",
        "description": "Annual ($139 monthly)",
        "features": [
          "Collaboration",
          "Security features",
          "Advanced reporting"
        ]
      }
    ],
    "notes": "Fin AI Agent: $0.99 per resolution. Add-ons: Proactive Support Plus $99/mo, Copilot $35/agent/mo"
  },
  "miro": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.miro.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic features",
        "features": [
          "3 editable boards",
          "Unlimited members",
          "Basic integrations"
        ]
      },
      {
        "name": "Starter",
        "price": 8,
        "period": "member/month",
        "description": "Annual ($10 monthly)",
        "features": [
          "Unlimited boards",
          "25 AI credits/mo",
          "Private boards"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 16,
        "period": "member/month",
        "description": "Annual ($20 monthly)",
        "features": [
          "Multiple workspaces",
          "50 AI credits/mo",
          "Jira/Azure sync"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Min 30 members",
        "features": [
          "100 AI credits/mo",
          "SSO",
          "Data residency"
        ]
      }
    ]
  },
  "mixpanel": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://mixpanel.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1M events/mo",
        "features": [
          "5 saved reports",
          "10K session replays",
          "Core analytics"
        ]
      },
      {
        "name": "Growth",
        "price": 0,
        "period": "to start",
        "description": "First 1M events free",
        "features": [
          "$0.28/1K events",
          "Unlimited reports",
          "20K replays free"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Unlimited events",
        "features": [
          "Advanced analytics",
          "Data governance",
          "Premium support"
        ]
      }
    ],
    "notes": "Startup Program: First year free for early-stage companies"
  },
  "monday": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.monday.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 2 seats",
        "features": [
          "3 boards",
          "200+ templates",
          "Basic features"
        ]
      },
      {
        "name": "Basic",
        "price": 9,
        "period": "seat/month",
        "description": "Billed annually",
        "features": [
          "Unlimited boards",
          "5GB storage",
          "Prioritized support"
        ]
      },
      {
        "name": "Standard",
        "price": 12,
        "period": "seat/month",
        "description": "Billed annually",
        "features": [
          "Timeline & Gantt",
          "Guest access",
          "250 automations"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 19,
        "period": "seat/month",
        "description": "Billed annually",
        "features": [
          "Private boards",
          "Time tracking",
          "25K automations"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Advanced security",
          "Enterprise features"
        ]
      }
    ],
    "notes": "18% discount for annual billing vs monthly"
  },
  "mongodb-atlas": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "usage",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.mongodb.com/pricing",
    "tiers": [
      {
        "name": "Free (M0)",
        "price": 0,
        "description": "Forever free",
        "features": [
          "512 MB storage",
          "Shared RAM",
          "Up to 100 ops/sec"
        ]
      },
      {
        "name": "Flex",
        "price": 0.011,
        "period": "hour",
        "description": "Up to $30/month",
        "features": [
          "5GB storage",
          "Shared RAM",
          "Burst capacity",
          "Dev/test workloads"
        ]
      },
      {
        "name": "Dedicated (M10+)",
        "price": 0.08,
        "period": "hour",
        "description": "From $57/month",
        "features": [
          "10GB+ storage",
          "Dedicated resources",
          "99.995% SLA",
          "Auto-scaling"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise Advanced",
        "price": "Custom",
        "description": "On-premises",
        "features": [
          "Full control",
          "Ops Manager",
          "Enterprise security",
          "Commercial license"
        ]
      }
    ]
  },
  "netlify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.netlify.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "300 credits/mo",
        "features": [
          "Build & deploy",
          "Basic features",
          "Community support"
        ]
      },
      {
        "name": "Personal",
        "price": 9,
        "period": "month",
        "description": "1000 credits/mo",
        "features": [
          "Analytics",
          "Priority support",
          "More builds"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "member/month",
        "description": "3000 credits/mo",
        "features": [
          "Private repos",
          "Concurrent builds",
          "Team features"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "99.99% SLA",
        "features": [
          "Dedicated support",
          "Custom SLA",
          "Enterprise features"
        ]
      }
    ],
    "notes": "Credit-based usage for deploys, compute, bandwidth, and forms"
  },
  "notion": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.notion.so/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited pages",
          "Share with 10 guests",
          "7-day history"
        ]
      },
      {
        "name": "Plus",
        "price": 8,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited guests",
          "30-day history",
          "100MB uploads"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 15,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "SAML SSO",
          "90-day history",
          "Private spaces"
        ]
      }
    ],
    "notes": "All-in-one workspace. Free for personal."
  },
  "pagerduty": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.pagerduty.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users max",
        "features": [
          "100 intl notifications",
          "1 schedule",
          "700+ integrations"
        ]
      },
      {
        "name": "Professional",
        "price": 21,
        "period": "user/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "Status page",
          "SSO",
          "Ticketing integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 41,
        "period": "user/month",
        "description": "Annual ($49 monthly)",
        "features": [
          "Custom fields",
          "Multi-year data",
          "Internal status pages"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Full chat",
          "100 incident types",
          "ServiceNow sync"
        ]
      }
    ],
    "notes": "AIOps add-on from $699/mo"
  },
  "postman": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.postman.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individual",
        "features": [
          "Unlimited collections",
          "1K API calls",
          "3 users"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 14,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited API calls",
          "Roles",
          "Integrations"
        ]
      },
      {
        "name": "Professional",
        "price": 29,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Advanced roles",
          "SSO",
          "Audit logs"
        ]
      }
    ],
    "notes": "API platform. Free for individuals."
  },
  "prisma": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.prisma.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Getting started",
        "features": [
          "100,000 operations",
          "500 MB storage",
          "5 databases",
          "No credit card required"
        ]
      },
      {
        "name": "Starter",
        "price": 10,
        "period": "month",
        "description": "For small projects",
        "features": [
          "1M operations (then $0.08/10K)",
          "10 GB storage",
          "10 databases"
        ]
      },
      {
        "name": "Pro",
        "price": 49,
        "period": "month",
        "description": "For production",
        "features": [
          "10M operations (then $0.02/10K)",
          "50 GB storage",
          "100 databases",
          "Daily backups"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 129,
        "period": "month",
        "description": "For scale",
        "features": [
          "50M operations (then $0.01/10K)",
          "100 GB storage",
          "1,000 databases",
          "30-day backups",
          "Premium support"
        ]
      }
    ]
  },
  "railway": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://railway.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "$5 trial credit",
        "features": [
          "30-day trial",
          "0.5GB RAM",
          "1 vCPU per service"
        ]
      },
      {
        "name": "Hobby",
        "price": 5,
        "period": "month min",
        "description": "Includes $5 credit",
        "features": [
          "8GB RAM/service",
          "8 vCPU/service",
          "Personal projects"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month min",
        "description": "Includes $20 credit",
        "features": [
          "32GB RAM/service",
          "Unlimited seats",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Dedicated VMs",
          "SSO",
          "HIPAA BAAs"
        ]
      }
    ],
    "notes": "Usage-based: Memory $0.000004/GB/sec, CPU $0.000008/vCPU/sec"
  },
  "render": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://render.com/pricing",
    "tiers": [
      {
        "name": "Hobby",
        "price": 0,
        "description": "Personal projects",
        "features": [
          "Free static sites",
          "512MB services",
          "Shared resources"
        ]
      },
      {
        "name": "Professional",
        "price": 19,
        "period": "user/month",
        "description": "Production apps",
        "features": [
          "Faster builds",
          "More resources",
          "Team features"
        ],
        "highlighted": true
      },
      {
        "name": "Organization",
        "price": 29,
        "period": "user/month",
        "description": "High traffic",
        "features": [
          "Compliance needs",
          "More control",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Critical apps",
        "features": [
          "Enterprise security",
          "Custom SLAs",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Web services from $7/mo. Prorated by the second."
  },
  "retool": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://retool.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "Unlimited apps",
          "Self-hosted"
        ]
      },
      {
        "name": "Team",
        "price": 10,
        "period": "user/month",
        "description": "Standard",
        "features": [
          "Unlimited users",
          "Version history",
          "Audit logs"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 50,
        "period": "user/month",
        "description": "Enterprise",
        "features": [
          "SSO",
          "Environments",
          "Custom branding"
        ]
      }
    ],
    "notes": "Internal tools builder. Free for 5 users."
  },
  "sentry": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.sentry.io/pricing/",
    "tiers": [
      {
        "name": "Developer",
        "price": 0,
        "description": "Solo devs",
        "features": [
          "1 user",
          "5K errors",
          "Basic features"
        ]
      },
      {
        "name": "Team",
        "price": 26,
        "period": "month",
        "description": "Scaling apps",
        "features": [
          "Unlimited users",
          "50K errors",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 80,
        "period": "month",
        "description": "Powerful debugging",
        "features": [
          "100K errors",
          "Insights",
          "Unlimited dashboards"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Advanced needs",
        "features": [
          "TAM",
          "Dedicated support",
          "Custom SLAs"
        ]
      }
    ],
    "notes": "20% discount with annual billing"
  },
  "sendgrid": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://sendgrid.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100/day",
        "features": [
          "100 emails/day",
          "APIs & SMTP",
          "Delivery optimization"
        ],
        "highlighted": true
      },
      {
        "name": "Essentials",
        "price": 19.95,
        "period": "month",
        "description": "40K/mo",
        "features": [
          "40K emails",
          "Email support",
          "Automation"
        ]
      },
      {
        "name": "Pro",
        "price": 89.95,
        "period": "month",
        "description": "100K/mo",
        "features": [
          "100K emails",
          "Dedicated IP",
          "Subuser management"
        ]
      }
    ],
    "notes": "100 emails/day free forever."
  },
  "stripe": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "transaction",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.stripe.com/pricing",
    "tiers": [
      {
        "name": "Standard Cards (EEE)",
        "price": "1.5%",
        "period": "+ €0.25",
        "description": "Per transaction",
        "features": [
          "No setup fees",
          "No monthly fees",
          "Pay per use"
        ],
        "highlighted": true
      },
      {
        "name": "Premium Cards",
        "price": "1.9%",
        "period": "+ €0.25",
        "description": "Per transaction",
        "features": [
          "Rewards cards",
          "Corporate cards"
        ]
      },
      {
        "name": "International",
        "price": "2.5-3.25%",
        "period": "+ €0.25",
        "description": "Non-EEE cards",
        "features": [
          "+2% currency conversion"
        ]
      },
      {
        "name": "SEPA Direct Debit",
        "price": "€0.35",
        "period": "per transaction",
        "description": "Bank transfers",
        "features": [
          "Lower cost option"
        ]
      }
    ],
    "notes": "Billing from €500/mo or 0.7% of volume. Disputes: €20 each. Instant payouts: 1%"
  },
  "supabase": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://supabase.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50K MAUs",
        "features": [
          "500MB database",
          "5GB egress",
          "1GB file storage",
          "2 active projects"
        ]
      },
      {
        "name": "Pro",
        "price": 25,
        "period": "month",
        "description": "100K MAUs",
        "features": [
          "8GB disk",
          "250GB egress",
          "7-day backups",
          "$10 compute credit"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 599,
        "period": "month",
        "description": "SOC2 compliant",
        "features": [
          "SSO",
          "Priority support",
          "14-day backups"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Designated manager",
          "99.9% SLA",
          "24/7 support"
        ]
      }
    ],
    "notes": "Custom domain $10/mo. PITR from $100/mo."
  },
  "vercel": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://vercel.com/pricing",
    "tiers": [
      {
        "name": "Hobby",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Automatic CI/CD",
          "Global CDN",
          "DDoS mitigation",
          "Traffic insights"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "+ usage",
        "features": [
          "$20 usage credit",
          "Team collaboration",
          "Faster builds",
          "Cold start prevention"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "SCIM sync",
          "99.99% SLA",
          "Multi-region compute",
          "Advanced support"
        ]
      }
    ]
  },
  "webflow": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://webflow.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "2 projects",
        "features": [
          "2 unhosted projects",
          "Staging only",
          "100 CMS items"
        ]
      },
      {
        "name": "Basic",
        "price": 18,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domain",
          "500 form subs",
          "25K visits"
        ],
        "highlighted": true
      },
      {
        "name": "CMS",
        "price": 29,
        "period": "month",
        "description": "Annual",
        "features": [
          "2K CMS items",
          "3 content editors",
          "API access"
        ]
      }
    ],
    "notes": "Site plans for hosting. Free for unhosted sites."
  },
  "zendesk": {
    "startingPrice": 19,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.zendesk.com/pricing/",
    "tiers": [
      {
        "name": "Support Team",
        "price": 19,
        "period": "agent/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "Email support",
          "Ticket routing",
          "Basic reports"
        ]
      },
      {
        "name": "Suite Team",
        "price": 55,
        "period": "agent/month",
        "description": "Annual",
        "features": [
          "Messaging",
          "AI agents",
          "1000+ integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Suite Professional",
        "price": 115,
        "period": "agent/month",
        "description": "Annual",
        "features": [
          "Custom analytics",
          "Skills-based routing",
          "SLAs"
        ]
      },
      {
        "name": "Suite Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Advanced AI",
          "Custom roles",
          "Sandbox"
        ]
      }
    ]
  },
  "algolia": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.algolia.com/pricing",
    "tiers": [
      {
        "name": "Build",
        "price": 0,
        "description": "Free forever",
        "features": [
          "10K searches/mo",
          "1M records",
          "10K AI recs",
          "3 rules/index"
        ]
      },
      {
        "name": "Grow",
        "price": 0,
        "description": "Pay-as-you-go",
        "features": [
          "$0.50/1K searches",
          "$0.40/1K records",
          "Query suggestions",
          "30-day analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Grow Plus",
        "price": 0,
        "description": "Pay-as-you-go",
        "features": [
          "$1.75/1K searches",
          "AI Synonyms",
          "Personalization",
          "90-day analytics"
        ]
      },
      {
        "name": "Elevate",
        "price": "Custom",
        "description": "Annual contract",
        "features": [
          "NeuralSearch",
          "Volume discounts",
          "SSO",
          "70+ data centers"
        ]
      }
    ],
    "notes": "AI-powered search. InstantSearch UI libraries."
  },
  "launchdarkly": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.launchdarkly.com/pricing",
    "tiers": [
      {
        "name": "Developer",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Unlimited flags",
          "30 SDKs",
          "5K replays/mo",
          "A/B testing"
        ]
      },
      {
        "name": "Foundation",
        "price": 12,
        "period": "connection/month",
        "description": "+$10/1K MAU",
        "features": [
          "All Developer",
          "Unlimited projects",
          "Targeting",
          "SSO"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Annual",
        "features": [
          "All Foundation",
          "Release automation",
          "SAML/SCIM",
          "Custom roles"
        ]
      },
      {
        "name": "Guardian",
        "price": "Custom",
        "description": "Annual",
        "features": [
          "All Enterprise",
          "Release monitoring",
          "Auto rollback",
          "Guardrail metrics"
        ]
      }
    ],
    "notes": "Feature flags + experimentation platform."
  },
  "clutch": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://clutch.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "1 seat",
          "Unlimited projects",
          "Community templates/libraries",
          "Connect to any backend",
          "Community support"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month per seat",
        "description": "Billed yearly ($25 monthly)",
        "features": [
          "Team members",
          "Team roles/permissions",
          "Team private libraries",
          "Multiple environments",
          "Export as production code"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large organizations",
        "features": [
          "Unlimited seats",
          "SSO",
          "Custom hosting",
          "Dedicated account manager"
        ]
      }
    ],
    "notes": "Early Adopter Lifetime Deal: $349 one-time per seat (Pro plan)"
  },
  "salesforce": {
    "startingPrice": 25,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.salesforce.com/editions-pricing/sales-cloud",
    "tiers": [
      {
        "name": "Starter",
        "price": 25,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Lead management",
          "Account tracking",
          "Email integration",
          "Mobile app"
        ]
      },
      {
        "name": "Pro Suite",
        "price": 100,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Starter",
          "Forecasting",
          "Pipeline management",
          "Quotes"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 165,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Pro",
          "Workflow automation",
          "Advanced reporting",
          "Territory management"
        ]
      },
      {
        "name": "Unlimited",
        "price": 330,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Enterprise",
          "Einstein AI",
          "24/7 support",
          "Sandbox"
        ]
      }
    ],
    "notes": "Industry leader CRM. AppExchange for extensions."
  },
  "zoho-crm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.zoho.com/crm/zohocrm-pricing.html",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 users",
        "features": [
          "Leads",
          "Documents",
          "Mobile apps",
          "Basic features"
        ]
      },
      {
        "name": "Standard",
        "price": 14,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Sales forecasting",
          "Workflows",
          "Custom modules",
          "Office 365"
        ]
      },
      {
        "name": "Professional",
        "price": 23,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Standard",
          "Blueprint",
          "Inventory",
          "Google Ads"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 40,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Professional",
          "Zia AI",
          "Territory management",
          "Sandbox"
        ]
      }
    ],
    "notes": "Part of Zoho One suite. 900+ extensions."
  },
  "folk": {
    "startingPrice": 17.5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.folk.app/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 17.5,
        "period": "member/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "Core CRM",
          "Integrations",
          "Collaboration"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 35,
        "period": "member/month",
        "description": "Annual ($50 monthly)",
        "features": [
          "Advanced features",
          "More integrations",
          "Priority support"
        ]
      },
      {
        "name": "Custom",
        "price": 70,
        "period": "member/month",
        "description": "Annual (from $100 monthly)",
        "features": [
          "Custom solutions",
          "Dedicated support",
          "Enterprise features"
        ]
      }
    ]
  },
  "slack": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://slack.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Small teams",
        "features": [
          "90-day history",
          "10 integrations",
          "1:1 calls"
        ]
      },
      {
        "name": "Pro",
        "price": 8.75,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited history",
          "Unlimited integrations",
          "Group calls"
        ],
        "highlighted": true
      },
      {
        "name": "Business+",
        "price": 15,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "SAML SSO",
          "Compliance",
          "Priority support"
        ]
      }
    ],
    "notes": "Free tier limited to 90 days message history."
  },
  "zoom": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://zoom.us/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Personal",
        "features": [
          "100 participants",
          "40-min limit",
          "Unlimited 1:1"
        ]
      },
      {
        "name": "Pro",
        "price": 15.99,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "30-hour meetings",
          "Cloud storage",
          "Reports"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 21.99,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "300 participants",
          "Branding",
          "SSO"
        ]
      }
    ],
    "notes": "Free tier has 40-minute limit on group calls."
  },
  "loom": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.loom.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "25 videos/person",
          "5 min limit",
          "Basic editing"
        ]
      },
      {
        "name": "Business",
        "price": 12.5,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited videos",
          "No time limit",
          "Engagement insights"
        ],
        "highlighted": true
      }
    ],
    "notes": "Video messaging. Free tier limited."
  },
  "discord": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://discord.com/nitro",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Text/Voice/Video",
          "Screen share",
          "Communities"
        ],
        "highlighted": true
      },
      {
        "name": "Nitro Basic",
        "price": 2.99,
        "period": "month",
        "description": "Enhanced",
        "features": [
          "Custom emoji",
          "50MB uploads",
          "HD video"
        ]
      },
      {
        "name": "Nitro",
        "price": 9.99,
        "period": "month",
        "description": "Full",
        "features": [
          "100MB uploads",
          "4K streaming",
          "Server boosts"
        ]
      }
    ],
    "notes": "Core platform is free. Nitro for extra features."
  },
  "sketch": {
    "startingPrice": 10,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.sketch.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 10,
        "period": "editor/month",
        "description": "For teams",
        "features": [
          "Mac app",
          "Web app",
          "Unlimited viewers",
          "Libraries"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 22,
        "period": "editor/month",
        "description": "Orgs",
        "features": [
          "SSO",
          "Invoicing",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Mac-only design tool. Per-editor pricing."
  },
  "n8n": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://n8n.io/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited workflows",
          "Self-hosted",
          "All features"
        ],
        "highlighted": true
      },
      {
        "name": "Starter",
        "price": 20,
        "period": "month",
        "description": "2.5K executions",
        "features": [
          "Cloud hosted",
          "5 workflows",
          "Support"
        ]
      }
    ],
    "notes": "Open-source automation. Self-hosted free."
  },
  "buffer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://buffer.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 channels",
        "features": [
          "10 scheduled posts/channel",
          "100 ideas",
          "AI Assistant",
          "Basic analytics"
        ]
      },
      {
        "name": "Essentials",
        "price": 5,
        "period": "channel/month",
        "description": "20% off annual",
        "features": [
          "Unlimited posts",
          "Unlimited ideas",
          "Advanced analytics",
          "Hashtag manager"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 10,
        "period": "channel/month",
        "description": "20% off annual",
        "features": [
          "All Essentials",
          "Unlimited users",
          "Approval workflows",
          "Branded reports"
        ]
      }
    ],
    "notes": "Volume discounts for more channels. 14-day trial."
  },
  "sprout-social": {
    "startingPrice": 199,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://sproutsocial.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 199,
        "period": "seat/month",
        "description": "Annual ($249 monthly)",
        "features": [
          "5 social profiles",
          "All-in-one inbox",
          "AI alt text",
          "Basic reports"
        ]
      },
      {
        "name": "Professional",
        "price": 299,
        "period": "seat/month",
        "description": "Annual ($399 monthly)",
        "features": [
          "Unlimited profiles",
          "Competitor insights",
          "AI post enhancement"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 399,
        "period": "seat/month",
        "description": "Annual ($499 monthly)",
        "features": [
          "All Professional",
          "Sentiment analysis",
          "API access",
          "Salesforce integration"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "White-glove onboarding",
          "SSO",
          "Priority support"
        ]
      }
    ],
    "notes": "24/5 phone/chat support. Premium Analytics add-on."
  },
  "later": {
    "startingPrice": 18.75,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://later.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 18.75,
        "period": "month",
        "description": "Annual",
        "features": [
          "8 profiles",
          "1 user",
          "30 posts/profile",
          "5 AI credits",
          "3-month analytics"
        ]
      },
      {
        "name": "Growth",
        "price": 37.5,
        "period": "month",
        "description": "Annual",
        "features": [
          "16 profiles",
          "2 users",
          "180 posts/profile",
          "50 AI credits",
          "1-year analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 82.5,
        "period": "month",
        "description": "Annual",
        "features": [
          "48 profiles",
          "4 users",
          "Unlimited posts",
          "100 AI credits",
          "Competitive benchmarking"
        ]
      }
    ],
    "notes": "25% off annual. Supports all major platforms."
  },
  "mailgun": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.mailgun.com/pricing",
    "tiers": [
      {
        "name": "Trial",
        "price": 0,
        "description": "5K emails",
        "features": [
          "5K emails/3mo",
          "All features",
          "No credit card"
        ]
      },
      {
        "name": "Foundation",
        "price": 35,
        "period": "month",
        "description": "50K/mo",
        "features": [
          "50K emails",
          "5 day retention",
          "24/7 support"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 90,
        "period": "month",
        "description": "100K/mo",
        "features": [
          "100K emails",
          "7 day retention",
          "Dedicated IP"
        ]
      }
    ],
    "notes": "Transactional and bulk email."
  },
  "postmark": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://postmarkapp.com/pricing",
    "tiers": [
      {
        "name": "Free Trial",
        "price": 0,
        "description": "100 emails",
        "features": [
          "100 emails total",
          "All features",
          "No credit card"
        ]
      },
      {
        "name": "10K",
        "price": 15,
        "period": "month",
        "description": "10K/mo",
        "features": [
          "10K emails",
          "Unlimited users",
          "45 day retention"
        ],
        "highlighted": true
      },
      {
        "name": "50K",
        "price": 57.5,
        "period": "month",
        "description": "50K/mo",
        "features": [
          "50K emails",
          "All features",
          "Better rates"
        ]
      }
    ],
    "notes": "Transactional email focus. High deliverability."
  },
  "twilio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.twilio.com/en-us/pricing",
    "tiers": [
      {
        "name": "Pay-as-you-go",
        "price": 0,
        "description": "Usage-based",
        "features": [
          "SMS from $0.0079/msg",
          "Voice from $0.0085/min",
          "WhatsApp from $0.005/msg",
          "Video from $0.004/min"
        ],
        "highlighted": true
      },
      {
        "name": "Flex (Contact Center)",
        "price": 1,
        "period": "active user hour",
        "description": "Or $150/named user",
        "features": [
          "5K free hours",
          "Omnichannel",
          "CRM integrations"
        ]
      },
      {
        "name": "Segment",
        "price": 120,
        "period": "month",
        "description": "10K visitors",
        "features": [
          "CDP",
          "Connections",
          "14-day trial"
        ]
      }
    ],
    "notes": "Volume discounts available. SendGrid included."
  },
  "basecamp": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "user/month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://basecamp.com/pricing",
    "tiers": [
      {
        "name": "Basecamp",
        "price": 15,
        "period": "user/month",
        "description": "Per user",
        "features": [
          "Projects",
          "Messages",
          "Schedules",
          "Docs"
        ],
        "highlighted": true
      },
      {
        "name": "Basecamp Pro Unlimited",
        "price": 349,
        "period": "month",
        "description": "Flat rate",
        "features": [
          "Unlimited users",
          "All features",
          "1:1 onboarding"
        ]
      }
    ],
    "notes": "Project management. $349/mo flat for unlimited users."
  },
  "cloudflare": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.cloudflare.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "CDN",
          "DDoS protection",
          "SSL",
          "Basic analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Professional",
        "features": [
          "WAF",
          "Image optimization",
          "Mobile optimization"
        ]
      },
      {
        "name": "Business",
        "price": 200,
        "period": "month",
        "description": "Business",
        "features": [
          "Custom SSL",
          "100% uptime SLA",
          "PCI compliance"
        ]
      }
    ],
    "notes": "Free CDN and security. Pro for advanced features."
  },
  "datadog": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.datadoghq.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 hosts",
        "features": [
          "1-day retention",
          "Core integrations",
          "5 hosts limit"
        ]
      },
      {
        "name": "Pro",
        "price": 15,
        "period": "host/month",
        "description": "Annual",
        "features": [
          "15-month retention",
          "500+ integrations",
          "Alerts"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 23,
        "period": "host/month",
        "description": "Annual",
        "features": [
          "Watchdog",
          "SLOs",
          "Compliance"
        ]
      }
    ],
    "notes": "Per-host pricing. Free for up to 5 hosts."
  },
  "snyk": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://snyk.io/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "200 tests/mo",
          "Limited projects",
          "Community support"
        ]
      },
      {
        "name": "Team",
        "price": 57,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Unlimited tests",
          "Private repos",
          "API access"
        ],
        "highlighted": true
      }
    ],
    "notes": "Open source scanning free. Team for private repos."
  },
  "wordpress": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://wordpress.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 GB storage",
        "features": [
          "Unlimited pages",
          "Basic features",
          "wordpress.com subdomain"
        ]
      },
      {
        "name": "Personal",
        "price": 4,
        "period": "month",
        "description": "Yearly",
        "features": [
          "6 GB storage",
          "Custom domain",
          "Ad-free"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 8,
        "period": "month",
        "description": "Yearly",
        "features": [
          "13 GB storage",
          "Premium themes",
          "Google Analytics"
        ]
      },
      {
        "name": "Business",
        "price": 25,
        "period": "month",
        "description": "Yearly",
        "features": [
          "50 GB storage",
          "Plugins",
          "SSH/SFTP access"
        ]
      }
    ],
    "notes": "Commerce: €45/mo. Enterprise from $25K/year."
  },
  "claude": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://claude.ai",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "Claude 3.5 Sonnet",
          "Limited messages",
          "Basic features"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Priority",
        "features": [
          "5x more usage",
          "Claude 3 Opus",
          "Priority access"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 30,
        "period": "user/month",
        "description": "Min 5 users",
        "features": [
          "Higher limits",
          "Admin",
          "Billing controls"
        ]
      }
    ],
    "notes": "Claude consumer chat. Pro for heavier usage."
  },
  "jasper": {
    "startingPrice": 59,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.jasper.ai/pricing",
    "tiers": [
      {
        "name": "Pro",
        "price": 59,
        "period": "seat/month",
        "description": "Annual ($69 monthly)",
        "features": [
          "Canvas platform",
          "2 Brand Voices",
          "Image generation",
          "30+ languages",
          "Plagiarism checker"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": "Custom",
        "description": "12-month minimum",
        "features": [
          "All Pro",
          "AI App Builder",
          "Marketing Agents",
          "API access",
          "SSO/SCIM"
        ]
      }
    ],
    "notes": "7-day free trial. Enterprise-grade AI for marketing."
  },
  "writesonic": {
    "startingPrice": 39,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://writesonic.com/pricing",
    "tiers": [
      {
        "name": "Lite",
        "price": 39,
        "period": "month",
        "description": "Annual ($49 monthly)",
        "features": [
          "15 AI articles/mo",
          "6 site audits",
          "100 AI agent gen",
          "2 writing styles"
        ]
      },
      {
        "name": "Standard",
        "price": 79,
        "period": "month",
        "description": "Annual ($99 monthly)",
        "features": [
          "30 articles/mo",
          "15 site audits",
          "Unlimited AI agent",
          "5 writing styles"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 199,
        "period": "month",
        "description": "Annual ($249 monthly)",
        "features": [
          "100 articles/mo",
          "40 audits",
          "Brand tracking",
          "Priority support"
        ]
      },
      {
        "name": "Advanced",
        "price": 399,
        "period": "month",
        "description": "Annual ($499 monthly)",
        "features": [
          "200 articles/mo",
          "60 audits",
          "5 extra users",
          "Slack support"
        ]
      }
    ],
    "notes": "SEO + AI writing combo. GEO optimization."
  },
  "copy-ai": {
    "startingPrice": 24,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.copy.ai/pricing",
    "tiers": [
      {
        "name": "Chat",
        "price": 24,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "5 seats",
          "Unlimited words",
          "OpenAI/Anthropic/Gemini",
          "Unlimited projects"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 1000,
        "period": "month",
        "description": "Annual",
        "features": [
          "75 seats",
          "20K workflow credits/mo",
          "Unlimited chat words"
        ]
      },
      {
        "name": "Expansion",
        "price": 2000,
        "period": "month",
        "description": "Annual",
        "features": [
          "150 seats",
          "45K workflow credits/mo"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "API access",
          "20+ integrations",
          "Enterprise security"
        ]
      }
    ],
    "notes": "20% off annual billing. GTM AI platform."
  },
  "replicate": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://replicate.com/pricing",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Per second",
        "features": [
          "Open models",
          "Custom models",
          "GPU hosting"
        ],
        "highlighted": true
      }
    ],
    "notes": "Pay per second of compute. Run any model."
  },
  "runway": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://runwayml.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "125 credits",
        "features": [
          "Gen-3 Alpha",
          "Limited exports",
          "Basic tools"
        ]
      },
      {
        "name": "Standard",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "625 credits/mo",
          "Unlimited exports",
          "Remove watermark"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 28,
        "period": "month",
        "description": "Annual",
        "features": [
          "2250 credits/mo",
          "4K exports",
          "Priority access"
        ]
      }
    ],
    "notes": "AI video generation. Gen-3 Alpha available."
  },
  "otter": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.otter.ai/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free forever",
        "features": [
          "300 min/mo",
          "Live transcription",
          "AI chat"
        ]
      },
      {
        "name": "Pro",
        "price": 8.33,
        "period": "user/month",
        "description": "Annual ($16.99 monthly)",
        "features": [
          "1200 min/mo",
          "Advanced AI",
          "10 imports"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 19.99,
        "period": "user/month",
        "description": "Annual ($30 monthly)",
        "features": [
          "Unlimited meetings",
          "4hr/meeting",
          "Analytics"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "HIPAA",
          "SSO",
          "Dedicated CSM"
        ]
      }
    ],
    "notes": "51% savings with annual billing"
  },
  "fireflies": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://fireflies.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "Unlimited transcription",
          "800 min storage",
          "Basic AI"
        ]
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "month",
        "description": "Annual ($18 monthly)",
        "features": [
          "8K min storage",
          "Unlimited AI",
          "Downloads"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 19,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "Unlimited storage",
          "Video recording",
          "Analytics"
        ]
      },
      {
        "name": "Enterprise",
        "price": 39,
        "period": "month",
        "description": "Annual",
        "features": [
          "HIPAA",
          "SSO/SCIM",
          "Private storage"
        ]
      }
    ]
  },
  "synthesia": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.synthesia.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 min/mo",
        "features": [
          "9 AI avatars",
          "1 editor",
          "Basic features"
        ]
      },
      {
        "name": "Starter",
        "price": 18,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "10 min/mo",
          "125+ avatars",
          "AI dubbing",
          "No watermark"
        ],
        "highlighted": true
      },
      {
        "name": "Creator",
        "price": 64,
        "period": "month",
        "description": "Annual ($89 monthly)",
        "features": [
          "30 min/mo",
          "180+ avatars",
          "5 personal avatars",
          "API access"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Unlimited minutes",
          "SSO",
          "80+ language translation"
        ]
      }
    ],
    "notes": "AI avatar video creation. 140+ languages."
  },
  "livekit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.livekit.io/pricing",
    "tiers": [
      {
        "name": "Build",
        "price": 0,
        "description": "1K agent min",
        "features": [
          "5 concurrent",
          "1 deployment",
          "Community support"
        ]
      },
      {
        "name": "Ship",
        "price": 50,
        "period": "month",
        "description": "5K agent min",
        "features": [
          "20 concurrent",
          "2 deployments",
          "Email support"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 500,
        "period": "month",
        "description": "50K agent min",
        "features": [
          "1K concurrent",
          "HIPAA",
          "Metrics APIs"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Unlimited",
        "features": [
          "SSO",
          "SLA",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Overage: $0.01/min. WebRTC: $0.0004-0.0005/min."
  },
  "notion-calendar": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.notion.com/product/calendar",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever free",
        "features": [
          "Google Calendar sync",
          "Notion integration",
          "Scheduling links"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free standalone app. Premium features with Notion subscription."
  },
  "rippling": {
    "startingPrice": 8,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.rippling.com/pricing",
    "tiers": [
      {
        "name": "Rippling Unity",
        "price": 8,
        "period": "employee/month",
        "description": "Core platform",
        "features": [
          "Employee data",
          "Workflow automation",
          "App management",
          "Policies"
        ]
      },
      {
        "name": "HCM",
        "price": "Custom",
        "description": "Per-employee",
        "features": [
          "Payroll",
          "Benefits",
          "Time tracking",
          "Recruiting",
          "Performance"
        ],
        "highlighted": true
      },
      {
        "name": "IT + Spend",
        "price": "Custom",
        "description": "Add-ons",
        "features": [
          "Device management",
          "Identity",
          "Corporate cards",
          "Expenses"
        ]
      }
    ],
    "notes": "Modular platform. Per-employee pricing."
  },
  "tawk-to": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.tawk.to/pricing/",
    "tiers": [
      {
        "name": "Free Forever",
        "price": 0,
        "description": "Full featured",
        "features": [
          "Unlimited agents",
          "45+ languages",
          "Video/voice chat",
          "Screen sharing"
        ],
        "highlighted": true
      },
      {
        "name": "Hired Agents",
        "price": 1,
        "period": "per hour",
        "description": "Optional",
        "features": [
          "Professional agents",
          "24/7 coverage",
          "Trained staff"
        ]
      },
      {
        "name": "Remove Branding",
        "price": 19,
        "period": "month",
        "description": "Optional",
        "features": [
          "White label",
          "Custom branding"
        ]
      }
    ],
    "notes": "99% of users are on free tier. AI Assist available as add-on."
  },
  "evernote": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://evernote.com/compare-plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 device",
        "features": [
          "60MB uploads/mo",
          "25MB note size",
          "Web clipper",
          "Search"
        ]
      },
      {
        "name": "Personal",
        "price": 10.83,
        "period": "month",
        "description": "Annual ($14.99 monthly)",
        "features": [
          "Unlimited devices",
          "10GB uploads/mo",
          "Offline notes",
          "Tasks"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 14.17,
        "period": "month",
        "description": "Annual ($17.99 monthly)",
        "features": [
          "All Personal",
          "20GB uploads/mo",
          "Boolean search",
          "PDF export"
        ]
      }
    ],
    "notes": "Classic note-taking app. Home dashboard + AI features."
  },
  "todoist": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://todoist.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "5 projects",
          "5 collaborators",
          "Basic features"
        ]
      },
      {
        "name": "Pro",
        "price": 4,
        "period": "month",
        "description": "Annual",
        "features": [
          "300 projects",
          "25 collaborators",
          "Reminders"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Team workspace",
          "Admin controls",
          "Priority support"
        ]
      }
    ],
    "notes": "Personal task manager. Free tier available."
  },
  "any-do": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.any.do/premium",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Basic tasks",
          "Limited features",
          "Sync"
        ]
      },
      {
        "name": "Premium",
        "price": 2.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Recurring tasks",
          "Themes",
          "Unlimited lists"
        ],
        "highlighted": true
      }
    ],
    "notes": "Simple task manager. Free tier."
  },
  "ticktick": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://ticktick.com/about/upgrade",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Lists",
          "Tags",
          "Reminders",
          "2 calendars"
        ]
      },
      {
        "name": "Premium",
        "price": 2.79,
        "period": "month",
        "description": "Annual $28",
        "features": [
          "Unlimited calendars",
          "Themes",
          "Duration tracking"
        ],
        "highlighted": true
      }
    ],
    "notes": "Task manager with Pomodoro. Free tier."
  },
  "obsidian": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://obsidian.md/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Unlimited notes",
          "Plugins",
          "Local storage"
        ],
        "highlighted": true
      },
      {
        "name": "Sync",
        "price": 4,
        "period": "month",
        "description": "Annual $48",
        "features": [
          "End-to-end sync",
          "10GB storage",
          "Version history"
        ]
      },
      {
        "name": "Publish",
        "price": 8,
        "period": "month",
        "description": "Annual $96",
        "features": [
          "Publish notes",
          "Custom domain",
          "SEO"
        ]
      }
    ],
    "notes": "Note-taking app. Core is free forever."
  },
  "craft": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.craft.do/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "Limited blocks",
          "1 space",
          "Basic features"
        ]
      },
      {
        "name": "Pro",
        "price": 4.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited blocks",
          "Unlimited spaces",
          "AI assist"
        ],
        "highlighted": true
      }
    ],
    "notes": "Apple native docs app. Free tier."
  },
  "invideo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://invideo.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "With watermark",
        "features": [
          "2 video min/week",
          "1 AI credit/week",
          "4 exports/week"
        ]
      },
      {
        "name": "Business",
        "price": 20,
        "period": "month",
        "description": "Annual ($30 monthly)",
        "features": [
          "No watermark",
          "60 HD exports/mo",
          "10 iStock/mo"
        ],
        "highlighted": true
      },
      {
        "name": "Unlimited",
        "price": 48,
        "period": "month",
        "description": "Annual ($60 monthly)",
        "features": [
          "Unlimited exports",
          "120 iStock/mo",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Custom solutions",
          "Advanced security"
        ]
      }
    ]
  },
  "activecampaign": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.activecampaign.com/pricing",
    "tiers": [
      {
        "name": "Lite",
        "price": 15,
        "period": "month",
        "description": "1K contacts",
        "features": [
          "1K contacts",
          "Email marketing",
          "Automation"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 49,
        "period": "month",
        "description": "1K contacts",
        "features": [
          "Landing pages",
          "Forms",
          "CRM"
        ]
      }
    ],
    "notes": "Marketing automation. No free tier."
  },
  "aws": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "usage",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://aws.amazon.com/free/",
    "tiers": [
      {
        "name": "Free Tier",
        "price": 0,
        "description": "12 months",
        "features": [
          "750 hrs EC2/mo",
          "5GB S3",
          "1M Lambda requests"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "description": "No minimum",
        "features": [
          "150+ services",
          "Per-second billing",
          "Volume discounts"
        ]
      }
    ],
    "notes": "$200 credits for new customers. Always-free tier includes 30+ services."
  },
  "gitlab": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://about.gitlab.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal projects",
        "features": [
          "400 compute min/mo",
          "10 GiB storage",
          "5 users"
        ]
      },
      {
        "name": "Premium",
        "price": 29,
        "period": "user/month",
        "description": "Annual billing",
        "features": [
          "10K compute min/mo",
          "Unlimited users",
          "AI Code Suggestions"
        ],
        "highlighted": true
      },
      {
        "name": "Ultimate",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "50K compute min/mo",
          "Unlimited guests",
          "Advanced security"
        ]
      }
    ],
    "notes": "Duo Pro $19/user/mo. Extra compute $10/1K min. Storage $5/10 GiB."
  },
  "pixlr": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://pixlr.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "With ads",
        "features": [
          "Basic editing",
          "Limited saves",
          "Watermarks"
        ]
      },
      {
        "name": "Plus",
        "price": 1.49,
        "period": "month",
        "description": "Yearly ($2.49 monthly)",
        "features": [
          "Ad-free",
          "80 AI credits/mo",
          "Unlimited saves"
        ]
      },
      {
        "name": "Premium",
        "price": 6.49,
        "period": "month",
        "description": "Yearly ($9.99 monthly)",
        "features": [
          "1000 AI credits/mo",
          "Private mode",
          "Full library"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 11.99,
        "period": "month",
        "description": "Yearly ($16.99 monthly)",
        "features": [
          "5 premium seats",
          "Team features"
        ]
      }
    ],
    "notes": "Education: Free for verified institutions"
  },
  "piktochart": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://piktochart.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "2 PNG downloads",
        "features": [
          "Unlimited projects",
          "60 AI credits",
          "100MB storage",
          "4 team members"
        ]
      },
      {
        "name": "Pro",
        "price": 14,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "Unlimited PNG",
          "5M+ premium assets",
          "500 AI credits",
          "100GB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 24,
        "period": "month",
        "description": "Annual ($49 monthly)",
        "features": [
          "Unlimited exports",
          "Brand Kit",
          "1K AI credits",
          "250GB storage"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "101+ members",
        "features": [
          "All Business",
          "SSO/SAML",
          "Dedicated manager",
          "Custom templates"
        ]
      }
    ],
    "notes": "Education $39.99/yr. Nonprofit $60/yr."
  },
  "prezi": {
    "startingPrice": 5,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.prezi.com/pricing/",
    "tiers": [
      {
        "name": "Standard",
        "price": 5,
        "period": "month",
        "description": "Annual",
        "features": [
          "500 AI credits",
          "Basic presentations",
          "Personal use"
        ]
      },
      {
        "name": "Plus",
        "price": 15,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited AI",
          "PPT conversion",
          "Desktop app"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 25,
        "period": "month",
        "description": "Annual",
        "features": [
          "Analytics",
          "Phone support",
          "Advanced training"
        ]
      },
      {
        "name": "Teams",
        "price": 39,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Collaboration",
          "Brand kit",
          "SSO"
        ]
      }
    ],
    "notes": "EDU plans from €4/mo"
  },
  "storychief": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.storychief.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic analytics",
        "features": [
          "Social media analytics",
          "SEO analytics"
        ]
      },
      {
        "name": "Social Calendar",
        "price": 19,
        "period": "month",
        "description": "Annual (€23 quarterly)",
        "features": [
          "3 channels",
          "60 posts",
          "1000 AI credits"
        ],
        "highlighted": true
      },
      {
        "name": "Team Social",
        "price": 29,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "Unlimited posts",
          "4 channels",
          "5000 AI credits"
        ]
      },
      {
        "name": "Team Editorial",
        "price": 69,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "100 articles/mo",
          "6 channels",
          "8000 AI credits"
        ]
      }
    ],
    "notes": "Agency plans from €49/customer/mo"
  },
  "strapi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://strapi.io/pricing-cloud",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited users",
          "Full API access",
          "Community support"
        ]
      },
      {
        "name": "Team",
        "price": 99,
        "period": "month",
        "description": "Strapi Cloud",
        "features": [
          "3 seats",
          "10GB storage",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 499,
        "period": "month",
        "description": "Cloud",
        "features": [
          "5 seats",
          "50GB storage",
          "SSO",
          "Audit logs"
        ]
      }
    ],
    "notes": "Self-hosted is free. Cloud plans for managed hosting."
  },
  "directus": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://directus.io/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited everything",
          "Open source",
          "Community support"
        ]
      },
      {
        "name": "Professional",
        "price": 99,
        "period": "month",
        "description": "Directus Cloud",
        "features": [
          "Standard support",
          "Managed hosting"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 499,
        "period": "month",
        "description": "Cloud",
        "features": [
          "Premium support",
          "SSO",
          "White labeling"
        ]
      }
    ],
    "notes": "100% open source. Self-hosting is fully free."
  },
  "ghost": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://ghost.org/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Unlimited everything",
          "Full control",
          "Open source"
        ]
      },
      {
        "name": "Starter",
        "price": 9,
        "period": "month",
        "description": "Creators",
        "features": [
          "500 members",
          "Newsletters",
          "Memberships"
        ],
        "highlighted": true
      },
      {
        "name": "Creator",
        "price": 25,
        "period": "month",
        "description": "Growing",
        "features": [
          "1K members",
          "Custom integrations",
          "Priority support"
        ]
      },
      {
        "name": "Team",
        "price": 50,
        "period": "month",
        "description": "Teams",
        "features": [
          "5K members",
          "Unlimited staff",
          "Advanced analytics"
        ]
      }
    ],
    "notes": "Ghost(Pro) pricing. Self-hosted is free and open source."
  },
  "airtable": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.airtable.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited bases",
        "features": [
          "1,000 records/base",
          "Basic features",
          "Free viewers"
        ]
      },
      {
        "name": "Team",
        "price": 20,
        "period": "user/month",
        "description": "Annual billing",
        "features": [
          "50,000 records/base",
          "Priority support",
          "Extensions"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 45,
        "period": "user/month",
        "description": "Annual billing",
        "features": [
          "100,000 records/base",
          "Advanced automation",
          "Admin controls"
        ]
      },
      {
        "name": "Enterprise Scale",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "500,000 records/base",
          "Dedicated support",
          "Advanced governance"
        ]
      }
    ]
  },
  "asana": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.asana.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 0,
        "description": "Up to 2 users",
        "features": [
          "Unlimited tasks",
          "Basic features",
          "Mobile apps"
        ]
      },
      {
        "name": "Starter",
        "price": 10.99,
        "period": "user/month",
        "description": "Annual ($13.49 monthly)",
        "features": [
          "Timeline view",
          "Dashboards",
          "Forms"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 24.99,
        "period": "user/month",
        "description": "Annual ($30.49 monthly)",
        "features": [
          "Portfolios",
          "Goals",
          "Resource management"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Advanced security",
          "Custom branding",
          "Priority support"
        ]
      }
    ]
  },
  "teamwork": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.teamwork.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Basic project management",
          "Limited features"
        ]
      },
      {
        "name": "Deliver",
        "price": 10.99,
        "period": "month per user",
        "description": "Annual (save 20%)",
        "features": [
          "Unlimited projects",
          "Time tracking",
          "Milestones"
        ],
        "highlighted": true
      },
      {
        "name": "Grow",
        "price": 19.99,
        "period": "month per user",
        "description": "Annual (save 20%)",
        "features": [
          "Resource scheduling",
          "Retainers",
          "Advanced reports"
        ]
      },
      {
        "name": "Scale",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Enterprise features",
          "Dedicated support"
        ]
      }
    ]
  },
  "jotform": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.jotform.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "5 forms",
          "100 submissions/mo",
          "100MB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Bronze",
        "price": 34,
        "period": "month",
        "description": "Annual",
        "features": [
          "25 forms",
          "1K submissions",
          "10GB storage"
        ]
      }
    ],
    "notes": "Form builder. Generous free tier."
  },
  "tally": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://tally.so/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited",
        "features": [
          "Unlimited forms",
          "Unlimited responses",
          "Most features"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 29,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domains",
          "Remove branding",
          "Team features"
        ]
      }
    ],
    "notes": "Free form builder. Very generous."
  },
  "formstack": {
    "startingPrice": 50,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.formstack.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 50,
        "period": "month",
        "description": "Annual",
        "features": [
          "1 user",
          "20 forms",
          "1K submissions"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 83,
        "period": "month",
        "description": "Annual",
        "features": [
          "5 users",
          "100 forms",
          "10K submissions"
        ]
      }
    ],
    "notes": "Enterprise form builder."
  },
  "surveymonkey": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.surveymonkey.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free",
        "features": [
          "10 questions/survey",
          "100 responses",
          "Basic features"
        ]
      },
      {
        "name": "Individual",
        "price": 35,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited questions",
          "15K responses/year",
          "Export"
        ],
        "highlighted": true
      }
    ],
    "notes": "Survey platform. Free tier limited."
  },
  "vidyard": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.vidyard.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "25 videos",
          "Screen recording",
          "Basic sharing"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 19,
        "period": "month",
        "description": "Individual",
        "features": [
          "Unlimited videos",
          "CTAs",
          "Analytics"
        ]
      }
    ],
    "notes": "Video for sales and marketing."
  },
  "screencastify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.screencastify.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 videos max",
        "features": [
          "30-min recordings",
          "Basic sharing",
          "Privacy controls"
        ]
      },
      {
        "name": "Starter",
        "price": 7,
        "period": "user/month",
        "description": "Annual ($19 monthly)",
        "features": [
          "Unlimited videos",
          "60-min recordings",
          "No watermark"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "user/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "180-min recordings",
          "AI enhancements",
          "Transcripts"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "SSO",
          "LMS integrations",
          "Admin controls"
        ]
      }
    ],
    "notes": "FERPA/COPPA compliant for education"
  },
  "lemlist": {
    "startingPrice": 55,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.lemlist.com/pricing",
    "tiers": [
      {
        "name": "Email Pro",
        "price": 55,
        "period": "month per user",
        "description": "Annual ($69 monthly)",
        "features": [
          "Email outreach",
          "Personalization",
          "Sequences"
        ]
      },
      {
        "name": "Multichannel Expert",
        "price": 79,
        "period": "month per user",
        "description": "Annual ($99 monthly)",
        "features": [
          "Email + LinkedIn",
          "Multi-step campaigns",
          "Advanced analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Min 5 seats",
        "features": [
          "Custom integrations",
          "Dedicated support",
          "Volume discounts"
        ]
      }
    ]
  },
  "apollo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.apollo.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited features",
        "features": [
          "50 credits",
          "5 mobile credits",
          "Email campaigns"
        ]
      },
      {
        "name": "Basic",
        "price": 49,
        "period": "month",
        "description": "Entry level",
        "features": [
          "Contact access",
          "CRM integrations",
          "More credits"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 99,
        "period": "month",
        "description": "Advanced",
        "features": [
          "Sales automation",
          "AI insights",
          "Engagement tracking"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Custom integrations",
          "Security",
          "Governance"
        ]
      }
    ],
    "notes": "Credit-based system. Cancel/upgrade anytime."
  },
  "instantly": {
    "startingPrice": 30,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.instantly.ai/pricing",
    "tiers": [
      {
        "name": "Growth",
        "price": 30,
        "period": "month",
        "description": "Yearly ($37 monthly)",
        "features": [
          "5K emails/mo",
          "1K contacts",
          "Unlimited accounts"
        ],
        "highlighted": true
      },
      {
        "name": "Hypergrowth",
        "price": 77.6,
        "period": "month",
        "description": "Yearly ($97 monthly)",
        "features": [
          "100K emails/mo",
          "25K contacts",
          "Advanced features"
        ]
      },
      {
        "name": "Light Speed",
        "price": 286.3,
        "period": "month",
        "description": "Yearly ($358 monthly)",
        "features": [
          "500K emails/mo",
          "100K contacts",
          "SISR System"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "500K+ emails",
        "features": [
          "Dedicated manager",
          "Custom limits"
        ]
      }
    ],
    "notes": "Unlimited email accounts & warmup on all plans"
  },
  "smartlead": {
    "startingPrice": 32.5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.smartlead.ai/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 32.5,
        "period": "month",
        "description": "Annual ($39 monthly)",
        "features": [
          "2K active leads",
          "6K emails/mo",
          "Unlimited warmup"
        ]
      },
      {
        "name": "Pro",
        "price": 78.3,
        "period": "month",
        "description": "Annual ($94 monthly)",
        "features": [
          "30K active leads",
          "150K emails/mo",
          "ChatGPT4",
          "API"
        ],
        "highlighted": true
      },
      {
        "name": "Custom",
        "price": 174,
        "period": "month",
        "description": "Starting price",
        "features": [
          "12M leads",
          "60M emails",
          "Custom CRM"
        ]
      }
    ],
    "notes": "White-labeling: $29/client/mo"
  },
  "woodpecker": {
    "startingPrice": 24,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.woodpecker.co/pricing/",
    "tiers": [
      {
        "name": "Starter",
        "price": 24,
        "period": "month",
        "description": "Monthly ($35 annual)",
        "features": [
          "500 prospects",
          "6K emails/mo",
          "2 warm-ups"
        ]
      },
      {
        "name": "Growth",
        "price": 126,
        "period": "month",
        "description": "Monthly ($188 annual)",
        "features": [
          "10K+ prospects",
          "120K emails/mo",
          "20 warm-ups"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 903,
        "period": "month",
        "description": "Monthly",
        "features": [
          "1M prospects",
          "1.2M emails/mo",
          "135 warm-ups"
        ]
      },
      {
        "name": "Max",
        "price": 6666,
        "period": "month",
        "description": "Monthly",
        "features": [
          "Unlimited all",
          "Dedicated manager"
        ]
      }
    ],
    "notes": "100 Lead Finder credits free monthly"
  },
  "hunter": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://hunter.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "25 searches",
        "features": [
          "25 searches/mo",
          "50 verifications",
          "Chrome extension"
        ]
      },
      {
        "name": "Starter",
        "price": 49,
        "period": "month",
        "description": "500 searches",
        "features": [
          "500 searches",
          "1K verifications",
          "API access"
        ],
        "highlighted": true
      }
    ],
    "notes": "Find professional email addresses. Free tier."
  },
  "waalaxy": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://waalaxy.com/pricing/",
    "tiers": [
      {
        "name": "Freemium",
        "price": 0,
        "description": "80 invites/mo",
        "features": [
          "LinkedIn automation",
          "Message templates",
          "25 email credits"
        ]
      },
      {
        "name": "Pro",
        "price": 19,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "300 invites/mo",
          "CRM sync",
          "Unlimited campaigns"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 49,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "800 invites/mo",
          "Live chat support"
        ]
      },
      {
        "name": "Business",
        "price": 69,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "500 email credits",
          "Cold email sequences",
          "Multi-sender"
        ]
      }
    ],
    "notes": "50% off yearly. 20% off quarterly."
  },
  "gong": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.gong.io/pricing/",
    "tiers": [
      {
        "name": "Custom",
        "price": "Custom",
        "description": "Per-user pricing",
        "features": [
          "Revenue AI",
          "Call recording",
          "Deal intelligence",
          "Free integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Per-user license + platform fee. Contact for quote."
  },
  "outreach": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.outreach.io/pricing",
    "tiers": [
      {
        "name": "Engage",
        "price": "Custom",
        "description": "Core engagement",
        "features": [
          "Sequences",
          "Automation",
          "CRM sync"
        ]
      },
      {
        "name": "Call",
        "price": "Custom",
        "description": "Usage-based",
        "features": [
          "Integrated dialer",
          "Call monitoring",
          "AI summaries"
        ]
      },
      {
        "name": "Meet",
        "price": "Custom",
        "description": "Conversation intel",
        "features": [
          "Recording",
          "Transcription",
          "AI assist"
        ],
        "highlighted": true
      },
      {
        "name": "Deal",
        "price": "Custom",
        "description": "Deal management",
        "features": [
          "Health scoring",
          "Activity tracking"
        ]
      }
    ],
    "notes": "Per-user licensing. No platform fees."
  },
  "softr": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.softr.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 app",
        "features": [
          "1 app",
          "5 users",
          "Softr branding"
        ]
      },
      {
        "name": "Basic",
        "price": 59,
        "period": "month",
        "description": "Annual",
        "features": [
          "3 apps",
          "Custom domain",
          "No branding"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 139,
        "period": "month",
        "description": "Annual",
        "features": [
          "10 apps",
          "Unlimited users",
          "Memberships"
        ]
      }
    ],
    "notes": "Apps from Airtable. Free tier."
  },
  "glide": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.glideapps.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited apps",
          "Limited rows",
          "Glide branding"
        ]
      },
      {
        "name": "Starter",
        "price": 25,
        "period": "month",
        "description": "Annual",
        "features": [
          "No branding",
          "25K rows",
          "Custom domain"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited rows",
          "Roles",
          "API access"
        ]
      }
    ],
    "notes": "Apps from spreadsheets. Free tier."
  },
  "appsmith": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.appsmith.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited apps",
          "Unlimited users",
          "Self-hosted"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 40,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Cloud hosted",
          "SSO",
          "Audit logs"
        ]
      }
    ],
    "notes": "Open-source internal tool builder."
  },
  "tooljet": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.tooljet.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited apps",
          "Unlimited users",
          "Self-hosted"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 20,
        "period": "user/month",
        "description": "Managed",
        "features": [
          "Managed hosting",
          "Support",
          "Backups"
        ]
      }
    ],
    "notes": "Open-source low-code platform."
  },
  "budibase": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://budibase.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited apps",
          "Unlimited users",
          "Self-hosted"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 50,
        "period": "month",
        "description": "5 users",
        "features": [
          "Cloud hosting",
          "SSO",
          "Custom branding"
        ]
      }
    ],
    "notes": "Open-source internal tools platform."
  },
  "nocodb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://nocodb.com/pricing",
    "tiers": [
      {
        "name": "Free Forever",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited bases",
          "Unlimited records",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 8,
        "period": "user/month",
        "description": "Hosted",
        "features": [
          "Managed hosting",
          "Unlimited workspaces",
          "Support"
        ]
      }
    ],
    "notes": "Open-source Airtable alternative. Self-hosted free."
  },
  "metabase": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.metabase.com/pricing",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Full BI",
          "SQL queries",
          "Dashboards"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 85,
        "period": "month",
        "description": "Self-hosted",
        "features": [
          "SSO",
          "Permissions",
          "Embedding"
        ]
      },
      {
        "name": "Cloud",
        "price": 85,
        "period": "month",
        "description": "Managed",
        "features": [
          "Managed hosting",
          "All Pro features"
        ]
      }
    ],
    "notes": "Open-source BI. Self-hosted free."
  },
  "tableau": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.tableau.com/pricing",
    "tiers": [
      {
        "name": "Viewer",
        "price": 15,
        "period": "user/month",
        "description": "View only",
        "features": [
          "View dashboards",
          "Comments",
          "Subscriptions"
        ]
      },
      {
        "name": "Explorer",
        "price": 42,
        "period": "user/month",
        "description": "Analyze",
        "features": [
          "Create visualizations",
          "Web editing"
        ],
        "highlighted": true
      },
      {
        "name": "Creator",
        "price": 75,
        "period": "user/month",
        "description": "Full",
        "features": [
          "Desktop app",
          "Prep builder",
          "All features"
        ]
      }
    ],
    "notes": "Enterprise BI. Part of Salesforce."
  },
  "weebly": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.weebly.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic use",
        "features": [
          "Free SSL",
          "3rd party embed",
          "Community forum"
        ]
      },
      {
        "name": "Professional",
        "price": 14,
        "period": "month",
        "description": "Annual (€18 monthly)",
        "features": [
          "Custom domain",
          "Advanced stats",
          "Ad removal",
          "Password protection"
        ],
        "highlighted": true
      },
      {
        "name": "Performance",
        "price": 25,
        "period": "month",
        "description": "Annual (€32 monthly)",
        "features": [
          "All Professional",
          "Inventory management",
          "Abandoned cart",
          "Priority phone support"
        ]
      }
    ],
    "notes": "All plans include shopping cart, unlimited items, SEO tools"
  },
  "carrd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://carrd.co",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 sites",
        "features": [
          "3 sites",
          "Carrd subdomain",
          "Basic features"
        ],
        "highlighted": true
      },
      {
        "name": "Pro Lite",
        "price": 9,
        "period": "year",
        "description": "Annual",
        "features": [
          "10 sites",
          "Custom domains",
          "No branding"
        ]
      },
      {
        "name": "Pro Standard",
        "price": 19,
        "period": "year",
        "description": "Annual",
        "features": [
          "25 sites",
          "Forms",
          "Google Analytics"
        ]
      }
    ],
    "notes": "Simple one-page sites. Very affordable."
  },
  "strikingly": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.strikingly.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited sites",
        "features": [
          "500MB storage",
          "5GB bandwidth",
          "Sell 1 product",
          "5% transaction fees"
        ]
      },
      {
        "name": "Pro",
        "price": 16,
        "period": "month",
        "description": "Annual",
        "features": [
          "3 Pro sites",
          "20GB storage",
          "300 products",
          "2% fees",
          "Custom domain"
        ],
        "highlighted": true
      },
      {
        "name": "VIP",
        "price": 49,
        "period": "month",
        "description": "Annual",
        "features": [
          "5 VIP sites",
          "100GB storage",
          "500 products",
          "0% fees",
          "Priority support"
        ]
      }
    ],
    "notes": "Domain add-on: $24.95/year. Custom email: $25/year."
  },
  "ecwid": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.ecwid.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 products",
        "features": [
          "10 products",
          "2 categories",
          "Mobile app"
        ]
      },
      {
        "name": "Venture",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "100 products",
          "Discount coupons",
          "Staff accounts"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 39,
        "period": "month",
        "description": "Annual",
        "features": [
          "2500 products",
          "Product variations",
          "Inventory tracking"
        ]
      }
    ],
    "notes": "Add e-commerce to any website."
  },
  "volusion": {
    "startingPrice": 35,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.volusion.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 35,
        "period": "month",
        "description": "$50K GMV/year",
        "features": [
          "100 products",
          "1 staff",
          "Live chat & email"
        ]
      },
      {
        "name": "Professional",
        "price": 79,
        "period": "month",
        "description": "$100K GMV/year",
        "features": [
          "5000 products",
          "5 staff",
          "Import/export",
          "CRM"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 299,
        "period": "month",
        "description": "$400K GMV/year",
        "features": [
          "Unlimited products",
          "15 staff",
          "API access",
          "Ratings & reviews"
        ]
      },
      {
        "name": "Prime",
        "price": "Custom",
        "description": "Unlimited GMV",
        "features": [
          "Unlimited staff",
          "VIP response",
          "Dedicated CSM"
        ]
      }
    ],
    "notes": "Free hosting, SSL, unlimited bandwidth, PCI compliance"
  },
  "sellfy": {
    "startingPrice": 22,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.sellfy.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 22,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "$10K annual sales",
          "Unlimited products",
          "2K email credits",
          "Custom domain"
        ]
      },
      {
        "name": "Business",
        "price": 59,
        "period": "month",
        "description": "Annual ($79 monthly)",
        "features": [
          "$50K annual sales",
          "Upselling",
          "Cart abandonment",
          "10K email credits",
          "Remove branding"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 119,
        "period": "month",
        "description": "Annual ($159 monthly)",
        "features": [
          "$200K annual sales",
          "Product migration",
          "50K email credits",
          "Priority support"
        ]
      }
    ],
    "notes": "0% transaction fees. Supports digital, physical, subscriptions, print-on-demand."
  },
  "payhip": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://payhip.com/pricing",
    "tiers": [
      {
        "name": "Free Forever",
        "price": 0,
        "period": "5%",
        "description": "Per sale",
        "features": [
          "Unlimited products",
          "Digital & physical",
          "Memberships"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 29,
        "period": "month",
        "description": "2% fee",
        "features": [
          "Lower fees",
          "Custom domain",
          "Priority support"
        ]
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "0% fee",
        "features": [
          "No transaction fees",
          "White-label",
          "API access"
        ]
      }
    ],
    "notes": "Digital products and memberships. Free tier with 5% fee."
  },
  "podia": {
    "startingPrice": 33,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.podia.com/pricing",
    "tiers": [
      {
        "name": "Mover",
        "price": 33,
        "period": "month",
        "description": "Annual ($39 monthly)",
        "features": [
          "Unlimited products",
          "Website",
          "Email marketing",
          "5% transaction fee"
        ]
      },
      {
        "name": "Shaker",
        "price": 75,
        "period": "month",
        "description": "Annual ($89 monthly)",
        "features": [
          "All Mover",
          "0% fee",
          "Affiliates",
          "PayPal"
        ],
        "highlighted": true
      }
    ],
    "notes": "Simple all-in-one creator platform. Email included."
  },
  "hostinger": {
    "startingPrice": 2.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.hostinger.com/web-hosting",
    "tiers": [
      {
        "name": "Single",
        "price": 2.99,
        "period": "month",
        "description": "4 years",
        "features": [
          "1 website",
          "50GB storage",
          "Free domain"
        ]
      },
      {
        "name": "Premium",
        "price": 3.99,
        "period": "month",
        "description": "4 years",
        "features": [
          "100 websites",
          "100GB storage",
          "Weekly backups"
        ],
        "highlighted": true
      }
    ],
    "notes": "Budget hosting. Prices require long commitment."
  },
  "krisp": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://krisp.ai/pricing",
    "tiers": [
      {
        "name": "Free Trial",
        "price": 0,
        "description": "7 days",
        "features": [
          "Unlimited transcription",
          "Noise cancellation",
          "AI notes & actions"
        ]
      },
      {
        "name": "Pro",
        "price": 8,
        "period": "user/month",
        "description": "Annual ($16 monthly)",
        "features": [
          "16+ language transcripts",
          "AI chat",
          "60 min/day accent",
          "5GB storage",
          "Slack/Teams"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 15,
        "period": "user/month",
        "description": "Annual ($30 monthly)",
        "features": [
          "SSO/SCIM",
          "Manager view",
          "Deal view",
          "30GB storage",
          "HubSpot/Salesforce"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Private transcription",
          "SOC2 access",
          "Data center choice",
          "Dedicated manager"
        ]
      }
    ],
    "notes": "Call Center AI from $10/agent/mo. BAA available."
  },
  "gather": {
    "startingPrice": 12,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.gather.town/pricing",
    "tiers": [
      {
        "name": "Essential",
        "price": 12,
        "period": "member/month",
        "description": "Monthly or yearly (-20%)",
        "features": [
          "Custom workspace",
          "Up to 100 members",
          "Unlimited meetings",
          "Host guests (30hr)",
          "Meeting recordings",
          "Transcriptions"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free trial: 50 members, 5hr transcription, 20 guest hours. Member-based billing."
  },
  "mentimeter": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.mentimeter.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "2 question slides",
          "5 quiz slides",
          "50 participants/mo",
          "1 active presentation"
        ]
      },
      {
        "name": "Basic",
        "price": 11.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited questions",
          "Unlimited participants",
          "Export to Excel",
          "Custom colors"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 24.99,
        "period": "presenter/month",
        "description": "Annual",
        "features": [
          "All Basic features",
          "Custom themes",
          "Co-editing",
          "Import presentations",
          "Branding"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "SSO",
          "SCIM",
          "Data retention",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Education plans available at discount."
  },
  "whimsical": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://whimsical.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal projects",
        "features": [
          "3 team boards",
          "100 AI actions",
          "7-day history"
        ]
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "editor/month",
        "description": "Small teams",
        "features": [
          "Unlimited boards",
          "500 AI actions/mo",
          "90-day history"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 15,
        "period": "editor/month",
        "description": "Large teams",
        "features": [
          "1000 AI actions/mo",
          "1-year history",
          "SAML SSO"
        ]
      },
      {
        "name": "Enterprise",
        "price": 20,
        "period": "editor/month",
        "description": "Annual billing",
        "features": [
          "2000 AI actions/mo",
          "Unlimited history",
          "SCIM"
        ]
      }
    ],
    "notes": "Viewer seats are always free"
  },
  "kahoot": {
    "startingPrice": 19,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://kahoot.com/business/pricing",
    "tiers": [
      {
        "name": "Pro Start",
        "price": 19,
        "period": "month",
        "description": "50 participants",
        "features": [
          "Quizzes & polls",
          "AI kahoot creation",
          "Zoom/Teams integration"
        ]
      },
      {
        "name": "Pro Standard",
        "price": 25,
        "period": "month",
        "description": "200 participants",
        "features": [
          "Word clouds",
          "Brainstorms",
          "Q&A",
          "Course reporting"
        ],
        "highlighted": true
      },
      {
        "name": "Pro Plus",
        "price": 39,
        "period": "month",
        "description": "1000 participants",
        "features": [
          "NPS surveys",
          "Courses with certificates",
          "Custom theming",
          "AI images"
        ]
      },
      {
        "name": "Pro Max",
        "price": 59,
        "period": "month",
        "description": "2000 participants",
        "features": [
          "Immersive branding",
          "Commercial use",
          "Learning paths",
          "Full AI access"
        ]
      }
    ],
    "notes": "Annual billing available. Enterprise plans separate."
  },
  "trello": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://trello.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 collaborators",
        "features": [
          "Unlimited cards",
          "Power-Ups",
          "Mobile apps"
        ]
      },
      {
        "name": "Standard",
        "price": 5,
        "period": "user/month",
        "description": "Annual ($6 monthly)",
        "features": [
          "Unlimited boards",
          "Card mirroring",
          "Automations"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 10,
        "period": "user/month",
        "description": "Annual ($12.50 monthly)",
        "features": [
          "AI features",
          "Admin controls",
          "Views"
        ]
      },
      {
        "name": "Enterprise",
        "price": 210,
        "period": "user/year",
        "description": "Minimum, scales down",
        "features": [
          "Enterprise security",
          "Atlassian Guard",
          "24/7 support"
        ]
      }
    ]
  },
  "dropbox": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.dropbox.com/plans",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "2 GB storage",
        "features": [
          "Free forever",
          "Sync across devices",
          "File sharing"
        ]
      },
      {
        "name": "Plus",
        "price": 9.99,
        "period": "month",
        "description": "2 TB storage",
        "features": [
          "1 user",
          "PDF editing",
          "Offline access"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 16.58,
        "period": "month",
        "description": "3 TB storage",
        "features": [
          "1 user",
          "Smart Sync",
          "Watermarking"
        ]
      },
      {
        "name": "Standard",
        "price": 12,
        "period": "user/month",
        "description": "5 TB team",
        "features": [
          "Min 3 users",
          "Admin controls",
          "Team folders"
        ]
      }
    ]
  },
  "1password": {
    "startingPrice": 2.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.1password.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 2.99,
        "period": "month",
        "description": "Annual ($3.99 monthly)",
        "features": [
          "Unlimited passwords",
          "All devices",
          "1 GB storage"
        ]
      },
      {
        "name": "Families",
        "price": 4.49,
        "period": "month",
        "description": "Annual ($5.99 monthly)",
        "features": [
          "5 family members",
          "Shared vaults",
          "Recovery options"
        ],
        "highlighted": true
      },
      {
        "name": "Teams Starter",
        "price": 19.95,
        "period": "month",
        "description": "Up to 10 users",
        "features": [
          "Admin controls",
          "Shared vaults",
          "Security reports"
        ]
      },
      {
        "name": "Business",
        "price": 7.99,
        "period": "user/month",
        "description": "Annual ($9.99 monthly)",
        "features": [
          "Unlimited users",
          "SSO",
          "Advanced controls"
        ]
      }
    ]
  },
  "typeform": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.typeform.com/pricing/",
    "tiers": [
      {
        "name": "Basic",
        "price": 29,
        "period": "month",
        "description": "Getting started",
        "features": [
          "Unlimited typeforms",
          "100 responses/mo",
          "Basic features"
        ]
      },
      {
        "name": "Plus",
        "price": 59,
        "period": "month",
        "description": "More responses",
        "features": [
          "1000 responses/mo",
          "Custom branding",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 99,
        "period": "month",
        "description": "Full power",
        "features": [
          "10000 responses/mo",
          "Advanced analytics",
          "Salesforce integration"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Unlimited responses",
          "SSO",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Growth plans from $199/mo. 16% savings with yearly billing."
  },
  "auth0": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://auth0.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "25K MAU",
        "features": [
          "Any app type",
          "Unlimited social",
          "5 orgs",
          "Basic protection"
        ]
      },
      {
        "name": "Essentials",
        "price": 35,
        "period": "month",
        "description": "500+ MAU",
        "features": [
          "MFA with OTP/Duo",
          "10 orgs",
          "Standard support"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 0.24,
        "period": "user",
        "description": "B2C pricing",
        "features": [
          "Custom database",
          "Enhanced protection",
          "Advanced MFA"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "99.99% SLA",
          "Enterprise rate limits",
          "Private deployment"
        ]
      }
    ],
    "notes": "By Okta. B2B pricing from $0.30/user."
  },
  "amplitude": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://amplitude.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "50K MTUs",
          "10M events",
          "Basic analytics"
        ]
      },
      {
        "name": "Plus",
        "price": 49,
        "period": "month",
        "description": "Annual ($61 monthly)",
        "features": [
          "300K MTUs or 25M events",
          "Unlimited analytics",
          "Templates"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": "Custom",
        "description": "Custom volume",
        "features": [
          "Advanced behavioral analysis",
          "Feature experimentation"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large scale",
        "features": [
          "Cross-product analysis",
          "Account manager"
        ]
      }
    ],
    "notes": "MTU = Monthly Tracked User"
  },
  "customer-io": {
    "startingPrice": 100,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://customer.io/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 100,
        "period": "month",
        "description": "5K profiles",
        "features": [
          "5K profiles",
          "1M emails",
          "Automation"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 1000,
        "period": "month",
        "description": "Starting",
        "features": [
          "More profiles",
          "Premium support",
          "Data warehouse sync"
        ]
      }
    ],
    "notes": "Behavioral email and messaging platform."
  },
  "okta": {
    "startingPrice": 6,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.okta.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "SSO",
          "MFA",
          "Universal Directory",
          "5 Workflows"
        ]
      },
      {
        "name": "Essentials",
        "price": 17,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Adaptive MFA",
          "Privileged Access",
          "Lifecycle Management",
          "50 Workflows"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Device Access",
          "Identity Threat Protection",
          "AI security",
          "Unlimited Workflows"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "API Access Management",
          "Access Gateway",
          "Machine-to-Machine",
          "All features"
        ]
      }
    ],
    "notes": "Customer Identity from $3,000/mo. 99.99% uptime SLA."
  },
  "mongodb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.mongodb.com/pricing",
    "tiers": [
      {
        "name": "Atlas Free",
        "price": 0,
        "description": "512MB",
        "features": [
          "512MB storage",
          "Shared cluster",
          "Basic support"
        ]
      },
      {
        "name": "Serverless",
        "price": 0.1,
        "period": "per million reads",
        "description": "Pay per use",
        "features": [
          "Auto-scaling",
          "Pay for what you use"
        ],
        "highlighted": true
      },
      {
        "name": "Dedicated",
        "price": 57,
        "period": "month",
        "description": "Starting",
        "features": [
          "Dedicated cluster",
          "10GB+",
          "Advanced features"
        ]
      }
    ],
    "notes": "Free tier with 512MB. Serverless for variable workloads."
  },
  "better-uptime": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://betterstack.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Getting started",
        "features": [
          "10 monitors & heartbeats",
          "1 status page",
          "Slack & email alerts",
          "100,000 exceptions/month"
        ]
      },
      {
        "name": "Responder",
        "price": 29,
        "period": "month",
        "description": "Annual billing ($34 monthly)",
        "features": [
          "Unlimited phone/SMS alerts",
          "Uptime monitoring",
          "Incident management"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Custom deployment",
        "features": [
          "SAML SSO",
          "Dedicated deployments",
          "Advanced features"
        ]
      }
    ],
    "notes": "Telemetry bundles: Nano $25/mo, Micro $100/mo, Mega $210/mo, Tera $420/mo"
  },
  "mailchimp": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://mailchimp.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "500 contacts",
        "features": [
          "500 contacts",
          "1000 sends/mo",
          "Basic templates"
        ]
      },
      {
        "name": "Essentials",
        "price": 13,
        "period": "month",
        "description": "Starting",
        "features": [
          "500 contacts",
          "5000 sends",
          "A/B testing"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 20,
        "period": "month",
        "description": "Popular",
        "features": [
          "500 contacts",
          "6000 sends",
          "Automation"
        ]
      }
    ],
    "notes": "Free tier for up to 500 contacts."
  },
  "getresponse": {
    "startingPrice": 13.12,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.getresponse.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 13.12,
        "period": "month",
        "description": "Annual (€16 monthly)",
        "features": [
          "Unlimited emails",
          "AI content (3 uses)",
          "1 automation workflow",
          "3 users"
        ]
      },
      {
        "name": "Marketer",
        "price": 44.28,
        "period": "month",
        "description": "Annual (€54 monthly)",
        "features": [
          "Unlimited automations",
          "Advanced segmentation",
          "Abandoned cart",
          "5 users"
        ],
        "highlighted": true
      },
      {
        "name": "Creator",
        "price": 50.84,
        "period": "month",
        "description": "Annual (€62 monthly)",
        "features": [
          "Website builder (5 sites)",
          "Course creator",
          "Webinars (100 attendees)"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "SMS marketing",
          "Dedicated manager",
          "SSO",
          "Phone support"
        ]
      }
    ]
  },
  "brevo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.brevo.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "300/day",
        "features": [
          "300 emails/day",
          "Unlimited contacts",
          "Email templates"
        ]
      },
      {
        "name": "Starter",
        "price": 25,
        "period": "month",
        "description": "20K/mo",
        "features": [
          "20K emails/mo",
          "No daily limit",
          "Basic reporting"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 65,
        "period": "month",
        "description": "20K/mo",
        "features": [
          "Marketing automation",
          "A/B testing",
          "Landing pages"
        ]
      }
    ],
    "notes": "Formerly Sendinblue. Free tier with 300/day."
  },
  "moosend": {
    "startingPrice": 9,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://moosend.com/pricing/",
    "tiers": [
      {
        "name": "Pro",
        "price": 9,
        "period": "month",
        "description": "500 subscribers",
        "features": [
          "Unlimited emails",
          "Automation",
          "Landing pages",
          "Transactional emails"
        ],
        "highlighted": true
      },
      {
        "name": "Moosend+",
        "price": "Custom",
        "description": "Customizable",
        "features": [
          "Pro + add-ons",
          "Dedicated IPs",
          "Audience discovery"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Advanced needs",
        "features": [
          "Priority support",
          "Deliverability optimization",
          "Custom solutions"
        ]
      }
    ],
    "notes": "Save 15% bi-annual, 20% annual. Email credits: $350 for 350K (never expire)"
  },
  "hubspot": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.hubspot.com/pricing/crm",
    "tiers": [
      {
        "name": "Free Tools",
        "price": 0,
        "description": "Forever free",
        "features": [
          "Contact management",
          "Deal pipeline",
          "Email tracking",
          "Forms"
        ]
      },
      {
        "name": "Starter",
        "price": 15,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "All Free",
          "Email marketing",
          "Landing pages",
          "Live chat"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 90,
        "period": "month",
        "description": "+ seat costs",
        "features": [
          "All Starter",
          "Marketing automation",
          "Custom reporting",
          "Teams"
        ]
      },
      {
        "name": "Enterprise",
        "price": 130,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "All Professional",
          "Custom objects",
          "Predictive lead scoring",
          "SSO"
        ]
      }
    ],
    "notes": "Marketing, Sales, Service, CMS hubs separate. Bundles available."
  },
  "pipedrive": {
    "startingPrice": 14,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.pipedrive.com/pricing",
    "tiers": [
      {
        "name": "Essential",
        "price": 14,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "Lead management",
          "2.5K deals",
          "30 custom fields",
          "15 reports"
        ]
      },
      {
        "name": "Advanced",
        "price": 39,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "Email sync",
          "Automation",
          "5K deals",
          "50 reports"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 59,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "Lead scoring",
          "15K deals",
          "250 reports",
          "3 email accounts"
        ]
      },
      {
        "name": "Power",
        "price": 79,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "All features",
          "20K deals",
          "500 reports",
          "5 email accounts"
        ]
      }
    ],
    "notes": "500+ integrations. AI sales assistant included."
  },
  "insomnia": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://insomnia.rest/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "Unlimited requests",
          "Git sync",
          "Local storage"
        ],
        "highlighted": true
      },
      {
        "name": "Individual",
        "price": 5,
        "period": "month",
        "description": "Annual",
        "features": [
          "E2E encryption",
          "Unlimited storage",
          "Priority support"
        ]
      },
      {
        "name": "Team",
        "price": 8,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Team sync",
          "RBAC",
          "Enterprise SSO"
        ]
      }
    ],
    "notes": "API client. Open source core."
  },
  "jetbrains": {
    "startingPrice": 10.9,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.jetbrains.com/store",
    "tiers": [
      {
        "name": "Individual Tool",
        "price": 10.9,
        "period": "month",
        "description": "Year 1: €109",
        "features": [
          "Single IDE",
          "All updates",
          "Community support"
        ]
      },
      {
        "name": "IntelliJ Ultimate",
        "price": 19.9,
        "period": "month",
        "description": "Year 1: €199",
        "features": [
          "Java/Kotlin IDE",
          "All frameworks",
          "Database tools"
        ],
        "highlighted": true
      },
      {
        "name": "All Products Pack",
        "price": 29.9,
        "period": "month",
        "description": "Year 1: €299",
        "features": [
          "11 IDEs",
          "2 profilers",
          "3 extensions",
          "Best value"
        ]
      }
    ],
    "notes": "20-40% loyalty discounts. Commercial from €255/year."
  },
  "heap": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.heap.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10K sessions/mo",
        "features": [
          "Core analytics",
          "6 months history",
          "SSO"
        ]
      },
      {
        "name": "Growth",
        "price": "Custom",
        "description": "Contact for estimate",
        "features": [
          "Sense AI",
          "Unlimited users",
          "12 months history"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": "Custom",
        "description": "Custom sessions",
        "features": [
          "Account analytics",
          "Session replay add-on",
          "Engagement matrix"
        ]
      },
      {
        "name": "Premier",
        "price": "Custom",
        "description": "Enterprise",
        "features": [
          "Data warehouse",
          "Unlimited projects",
          "Premium support"
        ]
      }
    ]
  },
  "bitwarden": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://bitwarden.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Always free",
        "features": [
          "Unlimited passwords",
          "Unlimited devices",
          "Open source"
        ]
      },
      {
        "name": "Premium",
        "price": 0.83,
        "period": "month",
        "description": "$10/year",
        "features": [
          "2FA authenticator",
          "1 GB storage",
          "Emergency access"
        ],
        "highlighted": true
      },
      {
        "name": "Families",
        "price": 3.33,
        "period": "month",
        "description": "$40/year, 6 users",
        "features": [
          "All Premium features",
          "6 accounts",
          "Unlimited sharing"
        ]
      }
    ],
    "notes": "Zero-knowledge encryption. Business plans available."
  },
  "lastpass": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.lastpass.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 device type",
        "features": [
          "Unlimited passwords",
          "Mobile or desktop",
          "Password generator"
        ]
      },
      {
        "name": "Premium",
        "price": 3,
        "period": "month",
        "description": "Annual",
        "features": [
          "All devices",
          "1GB storage",
          "Priority support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Password manager. Free tier device-limited."
  },
  "dashlane": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.dashlane.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 device",
        "features": [
          "25 passwords",
          "1 device",
          "Form filling"
        ]
      },
      {
        "name": "Premium",
        "price": 4.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited passwords",
          "VPN",
          "Dark web monitoring"
        ],
        "highlighted": true
      }
    ],
    "notes": "Password manager. Free tier limited."
  },
  "digitalocean": {
    "startingPrice": 4,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.digitalocean.com/pricing",
    "tiers": [
      {
        "name": "Droplets",
        "price": 4,
        "period": "month",
        "description": "VPS starting",
        "features": [
          "1 vCPU",
          "512MB RAM",
          "10GB SSD"
        ],
        "highlighted": true
      },
      {
        "name": "App Platform",
        "price": 0,
        "period": "month",
        "description": "Free tier",
        "features": [
          "Static sites",
          "Containers",
          "Auto-scaling"
        ]
      },
      {
        "name": "Managed DB",
        "price": 15,
        "period": "month",
        "description": "Postgres/MySQL",
        "features": [
          "Automated backups",
          "High availability"
        ]
      },
      {
        "name": "Kubernetes",
        "price": 12,
        "period": "month",
        "description": "Per cluster",
        "features": [
          "Managed K8s",
          "Load balancing"
        ]
      }
    ],
    "notes": "GPU Droplets from $1.49/GPU/hr. Object storage from $5/mo."
  },
  "linode": {
    "startingPrice": 5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.linode.com/pricing",
    "tiers": [
      {
        "name": "Nanode",
        "price": 5,
        "period": "month",
        "description": "1GB Shared",
        "features": [
          "1 vCPU",
          "1GB RAM",
          "25GB storage",
          "1TB transfer"
        ],
        "highlighted": true
      },
      {
        "name": "Linode 2GB",
        "price": 12,
        "period": "month",
        "description": "2GB Shared",
        "features": [
          "1 vCPU",
          "2GB RAM",
          "50GB storage"
        ]
      },
      {
        "name": "Dedicated 4GB",
        "price": 36,
        "period": "month",
        "description": "Dedicated",
        "features": [
          "2 CPU cores",
          "4GB RAM",
          "80GB storage"
        ]
      }
    ],
    "notes": "Now part of Akamai. $100 credit for new signups."
  },
  "xero": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.xero.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 29,
        "period": "month",
        "description": "Limited",
        "features": [
          "20 invoices",
          "5 bills",
          "Bank reconciliation",
          "30-day forecast"
        ]
      },
      {
        "name": "Standard",
        "price": 50,
        "period": "month",
        "description": "Most popular",
        "features": [
          "Unlimited invoices",
          "Unlimited bills",
          "Auto-reconcile",
          "Dashboards"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 75,
        "period": "month",
        "description": "Advanced",
        "features": [
          "All Standard",
          "Multi-currency",
          "KPI analysis",
          "180-day forecast"
        ]
      }
    ],
    "notes": "80% off first 3 months. 24/7 support. Add-ons available."
  },
  "expensify": {
    "startingPrice": 5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.expensify.com/pricing",
    "tiers": [
      {
        "name": "Team",
        "price": 5,
        "period": "user/month",
        "description": "Annual ($10 monthly)",
        "features": [
          "Expense approval",
          "Online reimbursement",
          "QuickBooks/Xero sync",
          "Unlimited SmartScans"
        ]
      },
      {
        "name": "Control",
        "price": 9,
        "period": "user/month",
        "description": "Annual ($18 monthly)",
        "features": [
          "All Team",
          "Corporate card reconciliation",
          "Multi-stage approval",
          "NetSuite/Sage sync"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "1000+ users",
        "features": [
          "Custom business logic",
          "Oracle/SAP sync",
          "Full ERP integration",
          "Dedicated coach"
        ]
      }
    ],
    "notes": "Annual commitment for best rates. Free tier available."
  },
  "lattice": {
    "startingPrice": 11,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://lattice.com/pricing",
    "tiers": [
      {
        "name": "Foundations",
        "price": 11,
        "period": "seat/month",
        "description": "Annual ($4K min)",
        "features": [
          "Performance reviews",
          "Goals & OKRs",
          "1:1s",
          "Feedback",
          "AI Agent"
        ],
        "highlighted": true
      },
      {
        "name": "+ Engagement",
        "price": 4,
        "period": "seat/month",
        "description": "Add-on",
        "features": [
          "Pulse surveys",
          "AI insights",
          "eNPS",
          "Onboarding surveys"
        ]
      },
      {
        "name": "+ Grow",
        "price": 4,
        "period": "seat/month",
        "description": "Add-on",
        "features": [
          "Competencies",
          "Career tracks",
          "Development plans"
        ]
      },
      {
        "name": "+ Compensation",
        "price": 6,
        "period": "seat/month",
        "description": "Add-on",
        "features": [
          "Benchmarking",
          "Pay bands",
          "Cycle management",
          "Analytics"
        ]
      }
    ],
    "notes": "$4,000 minimum annual. Modular add-ons."
  },
  "workable": {
    "startingPrice": 299,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.workable.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 299,
        "period": "month",
        "description": "1-20 employees ($249/mo annual)",
        "features": [
          "Core recruiting",
          "HR tools",
          "Job boards",
          "Candidate management"
        ],
        "highlighted": true
      },
      {
        "name": "Premier",
        "price": 599,
        "period": "month",
        "description": "1-20 employees ($499/mo annual)",
        "features": [
          "All Standard",
          "Texting",
          "Video interviews",
          "Assessments",
          "Performance reviews"
        ]
      }
    ],
    "notes": "20% off annual. Scales with company size. Premium add-ons available."
  },
  "lever": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.lever.co/pricing",
    "tiers": [
      {
        "name": "ATS Platform",
        "price": "Custom",
        "description": "Core recruiting",
        "features": [
          "ATS + CRM",
          "AI matching",
          "Reporting",
          "Automation",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "With Onboarding",
        "price": "Custom",
        "description": "Add-on",
        "features": [
          "All ATS",
          "I-9 & E-Verify",
          "Custom workflows",
          "Automation"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All features",
          "AI Interview Companion",
          "Advanced automation"
        ]
      }
    ],
    "notes": "Scales with team size. Contact for quote."
  },
  "greenhouse": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.greenhouse.com/pricing",
    "tiers": [
      {
        "name": "Essential",
        "price": "Custom",
        "description": "Core ATS",
        "features": [
          "CRM Essential",
          "Multi-channel sourcing",
          "GDPR compliance",
          "DE&I nudges",
          "Core reports"
        ]
      },
      {
        "name": "Advanced",
        "price": "Custom",
        "description": "Mid-market",
        "features": [
          "All Essential",
          "10 CRM events",
          "Internal job boards",
          "SSO",
          "Self-scheduling"
        ],
        "highlighted": true
      },
      {
        "name": "Expert",
        "price": "Custom",
        "description": "Enterprise",
        "features": [
          "All Advanced",
          "Unlimited events",
          "Developer sandbox",
          "BI connector",
          "Audit logs"
        ]
      }
    ],
    "notes": "Enterprise ATS. Demo required for pricing."
  },
  "quickbooks": {
    "startingPrice": 30,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://quickbooks.intuit.com/pricing",
    "tiers": [
      {
        "name": "Simple Start",
        "price": 30,
        "period": "month",
        "description": "1 user",
        "features": [
          "Income/expenses",
          "Invoicing",
          "Mileage tracking",
          "Tax deductions"
        ]
      },
      {
        "name": "Essentials",
        "price": 60,
        "period": "month",
        "description": "3 users",
        "features": [
          "All Simple Start",
          "Bill management",
          "Time tracking",
          "Multi-currency"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 90,
        "period": "month",
        "description": "5 users",
        "features": [
          "All Essentials",
          "Inventory",
          "Project profitability",
          "1099 contractors"
        ]
      },
      {
        "name": "Advanced",
        "price": 200,
        "period": "month",
        "description": "25 users",
        "features": [
          "All Plus",
          "Custom reports",
          "Dedicated support",
          "Workflow automation"
        ]
      }
    ],
    "notes": "50% off first 3 months. Payroll add-on available."
  },
  "freshbooks": {
    "startingPrice": 17,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.freshbooks.com/pricing",
    "tiers": [
      {
        "name": "Lite",
        "price": 17,
        "period": "month",
        "description": "5 clients",
        "features": [
          "Unlimited invoices",
          "Expense tracking",
          "Reports",
          "Mobile app"
        ]
      },
      {
        "name": "Plus",
        "price": 30,
        "period": "month",
        "description": "50 clients",
        "features": [
          "All Lite",
          "Proposals",
          "Recurring invoices",
          "Double-entry reports"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 55,
        "period": "month",
        "description": "500 clients",
        "features": [
          "All Plus",
          "Projects",
          "Profitability",
          "Bank reconciliation"
        ]
      },
      {
        "name": "Select",
        "price": "Custom",
        "description": "500+ clients",
        "features": [
          "All Premium",
          "Dedicated manager",
          "Custom training"
        ]
      }
    ],
    "notes": "50% off first 4 months. Team members $11/mo."
  },
  "gusto": {
    "startingPrice": 40,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://gusto.com/product/pricing",
    "tiers": [
      {
        "name": "Simple",
        "price": 40,
        "period": "month",
        "description": "+$6/person",
        "features": [
          "Full-service payroll",
          "Employee self-service",
          "Basic hiring",
          "2-day direct deposit"
        ]
      },
      {
        "name": "Plus",
        "price": 80,
        "period": "month",
        "description": "+$12/person",
        "features": [
          "All Simple",
          "Next-day deposit",
          "Time tracking",
          "PTO policies",
          "Permissions"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Plus",
          "Dedicated support",
          "Compliance alerts",
          "Performance reviews"
        ]
      }
    ],
    "notes": "Contractor-only plan from $35/mo. HR add-ons available."
  },
  "help-scout": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.helpscout.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "5 users max",
          "1 inbox",
          "1 Docs site"
        ]
      },
      {
        "name": "Standard",
        "price": 25,
        "period": "user/month",
        "description": "Growing teams",
        "features": [
          "Unlimited users",
          "Automation",
          "Reporting"
        ]
      },
      {
        "name": "Plus",
        "price": 45,
        "period": "user/month",
        "description": "Popular",
        "features": [
          "Multi-channel",
          "Advanced analytics",
          "Custom fields"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 75,
        "period": "user/month",
        "description": "Enterprise scale",
        "features": [
          "Security controls",
          "Enterprise features",
          "Premium support"
        ]
      }
    ],
    "notes": "AI Answers add-on: $0.75 per resolution"
  },
  "crisp": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://crisp.chat/en/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever free",
        "features": [
          "2 seats",
          "Website chat",
          "Mobile apps"
        ]
      },
      {
        "name": "Mini",
        "price": 45,
        "period": "month/workspace",
        "description": "Early-stage",
        "features": [
          "4 seats",
          "Email inbox",
          "Chat triggers"
        ]
      },
      {
        "name": "Essentials",
        "price": 95,
        "period": "month/workspace",
        "description": "Full-featured",
        "features": [
          "10 seats",
          "AI chatbot",
          "Knowledge base"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 295,
        "period": "month/workspace",
        "description": "Best value",
        "features": [
          "20+ seats",
          "Unlimited AI resolutions",
          "White labeling"
        ]
      }
    ],
    "notes": "Additional agents: $10/month each"
  },
  "tidio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.tidio.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Getting started",
        "features": [
          "50 conversations",
          "10 seats",
          "Basic features"
        ]
      },
      {
        "name": "Starter",
        "price": 24.17,
        "period": "month",
        "description": "Annual ($19.33/mo)",
        "features": [
          "100 conversations",
          "10 seats",
          "Live chat"
        ]
      },
      {
        "name": "Growth",
        "price": 49.17,
        "period": "month",
        "description": "Annual ($39.33/mo)",
        "features": [
          "2000 conversations",
          "10 seats",
          "Analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 749,
        "period": "month",
        "description": "Custom volume",
        "features": [
          "Custom conversations",
          "Custom seats",
          "Premium features"
        ]
      }
    ],
    "notes": "Lyro AI Agent add-on from $32.50/mo"
  },
  "liveagent": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.liveagent.com/pricing",
    "tiers": [
      {
        "name": "Small Business",
        "price": 15,
        "period": "agent/month",
        "description": "Annual ($19 monthly)",
        "features": [
          "Ticketing",
          "Live chat",
          "Knowledge base",
          "AI Assistant"
        ]
      },
      {
        "name": "Medium Business",
        "price": 29,
        "period": "agent/month",
        "description": "Annual ($35 monthly)",
        "features": [
          "All Small",
          "Call center",
          "IVR",
          "Reports",
          "SLAs"
        ],
        "highlighted": true
      },
      {
        "name": "Large Business",
        "price": 49,
        "period": "agent/month",
        "description": "Annual ($59 monthly)",
        "features": [
          "All Medium",
          "SSO",
          "Custom roles",
          "Social channels"
        ]
      },
      {
        "name": "Enterprise",
        "price": 69,
        "period": "agent/month",
        "description": "Annual ($85 monthly)",
        "features": [
          "All Large",
          "Dedicated manager",
          "Priority support",
          "Custom billing"
        ]
      }
    ],
    "notes": "30-day free trial. 175+ features."
  },
  "front": {
    "startingPrice": 25,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://front.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 25,
        "period": "seat/month",
        "description": "Annual (10 seats max)",
        "features": [
          "Single channel",
          "Shared inbox",
          "Basic analytics",
          "Knowledge base"
        ]
      },
      {
        "name": "Professional",
        "price": 65,
        "period": "seat/month",
        "description": "Annual (50 seats max)",
        "features": [
          "Omnichannel",
          "Advanced analytics",
          "20 automation rules"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 105,
        "period": "seat/month",
        "description": "Annual only",
        "features": [
          "Unlimited seats",
          "AI Copilot included",
          "Smart QA/CSAT",
          "Custom roles"
        ]
      }
    ],
    "notes": "AI Autopilot: $0.89/resolution. Add-ons from $10-20/seat/mo."
  },
  "freshdesk": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.freshworks.com/freshdesk/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 2 agents",
        "features": [
          "Email ticketing",
          "Knowledge base",
          "Ticket dispatch",
          "Team collaboration"
        ]
      },
      {
        "name": "Growth",
        "price": 15,
        "period": "agent/month",
        "description": "Annual ($18 monthly)",
        "features": [
          "All Free",
          "Automations",
          "SLAs",
          "Custom fields",
          "Marketplace apps"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 49,
        "period": "agent/month",
        "description": "Annual ($59 monthly)",
        "features": [
          "All Growth",
          "Multiple SLAs",
          "CSAT surveys",
          "Custom reports",
          "Multiple products"
        ]
      },
      {
        "name": "Enterprise",
        "price": 79,
        "period": "agent/month",
        "description": "Annual ($95 monthly)",
        "features": [
          "All Pro",
          "Skill-based routing",
          "Audit logs",
          "IP whitelisting"
        ]
      }
    ],
    "notes": "By Freshworks. Omnichannel add-on available."
  },
  "hubspot-service": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.hubspot.com/pricing/service",
    "tiers": [
      {
        "name": "Free Tools",
        "price": 0,
        "description": "Core features",
        "features": [
          "Ticketing",
          "Live chat",
          "Calling SDK",
          "Basic bots"
        ]
      },
      {
        "name": "Starter",
        "price": 15,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "All Free",
          "Email templates",
          "Canned snippets",
          "Simple automation"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 90,
        "period": "month",
        "description": "1 seat included",
        "features": [
          "Help desk",
          "Knowledge base",
          "Customer portal",
          "SLA"
        ]
      },
      {
        "name": "Enterprise",
        "price": 130,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "All Professional",
          "Playbooks",
          "Custom objects",
          "Goals"
        ]
      }
    ],
    "notes": "CRM Suite bundles available. Onboarding fees for higher tiers."
  },
  "surfer": {
    "startingPrice": 79,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://surferseo.com/pricing",
    "tiers": [
      {
        "name": "Essential",
        "price": 79,
        "period": "month",
        "description": "Annual ($99 monthly)",
        "features": [
          "Content Editor",
          "SERP Analyzer",
          "Keyword Research",
          "AI Writer"
        ]
      },
      {
        "name": "Scale",
        "price": 175,
        "period": "month",
        "description": "Annual ($219 monthly)",
        "features": [
          "All Essential",
          "5x higher limits",
          "Grow Flow",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 999,
        "period": "month",
        "description": "Annual only",
        "features": [
          "All Scale",
          "Custom limits",
          "White-label",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Save up to 23% with annual. AI Tracker add-on from $95/mo."
  },
  "clearscope": {
    "startingPrice": 129,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.clearscope.io/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 129,
        "period": "month",
        "description": "Starter",
        "features": [
          "20 AI Tracked Topics",
          "20 Topic Explorations/mo",
          "20 AI Drafts/mo",
          "50 Content Inventory"
        ]
      },
      {
        "name": "Business",
        "price": 399,
        "period": "month",
        "description": "Growing teams",
        "features": [
          "50 AI Tracked Topics",
          "50 Explorations/mo",
          "300 Content Inventory",
          "Dedicated manager"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Custom credits",
          "SSO",
          "Crawler whitelisting",
          "Custom agreements"
        ]
      }
    ],
    "notes": "Unlimited users and projects on all plans."
  },
  "se-ranking": {
    "startingPrice": 47.2,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.seranking.com/pricing.html",
    "tiers": [
      {
        "name": "Essential",
        "price": 47.2,
        "period": "month",
        "description": "Annual (€59 monthly)",
        "features": [
          "1 seat",
          "5 projects",
          "500 keywords daily",
          "Core SEO tools"
        ]
      },
      {
        "name": "Pro",
        "price": 87.2,
        "period": "month",
        "description": "Annual (€109 monthly)",
        "features": [
          "3 seats",
          "30 projects",
          "2K keywords daily",
          "Advanced tools"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 188,
        "period": "month",
        "description": "Annual (€235 monthly)",
        "features": [
          "5 seats",
          "Unlimited projects",
          "5K keywords daily",
          "Dedicated support"
        ]
      }
    ],
    "notes": "20% off annual. Add-ons: AI Search, Content Marketing, Local Marketing."
  },
  "spyfu": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.spyfu.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 29,
        "period": "month",
        "description": "Annual ($39 monthly)",
        "features": [
          "10K row results",
          "1 site tracking",
          "5K weekly rankings",
          "1 user"
        ]
      },
      {
        "name": "Pro + AI",
        "price": 89,
        "period": "month",
        "description": "Annual ($119 monthly)",
        "features": [
          "Unlimited results",
          "10 site tracking",
          "15K rankings",
          "ChatGPT integration"
        ],
        "highlighted": true
      },
      {
        "name": "Team/Agency",
        "price": 187,
        "period": "month",
        "description": "Annual ($249 monthly)",
        "features": [
          "Unlimited all",
          "50K rankings",
          "White-label",
          "API",
          "5 users"
        ]
      }
    ],
    "notes": "30-day money back guarantee. $30/additional user."
  },
  "similarweb": {
    "startingPrice": 125,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.similarweb.com/corp/pricing",
    "tiers": [
      {
        "name": "Competitive Intel",
        "price": 125,
        "period": "month",
        "description": "Annual ($199 monthly)",
        "features": [
          "1 user",
          "3-month history",
          "Traffic analysis",
          "Top keywords"
        ]
      },
      {
        "name": "Competitive + SEO",
        "price": 335,
        "period": "month",
        "description": "Annual ($399 monthly)",
        "features": [
          "All Competitive",
          "Keyword research",
          "SEO analysis"
        ],
        "highlighted": true
      },
      {
        "name": "Full Suite",
        "price": 540,
        "period": "month",
        "description": "Annual ($649 monthly)",
        "features": [
          "All SEO",
          "6-month history",
          "Ads intelligence"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Full team access",
          "Premium support",
          "Custom integrations"
        ]
      }
    ],
    "notes": "App, Shopper, Sales Intelligence sold separately."
  },
  "buzzsumo": {
    "startingPrice": 199,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.buzzsumo.com/pricing",
    "tiers": [
      {
        "name": "Content Creation",
        "price": 199,
        "period": "month",
        "description": "Annual (save $478/yr)",
        "features": [
          "1 user",
          "Unlimited searches",
          "2 alerts",
          "Content analysis"
        ]
      },
      {
        "name": "PR & Comms",
        "price": 299,
        "period": "month",
        "description": "Annual (save $718/yr)",
        "features": [
          "5 users",
          "5 alerts",
          "Media database",
          "Journalist outreach"
        ],
        "highlighted": true
      },
      {
        "name": "Suite",
        "price": 499,
        "period": "month",
        "description": "Annual (save $1198/yr)",
        "features": [
          "10 users",
          "10 alerts",
          "YouTube analytics",
          "Chrome extension"
        ]
      },
      {
        "name": "Enterprise",
        "price": 999,
        "period": "month",
        "description": "Annual only",
        "features": [
          "30 users",
          "50 alerts",
          "Priority support",
          "Custom training"
        ]
      }
    ],
    "notes": "20% off annual billing."
  },
  "ahrefs": {
    "startingPrice": 129,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://ahrefs.com/pricing",
    "tiers": [
      {
        "name": "Lite",
        "price": 129,
        "period": "month",
        "description": "Annual ($149 monthly)",
        "features": [
          "1 user",
          "5 projects",
          "Site Explorer",
          "Keywords Explorer"
        ]
      },
      {
        "name": "Standard",
        "price": 249,
        "period": "month",
        "description": "Annual ($299 monthly)",
        "features": [
          "1 user",
          "20 projects",
          "Content Explorer",
          "Rank Tracker"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 449,
        "period": "month",
        "description": "Annual ($499 monthly)",
        "features": [
          "3 users",
          "50 projects",
          "Web Explorer",
          "Dashboard folders"
        ]
      },
      {
        "name": "Enterprise",
        "price": 14990,
        "period": "year",
        "description": "Annual only",
        "features": [
          "5 users",
          "100 projects",
          "API access",
          "SSO",
          "Audit log"
        ]
      }
    ],
    "notes": "No free trial. Webmaster Tools free for site owners."
  },
  "semrush": {
    "startingPrice": 139.95,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.semrush.com/prices",
    "tiers": [
      {
        "name": "Pro",
        "price": 139.95,
        "period": "month",
        "description": "Annual ($169.95 monthly)",
        "features": [
          "1 user",
          "5 projects",
          "500 keywords",
          "10K results/report"
        ]
      },
      {
        "name": "Guru",
        "price": 249.95,
        "period": "month",
        "description": "Annual ($299.95 monthly)",
        "features": [
          "1 user",
          "15 projects",
          "1500 keywords",
          "Content Marketing"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 499.95,
        "period": "month",
        "description": "Annual ($549.95 monthly)",
        "features": [
          "1 user",
          "40 projects",
          "5000 keywords",
          "API access",
          "Share of Voice"
        ]
      }
    ],
    "notes": "17% off annual. Additional users $45-100/mo."
  },
  "moz": {
    "startingPrice": 99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://moz.com/products/pro/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 99,
        "period": "month",
        "description": "Annual ($129 monthly)",
        "features": [
          "1 user",
          "1 campaign",
          "50 keyword queries",
          "Link Explorer"
        ]
      },
      {
        "name": "Standard",
        "price": 179,
        "period": "month",
        "description": "Annual ($229 monthly)",
        "features": [
          "1 user",
          "3 campaigns",
          "150 keyword queries",
          "On-page grader"
        ],
        "highlighted": true
      },
      {
        "name": "Medium",
        "price": 299,
        "period": "month",
        "description": "Annual ($389 monthly)",
        "features": [
          "3 users",
          "10 campaigns",
          "300 keyword queries",
          "Content suggestions"
        ]
      },
      {
        "name": "Large",
        "price": 599,
        "period": "month",
        "description": "Annual ($779 monthly)",
        "features": [
          "5 users",
          "25 campaigns",
          "600 keyword queries",
          "Custom reports"
        ]
      }
    ],
    "notes": "Free MozBar Chrome extension. STAT add-on available."
  },
  "docusign": {
    "startingPrice": 10,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.docusign.com/products-and-pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 10,
        "period": "month",
        "description": "5 envelopes/mo",
        "features": [
          "Single user",
          "Basic e-signature",
          "Mobile apps"
        ]
      },
      {
        "name": "Standard",
        "price": 25,
        "period": "user/month",
        "description": "100 envelopes/yr",
        "features": [
          "Up to 50 users",
          "Reminders",
          "Templates"
        ],
        "highlighted": true
      },
      {
        "name": "Business Pro",
        "price": 40,
        "period": "user/month",
        "description": "100 envelopes/yr",
        "features": [
          "Bulk send",
          "Advanced fields",
          "Payment collection"
        ]
      },
      {
        "name": "Enhanced",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Enterprise features",
          "API access",
          "Custom integrations"
        ]
      }
    ]
  },
  "aweber": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.aweber.com/pricing.htm",
    "tiers": [
      {
        "name": "Lite",
        "price": 15,
        "period": "month",
        "description": "500 subscribers",
        "features": [
          "Email marketing",
          "Basic features",
          "Email support"
        ]
      },
      {
        "name": "Lite 1K",
        "price": 25,
        "period": "month",
        "description": "1,000 subscribers",
        "features": [
          "Email marketing",
          "Basic features"
        ]
      },
      {
        "name": "Plus",
        "price": 30,
        "period": "month",
        "description": "500 subscribers",
        "features": [
          "Advanced analytics",
          "Full automation",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Plus 1K",
        "price": 45,
        "period": "month",
        "description": "1,000 subscribers",
        "features": [
          "All Plus features",
          "Scales with list size"
        ]
      }
    ],
    "notes": "Pricing scales with subscriber count. Done For You service: $20/mo + $79 setup"
  },
  "klaviyo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.klaviyo.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "250 contacts",
        "features": [
          "250 contacts",
          "500 emails/mo",
          "Email support"
        ]
      },
      {
        "name": "Email",
        "price": 20,
        "period": "month",
        "description": "251-500",
        "features": [
          "5K emails",
          "All features",
          "Live support"
        ],
        "highlighted": true
      }
    ],
    "notes": "E-commerce email marketing. Free for 250 contacts."
  },
  "sync": {
    "startingPrice": 6,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.sync.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5GB included",
        "features": [
          "End-to-end encryption",
          "File sharing",
          "Cross-platform"
        ]
      },
      {
        "name": "Teams Standard",
        "price": 6,
        "period": "user/month",
        "description": "Annual (3+ users)",
        "features": [
          "1TB/user",
          "180-day recovery",
          "Admin account"
        ],
        "highlighted": true
      },
      {
        "name": "Teams+ Unlimited",
        "price": 15,
        "period": "user/month",
        "description": "Annual (3+ users)",
        "features": [
          "Unlimited storage",
          "365-day recovery",
          "Custom branding",
          "Phone support"
        ]
      },
      {
        "name": "Pro Solo 5TB",
        "price": 28,
        "period": "month",
        "description": "Individual",
        "features": [
          "5TB storage",
          "Unlimited sharing",
          "180-day recovery"
        ]
      }
    ],
    "notes": "30-day money-back. HIPAA/GDPR/PIPEDA compliant."
  },
  "smartsheet": {
    "startingPrice": 129,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://smartsheet.com/pricing",
    "tiers": [
      {
        "name": "Pro",
        "price": 129,
        "period": "member/month",
        "description": "1-10 members",
        "features": [
          "Unlimited sheets",
          "Gantt & calendar views",
          "250 automations/mo"
        ]
      },
      {
        "name": "Business",
        "price": 249,
        "period": "member/month",
        "description": "3+ members, Most popular",
        "features": [
          "Timeline view",
          "Unlimited automations",
          "1 TB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "10+ members",
        "features": [
          "AI formulas",
          "SSO/SAML",
          "Unlimited storage"
        ]
      }
    ]
  },
  "google-workspace": {
    "startingPrice": 6,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://workspace.google.com/pricing.html",
    "tiers": [
      {
        "name": "Business Starter",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "30GB storage/user",
          "Custom email",
          "Meet (100)",
          "Security controls"
        ]
      },
      {
        "name": "Business Standard",
        "price": 12,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "2TB storage/user",
          "Meet (150)",
          "Recording",
          "Shared drives"
        ],
        "highlighted": true
      },
      {
        "name": "Business Plus",
        "price": 18,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "5TB storage/user",
          "Meet (500)",
          "Vault",
          "Advanced security"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Unlimited storage",
          "Meet (1000)",
          "DLP",
          "Data regions"
        ]
      }
    ],
    "notes": "Gmail, Drive, Docs, Meet. Gemini AI included."
  },
  "microsoft-365": {
    "startingPrice": 6,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-products",
    "tiers": [
      {
        "name": "Basic",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Web apps only",
          "1TB OneDrive",
          "Teams",
          "Exchange"
        ]
      },
      {
        "name": "Standard",
        "price": 12.5,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Desktop apps",
          "1TB OneDrive",
          "Webinars",
          "Bookings"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 22,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Standard",
          "Advanced security",
          "Access control",
          "Intune"
        ]
      },
      {
        "name": "Apps for Business",
        "price": 8.25,
        "period": "user/month",
        "description": "Apps only",
        "features": [
          "Desktop apps",
          "1TB OneDrive",
          "No email"
        ]
      }
    ],
    "notes": "Word, Excel, PowerPoint, Teams. Copilot add-on $30/user."
  },
  "box": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.box.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 0,
        "description": "Free",
        "features": [
          "10GB storage",
          "250MB file size",
          "Basic sharing"
        ]
      },
      {
        "name": "Personal Pro",
        "price": 10,
        "period": "month",
        "description": "Annual ($12 monthly)",
        "features": [
          "100GB storage",
          "5GB file size",
          "Advanced sharing"
        ]
      },
      {
        "name": "Business Starter",
        "price": 5,
        "period": "user/month",
        "description": "3+ users",
        "features": [
          "100GB storage",
          "Admin console",
          "2GB file size"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 15,
        "period": "user/month",
        "description": "3+ users",
        "features": [
          "Unlimited storage",
          "5GB file size",
          "Box AI",
          "Integrations"
        ]
      },
      {
        "name": "Business Plus",
        "price": 25,
        "period": "user/month",
        "description": "3+ users",
        "features": [
          "All Business",
          "15GB file size",
          "Metadata",
          "Custom branding"
        ]
      }
    ],
    "notes": "Enterprise and Enterprise Plus for advanced security. Box Sign included."
  },
  "bitrix24": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.bitrix24.com/prices",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited users",
        "features": [
          "5GB storage",
          "Tasks & Projects",
          "CRM",
          "Drive",
          "Chat"
        ]
      },
      {
        "name": "Basic",
        "price": 46,
        "period": "month",
        "description": "5 users (annual)",
        "features": [
          "24GB storage",
          "Contact Center",
          "Website builder",
          "Online store"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 87,
        "period": "month",
        "description": "50 users (annual)",
        "features": [
          "100GB storage",
          "Marketing tools",
          "Documents",
          "Admin features"
        ]
      },
      {
        "name": "Professional",
        "price": 175,
        "period": "month",
        "description": "100 users (annual)",
        "features": [
          "1TB storage",
          "Sales Intelligence",
          "e-Signature",
          "Full automation"
        ]
      }
    ],
    "notes": "25-30% off annual. Enterprise from $499/mo for 250+ users."
  },
  "nifty": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://niftypm.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited members",
        "features": [
          "100MB storage",
          "2 projects",
          "Tasks",
          "Team chat"
        ]
      },
      {
        "name": "Personal",
        "price": 7,
        "period": "member/month",
        "description": "Annual",
        "features": [
          "100GB storage",
          "40 projects",
          "Time tracking",
          "Custom fields"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 16,
        "period": "member/month",
        "description": "Annual",
        "features": [
          "Unlimited storage",
          "Unlimited projects",
          "Automations",
          "Workloads"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Business",
          "SAML SSO",
          "White labeling",
          "IP restriction"
        ]
      }
    ],
    "notes": "Up to 45% off annual. All-in-one PM tool."
  },
  "jira": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.atlassian.com/software/jira/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 users",
        "features": [
          "Unlimited projects",
          "Scrum/Kanban",
          "Basic roadmaps",
          "Community support"
        ]
      },
      {
        "name": "Standard",
        "price": 7.75,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited users",
          "250GB storage",
          "Audit logs",
          "Business hours support"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 13.53,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Standard",
          "Unlimited storage",
          "Advanced roadmaps",
          "24/7 support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Premium",
          "Analytics",
          "SAML SSO",
          "99.95% SLA"
        ]
      }
    ],
    "notes": "Part of Atlassian. Cloud or Data Center options."
  },
  "confluence": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.atlassian.com/software/confluence/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 users",
        "features": [
          "10 users",
          "2GB storage",
          "Basic features"
        ]
      },
      {
        "name": "Standard",
        "price": 5.16,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited users",
          "250GB",
          "Page analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Team wiki. Free for 10 users."
  },
  "apollo-graphql": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.apollographql.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever free",
        "features": [
          "Up to 3 users",
          "1 day data retention",
          "Community support",
          "Schema Registry"
        ]
      },
      {
        "name": "Developer",
        "price": 5,
        "period": "per million requests",
        "description": "$50 credit on signup",
        "features": [
          "Up to 10 users",
          "7 days retention",
          "Developer support (8×5)"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Up to 30 users",
          "90 days retention",
          "SSO & SAML",
          "Standard SLA"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large scale",
        "features": [
          "Unlimited users",
          "18 months retention",
          "24/7 support",
          "Business SLA"
        ]
      }
    ]
  },
  "appcues": {
    "startingPrice": 300,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.appcues.com/pricing",
    "tiers": [
      {
        "name": "Start",
        "price": 300,
        "period": "month",
        "description": "1,000 MAU, annual",
        "features": [
          "5 user licenses",
          "50 published experiences",
          "Email support",
          "Basic integrations"
        ]
      },
      {
        "name": "Grow",
        "price": 750,
        "period": "month",
        "description": "1,000 MAU, annual",
        "features": [
          "15 user licenses",
          "100 published experiences",
          "A/B Testing",
          "Premium integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Custom implementation",
        "features": [
          "Unlimited licenses",
          "150+ experiences",
          "90-day onboarding",
          "Dedicated CSM"
        ]
      }
    ],
    "notes": "Pricing scales with Monthly Active Users (MAU)"
  },
  "pendo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.pendo.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "500 MAUs",
        "features": [
          "Product analytics",
          "In-app guides",
          "Roadmaps",
          "NPS surveys"
        ]
      },
      {
        "name": "Base",
        "price": "Custom",
        "description": "Custom MAUs",
        "features": [
          "All Free",
          "1 integration",
          "Custom volume"
        ],
        "highlighted": true
      },
      {
        "name": "Core",
        "price": "Custom",
        "description": "Most popular",
        "features": [
          "All Base",
          "Session replays"
        ]
      },
      {
        "name": "Ultimate",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Core",
          "NPS",
          "Product discovery",
          "Journey orchestration"
        ]
      }
    ],
    "notes": "Product experience platform. Volume discounts available."
  },
  "segment": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://segment.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K visitors/mo",
        "features": [
          "2 sources",
          "300+ integrations",
          "Basic support"
        ]
      },
      {
        "name": "Team",
        "price": 120,
        "period": "month",
        "description": "10K visitors",
        "features": [
          "Unlimited sources",
          "All integrations",
          "Email support"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Team",
          "SSO",
          "Advanced features",
          "Dedicated support"
        ]
      }
    ],
    "notes": "By Twilio. CDP for customer data."
  },
  "toggl-track": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.toggl.com/track/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 5 users",
        "features": [
          "Time tracking",
          "Basic reports",
          "Mobile apps"
        ]
      },
      {
        "name": "Starter",
        "price": 9,
        "period": "month per user",
        "description": "Save 10% annually",
        "features": [
          "Billable rates",
          "Project templates",
          "Time rounding"
        ]
      },
      {
        "name": "Premium",
        "price": 18,
        "period": "month per user",
        "description": "Best value",
        "features": [
          "Saved reports",
          "Scheduled reports",
          "Labor cost"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Book a demo",
        "features": [
          "SSO",
          "Priority support",
          "Expert training"
        ]
      }
    ]
  },
  "clockify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://clockify.me/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited users",
        "features": [
          "Unlimited tracking",
          "Unlimited projects",
          "Basic reports"
        ]
      },
      {
        "name": "Basic",
        "price": 3.99,
        "period": "month per seat",
        "description": "Annual ($4.99 monthly)",
        "features": [
          "Time audit",
          "Time off tracking",
          "Targets"
        ]
      },
      {
        "name": "Standard",
        "price": 5.49,
        "period": "month per seat",
        "description": "Annual ($6.99 monthly)",
        "features": [
          "GPS tracking",
          "Forecasting",
          "Scheduling"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 7.99,
        "period": "month per seat",
        "description": "Annual ($9.99 monthly)",
        "features": [
          "Labor costs",
          "Budget alerts",
          "Custom fields"
        ]
      },
      {
        "name": "Enterprise",
        "price": 11.99,
        "period": "month per seat",
        "description": "Annual ($14.99 monthly)",
        "features": [
          "SSO",
          "Audit log",
          "Priority support"
        ]
      }
    ]
  },
  "streamyard": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://streamyard.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "1 destination",
          "20-hour limit",
          "StreamYard branding"
        ]
      },
      {
        "name": "Basic",
        "price": 20,
        "period": "month",
        "description": "Monthly",
        "features": [
          "3 destinations",
          "No branding",
          "Recordings"
        ],
        "highlighted": true
      }
    ],
    "notes": "Browser-based live streaming."
  },
  "riverside": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://riverside.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "2hr multi-track",
        "features": [
          "720p video",
          "Basic editing",
          "Watermarked",
          "Unlimited single-track"
        ]
      },
      {
        "name": "Pro",
        "price": 24,
        "period": "month",
        "description": "Annual ($29 monthly)",
        "features": [
          "15hr multi-track",
          "4K video",
          "AI transcription",
          "Magic Clips"
        ],
        "highlighted": true
      },
      {
        "name": "Live",
        "price": 34,
        "period": "month",
        "description": "Annual ($39 monthly)",
        "features": [
          "All Pro",
          "1080p streaming",
          "Multistreaming",
          "Custom RTMP"
        ]
      },
      {
        "name": "Webinar",
        "price": 79,
        "period": "month",
        "description": "Annual ($99 monthly)",
        "features": [
          "All Live",
          "100 registrants",
          "Q&A/Polls",
          "HubSpot integration"
        ]
      }
    ],
    "notes": "SOC2 Type II. Best for podcasts & recordings."
  },
  "otter-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.otter.ai/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free forever",
        "features": [
          "300 mins/month",
          "Zoom/Teams/Meet",
          "AI chat",
          "Speaker ID"
        ]
      },
      {
        "name": "Pro",
        "price": 8.33,
        "period": "user/month",
        "description": "Annual ($16.99 monthly)",
        "features": [
          "1,200 mins",
          "Advanced AI workflows",
          "10 file imports",
          "Team vocabulary"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 19.99,
        "period": "user/month",
        "description": "Annual ($30 monthly)",
        "features": [
          "Unlimited meetings",
          "4hr per meeting",
          "3 concurrent meetings",
          "Custom workflows"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Business",
          "SSO",
          "HIPAA compliance",
          "Dedicated manager"
        ]
      }
    ],
    "notes": "51% off annual on Pro. AI meeting assistant."
  },
  "rev": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://rev.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "45 min AI/month",
        "features": [
          "AI Notetaker",
          "Mobile app",
          "Transcript editor",
          "Human services access"
        ]
      },
      {
        "name": "Basic",
        "price": 9.99,
        "period": "seat/month",
        "description": "Annual ($14.99 monthly)",
        "features": [
          "20hr AI/month",
          "15% off human services",
          "All Free features"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20.99,
        "period": "seat/month",
        "description": "Annual ($34.99 monthly)",
        "features": [
          "100hr AI/month",
          "37 languages",
          "30% off human services",
          "Interactive captions"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Pro",
          "HIPAA/SOC2",
          "SSO",
          "Dedicated account manager"
        ]
      }
    ],
    "notes": "Human transcription services separate. 99% accuracy."
  },
  "descript": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.descript.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 hour transcription",
        "features": [
          "1 watermarked export",
          "Basic editing",
          "Screen recording"
        ]
      },
      {
        "name": "Creator",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "10 hours transcription",
          "Unlimited exports",
          "Stock library"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI-powered video/audio editing."
  },
  "snappa": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://snappa.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free forever",
        "features": [
          "1 user",
          "6K+ templates",
          "5M+ photos",
          "3 downloads/mo"
        ]
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "month",
        "description": "Annual ($15 monthly)",
        "features": [
          "1 user",
          "Unlimited downloads",
          "Buffer integration",
          "Custom fonts",
          "BG removal"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 20,
        "period": "month",
        "description": "Annual ($30 monthly)",
        "features": [
          "5 users",
          "All Pro features",
          "Team collaboration"
        ]
      }
    ],
    "notes": "Simple graphics tool. No credit card for free."
  },
  "figma": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.figma.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "3 Figma files",
          "3 FigJam files",
          "Unlimited viewers"
        ]
      },
      {
        "name": "Professional",
        "price": 15,
        "period": "editor/month",
        "description": "Annual",
        "features": [
          "Unlimited files",
          "Private projects",
          "Dev mode"
        ],
        "highlighted": true
      },
      {
        "name": "Organization",
        "price": 45,
        "period": "editor/month",
        "description": "Annual",
        "features": [
          "Design systems",
          "Branching",
          "SSO"
        ]
      }
    ],
    "notes": "Design and prototyping. Free tier for 3 files."
  },
  "canva": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.canva.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "250K templates",
          "5GB storage",
          "Basic features"
        ]
      },
      {
        "name": "Pro",
        "price": 12.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "All templates",
          "100GB storage",
          "Brand Kit"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": 14.99,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Pro",
          "Team folders",
          "Workflows"
        ]
      }
    ],
    "notes": "Browser-based design. Generous free tier."
  },
  "adobe-creative-cloud": {
    "startingPrice": 22.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.adobe.com/creativecloud/plans.html",
    "tiers": [
      {
        "name": "Single App",
        "price": 22.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "1 app (Photoshop, Illustrator, etc.)",
          "100GB storage",
          "Adobe Fonts",
          "Portfolio"
        ]
      },
      {
        "name": "All Apps",
        "price": 59.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "20+ apps",
          "100GB storage",
          "Adobe Fonts",
          "Behance"
        ],
        "highlighted": true
      },
      {
        "name": "Photography",
        "price": 9.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Photoshop",
          "Lightroom",
          "20GB storage"
        ]
      },
      {
        "name": "Students",
        "price": 19.99,
        "period": "month",
        "description": "All apps",
        "features": [
          "60% off",
          "All 20+ apps",
          "100GB storage"
        ]
      }
    ],
    "notes": "Industry standard creative suite. Firefly AI included."
  },
  "lucidchart": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.lucidchart.com/pages/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 documents",
        "features": [
          "60 shapes/doc",
          "Basic templates",
          "Viewer mode"
        ]
      },
      {
        "name": "Individual",
        "price": 7.95,
        "period": "month",
        "description": "Annual ($9 monthly)",
        "features": [
          "Unlimited documents",
          "1GB storage",
          "Presentation mode"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 9,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Individual",
          "Shared folders",
          "Team features",
          "Admin controls"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Team",
          "SSO/SAML",
          "Advanced admin",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Part of Lucid Visual Collaboration Suite with Lucidspark."
  },
  "wordtune": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 3,
    "pricingPageUrl": "https://www.wordtune.com/plans",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free forever",
        "features": [
          "10 rewrites/day",
          "3 summaries/mo",
          "Spelling & grammar"
        ]
      },
      {
        "name": "Advanced",
        "price": 4.89,
        "period": "month",
        "description": "Annual ($6.99 monthly)",
        "features": [
          "30 rewrites/day",
          "15 summaries/mo",
          "AI recommendations"
        ],
        "highlighted": true
      },
      {
        "name": "Unlimited",
        "price": 6.99,
        "period": "month",
        "description": "Annual ($9.99 monthly)",
        "features": [
          "Unlimited rewrites",
          "Unlimited summaries",
          "Premium support"
        ]
      }
    ],
    "notes": "50% off annual. By AI21 Labs."
  },
  "chatgpt": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://openai.com/chatgpt/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "GPT-4o mini",
        "features": [
          "Limited GPT-4o",
          "Basic features",
          "Web access"
        ]
      },
      {
        "name": "Plus",
        "price": 20,
        "period": "month",
        "description": "GPT-4",
        "features": [
          "Full GPT-4o",
          "DALL-E",
          "Advanced analysis"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 25,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Workspace",
          "Admin console",
          "Data excluded from training"
        ]
      }
    ],
    "notes": "Consumer AI chat. Free tier uses GPT-4o mini."
  },
  "notion-ai": {
    "startingPrice": 10,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.notion.com/product/ai",
    "tiers": [
      {
        "name": "AI Add-on",
        "price": 10,
        "period": "member/month",
        "description": "Added to Notion plan",
        "features": [
          "AI writing",
          "Q&A across workspace",
          "Autofill tables",
          "Summaries"
        ],
        "highlighted": true
      }
    ],
    "notes": "Add-on to any Notion plan. Requires Notion subscription."
  },
  "rytr": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://rytr.me/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10K chars/mo",
        "features": [
          "40+ use cases",
          "30+ languages",
          "20+ tones",
          "Plagiarism checker"
        ]
      },
      {
        "name": "Saver",
        "price": 9,
        "period": "month",
        "description": "100K chars/mo",
        "features": [
          "All Free features",
          "Custom use cases",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Unlimited",
        "price": 29,
        "period": "month",
        "description": "Unlimited chars",
        "features": [
          "All Saver",
          "Dedicated manager",
          "Priority email/chat"
        ]
      }
    ],
    "notes": "2 months free with annual. Budget AI writer."
  },
  "lemon-squeezy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "transaction",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.lemonsqueezy.com/pricing",
    "tiers": [
      {
        "name": "E-commerce",
        "price": "5%",
        "period": "+ $0.50",
        "description": "Per transaction",
        "features": [
          "No monthly fees",
          "Global payments",
          "Sales tax compliance",
          "Fraud protection"
        ],
        "highlighted": true
      },
      {
        "name": "Email 500",
        "price": 0,
        "period": "month",
        "description": "Free up to 500 subs",
        "features": [
          "Email marketing",
          "Basic features"
        ]
      },
      {
        "name": "Email 5K",
        "price": 35,
        "period": "month",
        "description": "Up to 5K subs",
        "features": [
          "All email features",
          "Automation"
        ]
      },
      {
        "name": "Custom",
        "price": "Custom",
        "description": "High volume",
        "features": [
          "Volume discounts",
          "Priority support",
          "White-glove migration"
        ]
      }
    ],
    "notes": "Free to start - no trial, no contract"
  },
  "shopify": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 3,
    "pricingPageUrl": "https://www.shopify.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 29,
        "period": "month",
        "description": "New businesses",
        "features": [
          "10 inventory locations",
          "2% card rates",
          "Basic reports"
        ]
      },
      {
        "name": "Shopify",
        "price": 79,
        "period": "month",
        "description": "Growing",
        "features": [
          "Professional reports",
          "5 staff",
          "Lower rates"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 299,
        "period": "month",
        "description": "Scaling",
        "features": [
          "15 staff",
          "Custom reports",
          "Lowest rates"
        ]
      }
    ],
    "notes": "Plus from $2000/mo. 3-day free trial, then $1/mo for 3 months."
  },
  "squarespace": {
    "startingPrice": 12,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.squarespace.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited pages",
          "Free domain",
          "SSL"
        ]
      },
      {
        "name": "Business",
        "price": 18,
        "period": "month",
        "description": "Annual",
        "features": [
          "E-commerce",
          "Professional email",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Website builder with templates."
  },
  "wix": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.wix.com/upgrade/website",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Wix ads",
        "features": [
          "Wix subdomain",
          "500MB storage",
          "Wix ads"
        ]
      },
      {
        "name": "Combo",
        "price": 16,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domain",
          "2GB storage",
          "No ads"
        ],
        "highlighted": true
      },
      {
        "name": "Unlimited",
        "price": 22,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited bandwidth",
          "10GB storage",
          "Site booster"
        ]
      }
    ],
    "notes": "Free with Wix branding. Paid for custom domain."
  },
  "hootsuite": {
    "startingPrice": 99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://hootsuite.com/plans",
    "tiers": [
      {
        "name": "Professional",
        "price": 99,
        "period": "month",
        "description": "1 user",
        "features": [
          "10 social accounts",
          "Unlimited scheduling",
          "AI captions",
          "7-day mentions"
        ]
      },
      {
        "name": "Team",
        "price": 249,
        "period": "month",
        "description": "3 users",
        "features": [
          "20 social accounts",
          "Approval workflows",
          "Team analytics",
          "30-day mentions"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "5+ users",
        "features": [
          "Unlimited accounts",
          "SSO",
          "Employee Advocacy",
          "Talkwalker listening"
        ]
      }
    ],
    "notes": "10% off annual. Includes AI image generator."
  },
  "socialbee": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.socialbee.com/pricing",
    "tiers": [
      {
        "name": "Bootstrap",
        "price": 29,
        "period": "month",
        "description": "1 workspace",
        "features": [
          "5 social profiles",
          "1 user",
          "500 posts/profile",
          "AI tools"
        ]
      },
      {
        "name": "Accelerate",
        "price": 49,
        "period": "month",
        "description": "1 workspace",
        "features": [
          "10 profiles",
          "1 user",
          "1K posts/profile",
          "RSS feeds"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "5 workspaces",
        "features": [
          "25 profiles",
          "3 users",
          "5K posts/profile",
          "Approval workflows"
        ]
      }
    ],
    "notes": "16% off annual. Content categories for evergreen posting."
  },
  "sendible": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.sendible.com/pricing",
    "tiers": [
      {
        "name": "Creator",
        "price": 29,
        "period": "month",
        "description": "1 user",
        "features": [
          "6 social profiles",
          "Unlimited scheduling",
          "Basic analytics",
          "Content library"
        ]
      },
      {
        "name": "Traction",
        "price": 89,
        "period": "month",
        "description": "4 users",
        "features": [
          "24 profiles",
          "Client dashboards",
          "Custom reports",
          "Bulk scheduling"
        ],
        "highlighted": true
      },
      {
        "name": "White Label",
        "price": 240,
        "period": "month",
        "description": "15 users",
        "features": [
          "84 profiles",
          "White-label reports",
          "Priority support"
        ]
      },
      {
        "name": "White Label+",
        "price": 750,
        "period": "month",
        "description": "100 users",
        "features": [
          "300 profiles",
          "Dedicated manager",
          "SSO"
        ]
      }
    ],
    "notes": "15% off annual. Built for agencies."
  },
  "agorapulse": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.agorapulse.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 social profiles",
        "features": [
          "10 scheduled posts",
          "Basic inbox",
          "1 user"
        ]
      },
      {
        "name": "Standard",
        "price": 49,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "10 profiles",
          "Unlimited scheduling",
          "Unified inbox",
          "Reports"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 79,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Standard",
          "Shared calendars",
          "PowerReports",
          "Team workflow"
        ]
      },
      {
        "name": "Advanced",
        "price": 119,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Professional",
          "Social listening",
          "API access"
        ]
      }
    ],
    "notes": "25% off annual. Free plan available."
  },
  "planoly": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.planoly.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 social set",
        "features": [
          "30 uploads/mo",
          "Instagram/Pinterest",
          "Basic analytics"
        ]
      },
      {
        "name": "Starter",
        "price": 13,
        "period": "month",
        "description": "Annual",
        "features": [
          "60 uploads/mo",
          "Auto-post",
          "Saved captions",
          "Hashtag manager"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 23,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited uploads",
          "2 users",
          "TikTok",
          "Advanced analytics"
        ]
      },
      {
        "name": "Pro",
        "price": 43,
        "period": "month",
        "description": "Annual",
        "features": [
          "All Growth",
          "6 users",
          "Multi-set",
          "Priority support"
        ]
      }
    ],
    "notes": "Best for visual planners. Instagram-focused."
  },
  "tailwind": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.tailwindapp.com/pricing",
    "tiers": [
      {
        "name": "Free Forever",
        "price": 0,
        "description": "1 account each",
        "features": [
          "20 posts/mo",
          "Basic Ghostwriter AI",
          "Smart Schedule"
        ]
      },
      {
        "name": "Pro",
        "price": 19.99,
        "period": "month",
        "description": "Annual ($24.99 monthly)",
        "features": [
          "Unlimited posts",
          "Full Ghostwriter AI",
          "Advanced analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 39.99,
        "period": "month",
        "description": "Annual ($49.99 monthly)",
        "features": [
          "All Pro",
          "2 accounts each",
          "Unlimited designs"
        ]
      },
      {
        "name": "Max",
        "price": 79.99,
        "period": "month",
        "description": "Annual ($99.99 monthly)",
        "features": [
          "All Advanced",
          "3 accounts each",
          "Priority support"
        ]
      }
    ],
    "notes": "Best for Pinterest and Instagram. SmartLoop for evergreen."
  },
  "bardeen": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.bardeen.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 credits/mo",
        "features": [
          "Basic automations",
          "Browser extension",
          "Limited scrapers"
        ]
      },
      {
        "name": "Basic",
        "price": 10,
        "period": "month",
        "description": "100 credits",
        "features": [
          "Build scrapers",
          "Premium scrapers",
          "Enrichment",
          "Teams"
        ]
      },
      {
        "name": "Premium",
        "price": 40,
        "period": "month",
        "description": "Annual ($50 monthly)",
        "features": [
          "1K credits",
          "All Basic",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Annual",
        "features": [
          "Custom credits",
          "Custom scraper building",
          "Premium support"
        ]
      }
    ],
    "notes": "AI-powered browser automation. Credits expire monthly."
  },
  "zapier": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://zapier.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 tasks",
        "features": [
          "100 tasks/mo",
          "5 Zaps",
          "Single-step"
        ]
      },
      {
        "name": "Starter",
        "price": 19.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "750 tasks",
          "20 Zaps",
          "Multi-step"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 49,
        "period": "month",
        "description": "Annual",
        "features": [
          "2K tasks",
          "Unlimited Zaps",
          "Paths"
        ]
      }
    ],
    "notes": "Automation platform. Free tier limited."
  },
  "make": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.make.com/en/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K ops",
        "features": [
          "1K ops/mo",
          "2 scenarios",
          "100MB data"
        ]
      },
      {
        "name": "Core",
        "price": 9,
        "period": "month",
        "description": "Annual",
        "features": [
          "10K ops",
          "Unlimited scenarios",
          "1GB data"
        ],
        "highlighted": true
      }
    ],
    "notes": "Visual automation. Formerly Integromat."
  },
  "coda": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://coda.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "Unlimited docs",
          "Sharing",
          "Templates"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "doc maker/month",
        "description": "Annual",
        "features": [
          "Unlimited editors",
          "Packs",
          "Version history"
        ]
      }
    ],
    "notes": "Docs with app functionality. Free tier."
  },
  "power-bi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 60,
    "pricingPageUrl": "https://powerbi.microsoft.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Desktop",
        "features": [
          "Desktop app",
          "1GB storage",
          "Personal use"
        ]
      },
      {
        "name": "Pro",
        "price": 10,
        "period": "user/month",
        "description": "Sharing",
        "features": [
          "Share reports",
          "Collaborate",
          "10GB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 20,
        "period": "user/month",
        "description": "Scale",
        "features": [
          "100GB storage",
          "AI features",
          "Paginated reports"
        ]
      }
    ],
    "notes": "Microsoft BI. Desktop free."
  },
  "looker": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://cloud.google.com/looker/pricing",
    "tiers": [
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Semantic layer",
          "Data modeling",
          "Embedded analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Enterprise BI from Google. Custom pricing."
  },
  "paypal": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.paypal.com/us/webapps/mpp/merchant-fees",
    "tiers": [
      {
        "name": "Standard",
        "price": 0,
        "description": "2.99% + $0.49/txn",
        "features": [
          "PayPal Checkout",
          "Buy buttons",
          "Invoicing",
          "QR codes"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 0,
        "description": "2.59% + $0.49/txn",
        "features": [
          "Card processing",
          "Advanced Checkout",
          "Fraud protection"
        ]
      },
      {
        "name": "Payouts",
        "price": 0,
        "description": "2% per payout",
        "features": [
          "Mass payments",
          "Global reach",
          "API access"
        ]
      }
    ],
    "notes": "No monthly fees. Rates vary by volume and country."
  },
  "plaid": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://plaid.com/pricing",
    "tiers": [
      {
        "name": "Launch",
        "price": 0,
        "description": "100 live items",
        "features": [
          "Auth",
          "Identity",
          "Balance",
          "Basic support"
        ]
      },
      {
        "name": "Scale",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Launch",
          "Volume pricing",
          "Priority support",
          "SLA"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Scale",
          "Dedicated support",
          "Custom integrations"
        ]
      }
    ],
    "notes": "Per-item pricing after free tier. Bank data API."
  },
  "cloudinary": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://cloudinary.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "25 credits",
        "features": [
          "25 credits/mo",
          "3 users",
          "Basic transformations"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 89,
        "period": "month",
        "description": "225 credits",
        "features": [
          "225 credits",
          "5 users",
          "Advanced features"
        ]
      }
    ],
    "notes": "Media management platform. Free tier."
  },
  "heroku": {
    "startingPrice": 5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.heroku.com/pricing",
    "tiers": [
      {
        "name": "Eco",
        "price": 5,
        "period": "month",
        "description": "0.5GB RAM",
        "features": [
          "Sleeps after 30min",
          "1000 dyno hours",
          "Good for learning"
        ]
      },
      {
        "name": "Basic",
        "price": 7,
        "period": "month",
        "description": "0.5GB RAM",
        "features": [
          "No sleep",
          "Always on",
          "Basic features"
        ],
        "highlighted": true
      },
      {
        "name": "Standard-1X",
        "price": 25,
        "period": "month",
        "description": "0.5GB RAM",
        "features": [
          "Horizontal scaling",
          "Preboot",
          "Metrics"
        ]
      },
      {
        "name": "Performance-M",
        "price": 250,
        "period": "month",
        "description": "2.5GB RAM",
        "features": [
          "Dedicated resources",
          "Auto-scaling",
          "Production-ready"
        ]
      }
    ],
    "notes": "Postgres from $5/mo. Redis from $3/mo. Kafka from $100/mo."
  },
  "fly-io": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://fly.io/docs/about/pricing/",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0,
        "description": "Usage-based",
        "features": [
          "Billed by second",
          "Global deployment",
          "Free tier available"
        ],
        "highlighted": true
      },
      {
        "name": "Reservations",
        "price": 36,
        "period": "year",
        "description": "40% discount",
        "features": [
          "$5/mo credit",
          "Committed usage",
          "Best value"
        ]
      }
    ],
    "notes": "Shared CPU from $2/mo. GPUs: A10 $1.50/hr, A100 $2.50-3.50/hr. Volumes $0.15/GB/mo."
  },
  "planetscale": {
    "startingPrice": 5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://planetscale.com/pricing",
    "tiers": [
      {
        "name": "Single Node",
        "price": 5,
        "period": "month",
        "description": "Non-HA",
        "features": [
          "PostgreSQL",
          "Basic features",
          "Development use"
        ]
      },
      {
        "name": "PS-5 HA",
        "price": 15,
        "period": "month",
        "description": "3-node cluster",
        "features": [
          "1/16 vCPU",
          "512MB memory",
          "High availability"
        ],
        "highlighted": true
      },
      {
        "name": "Scaler Pro",
        "price": "Pay as you go",
        "description": "Up to 12% discount",
        "features": [
          "10GB included",
          "$0.50/GB storage",
          "$0.06/GB egress"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "BYO cloud",
          "Migration help",
          "Slack support"
        ]
      }
    ]
  },
  "redis": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://redis.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "In-memory store",
          "Data structures",
          "Pub/Sub"
        ],
        "highlighted": true
      },
      {
        "name": "Redis Cloud Free",
        "price": 0,
        "description": "30MB",
        "features": [
          "30MB storage",
          "1 DB",
          "Community support"
        ]
      },
      {
        "name": "Redis Cloud",
        "price": 5,
        "period": "month",
        "description": "Starting",
        "features": [
          "100MB+",
          "Multi-AZ",
          "Support"
        ]
      }
    ],
    "notes": "Free self-hosted. Redis Cloud has free tier."
  },
  "kapwing": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.kapwing.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Watermarked",
        "features": [
          "4 min videos",
          "720p quality",
          "10 AI credits/mo"
        ]
      },
      {
        "name": "Pro",
        "price": 16,
        "period": "month",
        "description": "Annual ($24 monthly)",
        "features": [
          "No watermark",
          "4K export",
          "2hr videos",
          "1K AI credits"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 50,
        "period": "month",
        "description": "Annual ($64 monthly)",
        "features": [
          "Voice clones",
          "Lip sync",
          "4K AI credits",
          "6GB uploads"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Custom credits",
          "SSO",
          "Dedicated manager"
        ]
      }
    ],
    "notes": "AI video editor. Browser-based, no download."
  },
  "midjourney": {
    "startingPrice": 10,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://docs.midjourney.com/docs/plans",
    "tiers": [
      {
        "name": "Basic",
        "price": 10,
        "period": "month",
        "description": "Hobby",
        "features": [
          "3.3 hr fast GPU",
          "Commercial license",
          "Solo mode"
        ]
      },
      {
        "name": "Standard",
        "price": 30,
        "period": "month",
        "description": "Popular",
        "features": [
          "15 hr fast GPU",
          "Unlimited relax",
          "Stealth mode"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 60,
        "period": "month",
        "description": "Power users",
        "features": [
          "30 hr fast GPU",
          "12 concurrent jobs",
          "Priority queue"
        ]
      }
    ],
    "notes": "AI image generation. No free tier currently."
  },
  "dall-e": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://openai.com/dall-e-3",
    "tiers": [
      {
        "name": "ChatGPT Plus",
        "price": 20,
        "period": "month",
        "description": "Included",
        "features": [
          "DALL-E 3 access",
          "In ChatGPT",
          "Standard quality"
        ],
        "highlighted": true
      },
      {
        "name": "API",
        "price": 0,
        "description": "Pay-per-image",
        "features": [
          "$0.04/image standard",
          "$0.08/image HD",
          "1024x1024"
        ]
      }
    ],
    "notes": "Best quality AI images. Included in ChatGPT Plus."
  },
  "stable-diffusion": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://stability.ai",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Local generation",
          "SD XL",
          "ControlNet",
          "LoRA"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Run locally or via API."
  },
  "elevenlabs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://elevenlabs.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10K chars/mo",
        "features": [
          "10K characters",
          "3 custom voices",
          "Attribution required"
        ]
      },
      {
        "name": "Starter",
        "price": 5,
        "period": "month",
        "description": "30K chars",
        "features": [
          "30K chars/mo",
          "10 custom voices",
          "Commercial license"
        ],
        "highlighted": true
      },
      {
        "name": "Creator",
        "price": 22,
        "period": "month",
        "description": "100K chars",
        "features": [
          "100K chars/mo",
          "30 voices",
          "Projects"
        ]
      }
    ],
    "notes": "AI voice cloning and TTS. Free tier available."
  },
  "pika": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://pika.art/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "250 credits/mo",
        "features": [
          "Basic generation",
          "Watermark",
          "Standard queue"
        ]
      },
      {
        "name": "Standard",
        "price": 8,
        "period": "month",
        "description": "700 credits/mo",
        "features": [
          "No watermark",
          "1080p export",
          "Faster generation"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 28,
        "period": "month",
        "description": "2000 credits/mo",
        "features": [
          "All Standard",
          "Priority queue",
          "4K export"
        ]
      },
      {
        "name": "Unlimited",
        "price": 58,
        "period": "month",
        "description": "Unlimited",
        "features": [
          "Unlimited generations",
          "Max quality",
          "Priority support"
        ]
      }
    ],
    "notes": "AI video generation platform. Text/image to video."
  },
  "beehiiv": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.beehiiv.com/pricing",
    "tiers": [
      {
        "name": "Launch",
        "price": 0,
        "description": "2.5K subs",
        "features": [
          "2500 subscribers",
          "Unlimited sends",
          "Custom domain"
        ]
      },
      {
        "name": "Grow",
        "price": 49,
        "period": "month",
        "description": "Annual",
        "features": [
          "10K subs",
          "Ad network",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 99,
        "period": "month",
        "description": "Annual",
        "features": [
          "100K subs",
          "Premium support",
          "Remove branding"
        ]
      }
    ],
    "notes": "Newsletter platform. Free for 2.5K subs."
  },
  "substack": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://substack.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10% paid",
        "features": [
          "Free newsletters",
          "Paid subscriptions",
          "10% cut on paid"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free to use. 10% cut on paid subscriptions."
  },
  "memberful": {
    "startingPrice": 49,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.memberful.com/pricing/",
    "tiers": [
      {
        "name": "Standard",
        "price": 49,
        "period": "month",
        "description": "+ 4.9% transaction fee",
        "features": [
          "All features included",
          "Unlimited members",
          "Month-to-month billing",
          "No contracts"
        ],
        "highlighted": true
      }
    ],
    "notes": "4.9% per successful charge + Stripe processing fees. Volume discounts for $1M+ annual revenue"
  },
  "patreon": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "usage",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.patreon.com/pricing",
    "tiers": [
      {
        "name": "Creator",
        "price": "10%",
        "period": "of earnings",
        "description": "Free to start",
        "features": [
          "Pay only when earning",
          "10% of Patreon income",
          "+ payment processing fees",
          "Memberships & products"
        ],
        "highlighted": true
      }
    ],
    "notes": "10% platform fee + payment processing, currency conversion, and payout fees"
  },
  "teachable": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://teachable.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 29,
        "period": "month",
        "description": "Annual ($39 monthly)",
        "features": [
          "1 product",
          "100 students",
          "7.5% fee",
          "AI course creation"
        ]
      },
      {
        "name": "Builder",
        "price": 69,
        "period": "month",
        "description": "Annual ($89 monthly)",
        "features": [
          "5 products",
          "1K students",
          "0% fee"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 139,
        "period": "month",
        "description": "Annual ($189 monthly)",
        "features": [
          "25 products",
          "Unlimited students",
          "Priority support"
        ]
      },
      {
        "name": "Advanced",
        "price": 309,
        "period": "month",
        "description": "Annual ($399 monthly)",
        "features": [
          "100 products",
          "Dedicated manager",
          "Custom branding"
        ]
      }
    ],
    "notes": "22% off annual. Mobile apps included."
  },
  "thinkific": {
    "startingPrice": 36,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.thinkific.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 36,
        "period": "month",
        "description": "Annual (€48 monthly)",
        "features": [
          "Unlimited courses",
          "1 community",
          "5 downloads",
          "Custom domain"
        ]
      },
      {
        "name": "Start",
        "price": 73,
        "period": "month",
        "description": "Annual (€97 monthly)",
        "features": [
          "All Basic",
          "Live events",
          "Certificates",
          "Memberships"
        ],
        "highlighted": true
      },
      {
        "name": "Grow",
        "price": 146,
        "period": "month",
        "description": "Annual (€195 monthly)",
        "features": [
          "All Start",
          "3 communities",
          "White-label",
          "API access"
        ]
      },
      {
        "name": "Plus",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Grow",
          "SCORM",
          "SSO",
          "Dedicated onboarding"
        ]
      }
    ],
    "notes": "0% transaction fees. Course + community platform."
  },
  "kajabi": {
    "startingPrice": 55,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://kajabi.com/pricing",
    "tiers": [
      {
        "name": "Kickstarter",
        "price": 55,
        "period": "month",
        "description": "Annual ($69 monthly)",
        "features": [
          "1 product",
          "1 funnel",
          "1K contacts",
          "10K emails/mo"
        ]
      },
      {
        "name": "Basic",
        "price": 119,
        "period": "month",
        "description": "Annual ($149 monthly)",
        "features": [
          "3 products",
          "3 funnels",
          "10K contacts",
          "Unlimited emails"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 159,
        "period": "month",
        "description": "Annual ($199 monthly)",
        "features": [
          "15 products",
          "15 funnels",
          "25K contacts",
          "Affiliates"
        ]
      },
      {
        "name": "Pro",
        "price": 319,
        "period": "month",
        "description": "Annual ($399 monthly)",
        "features": [
          "100 products",
          "100 funnels",
          "100K contacts",
          "3 websites"
        ]
      }
    ],
    "notes": "All-in-one business platform. 0% transaction fees."
  },
  "circle": {
    "startingPrice": 89,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.circle.so/pricing",
    "tiers": [
      {
        "name": "Professional",
        "price": 89,
        "period": "month",
        "description": "Annual billing",
        "features": [
          "Community platform",
          "Basic features",
          "Standard support"
        ]
      },
      {
        "name": "Business",
        "price": 199,
        "period": "month",
        "description": "Annual billing",
        "features": [
          "Advanced features",
          "Priority support",
          "Custom branding"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 419,
        "period": "month",
        "description": "Annual billing",
        "features": [
          "Enterprise features",
          "Dedicated support",
          "Custom terms"
        ]
      },
      {
        "name": "Plus Branded App",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "White-label mobile app",
          "Full customization"
        ]
      }
    ]
  },
  "udemy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://business.udemy.com/request-demo",
    "tiers": [
      {
        "name": "Free (Instructor)",
        "price": 0,
        "description": "Revenue share",
        "features": [
          "Host courses",
          "37% of sales",
          "Basic analytics"
        ]
      },
      {
        "name": "Team",
        "price": 30,
        "period": "user/month",
        "description": "5-20 users",
        "features": [
          "6K+ courses",
          "Learning paths",
          "Admin dashboard"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "21+ users",
        "features": [
          "All Team",
          "SSO",
          "API",
          "Advanced analytics"
        ]
      }
    ],
    "notes": "Largest course marketplace. Instructors earn 37-97%."
  },
  "skillshare": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.skillshare.com/membership",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited access",
        "features": [
          "Some free classes",
          "Basic features"
        ]
      },
      {
        "name": "Premium",
        "price": 13.99,
        "period": "month",
        "description": "Annual ($168/yr)",
        "features": [
          "Unlimited classes",
          "Offline access",
          "No ads"
        ],
        "highlighted": true
      }
    ],
    "notes": "Creative-focused courses. 30K+ classes."
  },
  "coursera": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.coursera.org/courseraplus",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Audit courses",
        "features": [
          "Free courses",
          "No certificate",
          "Limited access"
        ]
      },
      {
        "name": "Coursera Plus",
        "price": 59,
        "period": "month",
        "description": "Or $399/year",
        "features": [
          "7K+ courses",
          "Unlimited certificates",
          "Guided projects"
        ],
        "highlighted": true
      },
      {
        "name": "For Business",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Plus",
          "Admin portal",
          "SSO",
          "Analytics"
        ]
      }
    ],
    "notes": "University courses & degrees. Top universities."
  },
  "linkedin-learning": {
    "startingPrice": 29.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.linkedin.com/learning/subscription",
    "tiers": [
      {
        "name": "Monthly",
        "price": 29.99,
        "period": "month",
        "description": "Cancel anytime",
        "features": [
          "21K+ courses",
          "Certificates",
          "LinkedIn profile"
        ]
      },
      {
        "name": "Annual",
        "price": 19.99,
        "period": "month",
        "description": "Billed yearly",
        "features": [
          "All Monthly",
          "33% savings"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Admin tools",
          "Insights",
          "Integrations"
        ]
      }
    ],
    "notes": "Professional development. Certificates on LinkedIn."
  },
  "crowdstrike": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.crowdstrike.com/falcon/pricing",
    "tiers": [
      {
        "name": "Falcon Go",
        "price": 59.99,
        "period": "device/year",
        "description": "SMB",
        "features": [
          "Endpoint protection",
          "Cloud security",
          "5 devices min"
        ],
        "highlighted": true
      }
    ],
    "notes": "Enterprise endpoint protection."
  },
  "posthog": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://posthog.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1M events",
        "features": [
          "1M events/mo",
          "Session recordings",
          "Feature flags"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 0,
        "period": "usage",
        "description": "Pay as you go",
        "features": [
          "$0.00031/event",
          "Unlimited",
          "Priority support"
        ]
      }
    ],
    "notes": "Open-source. Very generous free tier."
  },
  "fullstory": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.fullstory.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5K sessions/mo",
        "features": [
          "Session replay",
          "Heatmaps",
          "Basic analytics",
          "14-day history"
        ]
      },
      {
        "name": "Business",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Full analytics",
          "Frustration signals",
          "Journeys",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Business",
          "SSO",
          "Data export",
          "Dedicated support"
        ]
      }
    ],
    "notes": "DXI platform. Session replay + analytics."
  },
  "optimizely": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.optimizely.com/pricing",
    "tiers": [
      {
        "name": "Web Experimentation",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "A/B testing",
          "Visual editor",
          "Targeting",
          "Analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Feature Experimentation",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Feature flags",
          "Progressive rollout",
          "SDKs",
          "Integrations"
        ]
      },
      {
        "name": "Content Platform",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "CMS",
          "DAM",
          "Content marketing",
          "Personalization"
        ]
      }
    ],
    "notes": "Enterprise experimentation. 9 product categories."
  },
  "bamboohr": {
    "startingPrice": 5.25,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.bamboohr.com/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 5.25,
        "period": "employee/month",
        "description": "Core HR",
        "features": [
          "Employee records",
          "Time-off tracking",
          "Reporting",
          "Mobile app"
        ]
      },
      {
        "name": "Advantage",
        "price": 8.75,
        "period": "employee/month",
        "description": "Full HRIS",
        "features": [
          "All Essentials",
          "Onboarding",
          "Performance",
          "eNPS"
        ],
        "highlighted": true
      }
    ],
    "notes": "Base fee + per-employee. Payroll add-on available."
  },
  "15five": {
    "startingPrice": 4,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.15five.com/pricing",
    "tiers": [
      {
        "name": "Engage",
        "price": 4,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Engagement surveys",
          "Action planning",
          "Heat maps",
          "Benchmarking"
        ]
      },
      {
        "name": "Perform",
        "price": 11,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Performance reviews",
          "OKRs",
          "360 feedback",
          "Career paths"
        ],
        "highlighted": true
      },
      {
        "name": "Total Platform",
        "price": 16,
        "period": "user/month",
        "description": "Most popular",
        "features": [
          "Engage + Perform",
          "Manager microlearnings",
          "Full analytics"
        ]
      }
    ],
    "notes": "Kona AI coach $19/manager. Compensation add-on $9/manager."
  },
  "workday": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "year",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.workday.com/products/human-capital-management",
    "tiers": [
      {
        "name": "HCM",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Core HR",
          "Talent management",
          "Workforce planning",
          "Global compliance"
        ],
        "highlighted": true
      },
      {
        "name": "Financial Management",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Accounting",
          "Revenue management",
          "Expenses",
          "Procurement"
        ]
      },
      {
        "name": "Enterprise Platform",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All products",
          "Analytics",
          "Integration",
          "AI/ML"
        ]
      }
    ],
    "notes": "Enterprise HCM. Typically $100+/employee/year."
  },
  "drift": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.salesloft.com/platform/drift",
    "tiers": [
      {
        "name": "Drift Premium",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Live chat",
          "Chatbots",
          "Meeting booking",
          "Basic analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Drift Advanced",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Premium",
          "AI features",
          "ABM targeting",
          "Salesforce sync"
        ]
      },
      {
        "name": "Drift Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Advanced",
          "Custom AI",
          "Multiple workspaces",
          "API access"
        ]
      }
    ],
    "notes": "Now part of Salesloft. B2B conversational platform."
  },
  "bitbucket": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.atlassian.com/software/bitbucket/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "50 build minutes",
          "1GB LFS"
        ]
      },
      {
        "name": "Standard",
        "price": 3,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited users",
          "2500 minutes",
          "5GB LFS"
        ],
        "highlighted": true
      }
    ],
    "notes": "Atlassian code hosting. Free for 5 users."
  },
  "new-relic": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://newrelic.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 GB/mo",
        "features": [
          "1 full user",
          "Unlimited basic users",
          "50+ capabilities"
        ]
      },
      {
        "name": "Standard",
        "price": 10,
        "period": "month",
        "description": "First full user",
        "features": [
          "5 users max",
          "$99/user additional",
          "$0.40/GB data"
        ]
      },
      {
        "name": "Pro",
        "price": 349,
        "period": "user/month",
        "description": "Annual commit",
        "features": [
          "Unlimited users",
          "2-hr critical SLA",
          "Data Plus eligible"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "FedRAMP/HIPAA",
          "1-hr critical SLA",
          "Priority routing"
        ]
      }
    ],
    "notes": "100 GB free monthly. Data Plus: $0.60/GB with extended retention."
  },
  "browserstack": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.browserstack.com/pricing",
    "tiers": [
      {
        "name": "Live",
        "price": 29,
        "period": "month",
        "description": "Manual testing",
        "features": [
          "Real browsers",
          "Real devices",
          "Local testing"
        ],
        "highlighted": true
      },
      {
        "name": "Automate",
        "price": 129,
        "period": "month",
        "description": "Automation",
        "features": [
          "Parallel tests",
          "Screenshots",
          "Integrations"
        ]
      }
    ],
    "notes": "Cross-browser testing platform."
  },
  "lambdatest": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.lambdatest.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "60 mins/mo",
          "Real browsers",
          "Screenshots"
        ]
      },
      {
        "name": "Live",
        "price": 15,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited testing",
          "Real devices",
          "Geolocation"
        ],
        "highlighted": true
      }
    ],
    "notes": "Cross-browser testing. Free tier available."
  },
  "cypress": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.cypress.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited local tests",
          "Time travel",
          "Real-time reloads"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 67,
        "period": "month",
        "description": "3 users",
        "features": [
          "500 test results",
          "Flake detection",
          "Parallelization"
        ]
      },
      {
        "name": "Business",
        "price": 250,
        "period": "month",
        "description": "5 users",
        "features": [
          "2500 results",
          "SSO",
          "Priority support"
        ]
      }
    ],
    "notes": "Open source free. Cloud for test recording."
  },
  "playwright": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://playwright.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Cross-browser",
          "Auto-wait",
          "Tracing",
          "Codegen"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Microsoft."
  },
  "selenium": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.selenium.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Browser automation",
          "WebDriver",
          "Grid",
          "IDE"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Industry standard."
  },
  "jest": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://jestjs.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Zero config",
          "Snapshots",
          "Coverage",
          "Mocking"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Meta."
  },
  "zoho-books": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.zoho.com/books/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 user",
        "features": [
          "Invoices",
          "Expenses",
          "Bank reconciliation",
          "50+ reports"
        ]
      },
      {
        "name": "Standard",
        "price": 10,
        "period": "month",
        "description": "3 users, annual",
        "features": [
          "All Free",
          "Bank feeds",
          "Recurring expenses",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 20,
        "period": "month",
        "description": "5 users, annual",
        "features": [
          "All Standard",
          "Multi-currency",
          "Inventory",
          "Timesheets"
        ]
      },
      {
        "name": "Premium",
        "price": 30,
        "period": "month",
        "description": "10 users, annual",
        "features": [
          "All Professional",
          "Fixed assets",
          "Budgets",
          "Vendor portal"
        ]
      }
    ],
    "notes": "Elite from $100/mo with warehouse management."
  },
  "bill-com": {
    "startingPrice": 45,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.bill.com/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 45,
        "period": "user/month",
        "description": "Manual sync",
        "features": [
          "Bill entry",
          "Approval workflows",
          "ACH/card payments",
          "6 user roles"
        ]
      },
      {
        "name": "Team",
        "price": 55,
        "period": "user/month",
        "description": "Auto sync",
        "features": [
          "All Essentials",
          "QuickBooks/Xero sync",
          "Custom roles",
          "Granular controls"
        ],
        "highlighted": true
      },
      {
        "name": "Corporate",
        "price": 89,
        "period": "user/month",
        "description": "Most popular",
        "features": [
          "All Team",
          "Purchase orders",
          "2-way matching",
          "Custom policies"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Corporate",
          "NetSuite/Dynamics",
          "SSO",
          "Multi-entity"
        ]
      }
    ],
    "notes": "Spend & Expense free. AP/AR automation platform."
  },
  "wave": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.waveapps.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited invoicing",
          "Accounting",
          "Bank connections",
          "Reports"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 16,
        "period": "month",
        "description": "Annual",
        "features": [
          "All Starter",
          "Recurring invoices",
          "Unlimited bank connections",
          "Receipt scanning"
        ]
      }
    ],
    "notes": "Payments 2.9% + $0.60. Payroll add-on available."
  },
  "sage": {
    "startingPrice": 10,
    "currency": "GBP",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.sage.com/en-gb/products/sage-accounting",
    "tiers": [
      {
        "name": "Accounting Start",
        "price": 10,
        "period": "month",
        "description": "Basics",
        "features": [
          "Invoicing",
          "Bank feeds",
          "Quotes",
          "Mobile app"
        ]
      },
      {
        "name": "Accounting",
        "price": 25,
        "period": "month",
        "description": "Standard",
        "features": [
          "All Start",
          "Cash flow insights",
          "Multi-currency",
          "Purchase invoices"
        ],
        "highlighted": true
      },
      {
        "name": "Accounting Plus",
        "price": 35,
        "period": "month",
        "description": "Advanced",
        "features": [
          "All Accounting",
          "Unlimited users",
          "Quotes/estimates",
          "Projects"
        ]
      }
    ],
    "notes": "3 months free with annual. Enterprise Intacct from $400/mo."
  },
  "brex": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.brex.com/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 0,
        "description": "Free",
        "features": [
          "Corporate cards",
          "Expense management",
          "Bill pay",
          "Basic integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 12,
        "period": "user/month",
        "description": "Advanced",
        "features": [
          "All Essentials",
          "Budgets",
          "Custom policies",
          "Premium support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Premium",
          "SSO",
          "API access",
          "Dedicated manager"
        ]
      }
    ],
    "notes": "Startups get up to $350K in credits. No personal guarantee."
  },
  "dropbox-sign": {
    "startingPrice": 10.05,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://sign.dropbox.com/info/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic signing",
        "features": [
          "Document signing",
          "Audit trail",
          "Tamper-proof"
        ]
      },
      {
        "name": "Essentials",
        "price": 10.05,
        "period": "month",
        "description": "Annual ($15 monthly)",
        "features": [
          "Unlimited signing",
          "5 signer fields",
          "Templates",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 17.5,
        "period": "user/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "15 signer fields",
          "Conditional logic",
          "SMS auth",
          "SSO",
          "Salesforce"
        ]
      },
      {
        "name": "Premium",
        "price": "Custom",
        "description": "5+ users",
        "features": [
          "Unlimited features",
          "Data residency",
          "Multi-teams",
          "Premium support"
        ]
      }
    ],
    "notes": "By Dropbox. No hidden fees. Google/HubSpot integrations."
  },
  "pandadoc": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.pandadoc.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "60 docs/year",
        "features": [
          "Unlimited seats",
          "E-signatures",
          "Mobile apps"
        ]
      },
      {
        "name": "Starter",
        "price": 19,
        "period": "seat/month",
        "description": "Annual billing",
        "features": [
          "Unlimited docs",
          "Templates",
          "Analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 49,
        "period": "seat/month",
        "description": "Annual billing",
        "features": [
          "Custom quotes",
          "CRM integrations",
          "Approval workflows"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Per-doc pricing",
          "SSO",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Save up to 46% with annual billing"
  },
  "signnow": {
    "startingPrice": 8,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.signnow.com/pricing",
    "tiers": [
      {
        "name": "Business",
        "price": 8,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited templates",
          "Reusable templates",
          "Mobile app",
          "Basic integrations"
        ]
      },
      {
        "name": "Business Premium",
        "price": 15,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Business",
          "Bulk invite",
          "Conditional fields",
          "Advanced branding"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 30,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Premium",
          "SSO",
          "Advanced security",
          "Custom workflows"
        ]
      },
      {
        "name": "Business Cloud",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "All Enterprise",
          "API access",
          "Dedicated support",
          "SLA"
        ]
      }
    ],
    "notes": "By airSlate. Affordable e-signature solution."
  },
  "adobe-sign": {
    "startingPrice": 12.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.adobe.com/sign/pricing/business.html",
    "tiers": [
      {
        "name": "Acrobat Standard",
        "price": 12.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "PDF editing",
          "Basic e-sign",
          "Mobile app",
          "Cloud storage"
        ]
      },
      {
        "name": "Acrobat Pro",
        "price": 19.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "All Standard",
          "Advanced PDF tools",
          "Redaction",
          "Compare files"
        ],
        "highlighted": true
      },
      {
        "name": "Acrobat Sign Solutions",
        "price": "Custom",
        "description": "Teams",
        "features": [
          "Unlimited signatures",
          "Workflows",
          "API access",
          "Enterprise security"
        ]
      }
    ],
    "notes": "Part of Adobe Document Cloud. Enterprise pricing custom."
  },
  "juro": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://juro.com/pricing",
    "tiers": [
      {
        "name": "Team",
        "price": "Custom",
        "description": "Small teams",
        "features": [
          "Contract creation",
          "eSignature",
          "Templates",
          "Basic analytics"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": "Custom",
        "description": "Growing orgs",
        "features": [
          "All Team",
          "Workflows",
          "Integrations",
          "Advanced analytics"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large orgs",
        "features": [
          "All Scale",
          "SSO",
          "API",
          "Dedicated support",
          "SLA"
        ]
      }
    ],
    "notes": "AI-powered contract management. CLM platform."
  },
  "ironclad": {
    "startingPrice": "Custom",
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://ironcladapp.com/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": "Custom",
        "description": "Small legal teams",
        "features": [
          "Contract lifecycle",
          "Templates",
          "eSignature",
          "Repository"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": "Custom",
        "description": "Growing teams",
        "features": [
          "All Essentials",
          "Workflows",
          "Integrations",
          "Analytics"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Large orgs",
        "features": [
          "All Growth",
          "AI assist",
          "API",
          "SSO",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Enterprise CLM. Used by Fortune 500 companies."
  },
  "clio": {
    "startingPrice": 39,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.clio.com/pricing",
    "tiers": [
      {
        "name": "EasyStart",
        "price": 39,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Time tracking",
          "Billing",
          "Client portal",
          "Mobile app"
        ]
      },
      {
        "name": "Essentials",
        "price": 79,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All EasyStart",
          "Document management",
          "Calendar sync",
          "eSignature"
        ],
        "highlighted": true
      },
      {
        "name": "Advanced",
        "price": 119,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Essentials",
          "Custom fields",
          "Workflows",
          "Advanced billing"
        ]
      },
      {
        "name": "Complete",
        "price": 149,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All Advanced",
          "Clio Grow CRM",
          "Client intake",
          "Automations"
        ]
      }
    ],
    "notes": "Legal practice management. #1 for law firms."
  },
  "gitbook": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.gitbook.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 public space",
          "Basic customization",
          "Community support"
        ]
      },
      {
        "name": "Plus",
        "price": 6.7,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Private spaces",
          "Custom domains",
          "Visitor auth"
        ],
        "highlighted": true
      }
    ],
    "notes": "Documentation platform. Free tier."
  },
  "roam-research": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://roamresearch.com/#/pricing",
    "tiers": [
      {
        "name": "Pro",
        "price": 15,
        "period": "month",
        "description": "Or $165/year",
        "features": [
          "Unlimited notes",
          "Full features",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Believer",
        "price": 500,
        "period": "5 years",
        "description": "One-time",
        "features": [
          "5 years access",
          "Believer badge",
          "Early access"
        ]
      }
    ],
    "notes": "Networked note-taking. No free tier."
  },
  "readwise": {
    "startingPrice": 5.59,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.readwise.io/pricing",
    "tiers": [
      {
        "name": "Lite",
        "price": 5.59,
        "period": "month",
        "description": "Annual ($6.99 monthly)",
        "features": [
          "Daily review",
          "Highlight library",
          "Sync all sources",
          "Tags & notes"
        ]
      },
      {
        "name": "Full",
        "price": 9.99,
        "period": "month",
        "description": "Annual ($12.99 monthly)",
        "features": [
          "All Lite",
          "Export to Notion/Obsidian",
          "Readwise Reader",
          "Beta access"
        ],
        "highlighted": true
      }
    ],
    "notes": "Lifetime price lock. Read-it-later + highlights."
  },
  "mailerlite": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.mailerlite.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K subs",
        "features": [
          "1K subscribers",
          "12K emails/mo",
          "1 user"
        ]
      },
      {
        "name": "Growing Business",
        "price": 10,
        "period": "month",
        "description": "500 subs",
        "features": [
          "Unlimited emails",
          "3 users",
          "Auto-resend"
        ],
        "highlighted": true
      }
    ],
    "notes": "Email marketing. Free for 1K subscribers."
  },
  "omnisend": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.omnisend.com/pricing/",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 250 contacts",
        "features": [
          "500 emails/month",
          "$1 SMS credits",
          "500 push notifications"
        ]
      },
      {
        "name": "Standard",
        "price": 16,
        "period": "month",
        "description": "Up to 500 contacts",
        "features": [
          "6,000 emails/month",
          "Unlimited push",
          "24/7 support"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 59,
        "period": "month",
        "description": "Up to 2,500 contacts",
        "features": [
          "Unlimited emails",
          "Bonus SMS credits",
          "Personalized content"
        ]
      }
    ],
    "notes": "Pricing scales with contact list size"
  },
  "flodesk": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.flodesk.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic features",
        "features": [
          "Forms & landing pages",
          "Audience segmentation",
          "Email sending"
        ]
      },
      {
        "name": "Lite",
        "price": 25,
        "period": "month",
        "description": "Up to 1K subs ($25)",
        "features": [
          "Unlimited emails",
          "Email analytics",
          "Max 25K subscribers"
        ]
      },
      {
        "name": "Pro",
        "price": 28,
        "period": "month",
        "description": "Up to 1K subs",
        "features": [
          "Unlimited workflows",
          "Advanced analytics",
          "Up to 255K subs"
        ],
        "highlighted": true
      },
      {
        "name": "Everything",
        "price": 54,
        "period": "month",
        "description": "Email + E-commerce",
        "features": [
          "Unlimited checkouts",
          "Sales pages",
          "Subscriptions",
          "Payment processing"
        ]
      }
    ],
    "notes": "Annual billing gets 1 month free. Pricing scales with subscribers."
  },
  "buttondown": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://buttondown.email/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 subs",
        "features": [
          "100 subscribers",
          "Unlimited emails",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 9,
        "period": "month",
        "description": "1K subs",
        "features": [
          "1K subscribers",
          "Custom domain",
          "No branding"
        ]
      },
      {
        "name": "Standard",
        "price": 29,
        "period": "month",
        "description": "5K subs",
        "features": [
          "5K subscribers",
          "Analytics",
          "Automations"
        ]
      }
    ],
    "notes": "Simple newsletter tool. Free for 100 subs."
  },
  "loops": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://loops.so/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K contacts",
        "features": [
          "1K contacts",
          "3K sends/mo",
          "Basic features"
        ]
      },
      {
        "name": "Starter",
        "price": 25,
        "period": "month",
        "description": "5K contacts",
        "features": [
          "5K contacts",
          "15K sends",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 49,
        "period": "month",
        "description": "10K contacts",
        "features": [
          "10K contacts",
          "Unlimited sends",
          "Team features"
        ]
      }
    ],
    "notes": "Email for SaaS. Free tier available."
  },
  "resend": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://resend.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3K/mo",
        "features": [
          "3000 emails/mo",
          "100 emails/day",
          "1 domain"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "50K/mo",
        "features": [
          "50K emails",
          "Unlimited domains",
          "API"
        ]
      }
    ],
    "notes": "Developer-first email API. React Email."
  },
  "vs-code": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://code.visualstudio.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Full IDE",
          "Extensions",
          "Git integration",
          "Debugging"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Microsoft."
  },
  "intellij-idea": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.jetbrains.com/idea/buy",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Java/Kotlin",
          "Maven/Gradle",
          "Version control",
          "Basic debugging"
        ]
      },
      {
        "name": "Ultimate",
        "price": 599,
        "period": "year",
        "description": "First year",
        "features": [
          "All frameworks",
          "Database tools",
          "Profiler",
          "All JetBrains tools"
        ],
        "highlighted": true
      }
    ],
    "notes": "Ultimate from $149/year after 3 years."
  },
  "pycharm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.jetbrains.com/pycharm/buy",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Python",
          "Basic IDE",
          "Git",
          "Testing"
        ]
      },
      {
        "name": "Professional",
        "price": 249,
        "period": "year",
        "description": "First year",
        "features": [
          "Web frameworks",
          "Database",
          "Scientific tools",
          "Remote dev"
        ],
        "highlighted": true
      }
    ],
    "notes": "Professional from $59/year after 3 years."
  },
  "webstorm": {
    "startingPrice": 169,
    "currency": "USD",
    "billingPeriod": "year",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.jetbrains.com/webstorm/buy",
    "tiers": [
      {
        "name": "WebStorm",
        "price": 169,
        "period": "year",
        "description": "First year",
        "features": [
          "JavaScript/TypeScript",
          "React/Vue/Angular",
          "Testing",
          "Git"
        ],
        "highlighted": true
      }
    ],
    "notes": "From $39/year after 3 years."
  },
  "goland": {
    "startingPrice": 249,
    "currency": "USD",
    "billingPeriod": "year",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.jetbrains.com/go/buy",
    "tiers": [
      {
        "name": "GoLand",
        "price": 249,
        "period": "year",
        "description": "First year",
        "features": [
          "Go development",
          "Debugging",
          "Testing",
          "Database"
        ],
        "highlighted": true
      }
    ],
    "notes": "From $59/year after 3 years."
  },
  "sublime-text": {
    "startingPrice": 99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.sublimetext.com/buy",
    "tiers": [
      {
        "name": "License",
        "price": 99,
        "period": "once",
        "description": "Perpetual",
        "features": [
          "All features",
          "All platforms",
          "Free updates for 3 years"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free to evaluate. One-time purchase."
  },
  "neovim": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://neovim.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Modal editing",
          "Lua scripting",
          "LSP support",
          "Extensible"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Fork of Vim."
  },
  "vim": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.vim.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Modal editing",
          "Customizable",
          "Lightweight",
          "Terminal-based"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Classic text editor."
  },
  "zed": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://zed.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "High performance",
          "Collaboration",
          "AI assistant",
          "GPU rendering"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Built in Rust."
  },
  "android-studio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://developer.android.com/studio",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free",
        "features": [
          "Android development",
          "Emulator",
          "Debugging",
          "Layout editor"
        ],
        "highlighted": true
      }
    ],
    "notes": "Official IDE for Android. Free from Google."
  },
  "xcode": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://developer.apple.com/xcode",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free",
        "features": [
          "iOS/macOS dev",
          "Swift/Obj-C",
          "Simulator",
          "Instruments"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free from Apple. Requires Mac."
  },
  "eclipse": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.eclipse.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Java/C++/PHP",
          "Extensible",
          "Debugging",
          "Git"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Eclipse Foundation."
  },
  "notepad-plus-plus": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://notepad-plus-plus.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Syntax highlighting",
          "Multi-tab",
          "Plugins",
          "Windows only"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Windows text editor."
  },
  "nova": {
    "startingPrice": 99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://nova.app",
    "tiers": [
      {
        "name": "Nova",
        "price": 99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Mac-native",
          "Extensions",
          "Git",
          "Terminal"
        ],
        "highlighted": true
      }
    ],
    "notes": "One-time purchase. Mac only. By Panic."
  },
  "lapce": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://lapce.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Rust-based",
          "Fast",
          "Modal editing",
          "LSP"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Fast editor in Rust."
  },
  "git": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://git-scm.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Distributed VCS",
          "Branching",
          "Merging",
          "All platforms"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Industry standard."
  },
  "gitkraken": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.gitkraken.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Public repos",
        "features": [
          "Git GUI",
          "Visual commits",
          "Merge conflict editor"
        ]
      },
      {
        "name": "Pro",
        "price": 4.95,
        "period": "month",
        "description": "Annual",
        "features": [
          "All Free",
          "Private repos",
          "Multiple profiles"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": 8.95,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "All Pro",
          "Team features",
          "Priority support"
        ]
      }
    ],
    "notes": "Git GUI client. Free for public repos."
  },
  "sourcetree": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.sourcetreeapp.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free",
        "features": [
          "Git/Mercurial GUI",
          "Visual branches",
          "Mac/Windows"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free from Atlassian."
  },
  "github-desktop": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://desktop.github.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "GitHub integration",
          "Visual commits",
          "Branch management"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from GitHub."
  },
  "fork-git": {
    "startingPrice": 49.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://git-fork.com",
    "tiers": [
      {
        "name": "License",
        "price": 49.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Git GUI",
          "Interactive rebase",
          "Merge conflicts",
          "Mac/Windows"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free to evaluate. One-time purchase."
  },
  "tower": {
    "startingPrice": 69,
    "currency": "USD",
    "billingPeriod": "year",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.git-tower.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 69,
        "period": "year",
        "description": "1 device",
        "features": [
          "Git GUI",
          "Drag & drop",
          "Undo feature"
        ]
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "year",
        "description": "3 devices",
        "features": [
          "All Basic",
          "Team features",
          "Priority support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Professional Git client."
  },
  "lazygit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/jesseduffield/lazygit",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Terminal UI",
          "Keyboard shortcuts",
          "Interactive rebase"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Terminal-based."
  },
  "sanity": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.sanity.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "For individuals",
        "features": [
          "3 users",
          "10K API requests/mo",
          "10GB bandwidth"
        ]
      },
      {
        "name": "Team",
        "price": 15,
        "period": "user/month",
        "description": "Min 5 users",
        "features": [
          "100K API requests",
          "100GB bandwidth",
          "Custom domain"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 99,
        "period": "user/month",
        "description": "Enterprise",
        "features": [
          "Unlimited API",
          "SSO",
          "SLA",
          "Dedicated support"
        ]
      }
    ],
    "notes": "Pay-as-you-grow pricing with generous free tier."
  },
  "storyblok": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.storyblok.com/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free forever",
        "features": [
          "1 user",
          "1 space",
          "Visual editor"
        ]
      },
      {
        "name": "Entry",
        "price": 99,
        "period": "month",
        "description": "Small teams",
        "features": [
          "5 users",
          "Custom domain",
          "Priority support"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 449,
        "period": "month",
        "description": "Growing teams",
        "features": [
          "10 users",
          "Advanced permissions",
          "Workflows"
        ]
      }
    ],
    "notes": "Visual editing is available on all tiers."
  },
  "prismic": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://prismic.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 user",
          "100 documents",
          "Slice Machine"
        ]
      },
      {
        "name": "Starter",
        "price": 7,
        "period": "month",
        "description": "Small sites",
        "features": [
          "3 users",
          "Custom types",
          "Scheduling"
        ],
        "highlighted": true
      },
      {
        "name": "Medium",
        "price": 100,
        "period": "month",
        "description": "Teams",
        "features": [
          "Unlimited users",
          "1K documents",
          "Priority support"
        ]
      }
    ],
    "notes": "Per-repo pricing. Slice Machine included free."
  },
  "payload": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://payloadcms.com/cloud-pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited everything",
          "TypeScript",
          "Full control"
        ]
      },
      {
        "name": "Standard",
        "price": 35,
        "period": "month",
        "description": "Payload Cloud",
        "features": [
          "1 project",
          "50GB storage",
          "Email support"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 199,
        "period": "month",
        "description": "Teams",
        "features": [
          "5 projects",
          "500GB storage",
          "Priority support"
        ]
      }
    ],
    "notes": "Open source. Cloud is optional managed hosting."
  },
  "keystonejs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://keystonejs.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "GraphQL API",
          "Admin UI",
          "TypeScript",
          "Fully extensible"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted only."
  },
  "hygraph": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://hygraph.com/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "3 users",
          "1M API calls",
          "5 environments"
        ]
      },
      {
        "name": "Self-service",
        "price": 299,
        "period": "month",
        "description": "Teams",
        "features": [
          "5 users",
          "10M API calls",
          "Custom roles"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited",
          "SSO",
          "SLA",
          "Dedicated support"
        ]
      }
    ],
    "notes": "GraphQL-native CMS. Formerly GraphCMS."
  },
  "datocms": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.datocms.com/pricing",
    "tiers": [
      {
        "name": "Developer",
        "price": 0,
        "description": "Free",
        "features": [
          "1 project",
          "100 records",
          "10K API calls/mo"
        ]
      },
      {
        "name": "Professional",
        "price": 199,
        "period": "month",
        "description": "Teams",
        "features": [
          "Unlimited records",
          "2M API calls",
          "Collaboration"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Custom limits",
          "SSO",
          "Premium support"
        ]
      }
    ],
    "notes": "Strong image processing and CDN included."
  },
  "tinacms": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://tina.io/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "2 users",
          "Git-backed",
          "Visual editing"
        ]
      },
      {
        "name": "Team",
        "price": 29,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Unlimited projects",
          "Editorial workflow",
          "Support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Git-backed CMS. Free for small projects."
  },
  "builder-io": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.builder.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 user",
          "Basic components",
          "Community support"
        ]
      },
      {
        "name": "Team",
        "price": 99,
        "period": "month",
        "description": "Teams",
        "features": [
          "3 users",
          "Advanced components",
          "Custom code"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited users",
          "SSO",
          "SLA"
        ]
      }
    ],
    "notes": "Visual headless CMS and page builder."
  },
  "webflow-cms": {
    "startingPrice": 23,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://webflow.com/pricing",
    "tiers": [
      {
        "name": "CMS",
        "price": 23,
        "period": "month",
        "description": "Billed yearly",
        "features": [
          "2K items",
          "Dynamic pages",
          "CMS API"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 39,
        "period": "month",
        "description": "Billed yearly",
        "features": [
          "10K items",
          "Form submissions",
          "Site search"
        ]
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited",
          "SSO",
          "Priority support"
        ]
      }
    ],
    "notes": "CMS plan includes hosting and designer."
  },
  "docusaurus": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://docusaurus.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Static site",
          "MDX support",
          "Versioning",
          "Search"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Meta."
  },
  "nextra": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://nextra.site",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Next.js based",
          "MDX support",
          "Full-text search",
          "Dark mode"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source documentation generator."
  },
  "vuepress": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://vuepress.vuejs.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Vue-powered",
          "Markdown",
          "Plugins",
          "Themes"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Vue.js team."
  },
  "readme": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://readme.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "1 project",
          "Basic features",
          "Community support"
        ]
      },
      {
        "name": "Startup",
        "price": 99,
        "period": "month",
        "description": "Annual",
        "features": [
          "3 projects",
          "Custom domains",
          "Basic analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "API documentation platform."
  },
  "mintlify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://mintlify.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "1 user",
          "Public docs",
          "Basic analytics"
        ]
      },
      {
        "name": "Startup",
        "price": 120,
        "period": "month",
        "description": "Starting",
        "features": [
          "5 users",
          "Custom domains",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Modern documentation platform."
  },
  "hetzner": {
    "startingPrice": 4.51,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.hetzner.com/cloud",
    "tiers": [
      {
        "name": "CX22",
        "price": 4.51,
        "period": "month",
        "description": "2 vCPU, 4GB",
        "features": [
          "2 vCPU",
          "4GB RAM",
          "40GB SSD",
          "20TB traffic"
        ],
        "highlighted": true
      },
      {
        "name": "CX32",
        "price": 8.39,
        "period": "month",
        "description": "4 vCPU, 8GB",
        "features": [
          "4 vCPU",
          "8GB RAM",
          "80GB SSD",
          "20TB traffic"
        ]
      },
      {
        "name": "Dedicated",
        "price": 39,
        "period": "month",
        "description": "Starting",
        "features": [
          "Intel/AMD CPUs",
          "Full control",
          "Root access"
        ]
      }
    ],
    "notes": "European cloud with excellent price-performance."
  },
  "vultr": {
    "startingPrice": 2.5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.vultr.com/pricing",
    "tiers": [
      {
        "name": "Cloud Compute",
        "price": 2.5,
        "period": "month",
        "description": "512MB",
        "features": [
          "1 vCPU",
          "512MB RAM",
          "10GB SSD"
        ]
      },
      {
        "name": "Regular",
        "price": 5,
        "period": "month",
        "description": "1GB",
        "features": [
          "1 vCPU",
          "1GB RAM",
          "25GB SSD",
          "1TB bandwidth"
        ],
        "highlighted": true
      },
      {
        "name": "High Frequency",
        "price": 6,
        "period": "month",
        "description": "1GB HF",
        "features": [
          "1 vCPU",
          "1GB RAM",
          "32GB NVMe",
          "3GHz+"
        ]
      }
    ],
    "notes": "$100-$300 credit available with promo codes."
  },
  "flyio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fly.io/docs/about/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Hobby",
        "features": [
          "3 shared VMs",
          "3GB storage",
          "160GB bandwidth"
        ]
      },
      {
        "name": "Pay as you go",
        "price": 1.94,
        "period": "month",
        "description": "Per shared VM",
        "features": [
          "256MB RAM",
          "Edge deployment",
          "Auto-scaling"
        ],
        "highlighted": true
      }
    ],
    "notes": "Edge deployment platform. Free tier available."
  },
  "upcloud": {
    "startingPrice": 5,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 3,
    "pricingPageUrl": "https://upcloud.com/pricing",
    "tiers": [
      {
        "name": "Developer",
        "price": 5,
        "period": "month",
        "description": "1 CPU",
        "features": [
          "1 CPU",
          "1GB RAM",
          "25GB MaxIOPS"
        ],
        "highlighted": true
      },
      {
        "name": "General Purpose",
        "price": 10,
        "period": "month",
        "description": "2 CPU",
        "features": [
          "2 CPU",
          "2GB RAM",
          "50GB storage"
        ]
      },
      {
        "name": "High Memory",
        "price": 20,
        "period": "month",
        "description": "2 CPU, 8GB",
        "features": [
          "2 CPU",
          "8GB RAM",
          "80GB storage"
        ]
      }
    ],
    "notes": "European cloud with 100% SLA guarantee."
  },
  "scaleway": {
    "startingPrice": 0.0025,
    "currency": "EUR",
    "billingPeriod": "hour",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.scaleway.com/en/pricing",
    "tiers": [
      {
        "name": "STARDUST1",
        "price": 1.83,
        "period": "month",
        "description": "1vCPU, 1GB",
        "features": [
          "1 vCPU",
          "1GB RAM",
          "10GB local",
          "100Mbps"
        ]
      },
      {
        "name": "DEV1-S",
        "price": 7.99,
        "period": "month",
        "description": "2 vCPU, 2GB",
        "features": [
          "2 vCPU",
          "2GB RAM",
          "20GB SSD"
        ],
        "highlighted": true
      },
      {
        "name": "GP1-XS",
        "price": 21,
        "period": "month",
        "description": "4 vCPU, 16GB",
        "features": [
          "4 vCPU",
          "16GB RAM",
          "150GB SSD"
        ]
      }
    ],
    "notes": "French cloud provider. Serverless offerings available."
  },
  "oracle-cloud": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.oracle.com/cloud/free",
    "tiers": [
      {
        "name": "Always Free",
        "price": 0,
        "description": "Free tier",
        "features": [
          "2 AMD VMs",
          "4 Arm VMs",
          "200GB storage",
          "10TB bandwidth"
        ],
        "highlighted": true
      },
      {
        "name": "Flex VM",
        "price": 0.0576,
        "period": "OCPU/hour",
        "description": "Pay as you go",
        "features": [
          "Flexible shapes",
          "AMD/Arm",
          "NVMe storage"
        ]
      }
    ],
    "notes": "Generous always-free tier with 4 Arm instances."
  },
  "ovhcloud": {
    "startingPrice": 3.5,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.ovhcloud.com/en/public-cloud/prices",
    "tiers": [
      {
        "name": "Starter",
        "price": 3.5,
        "period": "month",
        "description": "Sandbox",
        "features": [
          "1 vCore",
          "2GB RAM",
          "20GB SSD"
        ]
      },
      {
        "name": "Discovery",
        "price": 8.5,
        "period": "month",
        "description": "Dev",
        "features": [
          "2 vCores",
          "4GB RAM",
          "40GB SSD"
        ],
        "highlighted": true
      },
      {
        "name": "General Purpose",
        "price": 25,
        "period": "month",
        "description": "Production",
        "features": [
          "4 vCores",
          "15GB RAM",
          "100GB SSD"
        ]
      }
    ],
    "notes": "European cloud with data sovereignty focus."
  },
  "coolify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://coolify.io/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Unlimited servers",
          "Unlimited apps",
          "Full control"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 5,
        "period": "month",
        "description": "Managed",
        "features": [
          "2 servers",
          "Unlimited apps",
          "Managed updates"
        ]
      },
      {
        "name": "Cloud Pro",
        "price": 25,
        "period": "month",
        "description": "Teams",
        "features": [
          "10 servers",
          "Team features",
          "Priority support"
        ]
      }
    ],
    "notes": "Open-source alternative to Heroku/Vercel."
  },
  "dokku": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://dokku.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted PaaS",
          "Docker-based",
          "Heroku buildpacks",
          "Git push deploy"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted mini-Heroku."
  },
  "caprover": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://caprover.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted PaaS",
          "One-click apps",
          "Free SSL",
          "Docker Swarm"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Easy to use PaaS."
  },
  "kubernetes": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://kubernetes.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Container orchestration",
          "Self-healing",
          "Service discovery",
          "Auto-scaling"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF project."
  },
  "k3s": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://k3s.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Lightweight K8s",
          "Edge/IoT",
          "Single binary",
          "ARM support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Lightweight Kubernetes. CNCF sandbox."
  },
  "rancher": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.rancher.com/products/rancher",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Free",
        "features": [
          "Kubernetes management",
          "Multi-cluster",
          "Catalog"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "24/7 support",
          "SLA",
          "Consulting"
        ]
      }
    ],
    "notes": "Kubernetes management. Open source."
  },
  "portainer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.portainer.io/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Docker/K8s mgmt",
          "1 environment",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 0,
        "period": "node/year",
        "description": "$5/node/mo",
        "features": [
          "Unlimited envs",
          "RBAC",
          "Registry mgmt"
        ]
      }
    ],
    "notes": "Container management UI. Free tier."
  },
  "postgresql": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.postgresql.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Full-featured RDBMS",
          "ACID compliant",
          "JSON support",
          "Extensions"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted."
  },
  "mysql": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.mysql.com",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Open source",
        "features": [
          "Full database",
          "InnoDB engine",
          "Replication"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 5000,
        "period": "year",
        "description": "Starting",
        "features": [
          "Advanced security",
          "Monitoring",
          "Support"
        ]
      }
    ],
    "notes": "Community edition is free. Enterprise has annual licensing."
  },
  "mariadb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://mariadb.com/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Open source",
        "features": [
          "MySQL compatible",
          "Storage engines",
          "Replication"
        ],
        "highlighted": true
      },
      {
        "name": "SkySQL",
        "price": 65,
        "period": "month",
        "description": "Managed",
        "features": [
          "Cloud hosted",
          "Auto-scaling",
          "Support"
        ]
      }
    ],
    "notes": "Community free. SkySQL for managed cloud."
  },
  "neon": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://neon.tech/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Hobby",
        "features": [
          "0.5GB storage",
          "1 project",
          "Branching",
          "Autoscaling to 0"
        ],
        "highlighted": true
      },
      {
        "name": "Launch",
        "price": 19,
        "period": "month",
        "description": "Startups",
        "features": [
          "10GB storage",
          "Unlimited projects",
          "Point-in-time recovery"
        ]
      },
      {
        "name": "Scale",
        "price": 69,
        "period": "month",
        "description": "Growing",
        "features": [
          "50GB storage",
          "Autoscaling",
          "IP Allow"
        ]
      }
    ],
    "notes": "Serverless Postgres with database branching."
  },
  "turso": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://turso.tech/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free",
        "features": [
          "9GB total storage",
          "500 databases",
          "1B row reads"
        ],
        "highlighted": true
      },
      {
        "name": "Scaler",
        "price": 29,
        "period": "month",
        "description": "Production",
        "features": [
          "24GB storage",
          "10K databases",
          "Unlimited reads"
        ]
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Dedicated",
          "SSO",
          "SLA"
        ]
      }
    ],
    "notes": "Edge SQLite. Generous free tier."
  },
  "upstash": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://upstash.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Hobby",
        "features": [
          "10K commands/day",
          "256MB",
          "Global"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0.2,
        "period": "per 100K requests",
        "description": "Scale",
        "features": [
          "Unlimited commands",
          "Durable storage",
          "Multi-region"
        ]
      },
      {
        "name": "Pro",
        "price": 140,
        "period": "month",
        "description": "Business",
        "features": [
          "Higher limits",
          "Fixed pricing",
          "Support"
        ]
      }
    ],
    "notes": "Serverless Redis, Kafka, and QStash."
  },
  "cockroachdb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.cockroachlabs.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free tier",
        "features": [
          "10GB storage",
          "50M RUs",
          "Serverless"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 0,
        "period": "pay as you go",
        "description": "Production",
        "features": [
          "Auto-scaling",
          "99.99% SLA",
          "Backups"
        ]
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Dedicated",
          "SSO",
          "Premium support"
        ]
      }
    ],
    "notes": "Distributed SQL. Free tier with 10GB."
  },
  "timescaledb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.timescale.com/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Free",
        "features": [
          "Time-series",
          "PostgreSQL extension",
          "Full features"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 29,
        "period": "month",
        "description": "Starting",
        "features": [
          "Dynamic storage",
          "Auto backups",
          "Managed"
        ]
      }
    ],
    "notes": "Free self-hosted. Cloud starts at $29/mo."
  },
  "questdb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://questdb.io/cloud",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Time-series DB",
          "SQL queries",
          "High performance"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 75,
        "period": "month",
        "description": "Starting",
        "features": [
          "Managed hosting",
          "Monitoring",
          "Support"
        ]
      }
    ],
    "notes": "Fast time-series database. Free self-hosted."
  },
  "influxdb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.influxdata.com/influxdb-pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Serverless",
        "features": [
          "Time series",
          "5 dashboards",
          "30 days retention"
        ],
        "highlighted": true
      },
      {
        "name": "Usage-based",
        "price": 0,
        "period": "varies",
        "description": "Scale",
        "features": [
          "Pay for writes/queries",
          "Longer retention",
          "Unlimited dashboards"
        ]
      }
    ],
    "notes": "Time-series database. Free tier available."
  },
  "singlestore": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.singlestore.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "Free tier",
        "features": [
          "$600 credit",
          "Vector search",
          "Shared compute"
        ]
      },
      {
        "name": "Standard",
        "price": 0,
        "period": "pay as you go",
        "description": "Production",
        "features": [
          "Reserved compute",
          "Dedicated",
          "Unlimited scale"
        ],
        "highlighted": true
      }
    ],
    "notes": "Real-time analytics database with free starter tier."
  },
  "neo4j": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://neo4j.com/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Graph database",
          "Cypher query",
          "Single instance"
        ]
      },
      {
        "name": "AuraDB Free",
        "price": 0,
        "description": "Cloud",
        "features": [
          "50K nodes",
          "175K relationships",
          "Cloud hosted"
        ],
        "highlighted": true
      },
      {
        "name": "AuraDB Pro",
        "price": 65,
        "period": "month",
        "description": "Starting",
        "features": [
          "Larger graphs",
          "Auto-scaling",
          "Support"
        ]
      }
    ],
    "notes": "Graph database. Free tier in cloud."
  },
  "dgraph": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://dgraph.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Shared",
        "features": [
          "1GB data",
          "GraphQL",
          "5K queries/day"
        ],
        "highlighted": true
      },
      {
        "name": "Dedicated",
        "price": 99,
        "period": "month",
        "description": "Starting",
        "features": [
          "Dedicated instance",
          "100GB+",
          "Unlimited queries"
        ]
      }
    ],
    "notes": "Distributed graph database with GraphQL."
  },
  "faunadb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fauna.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Hobby",
        "features": [
          "100K read ops",
          "50K write ops",
          "500K compute ops"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Scale",
        "features": [
          "Per operation pricing",
          "Global replication",
          "ACID transactions"
        ]
      }
    ],
    "notes": "Serverless document database. Free tier available."
  },
  "duckdb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://duckdb.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "In-process analytics",
          "SQL",
          "Parquet/CSV support",
          "Python/R bindings"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. In-process OLAP database."
  },
  "sqlite": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.sqlite.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Public domain",
        "features": [
          "Embedded database",
          "Zero-config",
          "Cross-platform",
          "ACID compliant"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and public domain. Most used database."
  },
  "baserow": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://baserow.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Cloud free",
        "features": [
          "Unlimited rows",
          "API access",
          "3000 rows/table"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 5,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited tables",
          "Row comments",
          "Calendar view"
        ]
      },
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited everything",
          "Full control",
          "No limits"
        ]
      }
    ],
    "notes": "Open-source Airtable alternative. Generous free tier."
  },
  "woocommerce": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://woocommerce.com/pricing",
    "tiers": [
      {
        "name": "Core",
        "price": 0,
        "description": "Free plugin",
        "features": [
          "Full e-commerce",
          "WordPress integration",
          "Unlimited products"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free plugin. Hosting and extensions extra."
  },
  "bigcommerce": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.bigcommerce.com/essentials/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 29,
        "period": "month",
        "description": "Starting out",
        "features": [
          "Unlimited products",
          "No transaction fees",
          "POS"
        ]
      },
      {
        "name": "Plus",
        "price": 79,
        "period": "month",
        "description": "Growing",
        "features": [
          "Customer groups",
          "Abandoned cart",
          "Stored cards"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 299,
        "period": "month",
        "description": "Scaling",
        "features": [
          "Google reviews",
          "Custom SSL",
          "Product filtering"
        ]
      }
    ],
    "notes": "No transaction fees. Sales limits per tier."
  },
  "magento": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://business.adobe.com/products/magento/pricing.html",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Full platform",
          "Extensions",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Commerce",
        "price": 22000,
        "period": "year",
        "description": "Starting",
        "features": [
          "Cloud hosting",
          "B2B features",
          "Adobe support"
        ]
      }
    ],
    "notes": "Open Source is free. Adobe Commerce for enterprises."
  },
  "prestashop": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.prestashop.com/en/pricing",
    "tiers": [
      {
        "name": "Classic",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Open source",
          "Full control",
          "Community modules"
        ],
        "highlighted": true
      },
      {
        "name": "Hosted",
        "price": 24,
        "period": "month",
        "description": "Managed",
        "features": [
          "Cloud hosting",
          "Support",
          "Updates included"
        ]
      }
    ],
    "notes": "Open source and free to self-host."
  },
  "opencart": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.opencart.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Full e-commerce",
          "Extensions",
          "Multi-store"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted."
  },
  "medusa": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://medusajs.com",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Headless commerce",
          "API-first",
          "Extensible"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 50,
        "period": "month",
        "description": "Starting",
        "features": [
          "Managed hosting",
          "Support",
          "Auto-scaling"
        ]
      }
    ],
    "notes": "Open-source Shopify alternative. TypeScript-based."
  },
  "saleor": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://saleor.io/pricing",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "GraphQL API",
          "Headless",
          "Full features"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 99,
        "period": "month",
        "description": "Managed",
        "features": [
          "Hosted",
          "Support",
          "Updates"
        ]
      }
    ],
    "notes": "GraphQL-first e-commerce. Python/Django."
  },
  "vendure": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.vendure.io",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Headless commerce",
          "TypeScript",
          "GraphQL API",
          "Extensible"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. TypeScript/NestJS."
  },
  "swell": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.swell.is/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "1000 orders/mo",
          "Full API",
          "Storefront themes"
        ]
      },
      {
        "name": "Standard",
        "price": 299,
        "period": "month",
        "description": "Growing",
        "features": [
          "10K orders/mo",
          "Multiple storefronts",
          "Priority support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Headless e-commerce. Free up to 1000 orders."
  },
  "paddle": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.paddle.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 0,
        "period": "5% + 50¢",
        "description": "Per transaction",
        "features": [
          "Global payments",
          "Tax compliance",
          "Fraud protection"
        ],
        "highlighted": true
      }
    ],
    "notes": "Merchant of record. Handles taxes globally."
  },
  "snipcart": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://snipcart.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 0,
        "period": "2%",
        "description": "Or $10/mo min",
        "features": [
          "Any website",
          "Abandoned carts",
          "Custom checkout"
        ],
        "highlighted": true
      }
    ],
    "notes": "2% transaction fee or $10/mo minimum."
  },
  "square": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://squareup.com/us/en/payments/in-person",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "period": "2.6% + 10¢",
        "description": "In person",
        "features": [
          "POS app",
          "Inventory",
          "Basic reports"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 60,
        "period": "month",
        "description": "Restaurants",
        "features": [
          "Table management",
          "Menu management",
          "Team management"
        ]
      }
    ],
    "notes": "Free POS. Transaction fees apply."
  },
  "printful": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.printful.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Pay per order",
        "features": [
          "No minimums",
          "200+ products",
          "Mockup generator"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 24.99,
        "period": "month",
        "description": "Growing brands",
        "features": [
          "20% discounts",
          "Branding tools",
          "Priority support"
        ]
      }
    ],
    "notes": "Print-on-demand. Pay only for orders."
  },
  "printify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://printify.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 stores",
        "features": [
          "Unlimited designs",
          "5 stores",
          "Self-service"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 29,
        "period": "month",
        "description": "Scaling",
        "features": [
          "Up to 20% discount",
          "10 stores",
          "Custom branding"
        ]
      }
    ],
    "notes": "Print-on-demand. Free tier available."
  },
  "google-meet": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://workspace.google.com/pricing.html",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "100 participants",
          "60-min limit",
          "Google account required"
        ],
        "highlighted": true
      },
      {
        "name": "Business Starter",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "24-hour meetings",
          "100 participants",
          "30GB Drive"
        ]
      }
    ],
    "notes": "Part of Google Workspace. Free tier available."
  },
  "microsoft-teams": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "100 participants",
          "60-min meetings",
          "5GB storage"
        ]
      },
      {
        "name": "Essentials",
        "price": 4,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "300 participants",
          "30-hour meetings",
          "10GB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Business Basic",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "300 participants",
          "1TB storage",
          "Recording"
        ]
      }
    ],
    "notes": "Free tier available. Part of Microsoft 365."
  },
  "whereby": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://whereby.com/information/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 room",
          "45-min meetings",
          "100 participants"
        ]
      },
      {
        "name": "Pro",
        "price": 8.99,
        "period": "month",
        "description": "Professionals",
        "features": [
          "3 rooms",
          "Unlimited time",
          "Recording"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 11.99,
        "period": "month",
        "description": "Teams",
        "features": [
          "Unlimited rooms",
          "Branding",
          "Analytics"
        ]
      }
    ],
    "notes": "No downloads needed. Browser-based video calls."
  },
  "around": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.around.co/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "Unlimited meetings",
          "Screen share",
          "Floating heads"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 9.5,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Admin controls",
          "SSO",
          "Priority support"
        ]
      }
    ],
    "notes": "Floating video bubbles. Free for individuals."
  },
  "linear": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://linear.app/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 250 issues",
        "features": [
          "Unlimited members",
          "Basic features",
          "Community support"
        ]
      },
      {
        "name": "Pro",
        "price": 8,
        "period": "member/month",
        "description": "Annual",
        "features": [
          "Unlimited issues",
          "Cycles & projects",
          "Admin controls"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 14,
        "period": "member/month",
        "description": "Annual",
        "features": [
          "SSO/SAML",
          "SLA",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Custom contracts",
          "Dedicated support"
        ]
      }
    ]
  },
  "height": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://height.app/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited members",
        "features": [
          "Unlimited tasks",
          "All views",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 8.5,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Advanced automation",
          "Private lists",
          "Priority support"
        ]
      }
    ],
    "notes": "Modern project management. Free tier very generous."
  },
  "travis-ci": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.travis-ci.com/pricing",
    "tiers": [
      {
        "name": "Free Trial",
        "price": 0,
        "description": "10K credits",
        "features": [
          "Public repos",
          "Limited builds",
          "Community support"
        ]
      },
      {
        "name": "Hobby",
        "price": 69,
        "period": "month",
        "description": "25K credits",
        "features": [
          "Private repos",
          "Email support"
        ],
        "highlighted": true
      },
      {
        "name": "Bootstrap",
        "price": 129,
        "period": "month",
        "description": "50K credits",
        "features": [
          "More credits",
          "Priority support"
        ]
      }
    ],
    "notes": "Credit-based pricing. Free for open source."
  },
  "jenkins": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.jenkins.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted CI/CD",
          "1800+ plugins",
          "Pipeline as code",
          "Extensible"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted."
  },
  "teamcity": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.jetbrains.com/teamcity/buy",
    "tiers": [
      {
        "name": "Professional",
        "price": 0,
        "description": "Free",
        "features": [
          "100 build configs",
          "3 agents",
          "Full features"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 1999,
        "period": "year",
        "description": "Starting",
        "features": [
          "Unlimited configs",
          "Custom agents",
          "Priority support"
        ]
      }
    ],
    "notes": "Free for 100 build configs. From JetBrains."
  },
  "drone": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.drone.io",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Container-native CI",
          "Pipeline as YAML",
          "GitHub/GitLab/Bitbucket"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Enterprise",
        "features": [
          "Paid support",
          "Enterprise features"
        ]
      }
    ],
    "notes": "Free and open source. Container-native CI."
  },
  "semaphore": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://semaphoreci.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "1300 min/mo",
          "1 concurrent job",
          "Community support"
        ]
      },
      {
        "name": "Startup",
        "price": 25,
        "period": "month",
        "description": "Teams",
        "features": [
          "Unlimited jobs",
          "Priority support",
          "Secrets"
        ],
        "highlighted": true
      },
      {
        "name": "Scaleup",
        "price": 100,
        "period": "month",
        "description": "Scaling",
        "features": [
          "Custom machines",
          "Audit logs",
          "RBAC"
        ]
      }
    ],
    "notes": "Fast CI/CD. Free tier for open source."
  },
  "buildkite": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://buildkite.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited builds",
          "Self-hosted agents",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 15,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Team features",
          "SSO",
          "Audit logs"
        ]
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Dedicated support",
          "SLA",
          "Custom contracts"
        ]
      }
    ],
    "notes": "Bring your own runners. Free for open source."
  },
  "azure-devops": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://azure.microsoft.com/pricing/details/devops/azure-devops-services",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "Unlimited repos",
          "1 parallel job"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 6,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "Unlimited users",
          "Test plans",
          "More pipelines"
        ]
      }
    ],
    "notes": "Microsoft DevOps. Free for 5 users."
  },
  "github-actions": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/features/actions",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Public repos",
        "features": [
          "Unlimited minutes",
          "Self-hosted runners",
          "6 concurrent jobs"
        ],
        "highlighted": true
      },
      {
        "name": "Free (private)",
        "price": 0,
        "description": "2000 min/mo",
        "features": [
          "Linux/Windows/Mac",
          "500MB storage"
        ]
      }
    ],
    "notes": "Included with GitHub. Free for public repos."
  },
  "terraform": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.hashicorp.com/products/terraform/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "IaC",
          "State management",
          "Provider ecosystem"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud Free",
        "price": 0,
        "description": "500 resources",
        "features": [
          "Remote state",
          "Remote runs",
          "1 concurrent run"
        ]
      },
      {
        "name": "Cloud Team",
        "price": 20,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Unlimited resources",
          "Team management",
          "Sentinel"
        ]
      }
    ],
    "notes": "CLI is free. Cloud has free tier."
  },
  "pulumi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.pulumi.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited resources",
          "3 stacks",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 50,
        "period": "month",
        "description": "Base",
        "features": [
          "Unlimited stacks",
          "3 members",
          "Deployments"
        ]
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "SSO",
          "Self-hosted",
          "SLA"
        ]
      }
    ],
    "notes": "IaC with real programming languages. Free tier."
  },
  "ansible": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.ansible.com/products/automation-platform",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Open source",
        "features": [
          "Automation",
          "Playbooks",
          "Modules"
        ],
        "highlighted": true
      },
      {
        "name": "Automation Platform",
        "price": 0,
        "period": "custom",
        "description": "Enterprise",
        "features": [
          "Controller",
          "Hub",
          "Analytics"
        ]
      }
    ],
    "notes": "Core is free. Platform pricing is custom."
  },
  "argo-cd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://argoproj.github.io/cd",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "GitOps",
          "Kubernetes native",
          "Multi-cluster",
          "RBAC"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. GitOps for Kubernetes."
  },
  "flux-cd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fluxcd.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "GitOps",
          "Progressive delivery",
          "Multi-tenancy",
          "CNCF project"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "spinnaker": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://spinnaker.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Multi-cloud",
          "Canary analysis",
          "Pipeline management"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. From Netflix."
  },
  "harbor": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://goharbor.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Container registry",
          "Vulnerability scanning",
          "Replication",
          "RBAC"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "docker-hub": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.docker.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 0,
        "description": "Free",
        "features": [
          "1 private repo",
          "Unlimited public",
          "200 pulls/6hr"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 5,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited private",
          "5000 pulls/day",
          "Scout"
        ]
      },
      {
        "name": "Team",
        "price": 9,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited pulls",
          "Team management",
          "Build"
        ]
      }
    ],
    "notes": "Container registry. Free tier with rate limits."
  },
  "quay": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://quay.io/plans",
    "tiers": [
      {
        "name": "Developer",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited public",
          "Security scanning",
          "Build triggers"
        ],
        "highlighted": true
      },
      {
        "name": "Micro",
        "price": 6,
        "period": "month",
        "description": "5 private",
        "features": [
          "5 private repos",
          "Robot accounts"
        ]
      }
    ],
    "notes": "Container registry from Red Hat. Free for public."
  },
  "openai-api": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://openai.com/pricing",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "API access",
        "features": [
          "GPT-4o",
          "GPT-4",
          "DALL-E 3",
          "Whisper"
        ],
        "highlighted": true
      }
    ],
    "notes": "Pay per token. GPT-4o: $5/1M input, $15/1M output."
  },
  "anthropic-api": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.anthropic.com/api",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "API access",
        "features": [
          "Claude 3.5 Sonnet",
          "Claude 3 Opus",
          "Claude 3 Haiku"
        ],
        "highlighted": true
      }
    ],
    "notes": "Pay per token. Sonnet: $3/1M input, $15/1M output."
  },
  "google-gemini": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://ai.google.dev/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "15 RPM",
        "features": [
          "Gemini 1.5 Flash",
          "Gemini 1.5 Pro",
          "15 requests/minute"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "API access",
        "features": [
          "Higher limits",
          "All models",
          "Priority access"
        ]
      }
    ],
    "notes": "Free tier with rate limits. Flash: $0.075/1M input."
  },
  "mistral-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://mistral.ai/products",
    "tiers": [
      {
        "name": "Free Tier",
        "price": 0,
        "description": "API access",
        "features": [
          "Open models",
          "1M tokens/mo",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Production",
        "features": [
          "All models",
          "Higher limits",
          "Priority support"
        ]
      }
    ],
    "notes": "Open models available. Mistral Large: $3/1M input."
  },
  "groq": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://groq.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Rate limited",
        "features": [
          "Llama 3",
          "Mixtral",
          "Ultra-fast inference"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Production",
        "features": [
          "Higher limits",
          "Priority access"
        ]
      }
    ],
    "notes": "Ultra-fast inference. Free tier available."
  },
  "together-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.together.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "$5 credit",
        "features": [
          "Open source models",
          "200+ models",
          "Free trial credits"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Production",
        "features": [
          "All models",
          "Fine-tuning",
          "Dedicated"
        ]
      }
    ],
    "notes": "Open models at low cost. Llama 3.1 70B: $0.88/1M."
  },
  "hugging-face": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://huggingface.co/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Community",
        "features": [
          "Model hub",
          "Spaces",
          "Inference API"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 9,
        "period": "month",
        "description": "Individuals",
        "features": [
          "ZeroGPU",
          "Persistent spaces",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "price": 20,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Private models",
          "SSO",
          "Audit logs"
        ]
      }
    ],
    "notes": "Model hub free. Pro for more compute."
  },
  "openrouter": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://openrouter.ai/models",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0,
        "period": "usage",
        "description": "Per token",
        "features": [
          "Unified API",
          "All providers",
          "Automatic routing"
        ],
        "highlighted": true
      }
    ],
    "notes": "Unified API for all models. Provider pricing + markup."
  },
  "ollama": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://ollama.ai",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Run LLMs locally",
          "Llama/Mistral/etc",
          "API compatible",
          "No internet needed"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Run models locally."
  },
  "lm-studio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://lmstudio.ai",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Local use",
        "features": [
          "GUI for local LLMs",
          "GGUF models",
          "API server",
          "Chat interface"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free for personal use. Commercial license available."
  },
  "perplexity": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://perplexity.ai/pro",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Standard search",
          "5 Pro searches/day",
          "Basic sources"
        ]
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Annual $200",
        "features": [
          "Unlimited Pro",
          "GPT-4/Claude",
          "File upload"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI search engine. Pro for advanced models."
  },
  "dalle": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://openai.com/dall-e-3",
    "tiers": [
      {
        "name": "API",
        "price": 0.04,
        "period": "per image",
        "description": "1024x1024",
        "features": [
          "DALL-E 3",
          "High quality",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "ChatGPT Plus",
        "price": 20,
        "period": "month",
        "description": "Included",
        "features": [
          "Unlimited images",
          "Chat interface",
          "Editing tools"
        ]
      }
    ],
    "notes": "DALL-E 3: $0.04-$0.12/image depending on size."
  },
  "leonardo-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://leonardo.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "150 credits/day",
        "features": [
          "150 tokens daily",
          "Basic models",
          "Community gallery"
        ]
      },
      {
        "name": "Apprentice",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "8500 tokens/mo",
          "All models",
          "Priority queue"
        ],
        "highlighted": true
      },
      {
        "name": "Artisan",
        "price": 30,
        "period": "month",
        "description": "Annual",
        "features": [
          "25000 tokens/mo",
          "Private mode",
          "API access"
        ]
      }
    ],
    "notes": "AI image generation. Generous free tier."
  },
  "pika-labs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pika.art",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "250 credits/mo",
        "features": [
          "Pika 1.0",
          "Watermark",
          "Basic features"
        ]
      },
      {
        "name": "Standard",
        "price": 8,
        "period": "month",
        "description": "700 credits",
        "features": [
          "No watermark",
          "Priority queue"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 28,
        "period": "month",
        "description": "2000 credits",
        "features": [
          "4K video",
          "Custom models",
          "API access"
        ]
      }
    ],
    "notes": "AI video generation. Free tier available."
  },
  "resemble-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.resemble.ai/pricing",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0.006,
        "period": "per second",
        "description": "Starting",
        "features": [
          "Voice cloning",
          "Emotions",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "On-premise",
          "Custom voices",
          "Priority support"
        ]
      }
    ],
    "notes": "AI voice cloning. Pay per second of audio."
  },
  "speechify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://speechify.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "Basic TTS",
          "Limited voices",
          "Mobile apps"
        ]
      },
      {
        "name": "Premium",
        "price": 139,
        "period": "year",
        "description": "Annual",
        "features": [
          "HD voices",
          "OCR scanning",
          "Unlimited listening"
        ],
        "highlighted": true
      }
    ],
    "notes": "Text-to-speech reader. Free tier with limits."
  },
  "murf-ai": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://murf.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Trial",
        "features": [
          "10 minutes",
          "Limited voices",
          "No downloads"
        ]
      },
      {
        "name": "Basic",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "24 hours/year",
          "All voices",
          "Commercial use"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 26,
        "period": "month",
        "description": "Annual",
        "features": [
          "48 hours/year",
          "Voice cloning",
          "API access"
        ]
      }
    ],
    "notes": "AI voiceover generator. 7-day free trial."
  },
  "prometheus": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://prometheus.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Time series DB",
          "PromQL",
          "Alerting",
          "Service discovery"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "dynatrace": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.dynatrace.com/pricing",
    "tiers": [
      {
        "name": "Full Stack",
        "price": 69,
        "period": "host/month",
        "description": "Starting",
        "features": [
          "APM",
          "Infrastructure",
          "Real user monitoring",
          "AI-powered"
        ],
        "highlighted": true
      }
    ],
    "notes": "15-day free trial. Per-host pricing."
  },
  "splunk": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.splunk.com/en_us/products/pricing.html",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "500MB/day",
        "features": [
          "500MB daily ingest",
          "No alerts",
          "60 days retention"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 0,
        "period": "workload",
        "description": "Custom",
        "features": [
          "Unlimited data",
          "Alerts",
          "SVCs"
        ]
      }
    ],
    "notes": "Free tier with 500MB/day. Enterprise pricing is custom."
  },
  "elastic-apm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.elastic.co/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "APM",
          "Distributed tracing",
          "All features"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud Standard",
        "price": 95,
        "period": "month",
        "description": "Starting",
        "features": [
          "Managed hosting",
          "Auto-scaling",
          "Support"
        ]
      }
    ],
    "notes": "Self-managed is free. Cloud has consumption pricing."
  },
  "honeycomb": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.honeycomb.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "20M events",
        "features": [
          "20M events/mo",
          "BubbleUp",
          "SLOs"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 130,
        "period": "month",
        "description": "Starting",
        "features": [
          "100M events",
          "Advanced retention",
          "Team features"
        ]
      }
    ],
    "notes": "Observability for distributed systems. Free tier."
  },
  "bugsnag": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.bugsnag.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "7.5K events",
        "features": [
          "7500 events/mo",
          "2 projects",
          "7 day retention"
        ]
      },
      {
        "name": "Team",
        "price": 59,
        "period": "month",
        "description": "Starting",
        "features": [
          "25K events",
          "Unlimited projects",
          "90 day retention"
        ],
        "highlighted": true
      }
    ],
    "notes": "Error monitoring. Free tier available."
  },
  "rollbar": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://rollbar.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5K events",
        "features": [
          "5K events/mo",
          "30 day retention",
          "1 user"
        ]
      },
      {
        "name": "Essentials",
        "price": 12.5,
        "period": "month",
        "description": "Starting",
        "features": [
          "25K events",
          "Unlimited users",
          "90 days"
        ],
        "highlighted": true
      }
    ],
    "notes": "Error tracking. Free tier with 5K events."
  },
  "raygun": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://raygun.com/pricing",
    "tiers": [
      {
        "name": "Small Business",
        "price": 4,
        "period": "month",
        "description": "Billed yearly",
        "features": [
          "10K error events",
          "100K sessions",
          "1 user"
        ],
        "highlighted": true
      },
      {
        "name": "Startup",
        "price": 16,
        "period": "month",
        "description": "Billed yearly",
        "features": [
          "50K events",
          "500K sessions",
          "2 users"
        ]
      }
    ],
    "notes": "Error and performance monitoring. 14-day trial."
  },
  "jaeger": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.jaegertracing.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Distributed tracing",
          "Service dependency",
          "Root cause analysis",
          "Multi-backend"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "zipkin": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://zipkin.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Distributed tracing",
          "Latency tracking",
          "Service dependencies"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. From Twitter."
  },
  "opentelemetry": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://opentelemetry.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Traces, metrics, logs",
          "Vendor neutral",
          "Auto-instrumentation",
          "CNCF project"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Standard for observability."
  },
  "loki": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://grafana.com/oss/loki",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Log aggregation",
          "Label-based",
          "Grafana native",
          "Low cost"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. From Grafana Labs."
  },
  "signoz": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://signoz.io/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Full features",
          "Unlimited data",
          "OpenTelemetry native"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": 199,
        "period": "month",
        "description": "Starting",
        "features": [
          "Managed cloud",
          "Support",
          "SSO"
        ]
      }
    ],
    "notes": "Open-source alternative to Datadog."
  },
  "uptrace": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://uptrace.dev/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Open source",
          "Traces, metrics, logs",
          "Unlimited data"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 0,
        "period": "usage",
        "description": "Pay as you go",
        "features": [
          "Managed",
          "Support",
          "Free tier included"
        ]
      }
    ],
    "notes": "Open-source APM. Self-hosted free."
  },
  "logtail": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://betterstack.com/logtail/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1GB/mo",
        "features": [
          "1GB logs/mo",
          "3 day retention",
          "Alerting"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 24,
        "period": "month",
        "description": "Starting",
        "features": [
          "30GB logs",
          "30 day retention",
          "Dashboard"
        ]
      }
    ],
    "notes": "From Better Stack. Built on ClickHouse."
  },
  "papertrail": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.papertrail.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50MB/mo",
        "features": [
          "50MB/mo",
          "7 day search",
          "48hr retention"
        ]
      },
      {
        "name": "Pro",
        "price": 7,
        "period": "month",
        "description": "1GB",
        "features": [
          "1GB/mo",
          "1 week search",
          "1 year archive"
        ],
        "highlighted": true
      }
    ],
    "notes": "Cloud log management. Free tier available."
  },
  "logz-io": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://logz.io/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "1GB/day",
        "features": [
          "1GB/day",
          "ELK-based",
          "3 day retention"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 89,
        "period": "month",
        "description": "Starting",
        "features": [
          "More data",
          "14 day retention",
          "AI ops"
        ]
      }
    ],
    "notes": "Based on ELK stack. Free tier with 1GB/day."
  },
  "graylog": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://graylog.org/pricing",
    "tiers": [
      {
        "name": "Open",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Log management",
          "Search",
          "Dashboards",
          "Alerts"
        ],
        "highlighted": true
      },
      {
        "name": "Operations",
        "price": 1250,
        "period": "month",
        "description": "Starting",
        "features": [
          "Enterprise features",
          "Support",
          "More retention"
        ]
      }
    ],
    "notes": "Open source self-hosted. Enterprise plans available."
  },
  "fluentd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.fluentd.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unified logging",
          "500+ plugins",
          "Reliable delivery",
          "CNCF project"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "vector": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://vector.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "High performance",
          "Transform data",
          "Multi-cloud",
          "Rust-based"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. From Datadog."
  },
  "shortcut": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.shortcut.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Up to 10 users",
        "features": [
          "Basic features",
          "Limited integrations"
        ]
      },
      {
        "name": "Team",
        "price": 8.5,
        "period": "month/user",
        "description": "Yearly ($10 monthly)",
        "features": [
          "Unlimited users",
          "All integrations",
          "Advanced features"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 12,
        "period": "month/user",
        "description": "Yearly ($16 monthly)",
        "features": [
          "Priority support",
          "Business features"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Enterprise features",
          "Dedicated support"
        ]
      }
    ]
  },
  "livechat": {
    "startingPrice": 19,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.livechat.com/pricing/",
    "tiers": [
      {
        "name": "Starter",
        "price": 19,
        "period": "person/month",
        "description": "Annual ($25 monthly)",
        "features": [
          "100 visitors tracked",
          "1 campaign",
          "60-day history"
        ]
      },
      {
        "name": "Team",
        "price": 49,
        "period": "person/month",
        "description": "Annual ($59 monthly)",
        "features": [
          "400 visitors",
          "Unlimited campaigns",
          "Unlimited history"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 79,
        "period": "person/month",
        "description": "Annual ($89 monthly)",
        "features": [
          "1000 visitors",
          "Work scheduler",
          "SMS & Apple Messages"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Contact sales",
        "features": [
          "Dedicated manager",
          "White-label",
          "HIPAA compliance"
        ]
      }
    ]
  },
  "chatwoot": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.chatwoot.com/pricing",
    "tiers": [
      {
        "name": "Hacker",
        "price": 0,
        "description": "Up to 2 agents",
        "features": [
          "500 conversations/mo",
          "30-day retention",
          "Basic features"
        ]
      },
      {
        "name": "Startups",
        "price": 19,
        "period": "agent/month",
        "description": "Unlimited conversations",
        "features": [
          "1-year retention",
          "All channels",
          "Collaboration"
        ]
      },
      {
        "name": "Business",
        "price": 39,
        "period": "agent/month",
        "description": "Fair use policy",
        "features": [
          "2-year retention",
          "Teams",
          "Automation"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 99,
        "period": "agent/month",
        "description": "20+ agents",
        "features": [
          "3-year retention",
          "SSO",
          "Dedicated manager"
        ]
      }
    ]
  },
  "ses": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://aws.amazon.com/ses/pricing",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0.1,
        "period": "per 1K",
        "description": "Outbound",
        "features": [
          "$0.10/1K emails",
          "High deliverability",
          "AWS integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "AWS email service. Very cost effective at scale."
  },
  "mailjet": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.mailjet.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "6K/mo",
        "features": [
          "6K emails/mo",
          "200/day limit",
          "Unlimited contacts"
        ]
      },
      {
        "name": "Essential",
        "price": 17,
        "period": "month",
        "description": "15K/mo",
        "features": [
          "15K emails",
          "No daily limit",
          "No logo"
        ],
        "highlighted": true
      }
    ],
    "notes": "Transactional and marketing email. Free tier."
  },
  "hubspot-marketing": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.hubspot.com/pricing/marketing",
    "tiers": [
      {
        "name": "Free Tools",
        "price": 0,
        "description": "Basic",
        "features": [
          "Forms",
          "Email marketing",
          "Limited features"
        ]
      },
      {
        "name": "Starter",
        "price": 20,
        "period": "month",
        "description": "Annual",
        "features": [
          "1K contacts",
          "Remove branding",
          "Landing pages"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 890,
        "period": "month",
        "description": "Annual",
        "features": [
          "2K contacts",
          "Automation",
          "A/B testing"
        ]
      }
    ],
    "notes": "Part of HubSpot CRM suite. Free tools available."
  },
  "adobe-xd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.adobe.com/products/xd.html",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "1 document",
          "2GB storage",
          "Basic features"
        ],
        "highlighted": true
      },
      {
        "name": "Single App",
        "price": 22.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited documents",
          "100GB storage",
          "Coediting"
        ]
      }
    ],
    "notes": "Part of Adobe Creative Cloud. Free tier limited."
  },
  "affinity-designer": {
    "startingPrice": 69.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://affinity.serif.com/en-us/designer",
    "tiers": [
      {
        "name": "Desktop",
        "price": 69.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Vector design",
          "Mac or Windows",
          "No subscription"
        ],
        "highlighted": true
      },
      {
        "name": "Universal License",
        "price": 169.99,
        "period": "once",
        "description": "All apps",
        "features": [
          "All 6 apps",
          "Mac + Windows + iPad",
          "Free updates"
        ]
      }
    ],
    "notes": "One-time purchase. No subscription."
  },
  "penpot": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://penpot.app",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited projects",
          "SVG native",
          "Prototyping",
          "Self-hosted option"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Web-based design."
  },
  "lunacy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://icons8.com/lunacy",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free forever",
        "features": [
          "All features",
          "Built-in graphics",
          "Sketch compatible",
          "Cross-platform"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free forever. Alternative to Sketch."
  },
  "invision": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.invisionapp.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 docs",
        "features": [
          "3 documents",
          "Basic prototyping",
          "Comments"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 7.95,
        "period": "month",
        "description": "Unlimited",
        "features": [
          "Unlimited docs",
          "All features",
          "Priority support"
        ]
      }
    ],
    "notes": "Prototyping and collaboration. Free tier."
  },
  "principle": {
    "startingPrice": 5,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://principleformac.com",
    "tiers": [
      {
        "name": "Subscription",
        "price": 5,
        "period": "month",
        "description": "Mac only",
        "features": [
          "Animated prototypes",
          "Mac app",
          "Auto code export"
        ],
        "highlighted": true
      }
    ],
    "notes": "Mac-only animation tool. Also $129 one-time."
  },
  "protopie": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.protopie.io/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "1 active project",
          "Basic prototyping",
          "Community support"
        ]
      },
      {
        "name": "Basic",
        "price": 11,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited projects",
          "All interactions",
          "Sharing"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 30,
        "period": "month",
        "description": "Annual",
        "features": [
          "Team features",
          "Analytics",
          "Plugins"
        ]
      }
    ],
    "notes": "Advanced prototyping tool. Free tier."
  },
  "rive": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://rive.app/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "3 files",
          "Community assets",
          "Basic features"
        ]
      },
      {
        "name": "General",
        "price": 16,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited files",
          "Private files",
          "All features"
        ],
        "highlighted": true
      }
    ],
    "notes": "Interactive animations. Free tier."
  },
  "spline": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://spline.design/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited files",
          "2 exports/mo",
          "Community assets"
        ]
      },
      {
        "name": "Plus",
        "price": 9,
        "period": "month",
        "description": "Creators",
        "features": [
          "Unlimited exports",
          "Private files",
          "Custom domain"
        ],
        "highlighted": true
      }
    ],
    "notes": "3D design for web. Free tier."
  },
  "blender": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.blender.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "3D modeling",
          "Animation",
          "Rendering",
          "Video editing"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Industry standard."
  },
  "inkscape": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://inkscape.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Vector graphics",
          "SVG native",
          "Cross-platform",
          "Extensions"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Vector editor."
  },
  "gimp": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.gimp.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Image editing",
          "Photo retouching",
          "Painting tools",
          "Extensions"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Photoshop alternative."
  },
  "krita": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://krita.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Digital painting",
          "Animation",
          "Brush engines",
          "Layer support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Digital art."
  },
  "procreate": {
    "startingPrice": 12.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://procreate.com",
    "tiers": [
      {
        "name": "Procreate",
        "price": 12.99,
        "period": "once",
        "description": "iPad",
        "features": [
          "Digital painting",
          "Apple Pencil",
          "Animation",
          "Brushes"
        ],
        "highlighted": true
      }
    ],
    "notes": "One-time purchase. iPad only."
  },
  "adobe-illustrator": {
    "startingPrice": 22.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.adobe.com/products/illustrator.html",
    "tiers": [
      {
        "name": "Single App",
        "price": 22.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Vector design",
          "100GB cloud",
          "Adobe Fonts",
          "Creative Cloud"
        ],
        "highlighted": true
      }
    ],
    "notes": "Part of Creative Cloud. Industry standard."
  },
  "adobe-photoshop": {
    "startingPrice": 22.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.adobe.com/products/photoshop.html",
    "tiers": [
      {
        "name": "Photography",
        "price": 9.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Photoshop",
          "Lightroom",
          "20GB cloud"
        ]
      },
      {
        "name": "Single App",
        "price": 22.99,
        "period": "month",
        "description": "Annual",
        "features": [
          "Photoshop",
          "100GB cloud",
          "Adobe Fonts"
        ],
        "highlighted": true
      }
    ],
    "notes": "Photography plan includes Lightroom."
  },
  "photopea": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.photopea.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "With ads",
        "features": [
          "All features",
          "Browser-based",
          "PSD support"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 5,
        "period": "month",
        "description": "No ads",
        "features": [
          "No ads",
          "All features",
          "Email support"
        ]
      }
    ],
    "notes": "Free browser Photoshop alternative."
  },
  "pixelmator-pro": {
    "startingPrice": 49.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.pixelmator.com/pro",
    "tiers": [
      {
        "name": "Pixelmator Pro",
        "price": 49.99,
        "period": "once",
        "description": "Mac only",
        "features": [
          "Image editing",
          "ML features",
          "Photos integration",
          "No subscription"
        ],
        "highlighted": true
      }
    ],
    "notes": "One-time purchase. Mac only."
  },
  "zeplin": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://zeplin.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 project",
        "features": [
          "1 active project",
          "Unlimited users",
          "Basic features"
        ]
      },
      {
        "name": "Starter",
        "price": 6,
        "period": "seat/month",
        "description": "3 projects",
        "features": [
          "3 projects",
          "Components",
          "Flows"
        ],
        "highlighted": true
      },
      {
        "name": "Organization",
        "price": 10.75,
        "period": "seat/month",
        "description": "Unlimited",
        "features": [
          "Unlimited projects",
          "SSO",
          "Admin controls"
        ]
      }
    ],
    "notes": "Design handoff for developers. Free tier."
  },
  "abstract": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.abstract.com/pricing",
    "tiers": [
      {
        "name": "Standard",
        "price": 15,
        "period": "contributor/month",
        "description": "Teams",
        "features": [
          "Version control",
          "Branches",
          "Collections",
          "Sketch/XD support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Version control for design files."
  },
  "lottie": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://lottiefiles.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "10 files/mo",
          "Basic editor",
          "Public workspace"
        ]
      },
      {
        "name": "Micro",
        "price": 15,
        "period": "month",
        "description": "Creators",
        "features": [
          "100 files/mo",
          "Private files",
          "Priority support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Animation library and tools. Free tier."
  },
  "fontjoy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fontjoy.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Web tool",
        "features": [
          "Font pairing",
          "Deep learning",
          "Google Fonts",
          "Unlimited use"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free font pairing tool. Web-based."
  },
  "framer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.framer.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Staging",
        "features": [
          "Free staging",
          "1 project",
          "Framer badge"
        ]
      },
      {
        "name": "Mini",
        "price": 5,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domain",
          "1K visitors",
          "No badge"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 15,
        "period": "month",
        "description": "Annual",
        "features": [
          "10K visitors",
          "20 CMS items",
          "Localization"
        ]
      }
    ],
    "notes": "Website builder. Free for staging sites."
  },
  "bubble": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://bubble.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Learning",
        "features": [
          "Bubble branding",
          "Limited",
          "Development only"
        ]
      },
      {
        "name": "Starter",
        "price": 32,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domain",
          "API access",
          "Basic logs"
        ],
        "highlighted": true
      },
      {
        "name": "Growth",
        "price": 134,
        "period": "month",
        "description": "Annual",
        "features": [
          "2 units",
          "10GB storage",
          "Scheduled workflows"
        ]
      }
    ],
    "notes": "Full-stack no-code. Free for learning."
  },
  "adalo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.adalo.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Learning",
        "features": [
          "Unlimited apps",
          "200 actions",
          "Adalo branding"
        ]
      },
      {
        "name": "Starter",
        "price": 45,
        "period": "month",
        "description": "Annual",
        "features": [
          "No branding",
          "Custom domain",
          "5K actions"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 65,
        "period": "month",
        "description": "Annual",
        "features": [
          "App Store publish",
          "Unlimited actions",
          "Custom fonts"
        ]
      }
    ],
    "notes": "Native app builder. Free for learning."
  },
  "stacker": {
    "startingPrice": 59,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.stackerhq.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 59,
        "period": "month",
        "description": "5 users",
        "features": [
          "5 team users",
          "1 app",
          "Customer portal"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 199,
        "period": "month",
        "description": "20 users",
        "features": [
          "20 users",
          "3 apps",
          "Custom branding"
        ]
      }
    ],
    "notes": "Customer portals on spreadsheets."
  },
  "pipedream": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pipedream.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Generous",
        "features": [
          "10K credits/mo",
          "Unlimited workflows",
          "100+ apps"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "50K credits",
          "Priority support",
          "Longer history"
        ]
      }
    ],
    "notes": "Developer-focused automation."
  },
  "xano": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.xano.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Limited",
        "features": [
          "1 instance",
          "10K records",
          "50K API calls"
        ]
      },
      {
        "name": "Launch",
        "price": 85,
        "period": "month",
        "description": "Annual",
        "features": [
          "5 instances",
          "100K records",
          "Unlimited API"
        ],
        "highlighted": true
      },
      {
        "name": "Scale",
        "price": 170,
        "period": "month",
        "description": "Annual",
        "features": [
          "10 instances",
          "500K records",
          "Branches"
        ]
      }
    ],
    "notes": "No-code backend. Free tier."
  },
  "pocketbase": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pocketbase.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Real-time DB",
          "Auth",
          "File storage",
          "Single file"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Single Go binary."
  },
  "flutterflow": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://flutterflow.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Unlimited projects",
          "Preview mode",
          "Community support"
        ]
      },
      {
        "name": "Standard",
        "price": 30,
        "period": "month",
        "description": "Annual",
        "features": [
          "Code download",
          "Custom code",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 70,
        "period": "month",
        "description": "Annual",
        "features": [
          "Team features",
          "Git sync",
          "Branches"
        ]
      }
    ],
    "notes": "Build Flutter apps visually. Free tier."
  },
  "draftbit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://draftbit.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Learning",
        "features": [
          "2 apps",
          "Expo builds",
          "Community"
        ]
      },
      {
        "name": "Starter",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited apps",
          "Export code",
          "No branding"
        ],
        "highlighted": true
      }
    ],
    "notes": "Mobile app builder. Free tier."
  },
  "trivy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://trivy.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Container scanning",
          "IaC scanning",
          "SBOM",
          "CI integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. From Aqua Security."
  },
  "semgrep": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://semgrep.dev/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Open source",
        "features": [
          "OSS rules",
          "CLI",
          "Unlimited scans"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 40,
        "period": "month",
        "description": "10 users",
        "features": [
          "Pro rules",
          "SAST",
          "SCA"
        ]
      }
    ],
    "notes": "Open-source code scanning. Free tier."
  },
  "sonarqube": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.sonarsource.com/plans-and-pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "17 languages",
          "Quality gate",
          "Clean as you code"
        ],
        "highlighted": true
      },
      {
        "name": "Developer",
        "price": 150,
        "period": "year",
        "description": "Starting",
        "features": [
          "Branch analysis",
          "PR decoration",
          "More languages"
        ]
      }
    ],
    "notes": "Community edition free. Enterprise pricing varies."
  },
  "sonarcloud": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.sonarsource.com/products/sonarcloud/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Public",
        "features": [
          "Public repos",
          "All languages",
          "Unlimited analysis"
        ]
      },
      {
        "name": "Team",
        "price": 10,
        "period": "month",
        "description": "Starting",
        "features": [
          "Private repos",
          "100K LOC",
          "Branch analysis"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free for public repositories."
  },
  "dependabot": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/features/security",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "GitHub native",
        "features": [
          "Dependency updates",
          "Security alerts",
          "All languages",
          "Automatic PRs"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and included with GitHub."
  },
  "renovate": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.mend.io/renovate",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Open source",
        "features": [
          "Dependency updates",
          "Multi-platform",
          "Automerge"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Enterprise",
        "features": [
          "On-premise",
          "Support",
          "SLA"
        ]
      }
    ],
    "notes": "Open source. From Mend (formerly WhiteSource)."
  },
  "gitleaks": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gitleaks.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Secret scanning",
          "Git history",
          "CI integration",
          "Custom rules"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Detect secrets in git."
  },
  "trufflehog": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://trufflesecurity.com",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Free",
        "features": [
          "Secret scanning",
          "700+ detectors",
          "Git history"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Dashboard",
          "RBAC",
          "Support"
        ]
      }
    ],
    "notes": "Open source secret scanner."
  },
  "owasp-zap": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.zaproxy.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "DAST",
          "API scanning",
          "CI/CD",
          "Automation"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. OWASP flagship project."
  },
  "burp-suite": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://portswigger.net/burp/pro",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Manual tools",
          "Basic scanning",
          "Community support"
        ]
      },
      {
        "name": "Professional",
        "price": 449,
        "period": "year",
        "description": "Per user",
        "features": [
          "Full scanner",
          "Extensions",
          "Support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Community edition free. Pro for full features."
  },
  "hashicorp-vault": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.hashicorp.com/products/vault/pricing",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-managed",
        "features": [
          "Secrets management",
          "Encryption",
          "Identity"
        ],
        "highlighted": true
      },
      {
        "name": "HCP Vault",
        "price": 0.03,
        "period": "hour",
        "description": "Cloud",
        "features": [
          "Managed",
          "Auto-unseal",
          "HA"
        ]
      }
    ],
    "notes": "Open source free. HCP for managed cloud."
  },
  "infisical": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://infisical.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 team members",
        "features": [
          "Unlimited secrets",
          "Basic integrations",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 5,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "SSO",
          "Audit logs",
          "IP allowlisting"
        ]
      }
    ],
    "notes": "Open-source secrets management. Free tier."
  },
  "1password-business": {
    "startingPrice": 7.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://1password.com/business",
    "tiers": [
      {
        "name": "Teams",
        "price": 19.95,
        "period": "month",
        "description": "Up to 10",
        "features": [
          "10 users",
          "5GB storage",
          "Guest accounts"
        ]
      },
      {
        "name": "Business",
        "price": 7.99,
        "period": "user/month",
        "description": "Per user",
        "features": [
          "SSO",
          "Advanced reports",
          "Custom roles"
        ],
        "highlighted": true
      }
    ],
    "notes": "Team password management."
  },
  "falco": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://falco.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Runtime security",
          "Kubernetes native",
          "eBPF based",
          "CNCF project"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated project."
  },
  "wazuh": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://wazuh.com",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "SIEM",
          "XDR",
          "Compliance",
          "Cloud security"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 0,
        "period": "custom",
        "description": "Managed",
        "features": [
          "Managed hosting",
          "Support",
          "SLA"
        ]
      }
    ],
    "notes": "Free and open source. Enterprise SIEM."
  },
  "github-pages": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pages.github.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Free",
        "features": [
          "Static hosting",
          "Custom domain",
          "HTTPS",
          "GitHub integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free static hosting from GitHub."
  },
  "cloudflare-pages": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pages.cloudflare.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Unlimited",
        "features": [
          "Unlimited bandwidth",
          "500 builds/mo",
          "Unlimited sites"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Per domain",
        "features": [
          "5000 builds/mo",
          "Web analytics",
          "More functions"
        ]
      }
    ],
    "notes": "Unlimited bandwidth on free tier."
  },
  "aws-amplify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://aws.amazon.com/amplify/pricing",
    "tiers": [
      {
        "name": "Free Tier",
        "price": 0,
        "description": "12 months",
        "features": [
          "1000 build minutes",
          "15GB hosting",
          "5GB storage"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0.01,
        "period": "per build minute",
        "description": "Usage",
        "features": [
          "$0.023/GB hosting",
          "$0.25/GB storage"
        ]
      }
    ],
    "notes": "12-month free tier. Pay for usage after."
  },
  "wordpress-com": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://wordpress.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "WordPress.com subdomain",
          "1GB storage",
          "Ads shown"
        ]
      },
      {
        "name": "Personal",
        "price": 4,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom domain",
          "6GB storage",
          "No ads"
        ],
        "highlighted": true
      },
      {
        "name": "Premium",
        "price": 8,
        "period": "month",
        "description": "Annual",
        "features": [
          "Custom CSS",
          "13GB storage",
          "Monetization"
        ]
      }
    ],
    "notes": "Free with WordPress.com subdomain."
  },
  "super": {
    "startingPrice": 12,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://super.so/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 12,
        "period": "month",
        "description": "1 site",
        "features": [
          "1 Notion site",
          "Custom domain",
          "SEO"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 16,
        "period": "month",
        "description": "Per site",
        "features": [
          "Password protection",
          "Custom code",
          "Team members"
        ]
      }
    ],
    "notes": "Turn Notion into a website."
  },
  "typedream": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://typedream.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 site",
        "features": [
          "1 site",
          "Typedream subdomain",
          "Basic features"
        ]
      },
      {
        "name": "Launch",
        "price": 15,
        "period": "month",
        "description": "1 site",
        "features": [
          "Custom domain",
          "No branding",
          "Forms"
        ],
        "highlighted": true
      }
    ],
    "notes": "No-code website builder. Free tier."
  },
  "namecheap": {
    "startingPrice": 1.58,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.namecheap.com/hosting/shared",
    "tiers": [
      {
        "name": "Stellar",
        "price": 1.58,
        "period": "month",
        "description": "First year",
        "features": [
          "3 websites",
          "20GB SSD",
          "Free CDN"
        ]
      },
      {
        "name": "Stellar Plus",
        "price": 2.48,
        "period": "month",
        "description": "First year",
        "features": [
          "Unlimited sites",
          "Unmetered SSD",
          "AutoBackup"
        ],
        "highlighted": true
      }
    ],
    "notes": "Domain registrar with hosting."
  },
  "siteground": {
    "startingPrice": 2.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.siteground.com/web-hosting.htm",
    "tiers": [
      {
        "name": "StartUp",
        "price": 2.99,
        "period": "month",
        "description": "Promo",
        "features": [
          "1 website",
          "10GB space",
          "Free SSL"
        ]
      },
      {
        "name": "GrowBig",
        "price": 4.99,
        "period": "month",
        "description": "Promo",
        "features": [
          "Unlimited sites",
          "20GB space",
          "Staging"
        ],
        "highlighted": true
      }
    ],
    "notes": "Quality WordPress hosting. Promo prices."
  },
  "bluehost": {
    "startingPrice": 2.95,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.bluehost.com/hosting/shared",
    "tiers": [
      {
        "name": "Basic",
        "price": 2.95,
        "period": "month",
        "description": "3 years",
        "features": [
          "1 website",
          "50GB SSD",
          "Free domain"
        ]
      },
      {
        "name": "Plus",
        "price": 5.45,
        "period": "month",
        "description": "3 years",
        "features": [
          "Unlimited sites",
          "Unmetered SSD",
          "Spam protection"
        ],
        "highlighted": true
      }
    ],
    "notes": "WordPress recommended host. Long-term pricing."
  },
  "dreamhost": {
    "startingPrice": 2.95,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 97,
    "pricingPageUrl": "https://www.dreamhost.com/hosting/shared",
    "tiers": [
      {
        "name": "Starter",
        "price": 2.95,
        "period": "month",
        "description": "3 years",
        "features": [
          "1 website",
          "50GB SSD",
          "Free domain"
        ]
      },
      {
        "name": "Unlimited",
        "price": 5.95,
        "period": "month",
        "description": "3 years",
        "features": [
          "Unlimited sites",
          "Unlimited storage",
          "Email"
        ],
        "highlighted": true
      }
    ],
    "notes": "97-day money-back guarantee."
  },
  "a2-hosting": {
    "startingPrice": 2.99,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.a2hosting.com/web-hosting",
    "tiers": [
      {
        "name": "Startup",
        "price": 2.99,
        "period": "month",
        "description": "3 years",
        "features": [
          "1 website",
          "100GB SSD",
          "Free SSL"
        ]
      },
      {
        "name": "Drive",
        "price": 5.99,
        "period": "month",
        "description": "3 years",
        "features": [
          "Unlimited sites",
          "Unlimited SSD",
          "Free site migration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Fast hosting with Turbo servers."
  },
  "kinsta": {
    "startingPrice": 35,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://kinsta.com/plans",
    "tiers": [
      {
        "name": "Starter",
        "price": 35,
        "period": "month",
        "description": "1 site",
        "features": [
          "1 WordPress site",
          "25K visits",
          "10GB storage"
        ]
      },
      {
        "name": "Pro",
        "price": 70,
        "period": "month",
        "description": "2 sites",
        "features": [
          "2 sites",
          "50K visits",
          "20GB storage"
        ],
        "highlighted": true
      }
    ],
    "notes": "Premium managed WordPress hosting."
  },
  "wpengine": {
    "startingPrice": 20,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://wpengine.com/plans",
    "tiers": [
      {
        "name": "Startup",
        "price": 20,
        "period": "month",
        "description": "Annual",
        "features": [
          "1 site",
          "25K visits",
          "10GB storage"
        ]
      },
      {
        "name": "Professional",
        "price": 40,
        "period": "month",
        "description": "Annual",
        "features": [
          "3 sites",
          "75K visits",
          "15GB storage"
        ],
        "highlighted": true
      }
    ],
    "notes": "Enterprise WordPress hosting."
  },
  "pantheon": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pantheon.io/plans/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Sandbox",
        "features": [
          "Dev environments",
          "Drupal/WordPress",
          "Community support"
        ]
      },
      {
        "name": "Basic",
        "price": 41,
        "period": "month",
        "description": "Annual",
        "features": [
          "1 site",
          "20K visits",
          "SSL"
        ],
        "highlighted": true
      }
    ],
    "notes": "Drupal and WordPress hosting."
  },
  "cal-com": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://cal.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "Unlimited bookings",
          "Cal.com subdomain",
          "Google/Outlook sync"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 12,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Custom domains",
          "Round robin",
          "Team analytics"
        ]
      }
    ],
    "notes": "Open-source Calendly alternative. Free tier."
  },
  "savvycal": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://savvycal.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Basic scheduling",
          "1 calendar",
          "Personalization"
        ]
      },
      {
        "name": "Individual",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited links",
          "Workflows",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Scheduling that prioritizes recipients."
  },
  "tidycal": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://tidycal.com",
    "tiers": [
      {
        "name": "Lifetime",
        "price": 29,
        "period": "once",
        "description": "One-time",
        "features": [
          "Unlimited bookings",
          "Unlimited calendars",
          "All features"
        ],
        "highlighted": true
      }
    ],
    "notes": "One-time payment. No subscription."
  },
  "youcanbook-me": {
    "startingPrice": 10.8,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://youcanbook.me/pricing",
    "tiers": [
      {
        "name": "Pro",
        "price": 10.8,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited bookings",
          "Custom branding",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Simple online booking. 14-day trial."
  },
  "reclaim": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://reclaim.ai/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 habits",
        "features": [
          "3 habits",
          "Basic scheduling",
          "1 calendar"
        ]
      },
      {
        "name": "Starter",
        "price": 8,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited habits",
          "Tasks",
          "Slack"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI calendar assistant. Free tier."
  },
  "motion": {
    "startingPrice": 19,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.usemotion.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "AI scheduling",
          "Task management",
          "Projects"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 12,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Shared projects",
          "Team calendar",
          "Admin"
        ]
      }
    ],
    "notes": "AI calendar and task manager."
  },
  "fantastical": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://flexibits.com/fantastical",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Calendar view",
          "1 calendar set",
          "Basic features"
        ]
      },
      {
        "name": "Premium",
        "price": 6.99,
        "period": "month",
        "description": "Annual $57",
        "features": [
          "All calendars",
          "Tasks",
          "Weather"
        ],
        "highlighted": true
      }
    ],
    "notes": "Apple calendar app. Free tier limited."
  },
  "raycast": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.raycast.com/pricing",
    "tiers": [
      {
        "name": "Personal",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Extensions",
          "Snippets",
          "Clipboard history"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 8,
        "period": "month",
        "description": "Annual",
        "features": [
          "AI",
          "Cloud sync",
          "Themes"
        ]
      }
    ],
    "notes": "Mac launcher. Free for personal use."
  },
  "alfred": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.alfredapp.com/powerpack",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "App launching",
          "Web search",
          "Calculator"
        ]
      },
      {
        "name": "Powerpack",
        "price": 34,
        "period": "once",
        "description": "Single",
        "features": [
          "Workflows",
          "Clipboard",
          "Snippets"
        ],
        "highlighted": true
      },
      {
        "name": "Mega Supporter",
        "price": 59,
        "period": "once",
        "description": "Lifetime",
        "features": [
          "Free updates",
          "All features",
          "Supporter badge"
        ]
      }
    ],
    "notes": "Mac productivity app. One-time purchase."
  },
  "textexpander": {
    "startingPrice": 3.33,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://textexpander.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 3.33,
        "period": "month",
        "description": "Annual $40",
        "features": [
          "Unlimited snippets",
          "All platforms",
          "Sync"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 8.33,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Shared snippets",
          "Usage stats",
          "Admin"
        ]
      }
    ],
    "notes": "Text expansion tool. All platforms."
  },
  "logseq": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://logseq.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited notes",
          "Graph view",
          "Local-first",
          "Plugins"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Local-first."
  },
  "things-3": {
    "startingPrice": 49.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://culturedcode.com/things",
    "tiers": [
      {
        "name": "Mac",
        "price": 49.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Full features",
          "iCloud sync"
        ],
        "highlighted": true
      },
      {
        "name": "iPhone",
        "price": 9.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Full features",
          "Widgets"
        ]
      },
      {
        "name": "iPad",
        "price": 19.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Full features",
          "Widgets"
        ]
      }
    ],
    "notes": "Task manager. One-time purchase per platform."
  },
  "omnifocus": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.omnigroup.com/omnifocus",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "Basic features",
          "Limited projects",
          "View only on web"
        ]
      },
      {
        "name": "Pro",
        "price": 9.99,
        "period": "month",
        "description": "Subscription",
        "features": [
          "All features",
          "Custom perspectives",
          "Sync"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 49.99,
        "period": "once",
        "description": "Per platform",
        "features": [
          "Core features",
          "Per platform purchase"
        ]
      }
    ],
    "notes": "GTD task manager. Apple devices."
  },
  "streaks": {
    "startingPrice": 4.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://streaksapp.com",
    "tiers": [
      {
        "name": "Full App",
        "price": 4.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "12 habits",
          "Health app integration",
          "Widgets",
          "Shortcuts"
        ],
        "highlighted": true
      }
    ],
    "notes": "Habit tracker for Apple. One-time."
  },
  "puppeteer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://pptr.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Chrome automation",
          "Screenshots",
          "PDF generation",
          "Headless"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Google."
  },
  "vitest": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://vitest.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Vite native",
          "Jest compatible",
          "Fast",
          "TypeScript"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Vite-native testing."
  },
  "mocha": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://mochajs.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Flexible",
          "Async support",
          "Browser support",
          "Reporters"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. JavaScript test framework."
  },
  "testing-library": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://testing-library.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "React testing",
          "DOM testing",
          "User-centric",
          "Accessible queries"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Simple testing utilities."
  },
  "storybook": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.chromatic.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Component dev",
          "Docs",
          "Testing",
          "Addons"
        ],
        "highlighted": true
      },
      {
        "name": "Chromatic Free",
        "price": 0,
        "description": "5K snapshots",
        "features": [
          "Visual testing",
          "UI review",
          "5000 snapshots/mo"
        ]
      },
      {
        "name": "Chromatic Pro",
        "price": 149,
        "period": "month",
        "description": "35K snapshots",
        "features": [
          "35K snapshots",
          "Unlimited projects",
          "Priority support"
        ]
      }
    ],
    "notes": "Open source. Chromatic for visual testing."
  },
  "sauce-labs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://saucelabs.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Unlimited for OSS",
          "Real browsers",
          "Real devices"
        ]
      },
      {
        "name": "Team",
        "price": 49,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Parallel tests",
          "Debugging",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free for open source projects."
  },
  "testim": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.testim.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Community",
        "features": [
          "1000 runs/mo",
          "AI-powered",
          "Chrome only"
        ]
      },
      {
        "name": "Essential",
        "price": 450,
        "period": "month",
        "description": "Teams",
        "features": [
          "Unlimited runs",
          "All browsers",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI-powered test automation."
  },
  "mabl": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.mabl.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "25 test runs",
          "1 app",
          "Community support"
        ]
      },
      {
        "name": "Core",
        "price": 500,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited runs",
          "API testing",
          "Priority support"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI-powered test automation platform."
  },
  "hoppscotch": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://hoppscotch.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "REST/GraphQL",
          "WebSocket",
          "Real-time",
          "History"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 19,
        "period": "user/month",
        "description": "Self-hosted",
        "features": [
          "Self-hosted",
          "SSO",
          "Audit logs"
        ]
      }
    ],
    "notes": "Open-source Postman alternative."
  },
  "k6": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://k6.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Local execution",
          "Scripting",
          "Metrics",
          "Thresholds"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud Free",
        "price": 0,
        "description": "50 VUh",
        "features": [
          "50 VUh/mo",
          "Cloud execution",
          "Dashboards"
        ]
      },
      {
        "name": "Cloud",
        "price": 99,
        "period": "month",
        "description": "500 VUh",
        "features": [
          "500 VUh",
          "Team features",
          "Support"
        ]
      }
    ],
    "notes": "Open-source load testing. Cloud for scaling."
  },
  "gatling": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://gatling.io/pricing",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Free",
        "features": [
          "Load testing",
          "Scala DSL",
          "Reports"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Cloud",
          "Real-time metrics",
          "Support"
        ]
      }
    ],
    "notes": "Open-source load testing tool."
  },
  "locust": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://locust.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Python scripting",
          "Distributed",
          "Web UI",
          "Real-time stats"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Python-based."
  },
  "artillery": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.artillery.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Load testing",
          "YAML config",
          "Plugins"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "Teams",
        "features": [
          "Cloud runs",
          "Dashboards",
          "Team features"
        ]
      }
    ],
    "notes": "Open-source load testing. Cloud available."
  },
  "checkly": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.checklyhq.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Hobby",
        "features": [
          "10K check runs",
          "5 checks",
          "1 min frequency"
        ]
      },
      {
        "name": "Team",
        "price": 40,
        "period": "month",
        "description": "Starting",
        "features": [
          "50K runs",
          "50 checks",
          "30s frequency"
        ],
        "highlighted": true
      }
    ],
    "notes": "Synthetic monitoring. Free tier."
  },
  "percy": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.browserstack.com/percy/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "5K snapshots",
          "Unlimited users",
          "Unlimited projects"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 399,
        "period": "month",
        "description": "Starting",
        "features": [
          "25K snapshots",
          "Priority support",
          "Advanced"
        ]
      }
    ],
    "notes": "Visual testing. Free for open source."
  },
  "applitools": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://applitools.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "100 checkpoints",
          "AI visual testing",
          "1 user"
        ]
      },
      {
        "name": "Team",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited checkpoints",
          "Cross-browser",
          "Support"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI-powered visual testing."
  },
  "google-analytics": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://marketingplatform.google.com/about/analytics",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Standard",
        "features": [
          "Unlimited hits",
          "Basic reports",
          "Audiences",
          "Conversions"
        ],
        "highlighted": true
      },
      {
        "name": "Analytics 360",
        "price": 12500,
        "period": "month",
        "description": "Enterprise",
        "features": [
          "Unsampled data",
          "BigQuery export",
          "SLA"
        ]
      }
    ],
    "notes": "GA4 free for most sites. 360 for enterprise."
  },
  "plausible": {
    "startingPrice": 9,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://plausible.io/#pricing",
    "tiers": [
      {
        "name": "10K",
        "price": 9,
        "period": "month",
        "description": "10K views",
        "features": [
          "10K pageviews",
          "Unlimited sites",
          "Privacy-first"
        ],
        "highlighted": true
      },
      {
        "name": "100K",
        "price": 19,
        "period": "month",
        "description": "100K views",
        "features": [
          "100K pageviews",
          "All features",
          "Email reports"
        ]
      }
    ],
    "notes": "Privacy-focused. GDPR compliant."
  },
  "fathom": {
    "startingPrice": 14,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://usefathom.com/pricing",
    "tiers": [
      {
        "name": "100K",
        "price": 14,
        "period": "month",
        "description": "100K views",
        "features": [
          "100K pageviews",
          "Unlimited sites",
          "Privacy-first"
        ],
        "highlighted": true
      },
      {
        "name": "500K",
        "price": 34,
        "period": "month",
        "description": "500K views",
        "features": [
          "500K pageviews",
          "All features",
          "Email reports"
        ]
      }
    ],
    "notes": "Privacy-focused analytics. No cookie banners."
  },
  "umami": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://umami.is/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited sites",
          "Unlimited data",
          "Full control"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 9,
        "period": "month",
        "description": "100K events",
        "features": [
          "100K events",
          "Managed hosting",
          "Support"
        ]
      }
    ],
    "notes": "Open-source. Self-hosted free."
  },
  "simple-analytics": {
    "startingPrice": 0,
    "currency": "EUR",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.simpleanalytics.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever free",
        "features": [
          "1 user",
          "5 sites",
          "30-day retention"
        ]
      },
      {
        "name": "Simple",
        "price": 15,
        "period": "month",
        "description": "Individual",
        "features": [
          "1 user",
          "10 sites",
          "3-year retention",
          "Events collection"
        ],
        "highlighted": true
      },
      {
        "name": "Team",
        "price": 40,
        "period": "month",
        "description": "+€20/user",
        "features": [
          "2 users",
          "20 sites",
          "5-year retention",
          "Export API"
        ]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "description": "Custom limits",
        "features": [
          "Separated storage",
          "Uptime SLA",
          "Priority support"
        ]
      }
    ]
  },
  "matomo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 21,
    "pricingPageUrl": "https://matomo.org/pricing",
    "tiers": [
      {
        "name": "On-Premise",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Unlimited users",
          "100% data ownership",
          "Full features"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 19,
        "period": "month",
        "description": "50K hits",
        "features": [
          "50K hits",
          "Managed hosting",
          "Support"
        ]
      }
    ],
    "notes": "Open-source GA alternative. Self-hosted free."
  },
  "goatcounter": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.goatcounter.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Non-commercial",
        "features": [
          "Unlimited pageviews",
          "No tracking",
          "Privacy-first"
        ],
        "highlighted": true
      },
      {
        "name": "Personal",
        "price": 5,
        "period": "month",
        "description": "Commercial",
        "features": [
          "Commercial use",
          "Priority support",
          "Custom domain"
        ]
      }
    ],
    "notes": "Free for non-commercial. Privacy-focused."
  },
  "june": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.june.so/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K MAU",
        "features": [
          "1K active users",
          "Core analytics",
          "Slack alerts"
        ]
      },
      {
        "name": "Growth",
        "price": 149,
        "period": "month",
        "description": "10K MAU",
        "features": [
          "10K users",
          "Advanced reports",
          "API"
        ],
        "highlighted": true
      }
    ],
    "notes": "B2B product analytics. Free tier."
  },
  "redash": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://redash.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Query editor",
          "Visualizations",
          "Dashboards",
          "Alerts"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted."
  },
  "mode": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://mode.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited queries",
          "Community",
          "Public sharing"
        ]
      },
      {
        "name": "Studio",
        "price": 0,
        "period": "custom",
        "description": "Teams",
        "features": [
          "Team collaboration",
          "Private reports",
          "API"
        ],
        "highlighted": true
      }
    ],
    "notes": "Collaborative analytics. Free for personal."
  },
  "hex": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://hex.tech/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "3 projects",
          "1 editor",
          "SQL + Python"
        ]
      },
      {
        "name": "Team",
        "price": 50,
        "period": "editor/month",
        "description": "Teams",
        "features": [
          "Unlimited projects",
          "Collaboration",
          "Git sync"
        ],
        "highlighted": true
      }
    ],
    "notes": "Collaborative notebooks. Free tier."
  },
  "preset": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://preset.io/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "Apache Superset",
          "20 dashboards"
        ]
      },
      {
        "name": "Professional",
        "price": 20,
        "period": "user/month",
        "description": "Teams",
        "features": [
          "Unlimited dashboards",
          "SSO",
          "Support"
        ],
        "highlighted": true
      }
    ],
    "notes": "Managed Apache Superset. Free tier."
  },
  "lightdash": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.lightdash.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted",
          "dbt integration",
          "Charts"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 10,
        "period": "user/month",
        "description": "Managed",
        "features": [
          "Managed hosting",
          "Support",
          "SSO"
        ]
      }
    ],
    "notes": "Open-source BI for dbt. Self-hosted free."
  },
  "obs-studio": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://obsproject.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Streaming",
          "Recording",
          "Virtual camera",
          "Plugins"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Industry standard."
  },
  "restream": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://restream.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "2 channels",
        "features": [
          "2 channels",
          "Restream branding",
          "Basic analytics"
        ]
      },
      {
        "name": "Standard",
        "price": 16,
        "period": "month",
        "description": "Annual",
        "features": [
          "5 channels",
          "No branding",
          "Recording"
        ],
        "highlighted": true
      }
    ],
    "notes": "Multi-platform streaming."
  },
  "imgix": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://imgix.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1000 images",
        "features": [
          "1000 origin images",
          "Basic transformations",
          "CDN"
        ]
      },
      {
        "name": "Starter",
        "price": 10,
        "period": "month",
        "description": "Annual",
        "features": [
          "10K images",
          "All features",
          "Priority CDN"
        ],
        "highlighted": true
      }
    ],
    "notes": "Image processing and CDN."
  },
  "mux": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.mux.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Pay as you go",
        "features": [
          "$0.00 to start",
          "Video encoding",
          "Streaming",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Video infrastructure. Pay per use."
  },
  "vimeo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://vimeo.com/upgrade",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "500MB/week upload",
          "Unlimited views",
          "Basic privacy"
        ]
      },
      {
        "name": "Starter",
        "price": 9,
        "period": "month",
        "description": "Annual",
        "features": [
          "60 videos/year",
          "Advanced privacy",
          "Player customization"
        ],
        "highlighted": true
      }
    ],
    "notes": "Video hosting platform. Free tier."
  },
  "wistia": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://wistia.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 videos",
        "features": [
          "3 videos",
          "250 plays/mo",
          "Basic player"
        ]
      },
      {
        "name": "Plus",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "10 videos",
          "Unlimited plays",
          "Lead capture"
        ],
        "highlighted": true
      }
    ],
    "notes": "Business video hosting."
  },
  "bannerbear": {
    "startingPrice": 49,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 7,
    "pricingPageUrl": "https://www.bannerbear.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 49,
        "period": "month",
        "description": "1K images",
        "features": [
          "1000 images/mo",
          "1 project",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 149,
        "period": "month",
        "description": "10K images",
        "features": [
          "10K images",
          "5 projects",
          "Priority support"
        ]
      }
    ],
    "notes": "Auto-generated images and videos."
  },
  "placid": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://placid.app/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50 images",
        "features": [
          "50 images/mo",
          "1 project",
          "Watermark"
        ]
      },
      {
        "name": "Starter",
        "price": 29,
        "period": "month",
        "description": "1K images",
        "features": [
          "1000 images",
          "2 projects",
          "No watermark"
        ],
        "highlighted": true
      }
    ],
    "notes": "Auto-generate images from templates."
  },
  "remotion": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.remotion.dev/license",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "React videos",
          "Full features",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Company",
        "price": 15,
        "period": "dev/month",
        "description": "Per developer",
        "features": [
          "Commercial use",
          "Priority support",
          "Team license"
        ]
      }
    ],
    "notes": "Programmatic video in React."
  },
  "ffmpeg": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://ffmpeg.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Video conversion",
          "Audio processing",
          "Streaming",
          "All formats"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Universal media tool."
  },
  "handbrake": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://handbrake.fr",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Video transcoding",
          "Presets",
          "Batch encoding",
          "Cross-platform"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source video transcoder."
  },
  "screenflow": {
    "startingPrice": 169,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.telestream.net/screenflow",
    "tiers": [
      {
        "name": "Full License",
        "price": 169,
        "period": "once",
        "description": "One-time",
        "features": [
          "Screen recording",
          "Video editing",
          "Motion graphics",
          "Export options"
        ],
        "highlighted": true
      }
    ],
    "notes": "Mac screen recording. One-time purchase."
  },
  "camtasia": {
    "startingPrice": 179.88,
    "currency": "USD",
    "billingPeriod": "year",
    "hasFreeTrial": true,
    "freeTrialDays": 3,
    "pricingPageUrl": "https://www.techsmith.com/store/camtasia",
    "tiers": [
      {
        "name": "Individual",
        "price": 179.88,
        "period": "year",
        "description": "Annual",
        "features": [
          "Screen recording",
          "Video editing",
          "Templates",
          "Assets"
        ],
        "highlighted": true
      },
      {
        "name": "Perpetual",
        "price": 299.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Lifetime license",
          "1 year maintenance",
          "All features"
        ]
      }
    ],
    "notes": "Screen recording and video editing."
  },
  "snagit": {
    "startingPrice": 62.99,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "freeTrialDays": 15,
    "pricingPageUrl": "https://www.techsmith.com/store/snagit",
    "tiers": [
      {
        "name": "Full License",
        "price": 62.99,
        "period": "once",
        "description": "One-time",
        "features": [
          "Screenshots",
          "Screen recording",
          "Annotations",
          "Templates"
        ],
        "highlighted": true
      }
    ],
    "notes": "Screenshot and recording tool."
  },
  "cleanshot": {
    "startingPrice": 29,
    "currency": "USD",
    "billingPeriod": "once",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://cleanshot.com",
    "tiers": [
      {
        "name": "One-time",
        "price": 29,
        "period": "once",
        "description": "Basic",
        "features": [
          "Screenshots",
          "Screen recording",
          "Annotations",
          "Cloud 1GB"
        ]
      },
      {
        "name": "Cloud",
        "price": 8,
        "period": "month",
        "description": "Pro",
        "features": [
          "Unlimited cloud",
          "Quick access",
          "Share links"
        ],
        "highlighted": true
      }
    ],
    "notes": "Mac screenshot tool. One-time + cloud."
  },
  "slite": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://slite.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50 docs",
        "features": [
          "50 docs",
          "Unlimited members",
          "Basic features"
        ]
      },
      {
        "name": "Standard",
        "price": 8,
        "period": "member/month",
        "description": "Annual",
        "features": [
          "Unlimited docs",
          "Integrations",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Team knowledge base. Free tier."
  },
  "outline": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.getoutline.com/pricing",
    "tiers": [
      {
        "name": "Self-hosted",
        "price": 0,
        "description": "Open source",
        "features": [
          "Full features",
          "Self-hosted",
          "No limits"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 6,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Managed hosting",
          "SSO",
          "Support"
        ]
      }
    ],
    "notes": "Open-source wiki. Self-hosted free."
  },
  "bookstack": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.bookstackapp.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted",
          "WYSIWYG editor",
          "Diagram drawing",
          "Multi-language"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source wiki platform."
  },
  "wiki-js": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://js.wiki",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Self-hosted",
          "100+ modules",
          "Git sync",
          "Auth providers"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source wiki engine."
  },
  "tettra": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://tettra.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 users",
        "features": [
          "10 users",
          "50 pages",
          "Slack integration"
        ]
      },
      {
        "name": "Scaling",
        "price": 8.33,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited pages",
          "Analytics",
          "SSO"
        ],
        "highlighted": true
      }
    ],
    "notes": "Knowledge base for teams. Free tier."
  },
  "guru": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.getguru.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "3 users",
        "features": [
          "3 users",
          "Basic features",
          "Chrome extension"
        ]
      },
      {
        "name": "Builder",
        "price": 10,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited users",
          "Analytics",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Knowledge management. Free for 3 users."
  },
  "slab": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://slab.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "10 users",
        "features": [
          "10 users",
          "Basic features",
          "Unlimited docs"
        ]
      },
      {
        "name": "Startup",
        "price": 6.67,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "All integrations",
          "Analytics",
          "SAML"
        ],
        "highlighted": true
      }
    ],
    "notes": "Modern knowledge base. Free tier."
  },
  "helpjuice": {
    "startingPrice": 120,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://helpjuice.com/pricing",
    "tiers": [
      {
        "name": "Starter",
        "price": 120,
        "period": "month",
        "description": "4 users",
        "features": [
          "4 users",
          "All features",
          "AI search"
        ],
        "highlighted": true
      },
      {
        "name": "Run-Up",
        "price": 200,
        "period": "month",
        "description": "16 users",
        "features": [
          "16 users",
          "All features",
          "Priority support"
        ]
      }
    ],
    "notes": "Enterprise knowledge base."
  },
  "document360": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://document360.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "2 accounts",
        "features": [
          "2 team accounts",
          "50 articles",
          "Public docs"
        ]
      },
      {
        "name": "Standard",
        "price": 149,
        "period": "month",
        "description": "3 accounts",
        "features": [
          "3 accounts",
          "Unlimited articles",
          "Private docs"
        ],
        "highlighted": true
      }
    ],
    "notes": "Knowledge base for software."
  },
  "archbee": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.archbee.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "Unlimited docs",
          "Basic features"
        ]
      },
      {
        "name": "Team",
        "price": 8,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Custom domains",
          "Advanced permissions",
          "Analytics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Developer documentation tool."
  },
  "nuclino": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.nuclino.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50 items",
        "features": [
          "50 items",
          "2GB storage",
          "Basic features"
        ]
      },
      {
        "name": "Standard",
        "price": 5,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited items",
          "10GB storage",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Lightweight wiki. Free tier."
  },
  "clickup-docs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://clickup.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Forever",
        "features": [
          "100MB storage",
          "Unlimited tasks",
          "Docs included"
        ]
      },
      {
        "name": "Unlimited",
        "price": 7,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited storage",
          "Unlimited integrations",
          "Dashboards"
        ],
        "highlighted": true
      }
    ],
    "notes": "Docs built into ClickUp. Free tier."
  },
  "dropbox-paper": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.dropbox.com/paper",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "With Dropbox",
        "features": [
          "Real-time collaboration",
          "Task management",
          "Templates",
          "Dropbox integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free with Dropbox account."
  },
  "fathom-analytics": {
    "startingPrice": 15,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://usefathom.com/pricing",
    "tiers": [
      {
        "name": "100K",
        "price": 15,
        "period": "month",
        "description": "Up to 100K pageviews",
        "features": [
          "50 sites",
          "Permanent retention",
          "API access"
        ],
        "highlighted": true
      },
      {
        "name": "200K",
        "price": 25,
        "period": "month",
        "description": "Up to 200K pageviews",
        "features": [
          "All features included"
        ]
      },
      {
        "name": "500K",
        "price": 45,
        "period": "month",
        "description": "Up to 500K pageviews",
        "features": [
          "All features included"
        ]
      },
      {
        "name": "1M",
        "price": 60,
        "period": "month",
        "description": "Up to 1M pageviews",
        "features": [
          "All features included"
        ]
      }
    ],
    "notes": "Annual billing saves 17%. E-commerce/event tracking included."
  },
  "google-forms": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.google.com/forms/about",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "With Google account",
        "features": [
          "Unlimited forms",
          "Unlimited responses",
          "Google Sheets integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free with Google account."
  },
  "airtable-forms": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://airtable.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "1000 records/base",
          "1GB attachments",
          "Forms included"
        ]
      },
      {
        "name": "Team",
        "price": 20,
        "period": "seat/month",
        "description": "Annual",
        "features": [
          "50K records/base",
          "20GB",
          "Extensions"
        ],
        "highlighted": true
      }
    ],
    "notes": "Forms linked to Airtable bases."
  },
  "paperform": {
    "startingPrice": 20,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://paperform.co/pricing",
    "tiers": [
      {
        "name": "Essentials",
        "price": 20,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited forms",
          "1K submissions/mo",
          "Payments"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 40,
        "period": "month",
        "description": "Annual",
        "features": [
          "10K submissions",
          "Custom PDF",
          "Priority support"
        ]
      }
    ],
    "notes": "Beautiful forms with payments."
  },
  "cognito-forms": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.cognitoforms.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited forms",
          "500 entries/mo",
          "Calculations"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 15,
        "period": "month",
        "description": "Annual",
        "features": [
          "2000 entries",
          "File uploads",
          "Custom branding"
        ]
      }
    ],
    "notes": "Free form builder with calculations."
  },
  "wufoo": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.wufoo.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "5 forms",
          "100 entries/mo",
          "10 fields/form"
        ]
      },
      {
        "name": "Starter",
        "price": 14.08,
        "period": "month",
        "description": "Annual",
        "features": [
          "10 forms",
          "1K entries",
          "Payments"
        ],
        "highlighted": true
      }
    ],
    "notes": "Simple form builder. Free tier."
  },
  "fillout": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.fillout.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1K responses",
        "features": [
          "1K responses/mo",
          "Unlimited forms",
          "Most features"
        ],
        "highlighted": true
      },
      {
        "name": "Starter",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "5K responses",
          "Custom domains",
          "Zapier"
        ]
      }
    ],
    "notes": "Modern form builder. Generous free tier."
  },
  "formspark": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://formspark.io/#pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "250 submissions",
        "features": [
          "250 submissions",
          "Unlimited forms",
          "Spam protection"
        ],
        "highlighted": true
      },
      {
        "name": "Personal",
        "price": 25,
        "period": "once",
        "description": "1K submissions",
        "features": [
          "1K submissions",
          "No monthly fee",
          "File uploads"
        ]
      }
    ],
    "notes": "Static form backend. Free tier."
  },
  "formspree": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://formspree.io/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50 submissions",
        "features": [
          "50 submissions/mo",
          "Unlimited forms",
          "Email only"
        ],
        "highlighted": true
      },
      {
        "name": "Gold",
        "price": 10,
        "period": "month",
        "description": "Monthly",
        "features": [
          "1K submissions",
          "File uploads",
          "AJAX support"
        ]
      }
    ],
    "notes": "Form backend for developers."
  },
  "basin": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://usebasin.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 submissions",
        "features": [
          "100 submissions/mo",
          "Unlimited forms",
          "Spam filtering"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 9,
        "period": "month",
        "description": "Monthly",
        "features": [
          "5K submissions",
          "Integrations",
          "File uploads"
        ]
      }
    ],
    "notes": "Form backend service."
  },
  "getform": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://getform.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "50 submissions",
        "features": [
          "50 submissions/mo",
          "1 form",
          "Email notifications"
        ],
        "highlighted": true
      },
      {
        "name": "Starter",
        "price": 9,
        "period": "month",
        "description": "Monthly",
        "features": [
          "1K submissions",
          "Unlimited forms",
          "File uploads"
        ]
      }
    ],
    "notes": "Form backend for static sites."
  },
  "reform": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.reform.app/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 responses",
        "features": [
          "100 responses/mo",
          "Unlimited forms",
          "Basic logic"
        ]
      },
      {
        "name": "Starter",
        "price": 19,
        "period": "month",
        "description": "Annual",
        "features": [
          "1K responses",
          "Custom branding",
          "Webhooks"
        ],
        "highlighted": true
      }
    ],
    "notes": "Form builder for teams."
  },
  "heyflow": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://heyflow.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 leads",
        "features": [
          "100 leads/mo",
          "1 flow",
          "HeyFlow branding"
        ]
      },
      {
        "name": "Starter",
        "price": 59,
        "period": "month",
        "description": "Annual",
        "features": [
          "500 leads",
          "3 flows",
          "Custom branding"
        ],
        "highlighted": true
      }
    ],
    "notes": "Interactive flow builder."
  },
  "involve-me": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.involve.me/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 submissions",
        "features": [
          "100 submissions/mo",
          "Basic features",
          "Branding"
        ]
      },
      {
        "name": "Starter",
        "price": 29,
        "period": "month",
        "description": "Annual",
        "features": [
          "1K submissions",
          "Custom branding",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Interactive content builder."
  },
  "tripetto": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://tripetto.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Trial",
        "features": [
          "Limited responses",
          "Basic features",
          "Tripetto branding"
        ]
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "year",
        "description": "Annual",
        "features": [
          "5K responses",
          "Custom branding",
          "Integrations"
        ],
        "highlighted": true
      }
    ],
    "notes": "Conversational form builder."
  },
  "feathery": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.feathery.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "100 submissions",
        "features": [
          "100 submissions/mo",
          "Unlimited forms",
          "Basic features"
        ]
      },
      {
        "name": "Startup",
        "price": 49,
        "period": "month",
        "description": "Annual",
        "features": [
          "2500 submissions",
          "Custom branding",
          "Logic"
        ],
        "highlighted": true
      }
    ],
    "notes": "No-code form builder."
  },
  "tray-io": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://tray.io/pricing",
    "tiers": [
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Universal automation",
          "API platform",
          "Enterprise security"
        ],
        "highlighted": true
      }
    ],
    "notes": "Enterprise automation platform."
  },
  "workato": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.workato.com/pricing",
    "tiers": [
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited recipes",
          "Enterprise connectors",
          "On-premise agents"
        ],
        "highlighted": true
      }
    ],
    "notes": "Enterprise automation and integration."
  },
  "rapidapi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://rapidapi.com/products/api-hub-pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free",
        "features": [
          "1M API calls",
          "Standard support",
          "All APIs"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 20,
        "period": "month",
        "description": "Monthly",
        "features": [
          "3M calls",
          "Priority support",
          "Analytics"
        ]
      }
    ],
    "notes": "API marketplace. Free tier."
  },
  "postman-api": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.postman.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individual",
        "features": [
          "Unlimited collections",
          "1K API calls",
          "3 users"
        ],
        "highlighted": true
      },
      {
        "name": "Basic",
        "price": 14,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Unlimited API calls",
          "Roles",
          "Integrations"
        ]
      }
    ],
    "notes": "API platform. Free for individuals."
  },
  "kong": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://konghq.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "API gateway",
          "Plugins",
          "Community support"
        ],
        "highlighted": true
      },
      {
        "name": "Plus",
        "price": 0,
        "period": "custom",
        "description": "Enterprise",
        "features": [
          " Enterprise plugins",
          "Support",
          "GUI"
        ]
      }
    ],
    "notes": "Open-source API gateway."
  },
  "gravitee": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://www.gravitee.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "API management",
          "Gateway",
          "Developer portal"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Advanced features",
          "Support",
          "SLA"
        ]
      }
    ],
    "notes": "Open-source API management."
  },
  "stoplight": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 14,
    "pricingPageUrl": "https://stoplight.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "5 projects",
          "Unlimited users",
          "Basic features"
        ]
      },
      {
        "name": "Starter",
        "price": 99,
        "period": "month",
        "description": "Team",
        "features": [
          "10 projects",
          "Custom branding",
          "SSO"
        ],
        "highlighted": true
      }
    ],
    "notes": "API design platform."
  },
  "swagger": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://swagger.io/tools/swaggerhub/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Swagger Editor",
          "Swagger UI",
          "Codegen"
        ],
        "highlighted": true
      },
      {
        "name": "SwaggerHub",
        "price": 0,
        "period": "custom",
        "description": "Teams",
        "features": [
          "Collaboration",
          "Hosting",
          "Versioning"
        ]
      }
    ],
    "notes": "OpenAPI tools. Open source core."
  },
  "webhook-site": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://webhook.site",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Basic",
        "features": [
          "500 requests/day",
          "Temporary URLs",
          "JSON viewer"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 9,
        "period": "month",
        "description": "Annual",
        "features": [
          "Unlimited requests",
          "Custom URLs",
          "API access"
        ]
      }
    ],
    "notes": "Webhook testing tool."
  },
  "ngrok": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://ngrok.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 domain",
          "20K requests/mo",
          "Basic features"
        ],
        "highlighted": true
      },
      {
        "name": "Personal",
        "price": 8,
        "period": "month",
        "description": "Monthly",
        "features": [
          "3 domains",
          "Unlimited requests",
          "Reserved domains"
        ]
      }
    ],
    "notes": "Secure tunnels for localhost."
  },
  "localtunnel": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://localtunnel.me",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Localhost tunnel",
          "Random subdomain",
          "No signup"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source."
  },
  "mockoon": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://mockoon.com/pro",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Free",
        "features": [
          "Mock APIs",
          "Desktop app",
          "CLI"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 25,
        "period": "month",
        "description": "Cloud sync",
        "features": [
          "Cloud sync",
          "Team sharing",
          "Enterprise support"
        ]
      }
    ],
    "notes": "API mocking tool. Open source."
  },
  "mockapi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://mockapi.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "1 project",
        "features": [
          "1 project",
          "4 resources",
          "Basic features"
        ]
      },
      {
        "name": "Basic",
        "price": 4,
        "period": "month",
        "description": "Monthly",
        "features": [
          "3 projects",
          "Unlimited resources",
          "Custom domains"
        ],
        "highlighted": true
      }
    ],
    "notes": "Mock API generator."
  },
  "apiary": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://apiary.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "1 API project",
          "Mock server",
          "Documentation"
        ]
      },
      {
        "name": "Team",
        "price": 99,
        "period": "month",
        "description": "5 users",
        "features": [
          "5 projects",
          "Team collaboration",
          "Traffic inspector"
        ],
        "highlighted": true
      }
    ],
    "notes": "API design and documentation."
  },
  "sourcehut": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://sourcehut.org/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Git hosting",
          "CI/CD",
          "Mailing lists"
        ],
        "highlighted": true
      },
      {
        "name": "Paid",
        "price": 20,
        "period": "year",
        "description": "Support",
        "features": [
          "Priority support",
          "Larger limits",
          "Support project"
        ]
      }
    ],
    "notes": "Minimal code forge. Free for OSS."
  },
  "gitea": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gitea.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Git hosting",
          "CI/CD",
          "Packages",
          "Wikis"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Self-hosted."
  },
  "gogs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gogs.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Self-hosted",
        "features": [
          "Git hosting",
          "Lightweight",
          "Cross-platform"
        ],
        "highlighted": true
      }
    ],
    "notes": "Painless self-hosted Git. Open source."
  },
  "codeberg": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://codeberg.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Non-profit",
        "features": [
          "Git hosting",
          "CI/CD",
          "Pages",
          "Open source"
        ],
        "highlighted": true
      }
    ],
    "notes": "Non-profit Git hosting. Free."
  },
  "sr-ht": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://sr.ht",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Git/Mercurial",
          "CI/CD",
          "Mailing lists"
        ],
        "highlighted": true
      },
      {
        "name": "Supporter",
        "price": 2,
        "period": "month",
        "description": "Support",
        "features": [
          "Priority support",
          "Sustain project"
        ]
      }
    ],
    "notes": "Hacker-focused code forge."
  },
  "perforce": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://www.perforce.com/products/helix-core/free-version-control",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "20 workspaces",
          "Full features"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Unlimited users",
          "Enterprise support",
          "SLA"
        ]
      }
    ],
    "notes": "Enterprise version control. Free for 5."
  },
  "plastic-scm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.plasticscm.com/pricing",
    "tiers": [
      {
        "name": "Community",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited repos",
          "3 users",
          "Gluon support"
        ],
        "highlighted": true
      },
      {
        "name": "Cloud",
        "price": 9,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "Unlimited users",
          "Cloud hosting",
          "Support"
        ]
      }
    ],
    "notes": "Version control for games/art. Free tier."
  },
  "fossil": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fossil-scm.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Version control",
          "Wiki",
          "Bug tracking",
          "Forum"
        ],
        "highlighted": true
      }
    ],
    "notes": "All-in-one SCM. Free and open source."
  },
  "aws-codecommit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://aws.amazon.com/codecommit/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 active users",
          "50GB storage",
          "10K requests"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 0.001,
        "period": "per request",
        "description": "Usage",
        "features": [
          "$1/user",
          "$.06/GB",
          "Unlimited"
        ]
      }
    ],
    "notes": "AWS Git hosting. Free tier."
  },
  "google-cloud-source": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://cloud.google.com/source-repositories/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "5 users",
        "features": [
          "5 users",
          "50GB storage",
          "Unlimited repos"
        ],
        "highlighted": true
      },
      {
        "name": "Pay as you go",
        "price": 1,
        "period": "user/month",
        "description": "Usage",
        "features": [
          "$1/user",
          "$.10/GB storage"
        ]
      }
    ],
    "notes": "GCP Git hosting. Free for 5 users."
  },
  "podman": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://podman.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Daemonless",
          "Rootless",
          "Docker compatible",
          "Pods"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Red Hat."
  },
  "containerd": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://containerd.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Container runtime",
          "CNCF graduated",
          "Industry standard"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF graduated."
  },
  "helm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://helm.sh",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Package manager",
          "Charts",
          "Templating",
          "Releases"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. CNCF project."
  },
  "minikube": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://minikube.sigs.k8s.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Local K8s",
          "Multi-node",
          "Addons",
          "Multi-driver"
        ],
        "highlighted": true
      }
    ],
    "notes": "Local Kubernetes for development."
  },
  "kind": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://kind.sigs.k8s.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "K8s in Docker",
          "CI testing",
          "Multi-node",
          "Fast startup"
        ],
        "highlighted": true
      }
    ],
    "notes": "Kubernetes in Docker. For testing."
  },
  "docker-compose": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://docs.docker.com/compose",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Included",
        "features": [
          "Multi-container apps",
          "YAML config",
          "Docker integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free with Docker."
  },
  "docker-swarm": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://docs.docker.com/engine/swarm",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Included",
        "features": [
          "Container orchestration",
          "Native Docker",
          "Simple setup"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free with Docker."
  },
  "nomad": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.hashicorp.com/products/nomad/pricing",
    "tiers": [
      {
        "name": "Open Source",
        "price": 0,
        "description": "Free",
        "features": [
          "Orchestration",
          "Multi-cloud",
          "Integrations"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Namespaces",
          "SSO",
          "Audit logging"
        ]
      }
    ],
    "notes": "HashiCorp orchestrator. Open source."
  },
  "eks": {
    "startingPrice": 0.1,
    "currency": "USD",
    "billingPeriod": "hour",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://aws.amazon.com/eks/pricing",
    "tiers": [
      {
        "name": "Pay as you go",
        "price": 0.1,
        "period": "cluster/hour",
        "description": "Usage",
        "features": [
          "Managed K8s",
          "AWS integration",
          "Auto-scaling"
        ],
        "highlighted": true
      }
    ],
    "notes": "AWS managed Kubernetes. $72/mo per cluster."
  },
  "gke": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://cloud.google.com/kubernetes-engine/pricing",
    "tiers": [
      {
        "name": "Autopilot",
        "price": 0.1,
        "period": "cluster/hour",
        "description": "Managed",
        "features": [
          "Fully managed",
          "Per-pod billing",
          "Auto-scaling"
        ],
        "highlighted": true
      },
      {
        "name": "Standard",
        "price": 0.1,
        "period": "cluster/hour",
        "description": "Control",
        "features": [
          "Node management",
          "GPU support",
          "More control"
        ]
      }
    ],
    "notes": "Google managed Kubernetes."
  },
  "aks": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://azure.microsoft.com/pricing/details/kubernetes-service",
    "tiers": [
      {
        "name": "Free tier",
        "price": 0,
        "description": "Usage",
        "features": [
          "Free control plane",
          "Pay for nodes",
          "Azure integration"
        ],
        "highlighted": true
      }
    ],
    "notes": "Azure Kubernetes. Free control plane."
  },
  "openshift": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 60,
    "pricingPageUrl": "https://www.redhat.com/en/technologies/cloud-computing/openshift/pricing",
    "tiers": [
      {
        "name": "Developer Sandbox",
        "price": 0,
        "description": "Free trial",
        "features": [
          "Free cluster",
          "30-day access",
          "Learning"
        ]
      },
      {
        "name": "Kubernetes",
        "price": 0,
        "period": "custom",
        "description": "Custom",
        "features": [
          "Enterprise K8s",
          "Support",
          "Security"
        ],
        "highlighted": true
      }
    ],
    "notes": "Red Hat enterprise Kubernetes."
  },
  "react-devtools": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://react.dev/learn/react-developer-tools",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "Component tree",
          "Props/State",
          "Profiler",
          "Chrome/Firefox"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free browser extension from React team."
  },
  "redux-devtools": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/reduxjs/redux-devtools",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "Time travel",
          "Action log",
          "State diff",
          "Import/Export"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free browser extension."
  },
  "vue-devtools": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://devtools.vuejs.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "Component tree",
          "Vuex/Pinia",
          "Router",
          "Timeline"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free browser extension from Vue team."
  },
  "lighthouse": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://developer.chrome.com/docs/lighthouse",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Built-in",
        "features": [
          "Performance audit",
          "Accessibility",
          "SEO",
          "PWA checks"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free. Built into Chrome DevTools."
  },
  "web-vitals": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://web.dev/vitals",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "LCP",
          "FID",
          "CLS",
          "Real-time metrics"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free extension from Google."
  },
  "wappalyzer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.wappalyzer.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "Tech detection",
          "Browser extension",
          "Basic lookup"
        ]
      },
      {
        "name": "Pro",
        "price": 99,
        "period": "month",
        "description": "API",
        "features": [
          "API access",
          "Bulk lookup",
          "Lead lists"
        ],
        "highlighted": true
      }
    ],
    "notes": "Technology profiler. Extension free."
  },
  "builtwith": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://builtwith.com/plans",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "Basic detection",
          "Browser extension",
          "Tech lookup"
        ]
      },
      {
        "name": "Basic",
        "price": 295,
        "period": "month",
        "description": "API",
        "features": [
          "API access",
          "5K lookups",
          "Tech reports"
        ],
        "highlighted": true
      }
    ],
    "notes": "Technology lookup. Extension free."
  },
  "json-viewer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://chrome.google.com/webstore",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "JSON formatting",
          "Syntax highlighting",
          "Collapsible tree",
          "Search"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free browser extension."
  },
  "octotree": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.octotree.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Public repos",
        "features": [
          "File tree",
          "GitHub integration",
          "Code navigation"
        ]
      },
      {
        "name": "Pro",
        "price": 4,
        "period": "month",
        "description": "Annual",
        "features": [
          "Private repos",
          "Multiple themes",
          "Bookmarks"
        ],
        "highlighted": true
      }
    ],
    "notes": "GitHub code tree. Free for public."
  },
  "refined-github": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/refined-github/refined-github",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Extension",
        "features": [
          "GitHub enhancements",
          "Keyboard shortcuts",
          "UI improvements"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source."
  },
  "github-copilot": {
    "startingPrice": 10,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://github.com/features/copilot",
    "tiers": [
      {
        "name": "Individual",
        "price": 10,
        "period": "month",
        "description": "Monthly",
        "features": [
          "Code completion",
          "Chat",
          "All IDEs"
        ],
        "highlighted": true
      },
      {
        "name": "Business",
        "price": 19,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "Organization policies",
          "Admin console",
          "IP indemnity"
        ]
      }
    ],
    "notes": "AI coding assistant. Free for students/OSS."
  },
  "tabnine": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "pricingPageUrl": "https://www.tabnine.com/pricing",
    "tiers": [
      {
        "name": "Basic",
        "price": 0,
        "description": "Free",
        "features": [
          "Short completions",
          "All IDEs",
          "Local models"
        ]
      },
      {
        "name": "Pro",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "Full completions",
          "Chat",
          "Code review"
        ],
        "highlighted": true
      }
    ],
    "notes": "AI code completion. Free tier."
  },
  "codeium": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://codeium.com/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 0,
        "description": "Free forever",
        "features": [
          "Unlimited completions",
          "Chat",
          "All IDEs"
        ],
        "highlighted": true
      },
      {
        "name": "Teams",
        "price": 12,
        "period": "user/month",
        "description": "Annual",
        "features": [
          "Admin console",
          "Usage analytics",
          "Support"
        ]
      }
    ],
    "notes": "Free AI coding assistant."
  },
  "amazon-codewhisperer": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://aws.amazon.com/codewhisperer/pricing",
    "tiers": [
      {
        "name": "Individual",
        "price": 0,
        "description": "Free",
        "features": [
          "Unlimited suggestions",
          "Security scans",
          "All IDEs"
        ],
        "highlighted": true
      },
      {
        "name": "Professional",
        "price": 19,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "Admin controls",
          "SSO",
          "Policy management"
        ]
      }
    ],
    "notes": "AWS AI coding. Free for individuals."
  },
  "continue-dev": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://continue.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Code completion",
          "Chat",
          "Custom models",
          "Local LLMs"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source AI assistant."
  },
  "sourcegraph": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": true,
    "freeTrialDays": 30,
    "pricingPageUrl": "https://about.sourcegraph.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Individuals",
        "features": [
          "Code search",
          "Cody AI",
          "Basic features"
        ],
        "highlighted": true
      },
      {
        "name": "Pro",
        "price": 9,
        "period": "user/month",
        "description": "Monthly",
        "features": [
          "Unlimited Cody",
          "Private repos",
          "Batch changes"
        ]
      }
    ],
    "notes": "Code search and AI. Free tier."
  },
  "liveshare": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://visualstudio.microsoft.com/services/live-share",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "VS Code",
        "features": [
          "Real-time collab",
          "Shared terminal",
          "Voice chat",
          "Debugging"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free with VS Code."
  },
  "codepen": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://codepen.io/features/pro",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Starter",
        "features": [
          "Unlimited pens",
          "Public projects",
          "Embed pens"
        ]
      },
      {
        "name": "Pro",
        "price": 8,
        "period": "month",
        "description": "Annual",
        "features": [
          "Private pens",
          "Asset hosting",
          "Collab mode"
        ],
        "highlighted": true
      }
    ],
    "notes": "Frontend playground. Free tier."
  },
  "codesandbox": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://codesandbox.io/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited sandboxes",
          "Public projects",
          "Live preview"
        ]
      },
      {
        "name": "Pro",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "Private sandboxes",
          "GitHub sync",
          "Custom RAM"
        ],
        "highlighted": true
      }
    ],
    "notes": "Cloud IDE. Free tier."
  },
  "stackblitz": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://stackblitz.com/pricing",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Personal",
        "features": [
          "Unlimited projects",
          "Web containers",
          "GitHub import"
        ]
      },
      {
        "name": "Personal",
        "price": 12,
        "period": "month",
        "description": "Annual",
        "features": [
          "Private projects",
          "Full Node.js",
          "More memory"
        ],
        "highlighted": true
      }
    ],
    "notes": "Instant dev environments. Free tier."
  },
  "nextjs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://nextjs.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "React framework",
          "SSR/SSG",
          "API routes",
          "App Router"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source from Vercel."
  },
  "nuxt": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://nuxt.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Vue framework",
          "SSR/SSG",
          "Auto-imports",
          "Modules"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Vue framework."
  },
  "remix": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://remix.run",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "React framework",
          "Nested routes",
          "Data loading",
          "Web standards"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Now Shopify."
  },
  "sveltekit": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://kit.svelte.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Svelte framework",
          "SSR/SSG",
          "File routing",
          "Adapters"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Svelte framework."
  },
  "astro": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://astro.build",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Static site builder",
          "Islands architecture",
          "Any UI framework"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source."
  },
  "express": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://expressjs.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Node.js framework",
          "Middleware",
          "Routing",
          "Templates"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Most popular."
  },
  "fastify": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.fastify.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Fast Node.js",
          "Plugins",
          "TypeScript",
          "JSON Schema"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Fast."
  },
  "nestjs": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://nestjs.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "TypeScript framework",
          "Decorators",
          "Modules",
          "DI"
        ],
        "highlighted": true
      },
      {
        "name": "Enterprise",
        "price": 2000,
        "period": "year",
        "description": "Support",
        "features": [
          "Official support",
          "Priority issues",
          "Consulting"
        ]
      }
    ],
    "notes": "Free and open source Node.js framework."
  },
  "hono": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://hono.dev",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Ultra-fast",
          "Edge native",
          "TypeScript",
          "Multi-runtime"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Edge-first."
  },
  "elysia": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://elysiajs.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Bun native",
          "Type-safe",
          "Fast",
          "End-to-end typing"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Bun-first."
  },
  "django": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.djangoproject.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Python framework",
          "ORM",
          "Admin",
          "Batteries included"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Python framework."
  },
  "fastapi": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://fastapi.tiangolo.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Python API",
          "Auto docs",
          "Type hints",
          "Async"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Modern Python."
  },
  "flask": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://flask.palletsprojects.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Python micro",
          "Extensible",
          "Jinja2",
          "WSGI"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Python micro."
  },
  "rails": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://rubyonrails.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Ruby framework",
          "MVC",
          "ActiveRecord",
          "Convention"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Ruby framework."
  },
  "laravel": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://laravel.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "PHP framework",
          "Eloquent ORM",
          "Blade",
          "Artisan"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source PHP framework."
  },
  "spring-boot": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://spring.io/projects/spring-boot",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Java framework",
          "Auto-config",
          "Embedded servers",
          "Production-ready"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Java framework."
  },
  "gin": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gin-gonic.com",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Go framework",
          "Fast",
          "Middleware",
          "JSON validation"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Go framework."
  },
  "fiber": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://gofiber.io",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Go framework",
          "Express-like",
          "Fast",
          "Low memory"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Express for Go."
  },
  "actix-web": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://actix.rs",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Rust framework",
          "Type safe",
          "Fast",
          "Actor model"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Rust framework."
  },
  "axum": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://github.com/tokio-rs/axum",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Rust framework",
          "Tokio-based",
          "Tower",
          "Extractors"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source. Tokio team."
  },
  "phoenix": {
    "startingPrice": 0,
    "currency": "USD",
    "billingPeriod": "month",
    "hasFreeTrial": false,
    "pricingPageUrl": "https://www.phoenixframework.org",
    "tiers": [
      {
        "name": "Free",
        "price": 0,
        "description": "Open source",
        "features": [
          "Elixir framework",
          "LiveView",
          "Channels",
          "Fast"
        ],
        "highlighted": true
      }
    ],
    "notes": "Free and open source Elixir framework."
  }
};

// All handcrafted TLDRs (977 tools)
const allTLDRs: Record<string, string> = {
  "asana": "Task and project management for teams who need structure without complexity",
  "monday": "Visual work management that adapts to any workflow or team size",
  "trello": "Simple kanban boards for organizing anything, from projects to grocery lists",
  "jira": "The industry standard for software development tracking and agile workflows",
  "linear": "Fast, keyboard-first issue tracking built for modern dev teams",
  "notion": "All-in-one workspace combining docs, wikis, databases, and project boards",
  "clickup": "Feature-packed productivity platform that tries to replace everything else",
  "basecamp": "Opinionated project management that keeps teams focused on what matters",
  "wrike": "Enterprise work management with resource planning and proofing",
  "smartsheet": "Spreadsheet-based project management for complex enterprise workflows",
  "teamwork": "Agency-friendly project management with built-in time tracking and billing",
  "height": "AI-powered project tracking that automates the tedious parts",
  "slack": "Real-time messaging that replaced email for modern teams",
  "zoom": "Video conferencing that became a verb during the pandemic",
  "microsoft-teams": "Chat, calls, and collaboration baked into Microsoft 365",
  "discord": "Voice, video, and text chat originally for gamers, now used everywhere",
  "loom": "Async video messages that replace meetings and long emails",
  "miro": "Infinite whiteboard for brainstorming, diagramming, and visual collaboration",
  "figma": "Browser-based design tool where teams can collaborate in real-time",
  "github": "Where the world's code lives, plus CI/CD, issues, and project management",
  "gitlab": "Complete DevOps platform in a single application",
  "bitbucket": "Git repository hosting with Jira integration for Atlassian shops",
  "docker": "Containerization that made 'works on my machine' a solved problem",
  "vercel": "Deploy frontend apps in seconds with zero configuration",
  "netlify": "Modern web hosting with continuous deployment and serverless functions",
  "railway": "Deploy apps and databases from GitHub in one click",
  "render": "Cloud platform that makes deployment as easy as git push",
  "heroku": "The original easy deployment platform, now owned by Salesforce",
  "aws": "The cloud infrastructure that powers half the internet",
  "google-cloud": "Enterprise cloud with AI/ML strengths and BigQuery",
  "azure": "Microsoft's cloud, essential for enterprises running Windows",
  "digitalocean": "Simple cloud hosting without the AWS complexity tax",
  "cloudflare": "CDN, security, and serverless at the edge of the internet",
  "supabase": "Open-source Firebase alternative with Postgres and real-time",
  "firebase": "Google's app development platform with real-time database and auth",
  "planetscale": "Serverless MySQL with branching for schema changes",
  "mongodb": "Document database that made NoSQL mainstream",
  "redis": "In-memory data store for caching, queues, and real-time features",
  "chatgpt": "OpenAI's conversational AI that started the generative AI revolution",
  "claude": "Anthropic's AI assistant known for nuanced reasoning and long context",
  "midjourney": "AI image generation through Discord with distinctive artistic style",
  "stable-diffusion": "Open-source AI image generation you can run locally",
  "dall-e": "OpenAI's image generator integrated into ChatGPT Plus",
  "elevenlabs": "AI voice cloning and text-to-speech with stunning realism",
  "synthesia": "Create videos with AI avatars instead of filming yourself",
  "runway": "AI video generation and editing for creative professionals",
  "jasper": "AI writing assistant built for marketing and content teams",
  "copy-ai": "Generate marketing copy, emails, and content at scale",
  "writesonic": "AI content creation with built-in SEO optimization",
  "notion-ai": "AI writing and Q&A built directly into your Notion workspace",
  "grammarly": "AI writing assistant that catches more than just typos",
  "canva": "Design tool that makes everyone a graphic designer",
  "adobe-creative-cloud": "The professional creative suite: Photoshop, Illustrator, Premiere",
  "sketch": "Mac-native UI design tool that pioneered the modern design workflow",
  "invision": "Prototyping and collaboration for design teams",
  "framer": "Design tool that exports to production-ready websites",
  "webflow": "Visual web development platform with CMS and hosting",
  "bubble": "Build web apps visually without writing code",
  "hubspot": "All-in-one marketing, sales, and CRM platform that scales with you",
  "mailchimp": "Email marketing that grew up to become a full marketing platform",
  "klaviyo": "Email and SMS marketing built specifically for e-commerce",
  "sendgrid": "Transactional email API trusted by developers worldwide",
  "convertkit": "Email marketing built for creators",
  "activecampaign": "Marketing automation with advanced segmentation and CRM",
  "brevo": "Marketing platform with email, SMS, chat, and CRM in one",
  "drip": "E-commerce CRM and email marketing for online stores",
  "constant-contact": "Established email marketing for small businesses",
  "google-analytics": "The free analytics standard that tracks most websites",
  "mixpanel": "Product analytics focused on user behavior and events",
  "amplitude": "Product analytics with experimentation and feature flags",
  "hotjar": "See how users actually interact with your site via heatmaps and recordings",
  "heap": "Auto-capture analytics that retroactively answers any question",
  "posthog": "Open-source product analytics, session replay, and feature flags",
  "fullstory": "Digital experience intelligence through session replay",
  "pendo": "Product analytics with in-app guides for user onboarding",
  "segment": "Customer data platform that connects all your tools",
  "salesforce": "The CRM giant that enterprise sales teams love to hate",
  "pipedrive": "Visual sales pipeline management built for salespeople",
  "zoho-crm": "Full-featured CRM at a fraction of Salesforce's price",
  "close": "CRM built for inside sales teams who live on the phone",
  "freshsales": "AI-powered CRM from Freshworks with built-in phone and email",
  "zendesk": "Help desk software that scales from startup to enterprise",
  "intercom": "Customer messaging platform with AI-powered support",
  "freshdesk": "Help desk that balances features with usability",
  "help-scout": "Customer support software that feels like email",
  "crisp": "Live chat and customer messaging for modern businesses",
  "tidio": "Live chat with chatbots for e-commerce websites",
  "bamboohr": "HR software for small and medium businesses",
  "greenhouse": "Structured hiring platform for growing companies",
  "lever": "ATS with CRM capabilities for relationship-driven recruiting",
  "rippling": "Unified HR, IT, and Finance in one platform",
  "gusto": "Payroll, benefits, and HR for small businesses",
  "lattice": "Performance management and employee engagement",
  "15five": "Continuous performance management with weekly check-ins",
  "quickbooks": "Small business accounting from the company that defined the category",
  "xero": "Cloud accounting that accountants actually like using",
  "freshbooks": "Invoicing and accounting built for freelancers and small businesses",
  "wave": "Free accounting software for small businesses",
  "zoho-books": "Comprehensive accounting as part of the Zoho ecosystem",
  "brex": "Corporate cards and spend management for startups",
  "stripe": "Payment processing that developers love to implement",
  "paypal": "The original online payment system, still everywhere",
  "docusign": "Electronic signatures that are legally binding worldwide",
  "pandadoc": "Document automation with proposals, contracts, and e-signatures",
  "signnow": "Affordable e-signature solution for businesses of all sizes",
  "clio": "Legal practice management software for law firms",
  "juro": "AI-powered contract management for in-house legal teams",
  "ironclad": "Enterprise contract lifecycle management",
  "1password": "Password manager trusted by individuals and businesses alike",
  "lastpass": "Widely adopted password manager despite security incidents",
  "bitwarden": "Open-source password manager you can self-host",
  "dashlane": "Password manager with VPN and dark web monitoring",
  "okta": "Enterprise identity and access management",
  "auth0": "Developer-friendly authentication and authorization",
  "snyk": "Developer security platform for finding and fixing vulnerabilities",
  "crowdstrike": "Endpoint security that stops breaches before they happen",
  "datadog": "Cloud monitoring platform with APM, logs, and infrastructure metrics",
  "new-relic": "Full-stack observability platform for modern applications",
  "sentry": "Error tracking that helps developers fix bugs faster",
  "browserstack": "Test your website on real browsers and devices in the cloud",
  "lambdatest": "Cross-browser testing platform with AI features",
  "cypress": "Modern end-to-end testing for web applications",
  "postman": "API development platform from design to testing to documentation",
  "launchdarkly": "Feature flags and experimentation at scale",
  "playwright": "Cross-browser automation from Microsoft",
  "selenium": "The original browser automation framework",
  "jest": "JavaScript testing framework with zero configuration",
  "circleci": "Continuous integration that scales with your team",
  "obsidian": "Markdown-based knowledge management with local-first storage",
  "roam-research": "Networked note-taking that pioneered bi-directional linking",
  "craft": "Beautiful document editor with native Apple integration",
  "evernote": "The original note-taking app, still kicking after all these years",
  "gitbook": "Documentation platform that developers actually enjoy using",
  "confluence": "Team wiki and documentation for Atlassian users",
  "calendly": "Scheduling automation that eliminated the back-and-forth",
  "cal-com": "Open-source Calendly alternative you can self-host",
  "typeform": "Beautiful, conversational forms that people enjoy filling out",
  "jotform": "Powerful form builder with templates for every use case",
  "tally": "Free form builder with modern UX and Notion integration",
  "todoist": "Simple, cross-platform task management that just works",
  "things": "Elegant task manager for Apple users who value design",
  "shopify": "E-commerce platform that powers over a million online stores",
  "woocommerce": "WordPress e-commerce plugin for maximum flexibility",
  "bigcommerce": "Enterprise e-commerce without the enterprise complexity",
  "squarespace": "Beautiful websites with built-in e-commerce",
  "wix": "Website builder that grew into a full business platform",
  "gumroad": "Sell digital products directly to your audience",
  "buffer": "Schedule and analyze social media posts across platforms",
  "hootsuite": "Enterprise social media management and analytics",
  "sprout-social": "Social media management with customer care features",
  "later": "Social media scheduling focused on visual content",
  "socialbee": "AI-powered social media scheduling and content recycling",
  "zapier": "Connect apps and automate workflows without code",
  "make": "Visual automation platform with powerful data transformation",
  "n8n": "Self-hostable workflow automation for technical teams",
  "kapwing": "Browser-based video editor with AI features",
  "descript": "Edit video by editing text transcripts",
  "riverside": "High-quality remote podcast and video recording",
  "thinkific": "Create and sell online courses with your own platform",
  "teachable": "Course platform focused on simplicity and marketing",
  "podia": "All-in-one platform for courses, downloads, and communities",
  "kajabi": "Complete business platform for knowledge entrepreneurs",
  "onepassword-secrets": "Secrets management for developers integrated with 1Password",
  "aws-secrets-manager": "AWS service for storing and rotating secrets securely",
  "aws-cdk": "Define cloud infrastructure using familiar programming languages",
  "aws-cloudformation": "Infrastructure as code for AWS using YAML or JSON templates",
  "aws-lambda": "Run code without managing servers, pay only for compute time",
  "ably": "Realtime messaging infrastructure for chat, notifications, and live updates",
  "acuity": "Online appointment scheduling that syncs with your calendar",
  "adalo": "Build mobile apps visually without writing code",
  "adjust": "Mobile attribution and analytics for app marketers",
  "adobe-color": "Create and explore color palettes for design projects",
  "adobe-firefly": "Adobe's generative AI for creating images and effects",
  "adobe-xd": "UI/UX design tool for websites and mobile apps",
  "affinity-designer": "Professional vector graphics editor without subscription",
  "affinity-photo": "Photo editing software that rivals Photoshop",
  "ahrefs": "SEO toolset for backlink analysis and keyword research",
  "aider": "AI pair programming in your terminal with GPT-4",
  "airbrake": "Error monitoring that helps you fix bugs faster",
  "airbyte": "Open-source data integration platform for ELT pipelines",
  "akamai": "CDN and cloud security for enterprise websites",
  "alfred": "Productivity app for Mac with custom workflows",
  "alibaba-cloud": "Chinese cloud provider with global infrastructure",
  "amazon-codewhisperer": "AI coding companion from AWS",
  "amazon-dynamodb": "Serverless NoSQL database with single-digit millisecond latency",
  "amazon-neptune": "Managed graph database for connected data",
  "amazon-redshift": "Cloud data warehouse for analytics at scale",
  "amazon-ses": "Transactional email service from AWS",
  "amazon-sagemaker": "Build, train, and deploy ML models at scale",
  "anchor": "Free podcast hosting with distribution to all platforms",
  "anchore": "Container security scanning and compliance",
  "android-studio": "Official IDE for Android app development",
  "angellist": "Startup recruiting and venture capital platform",
  "ansible": "Automate IT infrastructure with simple YAML playbooks",
  "anthropic-api": "API access to Claude for building AI applications",
  "any-do": "Simple to-do list and daily planner app",
  "anyscale": "Platform for scaling Ray and Python applications",
  "anytype": "Local-first note-taking with object-based organization",
  "apache-airflow": "Workflow orchestration for data engineering pipelines",
  "apache-druid": "Real-time analytics database for high-speed queries",
  "apache-kafka": "Distributed event streaming for real-time data pipelines",
  "apache-nifi": "Automate data flow between systems with visual interface",
  "apache-superset": "Open-source business intelligence and data visualization",
  "apidog": "API design, testing, and documentation in one platform",
  "apollo-studio": "GraphQL developer platform for building APIs",
  "apollo-io": "B2B sales intelligence and engagement platform",
  "appdynamics": "Application performance monitoring for enterprises",
  "appcues": "Build in-app onboarding flows without code",
  "appium": "Automate mobile app testing across platforms",
  "applitools": "Visual AI testing for web and mobile apps",
  "appsflyer": "Mobile attribution and marketing analytics",
  "appsignal": "Application monitoring for Ruby, Elixir, and Node.js",
  "appsmith": "Build internal tools with drag-and-drop interface",
  "appwrite": "Open-source backend server for web and mobile apps",
  "aptabase": "Privacy-first analytics for mobile and desktop apps",
  "aqua-security": "Cloud native security for containers and Kubernetes",
  "arangodb": "Multi-model database for graphs, documents, and key-value",
  "archbee": "Documentation tool for product and API docs",
  "architect": "Build serverless apps with infrastructure as code",
  "argo-cd": "GitOps continuous delivery for Kubernetes",
  "around": "Video calling designed for screen sharing and collaboration",
  "ashby": "All-in-one recruiting software for growing companies",
  "askcodi": "AI coding assistant that explains and generates code",
  "assemblyai": "Speech-to-text API with high accuracy transcription",
  "atatus": "Full-stack application monitoring and error tracking",
  "attio": "CRM built for data-driven relationship management",
  "authelia": "Open-source authentication and authorization server",
  "automatisch": "Open-source Zapier alternative for workflow automation",
  "avocode": "Design handoff tool for developers and designers",
  "axiom": "Serverless log management and observability platform",
  "azure-cosmos-db": "Globally distributed multi-model database",
  "azure-devops": "Microsoft's complete DevOps platform",
  "azure-functions": "Serverless compute for event-driven applications",
  "azure-ml": "Cloud platform for building and deploying ML models",
  "azure-synapse": "Analytics service combining data warehousing and big data",
  "backendless": "Backend as a service with visual app development",
  "baserow": "Open-source Airtable alternative you can self-host",
  "bear": "Beautiful markdown notes app for Apple devices",
  "beehiiv": "Newsletter platform built for growth and monetization",
  "begin": "Deploy serverless apps instantly with minimal config",
  "bench": "Bookkeeping service with dedicated accountants",
  "better-uptime": "Uptime monitoring with beautiful status pages",
  "bettermode": "Community platform with forums and knowledge base",
  "betty-blocks": "No-code platform for enterprise applications",
  "bigquery": "Google's serverless data warehouse for analytics",
  "bildr": "Build web apps visually with full code flexibility",
  "bing-image-creator": "Microsoft's AI image generator powered by DALL-E",
  "biome": "Fast formatter and linter for JavaScript and TypeScript",
  "bitdefender": "Antivirus and cybersecurity for consumers and business",
  "bito": "AI assistant for code review and documentation",
  "black": "Uncompromising Python code formatter",
  "blackbox-ai": "AI code assistant with real-time suggestions",
  "blameless": "Incident management and SRE platform",
  "blender": "Free and open-source 3D creation suite",
  "bolt": "AI-powered full-stack web development in browser",
  "branch": "Mobile measurement and deep linking platform",
  "bruno": "Open-source API client alternative to Postman",
  "budibase": "Build internal tools and business apps quickly",
  "buddy": "CI/CD for web developers with visual pipelines",
  "bugsnag": "Error monitoring with diagnostic data for debugging",
  "builder-io": "Visual development platform with headless CMS",
  "bun": "Fast JavaScript runtime and package manager",
  "bunny-stream": "Video hosting and streaming platform",
  "bunnycdn": "Fast and affordable content delivery network",
  "burp-suite": "Web security testing toolkit for penetration testers",
  "buttondown": "Simple newsletter tool for independent writers",
  "cdktf": "Define Terraform infrastructure using programming languages",
  "cabin": "Privacy-first web analytics without cookies",
  "cachet": "Open-source status page system",
  "caddy": "Web server with automatic HTTPS",
  "calibre": "Web performance monitoring with detailed metrics",
  "canva-ai": "AI-powered design features within Canva",
  "capacities": "Note-taking app with object-based structure",
  "carbon-black": "Endpoint security and threat hunting platform",
  "cargo": "Rust's package manager and build system",
  "carrd": "Build simple one-page websites quickly",
  "carta": "Equity management and cap table software",
  "cassandra": "Distributed NoSQL database for massive scale",
  "certbot": "Free tool to obtain Let's Encrypt SSL certificates",
  "chameleon": "In-app product tours and user onboarding",
  "chanty": "Team chat with built-in task management",
  "chargebee": "Subscription billing and revenue management",
  "charthop": "People analytics and org chart software",
  "chatwoot": "Open-source customer engagement platform",
  "checkly": "API and browser monitoring with Playwright tests",
  "checkmarx": "Application security testing for enterprises",
  "chef": "Infrastructure automation with Ruby-based recipes",
  "chili-piper": "Scheduling and routing for revenue teams",
  "chorus": "Conversation intelligence for sales teams",
  "chroma": "Open-source vector database for AI applications",
  "chromatic": "Visual testing platform for Storybook",
  "cinema-4d": "Professional 3D modeling and animation software",
  "circle": "Community platform for creators and brands",
  "clair": "Open-source container vulnerability scanner",
  "clari": "Revenue intelligence and forecasting platform",
  "clearml": "ML experiment tracking and pipeline automation",
  "clearbit": "B2B data enrichment and lead intelligence",
  "clearscope": "Content optimization for search engines",
  "clerk": "Authentication and user management for developers",
  "clickhouse": "Fast open-source analytics database",
  "clicky": "Real-time web analytics with heatmaps",
  "clip-studio-paint": "Digital illustration and comic creation software",
  "clipdrop": "AI-powered image editing and generation tools",
  "clockwise": "AI calendar assistant for better meeting scheduling",
  "clutch": "B2B ratings and reviews for agencies",
  "cockroachdb": "Distributed SQL database for cloud applications",
  "codacy": "Automated code quality and security analysis",
  "codeclimate": "Code quality metrics and test coverage",
  "codesandbox": "Online IDE for rapid web development",
  "codefresh": "GitOps CI/CD platform for Kubernetes",
  "codeium": "Free AI code completion for all IDEs",
  "codium-ai": "AI-powered test generation for developers",
  "cohere": "Enterprise AI for search and language understanding",
  "colossyan": "AI video creation with synthetic presenters",
  "comet-ml": "ML experiment tracking and model management",
  "commerce-layer": "Headless commerce API for global brands",
  "commerce-js": "Headless e-commerce backend for developers",
  "composer": "Dependency manager for PHP projects",
  "concourse": "Open-source continuous integration platform",
  "configcat": "Feature flag service for any application",
  "confluent": "Enterprise Kafka platform for streaming data",
  "containerd": "Industry-standard container runtime",
  "contentful": "Headless CMS for digital experiences",
  "continue": "Open-source AI code assistant for VS Code",
  "contractpodai": "AI-powered contract management for enterprises",
  "contractbook": "Contract lifecycle automation platform",
  "convert": "A/B testing and personalization platform",
  "convex": "Backend platform with real-time sync",
  "coolify": "Self-hostable Heroku and Netlify alternative",
  "coolors": "Fast color palette generator for designers",
  "copper": "CRM that works inside Google Workspace",
  "couchdb": "NoSQL database that syncs across devices",
  "couchbase": "Distributed NoSQL database for enterprises",
  "count": "Collaborative data analysis and notebooks",
  "countly": "Product analytics and push notifications",
  "cronitor": "Monitoring for cron jobs and scheduled tasks",
  "crossplane": "Build cloud infrastructure using Kubernetes",
  "crystallize": "Headless PIM and commerce platform",
  "culture-amp": "Employee engagement and performance platform",
  "cursor": "AI-first code editor built on VS Code",
  "customer-io": "Automated messaging based on user behavior",
  "customerio": "Marketing automation for customer engagement",
  "d-id": "Create AI-generated videos with talking avatars",
  "dalle": "OpenAI's image generation AI available via API",
  "dnsimple": "DNS hosting and domain management made simple",
  "dagster": "Data orchestration platform for ML pipelines",
  "databricks": "Unified analytics platform for data engineering and AI",
  "datocms": "Headless CMS with powerful image processing",
  "debugbear": "Website performance monitoring for Core Web Vitals",
  "deel": "Global payroll and compliance for remote teams",
  "deepsource": "Static analysis for code quality and security",
  "deno-deploy": "Deploy JavaScript at the edge globally",
  "dependabot": "Automated dependency updates for GitHub repos",
  "detox": "End-to-end testing for React Native apps",
  "devcycle": "Feature flags built for developers",
  "devin": "AI software engineer that writes and debugs code",
  "dgraph": "Distributed graph database with GraphQL",
  "directus": "Open-source headless CMS with REST and GraphQL",
  "discourse": "Open-source forum and community platform",
  "divvy": "Expense management with free software",
  "dixa": "Customer service platform for conversational support",
  "docker-hub": "Container image registry for sharing Docker images",
  "docsify": "Generate documentation sites from markdown",
  "docusaurus": "Build documentation websites with React",
  "doppler": "Secrets management for development teams",
  "dorik": "No-code website builder with custom designs",
  "draftbit": "Build native mobile apps visually",
  "dreamstudio": "Stability AI's interface for image generation",
  "drone": "Self-hosted continuous delivery platform",
  "dropbox": "Cloud storage and file synchronization",
  "duckdb": "Fast in-process analytics database",
  "duo-security": "Multi-factor authentication for enterprises",
  "durable": "AI website builder that creates sites in seconds",
  "dynatrace": "Full-stack observability and AIOps platform",
  "eset": "Antivirus and endpoint security software",
  "eslint": "Pluggable JavaScript and TypeScript linter",
  "easypost": "Shipping API for e-commerce businesses",
  "eclipse": "Open-source IDE for Java and other languages",
  "ecwid": "E-commerce widget for any website",
  "elai": "AI video generation with virtual presenters",
  "elastic-apm": "Application performance monitoring for Elastic Stack",
  "elasticsearch": "Distributed search and analytics engine",
  "element": "Secure messaging app built on Matrix protocol",
  "eppo": "Experimentation platform for product teams",
  "estuary-flow": "Real-time data integration and ETL",
  "exceptionless": "Open-source error and log collection",
  "expensify": "Expense management and receipt scanning",
  "falco": "Runtime security for containers and Kubernetes",
  "fantastical": "Calendar app for Apple devices with natural language",
  "fastly": "Edge cloud platform for fast content delivery",
  "fastly-compute": "Serverless compute at the edge",
  "fathom-meetings": "AI meeting assistant for notes and summaries",
  "faunadb": "Serverless document database with GraphQL",
  "feather-icons": "Beautiful open-source icon set",
  "fermyon-spin": "Framework for building WebAssembly microservices",
  "filestack": "File upload and processing API",
  "fillout": "Form builder with advanced logic and integrations",
  "firehydrant": "Incident management for reliability engineering",
  "firebase-firestore": "NoSQL cloud database with real-time sync",
  "firebolt": "Cloud data warehouse for analytics",
  "fireflies-ai": "AI meeting notes and conversation intelligence",
  "fireworks-ai": "Fast inference for open-source AI models",
  "fivetran": "Automated data integration and ELT",
  "flagsmith": "Open-source feature flag and remote config",
  "fleet": "Open-source device management for IT",
  "fliki": "AI video creation with text-to-video",
  "flipt": "Open-source feature flag infrastructure",
  "flock": "Team messaging and collaboration platform",
  "fluentd": "Open-source data collector for unified logging",
  "flutterflow": "Build Flutter apps visually without code",
  "flux-cd": "GitOps for Kubernetes deployments",
  "flyio": "Deploy apps close to users on edge infrastructure",
  "folk": "CRM for relationship-driven businesses",
  "fontbase": "Font manager for designers and developers",
  "fontjoy": "AI-powered font pairing generator",
  "fork-git": "Fast and friendly Git client for Mac and Windows",
  "formspark": "Simple form backend for static sites",
  "formspree": "Form handling service for developers",
  "freshping": "Free website uptime monitoring",
  "front": "Shared inbox for customer communication",
  "fusionauth": "Customer identity and access management",
  "gimp": "Free and open-source image editor",
  "gpt4all": "Run large language models locally",
  "gandi": "Domain registration and web hosting",
  "gather": "Virtual spaces for remote team gatherings",
  "gatling": "Load testing for web applications",
  "ghost": "Open-source publishing platform for blogs",
  "github-actions": "CI/CD automation built into GitHub",
  "github-copilot": "AI pair programmer that suggests code",
  "github-desktop": "Simple Git GUI for GitHub repositories",
  "gitkraken": "Visual Git client with intuitive interface",
  "gitea": "Lightweight self-hosted Git service",
  "gitleaks": "Detect secrets in Git repositories",
  "gladly": "Customer service platform focused on people",
  "glide": "Build apps from spreadsheets without code",
  "gocd": "Open-source continuous delivery server",
  "goland": "JetBrains IDE for Go development",
  "goto-meeting": "Video conferencing for business meetings",
  "goatcounter": "Simple web analytics without tracking users",
  "gogs": "Painless self-hosted Git service",
  "gong": "Revenue intelligence platform for sales teams",
  "google-cloud-dns": "Managed DNS hosting on Google Cloud",
  "google-cloud-functions": "Serverless functions on Google Cloud",
  "google-forms": "Free form and survey builder from Google",
  "google-gemini": "Google's multimodal AI model",
  "google-meet": "Video conferencing integrated with Google Workspace",
  "google-vertex-ai": "Unified AI platform for ML development",
  "gorgias": "Customer support helpdesk for e-commerce",
  "grafana": "Open-source observability and dashboards",
  "grafana-oncall": "On-call management integrated with Grafana",
  "gravit-designer": "Free vector design app in the browser",
  "graylog": "Open-source log management platform",
  "grit": "AI-powered code migration and upgrades",
  "groove": "Help desk software for small businesses",
  "groq": "Ultra-fast AI inference with custom hardware",
  "growthbook": "Open-source feature flags and A/B testing",
  "grype": "Container vulnerability scanner from Anchore",
  "httpie": "User-friendly command-line HTTP client",
  "habitica": "Gamified habit tracking and productivity",
  "hanko": "Passwordless authentication for developers",
  "harness": "Software delivery platform with CI/CD",
  "harvest": "Time tracking and invoicing for teams",
  "hashicorp-vault": "Secrets management and data protection",
  "hasura": "Instant GraphQL APIs on your databases",
  "headscale": "Self-hosted Tailscale control server",
  "healthchecks-io": "Cron job monitoring with simple pings",
  "helix": "Post-modern terminal text editor in Rust",
  "hellosign": "E-signature solution now Dropbox Sign",
  "helm": "Package manager for Kubernetes",
  "hemingway": "Editor that makes your writing bold and clear",
  "heroicons": "Beautiful hand-crafted SVG icons",
  "hetzner": "Affordable cloud and dedicated servers",
  "hevo": "No-code data pipeline platform",
  "hex": "Collaborative analytics and data notebooks",
  "heygen": "AI video generation with realistic avatars",
  "honeycomb": "Observability for distributed systems",
  "hoppscotch": "Open-source API development ecosystem",
  "hostinger-builder": "AI website builder from Hostinger",
  "houdini": "3D animation and VFX software",
  "hugging-face": "Platform for sharing ML models and datasets",
  "huginn": "Self-hosted IFTTT alternative for automation",
  "hunter": "Find email addresses for outreach",
  "huntress": "Managed threat detection for MSPs",
  "hygraph": "GraphQL-native headless CMS",
  "hyperping": "Uptime monitoring with beautiful status pages",
  "ibm-cloud": "Enterprise cloud platform from IBM",
  "iconify": "Unified icons framework with 100+ sets",
  "ideogram": "AI image generation with text rendering",
  "imagekit": "Image optimization and delivery CDN",
  "imgix": "Real-time image processing and CDN",
  "imperva": "Application and data security platform",
  "invideo-ai": "AI video creator for social media content",
  "incident-io": "Incident management with Slack integration",
  "infisical": "Open-source secrets management platform",
  "informatica": "Enterprise data integration and management",
  "inkscape": "Free vector graphics editor",
  "inngest": "Event-driven background jobs and workflows",
  "insomnia": "API client for REST and GraphQL",
  "instatus": "Status page hosting for any product",
  "integromat": "Automation platform now called Make",
  "intellij-idea": "JetBrains IDE for Java development",
  "junit": "Testing framework for Java applications",
  "jaeger": "Distributed tracing for microservices",
  "jan": "Run LLMs locally with beautiful interface",
  "janusgraph": "Distributed graph database for massive scale",
  "jasmine": "BDD testing framework for JavaScript",
  "jenkins": "Open-source automation server for CI/CD",
  "june": "Product analytics built for B2B SaaS",
  "k3s": "Lightweight Kubernetes for edge and IoT",
  "kameleoon": "A/B testing and personalization platform",
  "keeper": "Password manager with enterprise security",
  "keycdn": "Fast and reliable content delivery network",
  "keycloak": "Open-source identity and access management",
  "keystonejs": "Headless CMS and GraphQL API framework",
  "keywords-everywhere": "SEO keyword research browser extension",
  "khroma": "AI color palette generator that learns your style",
  "kind": "Run Kubernetes clusters in Docker containers",
  "kissflow": "Low-code platform for business workflows",
  "kling-ai": "Chinese AI video generation platform",
  "knative": "Kubernetes-native serverless framework",
  "kochava": "Mobile attribution and analytics platform",
  "krea-ai": "AI image generation with real-time canvas",
  "krisp": "AI noise cancellation for calls",
  "krita": "Free digital painting and illustration software",
  "kustomer": "Customer service CRM platform",
  "kustomize": "Kubernetes native configuration management",
  "lm-studio": "Run local LLMs with user-friendly interface",
  "lovo": "AI voice generator for video production",
  "lancedb": "Vector database built on Lance format",
  "landen": "Simple landing page builder",
  "lapce": "Fast open-source code editor in Rust",
  "lazygit": "Terminal UI for Git commands",
  "leapsome": "People enablement and performance platform",
  "learnworlds": "Online course platform with community features",
  "lemlist": "Cold email outreach with personalization",
  "leonardo-ai": "AI image generation for creative professionals",
  "lets-encrypt": "Free SSL/TLS certificates for everyone",
  "lexica": "Search engine for AI-generated images",
  "lexion": "AI contract management for legal teams",
  "lightdash": "Open-source BI tool for dbt projects",
  "lightstep": "Distributed tracing and observability",
  "linode": "Cloud computing with simple and predictable pricing",
  "listnr": "AI podcast and voiceover generator",
  "liveblocks": "Real-time collaboration infrastructure",
  "llama-cpp": "Run Llama models efficiently on CPU",
  "localai": "Self-hosted OpenAI-compatible API",
  "logrhythm": "SIEM and security analytics platform",
  "loggly": "Cloud-based log management service",
  "logseq": "Open-source knowledge management and notes",
  "logstash": "Data collection and processing pipeline",
  "logtail": "Log management built on ClickHouse",
  "logto": "Open-source Auth0 alternative",
  "logz-io": "Observability platform based on open-source",
  "loki": "Log aggregation system from Grafana Labs",
  "looker": "Business intelligence by Google Cloud",
  "loomly": "Social media calendar and content management",
  "loops": "Email marketing for modern SaaS",
  "lottie": "Render After Effects animations on any platform",
  "lovable": "AI app builder that creates production code",
  "lucide": "Beautiful and consistent open-source icons",
  "lucky-orange": "Website analytics with heatmaps and recordings",
  "luma-ai": "AI video and 3D generation platform",
  "lumen5": "AI video creator for marketing content",
  "lunacy": "Free design software with built-in assets",
  "lusha": "B2B contact data for sales prospecting",
  "mlflow": "Open-source ML lifecycle management",
  "mabl": "AI-powered test automation platform",
  "magento": "Open-source e-commerce platform",
  "magic": "Passwordless authentication SDK",
  "magnific": "AI image upscaling and enhancement",
  "mailgun": "Transactional email API for developers",
  "mailjet": "Email marketing and transactional email",
  "malwarebytes": "Anti-malware and endpoint protection",
  "mariadb": "Community-driven MySQL fork",
  "marketmuse": "AI content planning and optimization",
  "matillion": "Cloud data integration platform",
  "matomo": "Open-source web analytics alternative to GA",
  "mattermost": "Open-source Slack alternative",
  "maven": "Build automation for Java projects",
  "maya": "3D animation and modeling software",
  "medusa": "Open-source headless commerce engine",
  "meltano": "Open-source data integration framework",
  "mem": "AI-powered personal knowledge assistant",
  "memberstack": "Membership and authentication for websites",
  "mendix": "Low-code platform for enterprise apps",
  "mentat": "AI coding assistant for terminal",
  "mercury": "Banking for startups and tech companies",
  "metabase": "Open-source business intelligence tool",
  "microk8s": "Lightweight Kubernetes from Canonical",
  "microsoft-clarity": "Free heatmaps and session recordings",
  "microsoft-sentinel": "Cloud-native SIEM and SOAR",
  "mighty-networks": "Community platform for creators",
  "milvus": "Open-source vector database for AI",
  "minikube": "Run Kubernetes locally for development",
  "mintlify": "Beautiful documentation that writes itself",
  "mistral-ai": "European AI company with open models",
  "mkdocs": "Static site generator for documentation",
  "mocha": "JavaScript test framework for Node.js",
  "modal": "Serverless cloud for AI and data applications",
  "mode": "Collaborative analytics and BI platform",
  "motion": "AI calendar that auto-schedules tasks",
  "mouseflow": "Session replay and heatmap analytics",
  "moz": "SEO software and link analysis tools",
  "murf-ai": "AI voice generator for professional voiceovers",
  "mutable-ai": "AI code assistant with context awareness",
  "mux": "Video API for developers",
  "mysql": "Popular open-source relational database",
  "ns1": "Intelligent DNS and traffic management",
  "namecheap": "Domain registration and web hosting",
  "nebula": "Open-source VPN mesh network",
  "neo4j": "Graph database for connected data",
  "neon": "Serverless Postgres with branching",
  "neovim": "Hyperextensible Vim-based text editor",
  "neptune-ai": "Experiment tracking for ML teams",
  "nessus": "Vulnerability assessment scanner",
  "netlify-functions": "Serverless functions on Netlify",
  "netmaker": "WireGuard-based virtual network platform",
  "nextra": "Static site generator for Next.js docs",
  "ngrok": "Expose local servers to the internet",
  "nhost": "Open-source Firebase alternative with GraphQL",
  "nightcafe": "AI art generator with multiple models",
  "nightwatch": "End-to-end testing framework for browsers",
  "nocodb": "Open-source Airtable alternative",
  "node-red": "Flow-based programming for IoT",
  "noodl": "Visual full-stack development platform",
  "nordvpn": "Popular VPN service for privacy",
  "northbeam": "Marketing attribution for e-commerce",
  "notepad-plus-plus": "Free source code editor for Windows",
  "nova": "Mac-native code editor from Panic",
  "nx": "Monorepo tools for JavaScript and TypeScript",
  "ossec": "Open-source host-based intrusion detection",
  "ovhcloud": "European cloud provider with competitive pricing",
  "owasp-zap": "Open-source web security scanner",
  "oberlo": "Dropshipping app for Shopify stores",
  "observable": "Collaborative data visualization notebooks",
  "oh-dear": "Website monitoring with uptime and SSL checks",
  "olark": "Live chat software for customer support",
  "ollama": "Run open-source LLMs locally with one command",
  "omnifocus": "GTD task manager for Apple devices",
  "openai-api": "API access to GPT, DALL-E, and Whisper",
  "opencart": "Open-source e-commerce platform",
  "openfaas": "Serverless functions on Kubernetes",
  "openrouter": "Unified API for multiple AI models",
  "openshift": "Red Hat's enterprise Kubernetes platform",
  "opentelemetry": "Vendor-neutral observability framework",
  "opentofu": "Open-source Terraform fork",
  "openvpn": "Open-source VPN protocol and software",
  "opsgenie": "Alert and on-call management",
  "oracle-cloud": "Enterprise cloud from Oracle",
  "origami-studio": "Prototyping tool from Meta",
  "ory": "Open-source identity infrastructure",
  "otter-ai": "AI meeting notes and transcription",
  "outsystems": "Low-code platform for enterprise apps",
  "outreach": "Sales engagement platform",
  "outseta": "All-in-one membership and billing platform",
  "oxlint": "Fast JavaScript/TypeScript linter in Rust",
  "oyster": "Global employment platform for remote teams",
  "phpunit": "Testing framework for PHP",
  "paddle": "Payment infrastructure for SaaS",
  "pagerduty": "Incident response and on-call management",
  "paperform": "Beautiful forms with advanced features",
  "papertrail": "Cloud-hosted log management",
  "parabola": "No-code data workflows and automation",
  "parcel": "Zero-config web application bundler",
  "partykit": "Real-time multiplayer infrastructure",
  "paw": "Advanced API client for Mac",
  "payhip": "Sell digital downloads and memberships",
  "payload": "Headless CMS and application framework",
  "penpot": "Open-source design and prototyping platform",
  "perplexity": "AI search engine with cited answers",
  "phosphor-icons": "Flexible icon family for interfaces",
  "photoroom": "AI photo editing for product images",
  "photopea": "Free online photo editor like Photoshop",
  "pictory": "AI video creation from text content",
  "pieces": "AI-powered developer productivity tool",
  "pika-labs": "AI video generation from text prompts",
  "pilot": "Bookkeeping service for startups",
  "pinecone": "Vector database for AI applications",
  "pipedream": "Connect APIs with code and no-code",
  "pixelmator-pro": "Image editing for Mac with ML features",
  "plane": "Open-source project management like Linear",
  "plasmic": "Visual builder for React applications",
  "plausible": "Privacy-friendly Google Analytics alternative",
  "play-ht": "AI voice generation and text-to-speech",
  "playground-ai": "AI image creation and editing platform",
  "pocketbase": "Open-source backend in a single file",
  "podman": "Daemonless container engine",
  "porkbun": "Domain registrar with competitive prices",
  "portainer": "Container management for Docker and Kubernetes",
  "postmark": "Transactional email with high deliverability",
  "power-bi": "Business intelligence and visualization by Microsoft",
  "prefect": "Modern workflow orchestration for data",
  "preset": "Managed Apache Superset for analytics",
  "prestashop": "Open-source e-commerce platform",
  "prettier": "Opinionated code formatter",
  "principle": "Animated interface design for Mac",
  "printful": "Print-on-demand and dropshipping",
  "printify": "Print-on-demand for custom products",
  "prisma": "Next-generation ORM for Node.js and TypeScript",
  "prisma-cloud": "Cloud security and compliance platform",
  "prismic": "Headless CMS with Slice Machine",
  "pritunl": "Open-source enterprise VPN server",
  "procreate": "Digital illustration app for iPad",
  "prometheus": "Open-source monitoring and alerting",
  "protopie": "Interactive prototyping for all devices",
  "proton-pass": "Encrypted password manager from Proton",
  "publer": "Social media scheduling and analytics",
  "pulley": "Cap table and equity management",
  "pulumi": "Infrastructure as code with real programming languages",
  "pumble": "Free team messaging app",
  "puppet": "Infrastructure automation at scale",
  "puppeteer": "Node.js library for browser automation",
  "pusher": "Realtime APIs for web and mobile apps",
  "pycharm": "JetBrains IDE for Python development",
  "pypi": "Python Package Index for libraries",
  "qdrant": "Vector database for AI applications",
  "qualified": "Conversational marketing for B2B",
  "qualys": "Cloud-based security and compliance",
  "questdb": "Time series database for fast analytics",
  "rspec": "Testing framework for Ruby",
  "ramp": "Corporate cards and expense management",
  "rancher": "Kubernetes management platform",
  "rapid7-insightidr": "Cloud SIEM for threat detection",
  "rapidapi": "API marketplace and management platform",
  "raycast": "Blazing fast launcher for productivity",
  "raygun": "Error tracking and performance monitoring",
  "readme": "Developer hub for API documentation",
  "reclaim": "AI scheduling assistant for calendars",
  "reclaim-ai": "Smart calendar management with AI",
  "redash": "Open-source data visualization tool",
  "redocly": "API documentation with OpenAPI",
  "reflect": "End-to-end encrypted note-taking",
  "remote": "Global HR platform for distributed teams",
  "remove-bg": "AI background removal for images",
  "renovate": "Automated dependency updates for any platform",
  "replicate": "Run AI models in the cloud",
  "replit": "Browser-based IDE for coding and deployment",
  "replit-ai": "AI assistant built into Replit",
  "reply-io": "Sales engagement and automation platform",
  "rescuetime": "Automatic time tracking for productivity",
  "resemble-ai": "AI voice cloning and synthesis",
  "resend": "Developer-first email API",
  "rethinkdb": "Real-time database with change feeds",
  "retool": "Build internal tools fast with drag-and-drop",
  "returnly": "Returns management for e-commerce",
  "revue": "Newsletter platform acquired by Twitter",
  "rightfont": "Font management for Mac designers",
  "rive": "Interactive animations for apps and games",
  "rivery": "Data integration and orchestration platform",
  "rocket-chat": "Open-source team communication",
  "rollbar": "Error tracking and debugging platform",
  "rollup": "JavaScript module bundler",
  "rootly": "Incident management built for SRE",
  "route-53": "AWS DNS and domain registration",
  "rows": "Spreadsheet with built-in integrations",
  "rspack": "Fast Rust-based JavaScript bundler",
  "rubocop": "Ruby static code analyzer and formatter",
  "ruff": "Extremely fast Python linter in Rust",
  "runbook": "Operations runbook automation",
  "sst": "Full-stack serverless framework for AWS",
  "swc": "Super-fast TypeScript/JavaScript compiler",
  "saleor": "GraphQL-first open-source e-commerce",
  "salesloft": "Sales engagement platform for revenue teams",
  "saltstack": "Event-driven IT automation",
  "sanity": "Composable content platform with real-time collaboration",
  "sauce-labs": "Cross-browser and mobile app testing cloud",
  "savvycal": "Scheduling that puts recipients first",
  "scaleway": "European cloud provider with AI infrastructure",
  "scope": "Troubleshoot distributed applications",
  "screaming-frog": "Website crawler for SEO audits",
  "scylladb": "High-performance NoSQL database",
  "semaphore": "Fast CI/CD for high-performance teams",
  "semgrep": "Code scanning for security and quality",
  "semrush": "All-in-one marketing toolkit for SEO",
  "sendbird": "Chat and messaging API for apps",
  "sentinelone": "AI-powered endpoint security",
  "seq": "Centralized logging for .NET applications",
  "shipstation": "Shipping software for e-commerce",
  "shippo": "Multi-carrier shipping API",
  "shortcut": "Project management for software teams",
  "signoz": "Open-source observability platform",
  "simple-analytics": "Privacy-first web analytics",
  "singer": "Open-source ETL framework",
  "singlestore": "Real-time distributed database",
  "singular": "Mobile marketing analytics platform",
  "site24x7": "Full-stack monitoring for DevOps",
  "slite": "Knowledge base for modern teams",
  "smartlook": "Session replay and product analytics",
  "snipcart": "E-commerce cart for any website",
  "snov-io": "Email finder and outreach automation",
  "snowflake": "Cloud data platform for analytics",
  "softr": "Build apps and portals from Airtable",
  "sonarcloud": "Cloud-based code quality analysis",
  "sonarqube": "Self-hosted code quality platform",
  "sophos": "Cybersecurity for business",
  "sora": "OpenAI's text-to-video AI model",
  "sourcegraph-cody": "AI coding assistant with codebase context",
  "sourcetree": "Free Git GUI for Mac and Windows",
  "sparkpost": "Email delivery and analytics",
  "speechify": "Text-to-speech for reading",
  "speedcurve": "Web performance monitoring",
  "spike-sh": "Incident management via Slack",
  "spinnaker": "Continuous delivery platform for cloud",
  "spline": "3D design tool for the web",
  "split": "Feature delivery platform",
  "splunk": "Platform for searching and analyzing machine data",
  "spocket": "Dropshipping marketplace for e-commerce",
  "sprig": "In-product surveys and user research",
  "squadcast": "Incident management for SRE teams",
  "square": "Payment processing and POS systems",
  "stackblitz": "Instant dev environments in the browser",
  "stackpath": "Edge computing and CDN platform",
  "stacker": "Build apps on top of spreadsheets",
  "starrocks": "Sub-second analytics database",
  "starlight": "Documentation theme for Astro",
  "statsig": "Feature flags and experimentation at scale",
  "statuscake": "Uptime and performance monitoring",
  "statuspage": "Status page hosting from Atlassian",
  "steve-ai": "AI video maker for animated content",
  "stitch": "Cloud-first data integration platform",
  "stoplight": "API design and documentation platform",
  "storyblok": "Headless CMS with visual editor",
  "storybook": "UI component development and testing",
  "strapi": "Open-source headless CMS",
  "streaks": "Habit tracking app for iOS",
  "stream": "Activity feeds and chat API",
  "stytch": "Passwordless authentication for developers",
  "sublime-text": "Fast and sophisticated text editor",
  "substack": "Newsletter platform for writers",
  "sumo-logic": "Cloud-native machine data analytics",
  "supertokens": "Open-source authentication solution",
  "superblocks": "Build internal tools with AI",
  "surfer-seo": "Content optimization for SEO",
  "surveymonkey": "Online survey and feedback platform",
  "swagger": "API design and documentation tools",
  "sweep": "AI junior developer for bug fixes",
  "swell": "Headless e-commerce for developers",
  "sysdig": "Container security and monitoring",
  "tableau": "Business intelligence and visualization platform",
  "tabler-icons": "Free open-source SVG icons",
  "tabnine": "AI code completion for any IDE",
  "tailscale": "Zero-config VPN using WireGuard",
  "tailwind": "Utility-first CSS framework",
  "talend": "Data integration and management",
  "talkjs": "Chat API for websites and apps",
  "tana": "AI-native workspace for notes and tasks",
  "tandem": "Virtual office for remote teams",
  "tawk-to": "Free live chat software",
  "teable": "Open-source Airtable alternative",
  "teamcity": "CI/CD server from JetBrains",
  "tekton": "Cloud-native CI/CD for Kubernetes",
  "teleporthq": "No-code website and UI builder",
  "temporal": "Durable execution for microservices",
  "terraform": "Infrastructure as code by HashiCorp",
  "terragrunt": "Thin wrapper for Terraform",
  "testcafe": "End-to-end testing without WebDriver",
  "testing-library": "Simple and complete testing utilities",
  "tettra": "Internal knowledge base and wiki",
  "text-generation-inference": "LLM serving from Hugging Face",
  "textexpander": "Snippet and text expansion tool",
  "things-3": "Personal task manager for Apple devices",
  "thunder-client": "REST API client for VS Code",
  "thunkable": "No-code mobile app builder",
  "tidb": "MySQL-compatible distributed database",
  "ticktick": "To-do list and habit tracker",
  "tidycal": "Simple scheduling tool from AppSumo",
  "tigergraph": "Enterprise graph database platform",
  "tilda": "Website builder for designers",
  "timescaledb": "Time-series database on PostgreSQL",
  "timing": "Automatic time tracking for Mac",
  "tinacms": "Git-backed headless CMS",
  "together-ai": "Platform for running open AI models",
  "toggl-track": "Simple time tracking for teams",
  "tooljet": "Open-source low-code platform",
  "topaz-labs": "AI photo and video enhancement",
  "tower": "Git client for Mac and Windows",
  "tracetest": "End-to-end testing for distributed systems",
  "trackjs": "JavaScript error monitoring",
  "transloadit": "File uploading and processing API",
  "travis-ci": "Hosted CI/CD for open source",
  "tray-io": "API integration platform for enterprises",
  "trend-micro": "Cybersecurity for hybrid environments",
  "tribe": "Community platform for brands",
  "trigger-dev": "Background jobs for developers",
  "triple-whale": "E-commerce analytics and attribution",
  "trivy": "Container and infrastructure security scanner",
  "trufflehog": "Find secrets in Git repositories",
  "trunk": "Code quality and developer experience tools",
  "tuple": "Remote pair programming app",
  "turbopack": "Incremental bundler for Next.js",
  "turborepo": "Monorepo build system from Vercel",
  "twingate": "Zero trust network access",
  "twist": "Async team communication from Doist",
  "typedream": "No-code website builder with Notion-like editing",
  "ubersuggest": "SEO and keyword research tool",
  "umami": "Simple, privacy-focused web analytics",
  "umso": "AI website builder for startups",
  "unicorn-platform": "Landing page builder for SaaS",
  "unleash": "Open-source feature flag platform",
  "upcloud": "European cloud infrastructure provider",
  "uploadthing": "File uploads for Next.js apps",
  "uploadcare": "File uploading and processing CDN",
  "upstash": "Serverless Redis and Kafka",
  "uptime-kuma": "Self-hosted uptime monitoring",
  "uptimerobot": "Free uptime monitoring service",
  "uptrace": "Open-source APM built on OpenTelemetry",
  "uptrends": "Website and API monitoring",
  "userpilot": "Product adoption and onboarding",
  "vs-code": "Free code editor from Microsoft",
  "vwo": "A/B testing and conversion optimization",
  "val-town": "Write and deploy serverless functions",
  "vectary": "3D design tool in the browser",
  "vector": "High-performance observability pipelines",
  "vectornator": "Free design app for Mac and iPad",
  "vendure": "Headless e-commerce framework",
  "veracode": "Application security testing platform",
  "vercel-edge-functions": "Run code at the edge with Vercel",
  "vespa": "Search and recommendation engine at scale",
  "victorops": "Incident management now part of Splunk",
  "vidyard": "Video platform for business",
  "vimcal": "Calendar for busy professionals",
  "vimeo": "Professional video hosting platform",
  "vite": "Next generation frontend build tool",
  "vitess": "Database clustering for horizontal scaling",
  "vitest": "Fast unit testing framework for Vite",
  "vuepress": "Static site generator for Vue.js",
  "vultr": "Cloud computing with global data centers",
  "wasmer": "Run WebAssembly anywhere",
  "wazuh": "Open-source security monitoring",
  "weweb": "No-code frontend builder for web apps",
  "weaviate": "Open-source vector database with ML",
  "webstorm": "JetBrains IDE for JavaScript",
  "webex": "Video conferencing from Cisco",
  "webpack": "JavaScript module bundler",
  "weights-biases": "ML experiment tracking and visualization",
  "wellsaid-labs": "AI voice generation for enterprises",
  "whalesync": "Two-way sync for Airtable and databases",
  "whereby": "Easy video meetings without downloads",
  "windmill": "Open-source developer platform for scripts",
  "wireguard": "Fast and modern VPN protocol",
  "wise": "International money transfers and accounts",
  "wistia": "Video hosting for business marketing",
  "wordtune": "AI writing companion for better text",
  "workos": "Enterprise-ready auth and directory sync",
  "workable": "Recruiting software for hiring teams",
  "workato": "Enterprise automation platform",
  "xano": "No-code backend for apps",
  "xcode": "Apple's IDE for iOS and macOS development",
  "yarn": "Fast and reliable JavaScript package manager",
  "youcanbook-me": "Simple online scheduling",
  "yugabytedb": "Distributed SQL database for cloud",
  "zed": "High-performance code editor in Rust",
  "zencastr": "Podcast recording in studio quality",
  "zeplin": "Design handoff for developers",
  "zerotier": "Software-defined networking for devices",
  "zilliz": "Cloud vector database for AI",
  "zipkin": "Distributed tracing system",
  "zitadel": "Open-source identity management",
  "zoho-creator": "Low-code platform from Zoho",
  "zoominfo": "B2B contact database and intelligence",
  "zulip": "Open-source team chat with threads",
  "cdnjs": "Free CDN for popular JavaScript libraries",
  "cert-manager": "Kubernetes add-on for certificates",
  "dbt": "Transform data in your warehouse with SQL",
  "esbuild": "Extremely fast JavaScript bundler",
  "jsdelivr": "Free CDN for open source packages",
  "k6": "Load testing tool for developers",
  "k9s": "Terminal UI to manage Kubernetes clusters",
  "mkcert": "Create local trusted dev certificates",
  "npm": "The world's largest software registry",
  "pnpm": "Fast, disk space efficient package manager",
  "pytest": "Python testing framework",
  "smallstep": "Zero-trust access and certificate management",
  "tldv": "AI meeting recorder for transcripts",
  "v0": "AI-powered UI generation from Vercel",
  "vllm": "Fast LLM serving with PagedAttention",
  "xmatters": "Incident management and alerting"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const dryRun = searchParams.get("dry") === "true";

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    pricingUpdated: 0,
    pricingSkipped: 0,
    pricingNotFound: 0,
    tldrUpdated: 0,
    tldrSkipped: 0,
    tldrNotFound: 0,
    errors: [] as string[],
  };

  // Update pricing for all tools
  for (const [slug, pricing] of Object.entries(allPricing)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: {
          id: true,
          pricingDetails: true,
          startingPrice: true,
          hasFreeTrial: true,
          pricingUrl: true
        }
      });

      if (!tool) {
        results.pricingNotFound++;
        continue;
      }

      // Check if pricing needs update (no existing details or very minimal)
      const existingDetails = tool.pricingDetails as Record<string, unknown> | null;
      const hasDetailedPricing = existingDetails?.tiers && Array.isArray(existingDetails.tiers) && existingDetails.tiers.length > 0;

      // Always update if we have better data
      if (!dryRun) {
        const updateData: Record<string, unknown> = {
          pricingDetails: {
            currency: pricing.currency || "USD",
            billingPeriod: pricing.billingPeriod || "month",
            tiers: pricing.tiers || [],
            notes: pricing.notes,
          },
        };

        // Update startingPrice if we have it
        if (typeof pricing.startingPrice === 'number') {
          updateData.startingPrice = pricing.startingPrice;
        }

        // Update hasFreeTrial
        if (pricing.hasFreeTrial !== undefined) {
          updateData.hasFreeTrial = pricing.hasFreeTrial;
        }

        // Update pricingUrl if we have it
        if (pricing.pricingPageUrl) {
          updateData.pricingUrl = pricing.pricingPageUrl;
        }

        await prisma.tool.update({
          where: { slug },
          data: updateData
        });
      }

      results.pricingUpdated++;
    } catch (error) {
      results.errors.push(`pricing:${slug}: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  // Update TLDRs for all tools
  for (const [slug, tldr] of Object.entries(allTLDRs)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, tagline: true }
      });

      if (!tool) {
        results.tldrNotFound++;
        continue;
      }

      // Check if tagline needs update
      const needsUpdate = !tool.tagline ||
                          tool.tagline.includes("Software tool") ||
                          tool.tagline.length < 30;

      if (!needsUpdate) {
        results.tldrSkipped++;
        continue;
      }

      if (!dryRun) {
        await prisma.tool.update({
          where: { slug },
          data: { tagline: tldr }
        });
      }

      results.tldrUpdated++;
    } catch (error) {
      results.errors.push(`tldr:${slug}: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    message: dryRun ? "Dry run completed" : "Update completed",
    summary: {
      pricing: {
        updated: results.pricingUpdated,
        skipped: results.pricingSkipped,
        notFound: results.pricingNotFound,
        total: Object.keys(allPricing).length
      },
      tldr: {
        updated: results.tldrUpdated,
        skipped: results.tldrSkipped,
        notFound: results.tldrNotFound,
        total: Object.keys(allTLDRs).length
      }
    },
    errors: results.errors.slice(0, 50)
  });
}
