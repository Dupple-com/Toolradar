import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// All tools extracted from pricing and TLDR files (1184 total)
const allTools: Array<{slug: string; name: string; tagline?: string; startingPrice?: number | null; notes?: string; hasFreeTrial?: boolean}> = [
  {
    "slug": "better-stack",
    "name": "Better Stack",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "calendly",
    "name": "Calendly",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Scheduling automation that eliminated the back-and-forth"
  },
  {
    "slug": "chameleon",
    "name": "Chameleon",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "In-app product tours and user onboarding"
  },
  {
    "slug": "chargebee",
    "name": "Chargebee",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Subscription billing and revenue management"
  },
  {
    "slug": "circleci",
    "name": "Circleci",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Continuous integration that scales with your team"
  },
  {
    "slug": "clickup",
    "name": "Clickup",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Feature-packed productivity platform that tries to replace everything else"
  },
  {
    "slug": "close",
    "name": "Close",
    "startingPrice": 9,
    "hasFreeTrial": true,
    "tagline": "CRM built for inside sales teams who live on the phone"
  },
  {
    "slug": "contentful",
    "name": "Contentful",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Headless CMS for digital experiences"
  },
  {
    "slug": "convertkit",
    "name": "Convertkit",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Email marketing built for creators"
  },
  {
    "slug": "copper",
    "name": "Copper",
    "startingPrice": 9,
    "hasFreeTrial": true,
    "tagline": "CRM that works inside Google Workspace"
  },
  {
    "slug": "cursor",
    "name": "Cursor",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI-first code editor built on VS Code"
  },
  {
    "slug": "docker",
    "name": "Docker",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Containerization that made 'works on my machine' a solved problem"
  },
  {
    "slug": "doppler",
    "name": "Doppler",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Secrets management for development teams"
  },
  {
    "slug": "drip",
    "name": "Drip",
    "startingPrice": 39,
    "hasFreeTrial": true,
    "tagline": "E-commerce CRM and email marketing for online stores"
  },
  {
    "slug": "github",
    "name": "Github",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Where the world's code lives, plus CI/CD, issues, and project management"
  },
  {
    "slug": "grafana",
    "name": "Grafana",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source observability and dashboards"
  },
  {
    "slug": "grammarly",
    "name": "Grammarly",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI writing assistant that catches more than just typos"
  },
  {
    "slug": "gumroad",
    "name": "Gumroad",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Sell digital products directly to your audience"
  },
  {
    "slug": "hasura",
    "name": "Hasura",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Instant GraphQL APIs on your databases"
  },
  {
    "slug": "hotjar",
    "name": "Hotjar",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "See how users actually interact with your site via heatmaps and recordings"
  },
  {
    "slug": "intercom",
    "name": "Intercom",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Customer messaging platform with AI-powered support"
  },
  {
    "slug": "miro",
    "name": "Miro",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Infinite whiteboard for brainstorming, diagramming, and visual collaboration"
  },
  {
    "slug": "mixpanel",
    "name": "Mixpanel",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Product analytics focused on user behavior and events"
  },
  {
    "slug": "monday",
    "name": "Monday",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual work management that adapts to any workflow or team size"
  },
  {
    "slug": "mongodb-atlas",
    "name": "Mongodb Atlas",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "netlify",
    "name": "Netlify",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Modern web hosting with continuous deployment and serverless functions"
  },
  {
    "slug": "notion",
    "name": "Notion",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "All-in-one workspace combining docs, wikis, databases, and project boards"
  },
  {
    "slug": "pagerduty",
    "name": "Pagerduty",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Incident response and on-call management"
  },
  {
    "slug": "postman",
    "name": "Postman",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API development platform from design to testing to documentation"
  },
  {
    "slug": "prisma",
    "name": "Prisma",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Next-generation ORM for Node.js and TypeScript"
  },
  {
    "slug": "railway",
    "name": "Railway",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Deploy apps and databases from GitHub in one click"
  },
  {
    "slug": "render",
    "name": "Render",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cloud platform that makes deployment as easy as git push"
  },
  {
    "slug": "retool",
    "name": "Retool",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build internal tools fast with drag-and-drop"
  },
  {
    "slug": "sentry",
    "name": "Sentry",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Error tracking that helps developers fix bugs faster"
  },
  {
    "slug": "sendgrid",
    "name": "Sendgrid",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Transactional email API trusted by developers worldwide"
  },
  {
    "slug": "stripe",
    "name": "Stripe",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Payment processing that developers love to implement"
  },
  {
    "slug": "supabase",
    "name": "Supabase",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source Firebase alternative with Postgres and real-time"
  },
  {
    "slug": "vercel",
    "name": "Vercel",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Deploy frontend apps in seconds with zero configuration"
  },
  {
    "slug": "webflow",
    "name": "Webflow",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual web development platform with CMS and hosting"
  },
  {
    "slug": "zendesk",
    "name": "Zendesk",
    "startingPrice": 19,
    "hasFreeTrial": true,
    "tagline": "Help desk software that scales from startup to enterprise"
  },
  {
    "slug": "algolia",
    "name": "Algolia",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "launchdarkly",
    "name": "Launchdarkly",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Feature flags and experimentation at scale"
  },
  {
    "slug": "clutch",
    "name": "Clutch",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "B2B ratings and reviews for agencies"
  },
  {
    "slug": "salesforce",
    "name": "Salesforce",
    "startingPrice": 25,
    "hasFreeTrial": true,
    "tagline": "The CRM giant that enterprise sales teams love to hate"
  },
  {
    "slug": "zoho-crm",
    "name": "Zoho CRM",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Full-featured CRM at a fraction of Salesforce's price"
  },
  {
    "slug": "folk",
    "name": "Folk",
    "startingPrice": 17.5,
    "hasFreeTrial": true,
    "tagline": "CRM for relationship-driven businesses"
  },
  {
    "slug": "slack",
    "name": "Slack",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Real-time messaging that replaced email for modern teams"
  },
  {
    "slug": "zoom",
    "name": "Zoom",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Video conferencing that became a verb during the pandemic"
  },
  {
    "slug": "loom",
    "name": "Loom",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Async video messages that replace meetings and long emails"
  },
  {
    "slug": "discord",
    "name": "Discord",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Voice, video, and text chat originally for gamers, now used everywhere"
  },
  {
    "slug": "sketch",
    "name": "Sketch",
    "startingPrice": 10,
    "hasFreeTrial": true,
    "tagline": "Mac-native UI design tool that pioneered the modern design workflow"
  },
  {
    "slug": "n8n",
    "name": "N8n",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Self-hostable workflow automation for technical teams"
  },
  {
    "slug": "buffer",
    "name": "Buffer",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Schedule and analyze social media posts across platforms"
  },
  {
    "slug": "sprout-social",
    "name": "Sprout Social",
    "startingPrice": 199,
    "hasFreeTrial": true,
    "tagline": "Social media management with customer care features"
  },
  {
    "slug": "later",
    "name": "Later",
    "startingPrice": 18.75,
    "hasFreeTrial": true,
    "tagline": "Social media scheduling focused on visual content"
  },
  {
    "slug": "mailgun",
    "name": "Mailgun",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Transactional email API for developers"
  },
  {
    "slug": "postmark",
    "name": "Postmark",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Transactional email with high deliverability"
  },
  {
    "slug": "twilio",
    "name": "Twilio",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "basecamp",
    "name": "Basecamp",
    "startingPrice": 15,
    "hasFreeTrial": true,
    "tagline": "Opinionated project management that keeps teams focused on what matters"
  },
  {
    "slug": "cloudflare",
    "name": "Cloudflare",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "CDN, security, and serverless at the edge of the internet"
  },
  {
    "slug": "datadog",
    "name": "Datadog",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cloud monitoring platform with APM, logs, and infrastructure metrics"
  },
  {
    "slug": "snyk",
    "name": "Snyk",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Developer security platform for finding and fixing vulnerabilities"
  },
  {
    "slug": "wordpress",
    "name": "Wordpress",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "claude",
    "name": "Claude",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Anthropic's AI assistant known for nuanced reasoning and long context"
  },
  {
    "slug": "jasper",
    "name": "Jasper",
    "startingPrice": 59,
    "hasFreeTrial": true,
    "tagline": "AI writing assistant built for marketing and content teams"
  },
  {
    "slug": "writesonic",
    "name": "Writesonic",
    "startingPrice": 39,
    "hasFreeTrial": true,
    "tagline": "AI content creation with built-in SEO optimization"
  },
  {
    "slug": "copy-ai",
    "name": "Copy AI",
    "startingPrice": 24,
    "hasFreeTrial": true,
    "tagline": "Generate marketing copy, emails, and content at scale"
  },
  {
    "slug": "replicate",
    "name": "Replicate",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Run AI models in the cloud"
  },
  {
    "slug": "runway",
    "name": "Runway",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI video generation and editing for creative professionals"
  },
  {
    "slug": "otter",
    "name": "Otter",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "fireflies",
    "name": "Fireflies",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "synthesia",
    "name": "Synthesia",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Create videos with AI avatars instead of filming yourself"
  },
  {
    "slug": "livekit",
    "name": "Livekit",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "notion-calendar",
    "name": "Notion Calendar",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "rippling",
    "name": "Rippling",
    "startingPrice": 8,
    "hasFreeTrial": true,
    "tagline": "Unified HR, IT, and Finance in one platform"
  },
  {
    "slug": "tawk-to",
    "name": "Tawk To",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free live chat software"
  },
  {
    "slug": "evernote",
    "name": "Evernote",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "The original note-taking app, still kicking after all these years"
  },
  {
    "slug": "todoist",
    "name": "Todoist",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Simple, cross-platform task management that just works"
  },
  {
    "slug": "any-do",
    "name": "Any Do",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Simple to-do list and daily planner app"
  },
  {
    "slug": "ticktick",
    "name": "Ticktick",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "To-do list and habit tracker"
  },
  {
    "slug": "obsidian",
    "name": "Obsidian",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Markdown-based knowledge management with local-first storage"
  },
  {
    "slug": "craft",
    "name": "Craft",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Beautiful document editor with native Apple integration"
  },
  {
    "slug": "invideo",
    "name": "Invideo",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "activecampaign",
    "name": "Activecampaign",
    "startingPrice": 15,
    "hasFreeTrial": true,
    "tagline": "Marketing automation with advanced segmentation and CRM"
  },
  {
    "slug": "aws",
    "name": "AWS",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "The cloud infrastructure that powers half the internet"
  },
  {
    "slug": "gitlab",
    "name": "Gitlab",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Complete DevOps platform in a single application"
  },
  {
    "slug": "pixlr",
    "name": "Pixlr",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "piktochart",
    "name": "Piktochart",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "prezi",
    "name": "Prezi",
    "startingPrice": 5,
    "hasFreeTrial": true
  },
  {
    "slug": "storychief",
    "name": "Storychief",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "strapi",
    "name": "Strapi",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source headless CMS"
  },
  {
    "slug": "directus",
    "name": "Directus",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source headless CMS with REST and GraphQL"
  },
  {
    "slug": "ghost",
    "name": "Ghost",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source publishing platform for blogs"
  },
  {
    "slug": "airtable",
    "name": "Airtable",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "asana",
    "name": "Asana",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Task and project management for teams who need structure without complexity"
  },
  {
    "slug": "teamwork",
    "name": "Teamwork",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Agency-friendly project management with built-in time tracking and billing"
  },
  {
    "slug": "jotform",
    "name": "Jotform",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Powerful form builder with templates for every use case"
  },
  {
    "slug": "tally",
    "name": "Tally",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Free form builder with modern UX and Notion integration"
  },
  {
    "slug": "formstack",
    "name": "Formstack",
    "startingPrice": 50,
    "hasFreeTrial": true
  },
  {
    "slug": "surveymonkey",
    "name": "Surveymonkey",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Online survey and feedback platform"
  },
  {
    "slug": "vidyard",
    "name": "Vidyard",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Video platform for business"
  },
  {
    "slug": "screencastify",
    "name": "Screencastify",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "lemlist",
    "name": "Lemlist",
    "startingPrice": 55,
    "hasFreeTrial": true,
    "tagline": "Cold email outreach with personalization"
  },
  {
    "slug": "apollo",
    "name": "Apollo",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "instantly",
    "name": "Instantly",
    "startingPrice": 30,
    "hasFreeTrial": true
  },
  {
    "slug": "smartlead",
    "name": "Smartlead",
    "startingPrice": 32.5,
    "hasFreeTrial": true
  },
  {
    "slug": "woodpecker",
    "name": "Woodpecker",
    "startingPrice": 24,
    "hasFreeTrial": true
  },
  {
    "slug": "hunter",
    "name": "Hunter",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Find email addresses for outreach"
  },
  {
    "slug": "waalaxy",
    "name": "Waalaxy",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "gong",
    "name": "Gong",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "Revenue intelligence platform for sales teams"
  },
  {
    "slug": "outreach",
    "name": "Outreach",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "Sales engagement platform"
  },
  {
    "slug": "softr",
    "name": "Softr",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build apps and portals from Airtable"
  },
  {
    "slug": "glide",
    "name": "Glide",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build apps from spreadsheets without code"
  },
  {
    "slug": "appsmith",
    "name": "Appsmith",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build internal tools with drag-and-drop interface"
  },
  {
    "slug": "tooljet",
    "name": "Tooljet",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source low-code platform"
  },
  {
    "slug": "budibase",
    "name": "Budibase",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build internal tools and business apps quickly"
  },
  {
    "slug": "nocodb",
    "name": "Nocodb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source Airtable alternative"
  },
  {
    "slug": "metabase",
    "name": "Metabase",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source business intelligence tool"
  },
  {
    "slug": "tableau",
    "name": "Tableau",
    "startingPrice": 15,
    "hasFreeTrial": true,
    "tagline": "Business intelligence and visualization platform"
  },
  {
    "slug": "weebly",
    "name": "Weebly",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "carrd",
    "name": "Carrd",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build simple one-page websites quickly"
  },
  {
    "slug": "strikingly",
    "name": "Strikingly",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "ecwid",
    "name": "Ecwid",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "E-commerce widget for any website"
  },
  {
    "slug": "volusion",
    "name": "Volusion",
    "startingPrice": 35,
    "hasFreeTrial": true
  },
  {
    "slug": "sellfy",
    "name": "Sellfy",
    "startingPrice": 22,
    "hasFreeTrial": true
  },
  {
    "slug": "payhip",
    "name": "Payhip",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Sell digital downloads and memberships"
  },
  {
    "slug": "podia",
    "name": "Podia",
    "startingPrice": 33,
    "hasFreeTrial": true,
    "tagline": "All-in-one platform for courses, downloads, and communities"
  },
  {
    "slug": "hostinger",
    "name": "Hostinger",
    "startingPrice": 2.99,
    "hasFreeTrial": false
  },
  {
    "slug": "krisp",
    "name": "Krisp",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI noise cancellation for calls"
  },
  {
    "slug": "gather",
    "name": "Gather",
    "startingPrice": 12,
    "hasFreeTrial": true,
    "tagline": "Virtual spaces for remote team gatherings"
  },
  {
    "slug": "mentimeter",
    "name": "Mentimeter",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "whimsical",
    "name": "Whimsical",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "kahoot",
    "name": "Kahoot",
    "startingPrice": 19,
    "hasFreeTrial": true
  },
  {
    "slug": "trello",
    "name": "Trello",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Simple kanban boards for organizing anything, from projects to grocery lists"
  },
  {
    "slug": "dropbox",
    "name": "Dropbox",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cloud storage and file synchronization"
  },
  {
    "slug": "1password",
    "name": "1password",
    "startingPrice": 2.99,
    "hasFreeTrial": true,
    "tagline": "Password manager trusted by individuals and businesses alike"
  },
  {
    "slug": "typeform",
    "name": "Typeform",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Beautiful, conversational forms that people enjoy filling out"
  },
  {
    "slug": "auth0",
    "name": "Auth0",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Developer-friendly authentication and authorization"
  },
  {
    "slug": "amplitude",
    "name": "Amplitude",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Product analytics with experimentation and feature flags"
  },
  {
    "slug": "customer-io",
    "name": "Customer IO",
    "startingPrice": 100,
    "hasFreeTrial": true,
    "tagline": "Automated messaging based on user behavior"
  },
  {
    "slug": "okta",
    "name": "Okta",
    "startingPrice": 6,
    "hasFreeTrial": true,
    "tagline": "Enterprise identity and access management"
  },
  {
    "slug": "mongodb",
    "name": "Mongodb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Document database that made NoSQL mainstream"
  },
  {
    "slug": "better-uptime",
    "name": "Better Uptime",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Uptime monitoring with beautiful status pages"
  },
  {
    "slug": "mailchimp",
    "name": "Mailchimp",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Email marketing that grew up to become a full marketing platform"
  },
  {
    "slug": "getresponse",
    "name": "Getresponse",
    "startingPrice": 13.12,
    "hasFreeTrial": true
  },
  {
    "slug": "brevo",
    "name": "Brevo",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Marketing platform with email, SMS, chat, and CRM in one"
  },
  {
    "slug": "moosend",
    "name": "Moosend",
    "startingPrice": 9,
    "hasFreeTrial": true
  },
  {
    "slug": "hubspot",
    "name": "Hubspot",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "All-in-one marketing, sales, and CRM platform that scales with you"
  },
  {
    "slug": "pipedrive",
    "name": "Pipedrive",
    "startingPrice": 14,
    "hasFreeTrial": true,
    "tagline": "Visual sales pipeline management built for salespeople"
  },
  {
    "slug": "insomnia",
    "name": "Insomnia",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API client for REST and GraphQL"
  },
  {
    "slug": "jetbrains",
    "name": "Jetbrains",
    "startingPrice": 10.9,
    "hasFreeTrial": true
  },
  {
    "slug": "heap",
    "name": "Heap",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Auto-capture analytics that retroactively answers any question"
  },
  {
    "slug": "bitwarden",
    "name": "Bitwarden",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source password manager you can self-host"
  },
  {
    "slug": "lastpass",
    "name": "Lastpass",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Widely adopted password manager despite security incidents"
  },
  {
    "slug": "dashlane",
    "name": "Dashlane",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Password manager with VPN and dark web monitoring"
  },
  {
    "slug": "digitalocean",
    "name": "Digitalocean",
    "startingPrice": 4,
    "hasFreeTrial": true,
    "tagline": "Simple cloud hosting without the AWS complexity tax"
  },
  {
    "slug": "linode",
    "name": "Linode",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "Cloud computing with simple and predictable pricing"
  },
  {
    "slug": "xero",
    "name": "Xero",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Cloud accounting that accountants actually like using"
  },
  {
    "slug": "expensify",
    "name": "Expensify",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "Expense management and receipt scanning"
  },
  {
    "slug": "lattice",
    "name": "Lattice",
    "startingPrice": 11,
    "hasFreeTrial": true,
    "tagline": "Performance management and employee engagement"
  },
  {
    "slug": "workable",
    "name": "Workable",
    "startingPrice": 299,
    "hasFreeTrial": true,
    "tagline": "Recruiting software for hiring teams"
  },
  {
    "slug": "lever",
    "name": "Lever",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "ATS with CRM capabilities for relationship-driven recruiting"
  },
  {
    "slug": "greenhouse",
    "name": "Greenhouse",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "Structured hiring platform for growing companies"
  },
  {
    "slug": "quickbooks",
    "name": "Quickbooks",
    "startingPrice": 30,
    "hasFreeTrial": true,
    "tagline": "Small business accounting from the company that defined the category"
  },
  {
    "slug": "freshbooks",
    "name": "Freshbooks",
    "startingPrice": 17,
    "hasFreeTrial": true,
    "tagline": "Invoicing and accounting built for freelancers and small businesses"
  },
  {
    "slug": "gusto",
    "name": "Gusto",
    "startingPrice": 40,
    "hasFreeTrial": true,
    "tagline": "Payroll, benefits, and HR for small businesses"
  },
  {
    "slug": "help-scout",
    "name": "Help Scout",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Customer support software that feels like email"
  },
  {
    "slug": "crisp",
    "name": "Crisp",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Live chat and customer messaging for modern businesses"
  },
  {
    "slug": "tidio",
    "name": "Tidio",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Live chat with chatbots for e-commerce websites"
  },
  {
    "slug": "liveagent",
    "name": "Liveagent",
    "startingPrice": 15,
    "hasFreeTrial": true
  },
  {
    "slug": "front",
    "name": "Front",
    "startingPrice": 25,
    "hasFreeTrial": true,
    "tagline": "Shared inbox for customer communication"
  },
  {
    "slug": "freshdesk",
    "name": "Freshdesk",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Help desk that balances features with usability"
  },
  {
    "slug": "hubspot-service",
    "name": "Hubspot Service",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "surfer",
    "name": "Surfer",
    "startingPrice": 79,
    "hasFreeTrial": true
  },
  {
    "slug": "clearscope",
    "name": "Clearscope",
    "startingPrice": 129,
    "hasFreeTrial": true,
    "tagline": "Content optimization for search engines"
  },
  {
    "slug": "se-ranking",
    "name": "Se Ranking",
    "startingPrice": 47.2,
    "hasFreeTrial": true
  },
  {
    "slug": "spyfu",
    "name": "Spyfu",
    "startingPrice": 29,
    "hasFreeTrial": true
  },
  {
    "slug": "similarweb",
    "name": "Similarweb",
    "startingPrice": 125,
    "hasFreeTrial": true
  },
  {
    "slug": "buzzsumo",
    "name": "Buzzsumo",
    "startingPrice": 199,
    "hasFreeTrial": true
  },
  {
    "slug": "ahrefs",
    "name": "Ahrefs",
    "startingPrice": 129,
    "hasFreeTrial": false,
    "tagline": "SEO toolset for backlink analysis and keyword research"
  },
  {
    "slug": "semrush",
    "name": "Semrush",
    "startingPrice": 139.95,
    "hasFreeTrial": true,
    "tagline": "All-in-one marketing toolkit for SEO"
  },
  {
    "slug": "moz",
    "name": "Moz",
    "startingPrice": 99,
    "hasFreeTrial": true,
    "tagline": "SEO software and link analysis tools"
  },
  {
    "slug": "docusign",
    "name": "Docusign",
    "startingPrice": 10,
    "hasFreeTrial": true,
    "tagline": "Electronic signatures that are legally binding worldwide"
  },
  {
    "slug": "aweber",
    "name": "Aweber",
    "startingPrice": 15,
    "hasFreeTrial": true
  },
  {
    "slug": "klaviyo",
    "name": "Klaviyo",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Email and SMS marketing built specifically for e-commerce"
  },
  {
    "slug": "sync",
    "name": "Sync",
    "startingPrice": 6,
    "hasFreeTrial": true
  },
  {
    "slug": "smartsheet",
    "name": "Smartsheet",
    "startingPrice": 129,
    "hasFreeTrial": true,
    "tagline": "Spreadsheet-based project management for complex enterprise workflows"
  },
  {
    "slug": "google-workspace",
    "name": "Google Workspace",
    "startingPrice": 6,
    "hasFreeTrial": true
  },
  {
    "slug": "microsoft-365",
    "name": "Microsoft 365",
    "startingPrice": 6,
    "hasFreeTrial": true
  },
  {
    "slug": "box",
    "name": "Box",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "bitrix24",
    "name": "Bitrix24",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "nifty",
    "name": "Nifty",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "jira",
    "name": "Jira",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "The industry standard for software development tracking and agile workflows"
  },
  {
    "slug": "confluence",
    "name": "Confluence",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Team wiki and documentation for Atlassian users"
  },
  {
    "slug": "apollo-graphql",
    "name": "Apollo Graphql",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "appcues",
    "name": "Appcues",
    "startingPrice": 300,
    "hasFreeTrial": true,
    "tagline": "Build in-app onboarding flows without code"
  },
  {
    "slug": "pendo",
    "name": "Pendo",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Product analytics with in-app guides for user onboarding"
  },
  {
    "slug": "segment",
    "name": "Segment",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Customer data platform that connects all your tools"
  },
  {
    "slug": "toggl-track",
    "name": "Toggl Track",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Simple time tracking for teams"
  },
  {
    "slug": "clockify",
    "name": "Clockify",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "streamyard",
    "name": "Streamyard",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "riverside",
    "name": "Riverside",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "High-quality remote podcast and video recording"
  },
  {
    "slug": "otter-ai",
    "name": "Otter AI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI meeting notes and transcription"
  },
  {
    "slug": "rev",
    "name": "Rev",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "descript",
    "name": "Descript",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Edit video by editing text transcripts"
  },
  {
    "slug": "snappa",
    "name": "Snappa",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "figma",
    "name": "Figma",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Browser-based design tool where teams can collaborate in real-time"
  },
  {
    "slug": "canva",
    "name": "Canva",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Design tool that makes everyone a graphic designer"
  },
  {
    "slug": "adobe-creative-cloud",
    "name": "Adobe Creative Cloud",
    "startingPrice": 22.99,
    "hasFreeTrial": true,
    "tagline": "The professional creative suite: Photoshop, Illustrator, Premiere"
  },
  {
    "slug": "lucidchart",
    "name": "Lucidchart",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "wordtune",
    "name": "Wordtune",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI writing companion for better text"
  },
  {
    "slug": "chatgpt",
    "name": "Chatgpt",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "OpenAI's conversational AI that started the generative AI revolution"
  },
  {
    "slug": "notion-ai",
    "name": "Notion AI",
    "startingPrice": 10,
    "hasFreeTrial": true,
    "tagline": "AI writing and Q&A built directly into your Notion workspace"
  },
  {
    "slug": "rytr",
    "name": "Rytr",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "lemon-squeezy",
    "name": "Lemon Squeezy",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "shopify",
    "name": "Shopify",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "E-commerce platform that powers over a million online stores"
  },
  {
    "slug": "squarespace",
    "name": "Squarespace",
    "startingPrice": 12,
    "hasFreeTrial": true,
    "tagline": "Beautiful websites with built-in e-commerce"
  },
  {
    "slug": "wix",
    "name": "Wix",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Website builder that grew into a full business platform"
  },
  {
    "slug": "hootsuite",
    "name": "Hootsuite",
    "startingPrice": 99,
    "hasFreeTrial": true,
    "tagline": "Enterprise social media management and analytics"
  },
  {
    "slug": "socialbee",
    "name": "Socialbee",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "AI-powered social media scheduling and content recycling"
  },
  {
    "slug": "sendible",
    "name": "Sendible",
    "startingPrice": 29,
    "hasFreeTrial": true
  },
  {
    "slug": "agorapulse",
    "name": "Agorapulse",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "planoly",
    "name": "Planoly",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "tailwind",
    "name": "Tailwind",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Utility-first CSS framework"
  },
  {
    "slug": "bardeen",
    "name": "Bardeen",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "zapier",
    "name": "Zapier",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Connect apps and automate workflows without code"
  },
  {
    "slug": "make",
    "name": "Make",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual automation platform with powerful data transformation"
  },
  {
    "slug": "coda",
    "name": "Coda",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "power-bi",
    "name": "Power Bi",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Business intelligence and visualization by Microsoft"
  },
  {
    "slug": "looker",
    "name": "Looker",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Business intelligence by Google Cloud"
  },
  {
    "slug": "paypal",
    "name": "Paypal",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "The original online payment system, still everywhere"
  },
  {
    "slug": "plaid",
    "name": "Plaid",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "cloudinary",
    "name": "Cloudinary",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "heroku",
    "name": "Heroku",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "The original easy deployment platform, now owned by Salesforce"
  },
  {
    "slug": "fly-io",
    "name": "Fly IO",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "planetscale",
    "name": "Planetscale",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "Serverless MySQL with branching for schema changes"
  },
  {
    "slug": "redis",
    "name": "Redis",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "In-memory data store for caching, queues, and real-time features"
  },
  {
    "slug": "kapwing",
    "name": "Kapwing",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Browser-based video editor with AI features"
  },
  {
    "slug": "midjourney",
    "name": "Midjourney",
    "startingPrice": 10,
    "hasFreeTrial": false,
    "tagline": "AI image generation through Discord with distinctive artistic style"
  },
  {
    "slug": "dall-e",
    "name": "Dall E",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "OpenAI's image generator integrated into ChatGPT Plus"
  },
  {
    "slug": "stable-diffusion",
    "name": "Stable Diffusion",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source AI image generation you can run locally"
  },
  {
    "slug": "elevenlabs",
    "name": "Elevenlabs",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI voice cloning and text-to-speech with stunning realism"
  },
  {
    "slug": "pika",
    "name": "Pika",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "beehiiv",
    "name": "Beehiiv",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Newsletter platform built for growth and monetization"
  },
  {
    "slug": "substack",
    "name": "Substack",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Newsletter platform for writers"
  },
  {
    "slug": "memberful",
    "name": "Memberful",
    "startingPrice": 49,
    "hasFreeTrial": true
  },
  {
    "slug": "patreon",
    "name": "Patreon",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "teachable",
    "name": "Teachable",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Course platform focused on simplicity and marketing"
  },
  {
    "slug": "thinkific",
    "name": "Thinkific",
    "startingPrice": 36,
    "hasFreeTrial": true,
    "tagline": "Create and sell online courses with your own platform"
  },
  {
    "slug": "kajabi",
    "name": "Kajabi",
    "startingPrice": 55,
    "hasFreeTrial": true,
    "tagline": "Complete business platform for knowledge entrepreneurs"
  },
  {
    "slug": "circle",
    "name": "Circle",
    "startingPrice": 89,
    "hasFreeTrial": true,
    "tagline": "Community platform for creators and brands"
  },
  {
    "slug": "udemy",
    "name": "Udemy",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "skillshare",
    "name": "Skillshare",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "coursera",
    "name": "Coursera",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "linkedin-learning",
    "name": "Linkedin Learning",
    "startingPrice": 29.99,
    "hasFreeTrial": true
  },
  {
    "slug": "crowdstrike",
    "name": "Crowdstrike",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Endpoint security that stops breaches before they happen"
  },
  {
    "slug": "posthog",
    "name": "Posthog",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source product analytics, session replay, and feature flags"
  },
  {
    "slug": "fullstory",
    "name": "Fullstory",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Digital experience intelligence through session replay"
  },
  {
    "slug": "optimizely",
    "name": "Optimizely",
    "startingPrice": null,
    "hasFreeTrial": true
  },
  {
    "slug": "bamboohr",
    "name": "Bamboohr",
    "startingPrice": 5.25,
    "hasFreeTrial": true,
    "tagline": "HR software for small and medium businesses"
  },
  {
    "slug": "15five",
    "name": "15five",
    "startingPrice": 4,
    "hasFreeTrial": true,
    "tagline": "Continuous performance management with weekly check-ins"
  },
  {
    "slug": "workday",
    "name": "Workday",
    "startingPrice": null,
    "hasFreeTrial": false
  },
  {
    "slug": "drift",
    "name": "Drift",
    "startingPrice": null,
    "hasFreeTrial": true
  },
  {
    "slug": "bitbucket",
    "name": "Bitbucket",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Git repository hosting with Jira integration for Atlassian shops"
  },
  {
    "slug": "new-relic",
    "name": "New Relic",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Full-stack observability platform for modern applications"
  },
  {
    "slug": "browserstack",
    "name": "Browserstack",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Test your website on real browsers and devices in the cloud"
  },
  {
    "slug": "lambdatest",
    "name": "Lambdatest",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cross-browser testing platform with AI features"
  },
  {
    "slug": "cypress",
    "name": "Cypress",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Modern end-to-end testing for web applications"
  },
  {
    "slug": "playwright",
    "name": "Playwright",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Cross-browser automation from Microsoft"
  },
  {
    "slug": "selenium",
    "name": "Selenium",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "The original browser automation framework"
  },
  {
    "slug": "jest",
    "name": "Jest",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "JavaScript testing framework with zero configuration"
  },
  {
    "slug": "zoho-books",
    "name": "Zoho Books",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Comprehensive accounting as part of the Zoho ecosystem"
  },
  {
    "slug": "bill-com",
    "name": "Bill Com",
    "startingPrice": 45,
    "hasFreeTrial": true
  },
  {
    "slug": "wave",
    "name": "Wave",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free accounting software for small businesses"
  },
  {
    "slug": "sage",
    "name": "Sage",
    "startingPrice": 10,
    "hasFreeTrial": true
  },
  {
    "slug": "brex",
    "name": "Brex",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Corporate cards and spend management for startups"
  },
  {
    "slug": "dropbox-sign",
    "name": "Dropbox Sign",
    "startingPrice": 10.05,
    "hasFreeTrial": true
  },
  {
    "slug": "pandadoc",
    "name": "Pandadoc",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Document automation with proposals, contracts, and e-signatures"
  },
  {
    "slug": "signnow",
    "name": "Signnow",
    "startingPrice": 8,
    "hasFreeTrial": true,
    "tagline": "Affordable e-signature solution for businesses of all sizes"
  },
  {
    "slug": "adobe-sign",
    "name": "Adobe Sign",
    "startingPrice": 12.99,
    "hasFreeTrial": true
  },
  {
    "slug": "juro",
    "name": "Juro",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "AI-powered contract management for in-house legal teams"
  },
  {
    "slug": "ironclad",
    "name": "Ironclad",
    "startingPrice": null,
    "hasFreeTrial": true,
    "tagline": "Enterprise contract lifecycle management"
  },
  {
    "slug": "clio",
    "name": "Clio",
    "startingPrice": 39,
    "hasFreeTrial": true,
    "tagline": "Legal practice management software for law firms"
  },
  {
    "slug": "gitbook",
    "name": "Gitbook",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Documentation platform that developers actually enjoy using"
  },
  {
    "slug": "roam-research",
    "name": "Roam Research",
    "startingPrice": 15,
    "hasFreeTrial": true,
    "tagline": "Networked note-taking that pioneered bi-directional linking"
  },
  {
    "slug": "readwise",
    "name": "Readwise",
    "startingPrice": 5.59,
    "hasFreeTrial": true
  },
  {
    "slug": "mailerlite",
    "name": "Mailerlite",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "omnisend",
    "name": "Omnisend",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "flodesk",
    "name": "Flodesk",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "buttondown",
    "name": "Buttondown",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Simple newsletter tool for independent writers"
  },
  {
    "slug": "loops",
    "name": "Loops",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Email marketing for modern SaaS"
  },
  {
    "slug": "resend",
    "name": "Resend",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Developer-first email API"
  },
  {
    "slug": "vs-code",
    "name": "Vs Code",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free code editor from Microsoft"
  },
  {
    "slug": "intellij-idea",
    "name": "Intellij Idea",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "JetBrains IDE for Java development"
  },
  {
    "slug": "pycharm",
    "name": "Pycharm",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "JetBrains IDE for Python development"
  },
  {
    "slug": "webstorm",
    "name": "Webstorm",
    "startingPrice": 169,
    "hasFreeTrial": true,
    "tagline": "JetBrains IDE for JavaScript"
  },
  {
    "slug": "goland",
    "name": "Goland",
    "startingPrice": 249,
    "hasFreeTrial": true,
    "tagline": "JetBrains IDE for Go development"
  },
  {
    "slug": "sublime-text",
    "name": "Sublime Text",
    "startingPrice": 99,
    "hasFreeTrial": true,
    "tagline": "Fast and sophisticated text editor"
  },
  {
    "slug": "neovim",
    "name": "Neovim",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Hyperextensible Vim-based text editor"
  },
  {
    "slug": "vim",
    "name": "Vim",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "zed",
    "name": "Zed",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "High-performance code editor in Rust"
  },
  {
    "slug": "android-studio",
    "name": "Android Studio",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Official IDE for Android app development"
  },
  {
    "slug": "xcode",
    "name": "Xcode",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Apple's IDE for iOS and macOS development"
  },
  {
    "slug": "eclipse",
    "name": "Eclipse",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source IDE for Java and other languages"
  },
  {
    "slug": "notepad-plus-plus",
    "name": "Notepad Plus Plus",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free source code editor for Windows"
  },
  {
    "slug": "nova",
    "name": "Nova",
    "startingPrice": 99,
    "hasFreeTrial": true,
    "tagline": "Mac-native code editor from Panic"
  },
  {
    "slug": "lapce",
    "name": "Lapce",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Fast open-source code editor in Rust"
  },
  {
    "slug": "git",
    "name": "GIT",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "gitkraken",
    "name": "Gitkraken",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual Git client with intuitive interface"
  },
  {
    "slug": "sourcetree",
    "name": "Sourcetree",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free Git GUI for Mac and Windows"
  },
  {
    "slug": "github-desktop",
    "name": "Github Desktop",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Simple Git GUI for GitHub repositories"
  },
  {
    "slug": "fork-git",
    "name": "Fork GIT",
    "startingPrice": 49.99,
    "hasFreeTrial": true,
    "tagline": "Fast and friendly Git client for Mac and Windows"
  },
  {
    "slug": "tower",
    "name": "Tower",
    "startingPrice": 69,
    "hasFreeTrial": true,
    "tagline": "Git client for Mac and Windows"
  },
  {
    "slug": "lazygit",
    "name": "Lazygit",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Terminal UI for Git commands"
  },
  {
    "slug": "sanity",
    "name": "Sanity",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Composable content platform with real-time collaboration"
  },
  {
    "slug": "storyblok",
    "name": "Storyblok",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Headless CMS with visual editor"
  },
  {
    "slug": "prismic",
    "name": "Prismic",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Headless CMS with Slice Machine"
  },
  {
    "slug": "payload",
    "name": "Payload",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Headless CMS and application framework"
  },
  {
    "slug": "keystonejs",
    "name": "Keystonejs",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Headless CMS and GraphQL API framework"
  },
  {
    "slug": "hygraph",
    "name": "Hygraph",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "GraphQL-native headless CMS"
  },
  {
    "slug": "datocms",
    "name": "Datocms",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Headless CMS with powerful image processing"
  },
  {
    "slug": "tinacms",
    "name": "Tinacms",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Git-backed headless CMS"
  },
  {
    "slug": "builder-io",
    "name": "Builder IO",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual development platform with headless CMS"
  },
  {
    "slug": "webflow-cms",
    "name": "Webflow Cms",
    "startingPrice": 23,
    "hasFreeTrial": true
  },
  {
    "slug": "docusaurus",
    "name": "Docusaurus",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Build documentation websites with React"
  },
  {
    "slug": "nextra",
    "name": "Nextra",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Static site generator for Next.js docs"
  },
  {
    "slug": "vuepress",
    "name": "Vuepress",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Static site generator for Vue.js"
  },
  {
    "slug": "readme",
    "name": "Readme",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Developer hub for API documentation"
  },
  {
    "slug": "mintlify",
    "name": "Mintlify",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Beautiful documentation that writes itself"
  },
  {
    "slug": "hetzner",
    "name": "Hetzner",
    "startingPrice": 4.51,
    "hasFreeTrial": false,
    "tagline": "Affordable cloud and dedicated servers"
  },
  {
    "slug": "vultr",
    "name": "Vultr",
    "startingPrice": 2.5,
    "hasFreeTrial": true,
    "tagline": "Cloud computing with global data centers"
  },
  {
    "slug": "flyio",
    "name": "Flyio",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Deploy apps close to users on edge infrastructure"
  },
  {
    "slug": "upcloud",
    "name": "Upcloud",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "European cloud infrastructure provider"
  },
  {
    "slug": "scaleway",
    "name": "Scaleway",
    "startingPrice": 0.0025,
    "hasFreeTrial": false,
    "tagline": "European cloud provider with AI infrastructure"
  },
  {
    "slug": "oracle-cloud",
    "name": "Oracle Cloud",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Enterprise cloud from Oracle"
  },
  {
    "slug": "ovhcloud",
    "name": "Ovhcloud",
    "startingPrice": 3.5,
    "hasFreeTrial": true,
    "tagline": "European cloud provider with competitive pricing"
  },
  {
    "slug": "coolify",
    "name": "Coolify",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Self-hostable Heroku and Netlify alternative"
  },
  {
    "slug": "dokku",
    "name": "Dokku",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "caprover",
    "name": "Caprover",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "kubernetes",
    "name": "Kubernetes",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "k3s",
    "name": "K3s",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Lightweight Kubernetes for edge and IoT"
  },
  {
    "slug": "rancher",
    "name": "Rancher",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Kubernetes management platform"
  },
  {
    "slug": "portainer",
    "name": "Portainer",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Container management for Docker and Kubernetes"
  },
  {
    "slug": "postgresql",
    "name": "Postgresql",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "mysql",
    "name": "Mysql",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Popular open-source relational database"
  },
  {
    "slug": "mariadb",
    "name": "Mariadb",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Community-driven MySQL fork"
  },
  {
    "slug": "neon",
    "name": "Neon",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Serverless Postgres with branching"
  },
  {
    "slug": "turso",
    "name": "Turso",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Edge SQLite database"
  },
  {
    "slug": "upstash",
    "name": "Upstash",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Serverless Redis and Kafka"
  },
  {
    "slug": "cockroachdb",
    "name": "Cockroachdb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Distributed SQL database for cloud applications"
  },
  {
    "slug": "timescaledb",
    "name": "Timescaledb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Time-series database on PostgreSQL"
  },
  {
    "slug": "questdb",
    "name": "Questdb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Time series database for fast analytics"
  },
  {
    "slug": "influxdb",
    "name": "Influxdb",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "singlestore",
    "name": "Singlestore",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Real-time distributed database"
  },
  {
    "slug": "neo4j",
    "name": "Neo4j",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Graph database for connected data"
  },
  {
    "slug": "dgraph",
    "name": "Dgraph",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Distributed graph database with GraphQL"
  },
  {
    "slug": "faunadb",
    "name": "Faunadb",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Serverless document database with GraphQL"
  },
  {
    "slug": "duckdb",
    "name": "Duckdb",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Fast in-process analytics database"
  },
  {
    "slug": "sqlite",
    "name": "Sqlite",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "baserow",
    "name": "Baserow",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source Airtable alternative you can self-host"
  },
  {
    "slug": "woocommerce",
    "name": "Woocommerce",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "WordPress e-commerce plugin for maximum flexibility"
  },
  {
    "slug": "bigcommerce",
    "name": "Bigcommerce",
    "startingPrice": 29,
    "hasFreeTrial": true,
    "tagline": "Enterprise e-commerce without the enterprise complexity"
  },
  {
    "slug": "magento",
    "name": "Magento",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source e-commerce platform"
  },
  {
    "slug": "prestashop",
    "name": "Prestashop",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source e-commerce platform"
  },
  {
    "slug": "opencart",
    "name": "Opencart",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source e-commerce platform"
  },
  {
    "slug": "medusa",
    "name": "Medusa",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source headless commerce engine"
  },
  {
    "slug": "saleor",
    "name": "Saleor",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "GraphQL-first open-source e-commerce"
  },
  {
    "slug": "vendure",
    "name": "Vendure",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Headless e-commerce framework"
  },
  {
    "slug": "swell",
    "name": "Swell",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Headless e-commerce for developers"
  },
  {
    "slug": "paddle",
    "name": "Paddle",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Payment infrastructure for SaaS"
  },
  {
    "slug": "snipcart",
    "name": "Snipcart",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "E-commerce cart for any website"
  },
  {
    "slug": "square",
    "name": "Square",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Payment processing and POS systems"
  },
  {
    "slug": "printful",
    "name": "Printful",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Print-on-demand and dropshipping"
  },
  {
    "slug": "printify",
    "name": "Printify",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Print-on-demand for custom products"
  },
  {
    "slug": "google-meet",
    "name": "Google Meet",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Video conferencing integrated with Google Workspace"
  },
  {
    "slug": "microsoft-teams",
    "name": "Microsoft Teams",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Chat, calls, and collaboration baked into Microsoft 365"
  },
  {
    "slug": "whereby",
    "name": "Whereby",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Easy video meetings without downloads"
  },
  {
    "slug": "around",
    "name": "Around",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Video calling designed for screen sharing and collaboration"
  },
  {
    "slug": "linear",
    "name": "Linear",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Fast, keyboard-first issue tracking built for modern dev teams"
  },
  {
    "slug": "height",
    "name": "Height",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI-powered project tracking that automates the tedious parts"
  },
  {
    "slug": "travis-ci",
    "name": "Travis CI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Hosted CI/CD for open source"
  },
  {
    "slug": "jenkins",
    "name": "Jenkins",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source automation server for CI/CD"
  },
  {
    "slug": "teamcity",
    "name": "Teamcity",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "CI/CD server from JetBrains"
  },
  {
    "slug": "drone",
    "name": "Drone",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Self-hosted continuous delivery platform"
  },
  {
    "slug": "semaphore",
    "name": "Semaphore",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Fast CI/CD for high-performance teams"
  },
  {
    "slug": "buildkite",
    "name": "Buildkite",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "azure-devops",
    "name": "Azure Devops",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Microsoft's complete DevOps platform"
  },
  {
    "slug": "github-actions",
    "name": "Github Actions",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "CI/CD automation built into GitHub"
  },
  {
    "slug": "terraform",
    "name": "Terraform",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Infrastructure as code by HashiCorp"
  },
  {
    "slug": "pulumi",
    "name": "Pulumi",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Infrastructure as code with real programming languages"
  },
  {
    "slug": "ansible",
    "name": "Ansible",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Automate IT infrastructure with simple YAML playbooks"
  },
  {
    "slug": "argo-cd",
    "name": "Argo CD",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "GitOps continuous delivery for Kubernetes"
  },
  {
    "slug": "flux-cd",
    "name": "Flux CD",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "GitOps for Kubernetes deployments"
  },
  {
    "slug": "spinnaker",
    "name": "Spinnaker",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Continuous delivery platform for cloud"
  },
  {
    "slug": "harbor",
    "name": "Harbor",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "docker-hub",
    "name": "Docker Hub",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Container image registry for sharing Docker images"
  },
  {
    "slug": "quay",
    "name": "Quay",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "openai-api",
    "name": "Openai API",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API access to GPT, DALL-E, and Whisper"
  },
  {
    "slug": "anthropic-api",
    "name": "Anthropic API",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API access to Claude for building AI applications"
  },
  {
    "slug": "google-gemini",
    "name": "Google Gemini",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Google's multimodal AI model"
  },
  {
    "slug": "mistral-ai",
    "name": "Mistral AI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "European AI company with open models"
  },
  {
    "slug": "groq",
    "name": "Groq",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Ultra-fast AI inference with custom hardware"
  },
  {
    "slug": "together-ai",
    "name": "Together AI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Platform for running open AI models"
  },
  {
    "slug": "hugging-face",
    "name": "Hugging Face",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Platform for sharing ML models and datasets"
  },
  {
    "slug": "openrouter",
    "name": "Openrouter",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Unified API for multiple AI models"
  },
  {
    "slug": "ollama",
    "name": "Ollama",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Run open-source LLMs locally with one command"
  },
  {
    "slug": "lm-studio",
    "name": "Lm Studio",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Run local LLMs with user-friendly interface"
  },
  {
    "slug": "perplexity",
    "name": "Perplexity",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "AI search engine with cited answers"
  },
  {
    "slug": "dalle",
    "name": "Dalle",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "OpenAI's image generation AI available via API"
  },
  {
    "slug": "leonardo-ai",
    "name": "Leonardo AI",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "AI image generation for creative professionals"
  },
  {
    "slug": "pika-labs",
    "name": "Pika Labs",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "AI video generation from text prompts"
  },
  {
    "slug": "resemble-ai",
    "name": "Resemble AI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI voice cloning and synthesis"
  },
  {
    "slug": "speechify",
    "name": "Speechify",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Text-to-speech for reading"
  },
  {
    "slug": "murf-ai",
    "name": "Murf AI",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI voice generator for professional voiceovers"
  },
  {
    "slug": "prometheus",
    "name": "Prometheus",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source monitoring and alerting"
  },
  {
    "slug": "dynatrace",
    "name": "Dynatrace",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Full-stack observability and AIOps platform"
  },
  {
    "slug": "splunk",
    "name": "Splunk",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Platform for searching and analyzing machine data"
  },
  {
    "slug": "elastic-apm",
    "name": "Elastic Apm",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Application performance monitoring for Elastic Stack"
  },
  {
    "slug": "honeycomb",
    "name": "Honeycomb",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Observability for distributed systems"
  },
  {
    "slug": "bugsnag",
    "name": "Bugsnag",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Error monitoring with diagnostic data for debugging"
  },
  {
    "slug": "rollbar",
    "name": "Rollbar",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Error tracking and debugging platform"
  },
  {
    "slug": "raygun",
    "name": "Raygun",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Error tracking and performance monitoring"
  },
  {
    "slug": "jaeger",
    "name": "Jaeger",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Distributed tracing for microservices"
  },
  {
    "slug": "zipkin",
    "name": "Zipkin",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Distributed tracing system"
  },
  {
    "slug": "opentelemetry",
    "name": "Opentelemetry",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Vendor-neutral observability framework"
  },
  {
    "slug": "loki",
    "name": "Loki",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Log aggregation system from Grafana Labs"
  },
  {
    "slug": "signoz",
    "name": "Signoz",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source observability platform"
  },
  {
    "slug": "uptrace",
    "name": "Uptrace",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source APM built on OpenTelemetry"
  },
  {
    "slug": "logtail",
    "name": "Logtail",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Log management built on ClickHouse"
  },
  {
    "slug": "papertrail",
    "name": "Papertrail",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cloud-hosted log management"
  },
  {
    "slug": "logz-io",
    "name": "Logz IO",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Observability platform based on open-source"
  },
  {
    "slug": "graylog",
    "name": "Graylog",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source log management platform"
  },
  {
    "slug": "fluentd",
    "name": "Fluentd",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source data collector for unified logging"
  },
  {
    "slug": "vector",
    "name": "Vector",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "High-performance observability pipelines"
  },
  {
    "slug": "shortcut",
    "name": "Shortcut",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Project management for software teams"
  },
  {
    "slug": "livechat",
    "name": "Livechat",
    "startingPrice": 19,
    "hasFreeTrial": true
  },
  {
    "slug": "chatwoot",
    "name": "Chatwoot",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source customer engagement platform"
  },
  {
    "slug": "ses",
    "name": "Ses",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "mailjet",
    "name": "Mailjet",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Email marketing and transactional email"
  },
  {
    "slug": "hubspot-marketing",
    "name": "Hubspot Marketing",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "adobe-xd",
    "name": "Adobe Xd",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "UI/UX design tool for websites and mobile apps"
  },
  {
    "slug": "affinity-designer",
    "name": "Affinity Designer",
    "startingPrice": 69.99,
    "hasFreeTrial": true,
    "tagline": "Professional vector graphics editor without subscription"
  },
  {
    "slug": "penpot",
    "name": "Penpot",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source design and prototyping platform"
  },
  {
    "slug": "lunacy",
    "name": "Lunacy",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free design software with built-in assets"
  },
  {
    "slug": "invision",
    "name": "Invision",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Prototyping and collaboration for design teams"
  },
  {
    "slug": "principle",
    "name": "Principle",
    "startingPrice": 5,
    "hasFreeTrial": true,
    "tagline": "Animated interface design for Mac"
  },
  {
    "slug": "protopie",
    "name": "Protopie",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Interactive prototyping for all devices"
  },
  {
    "slug": "rive",
    "name": "Rive",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Interactive animations for apps and games"
  },
  {
    "slug": "spline",
    "name": "Spline",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "3D design tool for the web"
  },
  {
    "slug": "blender",
    "name": "Blender",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free and open-source 3D creation suite"
  },
  {
    "slug": "inkscape",
    "name": "Inkscape",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free vector graphics editor"
  },
  {
    "slug": "gimp",
    "name": "Gimp",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free and open-source image editor"
  },
  {
    "slug": "krita",
    "name": "Krita",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free digital painting and illustration software"
  },
  {
    "slug": "procreate",
    "name": "Procreate",
    "startingPrice": 12.99,
    "hasFreeTrial": false,
    "tagline": "Digital illustration app for iPad"
  },
  {
    "slug": "adobe-illustrator",
    "name": "Adobe Illustrator",
    "startingPrice": 22.99,
    "hasFreeTrial": true
  },
  {
    "slug": "adobe-photoshop",
    "name": "Adobe Photoshop",
    "startingPrice": 22.99,
    "hasFreeTrial": true
  },
  {
    "slug": "photopea",
    "name": "Photopea",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free online photo editor like Photoshop"
  },
  {
    "slug": "pixelmator-pro",
    "name": "Pixelmator Pro",
    "startingPrice": 49.99,
    "hasFreeTrial": true,
    "tagline": "Image editing for Mac with ML features"
  },
  {
    "slug": "zeplin",
    "name": "Zeplin",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Design handoff for developers"
  },
  {
    "slug": "abstract",
    "name": "Abstract",
    "startingPrice": 15,
    "hasFreeTrial": true
  },
  {
    "slug": "lottie",
    "name": "Lottie",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Render After Effects animations on any platform"
  },
  {
    "slug": "fontjoy",
    "name": "Fontjoy",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "AI-powered font pairing generator"
  },
  {
    "slug": "framer",
    "name": "Framer",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Design tool that exports to production-ready websites"
  },
  {
    "slug": "bubble",
    "name": "Bubble",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Build web apps visually without writing code"
  },
  {
    "slug": "adalo",
    "name": "Adalo",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Build mobile apps visually without writing code"
  },
  {
    "slug": "stacker",
    "name": "Stacker",
    "startingPrice": 59,
    "hasFreeTrial": true,
    "tagline": "Build apps on top of spreadsheets"
  },
  {
    "slug": "pipedream",
    "name": "Pipedream",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Connect APIs with code and no-code"
  },
  {
    "slug": "xano",
    "name": "Xano",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "No-code backend for apps"
  },
  {
    "slug": "pocketbase",
    "name": "Pocketbase",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source backend in a single file"
  },
  {
    "slug": "flutterflow",
    "name": "Flutterflow",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build Flutter apps visually without code"
  },
  {
    "slug": "draftbit",
    "name": "Draftbit",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Build native mobile apps visually"
  },
  {
    "slug": "trivy",
    "name": "Trivy",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Container and infrastructure security scanner"
  },
  {
    "slug": "semgrep",
    "name": "Semgrep",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Code scanning for security and quality"
  },
  {
    "slug": "sonarqube",
    "name": "Sonarqube",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Self-hosted code quality platform"
  },
  {
    "slug": "sonarcloud",
    "name": "Sonarcloud",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Cloud-based code quality analysis"
  },
  {
    "slug": "dependabot",
    "name": "Dependabot",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Automated dependency updates for GitHub repos"
  },
  {
    "slug": "renovate",
    "name": "Renovate",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Automated dependency updates for any platform"
  },
  {
    "slug": "gitleaks",
    "name": "Gitleaks",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Detect secrets in Git repositories"
  },
  {
    "slug": "trufflehog",
    "name": "Trufflehog",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Find secrets in Git repositories"
  },
  {
    "slug": "owasp-zap",
    "name": "Owasp Zap",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source web security scanner"
  },
  {
    "slug": "burp-suite",
    "name": "Burp Suite",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Web security testing toolkit for penetration testers"
  },
  {
    "slug": "hashicorp-vault",
    "name": "Hashicorp Vault",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Secrets management and data protection"
  },
  {
    "slug": "infisical",
    "name": "Infisical",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source secrets management platform"
  },
  {
    "slug": "1password-business",
    "name": "1password Business",
    "startingPrice": 7.99,
    "hasFreeTrial": true
  },
  {
    "slug": "falco",
    "name": "Falco",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Runtime security for containers and Kubernetes"
  },
  {
    "slug": "wazuh",
    "name": "Wazuh",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source security monitoring"
  },
  {
    "slug": "github-pages",
    "name": "Github Pages",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "cloudflare-pages",
    "name": "Cloudflare Pages",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "aws-amplify",
    "name": "AWS Amplify",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "wordpress-com",
    "name": "Wordpress Com",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "super",
    "name": "Super",
    "startingPrice": 12,
    "hasFreeTrial": true
  },
  {
    "slug": "typedream",
    "name": "Typedream",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "No-code website builder with Notion-like editing"
  },
  {
    "slug": "namecheap",
    "name": "Namecheap",
    "startingPrice": 1.58,
    "hasFreeTrial": false,
    "tagline": "Domain registration and web hosting"
  },
  {
    "slug": "siteground",
    "name": "Siteground",
    "startingPrice": 2.99,
    "hasFreeTrial": false
  },
  {
    "slug": "bluehost",
    "name": "Bluehost",
    "startingPrice": 2.95,
    "hasFreeTrial": false
  },
  {
    "slug": "dreamhost",
    "name": "Dreamhost",
    "startingPrice": 2.95,
    "hasFreeTrial": true
  },
  {
    "slug": "a2-hosting",
    "name": "A2 Hosting",
    "startingPrice": 2.99,
    "hasFreeTrial": false
  },
  {
    "slug": "kinsta",
    "name": "Kinsta",
    "startingPrice": 35,
    "hasFreeTrial": false
  },
  {
    "slug": "wpengine",
    "name": "Wpengine",
    "startingPrice": 20,
    "hasFreeTrial": true
  },
  {
    "slug": "pantheon",
    "name": "Pantheon",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "cal-com",
    "name": "Cal Com",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source Calendly alternative you can self-host"
  },
  {
    "slug": "savvycal",
    "name": "Savvycal",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Scheduling that puts recipients first"
  },
  {
    "slug": "tidycal",
    "name": "Tidycal",
    "startingPrice": 29,
    "hasFreeTrial": false,
    "tagline": "Simple scheduling tool from AppSumo"
  },
  {
    "slug": "youcanbook-me",
    "name": "Youcanbook Me",
    "startingPrice": 10.8,
    "hasFreeTrial": true,
    "tagline": "Simple online scheduling"
  },
  {
    "slug": "reclaim",
    "name": "Reclaim",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI scheduling assistant for calendars"
  },
  {
    "slug": "motion",
    "name": "Motion",
    "startingPrice": 19,
    "hasFreeTrial": true,
    "tagline": "AI calendar that auto-schedules tasks"
  },
  {
    "slug": "fantastical",
    "name": "Fantastical",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Calendar app for Apple devices with natural language"
  },
  {
    "slug": "raycast",
    "name": "Raycast",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Blazing fast launcher for productivity"
  },
  {
    "slug": "alfred",
    "name": "Alfred",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Productivity app for Mac with custom workflows"
  },
  {
    "slug": "textexpander",
    "name": "Textexpander",
    "startingPrice": 3.33,
    "hasFreeTrial": true,
    "tagline": "Snippet and text expansion tool"
  },
  {
    "slug": "logseq",
    "name": "Logseq",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source knowledge management and notes"
  },
  {
    "slug": "things-3",
    "name": "Things 3",
    "startingPrice": 49.99,
    "hasFreeTrial": false,
    "tagline": "Personal task manager for Apple devices"
  },
  {
    "slug": "omnifocus",
    "name": "Omnifocus",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "GTD task manager for Apple devices"
  },
  {
    "slug": "streaks",
    "name": "Streaks",
    "startingPrice": 4.99,
    "hasFreeTrial": false,
    "tagline": "Habit tracking app for iOS"
  },
  {
    "slug": "puppeteer",
    "name": "Puppeteer",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Node.js library for browser automation"
  },
  {
    "slug": "vitest",
    "name": "Vitest",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Fast unit testing framework for Vite"
  },
  {
    "slug": "mocha",
    "name": "Mocha",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "JavaScript test framework for Node.js"
  },
  {
    "slug": "testing-library",
    "name": "Testing Library",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Simple and complete testing utilities"
  },
  {
    "slug": "storybook",
    "name": "Storybook",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "UI component development and testing"
  },
  {
    "slug": "sauce-labs",
    "name": "Sauce Labs",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Cross-browser and mobile app testing cloud"
  },
  {
    "slug": "testim",
    "name": "Testim",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "mabl",
    "name": "Mabl",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI-powered test automation platform"
  },
  {
    "slug": "hoppscotch",
    "name": "Hoppscotch",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source API development ecosystem"
  },
  {
    "slug": "gatling",
    "name": "Gatling",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Load testing for web applications"
  },
  {
    "slug": "locust",
    "name": "Locust",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "artillery",
    "name": "Artillery",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "checkly",
    "name": "Checkly",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API and browser monitoring with Playwright tests"
  },
  {
    "slug": "percy",
    "name": "Percy",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "applitools",
    "name": "Applitools",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Visual AI testing for web and mobile apps"
  },
  {
    "slug": "google-analytics",
    "name": "Google Analytics",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "The free analytics standard that tracks most websites"
  },
  {
    "slug": "plausible",
    "name": "Plausible",
    "startingPrice": 9,
    "hasFreeTrial": true,
    "tagline": "Privacy-friendly Google Analytics alternative"
  },
  {
    "slug": "fathom",
    "name": "Fathom",
    "startingPrice": 14,
    "hasFreeTrial": true
  },
  {
    "slug": "umami",
    "name": "Umami",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Simple, privacy-focused web analytics"
  },
  {
    "slug": "simple-analytics",
    "name": "Simple Analytics",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Privacy-first web analytics"
  },
  {
    "slug": "matomo",
    "name": "Matomo",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source web analytics alternative to GA"
  },
  {
    "slug": "goatcounter",
    "name": "Goatcounter",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Simple web analytics without tracking users"
  },
  {
    "slug": "june",
    "name": "June",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Product analytics built for B2B SaaS"
  },
  {
    "slug": "redash",
    "name": "Redash",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Open-source data visualization tool"
  },
  {
    "slug": "mode",
    "name": "Mode",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Collaborative analytics and BI platform"
  },
  {
    "slug": "hex",
    "name": "Hex",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Collaborative analytics and data notebooks"
  },
  {
    "slug": "preset",
    "name": "Preset",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Managed Apache Superset for analytics"
  },
  {
    "slug": "lightdash",
    "name": "Lightdash",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Open-source BI tool for dbt projects"
  },
  {
    "slug": "obs-studio",
    "name": "Obs Studio",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "restream",
    "name": "Restream",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "imgix",
    "name": "Imgix",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Real-time image processing and CDN"
  },
  {
    "slug": "mux",
    "name": "Mux",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Video API for developers"
  },
  {
    "slug": "vimeo",
    "name": "Vimeo",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Professional video hosting platform"
  },
  {
    "slug": "wistia",
    "name": "Wistia",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Video hosting for business marketing"
  },
  {
    "slug": "bannerbear",
    "name": "Bannerbear",
    "startingPrice": 49,
    "hasFreeTrial": true
  },
  {
    "slug": "placid",
    "name": "Placid",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "remotion",
    "name": "Remotion",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "ffmpeg",
    "name": "Ffmpeg",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "handbrake",
    "name": "Handbrake",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "screenflow",
    "name": "Screenflow",
    "startingPrice": 169,
    "hasFreeTrial": true
  },
  {
    "slug": "camtasia",
    "name": "Camtasia",
    "startingPrice": 179.88,
    "hasFreeTrial": true
  },
  {
    "slug": "snagit",
    "name": "Snagit",
    "startingPrice": 62.99,
    "hasFreeTrial": true
  },
  {
    "slug": "cleanshot",
    "name": "Cleanshot",
    "startingPrice": 29,
    "hasFreeTrial": true
  },
  {
    "slug": "slite",
    "name": "Slite",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Knowledge base for modern teams"
  },
  {
    "slug": "outline",
    "name": "Outline",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "bookstack",
    "name": "Bookstack",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "wiki-js",
    "name": "Wiki JS",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "tettra",
    "name": "Tettra",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Internal knowledge base and wiki"
  },
  {
    "slug": "guru",
    "name": "Guru",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "slab",
    "name": "Slab",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "helpjuice",
    "name": "Helpjuice",
    "startingPrice": 120,
    "hasFreeTrial": true
  },
  {
    "slug": "document360",
    "name": "Document360",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "archbee",
    "name": "Archbee",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Documentation tool for product and API docs"
  },
  {
    "slug": "nuclino",
    "name": "Nuclino",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "clickup-docs",
    "name": "Clickup Docs",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "dropbox-paper",
    "name": "Dropbox Paper",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "fathom-analytics",
    "name": "Fathom Analytics",
    "startingPrice": 15,
    "hasFreeTrial": true
  },
  {
    "slug": "google-forms",
    "name": "Google Forms",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free form and survey builder from Google"
  },
  {
    "slug": "airtable-forms",
    "name": "Airtable Forms",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "paperform",
    "name": "Paperform",
    "startingPrice": 20,
    "hasFreeTrial": true,
    "tagline": "Beautiful forms with advanced features"
  },
  {
    "slug": "cognito-forms",
    "name": "Cognito Forms",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "wufoo",
    "name": "Wufoo",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "fillout",
    "name": "Fillout",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Form builder with advanced logic and integrations"
  },
  {
    "slug": "formspark",
    "name": "Formspark",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Simple form backend for static sites"
  },
  {
    "slug": "formspree",
    "name": "Formspree",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Form handling service for developers"
  },
  {
    "slug": "basin",
    "name": "Basin",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "getform",
    "name": "Getform",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "reform",
    "name": "Reform",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "heyflow",
    "name": "Heyflow",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "involve-me",
    "name": "Involve Me",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "tripetto",
    "name": "Tripetto",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "feathery",
    "name": "Feathery",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "tray-io",
    "name": "Tray IO",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API integration platform for enterprises"
  },
  {
    "slug": "workato",
    "name": "Workato",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Enterprise automation platform"
  },
  {
    "slug": "rapidapi",
    "name": "Rapidapi",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "API marketplace and management platform"
  },
  {
    "slug": "postman-api",
    "name": "Postman API",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "kong",
    "name": "Kong",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "gravitee",
    "name": "Gravitee",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "stoplight",
    "name": "Stoplight",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "API design and documentation platform"
  },
  {
    "slug": "swagger",
    "name": "Swagger",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "API design and documentation tools"
  },
  {
    "slug": "webhook-site",
    "name": "Webhook Site",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "ngrok",
    "name": "Ngrok",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Expose local servers to the internet"
  },
  {
    "slug": "localtunnel",
    "name": "Localtunnel",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "mockoon",
    "name": "Mockoon",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "mockapi",
    "name": "Mockapi",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "apiary",
    "name": "Apiary",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "sourcehut",
    "name": "Sourcehut",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "gitea",
    "name": "Gitea",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Lightweight self-hosted Git service"
  },
  {
    "slug": "gogs",
    "name": "Gogs",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Painless self-hosted Git service"
  },
  {
    "slug": "codeberg",
    "name": "Codeberg",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "sr-ht",
    "name": "Sr Ht",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "perforce",
    "name": "Perforce",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "plastic-scm",
    "name": "Plastic Scm",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "fossil",
    "name": "Fossil",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "aws-codecommit",
    "name": "AWS Codecommit",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "google-cloud-source",
    "name": "Google Cloud Source",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "podman",
    "name": "Podman",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Daemonless container engine"
  },
  {
    "slug": "containerd",
    "name": "Containerd",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Industry-standard container runtime"
  },
  {
    "slug": "helm",
    "name": "Helm",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Package manager for Kubernetes"
  },
  {
    "slug": "minikube",
    "name": "Minikube",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Run Kubernetes locally for development"
  },
  {
    "slug": "kind",
    "name": "Kind",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Run Kubernetes clusters in Docker containers"
  },
  {
    "slug": "docker-compose",
    "name": "Docker Compose",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "docker-swarm",
    "name": "Docker Swarm",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "nomad",
    "name": "Nomad",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "eks",
    "name": "Eks",
    "startingPrice": 0.1,
    "hasFreeTrial": false
  },
  {
    "slug": "gke",
    "name": "Gke",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "aks",
    "name": "Aks",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "openshift",
    "name": "Openshift",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "Red Hat's enterprise Kubernetes platform"
  },
  {
    "slug": "react-devtools",
    "name": "React Devtools",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "redux-devtools",
    "name": "Redux Devtools",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "vue-devtools",
    "name": "Vue Devtools",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "lighthouse",
    "name": "Lighthouse",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "web-vitals",
    "name": "Web Vitals",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "wappalyzer",
    "name": "Wappalyzer",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "builtwith",
    "name": "Builtwith",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "json-viewer",
    "name": "Json Viewer",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "octotree",
    "name": "Octotree",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "refined-github",
    "name": "Refined Github",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "github-copilot",
    "name": "Github Copilot",
    "startingPrice": 10,
    "hasFreeTrial": true,
    "tagline": "AI pair programmer that suggests code"
  },
  {
    "slug": "tabnine",
    "name": "Tabnine",
    "startingPrice": 0,
    "hasFreeTrial": true,
    "tagline": "AI code completion for any IDE"
  },
  {
    "slug": "codeium",
    "name": "Codeium",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Free AI code completion for all IDEs"
  },
  {
    "slug": "amazon-codewhisperer",
    "name": "Amazon Codewhisperer",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "AI coding companion from AWS"
  },
  {
    "slug": "continue-dev",
    "name": "Continue Dev",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "sourcegraph",
    "name": "Sourcegraph",
    "startingPrice": 0,
    "hasFreeTrial": true
  },
  {
    "slug": "liveshare",
    "name": "Liveshare",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "codepen",
    "name": "Codepen",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "codesandbox",
    "name": "Codesandbox",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Online IDE for rapid web development"
  },
  {
    "slug": "stackblitz",
    "name": "Stackblitz",
    "startingPrice": 0,
    "hasFreeTrial": false,
    "tagline": "Instant dev environments in the browser"
  },
  {
    "slug": "nextjs",
    "name": "Nextjs",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "nuxt",
    "name": "Nuxt",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "remix",
    "name": "Remix",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "sveltekit",
    "name": "Sveltekit",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "astro",
    "name": "Astro",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "express",
    "name": "Express",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "fastify",
    "name": "Fastify",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "nestjs",
    "name": "Nestjs",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "hono",
    "name": "Hono",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "elysia",
    "name": "Elysia",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "django",
    "name": "Django",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "fastapi",
    "name": "Fastapi",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "flask",
    "name": "Flask",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "rails",
    "name": "Rails",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "laravel",
    "name": "Laravel",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "spring-boot",
    "name": "Spring Boot",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "gin",
    "name": "Gin",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "fiber",
    "name": "Fiber",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "actix-web",
    "name": "Actix Web",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "axum",
    "name": "Axum",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "phoenix",
    "name": "Phoenix",
    "startingPrice": 0,
    "hasFreeTrial": false
  },
  {
    "slug": "wrike",
    "name": "Wrike",
    "tagline": "Enterprise work management with resource planning and proofing"
  },
  {
    "slug": "google-cloud",
    "name": "Google Cloud",
    "tagline": "Enterprise cloud with AI/ML strengths and BigQuery"
  },
  {
    "slug": "azure",
    "name": "Azure",
    "tagline": "Microsoft's cloud, essential for enterprises running Windows"
  },
  {
    "slug": "firebase",
    "name": "Firebase",
    "tagline": "Google's app development platform with real-time database and auth"
  },
  {
    "slug": "constant-contact",
    "name": "Constant Contact",
    "tagline": "Established email marketing for small businesses"
  },
  {
    "slug": "freshsales",
    "name": "Freshsales",
    "tagline": "AI-powered CRM from Freshworks with built-in phone and email"
  },
  {
    "slug": "things",
    "name": "Things",
    "tagline": "Elegant task manager for Apple users who value design"
  },
  {
    "slug": "onepassword-secrets",
    "name": "Onepassword Secrets",
    "tagline": "Secrets management for developers integrated with 1Password"
  },
  {
    "slug": "aws-secrets-manager",
    "name": "AWS Secrets Manager",
    "tagline": "AWS service for storing and rotating secrets securely"
  },
  {
    "slug": "aws-cdk",
    "name": "AWS Cdk",
    "tagline": "Define cloud infrastructure using familiar programming languages"
  },
  {
    "slug": "aws-cloudformation",
    "name": "AWS Cloudformation",
    "tagline": "Infrastructure as code for AWS using YAML or JSON templates"
  },
  {
    "slug": "aws-lambda",
    "name": "AWS Lambda",
    "tagline": "Run code without managing servers, pay only for compute time"
  },
  {
    "slug": "ably",
    "name": "Ably",
    "tagline": "Realtime messaging infrastructure for chat, notifications, and live updates"
  },
  {
    "slug": "acuity",
    "name": "Acuity",
    "tagline": "Online appointment scheduling that syncs with your calendar"
  },
  {
    "slug": "adjust",
    "name": "Adjust",
    "tagline": "Mobile attribution and analytics for app marketers"
  },
  {
    "slug": "adobe-color",
    "name": "Adobe Color",
    "tagline": "Create and explore color palettes for design projects"
  },
  {
    "slug": "adobe-firefly",
    "name": "Adobe Firefly",
    "tagline": "Adobe's generative AI for creating images and effects"
  },
  {
    "slug": "affinity-photo",
    "name": "Affinity Photo",
    "tagline": "Photo editing software that rivals Photoshop"
  },
  {
    "slug": "aider",
    "name": "Aider",
    "tagline": "AI pair programming in your terminal with GPT-4"
  },
  {
    "slug": "airbrake",
    "name": "Airbrake",
    "tagline": "Error monitoring that helps you fix bugs faster"
  },
  {
    "slug": "airbyte",
    "name": "Airbyte",
    "tagline": "Open-source data integration platform for ELT pipelines"
  },
  {
    "slug": "akamai",
    "name": "Akamai",
    "tagline": "CDN and cloud security for enterprise websites"
  },
  {
    "slug": "alibaba-cloud",
    "name": "Alibaba Cloud",
    "tagline": "Chinese cloud provider with global infrastructure"
  },
  {
    "slug": "amazon-dynamodb",
    "name": "Amazon Dynamodb",
    "tagline": "Serverless NoSQL database with single-digit millisecond latency"
  },
  {
    "slug": "amazon-neptune",
    "name": "Amazon Neptune",
    "tagline": "Managed graph database for connected data"
  },
  {
    "slug": "amazon-redshift",
    "name": "Amazon Redshift",
    "tagline": "Cloud data warehouse for analytics at scale"
  },
  {
    "slug": "amazon-ses",
    "name": "Amazon Ses",
    "tagline": "Transactional email service from AWS"
  },
  {
    "slug": "amazon-sagemaker",
    "name": "Amazon Sagemaker",
    "tagline": "Build, train, and deploy ML models at scale"
  },
  {
    "slug": "anchor",
    "name": "Anchor",
    "tagline": "Free podcast hosting with distribution to all platforms"
  },
  {
    "slug": "anchore",
    "name": "Anchore",
    "tagline": "Container security scanning and compliance"
  },
  {
    "slug": "angellist",
    "name": "Angellist",
    "tagline": "Startup recruiting and venture capital platform"
  },
  {
    "slug": "anyscale",
    "name": "Anyscale",
    "tagline": "Platform for scaling Ray and Python applications"
  },
  {
    "slug": "anytype",
    "name": "Anytype",
    "tagline": "Local-first note-taking with object-based organization"
  },
  {
    "slug": "apache-airflow",
    "name": "Apache Airflow",
    "tagline": "Workflow orchestration for data engineering pipelines"
  },
  {
    "slug": "apache-druid",
    "name": "Apache Druid",
    "tagline": "Real-time analytics database for high-speed queries"
  },
  {
    "slug": "apache-kafka",
    "name": "Apache Kafka",
    "tagline": "Distributed event streaming for real-time data pipelines"
  },
  {
    "slug": "apache-nifi",
    "name": "Apache Nifi",
    "tagline": "Automate data flow between systems with visual interface"
  },
  {
    "slug": "apache-superset",
    "name": "Apache Superset",
    "tagline": "Open-source business intelligence and data visualization"
  },
  {
    "slug": "apidog",
    "name": "Apidog",
    "tagline": "API design, testing, and documentation in one platform"
  },
  {
    "slug": "apollo-studio",
    "name": "Apollo Studio",
    "tagline": "GraphQL developer platform for building APIs"
  },
  {
    "slug": "apollo-io",
    "name": "Apollo IO",
    "tagline": "B2B sales intelligence and engagement platform"
  },
  {
    "slug": "appdynamics",
    "name": "Appdynamics",
    "tagline": "Application performance monitoring for enterprises"
  },
  {
    "slug": "appium",
    "name": "Appium",
    "tagline": "Automate mobile app testing across platforms"
  },
  {
    "slug": "appsflyer",
    "name": "Appsflyer",
    "tagline": "Mobile attribution and marketing analytics"
  },
  {
    "slug": "appsignal",
    "name": "Appsignal",
    "tagline": "Application monitoring for Ruby, Elixir, and Node.js"
  },
  {
    "slug": "appwrite",
    "name": "Appwrite",
    "tagline": "Open-source backend server for web and mobile apps"
  },
  {
    "slug": "aptabase",
    "name": "Aptabase",
    "tagline": "Privacy-first analytics for mobile and desktop apps"
  },
  {
    "slug": "aqua-security",
    "name": "Aqua Security",
    "tagline": "Cloud native security for containers and Kubernetes"
  },
  {
    "slug": "arangodb",
    "name": "Arangodb",
    "tagline": "Multi-model database for graphs, documents, and key-value"
  },
  {
    "slug": "architect",
    "name": "Architect",
    "tagline": "Build serverless apps with infrastructure as code"
  },
  {
    "slug": "ashby",
    "name": "Ashby",
    "tagline": "All-in-one recruiting software for growing companies"
  },
  {
    "slug": "askcodi",
    "name": "Askcodi",
    "tagline": "AI coding assistant that explains and generates code"
  },
  {
    "slug": "assemblyai",
    "name": "Assemblyai",
    "tagline": "Speech-to-text API with high accuracy transcription"
  },
  {
    "slug": "atatus",
    "name": "Atatus",
    "tagline": "Full-stack application monitoring and error tracking"
  },
  {
    "slug": "attio",
    "name": "Attio",
    "tagline": "CRM built for data-driven relationship management"
  },
  {
    "slug": "authelia",
    "name": "Authelia",
    "tagline": "Open-source authentication and authorization server"
  },
  {
    "slug": "automatisch",
    "name": "Automatisch",
    "tagline": "Open-source Zapier alternative for workflow automation"
  },
  {
    "slug": "avocode",
    "name": "Avocode",
    "tagline": "Design handoff tool for developers and designers"
  },
  {
    "slug": "axiom",
    "name": "Axiom",
    "tagline": "Serverless log management and observability platform"
  },
  {
    "slug": "azure-cosmos-db",
    "name": "Azure Cosmos DB",
    "tagline": "Globally distributed multi-model database"
  },
  {
    "slug": "azure-functions",
    "name": "Azure Functions",
    "tagline": "Serverless compute for event-driven applications"
  },
  {
    "slug": "azure-ml",
    "name": "Azure ML",
    "tagline": "Cloud platform for building and deploying ML models"
  },
  {
    "slug": "azure-synapse",
    "name": "Azure Synapse",
    "tagline": "Analytics service combining data warehousing and big data"
  },
  {
    "slug": "backendless",
    "name": "Backendless",
    "tagline": "Backend as a service with visual app development"
  },
  {
    "slug": "bear",
    "name": "Bear",
    "tagline": "Beautiful markdown notes app for Apple devices"
  },
  {
    "slug": "begin",
    "name": "Begin",
    "tagline": "Deploy serverless apps instantly with minimal config"
  },
  {
    "slug": "bench",
    "name": "Bench",
    "tagline": "Bookkeeping service with dedicated accountants"
  },
  {
    "slug": "bettermode",
    "name": "Bettermode",
    "tagline": "Community platform with forums and knowledge base"
  },
  {
    "slug": "betty-blocks",
    "name": "Betty Blocks",
    "tagline": "No-code platform for enterprise applications"
  },
  {
    "slug": "bigquery",
    "name": "Bigquery",
    "tagline": "Google's serverless data warehouse for analytics"
  },
  {
    "slug": "bildr",
    "name": "Bildr",
    "tagline": "Build web apps visually with full code flexibility"
  },
  {
    "slug": "bing-image-creator",
    "name": "Bing Image Creator",
    "tagline": "Microsoft's AI image generator powered by DALL-E"
  },
  {
    "slug": "biome",
    "name": "Biome",
    "tagline": "Fast formatter and linter for JavaScript and TypeScript"
  },
  {
    "slug": "bitdefender",
    "name": "Bitdefender",
    "tagline": "Antivirus and cybersecurity for consumers and business"
  },
  {
    "slug": "bito",
    "name": "Bito",
    "tagline": "AI assistant for code review and documentation"
  },
  {
    "slug": "black",
    "name": "Black",
    "tagline": "Uncompromising Python code formatter"
  },
  {
    "slug": "blackbox-ai",
    "name": "Blackbox AI",
    "tagline": "AI code assistant with real-time suggestions"
  },
  {
    "slug": "blameless",
    "name": "Blameless",
    "tagline": "Incident management and SRE platform"
  },
  {
    "slug": "bolt",
    "name": "Bolt",
    "tagline": "AI-powered full-stack web development in browser"
  },
  {
    "slug": "branch",
    "name": "Branch",
    "tagline": "Mobile measurement and deep linking platform"
  },
  {
    "slug": "bruno",
    "name": "Bruno",
    "tagline": "Open-source API client alternative to Postman"
  },
  {
    "slug": "buddy",
    "name": "Buddy",
    "tagline": "CI/CD for web developers with visual pipelines"
  },
  {
    "slug": "bun",
    "name": "Bun",
    "tagline": "Fast JavaScript runtime and package manager"
  },
  {
    "slug": "bunny-stream",
    "name": "Bunny Stream",
    "tagline": "Video hosting and streaming platform"
  },
  {
    "slug": "bunnycdn",
    "name": "Bunnycdn",
    "tagline": "Fast and affordable content delivery network"
  },
  {
    "slug": "cdktf",
    "name": "Cdktf",
    "tagline": "Define Terraform infrastructure using programming languages"
  },
  {
    "slug": "cabin",
    "name": "Cabin",
    "tagline": "Privacy-first web analytics without cookies"
  },
  {
    "slug": "cachet",
    "name": "Cachet",
    "tagline": "Open-source status page system"
  },
  {
    "slug": "caddy",
    "name": "Caddy",
    "tagline": "Web server with automatic HTTPS"
  },
  {
    "slug": "calibre",
    "name": "Calibre",
    "tagline": "Web performance monitoring with detailed metrics"
  },
  {
    "slug": "canva-ai",
    "name": "Canva AI",
    "tagline": "AI-powered design features within Canva"
  },
  {
    "slug": "capacities",
    "name": "Capacities",
    "tagline": "Note-taking app with object-based structure"
  },
  {
    "slug": "carbon-black",
    "name": "Carbon Black",
    "tagline": "Endpoint security and threat hunting platform"
  },
  {
    "slug": "cargo",
    "name": "Cargo",
    "tagline": "Rust's package manager and build system"
  },
  {
    "slug": "carta",
    "name": "Carta",
    "tagline": "Equity management and cap table software"
  },
  {
    "slug": "cassandra",
    "name": "Cassandra",
    "tagline": "Distributed NoSQL database for massive scale"
  },
  {
    "slug": "certbot",
    "name": "Certbot",
    "tagline": "Free tool to obtain Let's Encrypt SSL certificates"
  },
  {
    "slug": "chanty",
    "name": "Chanty",
    "tagline": "Team chat with built-in task management"
  },
  {
    "slug": "charthop",
    "name": "Charthop",
    "tagline": "People analytics and org chart software"
  },
  {
    "slug": "checkmarx",
    "name": "Checkmarx",
    "tagline": "Application security testing for enterprises"
  },
  {
    "slug": "chef",
    "name": "Chef",
    "tagline": "Infrastructure automation with Ruby-based recipes"
  },
  {
    "slug": "chili-piper",
    "name": "Chili Piper",
    "tagline": "Scheduling and routing for revenue teams"
  },
  {
    "slug": "chorus",
    "name": "Chorus",
    "tagline": "Conversation intelligence for sales teams"
  },
  {
    "slug": "chroma",
    "name": "Chroma",
    "tagline": "Open-source vector database for AI applications"
  },
  {
    "slug": "chromatic",
    "name": "Chromatic",
    "tagline": "Visual testing platform for Storybook"
  },
  {
    "slug": "cinema-4d",
    "name": "Cinema 4d",
    "tagline": "Professional 3D modeling and animation software"
  },
  {
    "slug": "clair",
    "name": "Clair",
    "tagline": "Open-source container vulnerability scanner"
  },
  {
    "slug": "clari",
    "name": "Clari",
    "tagline": "Revenue intelligence and forecasting platform"
  },
  {
    "slug": "clearml",
    "name": "Clearml",
    "tagline": "ML experiment tracking and pipeline automation"
  },
  {
    "slug": "clearbit",
    "name": "Clearbit",
    "tagline": "B2B data enrichment and lead intelligence"
  },
  {
    "slug": "clerk",
    "name": "Clerk",
    "tagline": "Authentication and user management for developers"
  },
  {
    "slug": "clickhouse",
    "name": "Clickhouse",
    "tagline": "Fast open-source analytics database"
  },
  {
    "slug": "clicky",
    "name": "Clicky",
    "tagline": "Real-time web analytics with heatmaps"
  },
  {
    "slug": "clip-studio-paint",
    "name": "Clip Studio Paint",
    "tagline": "Digital illustration and comic creation software"
  },
  {
    "slug": "clipdrop",
    "name": "Clipdrop",
    "tagline": "AI-powered image editing and generation tools"
  },
  {
    "slug": "clockwise",
    "name": "Clockwise",
    "tagline": "AI calendar assistant for better meeting scheduling"
  },
  {
    "slug": "codacy",
    "name": "Codacy",
    "tagline": "Automated code quality and security analysis"
  },
  {
    "slug": "codeclimate",
    "name": "Codeclimate",
    "tagline": "Code quality metrics and test coverage"
  },
  {
    "slug": "codefresh",
    "name": "Codefresh",
    "tagline": "GitOps CI/CD platform for Kubernetes"
  },
  {
    "slug": "codium-ai",
    "name": "Codium AI",
    "tagline": "AI-powered test generation for developers"
  },
  {
    "slug": "cohere",
    "name": "Cohere",
    "tagline": "Enterprise AI for search and language understanding"
  },
  {
    "slug": "colossyan",
    "name": "Colossyan",
    "tagline": "AI video creation with synthetic presenters"
  },
  {
    "slug": "comet-ml",
    "name": "Comet ML",
    "tagline": "ML experiment tracking and model management"
  },
  {
    "slug": "commerce-layer",
    "name": "Commerce Layer",
    "tagline": "Headless commerce API for global brands"
  },
  {
    "slug": "commerce-js",
    "name": "Commerce JS",
    "tagline": "Headless e-commerce backend for developers"
  },
  {
    "slug": "composer",
    "name": "Composer",
    "tagline": "Dependency manager for PHP projects"
  },
  {
    "slug": "concourse",
    "name": "Concourse",
    "tagline": "Open-source continuous integration platform"
  },
  {
    "slug": "configcat",
    "name": "Configcat",
    "tagline": "Feature flag service for any application"
  },
  {
    "slug": "confluent",
    "name": "Confluent",
    "tagline": "Enterprise Kafka platform for streaming data"
  },
  {
    "slug": "continue",
    "name": "Continue",
    "tagline": "Open-source AI code assistant for VS Code"
  },
  {
    "slug": "contractpodai",
    "name": "Contractpodai",
    "tagline": "AI-powered contract management for enterprises"
  },
  {
    "slug": "contractbook",
    "name": "Contractbook",
    "tagline": "Contract lifecycle automation platform"
  },
  {
    "slug": "convert",
    "name": "Convert",
    "tagline": "A/B testing and personalization platform"
  },
  {
    "slug": "convex",
    "name": "Convex",
    "tagline": "Backend platform with real-time sync"
  },
  {
    "slug": "coolors",
    "name": "Coolors",
    "tagline": "Fast color palette generator for designers"
  },
  {
    "slug": "couchdb",
    "name": "Couchdb",
    "tagline": "NoSQL database that syncs across devices"
  },
  {
    "slug": "couchbase",
    "name": "Couchbase",
    "tagline": "Distributed NoSQL database for enterprises"
  },
  {
    "slug": "count",
    "name": "Count",
    "tagline": "Collaborative data analysis and notebooks"
  },
  {
    "slug": "countly",
    "name": "Countly",
    "tagline": "Product analytics and push notifications"
  },
  {
    "slug": "cronitor",
    "name": "Cronitor",
    "tagline": "Monitoring for cron jobs and scheduled tasks"
  },
  {
    "slug": "crossplane",
    "name": "Crossplane",
    "tagline": "Build cloud infrastructure using Kubernetes"
  },
  {
    "slug": "crystallize",
    "name": "Crystallize",
    "tagline": "Headless PIM and commerce platform"
  },
  {
    "slug": "culture-amp",
    "name": "Culture Amp",
    "tagline": "Employee engagement and performance platform"
  },
  {
    "slug": "customerio",
    "name": "Customerio",
    "tagline": "Marketing automation for customer engagement"
  },
  {
    "slug": "d-id",
    "name": "D Id",
    "tagline": "Create AI-generated videos with talking avatars"
  },
  {
    "slug": "dnsimple",
    "name": "Dnsimple",
    "tagline": "DNS hosting and domain management made simple"
  },
  {
    "slug": "dagster",
    "name": "Dagster",
    "tagline": "Data orchestration platform for ML pipelines"
  },
  {
    "slug": "databricks",
    "name": "Databricks",
    "tagline": "Unified analytics platform for data engineering and AI"
  },
  {
    "slug": "debugbear",
    "name": "Debugbear",
    "tagline": "Website performance monitoring for Core Web Vitals"
  },
  {
    "slug": "deel",
    "name": "Deel",
    "tagline": "Global payroll and compliance for remote teams"
  },
  {
    "slug": "deepsource",
    "name": "Deepsource",
    "tagline": "Static analysis for code quality and security"
  },
  {
    "slug": "deno-deploy",
    "name": "Deno Deploy",
    "tagline": "Deploy JavaScript at the edge globally"
  },
  {
    "slug": "detox",
    "name": "Detox",
    "tagline": "End-to-end testing for React Native apps"
  },
  {
    "slug": "devcycle",
    "name": "Devcycle",
    "tagline": "Feature flags built for developers"
  },
  {
    "slug": "devin",
    "name": "Devin",
    "tagline": "AI software engineer that writes and debugs code"
  },
  {
    "slug": "discourse",
    "name": "Discourse",
    "tagline": "Open-source forum and community platform"
  },
  {
    "slug": "divvy",
    "name": "Divvy",
    "tagline": "Expense management with free software"
  },
  {
    "slug": "dixa",
    "name": "Dixa",
    "tagline": "Customer service platform for conversational support"
  },
  {
    "slug": "docsify",
    "name": "Docsify",
    "tagline": "Generate documentation sites from markdown"
  },
  {
    "slug": "dorik",
    "name": "Dorik",
    "tagline": "No-code website builder with custom designs"
  },
  {
    "slug": "dreamstudio",
    "name": "Dreamstudio",
    "tagline": "Stability AI's interface for image generation"
  },
  {
    "slug": "duo-security",
    "name": "Duo Security",
    "tagline": "Multi-factor authentication for enterprises"
  },
  {
    "slug": "durable",
    "name": "Durable",
    "tagline": "AI website builder that creates sites in seconds"
  },
  {
    "slug": "eset",
    "name": "Eset",
    "tagline": "Antivirus and endpoint security software"
  },
  {
    "slug": "eslint",
    "name": "Eslint",
    "tagline": "Pluggable JavaScript and TypeScript linter"
  },
  {
    "slug": "easypost",
    "name": "Easypost",
    "tagline": "Shipping API for e-commerce businesses"
  },
  {
    "slug": "elai",
    "name": "Elai",
    "tagline": "AI video generation with virtual presenters"
  },
  {
    "slug": "elasticsearch",
    "name": "Elasticsearch",
    "tagline": "Distributed search and analytics engine"
  },
  {
    "slug": "element",
    "name": "Element",
    "tagline": "Secure messaging app built on Matrix protocol"
  },
  {
    "slug": "eppo",
    "name": "Eppo",
    "tagline": "Experimentation platform for product teams"
  },
  {
    "slug": "estuary-flow",
    "name": "Estuary Flow",
    "tagline": "Real-time data integration and ETL"
  },
  {
    "slug": "exceptionless",
    "name": "Exceptionless",
    "tagline": "Open-source error and log collection"
  },
  {
    "slug": "fastly",
    "name": "Fastly",
    "tagline": "Edge cloud platform for fast content delivery"
  },
  {
    "slug": "fastly-compute",
    "name": "Fastly Compute",
    "tagline": "Serverless compute at the edge"
  },
  {
    "slug": "fathom-meetings",
    "name": "Fathom Meetings",
    "tagline": "AI meeting assistant for notes and summaries"
  },
  {
    "slug": "feather-icons",
    "name": "Feather Icons",
    "tagline": "Beautiful open-source icon set"
  },
  {
    "slug": "fermyon-spin",
    "name": "Fermyon Spin",
    "tagline": "Framework for building WebAssembly microservices"
  },
  {
    "slug": "filestack",
    "name": "Filestack",
    "tagline": "File upload and processing API"
  },
  {
    "slug": "firehydrant",
    "name": "Firehydrant",
    "tagline": "Incident management for reliability engineering"
  },
  {
    "slug": "firebase-firestore",
    "name": "Firebase Firestore",
    "tagline": "NoSQL cloud database with real-time sync"
  },
  {
    "slug": "firebolt",
    "name": "Firebolt",
    "tagline": "Cloud data warehouse for analytics"
  },
  {
    "slug": "fireflies-ai",
    "name": "Fireflies AI",
    "tagline": "AI meeting notes and conversation intelligence"
  },
  {
    "slug": "fireworks-ai",
    "name": "Fireworks AI",
    "tagline": "Fast inference for open-source AI models"
  },
  {
    "slug": "fivetran",
    "name": "Fivetran",
    "tagline": "Automated data integration and ELT"
  },
  {
    "slug": "flagsmith",
    "name": "Flagsmith",
    "tagline": "Open-source feature flag and remote config"
  },
  {
    "slug": "fleet",
    "name": "Fleet",
    "tagline": "Open-source device management for IT"
  },
  {
    "slug": "fliki",
    "name": "Fliki",
    "tagline": "AI video creation with text-to-video"
  },
  {
    "slug": "flipt",
    "name": "Flipt",
    "tagline": "Open-source feature flag infrastructure"
  },
  {
    "slug": "flock",
    "name": "Flock",
    "tagline": "Team messaging and collaboration platform"
  },
  {
    "slug": "fontbase",
    "name": "Fontbase",
    "tagline": "Font manager for designers and developers"
  },
  {
    "slug": "freshping",
    "name": "Freshping",
    "tagline": "Free website uptime monitoring"
  },
  {
    "slug": "fusionauth",
    "name": "Fusionauth",
    "tagline": "Customer identity and access management"
  },
  {
    "slug": "gpt4all",
    "name": "Gpt4all",
    "tagline": "Run large language models locally"
  },
  {
    "slug": "gandi",
    "name": "Gandi",
    "tagline": "Domain registration and web hosting"
  },
  {
    "slug": "gladly",
    "name": "Gladly",
    "tagline": "Customer service platform focused on people"
  },
  {
    "slug": "gocd",
    "name": "Gocd",
    "tagline": "Open-source continuous delivery server"
  },
  {
    "slug": "goto-meeting",
    "name": "Goto Meeting",
    "tagline": "Video conferencing for business meetings"
  },
  {
    "slug": "google-cloud-dns",
    "name": "Google Cloud DNS",
    "tagline": "Managed DNS hosting on Google Cloud"
  },
  {
    "slug": "google-cloud-functions",
    "name": "Google Cloud Functions",
    "tagline": "Serverless functions on Google Cloud"
  },
  {
    "slug": "google-vertex-ai",
    "name": "Google Vertex AI",
    "tagline": "Unified AI platform for ML development"
  },
  {
    "slug": "gorgias",
    "name": "Gorgias",
    "tagline": "Customer support helpdesk for e-commerce"
  },
  {
    "slug": "grafana-oncall",
    "name": "Grafana Oncall",
    "tagline": "On-call management integrated with Grafana"
  },
  {
    "slug": "gravit-designer",
    "name": "Gravit Designer",
    "tagline": "Free vector design app in the browser"
  },
  {
    "slug": "grit",
    "name": "Grit",
    "tagline": "AI-powered code migration and upgrades"
  },
  {
    "slug": "groove",
    "name": "Groove",
    "tagline": "Help desk software for small businesses"
  },
  {
    "slug": "growthbook",
    "name": "Growthbook",
    "tagline": "Open-source feature flags and A/B testing"
  },
  {
    "slug": "grype",
    "name": "Grype",
    "tagline": "Container vulnerability scanner from Anchore"
  },
  {
    "slug": "httpie",
    "name": "Httpie",
    "tagline": "User-friendly command-line HTTP client"
  },
  {
    "slug": "habitica",
    "name": "Habitica",
    "tagline": "Gamified habit tracking and productivity"
  },
  {
    "slug": "hanko",
    "name": "Hanko",
    "tagline": "Passwordless authentication for developers"
  },
  {
    "slug": "harness",
    "name": "Harness",
    "tagline": "Software delivery platform with CI/CD"
  },
  {
    "slug": "harvest",
    "name": "Harvest",
    "tagline": "Time tracking and invoicing for teams"
  },
  {
    "slug": "headscale",
    "name": "Headscale",
    "tagline": "Self-hosted Tailscale control server"
  },
  {
    "slug": "healthchecks-io",
    "name": "Healthchecks IO",
    "tagline": "Cron job monitoring with simple pings"
  },
  {
    "slug": "helix",
    "name": "Helix",
    "tagline": "Post-modern terminal text editor in Rust"
  },
  {
    "slug": "hellosign",
    "name": "Hellosign",
    "tagline": "E-signature solution now Dropbox Sign"
  },
  {
    "slug": "hemingway",
    "name": "Hemingway",
    "tagline": "Editor that makes your writing bold and clear"
  },
  {
    "slug": "heroicons",
    "name": "Heroicons",
    "tagline": "Beautiful hand-crafted SVG icons"
  },
  {
    "slug": "hevo",
    "name": "Hevo",
    "tagline": "No-code data pipeline platform"
  },
  {
    "slug": "heygen",
    "name": "Heygen",
    "tagline": "AI video generation with realistic avatars"
  },
  {
    "slug": "hostinger-builder",
    "name": "Hostinger Builder",
    "tagline": "AI website builder from Hostinger"
  },
  {
    "slug": "houdini",
    "name": "Houdini",
    "tagline": "3D animation and VFX software"
  },
  {
    "slug": "huginn",
    "name": "Huginn",
    "tagline": "Self-hosted IFTTT alternative for automation"
  },
  {
    "slug": "huntress",
    "name": "Huntress",
    "tagline": "Managed threat detection for MSPs"
  },
  {
    "slug": "hyperping",
    "name": "Hyperping",
    "tagline": "Uptime monitoring with beautiful status pages"
  },
  {
    "slug": "ibm-cloud",
    "name": "Ibm Cloud",
    "tagline": "Enterprise cloud platform from IBM"
  },
  {
    "slug": "iconify",
    "name": "Iconify",
    "tagline": "Unified icons framework with 100+ sets"
  },
  {
    "slug": "ideogram",
    "name": "Ideogram",
    "tagline": "AI image generation with text rendering"
  },
  {
    "slug": "imagekit",
    "name": "Imagekit",
    "tagline": "Image optimization and delivery CDN"
  },
  {
    "slug": "imperva",
    "name": "Imperva",
    "tagline": "Application and data security platform"
  },
  {
    "slug": "invideo-ai",
    "name": "Invideo AI",
    "tagline": "AI video creator for social media content"
  },
  {
    "slug": "incident-io",
    "name": "Incident IO",
    "tagline": "Incident management with Slack integration"
  },
  {
    "slug": "informatica",
    "name": "Informatica",
    "tagline": "Enterprise data integration and management"
  },
  {
    "slug": "inngest",
    "name": "Inngest",
    "tagline": "Event-driven background jobs and workflows"
  },
  {
    "slug": "instatus",
    "name": "Instatus",
    "tagline": "Status page hosting for any product"
  },
  {
    "slug": "integromat",
    "name": "Integromat",
    "tagline": "Automation platform now called Make"
  },
  {
    "slug": "junit",
    "name": "Junit",
    "tagline": "Testing framework for Java applications"
  },
  {
    "slug": "jan",
    "name": "Jan",
    "tagline": "Run LLMs locally with beautiful interface"
  },
  {
    "slug": "janusgraph",
    "name": "Janusgraph",
    "tagline": "Distributed graph database for massive scale"
  },
  {
    "slug": "jasmine",
    "name": "Jasmine",
    "tagline": "BDD testing framework for JavaScript"
  },
  {
    "slug": "kameleoon",
    "name": "Kameleoon",
    "tagline": "A/B testing and personalization platform"
  },
  {
    "slug": "keeper",
    "name": "Keeper",
    "tagline": "Password manager with enterprise security"
  },
  {
    "slug": "keycdn",
    "name": "Keycdn",
    "tagline": "Fast and reliable content delivery network"
  },
  {
    "slug": "keycloak",
    "name": "Keycloak",
    "tagline": "Open-source identity and access management"
  },
  {
    "slug": "keywords-everywhere",
    "name": "Keywords Everywhere",
    "tagline": "SEO keyword research browser extension"
  },
  {
    "slug": "khroma",
    "name": "Khroma",
    "tagline": "AI color palette generator that learns your style"
  },
  {
    "slug": "kissflow",
    "name": "Kissflow",
    "tagline": "Low-code platform for business workflows"
  },
  {
    "slug": "kling-ai",
    "name": "Kling AI",
    "tagline": "Chinese AI video generation platform"
  },
  {
    "slug": "knative",
    "name": "Knative",
    "tagline": "Kubernetes-native serverless framework"
  },
  {
    "slug": "kochava",
    "name": "Kochava",
    "tagline": "Mobile attribution and analytics platform"
  },
  {
    "slug": "krea-ai",
    "name": "Krea AI",
    "tagline": "AI image generation with real-time canvas"
  },
  {
    "slug": "kustomer",
    "name": "Kustomer",
    "tagline": "Customer service CRM platform"
  },
  {
    "slug": "kustomize",
    "name": "Kustomize",
    "tagline": "Kubernetes native configuration management"
  },
  {
    "slug": "lovo",
    "name": "Lovo",
    "tagline": "AI voice generator for video production"
  },
  {
    "slug": "lancedb",
    "name": "Lancedb",
    "tagline": "Vector database built on Lance format"
  },
  {
    "slug": "landen",
    "name": "Landen",
    "tagline": "Simple landing page builder"
  },
  {
    "slug": "leapsome",
    "name": "Leapsome",
    "tagline": "People enablement and performance platform"
  },
  {
    "slug": "learnworlds",
    "name": "Learnworlds",
    "tagline": "Online course platform with community features"
  },
  {
    "slug": "lets-encrypt",
    "name": "Lets Encrypt",
    "tagline": "Free SSL/TLS certificates for everyone"
  },
  {
    "slug": "lexica",
    "name": "Lexica",
    "tagline": "Search engine for AI-generated images"
  },
  {
    "slug": "lexion",
    "name": "Lexion",
    "tagline": "AI contract management for legal teams"
  },
  {
    "slug": "lightstep",
    "name": "Lightstep",
    "tagline": "Distributed tracing and observability"
  },
  {
    "slug": "listnr",
    "name": "Listnr",
    "tagline": "AI podcast and voiceover generator"
  },
  {
    "slug": "liveblocks",
    "name": "Liveblocks",
    "tagline": "Real-time collaboration infrastructure"
  },
  {
    "slug": "llama-cpp",
    "name": "Llama Cpp",
    "tagline": "Run Llama models efficiently on CPU"
  },
  {
    "slug": "localai",
    "name": "Localai",
    "tagline": "Self-hosted OpenAI-compatible API"
  },
  {
    "slug": "logrhythm",
    "name": "Logrhythm",
    "tagline": "SIEM and security analytics platform"
  },
  {
    "slug": "loggly",
    "name": "Loggly",
    "tagline": "Cloud-based log management service"
  },
  {
    "slug": "logstash",
    "name": "Logstash",
    "tagline": "Data collection and processing pipeline"
  },
  {
    "slug": "logto",
    "name": "Logto",
    "tagline": "Open-source Auth0 alternative"
  },
  {
    "slug": "loomly",
    "name": "Loomly",
    "tagline": "Social media calendar and content management"
  },
  {
    "slug": "lovable",
    "name": "Lovable",
    "tagline": "AI app builder that creates production code"
  },
  {
    "slug": "lucide",
    "name": "Lucide",
    "tagline": "Beautiful and consistent open-source icons"
  },
  {
    "slug": "lucky-orange",
    "name": "Lucky Orange",
    "tagline": "Website analytics with heatmaps and recordings"
  },
  {
    "slug": "luma-ai",
    "name": "Luma AI",
    "tagline": "AI video and 3D generation platform"
  },
  {
    "slug": "lumen5",
    "name": "Lumen5",
    "tagline": "AI video creator for marketing content"
  },
  {
    "slug": "lusha",
    "name": "Lusha",
    "tagline": "B2B contact data for sales prospecting"
  },
  {
    "slug": "mlflow",
    "name": "Mlflow",
    "tagline": "Open-source ML lifecycle management"
  },
  {
    "slug": "magic",
    "name": "Magic",
    "tagline": "Passwordless authentication SDK"
  },
  {
    "slug": "magnific",
    "name": "Magnific",
    "tagline": "AI image upscaling and enhancement"
  },
  {
    "slug": "malwarebytes",
    "name": "Malwarebytes",
    "tagline": "Anti-malware and endpoint protection"
  },
  {
    "slug": "marketmuse",
    "name": "Marketmuse",
    "tagline": "AI content planning and optimization"
  },
  {
    "slug": "matillion",
    "name": "Matillion",
    "tagline": "Cloud data integration platform"
  },
  {
    "slug": "mattermost",
    "name": "Mattermost",
    "tagline": "Open-source Slack alternative"
  },
  {
    "slug": "maven",
    "name": "Maven",
    "tagline": "Build automation for Java projects"
  },
  {
    "slug": "maya",
    "name": "Maya",
    "tagline": "3D animation and modeling software"
  },
  {
    "slug": "meltano",
    "name": "Meltano",
    "tagline": "Open-source data integration framework"
  },
  {
    "slug": "mem",
    "name": "Mem",
    "tagline": "AI-powered personal knowledge assistant"
  },
  {
    "slug": "memberstack",
    "name": "Memberstack",
    "tagline": "Membership and authentication for websites"
  },
  {
    "slug": "mendix",
    "name": "Mendix",
    "tagline": "Low-code platform for enterprise apps"
  },
  {
    "slug": "mentat",
    "name": "Mentat",
    "tagline": "AI coding assistant for terminal"
  },
  {
    "slug": "mercury",
    "name": "Mercury",
    "tagline": "Banking for startups and tech companies"
  },
  {
    "slug": "microk8s",
    "name": "Microk8s",
    "tagline": "Lightweight Kubernetes from Canonical"
  },
  {
    "slug": "microsoft-clarity",
    "name": "Microsoft Clarity",
    "tagline": "Free heatmaps and session recordings"
  },
  {
    "slug": "microsoft-sentinel",
    "name": "Microsoft Sentinel",
    "tagline": "Cloud-native SIEM and SOAR"
  },
  {
    "slug": "mighty-networks",
    "name": "Mighty Networks",
    "tagline": "Community platform for creators"
  },
  {
    "slug": "milvus",
    "name": "Milvus",
    "tagline": "Open-source vector database for AI"
  },
  {
    "slug": "mkdocs",
    "name": "Mkdocs",
    "tagline": "Static site generator for documentation"
  },
  {
    "slug": "modal",
    "name": "Modal",
    "tagline": "Serverless cloud for AI and data applications"
  },
  {
    "slug": "mouseflow",
    "name": "Mouseflow",
    "tagline": "Session replay and heatmap analytics"
  },
  {
    "slug": "mutable-ai",
    "name": "Mutable AI",
    "tagline": "AI code assistant with context awareness"
  },
  {
    "slug": "ns1",
    "name": "Ns1",
    "tagline": "Intelligent DNS and traffic management"
  },
  {
    "slug": "nebula",
    "name": "Nebula",
    "tagline": "Open-source VPN mesh network"
  },
  {
    "slug": "neptune-ai",
    "name": "Neptune AI",
    "tagline": "Experiment tracking for ML teams"
  },
  {
    "slug": "nessus",
    "name": "Nessus",
    "tagline": "Vulnerability assessment scanner"
  },
  {
    "slug": "netlify-functions",
    "name": "Netlify Functions",
    "tagline": "Serverless functions on Netlify"
  },
  {
    "slug": "netmaker",
    "name": "Netmaker",
    "tagline": "WireGuard-based virtual network platform"
  },
  {
    "slug": "nhost",
    "name": "Nhost",
    "tagline": "Open-source Firebase alternative with GraphQL"
  },
  {
    "slug": "nightcafe",
    "name": "Nightcafe",
    "tagline": "AI art generator with multiple models"
  },
  {
    "slug": "nightwatch",
    "name": "Nightwatch",
    "tagline": "End-to-end testing framework for browsers"
  },
  {
    "slug": "node-red",
    "name": "Node Red",
    "tagline": "Flow-based programming for IoT"
  },
  {
    "slug": "noodl",
    "name": "Noodl",
    "tagline": "Visual full-stack development platform"
  },
  {
    "slug": "nordvpn",
    "name": "Nordvpn",
    "tagline": "Popular VPN service for privacy"
  },
  {
    "slug": "northbeam",
    "name": "Northbeam",
    "tagline": "Marketing attribution for e-commerce"
  },
  {
    "slug": "nuget",
    "name": "Nuget",
    "tagline": ".NET package manager"
  },
  {
    "slug": "ossec",
    "name": "Ossec",
    "tagline": "Open-source host-based intrusion detection"
  },
  {
    "slug": "oberlo",
    "name": "Oberlo",
    "tagline": "Dropshipping app for Shopify stores"
  },
  {
    "slug": "observable",
    "name": "Observable",
    "tagline": "Collaborative data visualization notebooks"
  },
  {
    "slug": "oh-dear",
    "name": "Oh Dear",
    "tagline": "Website monitoring with uptime and SSL checks"
  },
  {
    "slug": "olark",
    "name": "Olark",
    "tagline": "Live chat software for customer support"
  },
  {
    "slug": "openfaas",
    "name": "Openfaas",
    "tagline": "Serverless functions on Kubernetes"
  },
  {
    "slug": "opentofu",
    "name": "Opentofu",
    "tagline": "Open-source Terraform fork"
  },
  {
    "slug": "openvpn",
    "name": "Openvpn",
    "tagline": "Open-source VPN protocol and software"
  },
  {
    "slug": "opsgenie",
    "name": "Opsgenie",
    "tagline": "Alert and on-call management"
  },
  {
    "slug": "origami-studio",
    "name": "Origami Studio",
    "tagline": "Prototyping tool from Meta"
  },
  {
    "slug": "ory",
    "name": "Ory",
    "tagline": "Open-source identity infrastructure"
  },
  {
    "slug": "outsystems",
    "name": "Outsystems",
    "tagline": "Low-code platform for enterprise apps"
  },
  {
    "slug": "outseta",
    "name": "Outseta",
    "tagline": "All-in-one membership and billing platform"
  },
  {
    "slug": "oxlint",
    "name": "Oxlint",
    "tagline": "Fast JavaScript/TypeScript linter in Rust"
  },
  {
    "slug": "oyster",
    "name": "Oyster",
    "tagline": "Global employment platform for remote teams"
  },
  {
    "slug": "phpunit",
    "name": "Phpunit",
    "tagline": "Testing framework for PHP"
  },
  {
    "slug": "parabola",
    "name": "Parabola",
    "tagline": "No-code data workflows and automation"
  },
  {
    "slug": "parcel",
    "name": "Parcel",
    "tagline": "Zero-config web application bundler"
  },
  {
    "slug": "partykit",
    "name": "Partykit",
    "tagline": "Real-time multiplayer infrastructure"
  },
  {
    "slug": "paw",
    "name": "Paw",
    "tagline": "Advanced API client for Mac"
  },
  {
    "slug": "phosphor-icons",
    "name": "Phosphor Icons",
    "tagline": "Flexible icon family for interfaces"
  },
  {
    "slug": "photoroom",
    "name": "Photoroom",
    "tagline": "AI photo editing for product images"
  },
  {
    "slug": "pictory",
    "name": "Pictory",
    "tagline": "AI video creation from text content"
  },
  {
    "slug": "pieces",
    "name": "Pieces",
    "tagline": "AI-powered developer productivity tool"
  },
  {
    "slug": "pilot",
    "name": "Pilot",
    "tagline": "Bookkeeping service for startups"
  },
  {
    "slug": "pinecone",
    "name": "Pinecone",
    "tagline": "Vector database for AI applications"
  },
  {
    "slug": "plane",
    "name": "Plane",
    "tagline": "Open-source project management like Linear"
  },
  {
    "slug": "plasmic",
    "name": "Plasmic",
    "tagline": "Visual builder for React applications"
  },
  {
    "slug": "play-ht",
    "name": "Play Ht",
    "tagline": "AI voice generation and text-to-speech"
  },
  {
    "slug": "playground-ai",
    "name": "Playground AI",
    "tagline": "AI image creation and editing platform"
  },
  {
    "slug": "porkbun",
    "name": "Porkbun",
    "tagline": "Domain registrar with competitive prices"
  },
  {
    "slug": "prefect",
    "name": "Prefect",
    "tagline": "Modern workflow orchestration for data"
  },
  {
    "slug": "prettier",
    "name": "Prettier",
    "tagline": "Opinionated code formatter"
  },
  {
    "slug": "prisma-cloud",
    "name": "Prisma Cloud",
    "tagline": "Cloud security and compliance platform"
  },
  {
    "slug": "pritunl",
    "name": "Pritunl",
    "tagline": "Open-source enterprise VPN server"
  },
  {
    "slug": "proton-pass",
    "name": "Proton Pass",
    "tagline": "Encrypted password manager from Proton"
  },
  {
    "slug": "publer",
    "name": "Publer",
    "tagline": "Social media scheduling and analytics"
  },
  {
    "slug": "pulley",
    "name": "Pulley",
    "tagline": "Cap table and equity management"
  },
  {
    "slug": "pumble",
    "name": "Pumble",
    "tagline": "Free team messaging app"
  },
  {
    "slug": "puppet",
    "name": "Puppet",
    "tagline": "Infrastructure automation at scale"
  },
  {
    "slug": "pusher",
    "name": "Pusher",
    "tagline": "Realtime APIs for web and mobile apps"
  },
  {
    "slug": "pypi",
    "name": "Pypi",
    "tagline": "Python Package Index for libraries"
  },
  {
    "slug": "qdrant",
    "name": "Qdrant",
    "tagline": "Vector database for AI applications"
  },
  {
    "slug": "qualified",
    "name": "Qualified",
    "tagline": "Conversational marketing for B2B"
  },
  {
    "slug": "qualys",
    "name": "Qualys",
    "tagline": "Cloud-based security and compliance"
  },
  {
    "slug": "rspec",
    "name": "Rspec",
    "tagline": "Testing framework for Ruby"
  },
  {
    "slug": "ramp",
    "name": "Ramp",
    "tagline": "Corporate cards and expense management"
  },
  {
    "slug": "rapid7-insightidr",
    "name": "Rapid7 Insightidr",
    "tagline": "Cloud SIEM for threat detection"
  },
  {
    "slug": "reclaim-ai",
    "name": "Reclaim AI",
    "tagline": "Smart calendar management with AI"
  },
  {
    "slug": "redocly",
    "name": "Redocly",
    "tagline": "API documentation with OpenAPI"
  },
  {
    "slug": "reflect",
    "name": "Reflect",
    "tagline": "End-to-end encrypted note-taking"
  },
  {
    "slug": "remember-the-milk",
    "name": "Remember The Milk",
    "tagline": "Smart to-do list app"
  },
  {
    "slug": "remote",
    "name": "Remote",
    "tagline": "Global HR platform for distributed teams"
  },
  {
    "slug": "remove-bg",
    "name": "Remove Bg",
    "tagline": "AI background removal for images"
  },
  {
    "slug": "replit",
    "name": "Replit",
    "tagline": "Browser-based IDE for coding and deployment"
  },
  {
    "slug": "replit-ai",
    "name": "Replit AI",
    "tagline": "AI assistant built into Replit"
  },
  {
    "slug": "reply-io",
    "name": "Reply IO",
    "tagline": "Sales engagement and automation platform"
  },
  {
    "slug": "rescuetime",
    "name": "Rescuetime",
    "tagline": "Automatic time tracking for productivity"
  },
  {
    "slug": "rethinkdb",
    "name": "Rethinkdb",
    "tagline": "Real-time database with change feeds"
  },
  {
    "slug": "returnly",
    "name": "Returnly",
    "tagline": "Returns management for e-commerce"
  },
  {
    "slug": "revue",
    "name": "Revue",
    "tagline": "Newsletter platform acquired by Twitter"
  },
  {
    "slug": "rightfont",
    "name": "Rightfont",
    "tagline": "Font management for Mac designers"
  },
  {
    "slug": "rivery",
    "name": "Rivery",
    "tagline": "Data integration and orchestration platform"
  },
  {
    "slug": "rocket-chat",
    "name": "Rocket Chat",
    "tagline": "Open-source team communication"
  },
  {
    "slug": "rollup",
    "name": "Rollup",
    "tagline": "JavaScript module bundler"
  },
  {
    "slug": "rootly",
    "name": "Rootly",
    "tagline": "Incident management built for SRE"
  },
  {
    "slug": "route-53",
    "name": "Route 53",
    "tagline": "AWS DNS and domain registration"
  },
  {
    "slug": "rows",
    "name": "Rows",
    "tagline": "Spreadsheet with built-in integrations"
  },
  {
    "slug": "rspack",
    "name": "Rspack",
    "tagline": "Fast Rust-based JavaScript bundler"
  },
  {
    "slug": "rubocop",
    "name": "Rubocop",
    "tagline": "Ruby static code analyzer and formatter"
  },
  {
    "slug": "ruff",
    "name": "Ruff",
    "tagline": "Extremely fast Python linter in Rust"
  },
  {
    "slug": "runbook",
    "name": "Runbook",
    "tagline": "Operations runbook automation"
  },
  {
    "slug": "sst",
    "name": "Sst",
    "tagline": "Full-stack serverless framework for AWS"
  },
  {
    "slug": "swc",
    "name": "Swc",
    "tagline": "Super-fast TypeScript/JavaScript compiler"
  },
  {
    "slug": "salesloft",
    "name": "Salesloft",
    "tagline": "Sales engagement platform for revenue teams"
  },
  {
    "slug": "saltstack",
    "name": "Saltstack",
    "tagline": "Event-driven IT automation"
  },
  {
    "slug": "scope",
    "name": "Scope",
    "tagline": "Troubleshoot distributed applications"
  },
  {
    "slug": "screaming-frog",
    "name": "Screaming Frog",
    "tagline": "Website crawler for SEO audits"
  },
  {
    "slug": "scylladb",
    "name": "Scylladb",
    "tagline": "High-performance NoSQL database"
  },
  {
    "slug": "sendbird",
    "name": "Sendbird",
    "tagline": "Chat and messaging API for apps"
  },
  {
    "slug": "sentinelone",
    "name": "Sentinelone",
    "tagline": "AI-powered endpoint security"
  },
  {
    "slug": "seq",
    "name": "Seq",
    "tagline": "Centralized logging for .NET applications"
  },
  {
    "slug": "shipstation",
    "name": "Shipstation",
    "tagline": "Shipping software for e-commerce"
  },
  {
    "slug": "shippo",
    "name": "Shippo",
    "tagline": "Multi-carrier shipping API"
  },
  {
    "slug": "singer",
    "name": "Singer",
    "tagline": "Open-source ETL framework"
  },
  {
    "slug": "singular",
    "name": "Singular",
    "tagline": "Mobile marketing analytics platform"
  },
  {
    "slug": "site24x7",
    "name": "Site24x7",
    "tagline": "Full-stack monitoring for DevOps"
  },
  {
    "slug": "smartlook",
    "name": "Smartlook",
    "tagline": "Session replay and product analytics"
  },
  {
    "slug": "snov-io",
    "name": "Snov IO",
    "tagline": "Email finder and outreach automation"
  },
  {
    "slug": "snowflake",
    "name": "Snowflake",
    "tagline": "Cloud data platform for analytics"
  },
  {
    "slug": "sophos",
    "name": "Sophos",
    "tagline": "Cybersecurity for business"
  },
  {
    "slug": "sora",
    "name": "Sora",
    "tagline": "OpenAI's text-to-video AI model"
  },
  {
    "slug": "sourcegraph-cody",
    "name": "Sourcegraph Cody",
    "tagline": "AI coding assistant with codebase context"
  },
  {
    "slug": "sparkpost",
    "name": "Sparkpost",
    "tagline": "Email delivery and analytics"
  },
  {
    "slug": "speedcurve",
    "name": "Speedcurve",
    "tagline": "Web performance monitoring"
  },
  {
    "slug": "spike-sh",
    "name": "Spike Sh",
    "tagline": "Incident management via Slack"
  },
  {
    "slug": "split",
    "name": "Split",
    "tagline": "Feature delivery platform"
  },
  {
    "slug": "spocket",
    "name": "Spocket",
    "tagline": "Dropshipping marketplace for e-commerce"
  },
  {
    "slug": "sprig",
    "name": "Sprig",
    "tagline": "In-product surveys and user research"
  },
  {
    "slug": "squadcast",
    "name": "Squadcast",
    "tagline": "Incident management for SRE teams"
  },
  {
    "slug": "stackpath",
    "name": "Stackpath",
    "tagline": "Edge computing and CDN platform"
  },
  {
    "slug": "starrocks",
    "name": "Starrocks",
    "tagline": "Sub-second analytics database"
  },
  {
    "slug": "starlight",
    "name": "Starlight",
    "tagline": "Documentation theme for Astro"
  },
  {
    "slug": "statsig",
    "name": "Statsig",
    "tagline": "Feature flags and experimentation at scale"
  },
  {
    "slug": "statuscake",
    "name": "Statuscake",
    "tagline": "Uptime and performance monitoring"
  },
  {
    "slug": "statuspage",
    "name": "Statuspage",
    "tagline": "Status page hosting from Atlassian"
  },
  {
    "slug": "steve-ai",
    "name": "Steve AI",
    "tagline": "AI video maker for animated content"
  },
  {
    "slug": "stitch",
    "name": "Stitch",
    "tagline": "Cloud-first data integration platform"
  },
  {
    "slug": "stream",
    "name": "Stream",
    "tagline": "Activity feeds and chat API"
  },
  {
    "slug": "stytch",
    "name": "Stytch",
    "tagline": "Passwordless authentication for developers"
  },
  {
    "slug": "sumo-logic",
    "name": "Sumo Logic",
    "tagline": "Cloud-native machine data analytics"
  },
  {
    "slug": "supertokens",
    "name": "Supertokens",
    "tagline": "Open-source authentication solution"
  },
  {
    "slug": "superblocks",
    "name": "Superblocks",
    "tagline": "Build internal tools with AI"
  },
  {
    "slug": "surfer-seo",
    "name": "Surfer SEO",
    "tagline": "Content optimization for SEO"
  },
  {
    "slug": "sweep",
    "name": "Sweep",
    "tagline": "AI junior developer for bug fixes"
  },
  {
    "slug": "sysdig",
    "name": "Sysdig",
    "tagline": "Container security and monitoring"
  },
  {
    "slug": "tabler-icons",
    "name": "Tabler Icons",
    "tagline": "Free open-source SVG icons"
  },
  {
    "slug": "tailscale",
    "name": "Tailscale",
    "tagline": "Zero-config VPN using WireGuard"
  },
  {
    "slug": "talend",
    "name": "Talend",
    "tagline": "Data integration and management"
  },
  {
    "slug": "talkjs",
    "name": "Talkjs",
    "tagline": "Chat API for websites and apps"
  },
  {
    "slug": "tana",
    "name": "Tana",
    "tagline": "AI-native workspace for notes and tasks"
  },
  {
    "slug": "tandem",
    "name": "Tandem",
    "tagline": "Virtual office for remote teams"
  },
  {
    "slug": "teable",
    "name": "Teable",
    "tagline": "Open-source Airtable alternative"
  },
  {
    "slug": "tekton",
    "name": "Tekton",
    "tagline": "Cloud-native CI/CD for Kubernetes"
  },
  {
    "slug": "teleporthq",
    "name": "Teleporthq",
    "tagline": "No-code website and UI builder"
  },
  {
    "slug": "temporal",
    "name": "Temporal",
    "tagline": "Durable execution for microservices"
  },
  {
    "slug": "terragrunt",
    "name": "Terragrunt",
    "tagline": "Thin wrapper for Terraform"
  },
  {
    "slug": "testcafe",
    "name": "Testcafe",
    "tagline": "End-to-end testing without WebDriver"
  },
  {
    "slug": "text-generation-inference",
    "name": "Text Generation Inference",
    "tagline": "LLM serving from Hugging Face"
  },
  {
    "slug": "thunder-client",
    "name": "Thunder Client",
    "tagline": "REST API client for VS Code"
  },
  {
    "slug": "thunkable",
    "name": "Thunkable",
    "tagline": "No-code mobile app builder"
  },
  {
    "slug": "tidb",
    "name": "Tidb",
    "tagline": "MySQL-compatible distributed database"
  },
  {
    "slug": "tigergraph",
    "name": "Tigergraph",
    "tagline": "Enterprise graph database platform"
  },
  {
    "slug": "tilda",
    "name": "Tilda",
    "tagline": "Website builder for designers"
  },
  {
    "slug": "timing",
    "name": "Timing",
    "tagline": "Automatic time tracking for Mac"
  },
  {
    "slug": "topaz-labs",
    "name": "Topaz Labs",
    "tagline": "AI photo and video enhancement"
  },
  {
    "slug": "tracetest",
    "name": "Tracetest",
    "tagline": "End-to-end testing for distributed systems"
  },
  {
    "slug": "trackjs",
    "name": "Trackjs",
    "tagline": "JavaScript error monitoring"
  },
  {
    "slug": "transloadit",
    "name": "Transloadit",
    "tagline": "File uploading and processing API"
  },
  {
    "slug": "trend-micro",
    "name": "Trend Micro",
    "tagline": "Cybersecurity for hybrid environments"
  },
  {
    "slug": "tribe",
    "name": "Tribe",
    "tagline": "Community platform for brands"
  },
  {
    "slug": "trigger-dev",
    "name": "Trigger Dev",
    "tagline": "Background jobs for developers"
  },
  {
    "slug": "triple-whale",
    "name": "Triple Whale",
    "tagline": "E-commerce analytics and attribution"
  },
  {
    "slug": "trunk",
    "name": "Trunk",
    "tagline": "Code quality and developer experience tools"
  },
  {
    "slug": "tuple",
    "name": "Tuple",
    "tagline": "Remote pair programming app"
  },
  {
    "slug": "turbopack",
    "name": "Turbopack",
    "tagline": "Incremental bundler for Next.js"
  },
  {
    "slug": "turborepo",
    "name": "Turborepo",
    "tagline": "Monorepo build system from Vercel"
  },
  {
    "slug": "twingate",
    "name": "Twingate",
    "tagline": "Zero trust network access"
  },
  {
    "slug": "twist",
    "name": "Twist",
    "tagline": "Async team communication from Doist"
  },
  {
    "slug": "ubersuggest",
    "name": "Ubersuggest",
    "tagline": "SEO and keyword research tool"
  },
  {
    "slug": "umso",
    "name": "Umso",
    "tagline": "AI website builder for startups"
  },
  {
    "slug": "unicorn-platform",
    "name": "Unicorn Platform",
    "tagline": "Landing page builder for SaaS"
  },
  {
    "slug": "unleash",
    "name": "Unleash",
    "tagline": "Open-source feature flag platform"
  },
  {
    "slug": "uploadthing",
    "name": "Uploadthing",
    "tagline": "File uploads for Next.js apps"
  },
  {
    "slug": "uploadcare",
    "name": "Uploadcare",
    "tagline": "File uploading and processing CDN"
  },
  {
    "slug": "uptime-kuma",
    "name": "Uptime Kuma",
    "tagline": "Self-hosted uptime monitoring"
  },
  {
    "slug": "uptimerobot",
    "name": "Uptimerobot",
    "tagline": "Free uptime monitoring service"
  },
  {
    "slug": "uptrends",
    "name": "Uptrends",
    "tagline": "Website and API monitoring"
  },
  {
    "slug": "userpilot",
    "name": "Userpilot",
    "tagline": "Product adoption and onboarding"
  },
  {
    "slug": "vwo",
    "name": "Vwo",
    "tagline": "A/B testing and conversion optimization"
  },
  {
    "slug": "val-town",
    "name": "Val Town",
    "tagline": "Write and deploy serverless functions"
  },
  {
    "slug": "vectary",
    "name": "Vectary",
    "tagline": "3D design tool in the browser"
  },
  {
    "slug": "vectornator",
    "name": "Vectornator",
    "tagline": "Free design app for Mac and iPad"
  },
  {
    "slug": "veracode",
    "name": "Veracode",
    "tagline": "Application security testing platform"
  },
  {
    "slug": "vercel-edge-functions",
    "name": "Vercel Edge Functions",
    "tagline": "Run code at the edge with Vercel"
  },
  {
    "slug": "vespa",
    "name": "Vespa",
    "tagline": "Search and recommendation engine at scale"
  },
  {
    "slug": "victorops",
    "name": "Victorops",
    "tagline": "Incident management now part of Splunk"
  },
  {
    "slug": "vimcal",
    "name": "Vimcal",
    "tagline": "Calendar for busy professionals"
  },
  {
    "slug": "vite",
    "name": "Vite",
    "tagline": "Next generation frontend build tool"
  },
  {
    "slug": "vitess",
    "name": "Vitess",
    "tagline": "Database clustering for horizontal scaling"
  },
  {
    "slug": "wasmer",
    "name": "Wasmer",
    "tagline": "Run WebAssembly anywhere"
  },
  {
    "slug": "weweb",
    "name": "Weweb",
    "tagline": "No-code frontend builder for web apps"
  },
  {
    "slug": "weaviate",
    "name": "Weaviate",
    "tagline": "Open-source vector database with ML"
  },
  {
    "slug": "webex",
    "name": "Webex",
    "tagline": "Video conferencing from Cisco"
  },
  {
    "slug": "webpack",
    "name": "Webpack",
    "tagline": "JavaScript module bundler"
  },
  {
    "slug": "weights-biases",
    "name": "Weights Biases",
    "tagline": "ML experiment tracking and visualization"
  },
  {
    "slug": "wellsaid-labs",
    "name": "Wellsaid Labs",
    "tagline": "AI voice generation for enterprises"
  },
  {
    "slug": "whalesync",
    "name": "Whalesync",
    "tagline": "Two-way sync for Airtable and databases"
  },
  {
    "slug": "windmill",
    "name": "Windmill",
    "tagline": "Open-source developer platform for scripts"
  },
  {
    "slug": "wireguard",
    "name": "Wireguard",
    "tagline": "Fast and modern VPN protocol"
  },
  {
    "slug": "wise",
    "name": "Wise",
    "tagline": "International money transfers and accounts"
  },
  {
    "slug": "workos",
    "name": "Workos",
    "tagline": "Enterprise-ready auth and directory sync"
  },
  {
    "slug": "yarn",
    "name": "Yarn",
    "tagline": "Fast and reliable JavaScript package manager"
  },
  {
    "slug": "yugabytedb",
    "name": "Yugabytedb",
    "tagline": "Distributed SQL database for cloud"
  },
  {
    "slug": "zencastr",
    "name": "Zencastr",
    "tagline": "Podcast recording in studio quality"
  },
  {
    "slug": "zerotier",
    "name": "Zerotier",
    "tagline": "Software-defined networking for devices"
  },
  {
    "slug": "zilliz",
    "name": "Zilliz",
    "tagline": "Cloud vector database for AI"
  },
  {
    "slug": "zitadel",
    "name": "Zitadel",
    "tagline": "Open-source identity management"
  },
  {
    "slug": "zoho-creator",
    "name": "Zoho Creator",
    "tagline": "Low-code platform from Zoho"
  },
  {
    "slug": "zoominfo",
    "name": "Zoominfo",
    "tagline": "B2B contact database and intelligence"
  },
  {
    "slug": "zulip",
    "name": "Zulip",
    "tagline": "Open-source team chat with threads"
  },
  {
    "slug": "cdnjs",
    "name": "Cdnjs",
    "tagline": "Free CDN for popular JavaScript libraries"
  },
  {
    "slug": "cert-manager",
    "name": "Cert Manager",
    "tagline": "Kubernetes add-on for certificates"
  },
  {
    "slug": "dbt",
    "name": "Dbt",
    "tagline": "Transform data in your warehouse with SQL"
  },
  {
    "slug": "esbuild",
    "name": "Esbuild",
    "tagline": "Extremely fast JavaScript bundler"
  },
  {
    "slug": "jsdelivr",
    "name": "Jsdelivr",
    "tagline": "Free CDN for open source packages"
  },
  {
    "slug": "k9s",
    "name": "K9s",
    "tagline": "Terminal UI to manage Kubernetes clusters"
  },
  {
    "slug": "mkcert",
    "name": "Mkcert",
    "tagline": "Create local trusted dev certificates"
  },
  {
    "slug": "npm",
    "name": "NPM",
    "tagline": "The world's largest software registry"
  },
  {
    "slug": "pnpm",
    "name": "Pnpm",
    "tagline": "Fast, disk space efficient package manager"
  },
  {
    "slug": "pytest",
    "name": "Pytest",
    "tagline": "Python testing framework"
  },
  {
    "slug": "smallstep",
    "name": "Smallstep",
    "tagline": "Zero-trust access and certificate management"
  },
  {
    "slug": "tldv",
    "name": "Tldv",
    "tagline": "AI meeting recorder for transcripts"
  },
  {
    "slug": "unpkg",
    "name": "Unpkg",
    "tagline": "CDN for npm packages"
  },
  {
    "slug": "vllm",
    "name": "Vllm",
    "tagline": "Fast LLM serving with PagedAttention"
  },
  {
    "slug": "xmatters",
    "name": "Xmatters",
    "tagline": "Incident management and alerting"
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Get or create default category
  let defaultCategory = await prisma.category.findFirst({
    where: { slug: "productivity" }
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: {
        name: "Productivity",
        slug: "productivity",
        icon: "zap",
        description: "Personal and team productivity apps"
      }
    });
  }

  for (const tool of allTools) {
    try {
      // Check if already exists
      const existing = await prisma.tool.findUnique({
        where: { slug: tool.slug }
      });

      if (existing) {
        // Update tagline if tool has one and existing doesn't
        if (tool.tagline && (!existing.tagline || existing.tagline.includes("Software tool"))) {
          await prisma.tool.update({
            where: { slug: tool.slug },
            data: { tagline: tool.tagline }
          });
          updated++;
        } else {
          skipped++;
        }
        continue;
      }

      // Determine pricing type
      let pricing = "freemium";
      if (tool.startingPrice === 0) pricing = "freemium";
      else if (tool.startingPrice && tool.startingPrice > 0) pricing = "paid";

      // Create tool
      const newTool = await prisma.tool.create({
        data: {
          name: tool.name,
          slug: tool.slug,
          tagline: tool.tagline || `${tool.name} - Software tool`,
          description: tool.notes || `${tool.name} is a productivity and business software tool.`,
          website: `https://${tool.slug.replace(/-/g, '')}.com`,
          pricing,
          status: "published",
          upvotes: Math.floor(Math.random() * 200) + 10,
          weeklyUpvotes: Math.floor(Math.random() * 50) + 5,
          communityScore: 0,
        }
      });

      // Link to default category
      await prisma.categoryTool.create({
        data: {
          toolId: newTool.id,
          categoryId: defaultCategory.id
        }
      });

      created++;
    } catch (error) {
      errors.push(`${tool.slug}: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Seed completed: ${created} created, ${updated} updated, ${skipped} skipped`,
    created,
    updated,
    skipped,
    total: allTools.length,
    errors: errors.slice(0, 20)
  });
}
