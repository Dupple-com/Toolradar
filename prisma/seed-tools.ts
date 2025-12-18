import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: Use Google's favicon service for consistent square logos (128px)
const getLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Custom high-quality logos for major tools (override the helper when available)
const customLogos: Record<string, string> = {
  "notion.so": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "slack.com": "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
  "figma.com": "https://cdn.sanity.io/images/599r6htc/regionalized/46a76c802176eb17b04e12108571f3e0f2abad73-1080x1080.png",
  "github.com": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  "linear.app": "https://linear.app/static/apple-touch-icon.png",
  "stripe.com": "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
  "vercel.com": "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  "airtable.com": "https://airtable.com/images/favicon/baymax/apple-touch-icon.png",
  "asana.com": "https://d1gwm4cf8hecp4.cloudfront.net/images/favicons/apple-touch-icon.png",
  "atlassian.com": "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
  "trello.com": "https://trello.com/assets/apple-touch-icon.png",
  "miro.com": "https://miro.com/static/favicons/apple-touch-icon.png",
  "loom.com": "https://cdn.loom.com/assets/favicons/apple-touch-icon.png",
  "canva.com": "https://static.canva.com/static/images/iOS-app-icon-180x180.png",
  "hubspot.com": "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  "salesforce.com": "https://www.salesforce.com/content/dam/sfdc-docs/www/logos/logo-salesforce.png",
  "intercom.com": "https://static.intercomassets.com/assets/favicon-7f72e7d9f6a0d26c4c83b13e5fefc8ba71eb53b8c5eba0b3b5fe5f921e2df3d6.png",
  "mailchimp.com": "https://eep.io/images/yzco4xsimv0y/KZD0BZjgSCigJYOzNKSjq/7d6dded8b01bf6b03e7dc0e1e91e30b5/mailchimp-freddie-icon-wink.png",
  "dropbox.com": "https://cfl.dropboxstatic.com/static/images/logo_catalog/dropbox_logo_glyph_m1.png",
  "1password.com": "https://1password.com/apple-touch-icon.png",
  "calendly.com": "https://assets.calendly.com/assets/apple-touch-icon.png",
  "monday.com": "https://cdn.monday.com/images/logos/monday_logo_icon.png",
  "clickup.com": "https://clickup.com/apple-touch-icon.png",
  "zapier.com": "https://cdn.zapier.com/ssr/4bf98e82e2f9f97e8746e5c5e0d5f9a2fa33c03f/_next/static/images/apple-touch-icon-180-c2e26dd7a6.png",
  "webflow.com": "https://assets-global.website-files.com/5d3e265ac89f6a3e64292efc/5d5a431a9b94a727a7a9a3e8_favicon.png",
  "framer.com": "https://framerusercontent.com/images/3gTbUnrg5iRTLGLCrEb6pZ7gI.png",
  "openai.com": "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  "anthropic.com": "https://www.anthropic.com/images/icons/apple-touch-icon.png",
  "midjourney.com": "https://cdn.midjourney.com/logo-square.png",
  "cursor.sh": "https://cursor.sh/apple-touch-icon.png",
  "supabase.com": "https://supabase.com/favicon/apple-touch-icon.png",
  "planetscale.com": "https://planetscale.com/favicon/apple-touch-icon.png",
  "neon.tech": "https://neon.tech/favicon/apple-touch-icon.png",
  "railway.app": "https://railway.app/apple-touch-icon.png",
  "render.com": "https://render.com/apple-touch-icon.png",
  "fly.io": "https://fly.io/static/images/brand/brandmark.png",
  "cloudflare.com": "https://www.cloudflare.com/favicon.ico",
  "retool.com": "https://retool.com/apple-touch-icon.png",
  "n8n.io": "https://n8n.io/favicon/apple-touch-icon.png",
  "make.com": "https://www.make.com/apple-touch-icon.png",
  "resend.com": "https://resend.com/static/apple-touch-icon.png",
  "plausible.io": "https://plausible.io/apple-touch-icon.png",
  "posthog.com": "https://posthog.com/images/favicon/apple-touch-icon.png",
  "descript.com": "https://www.descript.com/apple-touch-icon.png",
  "tally.so": "https://tally.so/apple-touch-icon.png",
  "typeform.com": "https://www.typeform.com/apple-touch-icon.png",
  "raycast.com": "https://raycast.com/apple-touch-icon.png",
  "arc.net": "https://arc.net/apple-touch-icon.png",
  "obsidian.md": "https://obsidian.md/images/obsidian-logo-512.png",
  "perplexity.ai": "https://www.perplexity.ai/apple-touch-icon.png",
  "grammarly.com": "https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/apple-touch-icon.png",
  "elevenlabs.io": "https://elevenlabs.io/apple-touch-icon.png",
  "prisma.io": "https://www.prisma.io/apple-touch-icon.png",
  "clerk.com": "https://clerk.com/apple-touch-icon.png",
  "auth0.com": "https://cdn.auth0.com/website/assets/pages/press/img/auth0-badge-7bfe51b174.png",
};

// Catégories principales
const categories = [
  { name: "Project Management", slug: "project-management", icon: "Kanban", description: "Tools for managing projects, tasks, and workflows" },
  { name: "Communication", slug: "communication", icon: "MessageSquare", description: "Team messaging and video conferencing tools" },
  { name: "Design", slug: "design", icon: "Palette", description: "Design, prototyping, and creative tools" },
  { name: "Developer Tools", slug: "developer-tools", icon: "Code", description: "Tools for software development and DevOps" },
  { name: "Productivity", slug: "productivity", icon: "Zap", description: "Personal and team productivity apps" },
  { name: "Marketing", slug: "marketing", icon: "Megaphone", description: "Marketing automation and analytics" },
  { name: "Sales", slug: "sales", icon: "TrendingUp", description: "CRM and sales enablement tools" },
  { name: "Finance", slug: "finance", icon: "DollarSign", description: "Accounting, payments, and financial tools" },
  { name: "HR & Recruiting", slug: "hr-recruiting", icon: "Users", description: "Human resources and talent management" },
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

// Tools mainstream avec données complètes - logos haute qualité carrés
const tools = [
  // === PRODUCTIVITY & NOTES ===
  {
    name: "Notion",
    slug: "notion",
    tagline: "The all-in-one workspace for notes, docs, and databases",
    description: `Notion is a connected workspace where better, faster work happens. It combines notes, docs, wikis, project management, and databases into one unified tool.

Key Features:
- Customizable databases with multiple views (table, board, timeline, calendar, gallery)
- Real-time collaboration with comments and mentions
- Template gallery with 1000+ ready-to-use templates
- AI assistant for writing, summarizing, and brainstorming
- Integrations with 50+ tools including Slack, Google Drive, Figma
- Offline mode and mobile apps
- Wiki functionality with nested pages
- Advanced permissions and sharing

Perfect for teams of all sizes, from startups to enterprises. Notion has become the go-to tool for knowledge management, project documentation, and team wikis.`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    website: "https://www.notion.so",
    pricing: "freemium",
    domain: "notion.so",
    categories: ["productivity", "project-management", "no-code"],
  },
  {
    name: "Slack",
    slug: "slack",
    tagline: "Where work happens - messaging for teams",
    description: `Slack is a channel-based messaging platform that brings team communication and collaboration into one place so you can get more work done.

Key Features:
- Organized conversations with channels (public and private)
- Direct messages and group messaging
- Huddles for quick audio/video conversations
- Slack Connect for external collaboration
- Powerful search across all messages and files
- 2,600+ app integrations
- Workflow Builder for automation
- Enterprise-grade security and compliance

Used by millions of teams worldwide, from small startups to Fortune 500 companies. Slack has transformed how teams communicate, reducing email overload and enabling async collaboration.`,
    logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
    website: "https://slack.com",
    pricing: "freemium",
    domain: "slack.com",
    categories: ["communication", "productivity"],
  },
  {
    name: "Figma",
    slug: "figma",
    tagline: "The collaborative interface design tool",
    description: `Figma is a cloud-based design platform for collaborative interface design. It enables teams to design, prototype, and gather feedback all in one place.

Key Features:
- Real-time multiplayer collaboration
- Vector networks for flexible design
- Auto layout for responsive designs
- Components and design systems
- Interactive prototyping
- Developer handoff with inspect mode
- FigJam for whiteboarding and brainstorming
- Community with free resources and plugins

Figma has revolutionized design workflows by enabling designers, developers, and stakeholders to work together seamlessly. It's the industry standard for UI/UX design.`,
    logo: "https://cdn.sanity.io/images/599r6htc/regionalized/46a76c802176eb17b04e12108571f3e0f2abad73-1080x1080.png",
    website: "https://www.figma.com",
    pricing: "freemium",
    domain: "figma.com",
    categories: ["design", "productivity"],
  },
  {
    name: "GitHub",
    slug: "github",
    tagline: "Where the world builds software",
    description: `GitHub is the world's leading software development platform. It provides hosting for software development version control using Git, plus access to powerful collaboration features.

Key Features:
- Git repository hosting with unlimited public/private repos
- Pull requests for code review
- GitHub Actions for CI/CD automation
- Issues and project boards for planning
- GitHub Copilot AI pair programmer
- Code security with Dependabot and secret scanning
- GitHub Pages for static site hosting
- Codespaces for cloud development environments

With over 100 million developers, GitHub is where open source thrives and where teams of all sizes collaborate on code. It's essential for modern software development.`,
    logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    website: "https://github.com",
    pricing: "freemium",
    domain: "github.com",
    categories: ["developer-tools", "productivity"],
  },
  {
    name: "Linear",
    slug: "linear",
    tagline: "The issue tracking tool you'll enjoy using",
    description: `Linear is a modern issue tracking and project management tool built for high-performance teams. It's designed for speed, with keyboard shortcuts and a streamlined interface.

Key Features:
- Blazingly fast performance and keyboard-first design
- Cycles for sprint planning
- Roadmaps for strategic planning
- GitHub and GitLab integration
- Automated workflows and triage
- Project templates
- Beautiful, minimal interface
- API-first architecture

Linear has become the preferred choice for startups and product teams who value speed and simplicity. It's what Jira should have been.`,
    logo: "https://linear.app/static/apple-touch-icon.png",
    website: "https://linear.app",
    pricing: "freemium",
    domain: "linear.app",
    categories: ["project-management", "developer-tools"],
  },
  {
    name: "Stripe",
    slug: "stripe",
    tagline: "Financial infrastructure for the internet",
    description: `Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.

Key Features:
- Accept payments in 135+ currencies
- Stripe Checkout for hosted payment pages
- Subscription billing with Stripe Billing
- Stripe Connect for marketplaces
- Stripe Atlas for company incorporation
- Radar for fraud prevention
- Financial reporting and analytics
- Tax automation with Stripe Tax

Stripe powers payments for millions of businesses worldwide, from startups to Fortune 500 companies. It's the gold standard for developer-friendly payment infrastructure.`,
    logo: "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
    website: "https://stripe.com",
    pricing: "paid",
    domain: "stripe.com",
    categories: ["finance", "developer-tools", "ecommerce"],
  },
  {
    name: "Vercel",
    slug: "vercel",
    tagline: "Develop. Preview. Ship.",
    description: `Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.

Key Features:
- Zero-config deployments from Git
- Automatic HTTPS and global CDN
- Preview deployments for every PR
- Serverless and Edge Functions
- Next.js official hosting (Vercel created Next.js)
- Analytics and Web Vitals monitoring
- DDoS mitigation and enterprise security
- Team collaboration features

Vercel has become the go-to platform for deploying modern web applications, especially those built with React and Next.js.`,
    logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    website: "https://vercel.com",
    pricing: "freemium",
    domain: "vercel.com",
    categories: ["developer-tools", "cloud-infrastructure"],
  },
  {
    name: "Airtable",
    slug: "airtable",
    tagline: "The platform to build next-gen apps",
    description: `Airtable is a low-code platform for building collaborative apps. It combines the familiarity of a spreadsheet with the power of a database.

Key Features:
- Flexible database with multiple views
- Rich field types (attachments, checkboxes, links)
- Automations for workflow automation
- Interface Designer for custom apps
- Sync with external data sources
- Extensions marketplace
- Real-time collaboration
- Enterprise-grade security

Airtable bridges the gap between spreadsheets and databases, enabling teams to build custom solutions without coding.`,
    logo: "https://airtable.com/images/favicon/baymax/apple-touch-icon.png",
    website: "https://airtable.com",
    pricing: "freemium",
    domain: "airtable.com",
    categories: ["no-code", "productivity", "project-management"],
  },
  {
    name: "Zoom",
    slug: "zoom",
    tagline: "One platform to connect",
    description: `Zoom is a communications platform that provides video conferencing, online meetings, chat, and mobile collaboration.

Key Features:
- HD video and audio conferencing
- Screen sharing and annotation
- Virtual backgrounds and filters
- Breakout rooms for group work
- Webinars for large-scale events
- Zoom Phone for VoIP
- Zoom Rooms for conference rooms
- End-to-end encryption

Zoom became synonymous with video meetings during the pandemic and remains the leading platform for virtual communication.`,
    logo: "https://st1.zoom.us/zoom.ico",
    website: "https://zoom.us",
    pricing: "freemium",
    domain: "zoom.us",
    categories: ["communication", "productivity"],
  },
  {
    name: "Asana",
    slug: "asana",
    tagline: "Manage your team's work, projects, & tasks online",
    description: `Asana is a work management platform that helps teams orchestrate their work, from daily tasks to strategic initiatives.

Key Features:
- Multiple project views (list, board, timeline, calendar)
- Task dependencies and milestones
- Portfolios for tracking multiple projects
- Workload management
- Goals for OKR tracking
- Rules for automation
- Forms for work requests
- 200+ integrations

Asana helps teams coordinate and manage their work, improving productivity and visibility across organizations.`,
    logo: "https://logo.clearbit.com/asana.com",
    website: "https://asana.com",
    pricing: "freemium",
    domain: "asana.com",
    categories: ["project-management", "productivity"],
  },
  {
    name: "Jira",
    slug: "jira",
    tagline: "The #1 software development tool used by agile teams",
    description: `Jira is Atlassian's project management tool designed for agile software development teams to plan, track, and release software.

Key Features:
- Scrum and Kanban boards
- Agile reporting (burndown, velocity)
- Customizable workflows
- Roadmaps for planning
- Advanced search with JQL
- Automation rules
- 3,000+ apps and integrations
- Enterprise-grade permissions

Jira is the industry standard for agile software development, used by teams of all sizes to manage their development workflow.`,
    logo: "https://logo.clearbit.com/atlassian.com",
    website: "https://www.atlassian.com/software/jira",
    pricing: "freemium",
    domain: "atlassian.com",
    categories: ["project-management", "developer-tools"],
  },
  {
    name: "Trello",
    slug: "trello",
    tagline: "Manage your team's projects from anywhere",
    description: `Trello is a visual collaboration tool that creates a shared perspective on any project. It uses boards, lists, and cards to organize work.

Key Features:
- Drag-and-drop Kanban boards
- Customizable cards with checklists, due dates, attachments
- Power-Ups for extended functionality
- Butler automation
- Multiple board views (table, calendar, timeline)
- Workspace templates
- Mobile apps for iOS and Android
- Free tier with unlimited cards

Trello's simplicity makes it perfect for personal task management and small team collaboration.`,
    logo: "https://logo.clearbit.com/trello.com",
    website: "https://trello.com",
    pricing: "freemium",
    domain: "trello.com",
    categories: ["project-management", "productivity"],
  },
  {
    name: "Miro",
    slug: "miro",
    tagline: "The visual collaboration platform",
    description: `Miro is an online collaborative whiteboard platform that enables distributed teams to work effectively together.

Key Features:
- Infinite canvas for brainstorming
- 1000+ templates for workshops and meetings
- Real-time collaboration with video chat
- Sticky notes, shapes, and drawing tools
- Mind mapping and flowcharts
- Integrations with 100+ tools
- Presentation mode
- Enterprise-grade security

Miro has become essential for remote teams doing design thinking, agile ceremonies, and strategic planning.`,
    logo: "https://logo.clearbit.com/miro.com",
    website: "https://miro.com",
    pricing: "freemium",
    domain: "miro.com",
    categories: ["design", "productivity", "communication"],
  },
  {
    name: "Loom",
    slug: "loom",
    tagline: "Video messaging for work",
    description: `Loom is a video messaging platform that helps you get your message across through instantly shareable videos.

Key Features:
- Screen and camera recording
- Instant sharing via link
- Viewer insights and engagement data
- Comments and reactions
- Auto-transcription and captions
- Drawing and editing tools
- Password protection
- Custom branding

Loom has transformed async communication, making it easy to explain complex ideas without scheduling meetings.`,
    logo: "https://logo.clearbit.com/loom.com",
    website: "https://www.loom.com",
    pricing: "freemium",
    domain: "loom.com",
    categories: ["communication", "video-media", "productivity"],
  },
  {
    name: "Canva",
    slug: "canva",
    tagline: "Design anything. Publish anywhere.",
    description: `Canva is a graphic design platform that allows users to create social media graphics, presentations, posters, and other visual content.

Key Features:
- Drag-and-drop editor
- 250,000+ free templates
- Brand Kit for brand consistency
- Background remover
- Video editing capabilities
- Print on demand
- Real-time collaboration
- Mobile apps

Canva democratized design, enabling anyone to create professional-looking graphics without design experience.`,
    logo: "https://logo.clearbit.com/canva.com",
    website: "https://www.canva.com",
    pricing: "freemium",
    domain: "canva.com",
    categories: ["design", "marketing", "video-media"],
  },
  {
    name: "HubSpot",
    slug: "hubspot",
    tagline: "Grow better with HubSpot",
    description: `HubSpot is a CRM platform with all the software, integrations, and resources you need to connect marketing, sales, content management, and customer service.

Key Features:
- Free CRM with contact management
- Marketing Hub for inbound marketing
- Sales Hub for sales automation
- Service Hub for customer service
- CMS Hub for website management
- Operations Hub for data sync
- Comprehensive reporting
- 1,000+ integrations

HubSpot pioneered inbound marketing and remains a leading platform for growing businesses.`,
    logo: "https://logo.clearbit.com/hubspot.com",
    website: "https://www.hubspot.com",
    pricing: "freemium",
    domain: "hubspot.com",
    categories: ["sales", "marketing", "customer-support"],
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    tagline: "The world's #1 CRM",
    description: `Salesforce is the world's leading cloud-based CRM platform, helping businesses connect with customers in a whole new way.

Key Features:
- Sales Cloud for sales automation
- Service Cloud for customer service
- Marketing Cloud for marketing automation
- Commerce Cloud for e-commerce
- Einstein AI for predictive insights
- AppExchange marketplace
- Custom app development with Lightning
- Industry-specific solutions

Salesforce is the enterprise standard for CRM, serving businesses of all sizes with its comprehensive platform.`,
    logo: "https://logo.clearbit.com/salesforce.com",
    website: "https://www.salesforce.com",
    pricing: "paid",
    domain: "salesforce.com",
    categories: ["sales", "marketing", "customer-support"],
  },
  {
    name: "Intercom",
    slug: "intercom",
    tagline: "The complete AI-first customer service platform",
    description: `Intercom is a customer messaging platform that enables businesses to communicate with prospective and existing customers within their app, on their website, through social media, or via email.

Key Features:
- Fin AI agent for automated support
- Live chat and messenger
- Inbox for team collaboration
- Product tours and tooltips
- Help center and knowledge base
- Outbound messaging
- Reporting and analytics
- Custom bots

Intercom has pioneered conversational customer engagement, helping businesses build better customer relationships.`,
    logo: "https://logo.clearbit.com/intercom.com",
    website: "https://www.intercom.com",
    pricing: "paid",
    domain: "intercom.com",
    categories: ["customer-support", "sales", "marketing"],
  },
  {
    name: "Mailchimp",
    slug: "mailchimp",
    tagline: "Turn emails into revenue",
    description: `Mailchimp is an all-in-one marketing platform that helps businesses manage and talk to their clients, customers, and other interested parties.

Key Features:
- Email marketing campaigns
- Marketing automation
- Landing pages and forms
- Audience segmentation
- A/B testing
- Analytics and reporting
- Customer journey builder
- 300+ integrations

Mailchimp is the world's leading email marketing platform, trusted by millions of businesses worldwide.`,
    logo: "https://logo.clearbit.com/mailchimp.com",
    website: "https://mailchimp.com",
    pricing: "freemium",
    domain: "mailchimp.com",
    categories: ["email", "marketing"],
  },
  {
    name: "Dropbox",
    slug: "dropbox",
    tagline: "Keep life organized and work moving",
    description: `Dropbox is a file hosting service that offers cloud storage, file synchronization, personal cloud, and client software.

Key Features:
- Cloud storage with automatic sync
- File sharing and collaboration
- Dropbox Paper for documents
- Dropbox Sign for e-signatures
- Smart Sync for storage management
- Version history and recovery
- Advanced security features
- Team management tools

Dropbox pioneered cloud storage and remains a popular choice for individuals and teams needing reliable file sync.`,
    logo: "https://logo.clearbit.com/dropbox.com",
    website: "https://www.dropbox.com",
    pricing: "freemium",
    domain: "dropbox.com",
    categories: ["productivity", "cloud-infrastructure"],
  },
  {
    name: "1Password",
    slug: "1password",
    tagline: "The world's most-loved password manager",
    description: `1Password is a password manager that provides a place for users to store various passwords, software licenses, and other sensitive information.

Key Features:
- Password vault with strong encryption
- Watchtower for security monitoring
- Travel Mode for border crossings
- Two-factor authentication
- Secure document storage
- Family and team sharing
- Browser extensions and apps
- Developer tools and CLI

1Password is trusted by millions of individuals and over 100,000 businesses to keep their sensitive data secure.`,
    logo: "https://logo.clearbit.com/1password.com",
    website: "https://1password.com",
    pricing: "paid",
    domain: "1password.com",
    categories: ["security", "productivity"],
  },
  {
    name: "Calendly",
    slug: "calendly",
    tagline: "Easy scheduling ahead",
    description: `Calendly is a scheduling automation platform that eliminates the back-and-forth emails to find the perfect meeting time.

Key Features:
- Customizable booking pages
- Calendar integration (Google, Outlook, iCloud)
- Team scheduling and round-robin
- Automated reminders and follow-ups
- Meeting polls
- Routing forms
- Integrations with Zoom, Salesforce, HubSpot
- Analytics and reporting

Calendly has transformed how professionals schedule meetings, saving time and reducing friction.`,
    logo: "https://logo.clearbit.com/calendly.com",
    website: "https://calendly.com",
    pricing: "freemium",
    domain: "calendly.com",
    categories: ["productivity", "sales"],
  },
  {
    name: "Monday.com",
    slug: "monday",
    tagline: "A platform built for a new way of working",
    description: `Monday.com is a Work OS that powers teams to run projects and workflows with confidence. It's a customizable platform that adapts to your needs.

Key Features:
- Customizable workflows and boards
- Multiple views (Kanban, Gantt, timeline)
- Automations and integrations
- Dashboards for insights
- Workdocs for collaboration
- Forms for data collection
- Time tracking
- Enterprise-grade security

Monday.com enables teams to build custom solutions without coding, improving collaboration and efficiency.`,
    logo: "https://logo.clearbit.com/monday.com",
    website: "https://monday.com",
    pricing: "paid",
    domain: "monday.com",
    categories: ["project-management", "productivity", "no-code"],
  },
  {
    name: "ClickUp",
    slug: "clickup",
    tagline: "One app to replace them all",
    description: `ClickUp is an all-in-one productivity platform that combines tasks, docs, goals, and chat in one place.

Key Features:
- Tasks with custom fields and statuses
- Docs and wikis
- Whiteboards for collaboration
- Goals and OKR tracking
- Time tracking built-in
- Mind maps and Gantt charts
- AI assistant
- 1,000+ integrations

ClickUp aims to consolidate multiple tools into one platform, reducing app switching and improving productivity.`,
    logo: "https://logo.clearbit.com/clickup.com",
    website: "https://clickup.com",
    pricing: "freemium",
    domain: "clickup.com",
    categories: ["project-management", "productivity"],
  },
  {
    name: "Zapier",
    slug: "zapier",
    tagline: "Automate your work across 6,000+ apps",
    description: `Zapier is an automation platform that connects your apps and automates workflows without coding.

Key Features:
- 6,000+ app integrations
- Multi-step Zaps
- Filters and conditional logic
- Formatter for data manipulation
- Tables for data storage
- Interfaces for forms
- Transfer for bulk data
- AI-powered automation builder

Zapier enables anyone to automate repetitive tasks, connecting the apps they use every day.`,
    logo: "https://logo.clearbit.com/zapier.com",
    website: "https://zapier.com",
    pricing: "freemium",
    domain: "zapier.com",
    categories: ["ai-automation", "productivity", "no-code"],
  },
  {
    name: "Webflow",
    slug: "webflow",
    tagline: "The site you want - without the dev time",
    description: `Webflow is a visual web development platform that empowers designers to build professional, custom websites without coding.

Key Features:
- Visual drag-and-drop builder
- Custom interactions and animations
- CMS for dynamic content
- E-commerce capabilities
- SEO tools built-in
- Hosting included
- Form handling
- Design system with symbols

Webflow bridges the gap between design and development, enabling designers to build production-ready websites.`,
    logo: "https://logo.clearbit.com/webflow.com",
    website: "https://webflow.com",
    pricing: "freemium",
    domain: "webflow.com",
    categories: ["no-code", "design", "ecommerce"],
  },
  {
    name: "Framer",
    slug: "framer",
    tagline: "Start your dream site with AI",
    description: `Framer is a web design and publishing platform that combines visual design with the power of code components.

Key Features:
- AI website generation
- Visual canvas editor
- Code components (React)
- CMS for blogs and content
- Built-in hosting
- Responsive design tools
- Animations and interactions
- Localization support

Framer has evolved from a prototyping tool to a full website builder, popular among designers.`,
    logo: "https://logo.clearbit.com/framer.com",
    website: "https://www.framer.com",
    pricing: "freemium",
    domain: "framer.com",
    categories: ["no-code", "design"],
  },
  {
    name: "VS Code",
    slug: "vs-code",
    tagline: "Code editing. Redefined.",
    description: `Visual Studio Code is a lightweight but powerful source code editor that runs on your desktop. It comes with built-in support for JavaScript, TypeScript, and Node.js.

Key Features:
- IntelliSense for smart completions
- Debugging built-in
- Git integration
- Extensions marketplace with 30,000+ extensions
- Integrated terminal
- Remote development
- GitHub Copilot integration
- Customizable themes and settings

VS Code has become the most popular code editor among developers, praised for its speed and extensibility.`,
    logo: "https://logo.clearbit.com/visualstudio.com",
    website: "https://code.visualstudio.com",
    pricing: "free",
    domain: "visualstudio.com",
    categories: ["developer-tools"],
  },
  {
    name: "Postman",
    slug: "postman",
    tagline: "The collaboration platform for API development",
    description: `Postman is an API platform for building and using APIs. It simplifies each step of the API lifecycle and streamlines collaboration.

Key Features:
- API client for testing
- Collections for organizing requests
- Environment variables
- Mock servers
- Documentation generation
- Automated testing
- Monitors for uptime
- Team collaboration

Postman is essential for API development, used by millions of developers to design, test, and document APIs.`,
    logo: "https://logo.clearbit.com/postman.com",
    website: "https://www.postman.com",
    pricing: "freemium",
    domain: "postman.com",
    categories: ["developer-tools"],
  },
  {
    name: "Docker",
    slug: "docker",
    tagline: "Develop faster. Run anywhere.",
    description: `Docker is a platform for developing, shipping, and running applications in containers. It enables separation of applications from infrastructure.

Key Features:
- Containerization technology
- Docker Hub for image registry
- Docker Compose for multi-container apps
- Docker Desktop for local development
- Docker Scout for security
- Build cloud for faster builds
- Testcontainers for testing
- Enterprise features

Docker revolutionized software deployment with containerization, becoming essential for modern DevOps.`,
    logo: "https://logo.clearbit.com/docker.com",
    website: "https://www.docker.com",
    pricing: "freemium",
    domain: "docker.com",
    categories: ["developer-tools", "cloud-infrastructure"],
  },
  {
    name: "AWS",
    slug: "aws",
    tagline: "The world's most comprehensive cloud platform",
    description: `Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services. It provides over 200 fully featured services from data centers globally.

Key Features:
- Compute (EC2, Lambda, ECS)
- Storage (S3, EBS, Glacier)
- Databases (RDS, DynamoDB, Aurora)
- Machine Learning (SageMaker, Rekognition)
- Analytics (Redshift, Athena)
- Security and compliance
- Global infrastructure
- Pay-as-you-go pricing

AWS is the leading cloud platform, serving millions of customers from startups to Fortune 500 companies.`,
    logo: "https://logo.clearbit.com/aws.amazon.com",
    website: "https://aws.amazon.com",
    pricing: "paid",
    domain: "aws.amazon.com",
    categories: ["cloud-infrastructure", "developer-tools"],
  },
  {
    name: "Google Cloud",
    slug: "google-cloud",
    tagline: "Build what's next",
    description: `Google Cloud Platform is a suite of cloud computing services that runs on the same infrastructure Google uses internally.

Key Features:
- Compute Engine for VMs
- Cloud Functions for serverless
- BigQuery for data analytics
- Vertex AI for machine learning
- Cloud Storage
- Kubernetes Engine (GKE)
- Cloud CDN
- Security and compliance

Google Cloud is known for its data analytics, ML capabilities, and the infrastructure behind Google's own products.`,
    logo: "https://logo.clearbit.com/cloud.google.com",
    website: "https://cloud.google.com",
    pricing: "paid",
    domain: "cloud.google.com",
    categories: ["cloud-infrastructure", "ai-automation", "analytics"],
  },
  {
    name: "Shopify",
    slug: "shopify",
    tagline: "Making commerce better for everyone",
    description: `Shopify is a complete commerce platform that lets you start, grow, and manage a business. It powers millions of businesses worldwide.

Key Features:
- Online store builder
- Point of sale (POS)
- Payment processing
- Inventory management
- Shipping and fulfillment
- Marketing tools
- App store with 8,000+ apps
- Shopify Capital for funding

Shopify has democratized e-commerce, enabling anyone to start an online business with minimal technical knowledge.`,
    logo: "https://logo.clearbit.com/shopify.com",
    website: "https://www.shopify.com",
    pricing: "paid",
    domain: "shopify.com",
    categories: ["ecommerce", "marketing"],
  },
  {
    name: "Twilio",
    slug: "twilio",
    tagline: "Build personalized customer experiences",
    description: `Twilio is a cloud communications platform that enables developers to programmatically make and receive phone calls, send and receive text messages, and perform other communication functions.

Key Features:
- SMS and MMS messaging
- Voice calls and IVR
- Video (Twilio Video)
- Email (SendGrid)
- WhatsApp Business API
- Verify for authentication
- Segment for customer data
- AI assistants

Twilio powers communications for millions of businesses, from startups to enterprises.`,
    logo: "https://logo.clearbit.com/twilio.com",
    website: "https://www.twilio.com",
    pricing: "paid",
    domain: "twilio.com",
    categories: ["developer-tools", "communication"],
  },
  {
    name: "Datadog",
    slug: "datadog",
    tagline: "See inside any stack, any app, at any scale, anywhere",
    description: `Datadog is a monitoring and security platform for cloud applications. It brings together end-to-end traces, metrics, and logs to make applications observable.

Key Features:
- Infrastructure monitoring
- APM and distributed tracing
- Log management
- Real user monitoring
- Synthetic monitoring
- Security monitoring
- CI visibility
- 600+ integrations

Datadog is essential for DevOps teams managing complex cloud infrastructure and microservices.`,
    logo: "https://logo.clearbit.com/datadoghq.com",
    website: "https://www.datadoghq.com",
    pricing: "paid",
    domain: "datadoghq.com",
    categories: ["developer-tools", "analytics", "security"],
  },
  {
    name: "Sentry",
    slug: "sentry",
    tagline: "Application monitoring for every developer",
    description: `Sentry is an application monitoring platform that helps developers identify and fix crashes in real time.

Key Features:
- Error tracking and alerting
- Performance monitoring
- Release health tracking
- Session replay
- Profiling
- Cron monitoring
- Code coverage
- 100+ integrations

Sentry is trusted by millions of developers to catch bugs before users do and to debug faster.`,
    logo: "https://logo.clearbit.com/sentry.io",
    website: "https://sentry.io",
    pricing: "freemium",
    domain: "sentry.io",
    categories: ["developer-tools", "analytics"],
  },
  {
    name: "Amplitude",
    slug: "amplitude",
    tagline: "The digital analytics platform",
    description: `Amplitude is a product analytics platform that helps teams understand user behavior, ship better experiences, and retain customers.

Key Features:
- Event tracking and analytics
- User behavior analysis
- Funnel and retention analysis
- Cohort analysis
- A/B testing
- Customer data platform
- AI-powered insights
- Real-time analytics

Amplitude powers product decisions for thousands of companies, from startups to Fortune 500.`,
    logo: "https://logo.clearbit.com/amplitude.com",
    website: "https://amplitude.com",
    pricing: "freemium",
    domain: "amplitude.com",
    categories: ["analytics", "marketing"],
  },
  {
    name: "Mixpanel",
    slug: "mixpanel",
    tagline: "Powerful, self-serve product analytics",
    description: `Mixpanel is a product analytics tool that enables teams to measure what matters, make decisions fast, and build better products.

Key Features:
- Event-based analytics
- Funnels and flows
- Retention analysis
- User segmentation
- A/B testing
- Data governance
- Real-time insights
- Integrations ecosystem

Mixpanel helps teams understand how users interact with their products and make data-driven decisions.`,
    logo: "https://logo.clearbit.com/mixpanel.com",
    website: "https://mixpanel.com",
    pricing: "freemium",
    domain: "mixpanel.com",
    categories: ["analytics", "marketing"],
  },
  {
    name: "Hotjar",
    slug: "hotjar",
    tagline: "Understand how users behave on your site",
    description: `Hotjar is a behavior analytics service that helps you understand what users want, care about, and do on your site.

Key Features:
- Heatmaps for click/scroll/move
- Session recordings
- Surveys and feedback
- User interviews
- Funnels
- Form analytics
- Feedback widgets
- AI summaries

Hotjar provides visual insights into user behavior, helping teams improve UX and conversion rates.`,
    logo: "https://logo.clearbit.com/hotjar.com",
    website: "https://www.hotjar.com",
    pricing: "freemium",
    domain: "hotjar.com",
    categories: ["analytics", "marketing"],
  },
  {
    name: "Segment",
    slug: "segment",
    tagline: "The leading customer data platform",
    description: `Segment is a customer data platform that collects, cleans, and controls customer data, routing it to hundreds of tools.

Key Features:
- Data collection from any source
- Identity resolution
- Data warehouse integration
- Real-time personalization
- Privacy and compliance
- 400+ integrations
- Functions for custom logic
- Protocols for data quality

Segment is the infrastructure for customer data, enabling teams to unify data across tools and teams.`,
    logo: "https://logo.clearbit.com/segment.com",
    website: "https://segment.com",
    pricing: "freemium",
    domain: "segment.com",
    categories: ["analytics", "data-databases", "marketing"],
  },
  {
    name: "Zendesk",
    slug: "zendesk",
    tagline: "Champions of customer service",
    description: `Zendesk is a customer service software company that develops cloud-based customer support, sales, and customer engagement platform.

Key Features:
- Ticketing system
- Help center and knowledge base
- Live chat and messaging
- AI-powered bots
- Omnichannel support
- Analytics and reporting
- Workforce management
- 1,200+ integrations

Zendesk powers customer service for over 100,000 brands worldwide.`,
    logo: "https://logo.clearbit.com/zendesk.com",
    website: "https://www.zendesk.com",
    pricing: "paid",
    domain: "zendesk.com",
    categories: ["customer-support", "sales"],
  },
  {
    name: "Freshdesk",
    slug: "freshdesk",
    tagline: "Delight your customers with effortless service",
    description: `Freshdesk is a cloud-based customer support software that provides businesses with the tools to support customers.

Key Features:
- Ticketing and SLA management
- Knowledge base
- Chatbot and messaging
- Team collaboration
- Automations
- Reporting and analytics
- Marketplace with apps
- Multi-channel support

Freshdesk offers affordable customer service software with a focus on ease of use.`,
    logo: "https://logo.clearbit.com/freshdesk.com",
    website: "https://www.freshdesk.com",
    pricing: "freemium",
    domain: "freshdesk.com",
    categories: ["customer-support"],
  },
  {
    name: "Crisp",
    slug: "crisp",
    tagline: "Give your customer experience a human touch",
    description: `Crisp is an all-in-one business messaging platform that gathers teams, conversations, data and knowledge around one place.

Key Features:
- Live chat widget
- Shared inbox
- Chatbot builder
- CRM integration
- Knowledge base
- Campaigns and triggers
- Video calls
- Mobile apps

Crisp provides an affordable alternative to enterprise customer messaging platforms.`,
    logo: "https://logo.clearbit.com/crisp.chat",
    website: "https://crisp.chat",
    pricing: "freemium",
    domain: "crisp.chat",
    categories: ["customer-support", "communication"],
  },
  {
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI-powered writing and brainstorming in Notion",
    description: `Notion AI is an integrated AI assistant within Notion that helps with writing, editing, summarizing, and brainstorming.

Key Features:
- Writing assistance and generation
- Summarization of documents
- Translation to multiple languages
- Brainstorming and ideation
- Action items extraction
- Q&A about your workspace
- Custom AI prompts
- Seamless integration with Notion

Notion AI brings the power of GPT directly into your workspace, enhancing productivity.`,
    logo: "https://logo.clearbit.com/notion.so",
    website: "https://www.notion.so/product/ai",
    pricing: "paid",
    domain: "notion.so",
    categories: ["ai-automation", "writing-content", "productivity"],
  },
  {
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "Get instant answers, find inspiration, learn something new",
    description: `ChatGPT is an AI chatbot developed by OpenAI that can have natural conversations, answer questions, and help with various tasks.

Key Features:
- Natural language conversation
- Code generation and debugging
- Writing assistance
- Data analysis
- Image generation (DALL-E)
- Custom GPTs
- API access
- Enterprise features

ChatGPT has revolutionized how people interact with AI, becoming one of the fastest-growing apps in history.`,
    logo: "https://logo.clearbit.com/openai.com",
    website: "https://chat.openai.com",
    pricing: "freemium",
    domain: "openai.com",
    categories: ["ai-automation", "writing-content", "developer-tools"],
  },
  {
    name: "Claude",
    slug: "claude",
    tagline: "AI assistant by Anthropic",
    description: `Claude is an AI assistant created by Anthropic that's helpful, harmless, and honest. It excels at analysis, coding, and nuanced conversations.

Key Features:
- Long context understanding (200K tokens)
- Advanced reasoning and analysis
- Code generation and review
- Document analysis
- Creative writing
- API access
- Enterprise features
- Safety-focused design

Claude is known for its thoughtful, nuanced responses and strong performance on complex tasks.`,
    logo: "https://logo.clearbit.com/anthropic.com",
    website: "https://claude.ai",
    pricing: "freemium",
    domain: "anthropic.com",
    categories: ["ai-automation", "writing-content", "developer-tools"],
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    tagline: "An independent research lab exploring new mediums of thought",
    description: `Midjourney is an AI image generation tool that creates images from textual descriptions, known for its artistic and high-quality outputs.

Key Features:
- Text-to-image generation
- High-resolution outputs
- Style control and customization
- Remix and variation features
- Upscaling
- Community gallery
- Discord-based interface
- Commercial usage rights

Midjourney has become the go-to tool for creating stunning AI-generated art and imagery.`,
    logo: "https://logo.clearbit.com/midjourney.com",
    website: "https://www.midjourney.com",
    pricing: "paid",
    domain: "midjourney.com",
    categories: ["ai-automation", "design"],
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "The AI-first code editor",
    description: `Cursor is an AI-powered code editor built for pair programming with AI. It's a fork of VS Code with deep AI integration.

Key Features:
- AI chat and editing in the editor
- Codebase-aware AI
- Tab completion with AI
- Multi-file editing
- Terminal integration
- Privacy mode
- VS Code compatibility
- Custom AI models

Cursor represents the future of coding, where AI is a natural part of the development workflow.`,
    logo: "https://logo.clearbit.com/cursor.com",
    website: "https://cursor.sh",
    pricing: "freemium",
    domain: "cursor.sh",
    categories: ["developer-tools", "ai-automation"],
  },
  {
    name: "Supabase",
    slug: "supabase",
    tagline: "The open source Firebase alternative",
    description: `Supabase is an open source Firebase alternative that provides a suite of tools for building applications with a Postgres database at its core.

Key Features:
- PostgreSQL database
- Real-time subscriptions
- Authentication and authorization
- Storage for files
- Edge Functions
- Vector embeddings
- Auto-generated APIs
- Dashboard and SQL editor

Supabase has become the go-to backend for developers who want the simplicity of Firebase with the power of Postgres.`,
    logo: "https://logo.clearbit.com/supabase.com",
    website: "https://supabase.com",
    pricing: "freemium",
    domain: "supabase.com",
    categories: ["developer-tools", "data-databases", "cloud-infrastructure"],
  },
  {
    name: "PlanetScale",
    slug: "planetscale",
    tagline: "The database for developers",
    description: `PlanetScale is a MySQL-compatible serverless database platform built on Vitess, the same technology that powers YouTube.

Key Features:
- Serverless scaling
- Branching for database changes
- Non-blocking schema changes
- Automatic backups
- Connection pooling
- Insights and analytics
- GitHub integration
- CLI and dashboard

PlanetScale brings modern developer workflows to databases, making it easier to iterate and scale.`,
    logo: "https://logo.clearbit.com/planetscale.com",
    website: "https://planetscale.com",
    pricing: "freemium",
    domain: "planetscale.com",
    categories: ["data-databases", "developer-tools"],
  },
  {
    name: "Neon",
    slug: "neon",
    tagline: "Serverless Postgres built for the cloud",
    description: `Neon is a fully managed serverless PostgreSQL with generous free tier. It separates storage and compute for instant scaling.

Key Features:
- Serverless PostgreSQL
- Branching for development
- Autoscaling to zero
- Instant database creation
- Read replicas
- Connection pooling
- Point-in-time recovery
- Generous free tier

Neon is ideal for modern applications that need PostgreSQL with serverless scalability.`,
    logo: "https://logo.clearbit.com/neon.tech",
    website: "https://neon.tech",
    pricing: "freemium",
    domain: "neon.tech",
    categories: ["data-databases", "developer-tools", "cloud-infrastructure"],
  },
  {
    name: "Railway",
    slug: "railway",
    tagline: "Infrastructure made simple",
    description: `Railway is an infrastructure platform that makes it easy to deploy and manage apps, databases, and more.

Key Features:
- One-click deployments
- Automatic builds from GitHub
- Database provisioning
- Environment management
- Team collaboration
- Usage-based pricing
- Private networking
- CLI and dashboard

Railway simplifies infrastructure for developers who want to focus on building, not managing servers.`,
    logo: "https://logo.clearbit.com/railway.app",
    website: "https://railway.app",
    pricing: "freemium",
    domain: "railway.app",
    categories: ["cloud-infrastructure", "developer-tools"],
  },
  {
    name: "Render",
    slug: "render",
    tagline: "Your fastest path to production",
    description: `Render is a unified cloud to build and run all your apps and websites with free SSL, a global CDN, private networks, and auto deploys from Git.

Key Features:
- Web services and static sites
- PostgreSQL and Redis databases
- Background workers
- Cron jobs
- Private services
- Auto-deploys from Git
- Preview environments
- Infrastructure as code

Render is a modern alternative to Heroku, offering simplicity with more flexibility.`,
    logo: "https://logo.clearbit.com/render.com",
    website: "https://render.com",
    pricing: "freemium",
    domain: "render.com",
    categories: ["cloud-infrastructure", "developer-tools"],
  },
  {
    name: "Fly.io",
    slug: "fly-io",
    tagline: "Run your apps close to users",
    description: `Fly.io is a platform for running full stack apps and databases close to your users. Deploy anywhere without ops.

Key Features:
- Global deployment
- Full-stack app hosting
- Postgres and Redis
- Auto-scaling
- Private networking
- GPUs available
- CLI-first experience
- Pay for what you use

Fly.io excels at edge deployment, running your apps close to users worldwide.`,
    logo: "https://logo.clearbit.com/fly.io",
    website: "https://fly.io",
    pricing: "freemium",
    domain: "fly.io",
    categories: ["cloud-infrastructure", "developer-tools"],
  },
  {
    name: "Cloudflare",
    slug: "cloudflare",
    tagline: "Build your next big idea on Cloudflare",
    description: `Cloudflare is a global network built for the cloud. It provides CDN, DDoS protection, security, and edge computing services.

Key Features:
- Global CDN
- DDoS protection
- Web Application Firewall
- Workers for edge computing
- R2 object storage
- D1 SQL database
- DNS management
- Zero Trust security

Cloudflare powers and protects millions of websites, becoming essential infrastructure for the internet.`,
    logo: "https://logo.clearbit.com/cloudflare.com",
    website: "https://www.cloudflare.com",
    pricing: "freemium",
    domain: "cloudflare.com",
    categories: ["cloud-infrastructure", "security", "developer-tools"],
  },
  {
    name: "Retool",
    slug: "retool",
    tagline: "The fastest way to build internal tools",
    description: `Retool is a fast way to build internal tools. Drag and drop from 100+ building blocks, connect to databases and APIs.

Key Features:
- Drag-and-drop builder
- Database and API connectors
- Custom components
- Role-based access control
- Audit logs
- Git version control
- Mobile apps
- Self-hosted option

Retool enables teams to build custom internal tools in hours instead of weeks.`,
    logo: "https://logo.clearbit.com/retool.com",
    website: "https://retool.com",
    pricing: "freemium",
    domain: "retool.com",
    categories: ["no-code", "developer-tools"],
  },
  {
    name: "n8n",
    slug: "n8n",
    tagline: "Workflow automation for technical people",
    description: `n8n is an extendable workflow automation tool that enables you to connect anything to everything via its open, fair-code model.

Key Features:
- Visual workflow builder
- 400+ integrations
- Custom code nodes
- Self-hostable
- Fair-code licensed
- AI capabilities
- Error handling
- Active community

n8n offers the flexibility of code with the speed of no-code, ideal for technical teams.`,
    logo: "https://logo.clearbit.com/n8n.io",
    website: "https://n8n.io",
    pricing: "freemium",
    domain: "n8n.io",
    categories: ["ai-automation", "no-code", "developer-tools"],
  },
  {
    name: "Make",
    slug: "make",
    tagline: "From tasks and workflows to apps and systems",
    description: `Make (formerly Integromat) is a visual platform for building and automating workflows. Create complex integrations without coding.

Key Features:
- Visual scenario builder
- 1,500+ app integrations
- Data manipulation tools
- Scheduling and triggers
- Error handling
- Team collaboration
- Templates library
- API access

Make offers powerful automation with a visual interface that handles complex logic.`,
    logo: "https://logo.clearbit.com/make.com",
    website: "https://www.make.com",
    pricing: "freemium",
    domain: "make.com",
    categories: ["ai-automation", "no-code"],
  },
  {
    name: "Resend",
    slug: "resend",
    tagline: "Email for developers",
    description: `Resend is the email API for developers. It provides a modern email sending solution with great developer experience.

Key Features:
- Simple REST API
- React Email templates
- Webhooks for events
- Analytics and logs
- Domain authentication
- Team collaboration
- SDKs for popular languages
- Generous free tier

Resend focuses on developer experience, making it easy to send transactional emails.`,
    logo: "https://logo.clearbit.com/resend.com",
    website: "https://resend.com",
    pricing: "freemium",
    domain: "resend.com",
    categories: ["developer-tools", "email"],
  },
  {
    name: "Loops",
    slug: "loops",
    tagline: "Email for modern SaaS",
    description: `Loops is an email platform built for SaaS companies. Send marketing and transactional emails from one place.

Key Features:
- Visual email editor
- Audience segmentation
- Automated sequences
- Transactional emails
- A/B testing
- Analytics dashboard
- API and webhooks
- Integrations

Loops combines marketing and transactional email in a modern, SaaS-focused platform.`,
    logo: "https://logo.clearbit.com/loops.so",
    website: "https://loops.so",
    pricing: "freemium",
    domain: "loops.so",
    categories: ["email", "marketing"],
  },
  {
    name: "Plausible",
    slug: "plausible",
    tagline: "Simple and privacy-friendly Google Analytics alternative",
    description: `Plausible is a lightweight and open source web analytics tool. No cookies and fully compliant with GDPR, CCPA, and PECR.

Key Features:
- Privacy-first analytics
- No cookies required
- Simple dashboard
- Lightweight script (<1KB)
- Open source
- EU-hosted option
- Goal tracking
- API access

Plausible offers ethical analytics that respects user privacy while providing useful insights.`,
    logo: "https://logo.clearbit.com/plausible.io",
    website: "https://plausible.io",
    pricing: "paid",
    domain: "plausible.io",
    categories: ["analytics", "marketing"],
  },
  {
    name: "PostHog",
    slug: "posthog",
    tagline: "The open source product analytics suite",
    description: `PostHog is an open source product analytics platform. It provides everything you need to understand user behavior in one place.

Key Features:
- Product analytics
- Session recordings
- Feature flags
- A/B testing
- Surveys
- Data warehouse
- Self-hostable
- EU and US hosting

PostHog is ideal for teams who want comprehensive product analytics with the option to self-host.`,
    logo: "https://logo.clearbit.com/posthog.com",
    website: "https://posthog.com",
    pricing: "freemium",
    domain: "posthog.com",
    categories: ["analytics", "developer-tools"],
  },
  {
    name: "Descript",
    slug: "descript",
    tagline: "There's a new way to make video and podcasts",
    description: `Descript is an all-in-one video and podcast editor that makes editing as easy as editing a document.

Key Features:
- Edit by editing transcript
- AI voice cloning (Overdub)
- Screen recording
- Filler word removal
- Studio Sound enhancement
- Automatic transcription
- Collaboration features
- Publishing integrations

Descript has revolutionized video editing with its text-based editing approach.`,
    logo: "https://logo.clearbit.com/descript.com",
    website: "https://www.descript.com",
    pricing: "freemium",
    domain: "descript.com",
    categories: ["video-media", "ai-automation"],
  },
  {
    name: "Riverside",
    slug: "riverside",
    tagline: "Record podcasts and videos like a pro",
    description: `Riverside is a recording platform for podcasts and videos. It records locally for high quality and uploads in the background.

Key Features:
- High-quality local recording
- Separate audio/video tracks
- Live streaming
- Transcription
- Magic Clips AI
- Screen sharing
- Virtual greenroom
- Mobile apps

Riverside is the professional choice for remote podcast and video recording.`,
    logo: "https://logo.clearbit.com/riverside.fm",
    website: "https://riverside.fm",
    pricing: "freemium",
    domain: "riverside.fm",
    categories: ["video-media", "ai-automation"],
  },
  {
    name: "Tally",
    slug: "tally",
    tagline: "The simplest way to create forms",
    description: `Tally is a free form builder that works like a doc. Create forms for all purposes without limits.

Key Features:
- Form builder that works like Notion
- Unlimited forms and submissions (free)
- Conditional logic
- File uploads
- Payment collection
- Notion integration
- Custom domains
- Embeddable

Tally offers a generous free tier and intuitive editing experience for form creation.`,
    logo: "https://logo.clearbit.com/tally.so",
    website: "https://tally.so",
    pricing: "freemium",
    domain: "tally.so",
    categories: ["no-code", "productivity"],
  },
  {
    name: "Typeform",
    slug: "typeform",
    tagline: "People-friendly forms and surveys",
    description: `Typeform makes collecting and sharing information comfortable and conversational. It's a web-based platform for creating forms without code.

Key Features:
- One question at a time interface
- Beautiful design templates
- Logic jumps and branching
- Video interactions
- Payment collection
- Integrations with 500+ apps
- Analytics and insights
- API access

Typeform pioneered conversational forms, creating engaging experiences for respondents.`,
    logo: "https://logo.clearbit.com/typeform.com",
    website: "https://www.typeform.com",
    pricing: "freemium",
    domain: "typeform.com",
    categories: ["no-code", "marketing"],
  },
  {
    name: "Lemlist",
    slug: "lemlist",
    tagline: "The cold outreach platform that gets replies",
    description: `Lemlist is a cold email outreach platform that helps sales teams personalize at scale and get more replies.

Key Features:
- Email personalization
- Automated sequences
- LinkedIn integration
- AI copywriting
- Deliverability tools
- A/B testing
- CRM integrations
- Analytics

Lemlist focuses on deliverability and personalization to improve cold email success rates.`,
    logo: "https://logo.clearbit.com/lemlist.com",
    website: "https://www.lemlist.com",
    pricing: "paid",
    domain: "lemlist.com",
    categories: ["sales", "email", "marketing"],
  },
  {
    name: "Apollo",
    slug: "apollo",
    tagline: "Sales intelligence and engagement platform",
    description: `Apollo.io is a sales intelligence platform that helps you find, contact, and close your ideal buyers.

Key Features:
- B2B database with 275M+ contacts
- Email finder and verifier
- Sequences for outreach
- Dialer and meeting scheduler
- Chrome extension
- CRM enrichment
- Intent data
- Analytics

Apollo combines a massive B2B database with sales engagement tools in one platform.`,
    logo: "https://logo.clearbit.com/apollo.io",
    website: "https://www.apollo.io",
    pricing: "freemium",
    domain: "apollo.io",
    categories: ["sales", "marketing"],
  },
  {
    name: "Gumroad",
    slug: "gumroad",
    tagline: "Go from zero to $1 with Gumroad",
    description: `Gumroad is an e-commerce platform that allows creators to sell products directly to consumers.

Key Features:
- Digital product sales
- Subscription products
- Membership sites
- Affiliate program
- Email marketing
- Discount codes
- Analytics
- Audience building

Gumroad has helped creators earn over $1 billion selling digital products and memberships.`,
    logo: "https://logo.clearbit.com/gumroad.com",
    website: "https://gumroad.com",
    pricing: "freemium",
    domain: "gumroad.com",
    categories: ["ecommerce", "marketing"],
  },
  {
    name: "Lemon Squeezy",
    slug: "lemon-squeezy",
    tagline: "Payments, tax & subscriptions for software companies",
    description: `Lemon Squeezy is a merchant of record platform that handles payments, tax, and subscriptions for software companies.

Key Features:
- Global payments
- Sales tax handling (MoR)
- Subscription management
- License key generation
- Checkout customization
- Affiliate program
- Webhooks and API
- Dashboard and analytics

Lemon Squeezy simplifies selling software globally by handling tax compliance as merchant of record.`,
    logo: "https://logo.clearbit.com/lemonsqueezy.com",
    website: "https://www.lemonsqueezy.com",
    pricing: "paid",
    domain: "lemonsqueezy.com",
    categories: ["ecommerce", "finance"],
  },
  {
    name: "Paddle",
    slug: "paddle",
    tagline: "The complete payments, tax, and subscriptions solution for SaaS",
    description: `Paddle is a payment infrastructure provider for SaaS companies. As a merchant of record, they handle payments, tax, and compliance.

Key Features:
- Global payment processing
- Automatic sales tax (MoR)
- Subscription management
- Checkout experience
- Revenue recovery
- ProfitWell metrics
- Localized pricing
- Enterprise features

Paddle enables SaaS companies to sell globally without worrying about payment complexity.`,
    logo: "https://logo.clearbit.com/paddle.com",
    website: "https://www.paddle.com",
    pricing: "paid",
    domain: "paddle.com",
    categories: ["finance", "ecommerce"],
  },
  {
    name: "Raycast",
    slug: "raycast",
    tagline: "Your shortcut to everything",
    description: `Raycast is a blazingly fast, totally extendable launcher for macOS. It lets you complete tasks, calculate, share snippets, and much more.

Key Features:
- Spotlight replacement
- Extensions marketplace
- Clipboard history
- Snippets
- Window management
- AI assistant
- Script commands
- Team sharing

Raycast has become essential for Mac power users, replacing Spotlight with a much more capable launcher.`,
    logo: "https://logo.clearbit.com/raycast.com",
    website: "https://www.raycast.com",
    pricing: "freemium",
    domain: "raycast.com",
    categories: ["productivity", "developer-tools"],
  },
  {
    name: "Arc",
    slug: "arc",
    tagline: "A better way to use the internet",
    description: `Arc is a browser built for the way we use the internet in 2024, with built-in organization and new ways to interact with websites.

Key Features:
- Vertical tabs with spaces
- Split view
- Boosts for customizing sites
- Air Traffic Control for links
- Notes and easels
- Automatic archiving
- Profile separation
- Beautiful design

Arc reimagines what a browser can be, focusing on organization and reducing tab chaos.`,
    logo: "https://logo.clearbit.com/arc.net",
    website: "https://arc.net",
    pricing: "free",
    domain: "arc.net",
    categories: ["productivity"],
  },
  {
    name: "Obsidian",
    slug: "obsidian",
    tagline: "Sharpen your thinking",
    description: `Obsidian is a powerful and extensible knowledge base that works on top of your local folder of plain text Markdown files.

Key Features:
- Local-first markdown files
- Bidirectional linking
- Graph view of connections
- Community plugins (1000+)
- Canvas for visual thinking
- Sync service (optional)
- Publish to web (optional)
- Works offline

Obsidian is beloved by knowledge workers for its flexibility, privacy, and powerful linking capabilities.`,
    logo: "https://logo.clearbit.com/obsidian.md",
    website: "https://obsidian.md",
    pricing: "freemium",
    domain: "obsidian.md",
    categories: ["productivity", "writing-content"],
  },
  {
    name: "Cron",
    slug: "cron",
    tagline: "The next-generation calendar for professionals",
    description: `Cron is a calendar application with modern scheduling features, keyboard shortcuts, and cross-platform support. Now part of Notion.

Key Features:
- Multiple calendar integration
- Scheduling links
- Keyboard shortcuts
- Team scheduling
- Time zone support
- Menu bar quick access
- Notion integration
- Beautiful design

Cron brings modern productivity features to calendar management, now integrated with Notion.`,
    logo: "https://logo.clearbit.com/cron.com",
    website: "https://cron.com",
    pricing: "free",
    domain: "cron.com",
    categories: ["productivity"],
  },
  {
    name: "Superhuman",
    slug: "superhuman",
    tagline: "The fastest email experience ever made",
    description: `Superhuman is a premium email client rebuilt for speed. It's designed to help you get through your inbox twice as fast.

Key Features:
- Blazingly fast performance
- Keyboard shortcuts
- AI triage and writing
- Split inbox
- Scheduled send
- Read receipts
- Snippets
- Team features

Superhuman is for email power users who want the fastest possible email experience.`,
    logo: "https://logo.clearbit.com/superhuman.com",
    website: "https://superhuman.com",
    pricing: "paid",
    domain: "superhuman.com",
    categories: ["email", "productivity"],
  },
  {
    name: "Perplexity",
    slug: "perplexity",
    tagline: "Where knowledge begins",
    description: `Perplexity is an AI-powered search engine that provides direct answers to questions with cited sources.

Key Features:
- AI-powered search
- Source citations
- Follow-up questions
- Pro Search for complex queries
- Collections for research
- API access
- Mobile apps
- Chrome extension

Perplexity represents the future of search, combining AI with real-time information retrieval.`,
    logo: "https://logo.clearbit.com/perplexity.ai",
    website: "https://www.perplexity.ai",
    pricing: "freemium",
    domain: "perplexity.ai",
    categories: ["ai-automation", "productivity"],
  },
  {
    name: "Excalidraw",
    slug: "excalidraw",
    tagline: "Virtual whiteboard for sketching hand-drawn like diagrams",
    description: `Excalidraw is a virtual collaborative whiteboard that lets you easily sketch diagrams with a hand-drawn feel.

Key Features:
- Hand-drawn aesthetic
- Real-time collaboration
- End-to-end encryption
- Library of shapes
- Export options
- Embeddable
- VS Code extension
- Open source

Excalidraw is perfect for quick diagrams, wireframes, and brainstorming sessions.`,
    logo: "https://logo.clearbit.com/excalidraw.com",
    website: "https://excalidraw.com",
    pricing: "free",
    domain: "excalidraw.com",
    categories: ["design", "productivity"],
  },
  {
    name: "tldraw",
    slug: "tldraw",
    tagline: "A very good whiteboard",
    description: `tldraw is a collaborative digital whiteboard that's free, instant, and works without accounts.

Key Features:
- Instant collaboration
- No account required
- AI shape generation
- Image export
- Embeddable
- Multiplayer
- Open source
- VS Code extension

tldraw focuses on simplicity and ease of use for quick collaborative drawing.`,
    logo: "https://logo.clearbit.com/tldraw.com",
    website: "https://www.tldraw.com",
    pricing: "free",
    domain: "tldraw.com",
    categories: ["design", "productivity"],
  },
  {
    name: "Whimsical",
    slug: "whimsical",
    tagline: "Think together",
    description: `Whimsical is a unified workspace for thinking and collaboration with flowcharts, wireframes, sticky notes, and mind maps.

Key Features:
- Flowcharts
- Wireframes
- Mind maps
- Sticky notes
- Docs
- Real-time collaboration
- AI assist
- Templates

Whimsical provides a clean, focused space for visual thinking and team collaboration.`,
    logo: "https://logo.clearbit.com/whimsical.com",
    website: "https://whimsical.com",
    pricing: "freemium",
    domain: "whimsical.com",
    categories: ["design", "productivity"],
  },
  {
    name: "Grammarly",
    slug: "grammarly",
    tagline: "Responsible AI that ensures your writing and reputation shine",
    description: `Grammarly is a writing assistant that checks spelling, grammar, punctuation, clarity, engagement, and delivery mistakes.

Key Features:
- Grammar and spell check
- Style and tone suggestions
- Plagiarism detection
- Browser extension
- Desktop apps
- GrammarlyGO AI
- Team features
- Works everywhere

Grammarly helps millions of people communicate more effectively in their writing.`,
    logo: "https://logo.clearbit.com/grammarly.com",
    website: "https://www.grammarly.com",
    pricing: "freemium",
    domain: "grammarly.com",
    categories: ["writing-content", "ai-automation"],
  },
  {
    name: "Copy.ai",
    slug: "copy-ai",
    tagline: "Go-to-market faster with AI",
    description: `Copy.ai is an AI-powered copywriting platform that helps marketers and sales teams create content faster.

Key Features:
- AI copywriting
- 90+ templates
- Brand voice
- Workflows automation
- Team collaboration
- Multiple languages
- API access
- Enterprise features

Copy.ai helps teams scale content production with AI-generated marketing copy.`,
    logo: "https://logo.clearbit.com/copy.ai",
    website: "https://www.copy.ai",
    pricing: "freemium",
    domain: "copy.ai",
    categories: ["writing-content", "ai-automation", "marketing"],
  },
  {
    name: "Jasper",
    slug: "jasper",
    tagline: "AI copilot for enterprise marketing teams",
    description: `Jasper is an AI content platform that helps marketing teams create on-brand content faster.

Key Features:
- AI content generation
- Brand voice training
- Marketing campaigns
- Team collaboration
- Knowledge base
- Chrome extension
- API access
- Enterprise security

Jasper is designed for marketing teams who need to create large volumes of on-brand content.`,
    logo: "https://logo.clearbit.com/jasper.ai",
    website: "https://www.jasper.ai",
    pricing: "paid",
    domain: "jasper.ai",
    categories: ["writing-content", "ai-automation", "marketing"],
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "Prime AI text to speech and voice cloning",
    description: `ElevenLabs creates the most realistic AI voices. Their technology generates natural-sounding speech in any voice and style.

Key Features:
- Text-to-speech
- Voice cloning
- Voice library
- Multilingual support
- Dubbing
- API access
- Projects for audiobooks
- Real-time streaming

ElevenLabs leads in AI voice synthesis, enabling new possibilities in audio content creation.`,
    logo: "https://logo.clearbit.com/elevenlabs.io",
    website: "https://elevenlabs.io",
    pricing: "freemium",
    domain: "elevenlabs.io",
    categories: ["ai-automation", "video-media"],
  },
  {
    name: "Notion Calendar",
    slug: "notion-calendar",
    tagline: "Your time, your way",
    description: `Notion Calendar (formerly Cron) is a calendar application that connects seamlessly with Notion workspaces.

Key Features:
- Notion integration
- Multiple calendars
- Scheduling links
- Keyboard shortcuts
- Menu bar access
- Team availability
- Time blocking
- Cross-platform

Notion Calendar brings calendar management into the Notion ecosystem for unified productivity.`,
    logo: "https://logo.clearbit.com/notion.so",
    website: "https://www.notion.so/product/calendar",
    pricing: "free",
    domain: "notion.so",
    categories: ["productivity"],
  },
  {
    name: "Prisma",
    slug: "prisma",
    tagline: "Next-generation ORM for Node.js and TypeScript",
    description: `Prisma is a next-generation ORM that makes working with databases easy for application developers.

Key Features:
- Type-safe database access
- Auto-generated client
- Visual data browser (Studio)
- Migration system
- Schema modeling
- Multiple databases
- Serverless-ready
- Accelerate for caching

Prisma has become the standard ORM for TypeScript/JavaScript developers, improving database workflows.`,
    logo: "https://logo.clearbit.com/prisma.io",
    website: "https://www.prisma.io",
    pricing: "freemium",
    domain: "prisma.io",
    categories: ["developer-tools", "data-databases"],
  },
  {
    name: "Drizzle",
    slug: "drizzle",
    tagline: "TypeScript ORM that lets you Just ship it",
    description: `Drizzle ORM is a TypeScript ORM that's lightweight, performant, and SQL-like. It embraces SQL while providing type safety.

Key Features:
- SQL-like query builder
- Full type safety
- Zero dependencies
- Drizzle Kit for migrations
- Multiple databases
- Serverless-friendly
- Lightweight
- Active community

Drizzle has gained popularity for developers who want type safety without the abstraction of traditional ORMs.`,
    logo: "https://logo.clearbit.com/orm.drizzle.team",
    website: "https://orm.drizzle.team",
    pricing: "free",
    domain: "drizzle.team",
    categories: ["developer-tools", "data-databases"],
  },
  {
    name: "Clerk",
    slug: "clerk",
    tagline: "The most comprehensive User Management Platform",
    description: `Clerk provides complete user management with authentication, multi-factor auth, and user profiles.

Key Features:
- Pre-built UI components
- Social login providers
- Multi-factor authentication
- User profiles
- Organization management
- Webhooks
- Session management
- Framework integrations

Clerk simplifies authentication for modern web applications with beautiful, customizable components.`,
    logo: "https://logo.clearbit.com/clerk.com",
    website: "https://clerk.com",
    pricing: "freemium",
    domain: "clerk.com",
    categories: ["developer-tools", "security"],
  },
  {
    name: "Auth0",
    slug: "auth0",
    tagline: "Secure access for everyone. But not just anyone.",
    description: `Auth0 is an identity platform that provides authentication and authorization as a service.

Key Features:
- Universal Login
- Social connections
- Multi-factor authentication
- Passwordless options
- Machine-to-machine auth
- Anomaly detection
- Extensibility
- Enterprise features

Auth0 is an industry leader in identity management, trusted by thousands of organizations.`,
    logo: "https://logo.clearbit.com/auth0.com",
    website: "https://auth0.com",
    pricing: "freemium",
    domain: "auth0.com",
    categories: ["developer-tools", "security"],
  },
  {
    name: "Storybook",
    slug: "storybook",
    tagline: "Build UIs without the grunt work",
    description: `Storybook is a frontend workshop for building UI components and pages in isolation. It's used by thousands of teams.

Key Features:
- Component development
- Visual testing
- Documentation
- Addon ecosystem
- Chromatic integration
- Testing tools
- Accessibility checks
- Framework support

Storybook has become essential for component-driven development, improving UI quality and collaboration.`,
    logo: "https://logo.clearbit.com/storybook.js.org",
    website: "https://storybook.js.org",
    pricing: "free",
    domain: "storybook.js.org",
    categories: ["developer-tools", "design"],
  },
  {
    name: "Turborepo",
    slug: "turborepo",
    tagline: "Make ship happen",
    description: `Turborepo is a high-performance build system for JavaScript and TypeScript monorepos.

Key Features:
- Incremental builds
- Remote caching
- Parallel execution
- Task pipelines
- Pruned deployments
- Profile visualization
- Framework agnostic
- Vercel integration

Turborepo dramatically speeds up monorepo builds by only rebuilding what changed.`,
    logo: "https://logo.clearbit.com/turbo.build",
    website: "https://turbo.build",
    pricing: "freemium",
    domain: "turbo.build",
    categories: ["developer-tools"],
  },
  {
    name: "Playwright",
    slug: "playwright",
    tagline: "Reliable end-to-end testing for modern web apps",
    description: `Playwright is a framework for web testing and automation. It enables reliable end-to-end testing across browsers.

Key Features:
- Cross-browser testing
- Auto-wait
- Web-first assertions
- Tracing and debugging
- Code generation
- API testing
- Visual comparisons
- Parallel execution

Playwright has become a top choice for E2E testing, known for reliability and developer experience.`,
    logo: "https://logo.clearbit.com/playwright.dev",
    website: "https://playwright.dev",
    pricing: "free",
    domain: "playwright.dev",
    categories: ["developer-tools"],
  },
];

async function main() {
  console.log("🌱 Starting seed process...\n");

  // 1. Create categories
  console.log("📁 Creating categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
      },
    });
  }
  console.log(`✅ Created ${categories.length} categories\n`);

  // 2. Create tools with companies
  console.log("🔧 Creating tools and companies...");
  let createdTools = 0;
  let createdCompanies = 0;

  for (const tool of tools) {
    // Create or get company
    let company = await prisma.company.findUnique({
      where: { domain: tool.domain },
    });

    if (!company) {
      // Use custom logo if available, otherwise use Google favicon service
      const companyLogoUrl = customLogos[tool.domain] || getLogo(tool.domain);

      company = await prisma.company.create({
        data: {
          name: tool.name.includes(" ") ? tool.name.split(" ")[0] : tool.name,
          slug: tool.domain.replace(/\./g, "-"),
          domain: tool.domain,
          logo: companyLogoUrl,
          website: tool.website,
          description: `${tool.name} is a leading company in its space.`,
          // Not claimed - available for claiming
          claimedAt: null,
          claimedBy: null,
        },
      });
      createdCompanies++;
      console.log(`  📦 Created company: ${company.name} (${company.domain})`);
    }

    // Create tool
    const existingTool = await prisma.tool.findUnique({
      where: { slug: tool.slug },
    });

    if (!existingTool) {
      // Use custom logo if available, otherwise use Google favicon service
      const logoUrl = customLogos[tool.domain] || getLogo(tool.domain);

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
          communityScore: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        },
      });

      // Link categories
      for (const categorySlug of tool.categories) {
        const category = await prisma.category.findUnique({
          where: { slug: categorySlug },
        });
        if (category) {
          await prisma.categoryTool.create({
            data: {
              toolId: createdTool.id,
              categoryId: category.id,
            },
          });
        }
      }

      createdTools++;
      console.log(`  🔧 Created tool: ${tool.name}`);
    } else {
      console.log(`  ⏭️ Tool already exists: ${tool.name}`);
    }
  }

  console.log(`\n✅ Created ${createdTools} tools and ${createdCompanies} companies`);
  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
