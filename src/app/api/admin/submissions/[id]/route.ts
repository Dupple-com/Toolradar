import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { indexTool } from "@/lib/meilisearch";

// Notify company members about submission status
async function notifySubmissionStatus(
  companyId: string,
  toolName: string,
  approved: boolean,
  toolSlug?: string,
  feedback?: string
) {
  // Get all company members
  const members = await prisma.companyMember.findMany({
    where: { companyId },
    select: { userId: true },
  });

  // Also get legacy company owner
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { userId: true },
  });

  const userIds = new Set(members.map((m) => m.userId));
  if (company?.userId) userIds.add(company.userId);

  // Create notification for each user
  await Promise.all(
    Array.from(userIds).map((userId) =>
      prisma.notification.create({
        data: {
          userId,
          type: approved ? "submission_approved" : "submission_rejected",
          title: approved ? "Tool Approved!" : "Submission Rejected",
          message: approved
            ? `Your tool "${toolName}" has been approved and is now live on Toolradar!`
            : `Your submission for "${toolName}" was not approved. ${feedback || ""}`,
          link: approved && toolSlug ? `/tools/${toolSlug}` : "/company/submissions",
        },
      })
    )
  );
}

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

    // Notify company members
    await notifySubmissionStatus(
      submission.companyId,
      data.name,
      true,
      tool.slug
    );

    return NextResponse.json({ success: true, tool });
  } else if (action === "reject") {
    const data = submission.data as unknown as SubmissionData;

    await prisma.submission.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        feedback: feedback || "Submission rejected",
      },
    });

    // Notify company members
    await notifySubmissionStatus(
      submission.companyId,
      data.name,
      false,
      undefined,
      feedback
    );

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
