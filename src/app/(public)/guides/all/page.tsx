import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { expertGuides } from "@/content/expert-guides";

export const metadata: Metadata = {
  title: "All Expert Buying Guides | Toolradar",
  description: "Browse our complete collection of 100+ expert software buying guides. Find the best tools for AI, CRM, project management, marketing, and more.",
  openGraph: {
    title: "All Expert Buying Guides | Toolradar",
    description: "Browse our complete collection of 100+ expert software buying guides.",
    url: "https://toolradar.com/guides/all",
    siteName: "Toolradar",
    type: "website",
  },
  alternates: {
    canonical: "https://toolradar.com/guides/all",
  },
};

// Group guides by category
function groupGuidesByCategory() {
  const grouped: Record<string, typeof expertGuides> = {};

  expertGuides.forEach(guide => {
    const category = guide.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(guide);
  });

  return grouped;
}

export default function AllGuidesPage() {
  const groupedGuides = groupGuidesByCategory();
  const categories = Object.keys(groupedGuides).sort();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "All Guides", url: "/guides/all" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Expert Software Buying Guides",
    description: "Complete collection of expert software buying guides",
    numberOfItems: expertGuides.length,
    itemListElement: expertGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `https://toolradar.com/guides/${guide.slug}`,
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
              <Link href="/guides" className="hover:text-foreground transition">Guides</Link>
              <span>/</span>
              <span className="text-foreground">All Guides</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  All Expert Guides
                </h1>
                <p className="text-muted-foreground">{expertGuides.length} buying guides</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Our comprehensive collection of expert buying guides helps you choose the right
              software for every need. Each guide includes expert recommendations, pricing analysis,
              and practical tips.
            </p>
          </div>
        </section>

        {/* Guides by Category */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold mb-4 capitalize flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {category.replace(/-/g, ' ')}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({groupedGuides[category].length} guides)
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedGuides[category].map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="bg-white rounded-xl border p-5 hover:shadow-lg hover:border-primary/50 transition group"
                  >
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition flex items-center gap-2">
                      {guide.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {guide.heroSubtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse all tools by category or use our comparison tool to find the perfect software.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/categories"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Browse Categories
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 border rounded-lg font-medium hover:bg-white transition"
              >
                Compare Tools
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
