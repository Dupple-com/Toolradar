import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { VerifyForm } from "./verify-form";
import { Mail, Shield, CheckCircle } from "lucide-react";

export default async function CompanyVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { token } = await searchParams;
  if (!token) redirect("/company/setup");

  // Find company by token
  const company = await prisma.company.findUnique({
    where: { verificationToken: token },
    include: { members: true },
  });

  if (!company) {
    redirect("/company/setup");
  }

  // Check if user is owner
  const isOwner = company.members.some(
    (m) => m.userId === user.id && m.role === "owner"
  );
  if (!isOwner) {
    redirect("/company/setup");
  }

  // If already verified, redirect to dashboard
  if (company.verifiedAt) {
    redirect("/company");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Company</h1>
            <p className="text-white/80">
              Enter an email address with your company domain to prove ownership
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-muted-foreground">{company.domain}</p>
                </div>
              </div>
            </div>

            <VerifyForm
              domain={company.domain}
              token={token}
              existingEmail={company.verificationEmail}
            />

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>We&apos;ll send a verification link to your email</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>The email must use your company domain (@{company.domain})</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>Click the link in the email to verify ownership</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
