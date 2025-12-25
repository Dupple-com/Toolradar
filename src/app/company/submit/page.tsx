import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SubmitToolForm } from "@/components/company/submit-form";
import {
  Search,
  Star,
  Users,
  BarChart3,
  Globe,
  MessageSquare,
  Zap,
  CheckCircle
} from "lucide-react";

export default async function SubmitToolPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Check if user has a company
  const membership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
  });

  const legacyCompany = !membership ? await prisma.company.findUnique({
    where: { userId: user.id },
  }) : null;

  if (!membership && !legacyCompany) {
    redirect("/company/setup");
  }

  // Get some stats for social proof
  const [toolCount, reviewCount] = await Promise.all([
    prisma.tool.count({ where: { status: "published" } }),
    prisma.review.count({ where: { status: "approved" } }),
  ]);

  return (
    <div className="max-w-4xl">
      {/* Hero Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">List Your AI Tool on Toolradar</h1>
        <p className="text-lg text-muted-foreground">
          Join {toolCount}+ AI tools and get discovered by thousands of buyers actively searching for solutions like yours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Benefits */}
        <div className="md:col-span-2 space-y-8">
          {/* Key Benefits */}
          <section className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-6">Why List Your Tool?</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <BenefitCard
                icon={<Search className="h-5 w-5 text-blue-500" />}
                title="AI & SEO Visibility"
                description="Get discovered in Google searches and AI assistants like ChatGPT, Perplexity, and Claude that recommend tools to users."
              />
              <BenefitCard
                icon={<Star className="h-5 w-5 text-yellow-500" />}
                title="Build Credibility"
                description="Authentic user reviews and ratings build trust with potential customers evaluating your solution."
              />
              <BenefitCard
                icon={<Users className="h-5 w-5 text-green-500" />}
                title="Reach Active Buyers"
                description="Connect with decision-makers actively researching AI tools in your category, ready to buy."
              />
              <BenefitCard
                icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
                title="Competitive Insights"
                description="See how you compare to alternatives and understand what users value most in your category."
              />
              <BenefitCard
                icon={<Globe className="h-5 w-5 text-cyan-500" />}
                title="Global Exposure"
                description="Reach an international audience of developers, marketers, and business leaders discovering AI tools."
              />
              <BenefitCard
                icon={<Zap className="h-5 w-5 text-orange-500" />}
                title="Drive Conversions"
                description="High-intent traffic from users comparing solutions leads to better conversion rates than cold outreach."
              />
            </div>
          </section>

          {/* What You Get */}
          <section className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">What&apos;s Included</h2>
            <ul className="space-y-3">
              {[
                "Dedicated tool profile page with rich details",
                "Appear in category listings and search results",
                "Collect and showcase user reviews",
                "Compare against alternatives in your category",
                "Analytics on profile views and engagement",
                "Claim and verify your company profile",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* The Form */}
          <section>
            <h2 className="font-semibold text-lg mb-4">Submit Your Tool</h2>
            <SubmitToolForm />
          </section>
        </div>

        {/* Right Column - Stats & Info */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Toolradar by the Numbers</h3>
            <div className="space-y-4">
              <StatItem value={`${toolCount}+`} label="AI Tools Listed" />
              <StatItem value={`${reviewCount}+`} label="User Reviews" />
              <StatItem value="50+" label="Categories" />
              <StatItem value="Free" label="To Get Listed" />
            </div>
          </div>

          {/* Who It's For */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Perfect For</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                AI Startups & SaaS
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Developer Tools
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                Productivity Apps
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                Creative AI Tools
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                Enterprise Solutions
              </li>
            </ul>
          </div>

          {/* Review Process */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Review Process</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">1</span>
                <span>Submit your tool details</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">2</span>
                <span>Our team reviews within 48h</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">3</span>
                <span>Get listed and start collecting reviews</span>
              </li>
            </ol>
          </div>

          {/* Questions */}
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Have questions?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact us at{" "}
                  <a href="mailto:hello@toolradar.com" className="text-primary hover:underline">
                    hello@toolradar.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
