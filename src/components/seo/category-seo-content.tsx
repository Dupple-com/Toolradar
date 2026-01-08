"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Lightbulb, Target, HelpCircle } from "lucide-react";

interface SEOContent {
  definition?: string;
  features?: string[];
  benefits?: string[];
  buyersGuide?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

interface CategorySEOContentProps {
  categoryName: string;
  seoContent?: SEOContent | null;
  toolCount: number;
  topToolName?: string;
}

// Generate default content if none provided
function getDefaultContent(categoryName: string, toolCount: number, topToolName?: string): SEOContent {
  const name = categoryName.toLowerCase();
  const year = new Date().getFullYear();

  return {
    definition: `${categoryName} software helps businesses and individuals streamline their workflows by providing specialized tools designed for ${name}-related tasks. These solutions range from simple, free tools to comprehensive enterprise platforms, each offering different capabilities to match various needs and budgets. Whether you're a solo entrepreneur or managing a large team, the right ${name} tool can significantly improve your productivity and results.`,

    features: [
      `Intuitive user interface that minimizes the learning curve`,
      `Integration capabilities with popular tools and platforms`,
      `Collaboration features for team-based workflows`,
      `Analytics and reporting to track performance`,
      `Mobile accessibility for working on the go`,
      `Customization options to fit your specific needs`,
      `Reliable customer support and documentation`,
    ],

    benefits: [
      `Save time by automating repetitive tasks`,
      `Improve accuracy and reduce human errors`,
      `Enhance team collaboration and communication`,
      `Gain insights through data-driven analytics`,
      `Scale your operations without proportional cost increases`,
      `Stay competitive with modern, efficient workflows`,
    ],

    buyersGuide: `When choosing ${name} software, start by clearly defining your requirements. Consider your team size, budget constraints, and must-have features. Look for tools that offer free trials so you can test the interface and functionality before committing. Pay attention to integration options with your existing tech stack, and don't overlook the importance of good customer support. Reading user reviews on platforms like Toolradar can provide valuable insights from people who've actually used these tools in real-world scenarios.`,

    faqs: [
      {
        question: `What is the best ${name} software in ${year}?`,
        answer: topToolName
          ? `Based on user reviews and our editorial analysis, ${topToolName} is currently the top-rated ${name} software. However, the "best" choice depends on your specific needs, budget, and use case. We recommend comparing multiple options using our detailed reviews and comparison tools.`
          : `The best ${name} software depends on your specific requirements. We recommend exploring our top-rated options above and reading user reviews to find the right fit for your needs.`,
      },
      {
        question: `Are there free ${name} tools available?`,
        answer: `Yes, many ${name} tools offer free plans or freemium models. These are great for individuals and small teams getting started. As your needs grow, you might want to upgrade to paid plans that offer more features and higher limits.`,
      },
      {
        question: `How do I choose the right ${name} software for my business?`,
        answer: `Start by listing your must-have features and setting a budget. Then, take advantage of free trials to test different options. Consider factors like ease of use, integration capabilities, scalability, and customer support. Reading reviews from users with similar needs can also help inform your decision.`,
      },
      {
        question: `Can ${name} software integrate with other tools I use?`,
        answer: `Most modern ${name} software offers integrations with popular tools and platforms. Check each tool's integration page or ask their support team about specific integrations you need. Many also offer API access for custom integrations.`,
      },
    ],
  };
}

export function CategorySEOContent({ categoryName, seoContent, toolCount, topToolName }: CategorySEOContentProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Use provided content or generate defaults
  const content = seoContent || getDefaultContent(categoryName, toolCount, topToolName);
  const year = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* What is X Software? */}
      {content.definition && (
        <section className="bg-white rounded-xl border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            What is {categoryName} Software?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.definition}
          </p>
        </section>
      )}

      {/* Key Features + Benefits - Side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Features */}
        {content.features && content.features.length > 0 && (
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Key Features to Look For
            </h2>
            <ul className="space-y-3">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Benefits */}
        {content.benefits && content.benefits.length > 0 && (
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Benefits of {categoryName} Software
            </h2>
            <ul className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Buyer's Guide */}
      {content.buyersGuide && (
        <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-4">
            How to Choose the Right {categoryName} Software
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.buyersGuide}
          </p>
        </section>
      )}

      {/* FAQ Section */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="bg-white rounded-xl border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions About {categoryName} Software
          </h2>
          <div className="space-y-3">
            {content.faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Last Updated */}
      <p className="text-center text-xs text-muted-foreground">
        This guide was last updated in {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
        We regularly review and update our recommendations to ensure accuracy.
      </p>
    </div>
  );
}
