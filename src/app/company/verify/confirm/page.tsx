import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default async function VerifyConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerificationResult
        success={false}
        title="Invalid Link"
        message="This verification link is invalid or has expired."
      />
    );
  }

  // Find company by token
  const company = await prisma.company.findUnique({
    where: { verificationToken: token },
  });

  if (!company) {
    return (
      <VerificationResult
        success={false}
        title="Invalid Link"
        message="This verification link is invalid or has expired."
      />
    );
  }

  // Already verified
  if (company.verifiedAt) {
    redirect("/company/onboarding");
  }

  // Verify the company
  await prisma.company.update({
    where: { id: company.id },
    data: {
      verifiedAt: new Date(),
      claimedAt: new Date(),
      claimedBy: company.userId,
      verificationToken: null, // Clear token after use
    },
  });

  // Update user role to company
  if (company.userId) {
    await prisma.user.update({
      where: { id: company.userId },
      data: { role: "company" },
    });
  }

  return (
    <VerificationResult
      success={true}
      title="Company Verified!"
      message={`${company.name} has been successfully verified on Toolradar.`}
      showContinue
    />
  );
}

function VerificationResult({
  success,
  title,
  message,
  showContinue = false,
}: {
  success: boolean;
  title: string;
  message: string;
  showContinue?: boolean;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-8">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border shadow-xl p-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {success ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h1 className="text-2xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>

          {showContinue ? (
            <Link
              href="/company/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors"
            >
              Continue Setup
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/company/setup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
