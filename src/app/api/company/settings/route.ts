import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getActiveCompany(user.id);
  if (!company?.verifiedAt) {
    return NextResponse.json({ error: "Company not verified" }, { status: 403 });
  }

  try {
    const { linkedinUrl } = await request.json();

    // Validate LinkedIn URL if provided
    if (linkedinUrl && !linkedinUrl.includes("linkedin.com")) {
      return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
    }

    await prisma.company.update({
      where: { id: company.id },
      data: { linkedinUrl },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating company settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
