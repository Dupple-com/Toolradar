import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 3: More meaningful taglines
const toolTLDRs: Record<string, string> = {
  // D-F
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

  // G
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

  // H
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

  // I-J
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
  "jenkins": "Open-source automation server for CI/CD"
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
    message: "TLDRs batch 3 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
