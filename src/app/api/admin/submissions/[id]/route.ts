import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { indexTool } from "@/lib/meilisearch";

interface SubmissionData {
  name: string;
  website: string;
  tagline: string;
  description: string;
  pricing: string;
  logo?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { action, feedback } = await request.json();

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!submission) {
    return NextResponse.json({ message: "Submission not found" }, { status: 404 });
  }

  if (submission.status !== "pending") {
    return NextResponse.json({ message: "Submission already processed" }, { status: 400 });
  }

  if (action === "approve") {
    const data = submission.data as unknown as SubmissionData;

    // Generate slug from name
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug exists, add number suffix if needed
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.tool.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the tool
    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        logo: data.logo || null,
        website: data.website,
        pricing: data.pricing,
        status: "published",
        companyId: submission.companyId,
      },
      include: {
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    // Update submission status
    await prisma.submission.update({
      where: { id: params.id },
      data: { status: "approved" },
    });

    // Index in MeiliSearch
    try {
      await indexTool(tool);
    } catch (error) {
      console.error("Failed to index tool:", error);
    }

    return NextResponse.json({ success: true, tool });
  } else if (action === "reject") {
    await prisma.submission.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        feedback: feedback || "Submission rejected",
      },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: {
      company: {
        select: {
          name: true,
          domain: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!submission) {
    return NextResponse.json({ message: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json(submission);
}
