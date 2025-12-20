import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Logo URLs - using cdn.simpleicons.org (reliable CDN for brand icons)
const logos: Record<string, string> = {
  "notion.so": "https://cdn.simpleicons.org/notion/000000",
  "slack.com": "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
  "figma.com": "https://static.figma.com/app/icon/1/favicon.png",
  "github.com": "https://cdn.simpleicons.org/github/000000",
  "linear.app": "https://cdn.simpleicons.org/linear/5E6AD2",
  "stripe.com": "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
  "vercel.com": "https://cdn.simpleicons.org/vercel/000000",
  "airtable.com": "https://static.airtable.com/images/favicon/baymax/apple-touch-icon.png",
  "zoom.us": "https://cdn.simpleicons.org/zoom/0B5CFF",
  "asana.com": "https://cdn.simpleicons.org/asana/F06A6A",
  "atlassian.com": "https://cdn.simpleicons.org/atlassian/0052CC",
  "trello.com": "https://cdn.simpleicons.org/trello/0052CC",
  "miro.com": "https://cdn.simpleicons.org/miro/050038",
  "canva.com": "https://static.canva.com/static/images/apple-touch-icon.png",
  "hubspot.com": "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  "salesforce.com": "https://cdn.simpleicons.org/salesforce/00A1E0",
  "mailchimp.com": "https://cdn.simpleicons.org/mailchimp/FFE01B",
  "dropbox.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/200px-Dropbox_Icon.svg.png",
  "1password.com": "https://cdn.simpleicons.org/1password/0094F5",
  "calendly.com": "https://cdn.simpleicons.org/calendly/006BFF",
  "monday.com": "https://cdn.monday.com/images/logos/monday_logo_icon.png",
  "clickup.com": "https://cdn.simpleicons.org/clickup/7B68EE",
  "zapier.com": "https://cdn.simpleicons.org/zapier/FF4A00",
  "webflow.com": "https://cdn.simpleicons.org/webflow/4353FF",
  "framer.com": "https://cdn.simpleicons.org/framer/0055FF",
  "openai.com": "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  "anthropic.com": "https://cdn.simpleicons.org/anthropic/000000",
  "cursor.sh": "https://cdn.simpleicons.org/cursor/000000",
  "supabase.com": "https://cdn.simpleicons.org/supabase/3FCF8E",
  "railway.app": "https://cdn.simpleicons.org/railway/0B0D0E",
  "render.com": "https://cdn.simpleicons.org/render/46E3B7",
  "cloudflare.com": "https://cdn.simpleicons.org/cloudflare/F38020",
  "retool.com": "https://cdn.simpleicons.org/retool/3D3D3D",
  "n8n.io": "https://cdn.simpleicons.org/n8n/EA4B71",
  "make.com": "https://www.make.com/apple-touch-icon.png",
  "resend.com": "https://cdn.simpleicons.org/resend",
  "posthog.com": "https://cdn.simpleicons.org/posthog/000000",
  "plausible.io": "https://cdn.simpleicons.org/plausibleanalytics/5850EC",
  "raycast.com": "https://cdn.simpleicons.org/raycast/FF6363",
  "obsidian.md": "https://cdn.simpleicons.org/obsidian/7C3AED",
  "grammarly.com": "https://cdn.simpleicons.org/grammarly/15C39A",
  "loom.com": "https://cdn.simpleicons.org/loom/625DF5",
  "zendesk.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Zendesk_logo.svg/200px-Zendesk_logo.svg.png",
  "intercom.com": "https://cdn.simpleicons.org/intercom/6AFDEF",
  "crisp.chat": "https://app.crisp.chat/static/img/logo/crisp-icon.png",
  "shopify.com": "https://cdn.simpleicons.org/shopify/7AB55C",
  "gumroad.com": "https://gumroad.com/favicon.ico",
  "prisma.io": "https://cdn.simpleicons.org/prisma/2D3748",
  "docker.com": "https://cdn.simpleicons.org/docker/2496ED",
  "visualstudio.com": "https://code.visualstudio.com/apple-touch-icon.png",
  "postman.com": "https://cdn.simpleicons.org/postman/FF6C37",
};

const getLogo = (domain: string): string | null => logos[domain] || null;

const categories = [
  { name: "Project Management", slug: "project-management", icon: "kanban", description: "Tools for managing projects, tasks, and workflows" },
  { name: "Communication", slug: "communication", icon: "message-square", description: "Team messaging and video conferencing tools" },
  { name: "Design", slug: "design", icon: "palette", description: "Design, prototyping, and creative tools" },
  { name: "Developer Tools", slug: "developer-tools", icon: "code", description: "Tools for software development and DevOps" },
  { name: "Productivity", slug: "productivity", icon: "zap", description: "Personal and team productivity apps" },
  { name: "Marketing", slug: "marketing", icon: "megaphone", description: "Marketing automation and analytics" },
  { name: "Sales", slug: "sales", icon: "trending-up", description: "CRM and sales enablement tools" },
  { name: "Finance", slug: "finance", icon: "dollar-sign", description: "Accounting, payments, and financial tools" },
  { name: "AI & Automation", slug: "ai-automation", icon: "bot", description: "AI-powered tools and automation platforms" },
  { name: "Analytics", slug: "analytics", icon: "bar-chart-2", description: "Data analytics and business intelligence" },
  { name: "Customer Support", slug: "customer-support", icon: "headphones", description: "Help desk and customer service tools" },
  { name: "Cloud & Infrastructure", slug: "cloud-infrastructure", icon: "cloud", description: "Cloud hosting and infrastructure services" },
  { name: "Security", slug: "security", icon: "shield", description: "Security and compliance tools" },
  { name: "No-Code", slug: "no-code", icon: "puzzle", description: "No-code and low-code platforms" },
  { name: "Video & Media", slug: "video-media", icon: "video", description: "Video editing and media production tools" },
  { name: "Writing & Content", slug: "writing-content", icon: "file-text", description: "Writing assistants and content creation" },
  { name: "Data & Databases", slug: "data-databases", icon: "database", description: "Database management and data tools" },
  { name: "E-commerce", slug: "ecommerce", icon: "shopping-cart", description: "Online store and commerce platforms" },
  { name: "Email", slug: "email", icon: "mail", description: "Email marketing and management" },
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
        const companyLogoUrl = getLogo(tool.domain);
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
        // Update logo, status, and reset fake scores
        await prisma.tool.update({
          where: { slug: tool.slug },
          data: { logo: logoUrl, communityScore: 0, status: "published" },
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret === "Toolradar2024Seed") {
    // Run seed via GET with secret (for easy browser access)
    return POST(request);
  }

  return NextResponse.json({ message: "Use POST to run seed, or GET with ?secret=..." });
}
