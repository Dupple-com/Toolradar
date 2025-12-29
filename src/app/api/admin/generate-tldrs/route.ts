import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Meaningful TLDRs for popular tools - handcrafted descriptions
const toolTLDRs: Record<string, string> = {
  // Project Management
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

  // Communication
  "slack": "Real-time messaging that replaced email for modern teams",
  "zoom": "Video conferencing that became a verb during the pandemic",
  "microsoft-teams": "Chat, calls, and collaboration baked into Microsoft 365",
  "discord": "Voice, video, and text chat originally for gamers, now used everywhere",
  "loom": "Async video messages that replace meetings and long emails",
  "miro": "Infinite whiteboard for brainstorming, diagramming, and visual collaboration",
  "figma": "Browser-based design tool where teams can collaborate in real-time",

  // Development
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

  // AI Tools
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

  // Design
  "canva": "Design tool that makes everyone a graphic designer",
  "adobe-creative-cloud": "The professional creative suite: Photoshop, Illustrator, Premiere",
  "sketch": "Mac-native UI design tool that pioneered the modern design workflow",
  "invision": "Prototyping and collaboration for design teams",
  "framer": "Design tool that exports to production-ready websites",
  "webflow": "Visual web development platform with CMS and hosting",
  "bubble": "Build web apps visually without writing code",

  // Marketing
  "hubspot": "All-in-one marketing, sales, and CRM platform that scales with you",
  "mailchimp": "Email marketing that grew up to become a full marketing platform",
  "klaviyo": "Email and SMS marketing built specifically for e-commerce",
  "sendgrid": "Transactional email API trusted by developers worldwide",
  "convertkit": "Email marketing designed for creators and their audiences",
  "activecampaign": "Marketing automation with advanced segmentation and CRM",
  "brevo": "Marketing platform with email, SMS, chat, and CRM in one",
  "drip": "E-commerce CRM and email marketing for online stores",
  "constant-contact": "Established email marketing for small businesses",

  // Analytics
  "google-analytics": "The free analytics standard that tracks most websites",
  "mixpanel": "Product analytics focused on user behavior and events",
  "amplitude": "Product analytics with experimentation and feature flags",
  "hotjar": "See how users actually interact with your site via heatmaps and recordings",
  "heap": "Auto-capture analytics that retroactively answers any question",
  "posthog": "Open-source product analytics, session replay, and feature flags",
  "fullstory": "Digital experience intelligence through session replay",
  "pendo": "Product analytics with in-app guides for user onboarding",
  "segment": "Customer data platform that connects all your tools",

  // CRM & Sales
  "salesforce": "The CRM giant that enterprise sales teams love to hate",
  "pipedrive": "Visual sales pipeline management built for salespeople",
  "zoho-crm": "Full-featured CRM at a fraction of Salesforce's price",
  "close": "CRM built for inside sales teams who live on the phone",
  "freshsales": "AI-powered CRM from Freshworks with built-in phone and email",

  // Customer Support
  "zendesk": "Help desk software that scales from startup to enterprise",
  "intercom": "Customer messaging platform with AI-powered support",
  "freshdesk": "Help desk that balances features with usability",
  "help-scout": "Customer support software that feels like email",
  "crisp": "Live chat and customer messaging for modern businesses",
  "tidio": "Live chat with chatbots for e-commerce websites",

  // HR & Recruiting
  "bamboohr": "HR software for small and medium businesses",
  "greenhouse": "Structured hiring platform for growing companies",
  "lever": "ATS with CRM capabilities for relationship-driven recruiting",
  "rippling": "Unified HR, IT, and Finance in one platform",
  "gusto": "Payroll, benefits, and HR for small businesses",
  "lattice": "Performance management and employee engagement",
  "15five": "Continuous performance management with weekly check-ins",

  // Finance
  "quickbooks": "Small business accounting from the company that defined the category",
  "xero": "Cloud accounting that accountants actually like using",
  "freshbooks": "Invoicing and accounting built for freelancers and small businesses",
  "wave": "Free accounting software for small businesses",
  "zoho-books": "Comprehensive accounting as part of the Zoho ecosystem",
  "brex": "Corporate cards and spend management for startups",
  "stripe": "Payment processing that developers love to implement",
  "paypal": "The original online payment system, still everywhere",

  // E-signature & Documents
  "docusign": "Electronic signatures that are legally binding worldwide",
  "pandadoc": "Document automation with proposals, contracts, and e-signatures",
  "signnow": "Affordable e-signature solution for businesses of all sizes",
  "clio": "Legal practice management software for law firms",
  "juro": "AI-powered contract management for in-house legal teams",
  "ironclad": "Enterprise contract lifecycle management",

  // Security
  "1password": "Password manager trusted by individuals and businesses alike",
  "lastpass": "Widely adopted password manager despite security incidents",
  "bitwarden": "Open-source password manager you can self-host",
  "dashlane": "Password manager with VPN and dark web monitoring",
  "okta": "Enterprise identity and access management",
  "auth0": "Developer-friendly authentication and authorization",
  "snyk": "Developer security platform for finding and fixing vulnerabilities",
  "crowdstrike": "Endpoint security that stops breaches before they happen",

  // Testing & Monitoring
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

  // Note-taking & Documentation
  "obsidian": "Markdown-based knowledge management with local-first storage",
  "roam-research": "Networked note-taking that pioneered bi-directional linking",
  "craft": "Beautiful document editor with native Apple integration",
  "evernote": "The original note-taking app, still kicking after all these years",
  "gitbook": "Documentation platform that developers actually enjoy using",
  "confluence": "Team wiki and documentation for Atlassian users",

  // Scheduling & Productivity
  "calendly": "Scheduling automation that eliminated the back-and-forth",
  "cal-com": "Open-source Calendly alternative you can self-host",
  "typeform": "Beautiful, conversational forms that people enjoy filling out",
  "jotform": "Powerful form builder with templates for every use case",
  "tally": "Free form builder with modern UX and Notion integration",
  "todoist": "Simple, cross-platform task management that just works",
  "things": "Elegant task manager for Apple users who value design",

  // E-commerce
  "shopify": "E-commerce platform that powers over a million online stores",
  "woocommerce": "WordPress e-commerce plugin for maximum flexibility",
  "bigcommerce": "Enterprise e-commerce without the enterprise complexity",
  "squarespace": "Beautiful websites with built-in e-commerce",
  "wix": "Website builder that grew into a full business platform",
  "gumroad": "Sell digital products directly to your audience",

  // Social Media
  "buffer": "Schedule and analyze social media posts across platforms",
  "hootsuite": "Enterprise social media management and analytics",
  "sprout-social": "Social media management with customer care features",
  "later": "Visual social media planning, especially for Instagram",
  "socialbee": "AI-powered social media scheduling and content recycling",

  // Automation
  "zapier": "Connect apps and automate workflows without code",
  "make": "Visual automation platform with powerful data transformation",
  "n8n": "Self-hostable workflow automation for technical teams",

  // Video & Audio
  "kapwing": "Browser-based video editor with AI features",
  "descript": "Edit video by editing text transcripts",
  "riverside": "High-quality remote podcast and video recording",

  // Learning & Courses
  "thinkific": "Create and sell online courses with your own platform",
  "teachable": "Course platform focused on simplicity and marketing",
  "podia": "All-in-one platform for courses, downloads, and communities",
  "kajabi": "Complete business platform for knowledge entrepreneurs"
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

  console.log("🔧 Generating meaningful TLDRs for tools...\n");

  let updated = 0;
  let notFound = 0;
  const errors: string[] = [];
  const notFoundList: string[] = [];
  const updatedList: string[] = [];

  for (const [slug, tldr] of Object.entries(toolTLDRs)) {
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
        data: { tagline: tldr }
      });

      updatedList.push(tool.name);
      updated++;
    } catch (error) {
      errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Meaningful TLDRs generated and applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
