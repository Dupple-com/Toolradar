import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 6: S-Z tools
const toolTLDRs: Record<string, string> = {
  // S
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

  // T
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
  "turso": "Edge SQLite database",
  "twingate": "Zero trust network access",
  "twist": "Async team communication from Doist",
  "typedream": "No-code website builder with Notion-like editing",

  // U-V
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

  // W-Z
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

  // Additional tools
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
  "unpkg": "CDN for npm packages",
  "v0": "AI-powered UI generation from Vercel",
  "vllm": "Fast LLM serving with PagedAttention",
  "xmatters": "Incident management and alerting"
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
    message: "TLDRs batch 6 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
