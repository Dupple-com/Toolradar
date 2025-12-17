import Link from "next/link";
import { ArrowRight, Users, TrendingUp, Star, Shield, Zap, BarChart3 } from "lucide-react";

export const metadata = {
  title: "List Your Product | Toolradar",
  description: "Get your software discovered by thousands of professionals. Join Toolradar's marketplace.",
};

export default function VendorsPage() {
  const benefits = [
    {
      icon: Users,
      title: "Reach your audience",
      description: "Connect with professionals actively searching for tools like yours.",
    },
    {
      icon: TrendingUp,
      title: "Boost visibility",
      description: "Get featured in trending lists and category rankings.",
    },
    {
      icon: Star,
      title: "Build credibility",
      description: "Collect verified reviews from real users to build trust.",
    },
    {
      icon: BarChart3,
      title: "Track performance",
      description: "Access analytics to understand how users engage with your listing.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-8">
            <Zap size={14} className="text-slate-500" />
            <span className="text-slate-600 font-medium text-sm">For Software Companies</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 tracking-[-0.02em] leading-[1.1]">
            Get your product
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">discovered</span>
          </h1>
          <p className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
            Join thousands of software companies reaching millions of professionals on Toolradar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link
              href="/company/submit"
              className="group px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all duration-150 flex items-center justify-center gap-2"
            >
              Submit your product
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/company"
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-medium transition-all duration-150"
            >
              Company Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Why list on Toolradar</h2>
            <p className="text-3xl font-semibold text-slate-900">Everything you need to grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4 p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <benefit.icon size={20} className="text-slate-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Simple pricing</h2>
            <p className="text-3xl font-semibold text-slate-900">Start for free</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                <p className="text-slate-500 text-sm mt-1">Get started with the basics</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield size={16} className="text-emerald-500" />
                  Basic listing
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield size={16} className="text-emerald-500" />
                  Collect reviews
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield size={16} className="text-emerald-500" />
                  Category placement
                </li>
              </ul>
              <Link
                href="/company/submit"
                className="block w-full py-3 text-center bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro tier */}
            <div className="bg-slate-900 rounded-xl p-8 text-white">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Pro</h3>
                <p className="text-slate-400 text-sm mt-1">For growing companies</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield size={16} className="text-blue-400" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield size={16} className="text-blue-400" />
                  Featured placement
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield size={16} className="text-blue-400" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield size={16} className="text-blue-400" />
                  Priority support
                </li>
              </ul>
              <Link
                href="/company/submit"
                className="block w-full py-3 text-center bg-white text-slate-900 rounded-lg hover:bg-slate-100 font-medium transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Ready to get started?</h2>
          <p className="text-slate-500 mb-8">Submit your product today and start reaching your audience.</p>
          <Link
            href="/company/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all"
          >
            Submit your product
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
