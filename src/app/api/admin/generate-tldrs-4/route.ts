import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 4: J-M tools
const toolTLDRs: Record<string, string> = {
  // J-K
  "june": "Product analytics built for B2B SaaS",
  "k3s": "Lightweight Kubernetes for edge and IoT",
  "kameleoon": "A/B testing and personalization platform",
  "keeper": "Password manager with enterprise security",
  "keycdn": "Fast and reliable content delivery network",
  "keycloak": "Open-source identity and access management",
  "keystonejs": "Headless CMS and GraphQL API framework",
  "keywords-everywhere": "SEO keyword research browser extension",
  "khroma": "AI color palette generator that learns your style",
  "kind": "Run Kubernetes clusters in Docker containers",
  "kissflow": "Low-code platform for business workflows",
  "kling-ai": "Chinese AI video generation platform",
  "knative": "Kubernetes-native serverless framework",
  "kochava": "Mobile attribution and analytics platform",
  "krea-ai": "AI image generation with real-time canvas",
  "krisp": "AI noise cancellation for calls",
  "krita": "Free digital painting and illustration software",
  "kustomer": "Customer service CRM platform",
  "kustomize": "Kubernetes native configuration management",

  // L
  "lm-studio": "Run local LLMs with user-friendly interface",
  "lovo": "AI voice generator for video production",
  "lancedb": "Vector database built on Lance format",
  "landen": "Simple landing page builder",
  "lapce": "Fast open-source code editor in Rust",
  "later": "Social media scheduling focused on visual content",
  "lazygit": "Terminal UI for Git commands",
  "leapsome": "People enablement and performance platform",
  "learnworlds": "Online course platform with community features",
  "lemlist": "Cold email outreach with personalization",
  "leonardo-ai": "AI image generation for creative professionals",
  "lets-encrypt": "Free SSL/TLS certificates for everyone",
  "lexica": "Search engine for AI-generated images",
  "lexion": "AI contract management for legal teams",
  "lightdash": "Open-source BI tool for dbt projects",
  "lightstep": "Distributed tracing and observability",
  "linode": "Cloud computing with simple and predictable pricing",
  "listnr": "AI podcast and voiceover generator",
  "liveblocks": "Real-time collaboration infrastructure",
  "llama-cpp": "Run Llama models efficiently on CPU",
  "localai": "Self-hosted OpenAI-compatible API",
  "logrhythm": "SIEM and security analytics platform",
  "loggly": "Cloud-based log management service",
  "logseq": "Open-source knowledge management and notes",
  "logstash": "Data collection and processing pipeline",
  "logtail": "Log management built on ClickHouse",
  "logto": "Open-source Auth0 alternative",
  "logz-io": "Observability platform based on open-source",
  "loki": "Log aggregation system from Grafana Labs",
  "looker": "Business intelligence by Google Cloud",
  "loomly": "Social media calendar and content management",
  "loops": "Email marketing for modern SaaS",
  "lottie": "Render After Effects animations on any platform",
  "lovable": "AI app builder that creates production code",
  "lucide": "Beautiful and consistent open-source icons",
  "lucky-orange": "Website analytics with heatmaps and recordings",
  "luma-ai": "AI video and 3D generation platform",
  "lumen5": "AI video creator for marketing content",
  "lunacy": "Free design software with built-in assets",
  "lusha": "B2B contact data for sales prospecting",

  // M
  "mlflow": "Open-source ML lifecycle management",
  "mabl": "AI-powered test automation platform",
  "magento": "Open-source e-commerce platform",
  "magic": "Passwordless authentication SDK",
  "magnific": "AI image upscaling and enhancement",
  "mailgun": "Transactional email API for developers",
  "mailjet": "Email marketing and transactional email",
  "malwarebytes": "Anti-malware and endpoint protection",
  "mariadb": "Community-driven MySQL fork",
  "marketmuse": "AI content planning and optimization",
  "matillion": "Cloud data integration platform",
  "matomo": "Open-source web analytics alternative to GA",
  "mattermost": "Open-source Slack alternative",
  "maven": "Build automation for Java projects",
  "maya": "3D animation and modeling software",
  "medusa": "Open-source headless commerce engine",
  "meltano": "Open-source data integration framework",
  "mem": "AI-powered personal knowledge assistant",
  "memberstack": "Membership and authentication for websites",
  "mendix": "Low-code platform for enterprise apps",
  "mentat": "AI coding assistant for terminal",
  "mercury": "Banking for startups and tech companies",
  "metabase": "Open-source business intelligence tool",
  "microk8s": "Lightweight Kubernetes from Canonical",
  "microsoft-clarity": "Free heatmaps and session recordings",
  "microsoft-sentinel": "Cloud-native SIEM and SOAR",
  "mighty-networks": "Community platform for creators",
  "milvus": "Open-source vector database for AI",
  "minikube": "Run Kubernetes locally for development",
  "mintlify": "Beautiful documentation that writes itself",
  "mistral-ai": "European AI company with open models",
  "mkdocs": "Static site generator for documentation",
  "mocha": "JavaScript test framework for Node.js",
  "modal": "Serverless cloud for AI and data applications",
  "mode": "Collaborative analytics and BI platform",
  "motion": "AI calendar that auto-schedules tasks",
  "mouseflow": "Session replay and heatmap analytics",
  "moz": "SEO software and link analysis tools",
  "murf-ai": "AI voice generator for professional voiceovers",
  "mutable-ai": "AI code assistant with context awareness",
  "mux": "Video API for developers",
  "mysql": "Popular open-source relational database",

  // N
  "ns1": "Intelligent DNS and traffic management",
  "namecheap": "Domain registration and web hosting",
  "nebula": "Open-source VPN mesh network",
  "neo4j": "Graph database for connected data",
  "neon": "Serverless Postgres with branching",
  "neovim": "Hyperextensible Vim-based text editor",
  "neptune-ai": "Experiment tracking for ML teams",
  "nessus": "Vulnerability assessment scanner",
  "netlify-functions": "Serverless functions on Netlify",
  "netmaker": "WireGuard-based virtual network platform",
  "nextra": "Static site generator for Next.js docs",
  "ngrok": "Expose local servers to the internet",
  "nhost": "Open-source Firebase alternative with GraphQL",
  "nightcafe": "AI art generator with multiple models",
  "nightwatch": "End-to-end testing framework for browsers",
  "nocodb": "Open-source Airtable alternative",
  "node-red": "Flow-based programming for IoT",
  "noodl": "Visual full-stack development platform",
  "nordvpn": "Popular VPN service for privacy",
  "northbeam": "Marketing attribution for e-commerce",
  "notepad-plus-plus": "Free source code editor for Windows",
  "nova": "Mac-native code editor from Panic",
  "nuget": ".NET package manager",
  "nx": "Monorepo tools for JavaScript and TypeScript"
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
    message: "TLDRs batch 4 applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(toolTLDRs).length
  });
}
