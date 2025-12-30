import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Manual descriptions for 164 tools
const manualDescriptions: Record<string, string> = {
  "1password-business": "1Password Business provides enterprise password management with admin controls, team vaults, and SSO integration. Features activity logs, custom security policies, and compliance reporting for organizations.",
  "a2-hosting": "A2 Hosting offers high-performance web hosting with Turbo Servers delivering up to 20x faster speeds. Provides shared, VPS, and dedicated hosting with free site migration and 99.9% uptime guarantee.",
  "aws-amplify": "AWS Amplify is a development platform for building secure, scalable mobile and web applications. Provides authentication, APIs, storage, and hosting with seamless AWS integration.",
  "aws-codecommit": "AWS CodeCommit is a fully managed source control service hosting secure Git repositories. Integrates with AWS CI/CD pipelines and scales automatically without infrastructure management.",
  "activecampaign": "ActiveCampaign combines email marketing, marketing automation, and CRM in one platform. Features advanced automation workflows, predictive sending, and sales automation for customer engagement.",
  "adobe-creative-cloud": "Adobe Creative Cloud includes 20+ creative applications like Photoshop, Illustrator, and Premiere Pro. Provides cloud storage, Adobe Fonts, and collaboration tools for creative professionals.",
  "adobe-illustrator": "Adobe Illustrator is the industry-standard vector graphics editor for logos, icons, and illustrations. Features precision drawing tools and integration with other Adobe Creative Cloud apps.",
  "adobe-photoshop": "Adobe Photoshop is the leading image editing and graphic design software. Features advanced photo manipulation, compositing, and design tools used by professionals worldwide.",
  "adobe-sign": "Adobe Sign enables electronic signatures and document workflows. Features legally binding e-signatures, automated workflows, and integration with Microsoft and Salesforce.",
  "agorapulse": "Agorapulse is a social media management platform for scheduling, monitoring, and reporting. Features unified inbox, content calendar, and team collaboration tools.",
  "airtable-forms": "Airtable Forms lets you collect data directly into Airtable bases. Features customizable forms, conditional logic, and automatic data organization in spreadsheet-database format.",
  "algolia": "Algolia provides a hosted search API delivering relevant results in milliseconds. Features typo-tolerance, faceted search, and analytics for websites and mobile apps.",
  "apiary": "Apiary is an API design and documentation platform now part of Oracle. Features collaborative API design, automated documentation, and mock servers for API development.",
  "apollo": "Apollo.io is a B2B sales intelligence platform with contact database and engagement tools. Features lead enrichment, email sequences, and CRM integrations for sales teams.",
  "apollo-graphql": "Apollo GraphQL provides tools for building, managing, and scaling GraphQL APIs. Features Apollo Server, Apollo Client, and Apollo Studio for API development.",
  "artillery": "Artillery is a modern load testing toolkit for testing HTTP, WebSocket, and Socket.io applications. Features scenario-based testing and detailed performance reports.",
  "astro": "Astro is a web framework for building fast, content-focused websites. Features island architecture, zero JavaScript by default, and support for any UI framework.",
  "aweber": "AWeber provides email marketing tools for small businesses. Features drag-and-drop builder, automation, landing pages, and integration with major platforms.",
  "bannerbear": "Bannerbear automates image and video generation through templates and APIs. Features dynamic text, images, and automated social media visuals.",
  "bardeen": "Bardeen is a browser automation tool for repetitive tasks. Features no-code workflow builder, AI-powered actions, and integrations with web apps.",
  "basin": "Basin provides form backend for static sites. Features spam filtering, file uploads, and integrations without server-side code required.",
  "better-stack": "Better Stack combines uptime monitoring, incident management, and log management. Features status pages, on-call scheduling, and real-time alerting.",
  "bill-com": "Bill.com automates accounts payable and receivable processes. Features invoice processing, payment approvals, and integration with accounting software.",
  "bitrix24": "Bitrix24 is an all-in-one business suite with CRM, project management, and communication tools. Features task management, document sharing, and team collaboration.",
  "bluehost": "Bluehost is a web hosting provider recommended by WordPress.org. Features one-click WordPress install, free domain, SSL certificate, and 24/7 support.",
  "bookstack": "BookStack is an open-source wiki platform for organizing documentation. Features hierarchical content structure, WYSIWYG editor, and permission management.",
  "brevo": "Brevo (formerly Sendinblue) provides email marketing, SMS, and chat tools. Features marketing automation, transactional emails, and CRM capabilities.",
  "builtwith": "BuiltWith reveals technology stacks used by websites. Features competitive analysis, lead generation, and market research for technology adoption trends.",
  "buzzsumo": "BuzzSumo analyzes content performance and influencer engagement. Features content discovery, competitor analysis, and trending topic identification.",
  "camtasia": "Camtasia is screen recording and video editing software. Features professional video creation, animations, and interactive elements for tutorials and training.",
  "caprover": "CapRover is an open-source PaaS for deploying applications. Features one-click app deployment, automatic SSL, and Docker-based infrastructure.",
  "cleanshot": "CleanShot X is a screenshot and screen recording tool for Mac. Features annotation tools, scrolling capture, and cloud storage for sharing.",
  "clickup-docs": "ClickUp Docs provides collaborative documentation within ClickUp. Features real-time editing, nested pages, and integration with tasks and projects.",
  "cloudflare-pages": "Cloudflare Pages is a JAMstack platform for deploying static and full-stack sites. Features global CDN, automatic builds, and serverless functions.",
  "codeberg": "Codeberg is a community-driven Git hosting platform. Features free hosting for open-source projects, CI/CD, and issue tracking.",
  "codepen": "CodePen is an online code editor for front-end development. Features live preview, collaboration, and a community for sharing code snippets.",
  "cognito-forms": "Cognito Forms provides easy form building with payments and workflows. Features conditional logic, calculations, and integration with business tools.",
  "confluence": "Confluence is Atlassian's team workspace for documentation and collaboration. Features templates, real-time editing, and integration with Jira and Trello.",
  "constant-contact": "Constant Contact provides email marketing and online marketing tools. Features drag-and-drop editor, automation, and event management.",
  "continue-dev": "Continue is an open-source AI code assistant for VS Code and JetBrains. Features code completion, chat interface, and local model support.",
  "coursera": "Coursera offers online courses from top universities and companies. Features certificates, degrees, and professional training programs.",
  "dall-e": "DALL-E is OpenAI's AI image generation model. Creates and edits images from natural language descriptions with high quality results.",
  "document360": "Document360 is a knowledge base platform for documentation. Features AI-powered search, version control, and analytics for support content.",
  "dokku": "Dokku is an open-source PaaS alternative to Heroku. Features simple deployment, plugin system, and Docker-powered infrastructure.",
  "dreamhost": "DreamHost is a web hosting provider with WordPress hosting expertise. Features unlimited bandwidth, free SSL, and a 97-day money-back guarantee.",
  "drip": "Drip is an ecommerce marketing automation platform. Features behavior-based automation, personalization, and integration with ecommerce platforms.",
  "dropbox-paper": "Dropbox Paper is a collaborative document workspace. Features real-time editing, task management, and integration with Dropbox storage.",
  "dropbox-sign": "Dropbox Sign (formerly HelloSign) provides electronic signatures. Features legally binding e-signatures, templates, and API for document workflows.",
  "fathom-analytics": "Fathom Analytics provides privacy-focused website analytics. Features GDPR compliance, no cookies required, and simple dashboard without tracking users.",
  "feathery": "Feathery is a form builder for complex workflows. Features conditional logic, integrations, and embeddable forms for product flows.",
  "firebase": "Firebase is Google's app development platform. Features real-time database, authentication, hosting, and analytics for web and mobile apps.",
  "fireflies": "Fireflies.ai transcribes and analyzes meetings automatically. Features AI summaries, searchable transcripts, and CRM integrations.",
  "flodesk": "Flodesk provides beautiful email marketing with flat-rate pricing. Features visual email builder, automation workflows, and landing pages.",
  "fly-io": "Fly.io deploys applications globally on edge infrastructure. Features automatic scaling, built-in Postgres, and deployment from Dockerfiles.",
  "formstack": "Formstack provides forms, documents, and signatures for workflows. Features drag-and-drop builder, conditional logic, and data routing.",
  "getform": "Getform is a form backend for developers. Features spam protection, file uploads, and webhook integrations for static sites.",
  "getresponse": "GetResponse provides email marketing and marketing automation. Features landing pages, webinars, and conversion funnels for lead generation.",
  "github-pages": "GitHub Pages hosts websites directly from GitHub repositories. Features free hosting, custom domains, and automatic builds from Markdown.",
  "google-cloud-source": "Google Cloud Source Repositories provides Git hosting on Google Cloud. Features integration with Cloud Build, security scanning, and IAM controls.",
  "google-workspace": "Google Workspace combines Gmail, Drive, Docs, and Meet for businesses. Features collaboration tools, admin controls, and enterprise security.",
  "gravitee": "Gravitee is an API management platform. Features API gateway, developer portal, and access management for API programs.",
  "harbor": "Harbor is an open-source container registry. Features vulnerability scanning, content signing, and replication for container images.",
  "helpjuice": "Helpjuice provides knowledge base software for support teams. Features AI-powered search, analytics, and customizable design.",
  "heroku": "Heroku is a cloud platform for deploying and scaling applications. Features easy deployment, managed services, and add-on marketplace.",
  "heyflow": "Heyflow creates interactive flows and funnels without code. Features drag-and-drop builder, conditional logic, and lead qualification.",
  "hostinger": "Hostinger provides affordable web hosting with fast performance. Features website builder, WordPress hosting, and 24/7 support.",
  "hubspot-marketing": "HubSpot Marketing Hub provides inbound marketing tools. Features email marketing, landing pages, automation, and analytics in one platform.",
  "hubspot-service": "HubSpot Service Hub provides customer service software. Features ticketing, knowledge base, and customer feedback tools.",
  "influxdb": "InfluxDB is a time series database for metrics and events. Features high-performance writes, SQL-like queries, and built-in visualization.",
  "instantly": "Instantly provides cold email outreach at scale. Features unlimited email accounts, warm-up, and deliverability optimization.",
  "invideo": "InVideo is an online video editor for creating professional videos. Features templates, AI-powered editing, and stock media library.",
  "involve-me": "involve.me creates interactive content like quizzes and calculators. Features no-code builder, lead generation, and payment collection.",
  "jetbrains": "JetBrains creates professional IDEs for developers. Features IntelliJ IDEA, PyCharm, WebStorm, and other language-specific development tools.",
  "kahoot": "Kahoot! creates engaging learning games and quizzes. Features interactive presentations, training content, and virtual engagement tools.",
  "kinsta": "Kinsta provides premium managed WordPress hosting on Google Cloud. Features automatic scaling, CDN, and expert WordPress support.",
  "kong": "Kong is an API gateway and service mesh platform. Features rate limiting, authentication, and traffic management for microservices.",
  "lemon-squeezy": "Lemon Squeezy is a payment platform for digital products. Features global payments, tax compliance, and subscription management.",
  "lighthouse": "Lighthouse is Google's tool for web page quality audits. Features performance, accessibility, and SEO scoring with improvement suggestions.",
  "linkedin-learning": "LinkedIn Learning offers professional courses and training. Features business, technology, and creative skills taught by industry experts.",
  "liveagent": "LiveAgent provides help desk and live chat software. Features ticketing, call center, and multi-channel customer support.",
  "livechat": "LiveChat provides customer service and sales chat software. Features chatbots, ticketing system, and integration with business tools.",
  "livekit": "LiveKit is an open-source WebRTC infrastructure. Features real-time video, audio, and data transmission for communication apps.",
  "liveshare": "Visual Studio Live Share enables real-time collaborative coding. Features shared debugging, terminals, and servers without code sharing.",
  "locust": "Locust is an open-source load testing tool. Features Python-based test scripts, distributed testing, and real-time web UI.",
  "lucidchart": "Lucidchart is a collaborative diagramming application. Features flowcharts, org charts, and technical diagrams with real-time collaboration.",
  "mailerlite": "MailerLite provides email marketing with intuitive design. Features drag-and-drop editor, automation, landing pages, and subscriber management.",
  "memberful": "Memberful powers membership businesses and communities. Features subscription payments, member management, and content gating.",
  "mentimeter": "Mentimeter creates interactive presentations with live polls. Features word clouds, quizzes, and audience engagement tools.",
  "microsoft-365": "Microsoft 365 provides Office apps, cloud storage, and collaboration tools. Features Word, Excel, PowerPoint, Teams, and enterprise security.",
  "mockapi": "MockAPI generates mock REST APIs for prototyping. Features customizable data, CRUD endpoints, and integration for frontend development.",
  "mockoon": "Mockoon is a desktop app for creating mock APIs locally. Features offline mock servers, proxy mode, and OpenAPI import.",
  "mongodb-atlas": "MongoDB Atlas is a fully managed cloud database service. Features automatic scaling, global clusters, and built-in security.",
  "moosend": "Moosend provides email marketing and automation. Features drag-and-drop editor, landing pages, and personalization for campaigns.",
  "nifty": "Nifty is a project management tool combining tasks, docs, and chat. Features milestones, time tracking, and team collaboration.",
  "nomad": "HashiCorp Nomad is a workload orchestrator for deploying applications. Features simple scheduling, multi-cloud support, and container orchestration.",
  "notion-ai": "Notion AI adds AI assistance to Notion workspaces. Features content generation, summarization, and translation within documents.",
  "notion-calendar": "Notion Calendar integrates scheduling with Notion workspaces. Features time blocking, meeting management, and task scheduling.",
  "nuclino": "Nuclino is a collaborative wiki for team knowledge. Features real-time editing, visual boards, and instant search.",
  "obs-studio": "OBS Studio is free open-source software for video recording and streaming. Features scene composition, filters, and multi-platform streaming.",
  "octotree": "Octotree is a browser extension for GitHub code navigation. Features file tree sidebar, code review tools, and quick file search.",
  "omnisend": "Omnisend provides email and SMS marketing for ecommerce. Features automation workflows, segmentation, and multi-channel campaigns.",
  "otter": "Otter.ai provides AI meeting transcription and notes. Features real-time transcription, speaker identification, and searchable recordings.",
  "outline": "Outline is an open-source knowledge base for teams. Features Markdown editing, real-time collaboration, and Slack integration.",
  "pantheon": "Pantheon provides WebOps platform for Drupal and WordPress. Features automated workflows, security, and performance optimization.",
  "patreon": "Patreon enables creators to earn through memberships. Features subscription tiers, exclusive content, and community engagement tools.",
  "perforce": "Perforce provides version control and collaboration tools. Features Helix Core for large files and streams-based development.",
  "pika": "Pika generates AI videos from text and images. Features text-to-video, image animation, and creative editing tools.",
  "piktochart": "Piktochart creates infographics and visual content. Features templates, drag-and-drop editor, and brand customization.",
  "pixlr": "Pixlr is an online photo editor with AI-powered tools. Features background removal, filters, and professional editing capabilities.",
  "placid": "Placid automates image and video generation from templates. Features dynamic content, API integration, and social media automation.",
  "plaid": "Plaid connects applications to bank accounts securely. Features account verification, transaction data, and financial data APIs.",
  "plastic-scm": "Plastic SCM is version control designed for game development. Features visual branch management and large file handling.",
  "postman-api": "Postman API Platform enables API development collaboration. Features API design, documentation, testing, and team workspaces.",
  "prezi": "Prezi creates dynamic presentations with zooming canvas. Features templates, collaboration, and video presentations.",
  "quay": "Quay.io is a container registry by Red Hat. Features vulnerability scanning, geo-replication, and enterprise security.",
  "readwise": "Readwise syncs highlights from reading apps. Features spaced repetition, daily review, and export to note-taking apps.",
  "refined-github": "Refined GitHub is a browser extension improving GitHub. Features interface enhancements, keyboard shortcuts, and productivity tools.",
  "reform": "Reform creates conversational forms for lead capture. Features conditional logic, analytics, and CRM integrations.",
  "remotion": "Remotion creates videos programmatically with React. Features timeline editor, rendering pipeline, and animation tools.",
  "restream": "Restream broadcasts live video to multiple platforms simultaneously. Features multi-streaming, scheduling, and analytics.",
  "runway": "Runway provides AI creative tools for video and image editing. Features generative AI, video editing, and creative workflows.",
  "rytr": "Rytr is an AI writing assistant for content creation. Features tone selection, use cases, and multilingual content generation.",
  "sage": "Sage provides accounting and business management software. Features invoicing, payroll, and financial reporting for SMBs.",
  "screencastify": "Screencastify is a Chrome extension for screen recording. Features easy recording, editing, and sharing for education and business.",
  "screenflow": "ScreenFlow is Mac screen recording and video editing software. Features professional editing, animations, and multi-track timeline.",
  "se-ranking": "SE Ranking provides SEO tools for keyword tracking and audits. Features competitor analysis, backlink monitoring, and reporting.",
  "sendible": "Sendible is a social media management tool for agencies. Features scheduling, analytics, and client collaboration features.",
  "similarweb": "SimilarWeb provides website traffic and competitive analysis. Features traffic estimates, audience insights, and market research.",
  "siteground": "SiteGround provides managed web hosting with excellent support. Features WordPress hosting, security tools, and site speed optimization.",
  "skillshare": "Skillshare offers creative and business courses online. Features project-based learning, community feedback, and unlimited access.",
  "slab": "Slab is a knowledge base for team documentation. Features modern editor, search, and integration with work tools.",
  "smartlead": "Smartlead provides cold email infrastructure at scale. Features unlimited mailboxes, warm-up, and multi-channel outreach.",
  "smartsheet": "Smartsheet is a work management platform with spreadsheet interface. Features project tracking, automation, and resource management.",
  "snagit": "Snagit is screen capture and recording software. Features annotation tools, templates, and quick sharing for documentation.",
  "snappa": "Snappa creates graphics for social media and marketing. Features templates, stock photos, and brand customization.",
  "sourcegraph": "Sourcegraph provides code search and intelligence. Features universal code search, navigation, and AI coding assistance.",
  "sourcehut": "Sourcehut provides minimalist Git hosting and collaboration. Features mailing lists, CI/CD, and developer tools.",
  "storychief": "StoryChief is a content marketing platform. Features multi-channel publishing, collaboration, and SEO optimization.",
  "streamyard": "StreamYard is browser-based live streaming studio. Features multi-streaming, guest hosting, and professional broadcasts.",
  "strikingly": "Strikingly is a website builder for one-page sites. Features mobile-optimized templates and ecommerce capabilities.",
  "super": "Super turns Notion pages into fast websites. Features custom domains, SEO optimization, and automatic updates.",
  "surfer": "Surfer is an SEO tool for content optimization. Features content editor, SERP analyzer, and keyword research.",
  "sync": "Sync.com provides secure cloud storage with end-to-end encryption. Features file sharing, backup, and privacy-focused storage.",
  "teamwork": "Teamwork is project management software for client work. Features task management, time tracking, and resource planning.",
  "testim": "Testim provides AI-powered test automation. Features codeless test creation, self-healing tests, and CI/CD integration.",
  "things": "Things is a task manager for Mac and iOS. Features natural language input, projects, and areas for organization.",
  "tripetto": "Tripetto creates conversational forms and surveys. Features logic branching, calculations, and embeddable forms.",
  "twilio": "Twilio provides communication APIs for voice, SMS, and video. Features programmable messaging, phone numbers, and verification.",
  "udemy": "Udemy is an online learning marketplace. Features courses on demand, instructor-led content, and business training.",
  "volusion": "Volusion is an ecommerce platform for online stores. Features website builder, payment processing, and inventory management.",
  "waalaxy": "Waalaxy automates LinkedIn prospecting and outreach. Features connection requests, messaging sequences, and CRM integration.",
  "wappalyzer": "Wappalyzer identifies technologies used on websites. Features browser extension, API, and lead generation tools.",
  "web-vitals": "Web Vitals measures website performance metrics. Features Core Web Vitals tracking, real user monitoring, and optimization insights.",
  "webflow-cms": "Webflow CMS provides visual content management. Features dynamic content, collections, and API access for websites.",
  "weebly": "Weebly is a website builder with drag-and-drop interface. Features ecommerce, blogging, and marketing tools.",
  "whimsical": "Whimsical creates flowcharts, wireframes, and mind maps. Features real-time collaboration and intuitive design tools.",
  "wiki-js": "Wiki.js is a modern open-source wiki platform. Features Markdown support, multiple storage options, and authentication.",
  "woodpecker": "Woodpecker is a cold email tool for B2B outreach. Features email sequences, follow-ups, and deliverability tools.",
  "wordpress": "WordPress powers over 40% of websites worldwide. Features flexible CMS, plugin ecosystem, and customizable themes.",
  "wordpress-com": "WordPress.com provides managed WordPress hosting. Features easy setup, themes, plugins, and built-in security.",
  "workday": "Workday provides enterprise cloud applications for HR and finance. Features human capital management, payroll, and financial planning.",
  "wpengine": "WP Engine offers premium managed WordPress hosting. Features automatic updates, security, and developer tools.",
  "writesonic": "Writesonic is an AI writing tool for marketing content. Features article generation, ad copy, and SEO optimization.",
  "wufoo": "Wufoo creates online forms and surveys easily. Features drag-and-drop builder, payments, and data reporting."
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const dryRun = searchParams.get("dry") === "true";

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    updated: 0,
    notFound: 0,
    errors: [] as string[],
  };

  for (const [slug, description] of Object.entries(manualDescriptions)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!tool) {
        results.notFound++;
        continue;
      }

      if (!dryRun) {
        await prisma.tool.update({
          where: { slug },
          data: { description }
        });
      }

      results.updated++;
    } catch (error) {
      results.errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    message: dryRun ? "Dry run completed" : "Manual descriptions applied",
    summary: {
      updated: results.updated,
      notFound: results.notFound,
      total: Object.keys(manualDescriptions).length
    },
    errors: results.errors
  });
}
