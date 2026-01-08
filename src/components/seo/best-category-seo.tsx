import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Zap, Shield, TrendingUp, Lightbulb, Target, DollarSign, BarChart3 } from "lucide-react";
import { getCategoryContent, type CategoryExpertContent } from "@/content/best-category-content";

interface Tool {
  name: string;
  slug: string;
  tagline?: string | null;
  pricing: string;
  editorialScore?: number | null;
}

interface BestCategorySEOProps {
  categoryName: string;
  categorySlug: string;
  categoryDescription?: string | null;
  tools: Tool[];
  childCategories?: { name: string; slug: string }[];
}

// Icon mapping for dynamic feature icons
const featureIcons: Record<string, React.ElementType> = {
  "Multiple Views": BarChart3,
  "Real-time Collaboration": Users,
  "Automation": Zap,
  "Integrations": Target,
  "Reporting & Dashboards": TrendingUp,
  "Mobile Apps": Shield,
  "Pipeline Management": TrendingUp,
  "Contact & Company Records": Users,
  "Email Integration": Target,
  "Automation & Workflows": Zap,
  "Reporting & Forecasting": BarChart3,
  "Mobile CRM": Shield,
};

export function BestCategorySEO({
  categoryName,
  categorySlug,
  categoryDescription,
  tools,
  childCategories = [],
}: BestCategorySEOProps) {
  const year = new Date().getFullYear();
  const categoryLower = categoryName.toLowerCase();
  const topTool = tools[0];
  const top3 = tools.slice(0, 3);
  const freeTools = tools.filter(t => t.pricing === "free" || t.pricing === "freemium");

  // Check for custom expert content
  const expertContent = getCategoryContent(categorySlug);

  // If we have expert content, render the enhanced version
  if (expertContent) {
    return <ExpertCategorySEO
      content={expertContent}
      tools={tools}
      childCategories={childCategories}
      categorySlug={categorySlug}
    />;
  }

  // Fallback to generic content
  return (
    <div className="space-y-8">
      {/* What is Section */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          What is {categoryName} Software?
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>
            {categoryDescription || `${categoryName} software helps businesses and individuals streamline their ${categoryLower} processes. These tools provide features designed to improve efficiency, collaboration, and outcomes in ${categoryLower} workflows.`}
          </p>
          <p className="mt-3">
            According to our analysis of {tools.length}+ tools, the {categoryLower} software market offers solutions for teams of all sizes, from solo professionals to enterprise organizations. The best {categoryLower} tools in {year} combine powerful features with intuitive interfaces.
          </p>
        </div>
      </section>

      {/* Common Features */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          Common Features of {categoryName} Software
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Zap, title: "Automation", desc: `Automate repetitive ${categoryLower} tasks to save time` },
            { icon: Users, title: "Collaboration", desc: "Work together with team members in real-time" },
            { icon: TrendingUp, title: "Analytics & Reporting", desc: "Track progress and measure performance" },
            { icon: Shield, title: "Security", desc: "Protect sensitive data with enterprise-grade security" },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <feature.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Uses */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          Who Uses {categoryName} Software?
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>
            {categoryName} software is used by a wide range of professionals and organizations:
          </p>
          <ul className="mt-4 space-y-2">
            <li><strong>Small businesses</strong> looking to streamline operations and compete with larger companies</li>
            <li><strong>Enterprise teams</strong> needing scalable solutions for complex {categoryLower} needs</li>
            <li><strong>Freelancers and consultants</strong> managing multiple clients and projects</li>
            <li><strong>Startups</strong> seeking cost-effective tools that can grow with them</li>
          </ul>
        </div>
      </section>

      {/* How to Choose */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          How to Choose the Right {categoryName} Software
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>
            When evaluating {categoryLower} tools, consider these key factors:
          </p>
          <ol className="mt-4 space-y-3">
            <li>
              <strong>Identify your specific needs.</strong> What problems are you trying to solve? List your must-have features versus nice-to-haves.
            </li>
            <li>
              <strong>Consider your budget.</strong> {freeTools.length > 0
                ? `${freeTools.length} tools in our top ${tools.length} offer free plans, including ${freeTools.slice(0, 2).map(t => t.name).join(" and ")}.`
                : "Most tools offer free trials so you can test before committing."}
            </li>
            <li>
              <strong>Evaluate ease of use.</strong> A powerful tool is useless if your team won't adopt it. Look for intuitive interfaces and good onboarding.
            </li>
            <li>
              <strong>Check integrations.</strong> Ensure the tool works with your existing tech stack (CRM, communication tools, etc.).
            </li>
            <li>
              <strong>Read real user reviews.</strong> Our community reviews provide honest feedback from actual users.
            </li>
          </ol>
        </div>
      </section>

      {/* FAQ Section - Visible */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-base mb-2">
              What is the best {categoryLower} software in {year}?
            </h3>
            <p className="text-muted-foreground">
              Based on our analysis of features, user reviews, and overall value, <strong>{topTool?.name}</strong> ranks as the #1 {categoryLower} tool in {year}
              {topTool?.editorialScore ? ` with a score of ${topTool.editorialScore}/100` : ""}.
              Other top-rated options include {top3.slice(1).map(t => t.name).join(" and ")}.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-2">
              Are there free {categoryLower} tools available?
            </h3>
            <p className="text-muted-foreground">
              {freeTools.length > 0
                ? `Yes! ${freeTools.slice(0, 3).map(t => t.name).join(", ")} offer free plans. In total, ${freeTools.length} of the top ${tools.length} ${categoryLower} tools have free or freemium pricing options.`
                : `Most ${categoryLower} tools are paid, but many offer free trials ranging from 7 to 30 days. Check individual tool pages for current pricing and trial options.`}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-2">
              How do you rank {categoryLower} tools?
            </h3>
            <p className="text-muted-foreground">
              Our rankings are based on multiple factors: editorial analysis of features and usability (40%),
              community reviews and ratings (30%), pricing value (15%), and integration capabilities (15%).
              We regularly update rankings as tools evolve and new reviews come in.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-2">
              What should I look for in {categoryLower} software?
            </h3>
            <p className="text-muted-foreground">
              Key factors to consider include: core features that match your workflow, ease of use and learning curve,
              pricing that fits your budget, quality of customer support, integrations with your existing tools,
              and scalability as your needs grow.
            </p>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      {childCategories.length > 0 && (
        <section className="bg-white rounded-xl border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">
            Types of {categoryName} Software
          </h2>
          <p className="text-muted-foreground mb-4">
            Explore specialized subcategories within {categoryLower}:
          </p>
          <div className="flex flex-wrap gap-2">
            {childCategories.map((child) => (
              <Link
                key={child.slug}
                href={`/best/${child.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          Our Ranking Methodology
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>
            At Toolradar, we combine editorial expertise with community insights to rank {categoryLower} tools:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              { label: "Editorial Analysis", value: "40%", desc: "Features, UX, innovation" },
              { label: "User Reviews", value: "30%", desc: "Real feedback from verified users" },
              { label: "Pricing Value", value: "15%", desc: "Cost vs. features offered" },
              { label: "Integrations", value: "15%", desc: "Ecosystem compatibility" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div>
                  <div className="font-medium text-sm text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Rankings are updated regularly as we receive new reviews and as tools release updates.
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Used any of these {categoryLower} tools?
            </h2>
            <p className="text-muted-foreground mt-1">
              Share your experience and help others make better decisions.
            </p>
          </div>
          <Link
            href="/review"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition whitespace-nowrap"
          >
            Write a Review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Browse All */}
      <div className="text-center">
        <Link
          href={`/categories/${categorySlug}`}
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          Browse all {tools.length}+ {categoryName} tools <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Enhanced component using expert content
function ExpertCategorySEO({
  content,
  tools,
  childCategories,
  categorySlug,
}: {
  content: CategoryExpertContent;
  tools: Tool[];
  childCategories: { name: string; slug: string }[];
  categorySlug: string;
}) {
  const year = new Date().getFullYear();
  const freeTools = tools.filter(t => t.pricing === "free" || t.pricing === "freemium");
  const topTool = tools[0];

  return (
    <div className="space-y-8">
      {/* What is Section - Expert Content */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          {content.whatIs.title}
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          {content.whatIs.paragraphs.map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Key Features - Expert Content */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          {content.keyFeatures.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {content.keyFeatures.features.map((feature, index) => {
            const IconComponent = featureIcons[feature.name] || [Zap, Users, TrendingUp, Shield, Target, BarChart3][index % 6];
            return (
              <div key={feature.name} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <IconComponent className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Who Uses - Expert Content */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          {content.whoUses.title}
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>{content.whoUses.intro}</p>
          <div className="mt-4 space-y-4 not-prose">
            {content.whoUses.audiences.map((audience) => (
              <div key={audience.name} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-foreground">{audience.name}:</span>{" "}
                  <span className="text-muted-foreground">{audience.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose - Expert Content */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          {content.howToChoose.title}
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>{content.howToChoose.intro}</p>
          <ol className="mt-4 space-y-4">
            {content.howToChoose.criteria.map((criterion, index) => (
              <li key={index} className="pl-2">
                <strong className="text-foreground">{criterion.title}.</strong>{" "}
                {criterion.description}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Market Insights - Expert Content (if available) */}
      {content.marketInsights && (
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h2 className="text-xl font-semibold">
              {content.marketInsights.title}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {content.marketInsights.content}
          </p>
        </section>
      )}

      {/* Expert FAQs */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {content.faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="font-medium text-base mb-2">
                {faq.question}
              </h3>
              <p className="text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic FAQ based on actual data */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">
          Quick Facts About This Category
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-primary">#{1}</div>
            <div>
              <div className="font-medium">{topTool?.name || "Top Tool"}</div>
              <div className="text-sm text-muted-foreground">
                {topTool?.editorialScore ? `Score: ${topTool.editorialScore}/100` : "Top rated"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{freeTools.length}</div>
            <div>
              <div className="font-medium">Free Tools</div>
              <div className="text-sm text-muted-foreground">With free or freemium plans</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{tools.length}</div>
            <div>
              <div className="font-medium">Tools Reviewed</div>
              <div className="text-sm text-muted-foreground">In this category</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{year}</div>
            <div>
              <div className="font-medium">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { month: "long" })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      {childCategories.length > 0 && (
        <section className="bg-white rounded-xl border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">
            Related Categories
          </h2>
          <p className="text-muted-foreground mb-4">
            Explore specialized subcategories:
          </p>
          <div className="flex flex-wrap gap-2">
            {childCategories.map((child) => (
              <Link
                key={child.slug}
                href={`/best/${child.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      <section className="bg-white rounded-xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          Our Ranking Methodology
        </h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>
            At Toolradar, we combine editorial expertise with community insights:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              { label: "Editorial Analysis", value: "40%", desc: "Features, UX, innovation" },
              { label: "User Reviews", value: "30%", desc: "Real feedback from verified users" },
              { label: "Pricing Value", value: "15%", desc: "Cost vs. features offered" },
              { label: "Integrations", value: "15%", desc: "Ecosystem compatibility" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div>
                  <div className="font-medium text-sm text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Rankings are updated regularly. Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Have experience with these tools?
            </h2>
            <p className="text-muted-foreground mt-1">
              Your review helps thousands of others make better decisions.
            </p>
          </div>
          <Link
            href="/review"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition whitespace-nowrap"
          >
            Write a Review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Browse All */}
      <div className="text-center">
        <Link
          href={`/categories/${categorySlug}`}
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          Browse all {tools.length}+ tools in this category <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
