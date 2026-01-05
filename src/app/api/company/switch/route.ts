import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const ACTIVE_COMPANY_COOKIE = "active_company_id";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await request.json();

  if (!companyId) {
    return NextResponse.json({ error: "Company ID required" }, { status: 400 });
  }

  // Verify user has access to this company
  const membership = await prisma.companyMember.findFirst({
    where: {
      userId: user.id,
      companyId,
    },
  });

  const legacyCompany = await prisma.company.findUnique({
    where: { id: companyId, userId: user.id },
  });

  if (!membership && !legacyCompany) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return NextResponse.json({ success: true });
}
