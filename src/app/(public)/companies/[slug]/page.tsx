import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/tools/tool-card";
import { CheckCircle, Globe, Building2, Package, Linkedin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-utils";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateCompanyMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Generate static params for companies with published tools
export async function generateStaticParams() {
  try {
    const companies = await prisma.company.findMany({
      where: { tools: { some: { status: "published" } } },
      select: { slug: true },
      take: 100,
    });
    return companies.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { tools: true } } },
  });
  if (!company) return { title: "Company not found" };
  return generateCompanyMetadata({
    name: company.name,
    slug: company.slug,
    description: company.description,
    logo: company.logo,
    toolCount: company._count.tools,
  });
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();

  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: {
      tools: {
        where: { status: "published" },
        include: {
          _count: { select: { reviews: true } },
        },
        orderBy: { weeklyUpvotes: "desc" },
      },
      members: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      _count: { select: { tools: true } },
    },
  });

  if (!company) {
    notFound();
  }

  // Check if current user has a pending claim
  let userClaim = null;
  if (user) {
    userClaim = await prisma.claimRequest.findUnique({
      where: {
        companyId_userId: {
          companyId: company.id,
          userId: user.id,
        },
      },
    });
  }

  const isClaimed = !!company.claimedAt;
  const canClaim = user && !isClaimed && !userClaim;
  const isOwner = user && company.members.some((m) => m.userId === user.id);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Companies", url: "/companies" },
    { name: company.name, url: `/companies/${company.slug}` },
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website || `https://toolradar.com/companies/${company.slug}`,
    ...(company.logo && { logo: company.logo }),
    ...(company.description && { description: company.description }),
    ...(company.domain && { sameAs: [`https://${company.domain}`] }),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          {/* Logo */}
          <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="w-10 h-10 text-slate-400" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {company.name}
              </h1>
              {isClaimed ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <Link
                  href={`/companies/${company.slug}/claim`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                >
                  Unclaimed
                </Link>
              )}
            </div>
            {company.description && (
              <p className="text-slate-500 mt-2 max-w-2xl">{company.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-sm text-slate-500">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-slate-700"
                >
                  <Globe className="w-4 h-4" />
                  <span className="truncate max-w-[150px] sm:max-w-none">{company.domain}</span>
                </a>
              )}
              {company.linkedinUrl && (
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {company._count.tools} {company._count.tools === 1 ? "product" : "products"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {isOwner && (
              <Link
                href="/company"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium text-center"
              >
                Manage Company
              </Link>
            )}
            {canClaim && (
              <Link
                href={`/companies/${company.slug}/claim`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
              >
                Claim this Profile
              </Link>
            )}
            {userClaim && (
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${
                  userClaim.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : userClaim.status === "approved"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                Claim {userClaim.status}
              </span>
            )}
            {!user && !isClaimed && (
              <Link
                href={`/login?callbackUrl=/companies/${company.slug}/claim`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
              >
                Claim this Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Products by {company.name}
        </h2>
        {company.tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  ...tool,
                  reviewCount: tool._count.reviews,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl text-slate-500">
            No products listed yet.
          </div>
        )}
      </div>
      </div>
    </>
  );
}
