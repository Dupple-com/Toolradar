import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { ClaimForm } from "@/components/company/claim-form";
import { Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!company) return { title: "Company not found" };
  return {
    title: `Claim ${company.name} - Toolradar`,
    description: `Claim your company profile for ${company.name} on Toolradar`,
  };
}

export default async function ClaimCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireAuth();

  const company = await prisma.company.findUnique({
    where: { slug },
  });

  if (!company) {
    notFound();
  }

  // Check if already claimed
  if (company.claimedAt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Already Claimed</h1>
        <p className="text-slate-500 mb-6">
          This company profile has already been claimed and verified.
        </p>
        <Link
          href={`/companies/${company.slug}`}
          className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          View Company Profile
        </Link>
      </div>
    );
  }

  // Check if user already has a claim
  const existingClaim = await prisma.claimRequest.findUnique({
    where: {
      companyId_userId: {
        companyId: company.id,
        userId: user.id,
      },
    },
  });

  if (existingClaim) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
            existingClaim.status === "pending"
              ? "bg-yellow-100"
              : existingClaim.status === "approved"
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {existingClaim.status === "pending" ? (
            <Building2 className="w-8 h-8 text-yellow-600" />
          ) : existingClaim.status === "approved" ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <Building2 className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {existingClaim.status === "pending"
            ? "Claim Pending"
            : existingClaim.status === "approved"
            ? "Claim Approved"
            : "Claim Rejected"}
        </h1>
        <p className="text-slate-500 mb-6">
          {existingClaim.status === "pending"
            ? "Your claim is being reviewed. We'll notify you once it's processed."
            : existingClaim.status === "approved"
            ? "Your claim has been approved! You can now manage this company."
            : "Your claim was rejected. " + (existingClaim.feedback || "")}
        </p>
        <Link
          href={`/companies/${company.slug}`}
          className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          View Company Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-16 h-16 object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-slate-400" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Claim {company.name}</h1>
        <p className="text-slate-500 mt-2">
          Verify that you work at {company.name} to manage this company profile.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ClaimForm companyId={company.id} companyName={company.name} domain={company.domain} />
      </div>

      <p className="text-xs text-slate-400 text-center mt-6">
        We manually verify all claims to ensure company profiles are managed by authorized representatives.
      </p>
    </div>
  );
}
