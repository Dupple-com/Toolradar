import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompanySetupForm } from "@/components/company/setup-form";
import { Building2, Rocket, BarChart3, Shield } from "lucide-react";

export default async function CompanySetupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Check if user already has a company
  const existingMembership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
  });

  const existingCompany = !existingMembership
    ? await prisma.company.findUnique({ where: { userId: user.id } })
    : null;

  if (existingMembership || existingCompany) {
    redirect("/company");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Left side - Benefits */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Create Your Company Profile</h1>
            <p className="text-muted-foreground text-lg">
              Join Toolradar as a vendor and reach thousands of potential customers looking for tools like yours.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit Your Tools</h3>
                <p className="text-sm text-muted-foreground">
                  List your products and reach users actively searching for solutions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor views, clicks, and engagement on your tool listings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verified Badge</h3>
                <p className="text-sm text-muted-foreground">
                  Get a verified badge to build trust with potential customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div>
          <CompanySetupForm />
        </div>
      </div>
    </div>
  );
}
