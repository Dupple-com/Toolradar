import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// G2-style categories with Lucide icon names
const categories = [
  {
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    icon: "brain",
    description: "Artificial intelligence tools, machine learning platforms, and AI-powered software",
    children: [
      { name: "AI Chatbots", slug: "ai-chatbots", icon: "message-square-bot" },
      { name: "AI Writing Assistants", slug: "ai-writing-assistants", icon: "pen-tool" },
      { name: "AI Image Generators", slug: "ai-image-generators", icon: "image-plus" },
      { name: "AI Code Assistants", slug: "ai-code-assistants", icon: "code" },
      { name: "AI Video Generators", slug: "ai-video-generators", icon: "video" },
      { name: "AI Voice & Speech", slug: "ai-voice-speech", icon: "mic" },
      { name: "Machine Learning Platforms", slug: "ml-platforms", icon: "cpu" },
      { name: "AI Data Analytics", slug: "ai-data-analytics", icon: "bar-chart-3" },
    ],
  },
  {
    name: "Marketing & Sales",
    slug: "marketing-sales",
    icon: "trending-up",
    description: "Tools for marketing automation, sales enablement, and customer acquisition",
    children: [
      { name: "CRM Software", slug: "crm-software", icon: "users" },
      { name: "Email Marketing", slug: "email-marketing", icon: "mail" },
      { name: "Marketing Automation", slug: "marketing-automation", icon: "zap" },
      { name: "Social Media Management", slug: "social-media-management", icon: "share-2" },
      { name: "SEO Tools", slug: "seo-tools", icon: "search" },
      { name: "Sales Enablement", slug: "sales-enablement", icon: "briefcase" },
      { name: "Lead Generation", slug: "lead-generation", icon: "target" },
      { name: "Analytics & Attribution", slug: "analytics-attribution", icon: "pie-chart" },
      { name: "Advertising Platforms", slug: "advertising-platforms", icon: "megaphone" },
      { name: "Influencer Marketing", slug: "influencer-marketing", icon: "star" },
    ],
  },
  {
    name: "Productivity & Collaboration",
    slug: "productivity-collaboration",
    icon: "layout-grid",
    description: "Tools for team collaboration, project management, and workplace productivity",
    children: [
      { name: "Project Management", slug: "project-management", icon: "kanban" },
      { name: "Team Communication", slug: "team-communication", icon: "message-circle" },
      { name: "Video Conferencing", slug: "video-conferencing", icon: "video" },
      { name: "Document Collaboration", slug: "document-collaboration", icon: "file-text" },
      { name: "Note-Taking Apps", slug: "note-taking", icon: "sticky-note" },
      { name: "Time Tracking", slug: "time-tracking", icon: "clock" },
      { name: "Calendar & Scheduling", slug: "calendar-scheduling", icon: "calendar" },
      { name: "Whiteboard & Diagramming", slug: "whiteboard-diagramming", icon: "pencil-ruler" },
      { name: "Knowledge Management", slug: "knowledge-management", icon: "book-open" },
    ],
  },
  {
    name: "Development & IT",
    slug: "development-it",
    icon: "terminal",
    description: "Software development tools, DevOps, and IT infrastructure",
    children: [
      { name: "IDEs & Code Editors", slug: "ide-code-editors", icon: "file-code" },
      { name: "Version Control", slug: "version-control", icon: "git-branch" },
      { name: "CI/CD Tools", slug: "ci-cd-tools", icon: "refresh-cw" },
      { name: "Cloud Hosting", slug: "cloud-hosting", icon: "cloud" },
      { name: "Database Management", slug: "database-management", icon: "database" },
      { name: "API Development", slug: "api-development", icon: "plug" },
      { name: "Monitoring & Logging", slug: "monitoring-logging", icon: "activity" },
      { name: "Security Tools", slug: "security-tools", icon: "shield" },
      { name: "No-Code/Low-Code", slug: "no-code-low-code", icon: "blocks" },
      { name: "Testing & QA", slug: "testing-qa", icon: "check-circle" },
    ],
  },
  {
    name: "Design & Creative",
    slug: "design-creative",
    icon: "palette",
    description: "Design tools, creative software, and digital asset management",
    children: [
      { name: "Graphic Design", slug: "graphic-design", icon: "image" },
      { name: "UI/UX Design", slug: "ui-ux-design", icon: "layout" },
      { name: "Video Editing", slug: "video-editing", icon: "film" },
      { name: "Photo Editing", slug: "photo-editing", icon: "camera" },
      { name: "Prototyping Tools", slug: "prototyping-tools", icon: "smartphone" },
      { name: "3D & Animation", slug: "3d-animation", icon: "box" },
      { name: "Digital Asset Management", slug: "digital-asset-management", icon: "folder" },
      { name: "Screen Recording", slug: "screen-recording", icon: "monitor" },
    ],
  },
  {
    name: "Finance & Accounting",
    slug: "finance-accounting",
    icon: "wallet",
    description: "Financial management, accounting software, and payment solutions",
    children: [
      { name: "Accounting Software", slug: "accounting-software", icon: "calculator" },
      { name: "Invoicing & Billing", slug: "invoicing-billing", icon: "receipt" },
      { name: "Payment Processing", slug: "payment-processing", icon: "credit-card" },
      { name: "Expense Management", slug: "expense-management", icon: "banknote" },
      { name: "Payroll Software", slug: "payroll-software", icon: "dollar-sign" },
      { name: "Financial Planning", slug: "financial-planning", icon: "line-chart" },
      { name: "Tax Software", slug: "tax-software", icon: "landmark" },
    ],
  },
  {
    name: "HR & Recruiting",
    slug: "hr-recruiting",
    icon: "user-plus",
    description: "Human resources management, recruiting, and employee engagement tools",
    children: [
      { name: "HR Management (HRIS)", slug: "hr-management", icon: "building" },
      { name: "Applicant Tracking (ATS)", slug: "applicant-tracking", icon: "clipboard-list" },
      { name: "Employee Engagement", slug: "employee-engagement", icon: "heart-handshake" },
      { name: "Performance Management", slug: "performance-management", icon: "trophy" },
      { name: "Learning Management (LMS)", slug: "learning-management", icon: "graduation-cap" },
      { name: "Employee Benefits", slug: "employee-benefits", icon: "gift" },
      { name: "Workforce Management", slug: "workforce-management", icon: "users" },
    ],
  },
  {
    name: "Customer Service",
    slug: "customer-service",
    icon: "headphones",
    description: "Customer support, helpdesk, and service management tools",
    children: [
      { name: "Help Desk Software", slug: "help-desk", icon: "ticket" },
      { name: "Live Chat", slug: "live-chat", icon: "messages-square" },
      { name: "Customer Success", slug: "customer-success", icon: "award" },
      { name: "Call Center Software", slug: "call-center", icon: "phone" },
      { name: "Feedback & Surveys", slug: "feedback-surveys", icon: "clipboard" },
      { name: "Knowledge Base", slug: "knowledge-base", icon: "library" },
    ],
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    icon: "shopping-cart",
    description: "E-commerce platforms, online store builders, and retail management",
    children: [
      { name: "E-commerce Platforms", slug: "ecommerce-platforms", icon: "store" },
      { name: "Shopping Cart Software", slug: "shopping-cart", icon: "shopping-bag" },
      { name: "Inventory Management", slug: "inventory-management", icon: "package" },
      { name: "Order Management", slug: "order-management", icon: "clipboard-check" },
      { name: "Shipping & Fulfillment", slug: "shipping-fulfillment", icon: "truck" },
      { name: "Subscription Management", slug: "subscription-management", icon: "repeat" },
    ],
  },
  {
    name: "Analytics & BI",
    slug: "analytics-bi",
    icon: "bar-chart-2",
    description: "Business intelligence, data analytics, and reporting tools",
    children: [
      { name: "Business Intelligence", slug: "business-intelligence", icon: "trending-up" },
      { name: "Data Visualization", slug: "data-visualization", icon: "pie-chart" },
      { name: "Web Analytics", slug: "web-analytics", icon: "globe" },
      { name: "Product Analytics", slug: "product-analytics", icon: "smartphone" },
      { name: "Data Integration", slug: "data-integration", icon: "link" },
      { name: "ETL Tools", slug: "etl-tools", icon: "settings" },
    ],
  },
  {
    name: "Security & Privacy",
    slug: "security-privacy",
    icon: "shield-check",
    description: "Cybersecurity, privacy compliance, and data protection tools",
    children: [
      { name: "Password Managers", slug: "password-managers", icon: "key" },
      { name: "VPN Software", slug: "vpn-software", icon: "lock" },
      { name: "Endpoint Security", slug: "endpoint-security", icon: "laptop" },
      { name: "Identity Management", slug: "identity-management", icon: "fingerprint" },
      { name: "Compliance Management", slug: "compliance-management", icon: "check-square" },
      { name: "Backup & Recovery", slug: "backup-recovery", icon: "hard-drive" },
    ],
  },
  {
    name: "Content & Website",
    slug: "content-website",
    icon: "globe",
    description: "Content management, website builders, and publishing tools",
    children: [
      { name: "CMS Platforms", slug: "cms-platforms", icon: "newspaper" },
      { name: "Website Builders", slug: "website-builders", icon: "panels-top-left" },
      { name: "Blogging Platforms", slug: "blogging-platforms", icon: "edit" },
      { name: "Landing Page Builders", slug: "landing-page-builders", icon: "file" },
      { name: "Form Builders", slug: "form-builders", icon: "text-cursor-input" },
      { name: "Headless CMS", slug: "headless-cms", icon: "server" },
    ],
  },
];

async function main() {
  console.log("Seeding categories with Lucide icons...\n");

  for (const category of categories) {
    // Create or update parent category
    const parent = await prisma.category.upsert({
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

    console.log(`✓ ${category.name} (${category.icon})`);

    // Create or update child categories
    if (category.children) {
      for (const child of category.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: {
            name: child.name,
            icon: child.icon,
            parentId: parent.id,
          },
          create: {
            name: child.name,
            slug: child.slug,
            icon: child.icon,
            parentId: parent.id,
          },
        });
        console.log(`  └─ ${child.name} (${child.icon})`);
      }
    }
  }

  console.log("\n✅ Categories seeded successfully with Lucide icons!");
  console.log("\nUsage in React components:");
  console.log('  import { Brain, TrendingUp, ... } from "lucide-react";');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
