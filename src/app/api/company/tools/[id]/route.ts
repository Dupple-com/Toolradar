import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    return NextResponse.json({ error: "Company not verified" }, { status: 403 });
  }

  // Get the tool and verify ownership
  const tool = await prisma.tool.findUnique({
    where: { id },
  });

  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  if (tool.companyId !== company.id) {
    return NextResponse.json({ error: "Not authorized to edit this tool" }, { status: 403 });
  }

  // Parse request body
  const body = await request.json();
  const {
    name,
    tagline,
    description,
    website,
    logo,
    pricing,
    categoryIds,
    tldr,
    features,
    pros,
    cons,
    faqs,
  } = body;

  // Update the tool
  try {
    await prisma.$transaction(async (tx) => {
      // Update tool fields
      await tx.tool.update({
        where: { id },
        data: {
          name,
          tagline,
          description,
          website,
          logo,
          pricing,
          tldr: tldr || [],
          features: features || [],
          pros: pros || [],
          cons: cons || [],
          faqs: faqs || null,
        },
      });

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Remove existing categories
        await tx.categoryTool.deleteMany({
          where: { toolId: id },
        });

        // Add new categories
        if (categoryIds.length > 0) {
          await tx.categoryTool.createMany({
            data: categoryIds.map((categoryId: string) => ({
              toolId: id,
              categoryId,
            })),
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}
