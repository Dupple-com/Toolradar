import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolLogo } from "@/components/tools/tool-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { BookOpen, CheckCircle, Star, ArrowRight, Users, DollarSign, Zap, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { getGuideContent } from "@/content/guide-content";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { topic: string } }): Promise<Metadata> {
  const { topic } = params;

  const category = await prisma.category.findUnique({
    where: { slug: topic },
  });

  if (!category) return { title: "Guide Not Found" };

  const expertContent = getGuideContent(topic);
  const title = `${category.name} Software Guide ${new Date().getFullYear()} | How to Choose the Best Tool`;
  const description = expertContent
    ? `${expertContent.intro.slice(0, 150)}... Complete ${category.name.toLowerCase()} buying guide.`
    : `Complete guide to ${category.name.toLowerCase()} software. Learn what features matter, compare pricing models, and discover which tools work best for your needs.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/guides/${topic}`,
      siteName: "Toolradar",
      type: "article",
    },
    alternates: {
      canonical: `https://toolradar.com/guides/${topic}`,
    },
  };
}

export default async function GuidePage({ params }: { params: { topic: string } }) {
  const { topic } = params;

  const category = await prisma.category.findUnique({
    where: { slug: topic },
    include: {
      tools: {
        where: { tool: { status: "published" } },
        include: {
          tool: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              tagline: true,
              editorialScore: true,
              pricing: true,
              _count: { select: { reviews: true } },
            },
          },
        },
        take: 50,
      },
      children: {
        include: {
          _count: { select: { tools: true } },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const tools = category.tools
    .map((ct) => ct.tool)
    .sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0));

  const topTools = tools.slice(0, 5);
  const freeTools = tools.filter((t) => t.pricing === "free" || t.pricing === "freemium").slice(0, 3);
  const paidTools = tools.filter((t) => t.pricing === "paid" || t.pricing === "subscription").slice(0, 3);

  const year = new Date().getFullYear();
  const categoryName = category.name;
  const categoryNameLower = category.name.toLowerCase();

  // Get expert content if available
  const expertContent = getGuideContent(topic);

  // Generate human-like content based on category (fallback)
  const guideContent = generateGuideContent(categoryName, categoryNameLower, tools.length, year);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: categoryName, url: `/guides/${topic}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${categoryName} Software Guide ${year}`,
    description: `Complete guide to choosing ${categoryNameLower} software`,
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

  // Use expert FAQs when available
  const faqItems = expertContent ? expertContent.faqs : guideContent.faqs;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
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
              <span className="text-foreground">{categoryName}</span>
            </nav>

            <div className="flex items-center gap-2 text-sm text-primary mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Buying Guide</span>
              <span className="text-muted-foreground">• Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {categoryName} Software Guide {year}
            </h1>
            <p className="text-lg text-muted-foreground">
              {expertContent ? expertContent.intro : guideContent.intro}
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border p-6 -mt-8 relative z-10 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{tools.length}</div>
                <div className="text-sm text-muted-foreground">Tools Reviewed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{freeTools.length}</div>
                <div className="text-sm text-muted-foreground">Free Options</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{topTools[0]?.editorialScore || 0}</div>
                <div className="text-sm text-muted-foreground">Top Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{year}</div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <h2 className="font-semibold mb-3">In This Guide</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#what-is" className="text-primary hover:underline">What is {categoryName} Software?</a>
              <a href="#top-picks" className="text-primary hover:underline">Top {categoryName} Tools</a>
              <a href="#features" className="text-primary hover:underline">Essential Features to Look For</a>
              <a href="#pricing" className="text-primary hover:underline">Pricing & Budget Considerations</a>
              <a href="#how-to-choose" className="text-primary hover:underline">How to Choose the Right Tool</a>
              {expertContent && <a href="#implementation-tips" className="text-primary hover:underline">Implementation Tips</a>}
              <a href="#faq" className="text-primary hover:underline">Frequently Asked Questions</a>
            </div>
          </div>
        </section>

        {/* What Is Section */}
        <section id="what-is" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">What is {categoryName} Software?</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground">{expertContent ? expertContent.whatIs : guideContent.whatIs}</p>
            <p className="text-muted-foreground mt-4">{expertContent ? expertContent.whyMatters : guideContent.whyMatters}</p>
          </div>
        </section>

        {/* Top Picks */}
        <section id="top-picks" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-2">Top {categoryName} Tools in {year}</h2>
          <p className="text-muted-foreground mb-6">
            Based on our analysis of features, user reviews, and overall value, these are the leading
            {categoryNameLower} solutions available today.
          </p>
          <div className="space-y-4">
            {topTools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="block bg-white rounded-xl border p-5 hover:shadow-lg hover:border-primary/50 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <ToolLogo src={tool.logo} name={tool.name} className="w-14 h-14 rounded-xl" />
                    <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-400 text-yellow-900" :
                      index === 1 ? "bg-slate-300 text-slate-700" :
                      index === 2 ? "bg-orange-400 text-orange-900" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition">{tool.name}</h3>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Editor's Choice</span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{tool.tagline}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{tool.editorialScore}/100</span>
                      </span>
                      <span className="text-muted-foreground capitalize">{tool.pricing?.replace("_", " ") || "Contact"}</span>
                      <span className="text-muted-foreground">{tool._count.reviews} reviews</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/best/${topic}`}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View all {tools.length} {categoryNameLower} tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Essential Features */}
        <section id="features" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Essential Features to Look For</h2>
          {!expertContent && (
            <p className="text-muted-foreground mb-6">
              {guideContent.featuresIntro}
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {expertContent ? (
              expertContent.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <p className="text-xs text-primary italic">{feature.whyItMatters}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              guideContent.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Pricing & Budget Considerations</h2>
          <div className="prose prose-slate max-w-none mb-6">
            <p className="text-muted-foreground">
              {expertContent ? expertContent.pricingGuide.overview : guideContent.pricingIntro}
            </p>
          </div>

          {/* Expert Pricing Tiers */}
          {expertContent && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {expertContent.pricingGuide.tiers.map((tier, index) => (
                <div key={index} className="bg-white rounded-xl border p-4">
                  <h3 className="font-semibold text-sm text-muted-foreground">{tier.tier}</h3>
                  <p className="text-xl font-bold text-primary mt-1">{tier.priceRange}</p>
                  <p className="text-sm text-muted-foreground mt-2">{tier.bestFor}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Options */}
            {freeTools.length > 0 && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Free & Freemium Options</h3>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Great for individuals or small teams just getting started.
                </p>
                <div className="space-y-2">
                  {freeTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-green-100 transition"
                    >
                      <ToolLogo src={tool.logo} name={tool.name} className="w-8 h-8 rounded" />
                      <span className="font-medium text-sm">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Paid Options */}
            {paidTools.length > 0 && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Premium Solutions</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  More features and support for growing businesses.
                </p>
                <div className="space-y-2">
                  {paidTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-blue-100 transition"
                    >
                      <ToolLogo src={tool.logo} name={tool.name} className="w-8 h-8 rounded" />
                      <span className="font-medium text-sm">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How to Choose */}
        <section id="how-to-choose" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">How to Choose the Right {categoryName} Tool</h2>
          <div className="bg-white rounded-xl border p-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground">{guideContent.howToChoose}</p>

              {expertContent ? (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Evaluation Criteria
                  </h3>
                  <ul className="space-y-2">
                    {expertContent.evaluationCriteria.map((criteria, index) => (
                      <li key={index} className="text-muted-foreground">{criteria}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Questions to Ask Yourself</h3>
                  <ul className="space-y-2">
                    {guideContent.questions.map((question, index) => (
                      <li key={index} className="text-muted-foreground">{question}</li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                {expertContent ? "Common Pitfalls to Avoid" : "Red Flags to Watch For"}
              </h3>
              <ul className="space-y-2">
                {expertContent ? (
                  expertContent.pitfalls.map((pitfall, index) => (
                    <li key={index} className="text-muted-foreground">{pitfall}</li>
                  ))
                ) : (
                  guideContent.redFlags.map((flag, index) => (
                    <li key={index} className="text-muted-foreground">{flag}</li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Implementation Tips - Expert Only */}
        {expertContent && (
          <section id="implementation-tips" className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Implementation Tips
            </h2>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6">
              <p className="text-muted-foreground">{expertContent.implementationTips}</p>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        {category.children.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4">Related Categories</h2>
            <div className="flex flex-wrap gap-3">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/guides/${child.slug}`}
                  className="px-4 py-2 bg-white border rounded-lg hover:border-primary transition"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Find Your Perfect {categoryName} Tool?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Compare features, read reviews, and see how each tool stacks up against the competition.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/best/${topic}`}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                View All {categoryName} Tools
              </Link>
              <Link
                href={`/compare?category=${topic}`}
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

function generateGuideContent(categoryName: string, categoryNameLower: string, toolCount: number, year: number) {
  // Generate human-like, non-telegraphic content
  return {
    intro: `This guide will help you understand what to look for in ${categoryNameLower} software, which tools are leading the market in ${year}, and how to make a decision that actually fits your needs. We've reviewed ${toolCount} tools in this category to give you a clear picture of your options.`,

    whatIs: `${categoryName} software helps businesses and individuals manage tasks that would otherwise be time-consuming, error-prone, or simply impossible to handle manually. At its core, this type of software is designed to streamline workflows, improve efficiency, and give you better visibility into your operations.`,

    whyMatters: `The right ${categoryNameLower} tool can genuinely transform how you work. But the wrong one can create frustration, waste money, and actually slow you down. That's why it's worth taking the time to understand what you're looking for before committing to a solution. The good news is that there are excellent options at every price point, from free tools for individuals to enterprise solutions for large organizations.`,

    featuresIntro: `Not every feature matters equally for every use case. The features below are the ones that consistently make the biggest difference according to users who work with ${categoryNameLower} software daily. Focus on the ones that align with your specific needs rather than trying to find a tool that has everything.`,

    features: [
      {
        name: "User Interface & Ease of Use",
        description: "Software is only useful if people actually use it. A clean, intuitive interface reduces training time and increases adoption across your team."
      },
      {
        name: "Integration Capabilities",
        description: "Your tools need to work together. Look for native integrations with the software you already use, or robust API support for custom connections."
      },
      {
        name: "Reporting & Analytics",
        description: "Good reporting helps you understand what's working and what isn't. The best tools make it easy to track the metrics that matter to your business."
      },
      {
        name: "Collaboration Features",
        description: "If multiple people will use the tool, collaboration features like sharing, comments, and role-based access become essential."
      },
      {
        name: "Mobile Access",
        description: "Work doesn't always happen at a desk. Mobile apps or responsive design let you stay productive wherever you are."
      },
      {
        name: "Customer Support",
        description: "When something goes wrong, you need help fast. Quality of support varies dramatically between vendors, so check reviews specifically about support."
      }
    ],

    pricingIntro: `${categoryName} software spans a wide range of price points. Free tools can be perfectly adequate for individuals or small teams with basic needs. As your requirements grow—more users, more features, more integrations—you'll typically need to move to paid plans. The key is matching what you pay to what you actually need.`,

    howToChoose: `Choosing the right ${categoryNameLower} tool comes down to understanding your specific situation. Start with your most critical needs—the problems you absolutely must solve. Then consider your budget, your team's technical comfort level, and how this tool will fit with your existing workflow. It's also worth taking advantage of free trials; actually using a tool for a week or two tells you more than any amount of research.`,

    questions: [
      "What specific problems are you trying to solve? Be concrete about your pain points.",
      "How many people will use this tool, and what are their technical skill levels?",
      "What other tools does this need to integrate with?",
      "What's your budget, and is it a one-time cost or ongoing subscription?",
      "How important is mobile access for your team?",
      "Do you need enterprise features like SSO, advanced permissions, or audit logs?"
    ],

    redFlags: [
      "Vendors that make it difficult to export your data or cancel your subscription",
      "Pricing that's not transparent or requires a sales call for basic information",
      "Consistently negative reviews about customer support response times",
      "Software that hasn't been updated in over a year",
      "Overly complicated setup that requires extensive consulting or professional services"
    ],

    faqs: [
      {
        question: `What is the best ${categoryNameLower} software in ${year}?`,
        answer: `The "best" tool depends entirely on your needs. For most small to medium businesses, we recommend looking at our top-rated options and comparing features against your specific requirements. There's no single best choice that works for everyone.`
      },
      {
        question: `How much does ${categoryNameLower} software cost?`,
        answer: `Prices range from free (with limited features) to hundreds of dollars per month for enterprise solutions. Most businesses find a good fit in the $10-50 per user per month range, though you may pay more for specialized features or larger teams.`
      },
      {
        question: `Can I try ${categoryNameLower} software before buying?`,
        answer: `Yes, most vendors offer free trials ranging from 7 to 30 days. We strongly recommend taking advantage of these trials with your actual data and workflows before making a decision.`
      },
      {
        question: `What's the difference between free and paid ${categoryNameLower} tools?`,
        answer: `Free tools typically limit the number of users, storage, or features available. They're often sufficient for individuals or very small teams. Paid tools offer more users, advanced features, integrations, and usually better support.`
      },
      {
        question: `How long does it take to implement ${categoryNameLower} software?`,
        answer: `Simple tools can be up and running in hours. More complex enterprise solutions might take weeks or months to fully implement, especially if you're migrating data from existing systems or need custom integrations.`
      }
    ]
  };
}
