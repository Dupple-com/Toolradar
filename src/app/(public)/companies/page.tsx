import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Companies - Toolradar",
  description: "Browse companies and their software products on Toolradar",
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { q } = searchParams;

  const companies = await prisma.company.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { domain: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      _count: { select: { tools: true } },
    },
    orderBy: [{ claimedAt: { sort: "desc", nulls: "last" } }, { name: "asc" }],
    take: 50,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Companies</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          Browse software companies and their products. Company owners can claim their profile to respond to reviews and manage their tools.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <form className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search companies..."
            className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </form>
      </div>

      {/* Companies grid */}
      <h2 className="sr-only">All Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-slate-400">
                  {company.name[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 truncate group-hover:text-slate-700">
                  {company.name}
                </h3>
                {company.claimedAt && (
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-slate-500 truncate">{company.domain}</p>
              <p className="text-xs text-slate-400 mt-1">
                {company._count.tools} {company._count.tools === 1 ? "product" : "products"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 mt-1" />
          </Link>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          {q ? `No companies found for "${q}"` : "No companies found"}
        </div>
      )}
    </div>
  );
}
