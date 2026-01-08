import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { Star, ArrowRight, Building2, Users, TrendingUp, CheckCircle, AlertTriangle, Shield, Zap } from "lucide-react";
import { getIndustryContent } from "@/content/industry-content";

export const dynamic = 'force-dynamic';

// Define industries with their relevant categories and keywords
const INDUSTRIES: Record<string, {
  name: string;
  description: string;
  keywords: string[];
  relevantCategories: string[];
  icon: string;
  stats: { label: string; value: string }[];
}> = {
  "healthcare": {
    name: "Healthcare",
    description: "Software solutions for healthcare providers, hospitals, clinics, and medical professionals. HIPAA-compliant tools for patient management, medical records, and healthcare operations.",
    keywords: ["healthcare software", "medical software", "hospital management", "HIPAA compliant", "patient management"],
    relevantCategories: ["project-management", "communication", "crm", "analytics", "security"],
    icon: "🏥",
    stats: [
      { label: "Industry Size", value: "$4.5T" },
      { label: "Digital Growth", value: "+15% YoY" },
      { label: "Remote Adoption", value: "67%" },
    ],
  },
  "finance": {
    name: "Finance & Banking",
    description: "Enterprise software for financial institutions, banks, investment firms, and fintech companies. Secure, compliant solutions for financial operations.",
    keywords: ["finance software", "banking software", "fintech tools", "financial management", "investment software"],
    relevantCategories: ["analytics", "security", "crm", "project-management", "automation"],
    icon: "🏦",
    stats: [
      { label: "Industry Size", value: "$26T" },
      { label: "Digital Growth", value: "+12% YoY" },
      { label: "Cloud Adoption", value: "78%" },
    ],
  },
  "ecommerce": {
    name: "E-commerce & Retail",
    description: "Tools for online stores, retail businesses, and e-commerce platforms. Solutions for inventory, sales, marketing, and customer management.",
    keywords: ["ecommerce software", "retail software", "online store tools", "inventory management", "sales software"],
    relevantCategories: ["marketing", "analytics", "crm", "e-commerce", "automation"],
    icon: "🛒",
    stats: [
      { label: "Industry Size", value: "$5.8T" },
      { label: "Online Growth", value: "+20% YoY" },
      { label: "Mobile Sales", value: "73%" },
    ],
  },
  "education": {
    name: "Education",
    description: "Software for schools, universities, online learning platforms, and educational institutions. Tools for course management, student engagement, and e-learning.",
    keywords: ["education software", "e-learning tools", "school management", "LMS", "student management"],
    relevantCategories: ["project-management", "communication", "video", "collaboration", "productivity"],
    icon: "🎓",
    stats: [
      { label: "Industry Size", value: "$7.3T" },
      { label: "Online Learning", value: "+25% YoY" },
      { label: "EdTech Adoption", value: "85%" },
    ],
  },
  "real-estate": {
    name: "Real Estate",
    description: "Software for real estate agencies, property managers, and real estate professionals. CRM, listing management, and property marketing tools.",
    keywords: ["real estate software", "property management", "real estate CRM", "listing management", "realtor tools"],
    relevantCategories: ["crm", "marketing", "analytics", "communication", "automation"],
    icon: "🏠",
    stats: [
      { label: "Industry Size", value: "$3.7T" },
      { label: "Digital Adoption", value: "+18% YoY" },
      { label: "Online Leads", value: "52%" },
    ],
  },
  "marketing": {
    name: "Marketing & Advertising",
    description: "Tools for marketing agencies, advertisers, and marketing teams. Solutions for campaigns, analytics, content creation, and customer engagement.",
    keywords: ["marketing software", "advertising tools", "campaign management", "marketing analytics", "content marketing"],
    relevantCategories: ["marketing", "analytics", "design", "automation", "social-media"],
    icon: "📢",
    stats: [
      { label: "Industry Size", value: "$740B" },
      { label: "Digital Spend", value: "+14% YoY" },
      { label: "Marketing Tech", value: "68%" },
    ],
  },
  "technology": {
    name: "Technology & SaaS",
    description: "Software for tech companies, startups, and SaaS businesses. Developer tools, project management, and technical infrastructure solutions.",
    keywords: ["tech software", "developer tools", "SaaS tools", "startup software", "engineering tools"],
    relevantCategories: ["developer-tools", "project-management", "collaboration", "analytics", "automation"],
    icon: "💻",
    stats: [
      { label: "Industry Size", value: "$5.3T" },
      { label: "Cloud Growth", value: "+22% YoY" },
      { label: "Remote Teams", value: "89%" },
    ],
  },
  "consulting": {
    name: "Consulting & Professional Services",
    description: "Tools for consulting firms, professional service providers, and advisory businesses. Project management, client collaboration, and billing solutions.",
    keywords: ["consulting software", "professional services tools", "client management", "consulting CRM", "project billing"],
    relevantCategories: ["project-management", "crm", "analytics", "communication", "productivity"],
    icon: "💼",
    stats: [
      { label: "Industry Size", value: "$890B" },
      { label: "Digital Tools", value: "+16% YoY" },
      { label: "Remote Work", value: "72%" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: { industry: string } }): Promise<Metadata> {
  const { industry } = params;
  const industryConfig = INDUSTRIES[industry];

  if (!industryConfig) return { title: "Industry not found" };

  const year = new Date().getFullYear();
  const title = `Best Software for ${industryConfig.name} ${year}`;

  // Get expert content for enhanced description
  const expertContent = getIndustryContent(industry);
  const description = expertContent
    ? `${expertContent.expertIntro.slice(0, 150)}... Find the best tools for ${industryConfig.name.toLowerCase()} in ${year}.`
    : `${industryConfig.description} Find the best tools for ${industryConfig.name.toLowerCase()} businesses.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: industryConfig.keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/software-for/${industry}`,
      siteName: "Toolradar",
      type: "article",
    },
    alternates: {
      canonical: `https://toolradar.com/software-for/${industry}`,
    },
  };
}

export default async function SoftwareForIndustryPage({
  params,
}: {
  params: { industry: string };
}) {
  const { industry } = params;
  const industryConfig = INDUSTRIES[industry];

  if (!industryConfig) {
    notFound();
  }

  // Get tools from relevant categories
  const categories = await prisma.category.findMany({
    where: {
      slug: { in: industryConfig.relevantCategories },
    },
    include: {
      tools: {
        where: { tool: { status: "published" } },
        include: {
          tool: {
            include: {
              _count: { select: { reviews: true } },
            },
          },
        },
        take: 10,
      },
    },
  });

  // Flatten and dedupe tools, sort by score
  const toolMap = new Map<string, typeof categories[0]["tools"][0]["tool"]>();
  for (const cat of categories) {
    for (const ct of cat.tools) {
      if (!toolMap.has(ct.tool.id)) {
        toolMap.set(ct.tool.id, ct.tool);
      }
    }
  }

  const tools = Array.from(toolMap.values())
    .sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0))
    .slice(0, 15);

  const year = new Date().getFullYear();

  // Get expert content for enhanced page
  const expertContent = getIndustryContent(industry);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Software For", url: "/software-for" },
    { name: industryConfig.name, url: `/software-for/${industry}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Software for ${industryConfig.name} ${year}`,
    description: industryConfig.description,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  // FAQ JSON-LD - use expert FAQs when available
  const faqJsonLd = expertContent
    ? generateFaqJsonLd(expertContent.faqs)
    : generateFaqJsonLd([
        {
          question: `What software do ${industryConfig.name.toLowerCase()} companies need?`,
          answer: `${industryConfig.name} companies typically need tools for ${industryConfig.relevantCategories.slice(0, 3).join(", ").replace(/-/g, " ")}. Top choices include ${tools.slice(0, 3).map(t => t.name).join(", ")}.`,
        },
        {
          question: `What is the best software for ${industryConfig.name.toLowerCase()}?`,
          answer: `Based on our analysis, ${tools[0]?.name} is highly rated for ${industryConfig.name.toLowerCase()} use cases with a score of ${tools[0]?.editorialScore}/100. Other excellent options include ${tools.slice(1, 4).map(t => t.name).join(", ")}.`,
        },
        {
          question: `Are there free software options for ${industryConfig.name.toLowerCase()}?`,
          answer: tools.filter(t => t.pricing === "free" || t.pricing === "freemium").length > 0
            ? `Yes! Free or freemium options for ${industryConfig.name.toLowerCase()} include ${tools.filter(t => t.pricing === "free" || t.pricing === "freemium").slice(0, 3).map(t => t.name).join(", ")}.`
            : `Most enterprise ${industryConfig.name.toLowerCase()} software is paid, but many offer free trials to test before committing.`,
        },
      ]);

  // Get other industries
  const otherIndustries = Object.entries(INDUSTRIES)
    .filter(([key]) => key !== industry)
    .slice(0, 6);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <span>/</span>
              <span className="text-foreground">Software for {industryConfig.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">
                {industryConfig.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Best Software for {industryConfig.name} {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {tools.length}+ tools for {industryConfig.name.toLowerCase()} businesses
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
              {expertContent ? expertContent.expertIntro : industryConfig.description}
            </p>

            {/* Industry Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {industryConfig.stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories for this Industry */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold mb-4">Popular Categories for {industryConfig.name}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary hover:text-primary transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-semibold mb-6">Top Software for {industryConfig.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="bg-white rounded-xl border p-5 hover:shadow-lg hover:border-primary/50 transition group"
              >
                <div className="flex items-start gap-3">
                  {index < 3 && (
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-slate-100 text-slate-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {index + 1}
                    </span>
                  )}
                  <ToolLogo src={tool.logo} name={tool.name} className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition truncate">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{tool.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    tool.pricing === "free" ? "bg-green-100 text-green-700" :
                    tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                  </span>
                  {tool.editorialScore && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{tool.editorialScore}/100</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Expert Content Sections */}
        {expertContent && (
          <>
            {/* Key Requirements */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold mb-6">{industryConfig.name} Software Requirements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {expertContent.requirements.map((req, index) => (
                  <div key={index} className="bg-white rounded-xl border p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">{req.requirement}</h3>
                        <p className="text-sm text-muted-foreground">{req.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Software Categories */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold mb-6">Essential Software Categories for {industryConfig.name}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {expertContent.keyCategories.map((cat, index) => (
                  <div key={index} className="bg-white rounded-xl border p-5">
                    <h3 className="font-semibold mb-2">{cat.category}</h3>
                    <p className="text-sm text-muted-foreground">{cat.importance}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Considerations */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Key Considerations When Evaluating {industryConfig.name} Software
                </h2>
                <ul className="space-y-3">
                  {expertContent.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-800">
                      <span className="text-amber-500 mt-1">•</span>
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Compliance Notes */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Compliance & Regulatory Considerations
                </h2>
                <p className="text-blue-800">{expertContent.complianceNotes}</p>
              </div>
            </section>

            {/* Digital Trends */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Digital Trends in {industryConfig.name}
                </h2>
                <p className="text-purple-800">{expertContent.digitalTrends}</p>
              </div>
            </section>

            {/* Expert FAQ Section */}
            <section className="max-w-5xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {expertContent.faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border p-5">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Generic FAQ (when no expert content) */}
        {!expertContent && (
          <section className="max-w-5xl mx-auto px-4 pb-8">
            <div className="bg-white rounded-xl border p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">FAQ: Software for {industryConfig.name}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">What software do {industryConfig.name.toLowerCase()} companies use?</h3>
                  <p className="text-muted-foreground">
                    {industryConfig.name} companies typically use a combination of {industryConfig.relevantCategories.slice(0, 3).join(", ").replace(/-/g, " ")} tools.
                    Popular choices include {tools.slice(0, 4).map(t => t.name).join(", ")}.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">What is the best software for {industryConfig.name.toLowerCase()} in {year}?</h3>
                  <p className="text-muted-foreground">
                    Based on our analysis, {tools[0]?.name} is a top choice for {industryConfig.name.toLowerCase()} businesses,
                    scoring {tools[0]?.editorialScore}/100. The best choice depends on your specific needs and budget.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">How do I choose software for my {industryConfig.name.toLowerCase()} business?</h3>
                  <p className="text-muted-foreground">
                    Consider your team size, specific workflows, compliance requirements, and budget.
                    Many tools offer free trials - we recommend testing 2-3 options before committing.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Industries */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Software for Other Industries</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {otherIndustries.map(([key, config]) => (
                <Link
                  key={key}
                  href={`/software-for/${key}`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-xl">{config.icon}</span>
                  <span className="font-medium text-sm">{config.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
