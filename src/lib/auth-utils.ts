import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import type { Company, CompanyMember } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

// For API routes - returns null or error response
export async function requireAdmin(): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> } | { error: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user };
}

export async function requireCompany(): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> } | { error: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (user.role !== "company" && user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user };
}

// For pages (uses redirect)
export async function requireAdminPage() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}

export async function requireCompanyPage() {
  const user = await requireAuth();
  if (user.role !== "company" && user.role !== "admin") {
    redirect("/");
  }
  return user;
}

// New membership-based auth utilities
type UserWithSession = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

interface CompanyMembershipResult {
  user: UserWithSession;
  company: Company;
  membership: CompanyMember;
}

interface AuthError {
  error: NextResponse;
}

export async function requireCompanyMember(): Promise<CompanyMembershipResult | AuthError> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const membership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
    include: { company: true },
  });

  if (!membership) {
    return { error: NextResponse.json({ error: "No company membership" }, { status: 403 }) };
  }

  return { user, company: membership.company, membership };
}

export async function requireCompanyAdmin(): Promise<CompanyMembershipResult | AuthError> {
  const result = await requireCompanyMember();
  if ("error" in result) return result;

  if (!["owner", "admin"].includes(result.membership.role)) {
    return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }

  return result;
}

export async function requireCompanyOwner(): Promise<CompanyMembershipResult | AuthError> {
  const result = await requireCompanyMember();
  if ("error" in result) return result;

  if (result.membership.role !== "owner") {
    return { error: NextResponse.json({ error: "Owner access required" }, { status: 403 }) };
  }

  return result;
}

// Page-level membership auth
export async function requireCompanyMemberPage() {
  const user = await requireAuth();

  const membership = await prisma.companyMember.findFirst({
    where: { userId: user.id },
    include: { company: true },
  });

  if (!membership) {
    redirect("/");
  }

  return { user, company: membership.company, membership };
}

export async function requireCompanyAdminPage() {
  const result = await requireCompanyMemberPage();

  if (!["owner", "admin"].includes(result.membership.role)) {
    redirect("/company");
  }

  return result;
}
