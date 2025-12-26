import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Batch 2: Additional pricing data (December 2025)
const pricingData: Record<string, object> = {
  "15five": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.15five.com/pricing",
    tiers: [
      { name: "Engage", price: 4, period: "month", description: "Employee engagement", features: ["Engagement surveys", "Targeted assessments", "Action planning", "Heat maps", "Benchmarking"] },
      { name: "Perform", price: 10, period: "month", description: "Performance management", features: ["Performance reviews", "OKRs & goals", "360° feedback", "Talent matrix", "Career paths"], highlighted: true },
      { name: "Total Platform", price: 16, period: "month", description: "Complete solution", features: ["HR outcomes dashboard", "Manager microlearnings", "Manager effectiveness", "All Engage + Perform features"] },
      { name: "Transform", price: 99, period: "month", description: "Per manager add-on", features: ["Manager training", "Coaching resources", "Leadership development"] }
    ]
  },
  "aws": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://aws.amazon.com/pricing/",
    tiers: [
      { name: "Free Tier", price: 0, description: "12 months free + always free", features: ["750 hrs EC2/month", "5GB S3 storage", "25GB DynamoDB", "$200 credits for new accounts"] },
      { name: "Pay-As-You-Go", price: "Usage-based", description: "No upfront costs", features: ["Pay only for what you use", "No long-term contracts", "Scale up or down instantly", "100+ services"], highlighted: true },
      { name: "Savings Plans", price: "Custom", description: "Committed use discounts", features: ["Up to 72% savings", "1 or 3-year terms", "Flexible across services"] },
      { name: "Enterprise", price: "Custom", description: "Enterprise support", features: ["Dedicated TAM", "24/7 support", "Well-Architected reviews", "Training credits"] }
    ]
  },
  "ably": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://ably.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For experimenting", features: ["6M messages/month", "500 peak connections", "Community support", "No credit card required"] },
      { name: "Standard", price: 49.99, period: "month", description: "For production apps", features: ["Unlimited messages", "Pay per use", "Email support", "All integrations"], highlighted: true },
      { name: "Pro", price: 399, period: "month", description: "For growing businesses", features: ["Higher limits", "Priority support", "Advanced features", "SLA guarantee"] },
      { name: "Enterprise", price: "Custom", description: "For large scale", features: ["Custom limits", "Dedicated support", "Custom contracts", "99.999% SLA"] }
    ]
  },
  "abstract": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://www.goabstract.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["Unlimited viewers", "Version control", "50GB storage", "Figma & Sketch integration"] },
      { name: "Pro", price: 9, period: "month", description: "Per contributor", features: ["Focused reviews", "Review tracking", "Collections", "Inspect for specs"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For large teams", features: ["250GB storage", "SSO/SAML", "Branch reporting", "Priority support"] }
    ]
  },
  "acuity-scheduling": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://acuityscheduling.com/signup.php",
    tiers: [
      { name: "Emerging", price: 16, period: "month", description: "For new businesses", features: ["1 calendar", "Unlimited appointments", "Email reminders", "Payment processing"] },
      { name: "Growing", price: 27, period: "month", description: "For growing businesses", features: ["6 calendars", "SMS reminders", "Intake forms", "Group scheduling"], highlighted: true },
      { name: "Powerhouse", price: 49, period: "month", description: "For established businesses", features: ["36 calendars", "HIPAA compliance", "Multiple time zones", "API access"] },
      { name: "Enterprise", price: "Custom", description: "For large organizations", features: ["Unlimited calendars", "Custom integrations", "Dedicated support"] }
    ]
  },
  "adalo": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.adalo.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For learning", features: ["200 records/app", "Unlimited test apps", "Preview links only", "Community support"] },
      { name: "Starter", price: 36, period: "month", description: "For launching", features: ["1 published app", "Custom fonts", "Custom domain", "App store publishing"], highlighted: true },
      { name: "Professional", price: 52, period: "month", description: "For agencies", features: ["2 published apps", "5 editors", "Custom integrations", "Geolocation"] },
      { name: "Team", price: 160, period: "month", description: "For teams", features: ["5 published apps", "10 editors", "Priority support", "Xano integration"] },
      { name: "Business", price: 200, period: "month", description: "For businesses", features: ["10 published apps", "Unlimited editors", "Collections API", "Premium support"] }
    ]
  },
  "adobe-xd": {
    startingPrice: 54.99, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://www.adobe.com/creativecloud/plans.html",
    tiers: [
      { name: "Creative Cloud All Apps", price: 54.99, period: "month", description: "XD included", features: ["Adobe XD", "20+ Creative Cloud apps", "100GB storage", "Adobe Fonts"], highlighted: true },
      { name: "Students & Teachers", price: 19.99, period: "month", description: "Educational discount", features: ["All Creative Cloud apps", "First year pricing", "60% savings"] }
    ]
  },
  "ahrefs": {
    startingPrice: 29, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7, pricingPageUrl: "https://ahrefs.com/pricing",
    tiers: [
      { name: "Starter", price: 29, period: "month", description: "For hobbyists", features: ["1 project", "500 credits/month", "3 months history", "Basic reports"] },
      { name: "Lite", price: 129, period: "month", description: "For small businesses", features: ["5 projects", "500 credits/user", "6 months history", "750 tracked keywords"] },
      { name: "Standard", price: 249, period: "month", description: "For consultants", features: ["20 projects", "Unlimited credits", "2 years history", "2000 tracked keywords"], highlighted: true },
      { name: "Advanced", price: 449, period: "month", description: "For agencies", features: ["50 projects", "Unlimited credits", "Unlimited history", "5000 tracked keywords"] },
      { name: "Enterprise", price: 1499, period: "month", description: "For enterprises", features: ["Unlimited projects", "API access", "SSO", "Dedicated support"] }
    ]
  },
  "airbyte": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://airbyte.com/pricing",
    tiers: [
      { name: "Open Source", price: 0, description: "Self-hosted", features: ["Unlimited connectors", "Unlimited syncs", "Community support", "Full control"] },
      { name: "Cloud", price: 10, period: "month", description: "Fully managed", features: ["4 credits included", "$2.50/credit after", "450+ connectors", "Cloud hosted"], highlighted: true },
      { name: "Team", price: "Custom", description: "For growing teams", features: ["15-min sync intervals", "User management", "Audit logs", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["SOC 2 & HIPAA", "Self-hosted option", "Dedicated support", "Custom contracts"] }
    ]
  },
  "airbrake": {
    startingPrice: 19, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.airbrake.io/pricing",
    tiers: [
      { name: "Developer", price: 19, period: "month", description: "For individuals", features: ["1 user", "25K errors/month", "7-day retention", "Email notifications"] },
      { name: "Basic", price: 38, period: "month", description: "For small teams", features: ["Unlimited users", "50K errors/month", "30-day retention", "Slack integration"], highlighted: true },
      { name: "Pro", price: 99, period: "month", description: "For growing teams", features: ["Unlimited teams", "200K errors/month", "90-day retention", "Spike forgiveness"] }
    ]
  },
  "algolia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.algolia.com/pricing",
    tiers: [
      { name: "Build", price: 0, description: "For development", features: ["1M records", "10K requests/month", "Community support", "Basic analytics"] },
      { name: "Grow", price: "Usage-based", description: "Pay as you go", features: ["$0.50/1K requests", "$0.40/1K records", "Keyword search", "Standard support"], highlighted: true },
      { name: "Premium", price: "Custom", description: "Annual contract", features: ["AI features", "Dynamic re-ranking", "Personalization", "90-day analytics"] },
      { name: "Elevate", price: "Custom", description: "Enterprise AI", features: ["NeuralSearch", "Semantic search", "Enhanced SLA", "Dedicated support"] }
    ]
  },
  "confluence": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.atlassian.com/software/confluence/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 10 users", features: ["Unlimited pages", "3 whiteboards/user", "2GB storage", "Community support"] },
      { name: "Standard", price: 5.75, period: "month", description: "Per user", features: ["150,000 users max", "External collaboration", "250GB storage", "Business hours support"], highlighted: true },
      { name: "Premium", price: 11, period: "month", description: "Per user", features: ["Unlimited whiteboards", "AI features (Rovo)", "1TB storage", "24/7 support"] },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["Atlassian Analytics", "150 sites", "99.95% SLA", "Advanced security"] }
    ]
  },
  "bitbucket": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.atlassian.com/software/bitbucket/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["Unlimited repos", "1GB LFS storage", "50 build minutes", "Community support"] },
      { name: "Standard", price: 3, period: "month", description: "Per user", features: ["Unlimited users", "5GB LFS storage", "2500 build minutes", "Merge checks"], highlighted: true },
      { name: "Premium", price: 6, period: "month", description: "Per user", features: ["10GB LFS storage", "3500 build minutes", "IP whitelisting", "Required 2FA"] }
    ]
  },
  "cloudflare": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false, pricingPageUrl: "https://www.cloudflare.com/plans/",
    tiers: [
      { name: "Free", price: 0, description: "For personal sites", features: ["Unlimited bandwidth", "DDoS protection", "Free SSL", "Basic analytics"] },
      { name: "Pro", price: 20, period: "month", description: "For professionals", features: ["Faster performance", "Image optimization", "Web Application Firewall", "Mobile optimization"], highlighted: true },
      { name: "Business", price: 200, period: "month", description: "For businesses", features: ["100% uptime SLA", "PCI compliance", "Custom SSL", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["Dedicated support", "Custom solutions", "Advanced DDoS", "24/7 support"] }
    ]
  },
  "digitalocean": {
    startingPrice: 4, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.digitalocean.com/pricing",
    tiers: [
      { name: "Basic Droplet", price: 4, period: "month", description: "Starting price", features: ["1 vCPU", "512MB RAM", "10GB SSD", "500GB transfer"] },
      { name: "Regular Droplet", price: 6, period: "month", description: "For small apps", features: ["1 vCPU", "1GB RAM", "25GB SSD", "1TB transfer"], highlighted: true },
      { name: "CPU-Optimized", price: 42, period: "month", description: "For compute", features: ["2 dedicated vCPUs", "4GB RAM", "25GB SSD", "4TB transfer"] },
      { name: "GPU Droplet", price: "2.50/hr", description: "For AI/ML", features: ["NVIDIA GPU", "High performance", "On-demand or committed"] }
    ]
  },
  "twilio": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.twilio.com/en-us/pricing",
    tiers: [
      { name: "Pay-As-You-Go", price: "Usage-based", description: "No monthly fees", features: ["SMS from $0.0083", "Voice from $0.0085/min", "No contracts", "Free support"], highlighted: true },
      { name: "Volume Discounts", price: "Custom", description: "For high volume", features: ["Committed use discounts", "Higher rate limits", "Dedicated support"] }
    ]
  },
  "sendgrid": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://sendgrid.com/en-us/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For testing", features: ["100 emails/day", "API access", "SMTP relay", "3-day analytics"] },
      { name: "Essentials", price: 19.95, period: "month", description: "For small senders", features: ["50K emails/month", "Ticket support", "Dynamic templates", "Deliverability insights"], highlighted: true },
      { name: "Pro", price: 89.95, period: "month", description: "For growing businesses", features: ["100K emails/month", "Dedicated IP", "Subuser management", "Chat & phone support"] },
      { name: "Premier", price: "Custom", description: "For enterprises", features: ["Custom volume", "Dedicated account manager", "Priority support", "Custom features"] }
    ]
  },
  "segment": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://segment.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For startups", features: ["1,000 visitors/month", "2 sources", "450+ integrations", "Community support"] },
      { name: "Team", price: 120, period: "month", description: "For growing teams", features: ["10K visitors/month", "Unlimited sources", "Public API", "Email support"], highlighted: true },
      { name: "Business", price: "Custom", description: "For enterprises", features: ["Custom volume", "Advanced features", "Dedicated support", "Custom contracts"] }
    ]
  },
  "notion-calendar": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false, pricingPageUrl: "https://www.notion.so/product/calendar",
    tiers: [
      { name: "Free", price: 0, description: "For everyone", features: ["Calendar sync", "Time blocking", "Meeting scheduling", "Notion integration"], highlighted: true }
    ]
  },
  "linear-app": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://linear.app/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For small teams", features: ["250 active issues", "Unlimited members", "All integrations", "API access"] },
      { name: "Standard", price: 8, period: "month", description: "For growing teams", features: ["Unlimited issues", "Guest accounts", "Advanced security", "Priority support"], highlighted: true },
      { name: "Plus", price: 14, period: "month", description: "For scaling teams", features: ["Advanced roadmaps", "Project insights", "Team analytics", "Custom workflows"] },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["SAML SSO", "SCIM", "Audit logs", "Dedicated support"] }
    ]
  },
  "activepieces": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.activepieces.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Unlimited flows", "All pieces", "Community support", "Open source"] },
      { name: "Pro", price: 10, period: "month", description: "Cloud hosted", features: ["1,000 tasks/month", "Premium pieces", "Email support", "Cloud hosting"], highlighted: true },
      { name: "Platform", price: 500, period: "month", description: "For builders", features: ["White labeling", "Custom branding", "Embed in your app", "API access"] }
    ]
  },
  "adjust": {
    startingPrice: "Custom", currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.adjust.com/pricing/",
    tiers: [
      { name: "Base", price: "Custom", description: "For startups", features: ["Attribution", "Analytics", "Fraud prevention", "Standard support"] },
      { name: "Core", price: "Custom", description: "For growth", features: ["All Base features", "Advanced analytics", "A/B testing", "Priority support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["Custom solutions", "Dedicated support", "Custom integrations", "SLA"] }
    ]
  },
  "affinity-designer": {
    startingPrice: 69.99, currency: "USD", billingPeriod: "one-time", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://affinity.serif.com/designer/",
    tiers: [
      { name: "Affinity Designer 2", price: 69.99, period: "one-time", description: "Desktop app", features: ["Vector illustration", "UI/UX design", "Unlimited devices", "Free updates"], highlighted: true },
      { name: "Universal License", price: 169.99, period: "one-time", description: "All 3 apps", features: ["Designer + Photo + Publisher", "Mac + Windows + iPad", "Best value"] }
    ]
  },
  "affinity-photo": {
    startingPrice: 69.99, currency: "USD", billingPeriod: "one-time", hasFreeTrial: true, freeTrialDays: 30, pricingPageUrl: "https://affinity.serif.com/photo/",
    tiers: [
      { name: "Affinity Photo 2", price: 69.99, period: "one-time", description: "Desktop app", features: ["Photo editing", "RAW processing", "HDR merge", "Free updates"], highlighted: true },
      { name: "Universal License", price: 169.99, period: "one-time", description: "All 3 apps", features: ["Designer + Photo + Publisher", "Mac + Windows + iPad", "Best value"] }
    ]
  },
  "alfred": {
    startingPrice: 0, currency: "GBP", billingPeriod: "one-time", hasFreeTrial: true, pricingPageUrl: "https://www.alfredapp.com/shop/",
    tiers: [
      { name: "Free", price: 0, description: "Basic launcher", features: ["App launcher", "File search", "Web search", "Calculator"] },
      { name: "Single License", price: 34, period: "one-time", description: "One user", features: ["Powerpack features", "Workflows", "Clipboard history", "1Password integration"], highlighted: true },
      { name: "Mega Supporter", price: 59, period: "one-time", description: "Lifetime updates", features: ["All Powerpack features", "Free lifetime upgrades", "Priority support"] }
    ]
  },
  "amplitude-analytics": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://amplitude.com/pricing",
    tiers: [
      { name: "Starter", price: 0, description: "For getting started", features: ["50K MTUs", "Core analytics", "Unlimited users", "Community support"] },
      { name: "Plus", price: 49, period: "month", description: "For growing companies", features: ["1,000 MTUs", "Advanced charts", "Custom events", "Email support"], highlighted: true },
      { name: "Growth", price: "Custom", description: "For scaling", features: ["Custom MTUs", "Behavioral cohorts", "Predictive analytics", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["SSO", "Data governance", "Dedicated support", "Custom contracts"] }
    ]
  },
  "anthropic-claude-api": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://www.anthropic.com/pricing",
    tiers: [
      { name: "Claude 3.5 Sonnet", price: "Usage-based", description: "Best for coding", features: ["$3/M input tokens", "$15/M output tokens", "200K context", "Fast responses"], highlighted: true },
      { name: "Claude 3.5 Haiku", price: "Usage-based", description: "Fast & affordable", features: ["$0.80/M input", "$4/M output", "200K context", "Fastest model"] },
      { name: "Claude 3 Opus", price: "Usage-based", description: "Most capable", features: ["$15/M input", "$75/M output", "200K context", "Best reasoning"] }
    ]
  },
  "openai-api": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://openai.com/api/pricing/",
    tiers: [
      { name: "GPT-4o", price: "Usage-based", description: "Flagship model", features: ["$2.50/M input", "$10/M output", "128K context", "Vision + audio"], highlighted: true },
      { name: "GPT-4o mini", price: "Usage-based", description: "Fast & cheap", features: ["$0.15/M input", "$0.60/M output", "128K context", "Great for most tasks"] },
      { name: "GPT-4 Turbo", price: "Usage-based", description: "Previous flagship", features: ["$10/M input", "$30/M output", "128K context", "Vision capable"] }
    ]
  },
  "google-cloud": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://cloud.google.com/pricing",
    tiers: [
      { name: "Free Tier", price: 0, description: "Always free", features: ["$300 credits", "20+ free products", "No credit card for trial", "90-day trial"] },
      { name: "Pay-As-You-Go", price: "Usage-based", description: "No commitments", features: ["Per-second billing", "Sustained use discounts", "All services available"], highlighted: true },
      { name: "Committed Use", price: "Custom", description: "1-3 year terms", features: ["Up to 70% discount", "Predictable pricing", "Flexible across services"] }
    ]
  },
  "microsoft-azure": {
    startingPrice: 0, currency: "USD", billingPeriod: "usage", hasFreeTrial: true, pricingPageUrl: "https://azure.microsoft.com/pricing/",
    tiers: [
      { name: "Free Account", price: 0, description: "12 months free", features: ["$200 credit", "55+ always free services", "12 months popular services"] },
      { name: "Pay-As-You-Go", price: "Usage-based", description: "No commitments", features: ["Per-minute billing", "No upfront costs", "Scale instantly"], highlighted: true },
      { name: "Reserved", price: "Custom", description: "1-3 year terms", features: ["Up to 72% savings", "Predictable costs", "Exchange flexibility"] }
    ]
  },
  "heroku": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false, pricingPageUrl: "https://www.heroku.com/pricing",
    tiers: [
      { name: "Eco", price: 5, period: "month", description: "For hobbyists", features: ["1000 dyno hours/month", "Sleep after 30 min", "Custom domains"] },
      { name: "Basic", price: 7, period: "month", description: "Per dyno", features: ["Always on", "512MB RAM", "Free SSL"], highlighted: true },
      { name: "Standard", price: 25, period: "month", description: "Per dyno", features: ["Horizontal scaling", "512MB-1GB RAM", "Metrics"] },
      { name: "Performance", price: 250, period: "month", description: "Per dyno", features: ["Dedicated resources", "2.5GB-14GB RAM", "Autoscaling"] }
    ]
  },
  "netlify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false, pricingPageUrl: "https://www.netlify.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "For personal projects", features: ["100GB bandwidth", "300 build minutes", "Instant rollbacks", "Deploy previews"] },
      { name: "Pro", price: 19, period: "month", description: "Per member", features: ["1TB bandwidth", "25K build minutes", "Password protection", "Analytics"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For large teams", features: ["Custom bandwidth", "Unlimited builds", "SSO/SAML", "SLA guarantee"] }
    ]
  },
  "firebase": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false, pricingPageUrl: "https://firebase.google.com/pricing",
    tiers: [
      { name: "Spark", price: 0, description: "Free tier", features: ["1GB storage", "10GB transfer", "100 concurrent connections", "No cost"] },
      { name: "Blaze", price: "Usage-based", description: "Pay as you go", features: ["Unlimited storage", "Free tier included", "Cloud Functions", "All features"], highlighted: true }
    ]
  },
  "mongodb-atlas": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.mongodb.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For learning", features: ["512MB storage", "Shared RAM", "M0 cluster", "Community support"] },
      { name: "Serverless", price: "Usage-based", description: "Auto-scaling", features: ["Pay per operation", "Auto-scales to zero", "No cluster management"] },
      { name: "Dedicated", price: 57, period: "month", description: "Starting price", features: ["10GB+ storage", "Dedicated resources", "Backups", "Support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["Advanced security", "LDAP/Kerberos", "Dedicated support", "SLA"] }
    ]
  },
  "prisma": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.prisma.io/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["Prisma ORM", "Prisma Studio", "Community support", "All databases"] },
      { name: "Pro", price: 29, period: "month", description: "For teams", features: ["Accelerate", "Pulse", "Team collaboration", "Email support"], highlighted: true },
      { name: "Business", price: 599, period: "month", description: "For companies", features: ["Advanced features", "Priority support", "SLA guarantee"] },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["Self-hosted options", "Dedicated support", "Custom contracts"] }
    ]
  },
  "redis-cloud": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://redis.com/redis-enterprise-cloud/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For development", features: ["30MB storage", "30 connections", "Community support"] },
      { name: "Fixed", price: 5, period: "month", description: "Starting price", features: ["100MB storage", "256 connections", "Standard support"] },
      { name: "Flexible", price: "Usage-based", description: "Pay per GB", features: ["Custom storage", "Unlimited connections", "24/7 support"], highlighted: true },
      { name: "Annual", price: "Custom", description: "Committed use", features: ["Volume discounts", "Dedicated support", "SLA guarantee"] }
    ]
  },
  "elasticsearch": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.elastic.co/pricing/",
    tiers: [
      { name: "Standard", price: 95, period: "month", description: "Starting price", features: ["Search & analytics", "Machine learning", "Standard support"], highlighted: true },
      { name: "Gold", price: 109, period: "month", description: "For production", features: ["All Standard features", "24/5 support", "Alerting"] },
      { name: "Platinum", price: 125, period: "month", description: "Advanced features", features: ["All Gold features", "24/7 support", "Graph analytics"] },
      { name: "Enterprise", price: 175, period: "month", description: "Full platform", features: ["All features", "Dedicated support", "Custom SLA"] }
    ]
  },
  "new-relic": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://newrelic.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "For individuals", features: ["100GB data/month", "1 full user", "Unlimited basic users", "Community support"] },
      { name: "Standard", price: 99, period: "month", description: "Per full user", features: ["100GB data/month", "Unlimited users", "Email support"], highlighted: true },
      { name: "Pro", price: 349, period: "month", description: "Per full user", features: ["All Standard", "Custom retention", "24/7 support"] },
      { name: "Enterprise", price: 549, period: "month", description: "Per full user", features: ["All Pro", "FedRAMP", "HIPAA", "Dedicated support"] }
    ]
  },
  "grafana": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://grafana.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "Self-hosted", features: ["Open source", "Unlimited dashboards", "Community plugins", "Community support"] },
      { name: "Cloud Free", price: 0, description: "Hosted free tier", features: ["10K metrics", "50GB logs", "3 users", "14-day retention"] },
      { name: "Cloud Pro", price: 50, period: "month", description: "For teams", features: ["Unlimited metrics", "More retention", "Team features", "Standard support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["Enterprise plugins", "SSO/SAML", "24/7 support", "SLA"] }
    ]
  },
  "pagerduty": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.pagerduty.com/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For small teams", features: ["Up to 5 users", "Unlimited integrations", "Mobile app", "Email & SMS alerts"] },
      { name: "Professional", price: 21, period: "month", description: "Per user", features: ["Unlimited users", "On-call scheduling", "Escalation policies", "Live call routing"], highlighted: true },
      { name: "Business", price: 41, period: "month", description: "Per user", features: ["All Professional", "Event intelligence", "Stakeholder comms", "Priority support"] },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["All Business", "Advanced analytics", "Custom integrations", "Dedicated support"] }
    ]
  },
  "opsgenie": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://www.atlassian.com/software/opsgenie/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Up to 5 users", features: ["Basic alerting", "200 SMS/month", "Mobile app", "Email support"] },
      { name: "Essentials", price: 9, period: "month", description: "Per user", features: ["Advanced alerting", "On-call schedules", "Escalations", "24/5 support"], highlighted: true },
      { name: "Standard", price: 19, period: "month", description: "Per user", features: ["All Essentials", "Heartbeat monitoring", "Service management", "24/7 support"] },
      { name: "Enterprise", price: 29, period: "month", description: "Per user", features: ["All Standard", "Advanced analytics", "Stakeholder alerts", "Priority support"] }
    ]
  },
  "linear-b": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://linearb.io/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For small teams", features: ["Up to 7 devs", "Core metrics", "Git analytics", "Community support"] },
      { name: "Business", price: 40, period: "month", description: "Per dev", features: ["Unlimited devs", "WorkerB automation", "Investment allocation", "Standard support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For large orgs", features: ["All Business", "SSO/SAML", "Custom metrics", "Dedicated support"] }
    ]
  },
  "launchdarkly": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 14, pricingPageUrl: "https://launchdarkly.com/pricing/",
    tiers: [
      { name: "Starter", price: 0, description: "For developers", features: ["1,000 seats", "5 projects", "Basic targeting", "Community support"] },
      { name: "Pro", price: 20, period: "month", description: "Per seat", features: ["Unlimited seats", "Unlimited projects", "Segments", "Standard support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["All Pro", "SSO/SAML", "Audit logs", "Dedicated support"] }
    ]
  },
  "split": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, pricingPageUrl: "https://www.split.io/pricing/",
    tiers: [
      { name: "Free", price: 0, description: "For getting started", features: ["10 seats", "50K MTKs", "Basic features", "Community support"] },
      { name: "Growth", price: "Custom", description: "For growing teams", features: ["Unlimited seats", "Advanced targeting", "Analytics", "Standard support"], highlighted: true },
      { name: "Enterprise", price: "Custom", description: "For enterprises", features: ["All Growth", "SSO", "Audit logs", "Dedicated support"] }
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("💰 Starting batch 2 pricing update...\n");

  let updated = 0;
  let notFound = 0;
  const errors: string[] = [];
  const notFoundList: string[] = [];

  for (const [slug, pricing] of Object.entries(pricingData)) {
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
        data: {
          pricingDetails: pricing
        }
      });

      updated++;
    } catch (error) {
      errors.push(slug);
    }
  }

  return NextResponse.json({
    success: true,
    updated,
    notFound,
    notFoundList,
    errors,
    total: Object.keys(pricingData).length
  });
}
