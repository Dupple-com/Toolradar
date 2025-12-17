import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// G2-style categories with subcategories
const categories = [
  {
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    icon: "🤖",
    description: "Artificial intelligence tools, machine learning platforms, and AI-powered software",
    children: [
      { name: "AI Chatbots", slug: "ai-chatbots", icon: "💬" },
      { name: "AI Writing Assistants", slug: "ai-writing-assistants", icon: "✍️" },
      { name: "AI Image Generators", slug: "ai-image-generators", icon: "🎨" },
      { name: "AI Code Assistants", slug: "ai-code-assistants", icon: "👨‍💻" },
      { name: "AI Video Generators", slug: "ai-video-generators", icon: "🎬" },
      { name: "AI Voice & Speech", slug: "ai-voice-speech", icon: "🎙️" },
      { name: "Machine Learning Platforms", slug: "ml-platforms", icon: "🧠" },
      { name: "AI Data Analytics", slug: "ai-data-analytics", icon: "📊" },
    ],
  },
  {
    name: "Marketing & Sales",
    slug: "marketing-sales",
    icon: "📈",
    description: "Tools for marketing automation, sales enablement, and customer acquisition",
    children: [
      { name: "CRM Software", slug: "crm-software", icon: "👥" },
      { name: "Email Marketing", slug: "email-marketing", icon: "📧" },
      { name: "Marketing Automation", slug: "marketing-automation", icon: "⚡" },
      { name: "Social Media Management", slug: "social-media-management", icon: "📱" },
      { name: "SEO Tools", slug: "seo-tools", icon: "🔍" },
      { name: "Sales Enablement", slug: "sales-enablement", icon: "💼" },
      { name: "Lead Generation", slug: "lead-generation", icon: "🎯" },
      { name: "Analytics & Attribution", slug: "analytics-attribution", icon: "📉" },
      { name: "Advertising Platforms", slug: "advertising-platforms", icon: "📺" },
      { name: "Influencer Marketing", slug: "influencer-marketing", icon: "⭐" },
    ],
  },
  {
    name: "Productivity & Collaboration",
    slug: "productivity-collaboration",
    icon: "⚡",
    description: "Tools for team collaboration, project management, and workplace productivity",
    children: [
      { name: "Project Management", slug: "project-management", icon: "📋" },
      { name: "Team Communication", slug: "team-communication", icon: "💬" },
      { name: "Video Conferencing", slug: "video-conferencing", icon: "📹" },
      { name: "Document Collaboration", slug: "document-collaboration", icon: "📄" },
      { name: "Note-Taking Apps", slug: "note-taking", icon: "📝" },
      { name: "Time Tracking", slug: "time-tracking", icon: "⏱️" },
      { name: "Calendar & Scheduling", slug: "calendar-scheduling", icon: "📅" },
      { name: "Whiteboard & Diagramming", slug: "whiteboard-diagramming", icon: "🎨" },
      { name: "Knowledge Management", slug: "knowledge-management", icon: "📚" },
    ],
  },
  {
    name: "Development & IT",
    slug: "development-it",
    icon: "💻",
    description: "Software development tools, DevOps, and IT infrastructure",
    children: [
      { name: "IDEs & Code Editors", slug: "ide-code-editors", icon: "⌨️" },
      { name: "Version Control", slug: "version-control", icon: "🔀" },
      { name: "CI/CD Tools", slug: "ci-cd-tools", icon: "🔄" },
      { name: "Cloud Hosting", slug: "cloud-hosting", icon: "☁️" },
      { name: "Database Management", slug: "database-management", icon: "🗄️" },
      { name: "API Development", slug: "api-development", icon: "🔌" },
      { name: "Monitoring & Logging", slug: "monitoring-logging", icon: "📊" },
      { name: "Security Tools", slug: "security-tools", icon: "🔒" },
      { name: "No-Code/Low-Code", slug: "no-code-low-code", icon: "🧩" },
      { name: "Testing & QA", slug: "testing-qa", icon: "✅" },
    ],
  },
  {
    name: "Design & Creative",
    slug: "design-creative",
    icon: "🎨",
    description: "Design tools, creative software, and digital asset management",
    children: [
      { name: "Graphic Design", slug: "graphic-design", icon: "🖼️" },
      { name: "UI/UX Design", slug: "ui-ux-design", icon: "📐" },
      { name: "Video Editing", slug: "video-editing", icon: "🎬" },
      { name: "Photo Editing", slug: "photo-editing", icon: "📷" },
      { name: "Prototyping Tools", slug: "prototyping-tools", icon: "🔧" },
      { name: "3D & Animation", slug: "3d-animation", icon: "🎭" },
      { name: "Digital Asset Management", slug: "digital-asset-management", icon: "📁" },
      { name: "Screen Recording", slug: "screen-recording", icon: "🖥️" },
    ],
  },
  {
    name: "Finance & Accounting",
    slug: "finance-accounting",
    icon: "💰",
    description: "Financial management, accounting software, and payment solutions",
    children: [
      { name: "Accounting Software", slug: "accounting-software", icon: "📒" },
      { name: "Invoicing & Billing", slug: "invoicing-billing", icon: "🧾" },
      { name: "Payment Processing", slug: "payment-processing", icon: "💳" },
      { name: "Expense Management", slug: "expense-management", icon: "💵" },
      { name: "Payroll Software", slug: "payroll-software", icon: "💸" },
      { name: "Financial Planning", slug: "financial-planning", icon: "📊" },
      { name: "Tax Software", slug: "tax-software", icon: "🏛️" },
    ],
  },
  {
    name: "HR & Recruiting",
    slug: "hr-recruiting",
    icon: "👥",
    description: "Human resources management, recruiting, and employee engagement tools",
    children: [
      { name: "HR Management (HRIS)", slug: "hr-management", icon: "🏢" },
      { name: "Applicant Tracking (ATS)", slug: "applicant-tracking", icon: "📋" },
      { name: "Employee Engagement", slug: "employee-engagement", icon: "🤝" },
      { name: "Performance Management", slug: "performance-management", icon: "🎯" },
      { name: "Learning Management (LMS)", slug: "learning-management", icon: "🎓" },
      { name: "Employee Benefits", slug: "employee-benefits", icon: "🎁" },
      { name: "Workforce Management", slug: "workforce-management", icon: "📅" },
    ],
  },
  {
    name: "Customer Service",
    slug: "customer-service",
    icon: "🎧",
    description: "Customer support, helpdesk, and service management tools",
    children: [
      { name: "Help Desk Software", slug: "help-desk", icon: "🎫" },
      { name: "Live Chat", slug: "live-chat", icon: "💬" },
      { name: "Customer Success", slug: "customer-success", icon: "🏆" },
      { name: "Call Center Software", slug: "call-center", icon: "📞" },
      { name: "Feedback & Surveys", slug: "feedback-surveys", icon: "📝" },
      { name: "Knowledge Base", slug: "knowledge-base", icon: "📚" },
    ],
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    icon: "🛒",
    description: "E-commerce platforms, online store builders, and retail management",
    children: [
      { name: "E-commerce Platforms", slug: "ecommerce-platforms", icon: "🏪" },
      { name: "Shopping Cart Software", slug: "shopping-cart", icon: "🛒" },
      { name: "Inventory Management", slug: "inventory-management", icon: "📦" },
      { name: "Order Management", slug: "order-management", icon: "📋" },
      { name: "Shipping & Fulfillment", slug: "shipping-fulfillment", icon: "🚚" },
      { name: "Subscription Management", slug: "subscription-management", icon: "🔄" },
    ],
  },
  {
    name: "Analytics & BI",
    slug: "analytics-bi",
    icon: "📊",
    description: "Business intelligence, data analytics, and reporting tools",
    children: [
      { name: "Business Intelligence", slug: "business-intelligence", icon: "📈" },
      { name: "Data Visualization", slug: "data-visualization", icon: "📉" },
      { name: "Web Analytics", slug: "web-analytics", icon: "🌐" },
      { name: "Product Analytics", slug: "product-analytics", icon: "📱" },
      { name: "Data Integration", slug: "data-integration", icon: "🔗" },
      { name: "ETL Tools", slug: "etl-tools", icon: "⚙️" },
    ],
  },
  {
    name: "Security & Privacy",
    slug: "security-privacy",
    icon: "🔒",
    description: "Cybersecurity, privacy compliance, and data protection tools",
    children: [
      { name: "Password Managers", slug: "password-managers", icon: "🔑" },
      { name: "VPN Software", slug: "vpn-software", icon: "🛡️" },
      { name: "Endpoint Security", slug: "endpoint-security", icon: "💻" },
      { name: "Identity Management", slug: "identity-management", icon: "🪪" },
      { name: "Compliance Management", slug: "compliance-management", icon: "✅" },
      { name: "Backup & Recovery", slug: "backup-recovery", icon: "💾" },
    ],
  },
  {
    name: "Content & Website",
    slug: "content-website",
    icon: "🌐",
    description: "Content management, website builders, and publishing tools",
    children: [
      { name: "CMS Platforms", slug: "cms-platforms", icon: "📰" },
      { name: "Website Builders", slug: "website-builders", icon: "🏗️" },
      { name: "Blogging Platforms", slug: "blogging-platforms", icon: "✍️" },
      { name: "Landing Page Builders", slug: "landing-page-builders", icon: "📄" },
      { name: "Form Builders", slug: "form-builders", icon: "📝" },
      { name: "Headless CMS", slug: "headless-cms", icon: "🔌" },
    ],
  },
];

async function main() {
  console.log("Seeding categories...");

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

    console.log(`✓ ${category.name}`);

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
        console.log(`  - ${child.name}`);
      }
    }
  }

  console.log("\n✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
