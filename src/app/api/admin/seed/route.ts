import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// All logos - use official sources to avoid ad blocker issues
const logos: Record<string, string> = {
  "notion.so": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "slack.com": "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
  "figma.com": "https://static.figma.com/app/icon/1/favicon.png",
  "github.com": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  "linear.app": "https://linear.app/static/apple-touch-icon.png",
  "stripe.com": "https://b.stripecdn.com/site-statics/assets/icons/apple-touch-icon.png",
  "vercel.com": "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  "airtable.com": "https://airtable.com/images/favicon/baymax/apple-touch-icon.png",
  "zoom.us": "https://st1.zoom.us/zoom.ico",
  "asana.com": "https://luna1.co/apple-touch-icon.png",
  "atlassian.com": "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
  "trello.com": "https://trello.com/assets/apple-touch-icon.png",
  "miro.com": "https://miro.com/static/favicons/apple-touch-icon.png",
  "canva.com": "https://static.canva.com/static/images/iOS-app-icon-180x180.png",
  "hubspot.com": "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  "salesforce.com": "https://www.salesforce.com/favicon.ico",
  "mailchimp.com": "https://eep.io/images/yzco4xsimv0y/KZD0BZjgSCigJYOzNKSjq/7d6dded8b01bf6b03e7dc0e1e91e30b5/mailchimp-freddie-icon-wink.png",
  "dropbox.com": "https://cfl.dropboxstatic.com/static/images/logo_catalog/dropbox_logo_glyph_m1.png",
  "1password.com": "https://1password.com/apple-touch-icon.png",
  "calendly.com": "https://assets.calendly.com/assets/apple-touch-icon.png",
  "monday.com": "https://cdn.monday.com/images/logos/monday_logo_icon.png",
  "clickup.com": "https://clickup.com/apple-touch-icon.png",
  "zapier.com": "https://cdn.zapier.com/zapier/images/favicon.png",
  "webflow.com": "https://assets-global.website-files.com/5d3e265ac89f6a3e64292efc/5d5595354de4fbdd8c554dcc_Webflow-Favicon.png",
  "framer.com": "https://framerusercontent.com/images/3gTbUnrg5iRTLGLCrEb6pZ7gI.png",
  "openai.com": "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  "anthropic.com": "https://www.anthropic.com/images/icons/apple-touch-icon.png",
  "cursor.sh": "https://cursor.sh/apple-touch-icon.png",
  "supabase.com": "https://supabase.com/favicon/apple-touch-icon.png",
  "railway.app": "https://railway.app/apple-touch-icon.png",
  "render.com": "https://render.com/apple-touch-icon.png",
  "cloudflare.com": "https://www.cloudflare.com/apple-touch-icon.png",
  "retool.com": "https://retool.com/apple-touch-icon.png",
  "n8n.io": "https://n8n.io/favicon/apple-touch-icon.png",
  "make.com": "https://www.make.com/apple-touch-icon.png",
  "resend.com": "https://resend.com/static/apple-touch-icon.png",
  "posthog.com": "https://posthog.com/images/favicon/apple-touch-icon.png",
  "plausible.io": "https://plausible.io/apple-touch-icon.png",
  "raycast.com": "https://raycast.com/apple-touch-icon.png",
  "obsidian.md": "https://obsidian.md/images/obsidian-logo-512.png",
  "grammarly.com": "https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/apple-touch-icon.png",
  "loom.com": "https://cdn.loom.com/assets/favicons/apple-touch-icon.png",
  "zendesk.com": "https://d1eipm3vz40ber0.cloudfront.net/images/p-favicon/apple-touch-icon.png",
  "intercom.com": "https://static.intercomassets.com/assets/favicon-7f72e7d9f6a0d26c4c83b13e5fefc8ba71eb53b8c5eba0b3b5fe5f921e2df3d6.png",
  "crisp.chat": "https://crisp.chat/favicon-512x512.png",
  "shopify.com": "https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg",
  "gumroad.com": "https://gumroad.com/favicon.ico",
  "prisma.io": "https://www.prisma.io/apple-touch-icon.png",
  "docker.com": "https://www.docker.com/wp-content/uploads/2023/04/cropped-Docker-favicon-192x192.png",
  "visualstudio.com": "https://code.visualstudio.com/apple-touch-icon.png",
  "postman.com": "https://www.postman.com/apple-touch-icon.png",
};

// Fallback to Google favicon service
const getLogo = (domain: string) => logos[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const categories = [
  { name: "Project Management", slug: "project-management", icon: "Kanban", description: "Tools for managing projects, tasks, and workflows" },
  { name: "Communication", slug: "communication", icon: "MessageSquare", description: "Team messaging and video conferencing tools" },
  { name: "Design", slug: "design", icon: "Palette", description: "Design, prototyping, and creative tools" },
  { name: "Developer Tools", slug: "developer-tools", icon: "Code", description: "Tools for software development and DevOps" },
  { name: "Productivity", slug: "productivity", icon: "Zap", description: "Personal and team productivity apps" },
  { name: "Marketing", slug: "marketing", icon: "Megaphone", description: "Marketing automation and analytics" },
  { name: "Sales", slug: "sales", icon: "TrendingUp", description: "CRM and sales enablement tools" },
  { name: "Finance", slug: "finance", icon: "DollarSign", description: "Accounting, payments, and financial tools" },
  { name: "AI & Automation", slug: "ai-automation", icon: "Bot", description: "AI-powered tools and automation platforms" },
  { name: "Analytics", slug: "analytics", icon: "BarChart2", description: "Data analytics and business intelligence" },
  { name: "Customer Support", slug: "customer-support", icon: "Headphones", description: "Help desk and customer service tools" },
  { name: "Cloud & Infrastructure", slug: "cloud-infrastructure", icon: "Cloud", description: "Cloud hosting and infrastructure services" },
  { name: "Security", slug: "security", icon: "Shield", description: "Security and compliance tools" },
  { name: "No-Code", slug: "no-code", icon: "Puzzle", description: "No-code and low-code platforms" },
  { name: "Video & Media", slug: "video-media", icon: "Video", description: "Video editing and media production tools" },
  { name: "Writing & Content", slug: "writing-content", icon: "FileText", description: "Writing assistants and content creation" },
  { name: "Data & Databases", slug: "data-databases", icon: "Database", description: "Database management and data tools" },
  { name: "E-commerce", slug: "ecommerce", icon: "ShoppingCart", description: "Online store and commerce platforms" },
  { name: "Email", slug: "email", icon: "Mail", description: "Email marketing and management" },
];

const tools = [
  { name: "Notion", slug: "notion", tagline: "The all-in-one workspace for notes, docs, and databases", description: "Notion is a connected workspace combining notes, docs, wikis, and project management.", website: "https://www.notion.so", pricing: "freemium", domain: "notion.so", categories: ["productivity", "project-management", "no-code"] },
  { name: "Slack", slug: "slack", tagline: "Where work happens - messaging for teams", description: "Slack is a channel-based messaging platform for team communication and collaboration.", website: "https://slack.com", pricing: "freemium", domain: "slack.com", categories: ["communication", "productivity"] },
  { name: "Figma", slug: "figma", tagline: "The collaborative interface design tool", description: "Figma is a cloud-based design platform for collaborative interface design.", website: "https://www.figma.com", pricing: "freemium", domain: "figma.com", categories: ["design", "productivity"] },
  { name: "GitHub", slug: "github", tagline: "Where the world builds software", description: "GitHub is the world's leading software development platform with Git hosting.", website: "https://github.com", pricing: "freemium", domain: "github.com", categories: ["developer-tools", "productivity"] },
  { name: "Linear", slug: "linear", tagline: "The issue tracking tool you'll enjoy using", description: "Linear is a modern issue tracking and project management tool for high-performance teams.", website: "https://linear.app", pricing: "freemium", domain: "linear.app", categories: ["project-management", "developer-tools"] },
  { name: "Stripe", slug: "stripe", tagline: "Financial infrastructure for the internet", description: "Stripe is a suite of APIs powering online payment processing.", website: "https://stripe.com", pricing: "paid", domain: "stripe.com", categories: ["finance", "developer-tools", "ecommerce"] },
  { name: "Vercel", slug: "vercel", tagline: "Develop. Preview. Ship.", description: "Vercel is the platform for frontend developers with zero-config deployments.", website: "https://vercel.com", pricing: "freemium", domain: "vercel.com", categories: ["developer-tools", "cloud-infrastructure"] },
  { name: "Airtable", slug: "airtable", tagline: "The platform to build next-gen apps", description: "Airtable is a low-code platform combining spreadsheet familiarity with database power.", website: "https://airtable.com", pricing: "freemium", domain: "airtable.com", categories: ["no-code", "productivity", "project-management"] },
  { name: "Zoom", slug: "zoom", tagline: "One platform to connect", description: "Zoom is a communications platform for video conferencing and online meetings.", website: "https://zoom.us", pricing: "freemium", domain: "zoom.us", categories: ["communication", "productivity"] },
  { name: "Asana", slug: "asana", tagline: "Manage your team's work, projects, & tasks online", description: "Asana is a work management platform for team collaboration.", website: "https://asana.com", pricing: "freemium", domain: "asana.com", categories: ["project-management", "productivity"] },
  { name: "Jira", slug: "jira", tagline: "The #1 software development tool used by agile teams", description: "Jira is Atlassian's project management tool for agile software development.", website: "https://www.atlassian.com/software/jira", pricing: "freemium", domain: "atlassian.com", categories: ["project-management", "developer-tools"] },
  { name: "Trello", slug: "trello", tagline: "Manage your team's projects from anywhere", description: "Trello is a visual collaboration tool using boards, lists, and cards.", website: "https://trello.com", pricing: "freemium", domain: "trello.com", categories: ["project-management", "productivity"] },
  { name: "Miro", slug: "miro", tagline: "The visual collaboration platform", description: "Miro is an online collaborative whiteboard for distributed teams.", website: "https://miro.com", pricing: "freemium", domain: "miro.com", categories: ["design", "productivity", "communication"] },
  { name: "Canva", slug: "canva", tagline: "Design anything. Publish anywhere.", description: "Canva is a graphic design platform for creating visual content.", website: "https://www.canva.com", pricing: "freemium", domain: "canva.com", categories: ["design", "marketing", "video-media"] },
  { name: "HubSpot", slug: "hubspot", tagline: "Grow better with HubSpot", description: "HubSpot is a CRM platform for marketing, sales, and customer service.", website: "https://www.hubspot.com", pricing: "freemium", domain: "hubspot.com", categories: ["sales", "marketing", "customer-support"] },
  { name: "Salesforce", slug: "salesforce", tagline: "The world's #1 CRM", description: "Salesforce is the world's leading cloud-based CRM platform.", website: "https://www.salesforce.com", pricing: "paid", domain: "salesforce.com", categories: ["sales", "marketing", "customer-support"] },
  { name: "Mailchimp", slug: "mailchimp", tagline: "Turn emails into revenue", description: "Mailchimp is an all-in-one marketing platform for email campaigns.", website: "https://mailchimp.com", pricing: "freemium", domain: "mailchimp.com", categories: ["email", "marketing"] },
  { name: "Dropbox", slug: "dropbox", tagline: "Keep life organized and work moving", description: "Dropbox is a file hosting service with cloud storage and sync.", website: "https://www.dropbox.com", pricing: "freemium", domain: "dropbox.com", categories: ["productivity", "cloud-infrastructure"] },
  { name: "1Password", slug: "1password", tagline: "The world's most-loved password manager", description: "1Password is a password manager for storing sensitive information securely.", website: "https://1password.com", pricing: "paid", domain: "1password.com", categories: ["security", "productivity"] },
  { name: "Calendly", slug: "calendly", tagline: "Easy scheduling ahead", description: "Calendly is a scheduling automation platform eliminating back-and-forth emails.", website: "https://calendly.com", pricing: "freemium", domain: "calendly.com", categories: ["productivity", "sales"] },
  { name: "Monday.com", slug: "monday", tagline: "A platform built for a new way of working", description: "Monday.com is a Work OS for running projects and workflows.", website: "https://monday.com", pricing: "paid", domain: "monday.com", categories: ["project-management", "productivity", "no-code"] },
  { name: "ClickUp", slug: "clickup", tagline: "One app to replace them all", description: "ClickUp is an all-in-one productivity platform combining tasks, docs, and goals.", website: "https://clickup.com", pricing: "freemium", domain: "clickup.com", categories: ["project-management", "productivity"] },
  { name: "Zapier", slug: "zapier", tagline: "Automate your work across 6,000+ apps", description: "Zapier is an automation platform connecting apps without coding.", website: "https://zapier.com", pricing: "freemium", domain: "zapier.com", categories: ["ai-automation", "productivity", "no-code"] },
  { name: "Webflow", slug: "webflow", tagline: "The site you want - without the dev time", description: "Webflow is a visual web development platform for building custom websites.", website: "https://webflow.com", pricing: "freemium", domain: "webflow.com", categories: ["no-code", "design", "ecommerce"] },
  { name: "Framer", slug: "framer", tagline: "Start your dream site with AI", description: "Framer is a web design and publishing platform with AI capabilities.", website: "https://www.framer.com", pricing: "freemium", domain: "framer.com", categories: ["no-code", "design"] },
  { name: "ChatGPT", slug: "chatgpt", tagline: "Get instant answers, find inspiration, learn something new", description: "ChatGPT is an AI chatbot by OpenAI for natural conversations and tasks.", website: "https://chat.openai.com", pricing: "freemium", domain: "openai.com", categories: ["ai-automation", "writing-content", "developer-tools"] },
  { name: "Claude", slug: "claude", tagline: "AI assistant by Anthropic", description: "Claude is an AI assistant excelling at analysis, coding, and conversations.", website: "https://claude.ai", pricing: "freemium", domain: "anthropic.com", categories: ["ai-automation", "writing-content", "developer-tools"] },
  { name: "Cursor", slug: "cursor", tagline: "The AI-first code editor", description: "Cursor is an AI-powered code editor built for pair programming with AI.", website: "https://cursor.sh", pricing: "freemium", domain: "cursor.sh", categories: ["developer-tools", "ai-automation"] },
  { name: "Supabase", slug: "supabase", tagline: "The open source Firebase alternative", description: "Supabase provides PostgreSQL database, auth, storage, and real-time subscriptions.", website: "https://supabase.com", pricing: "freemium", domain: "supabase.com", categories: ["developer-tools", "data-databases", "cloud-infrastructure"] },
  { name: "Railway", slug: "railway", tagline: "Infrastructure made simple", description: "Railway is an infrastructure platform for easy app and database deployment.", website: "https://railway.app", pricing: "freemium", domain: "railway.app", categories: ["cloud-infrastructure", "developer-tools"] },
  { name: "Render", slug: "render", tagline: "Your fastest path to production", description: "Render is a unified cloud for apps and websites with automatic deploys.", website: "https://render.com", pricing: "freemium", domain: "render.com", categories: ["cloud-infrastructure", "developer-tools"] },
  { name: "Cloudflare", slug: "cloudflare", tagline: "Build your next big idea on Cloudflare", description: "Cloudflare provides CDN, DDoS protection, security, and edge computing.", website: "https://www.cloudflare.com", pricing: "freemium", domain: "cloudflare.com", categories: ["cloud-infrastructure", "security", "developer-tools"] },
  { name: "Retool", slug: "retool", tagline: "The fastest way to build internal tools", description: "Retool is a low-code platform for building internal tools quickly.", website: "https://retool.com", pricing: "freemium", domain: "retool.com", categories: ["no-code", "developer-tools"] },
  { name: "n8n", slug: "n8n", tagline: "Workflow automation for technical people", description: "n8n is an extendable workflow automation tool with a visual builder.", website: "https://n8n.io", pricing: "freemium", domain: "n8n.io", categories: ["ai-automation", "no-code", "developer-tools"] },
  { name: "Make", slug: "make", tagline: "From tasks and workflows to apps and systems", description: "Make (formerly Integromat) is a visual platform for workflow automation.", website: "https://www.make.com", pricing: "freemium", domain: "make.com", categories: ["ai-automation", "no-code"] },
  { name: "Resend", slug: "resend", tagline: "Email for developers", description: "Resend is a modern email API with great developer experience.", website: "https://resend.com", pricing: "freemium", domain: "resend.com", categories: ["developer-tools", "email"] },
  { name: "PostHog", slug: "posthog", tagline: "The open source product analytics suite", description: "PostHog provides product analytics, session recordings, and feature flags.", website: "https://posthog.com", pricing: "freemium", domain: "posthog.com", categories: ["analytics", "developer-tools"] },
  { name: "Plausible", slug: "plausible", tagline: "Simple and privacy-friendly Google Analytics alternative", description: "Plausible is a lightweight, privacy-first web analytics tool.", website: "https://plausible.io", pricing: "paid", domain: "plausible.io", categories: ["analytics", "marketing"] },
  { name: "Raycast", slug: "raycast", tagline: "Your shortcut to everything", description: "Raycast is a blazingly fast launcher for macOS replacing Spotlight.", website: "https://www.raycast.com", pricing: "freemium", domain: "raycast.com", categories: ["productivity", "developer-tools"] },
  { name: "Obsidian", slug: "obsidian", tagline: "Sharpen your thinking", description: "Obsidian is a knowledge base working on local markdown files with linking.", website: "https://obsidian.md", pricing: "freemium", domain: "obsidian.md", categories: ["productivity", "writing-content"] },
  { name: "Grammarly", slug: "grammarly", tagline: "Responsible AI that ensures your writing and reputation shine", description: "Grammarly is a writing assistant for grammar, spelling, and style.", website: "https://www.grammarly.com", pricing: "freemium", domain: "grammarly.com", categories: ["writing-content", "ai-automation"] },
  { name: "Loom", slug: "loom", tagline: "Video messaging for work", description: "Loom is a video messaging platform for instant shareable recordings.", website: "https://www.loom.com", pricing: "freemium", domain: "loom.com", categories: ["communication", "video-media", "productivity"] },
  { name: "Zendesk", slug: "zendesk", tagline: "Champions of customer service", description: "Zendesk is a customer service platform with ticketing and help center.", website: "https://www.zendesk.com", pricing: "paid", domain: "zendesk.com", categories: ["customer-support", "sales"] },
  { name: "Intercom", slug: "intercom", tagline: "The complete AI-first customer service platform", description: "Intercom is a customer messaging platform with AI-powered support.", website: "https://www.intercom.com", pricing: "paid", domain: "intercom.com", categories: ["customer-support", "sales", "marketing"] },
  { name: "Crisp", slug: "crisp", tagline: "Give your customer experience a human touch", description: "Crisp is an all-in-one business messaging platform.", website: "https://crisp.chat", pricing: "freemium", domain: "crisp.chat", categories: ["customer-support", "communication"] },
  { name: "Shopify", slug: "shopify", tagline: "Making commerce better for everyone", description: "Shopify is a complete commerce platform for online stores.", website: "https://www.shopify.com", pricing: "paid", domain: "shopify.com", categories: ["ecommerce", "marketing"] },
  { name: "Gumroad", slug: "gumroad", tagline: "Go from zero to $1 with Gumroad", description: "Gumroad is an e-commerce platform for creators selling digital products.", website: "https://gumroad.com", pricing: "freemium", domain: "gumroad.com", categories: ["ecommerce", "marketing"] },
  { name: "Prisma", slug: "prisma", tagline: "Next-generation ORM for Node.js and TypeScript", description: "Prisma is a type-safe ORM for Node.js and TypeScript.", website: "https://www.prisma.io", pricing: "freemium", domain: "prisma.io", categories: ["developer-tools", "data-databases"] },
  { name: "Docker", slug: "docker", tagline: "Develop faster. Run anywhere.", description: "Docker is a platform for developing and running applications in containers.", website: "https://www.docker.com", pricing: "freemium", domain: "docker.com", categories: ["developer-tools", "cloud-infrastructure"] },
  { name: "VS Code", slug: "vs-code", tagline: "Code editing. Redefined.", description: "Visual Studio Code is a lightweight but powerful source code editor.", website: "https://code.visualstudio.com", pricing: "free", domain: "visualstudio.com", categories: ["developer-tools"] },
  { name: "Postman", slug: "postman", tagline: "The collaboration platform for API development", description: "Postman is an API platform for building and testing APIs.", website: "https://www.postman.com", pricing: "freemium", domain: "postman.com", categories: ["developer-tools"] },
];

export async function POST(request: Request) {
  try {
    // Check secret key OR admin auth
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== "Toolradar2024Seed") {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results = { categories: 0, companies: 0, tools: 0 };

    // 1. Create categories
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name, icon: category.icon, description: category.description },
        create: { name: category.name, slug: category.slug, icon: category.icon, description: category.description },
      });
      results.categories++;
    }

    // 2. Create tools with companies
    for (const tool of tools) {
      // Create or get company
      let company = await prisma.company.findUnique({
        where: { domain: tool.domain },
      });

      if (!company) {
        const companyLogoUrl = customLogos[tool.domain] || getLogo(tool.domain);
        company = await prisma.company.create({
          data: {
            name: tool.name.includes(" ") ? tool.name.split(" ")[0] : tool.name,
            slug: tool.domain.replace(/\./g, "-"),
            domain: tool.domain,
            logo: companyLogoUrl,
            website: tool.website,
            description: `${tool.name} is a leading company in its space.`,
            claimedAt: null,
            claimedBy: null,
          },
        });
        results.companies++;
      }

      // Create or update tool
      const existingTool = await prisma.tool.findUnique({
        where: { slug: tool.slug },
      });

      const logoUrl = getLogo(tool.domain);

      if (existingTool) {
        // Update logo and reset fake scores
        await prisma.tool.update({
          where: { slug: tool.slug },
          data: { logo: logoUrl, communityScore: 0 },
        });
      } else {
        const createdTool = await prisma.tool.create({
          data: {
            name: tool.name,
            slug: tool.slug,
            tagline: tool.tagline,
            description: tool.description,
            logo: logoUrl,
            website: tool.website,
            pricing: tool.pricing,
            status: "published",
            companyId: company.id,
            upvotes: Math.floor(Math.random() * 500) + 50,
            weeklyUpvotes: Math.floor(Math.random() * 100) + 10,
            communityScore: 0,
          },
        });

        // Link categories
        for (const categorySlug of tool.categories) {
          const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
          });
          if (category) {
            await prisma.categoryTool.create({
              data: { toolId: createdTool.id, categoryId: category.id },
            });
          }
        }
        results.tools++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed completed: ${results.categories} categories, ${results.companies} companies, ${results.tools} tools`,
      results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to run seed. Must be admin." });
}
