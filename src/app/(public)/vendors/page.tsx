import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  TrendingUp,
  Star,
  Zap,
  BarChart3,
  Search,
  Globe,
  MessageSquare,
  Bot,
  Target,
  CheckCircle,
  Building2
} from "lucide-react";

export const metadata = {
  title: "List Your Software | Toolradar - Get Discovered by Buyers",
  description: "Get your software discovered by thousands of buyers. Appear in Google and AI search results. Free listing with reviews and analytics.",
};

export default async function VendorsPage() {
  // Get real stats
  const [toolCount, reviewCount, categoryCount] = await Promise.all([
    prisma.tool.count({ where: { status: "published" } }),
    prisma.review.count({ where: { status: "approved" } }),
    prisma.category.count(),
  ]);

  const benefits = [
    {
      icon: Bot,
      title: "AI Search Visibility",
      description: "Get discovered when users ask ChatGPT, Perplexity, or Claude for tool recommendations. AI assistants cite trusted review platforms.",
    },
    {
      icon: Search,
      title: "SEO & Organic Traffic",
      description: "Rank in Google for \"best [category] tools\" and comparison searches. Our optimized pages drive high-intent traffic to your listing.",
    },
    {
      icon: Star,
      title: "Build Social Proof",
      description: "Collect authentic reviews from real users. Verified reviews build trust and influence purchase decisions.",
    },
    {
      icon: Target,
      title: "Reach Active Buyers",
      description: "Connect with decision-makers actively researching software tools. High-intent visitors are ready to evaluate and buy.",
    },
    {
      icon: BarChart3,
      title: "Competitive Intelligence",
      description: "See how you compare to alternatives. Understand what users value and where you stand in your category.",
    },
    {
      icon: Globe,
      title: "Global Exposure",
      description: "Reach an international audience of developers, marketers, founders, and enterprise buyers discovering tools.",
    },
  ];

  const stats = [
    { value: `${toolCount}+`, label: "Tools Listed" },
    { value: `${reviewCount}+`, label: "User Reviews" },
    { value: `${categoryCount}+`, label: "Categories" },
    { value: "100%", label: "Free to List" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Zap size={14} className="text-blue-500" />
            <span className="text-blue-600 font-medium text-sm">For Software Companies</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-[-0.02em] leading-[1.1]">
            Get Your Software
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Discovered</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            Join {toolCount}+ tools on Toolradar. Get found by buyers searching on Google, ChatGPT, Perplexity, and other AI assistants.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link
              href="/company/submit"
              className="group px-6 py-3.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all duration-150 flex items-center justify-center gap-2"
            >
              List Your Tool — Free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/company"
              className="px-6 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-medium transition-all duration-150"
            >
              Company Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Visibility Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              <Bot size={14} />
              Modern Discovery
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              How Buyers Find Software Today
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Buyers use Google, AI assistants, and review platforms to research tools. ChatGPT, Perplexity, and Claude recommend products from trusted platforms like Toolradar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">ChatGPT & Claude</h3>
              <p className="text-sm text-slate-500">AI assistants cite Toolradar when recommending tools to users</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Google & Perplexity</h3>
              <p className="text-sm text-slate-500">Rank for high-intent searches like &quot;best tools for X&quot;</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Category Rankings</h3>
              <p className="text-sm text-slate-500">Appear in &quot;Best of&quot; lists and comparison pages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Why List on Toolradar</h2>
            <p className="text-3xl font-semibold text-slate-900">Everything You Need to Grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <benefit.icon size={20} className="text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                Everything Included — Free
              </h2>
              <p className="text-slate-500 mb-8">
                Get a complete profile with all the features you need to attract and convert buyers. No hidden fees.
              </p>
              <ul className="space-y-4">
                {[
                  "Dedicated tool profile page",
                  "Category and search placement",
                  "User reviews and ratings",
                  "Comparison with alternatives",
                  "Profile analytics and insights",
                  "Verified company badge",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Your Tool Name</div>
                  <div className="text-sm text-slate-500">yourcompany.com</div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">4.8 (124 reviews)</span>
                </div>
                <div className="text-sm text-slate-600">
                  Powerful solution for modern teams...
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">SaaS</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Freemium</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Productivity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Benefits */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <Search size={14} />
              SEO Benefits
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Boost Your Search Rankings
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Every listing comes with powerful SEO benefits to help your software get discovered organically.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Globe size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Dofollow Backlink</h3>
              <p className="text-sm text-slate-500">
                Get a high-quality dofollow backlink from toolradar.com to your website. Boost your domain authority and search rankings.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Star size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Rich Snippets</h3>
              <p className="text-sm text-slate-500">
                Your tool appears with star ratings, review counts, and pricing in Google search results. Stand out from competitors.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Comparison Pages</h3>
              <p className="text-sm text-slate-500">
                Appear on &quot;X vs Y&quot; comparison pages. Rank for competitor keywords and capture switchers.
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                <Globe size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">Free Dofollow Backlink</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">SEO Boost</span>
                </div>
                <p className="text-sm text-slate-600">
                  Add our embeddable widget to your website and get a <strong>free dofollow backlink</strong> from toolradar.com. Boost your domain authority and climb Google rankings while displaying your verified rating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Simple Pricing</h2>
            <p className="text-3xl font-semibold text-slate-900">Start Free, Upgrade When Ready</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                <p className="text-slate-500 text-sm mt-1">Everything you need to get started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Full tool profile page",
                  "Category & search placement",
                  "Collect unlimited reviews",
                  "Basic analytics",
                  "Claim company profile",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/company/submit"
                className="block w-full py-3 text-center bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro tier */}
            <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">Coming Soon</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Pro</h3>
                <p className="text-slate-400 text-sm mt-1">For companies ready to scale</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Featured placement",
                  "Advanced analytics & leads",
                  "Competitor insights",
                  "Priority support",
                  "Custom integrations",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={16} className="text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full py-3 text-center bg-white/20 text-white/60 rounded-lg font-medium cursor-not-allowed"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to Get Discovered?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join {toolCount}+ tools already on Toolradar. Free to list, takes 2 minutes.
          </p>
          <Link
            href="/company/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 font-medium transition-all text-lg"
          >
            List Your Tool Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
