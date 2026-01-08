import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { BookOpen, ArrowRight, Users, TrendingUp, Sparkles } from "lucide-react";
import { expertGuides } from "@/content/expert-guides";

export const metadata: Metadata = {
  title: "Software Buying Guides | Expert Reviews & Comparisons | Toolradar",
  description: "In-depth guides to help you choose the right software for your business. Learn what features matter, compare top solutions, and make informed decisions.",
  keywords: "software guides, buying guides, software comparison, how to choose software, software reviews",
  openGraph: {
    title: "Software Buying Guides | Toolradar",
    description: "In-depth guides to help you choose the right software for your business.",
    url: "https://toolradar.com/guides",
    siteName: "Toolradar",
    type: "website",
  },
  alternates: {
    canonical: "https://toolradar.com/guides",
  },
};

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      tools: { some: { tool: { status: "published" } } },
    },
    include: {
      _count: { select: { tools: true } },
    },
    orderBy: { name: "asc" },
    take: 20,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Buying Guides",
    description: "In-depth guides to help you choose the right software",
    numberOfItems: categories.length,
    itemListElement: categories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${cat.name} Software Guide`,
      url: `https://toolradar.com/guides/${cat.slug}`,
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
              <span className="text-foreground">Guides</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Software Buying Guides
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choosing the right software can feel overwhelming with so many options available.
              Our guides break down each category, explain what features actually matter, and help
              you understand which tools work best for different situations.
            </p>
          </div>
        </section>

        {/* Why Read Our Guides */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Why Read Our Guides?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Research-Based Insights</h3>
                <p className="text-sm text-muted-foreground">
                  We don't just list features. Our guides explain why certain capabilities matter
                  and how they translate to real-world benefits for your team.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Real User Perspectives</h3>
                <p className="text-sm text-muted-foreground">
                  Our recommendations incorporate feedback from actual users who work with
                  these tools every day, not just marketing claims.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Current Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Software evolves quickly. We regularly update our guides to reflect new
                  features, pricing changes, and emerging solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Guides Section */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Expert Buying Guides</h2>
              <p className="text-sm text-muted-foreground">{expertGuides.length} in-depth guides</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertGuides.slice(0, 12).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="bg-white rounded-xl border p-5 hover:shadow-lg hover:border-primary/50 transition group"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition flex items-center gap-2">
                  {guide.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {guide.heroSubtitle}
                </p>
                <span className="text-xs text-primary capitalize">
                  {guide.category.replace(/-/g, ' ')}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/guides/all"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View all {expertGuides.length} expert guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Guides by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/guides/${category.slug}`}
                className="bg-white rounded-xl border p-5 hover:shadow-lg hover:border-primary/50 transition group"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition flex items-center gap-2">
                  {category.name}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {category.description || `Everything you need to know about choosing ${category.name.toLowerCase()} software.`}
                </p>
                <span className="text-xs text-muted-foreground">
                  {category._count.tools} tools reviewed
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Making Software Decisions Easier</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                The software market has exploded over the past decade. Where there used to be one
                or two options in each category, you now have dozens of tools competing for your
                attention. That's great for competition and innovation, but it makes buying
                decisions genuinely difficult.
              </p>
              <p>
                Our guides are designed to cut through the noise. Instead of overwhelming you with
                every possible option, we focus on what actually matters for different types of
                businesses. A startup with five people has very different needs than an enterprise
                with thousands of employees, and our guides reflect that reality.
              </p>
              <p>
                Each guide covers the essential questions: What problems does this type of software
                solve? What features should you prioritize based on your situation? What are the
                pricing models you'll encounter? And most importantly, what do real users say about
                the leading options?
              </p>
              <p>
                We update these guides regularly as the market evolves. New tools launch, existing
                tools add features, and pricing changes. Our goal is to give you the most current
                picture possible so you can make decisions with confidence.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
