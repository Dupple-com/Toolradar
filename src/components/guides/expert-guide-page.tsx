import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import {
  BookOpen, CheckCircle, XCircle, Star, ArrowRight,
  DollarSign, Zap, Lightbulb, AlertTriangle, Users
} from "lucide-react";
import { ExpertGuide } from "@/content/expert-guides";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ExpertGuidePageProps {
  guide: ExpertGuide;
}

// Helper functions to handle both string and object formats
function getWhatItIsTitle(whatItIs: ExpertGuide['whatItIs']): string {
  return typeof whatItIs === 'string' ? 'What It Is' : whatItIs.title;
}

function getWhatItIsContent(whatItIs: ExpertGuide['whatItIs']): string {
  return typeof whatItIs === 'string' ? whatItIs : whatItIs.content;
}

function getWhyItMattersTitle(whyItMatters: ExpertGuide['whyItMatters']): string {
  return typeof whyItMatters === 'string' ? 'Why It Matters' : whyItMatters.title;
}

function getWhyItMattersContent(whyItMatters: ExpertGuide['whyItMatters']): string {
  return typeof whyItMatters === 'string' ? whyItMatters : whyItMatters.content;
}

function isStructuredFeature(feature: string | { name: string; description: string; importance: "essential" | "important" | "nice-to-have" }): feature is { name: string; description: string; importance: "essential" | "important" | "nice-to-have" } {
  return typeof feature !== 'string';
}

function getBuyingConsiderationsTitle(bc: ExpertGuide['buyingConsiderations']): string {
  if (!bc) return 'What to Consider';
  return Array.isArray(bc) ? 'What to Consider' : bc.title;
}

function getBuyingConsiderationsPoints(bc: ExpertGuide['buyingConsiderations']): string[] {
  if (!bc) return [];
  return Array.isArray(bc) ? bc : bc.points;
}

function getPricingOverviewSummary(po: ExpertGuide['pricingOverview']): string | null {
  if (!po) return null;
  return typeof po === 'string' ? po : po.summary;
}

function getPricingOverviewTiers(po: ExpertGuide['pricingOverview']): { name: string; priceRange: string; bestFor: string }[] | null {
  if (!po || typeof po === 'string') return null;
  return po.tiers;
}

export function ExpertGuidePage({ guide }: ExpertGuidePageProps) {
  const year = new Date().getFullYear();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.metaTitle,
    description: guide.metaDescription,
    datePublished: `${year}-01-01`,
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-foreground transition">Guides</Link>
              <span>/</span>
              <span className="text-foreground">{guide.title}</span>
            </nav>

            <div className="flex items-center gap-2 text-sm text-primary mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Expert Buying Guide</span>
              <span className="text-muted-foreground">
                • Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {guide.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {guide.heroSubtitle}
            </p>
          </div>
        </section>

        {/* TL;DR Section - Critical for GEO */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 -mt-8 relative z-10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">TL;DR</h2>
            </div>
            <MarkdownContent content={guide.tldr} />
          </div>
        </section>

        {/* Table of Contents */}
        <section className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <h2 className="font-semibold mb-3">In This Guide</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#what-it-is" className="text-primary hover:underline">{getWhatItIsTitle(guide.whatItIs)}</a>
              <a href="#why-it-matters" className="text-primary hover:underline">{getWhyItMattersTitle(guide.whyItMatters)}</a>
              <a href="#features" className="text-primary hover:underline">Key Features to Look For</a>
              <a href="#top-picks" className="text-primary hover:underline">Top Picks</a>
              <a href="#pricing" className="text-primary hover:underline">Pricing Overview</a>
              <a href="#mistakes" className="text-primary hover:underline">Common Mistakes</a>
              <a href="#tips" className="text-primary hover:underline">Expert Tips</a>
              <a href="#faq" className="text-primary hover:underline">FAQ</a>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <MarkdownContent content={guide.introduction} className="text-lg leading-relaxed" />
        </section>

        {/* What It Is */}
        <section id="what-it-is" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">{getWhatItIsTitle(guide.whatItIs)}</h2>
          <MarkdownContent content={getWhatItIsContent(guide.whatItIs)} />
        </section>

        {/* Why It Matters */}
        <section id="why-it-matters" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">{getWhyItMattersTitle(guide.whyItMatters)}</h2>
          <MarkdownContent content={getWhyItMattersContent(guide.whyItMatters)} />
        </section>

        {/* Key Features */}
        <section id="features" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Key Features to Look For</h2>
          <div className="space-y-4">
            {guide.keyFeatures.map((feature, index) => {
              if (isStructuredFeature(feature)) {
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-lg border p-4 ${
                      feature.importance === 'essential' ? 'border-l-4 border-l-green-500' :
                      feature.importance === 'important' ? 'border-l-4 border-l-blue-500' :
                      'border-l-4 border-l-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{feature.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            feature.importance === 'essential' ? 'bg-green-100 text-green-700' :
                            feature.importance === 'important' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {feature.importance}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              // Simple string format
              return (
                <div key={index} className="bg-white rounded-lg border p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Buying Considerations */}
        {guide.buyingConsiderations && getBuyingConsiderationsPoints(guide.buyingConsiderations).length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">{getBuyingConsiderationsTitle(guide.buyingConsiderations)}</h2>
            <div className="bg-white rounded-xl border p-6">
              <ul className="space-y-3">
                {getBuyingConsiderationsPoints(guide.buyingConsiderations).map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Pricing Overview */}
        {guide.pricingOverview && (
          <section id="pricing" className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Pricing Overview</h2>
            {getPricingOverviewSummary(guide.pricingOverview) && (
              <div className="mb-6">
                <MarkdownContent content={getPricingOverviewSummary(guide.pricingOverview)!} />
              </div>
            )}
            {getPricingOverviewTiers(guide.pricingOverview) && (
              <div className="grid md:grid-cols-3 gap-4">
                {getPricingOverviewTiers(guide.pricingOverview)!.map((tier, index) => (
                  <div key={index} className="bg-white rounded-xl border p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">{tier.name}</h3>
                    </div>
                    <p className="text-xl font-bold text-primary mb-2">{tier.priceRange}</p>
                    <p className="text-sm text-muted-foreground">{tier.bestFor}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Top Picks */}
        <section id="top-picks" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-2">Top Picks</h2>
          <p className="text-muted-foreground mb-6">
            Based on features, user feedback, and value for money.
          </p>
          <div className="space-y-6">
            {guide.topPicks.map((pick) => (
              <div
                key={pick.position}
                className="bg-white rounded-xl border p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    pick.position === 1 ? "bg-yellow-400 text-yellow-900" :
                    pick.position === 2 ? "bg-slate-300 text-slate-700" :
                    "bg-orange-400 text-orange-900"
                  }`}>
                    {pick.position}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{pick.name}</h3>
                      {pick.position === 1 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Top Pick
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium text-sm mb-2">{pick.oneLiner}</p>
                    <p className="text-muted-foreground mb-4">
                      <strong>Best for:</strong> {pick.bestFor}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Pros
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pick.proscons.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Cons
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pick.proscons.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/tools/${pick.toolSlug}`}
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        View {pick.name} details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section id="mistakes" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Common Mistakes to Avoid
          </h2>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <ul className="space-y-3">
              {guide.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-amber-900">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Expert Tips */}
        <section id="tips" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Expert Tips
          </h2>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6">
            <ul className="space-y-3">
              {guide.expertTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-yellow-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bottom Line - Critical for GEO */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              The Bottom Line
            </h2>
            <MarkdownContent content={guide.bottomLine} className="text-lg leading-relaxed" />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <MarkdownContent content={faq.answer} />
              </div>
            ))}
          </div>
        </section>

        {/* Related Guides */}
        {guide.relatedGuides.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4">Related Guides</h2>
            <div className="flex flex-wrap gap-3">
              {guide.relatedGuides.map((slug) => (
                <Link
                  key={slug}
                  href={`/guides/${slug}`}
                  className="px-4 py-2 bg-white border rounded-lg hover:border-primary transition capitalize"
                >
                  {slug.replace(/-/g, ' ').replace('best ', '')}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Choose?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Compare features, read user reviews, and find the perfect tool for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/categories/${guide.category}`}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Browse {guide.category.replace(/-/g, ' ')} Tools
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
