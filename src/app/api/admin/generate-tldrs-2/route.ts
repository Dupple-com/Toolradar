import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 2: More meaningful taglines for tools
const toolTLDRs: Record<string, string> = {
  // Security & Infrastructure
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
  "convertkit": "Email marketing built for creators",
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
  "customerio": "Marketing automation for customer engagement"
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

  for (const [slug, tagline] of Object.entries(toolTLDRs)) {
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
        data: { tagline }
      });

      updatedList.push(tool.name);
      updated++;
    } catch (error) {
      errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: "TLDRs batch 2 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
