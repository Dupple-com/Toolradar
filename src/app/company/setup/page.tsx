import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompanySetupForm } from "@/components/company/setup-form";
import { Rocket, BarChart3, Shield, Check } from "lucide-react";

export default async function CompanySetupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Check if user already has a company
  const existingMembership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
    include: { company: true },
  });

  // Get company from membership or direct relation
  const existingCompany = existingMembership?.company ||
    (!existingMembership ? await prisma.company.findUnique({ where: { userId: user.id } }) : null);

  if (existingCompany) {
    // If verified, go to dashboard
    if (existingCompany.verifiedAt) {
      redirect("/company");
    }
    // If pending verification, go to verify page
    if (existingCompany.verificationToken) {
      redirect(`/company/verify?token=${existingCompany.verificationToken}`);
    }
  }

  const benefits = [
    "Submit unlimited tools",
    "Analytics dashboard",
    "Verified vendor badge",
    "Respond to reviews",
    "Priority support",
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-8">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border shadow-xl">
          {/* Left side - Benefits */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-10 text-white">
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  For Vendors
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                  Grow your business on Toolradar
                </h1>
                <p className="text-white/80">
                  Join thousands of software vendors reaching new customers every day.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex justify-center mb-1">
                      <Rocket className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="text-xl font-bold">1k+</div>
                    <div className="text-xs text-white/70">Tools listed</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-1">
                      <BarChart3 className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="text-xl font-bold">50k+</div>
                    <div className="text-xs text-white/70">Monthly visitors</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-1">
                      <Shield className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="text-xl font-bold">100%</div>
                    <div className="text-xs text-white/70">Free to join</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-3 bg-white p-8 lg:p-10">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-1">Create your profile</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Get started in less than a minute
              </p>
              <CompanySetupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
