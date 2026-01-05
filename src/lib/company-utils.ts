import { cookies } from "next/headers";
import { prisma } from "./prisma";

const ACTIVE_COMPANY_COOKIE = "active_company_id";

export async function getActiveCompanyId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value || null;
}

export async function getUserCompanies(userId: string) {
  // Get all companies the user is a member of
  const memberships = await prisma.companyMember.findMany({
    where: { userId },
    include: { company: true },
    orderBy: { joinedAt: "asc" },
  });

  // Also check for legacy company relation
  const legacyCompany = await prisma.company.findUnique({
    where: { userId },
  });

  const companies = memberships.map((m) => ({
    ...m.company,
    role: m.role,
  }));

  // Add legacy company if not already in the list
  if (legacyCompany && !companies.find((c) => c.id === legacyCompany.id)) {
    companies.unshift({ ...legacyCompany, role: "owner" as const });
  }

  return companies;
}

export async function getActiveCompany(userId: string) {
  const companies = await getUserCompanies(userId);

  if (companies.length === 0) {
    return null;
  }

  const activeCompanyId = await getActiveCompanyId();

  // Find the active company, or default to first one
  const activeCompany = activeCompanyId
    ? companies.find((c) => c.id === activeCompanyId)
    : null;

  return activeCompany || companies[0];
}
