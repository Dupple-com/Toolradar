import { prisma } from "./prisma";

type NotificationType =
  | "new_review"
  | "review_reply"
  | "claim_approved"
  | "claim_rejected"
  | "new_tool_in_category";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  });
}

// Helper to notify company members when a new review is posted
export async function notifyNewReview(toolId: string, toolName: string, reviewerName: string) {
  // Find company that owns this tool
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    include: {
      company: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!tool?.company?.members) return;

  // Notify all company members
  const notifications = tool.company.members.map((member) =>
    createNotification({
      userId: member.userId,
      type: "new_review",
      title: "New Review",
      message: `${reviewerName} left a review on ${toolName}`,
      link: `/tools/${tool.slug}#reviews`,
    })
  );

  await Promise.all(notifications);
}

// Helper to notify user about claim status
export async function notifyClaimStatus(
  userId: string,
  companyName: string,
  approved: boolean,
  companySlug?: string
) {
  await createNotification({
    userId,
    type: approved ? "claim_approved" : "claim_rejected",
    title: approved ? "Claim Approved" : "Claim Rejected",
    message: approved
      ? `Your claim for ${companyName} has been approved! You can now manage your company profile.`
      : `Your claim for ${companyName} was not approved. Please contact support for more information.`,
    link: approved ? `/company` : undefined,
  });
}
