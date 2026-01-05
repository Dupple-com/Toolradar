import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Rocket,
  PlusCircle,
  BarChart3,
  BadgeCheck,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

export default async function CompanyOnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Get user's company
  const membership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
    include: { company: true },
  });

  if (!membership?.company?.verifiedAt) {
    redirect("/company/setup");
  }

  const company = membership.company;

  // Get tool count
  const toolCount = await prisma.tool.count({
    where: { companyId: company.id },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <PartyPopper className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Toolradar!</h1>
          <p className="text-lg text-muted-foreground">
            {company.name} is now verified. Here&apos;s what you can do next.
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
          {/* Steps */}
          <div className="divide-y">
            {/* Step 1: Submit your first tool */}
            <div className="p-6 flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  toolCount > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {toolCount > 0 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <PlusCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Submit your first tool</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add your product to reach thousands of potential customers
                  searching for solutions.
                </p>
                {toolCount === 0 && (
                  <Link
                    href="/company/submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    Submit Tool
                  </Link>
                )}
              </div>
            </div>

            {/* Step 2: Complete your profile */}
            <div className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Complete your profile</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a logo and description to build trust with potential
                  customers.
                </p>
                <Link
                  href="/company/settings"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Edit profile
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Step 3: Explore analytics */}
            <div className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Track your performance</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor views, clicks, and engagement on your tool listings.
                </p>
                <Link
                  href="/company/analytics"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View analytics
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-muted/30 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Ready to explore your dashboard?
              </p>
              <Link
                href="/company"
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
