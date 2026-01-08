import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Software by Industry | Find Tools for Your Business | Toolradar",
  description: "Find the best software for your industry. Browse tools for healthcare, finance, e-commerce, education, real estate, marketing, technology, and more.",
  keywords: "software by industry, business software, industry tools, enterprise software, vertical software",
  openGraph: {
    title: "Software by Industry | Toolradar",
    description: "Find the best software for your industry.",
    url: "https://toolradar.com/software-for",
    siteName: "Toolradar",
    type: "website",
  },
  alternates: {
    canonical: "https://toolradar.com/software-for",
  },
};

const INDUSTRIES = [
  {
    slug: "healthcare",
    name: "Healthcare",
    description: "HIPAA-compliant tools for patient management, medical records, and healthcare operations.",
    icon: "🏥",
    color: "bg-red-50 border-red-200 hover:border-red-400",
  },
  {
    slug: "finance",
    name: "Finance & Banking",
    description: "Secure solutions for financial institutions, banks, and fintech companies.",
    icon: "🏦",
    color: "bg-green-50 border-green-200 hover:border-green-400",
  },
  {
    slug: "ecommerce",
    name: "E-commerce & Retail",
    description: "Tools for online stores, inventory, sales, and customer management.",
    icon: "🛒",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
  },
  {
    slug: "education",
    name: "Education",
    description: "Software for schools, universities, and e-learning platforms.",
    icon: "🎓",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    description: "CRM, listing management, and property marketing tools for realtors.",
    icon: "🏠",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
  },
  {
    slug: "marketing",
    name: "Marketing & Advertising",
    description: "Campaign management, analytics, and content creation tools.",
    icon: "📢",
    color: "bg-pink-50 border-pink-200 hover:border-pink-400",
  },
  {
    slug: "technology",
    name: "Technology & SaaS",
    description: "Developer tools, project management, and technical infrastructure.",
    icon: "💻",
    color: "bg-slate-50 border-slate-200 hover:border-slate-400",
  },
  {
    slug: "consulting",
    name: "Consulting & Professional Services",
    description: "Project management, client collaboration, and billing solutions.",
    icon: "💼",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
  },
];

export default function SoftwareForPage() {
  const year = new Date().getFullYear();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Software by Industry", url: "/software-for" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software by Industry",
    description: "Find the best software for your industry",
    numberOfItems: INDUSTRIES.length,
    itemListElement: INDUSTRIES.map((ind, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Software for ${ind.name}`,
      url: `https://toolradar.com/software-for/${ind.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <span>/</span>
              <span className="text-foreground">Software by Industry</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Software by Industry
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Find the best software tools tailored for your industry. Browse curated
              lists of tools used by leading companies in each sector.
            </p>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {INDUSTRIES.map((industry) => (
              <Link
                key={industry.slug}
                href={`/software-for/${industry.slug}`}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${industry.color}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{industry.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      {industry.name}
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>
                    <p className="text-muted-foreground">{industry.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Find the Right Software for Your Industry</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Every industry has unique software needs. Healthcare requires HIPAA compliance,
                finance needs robust security, and e-commerce demands seamless integrations.
                Our industry guides help you find tools that understand your specific challenges.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">How We Curate Industry Software</h3>
              <ul className="space-y-2">
                <li><strong>Industry Relevance:</strong> Tools commonly used in each sector</li>
                <li><strong>Compliance:</strong> Required certifications and security standards</li>
                <li><strong>Integration:</strong> Compatibility with industry-standard systems</li>
                <li><strong>User Reviews:</strong> Feedback from professionals in your field</li>
              </ul>
              <p className="mt-4">
                Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} with
                the latest tools and reviews from industry professionals.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
