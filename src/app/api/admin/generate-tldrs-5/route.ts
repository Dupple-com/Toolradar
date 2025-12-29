import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 5: O-R tools
const toolTLDRs: Record<string, string> = {
  // O
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

  // P
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

  // Q
  "qdrant": "Vector database for AI applications",
  "qualified": "Conversational marketing for B2B",
  "qualys": "Cloud-based security and compliance",
  "questdb": "Time series database for fast analytics",

  // R
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
  "remember-the-milk": "Smart to-do list app",
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
  "runbook": "Operations runbook automation"
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
    message: "TLDRs batch 5 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
