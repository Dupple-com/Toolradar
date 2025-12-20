import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompanySetupForm } from "@/components/company/setup-form";

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
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create Your Company Profile</h1>
      <p className="text-muted-foreground mb-8">
        Set up your company profile to submit tools and manage your presence on Toolradar.
      </p>
      <CompanySetupForm />
    </div>
  );
}
