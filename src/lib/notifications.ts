import { prisma } from "./prisma";
import { Resend } from "resend";

// Lazy initialization for Resend
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Admin email (or fetch from env)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "louis@dupple.com";
const BASE_URL = process.env.NEXTAUTH_URL || "https://toolradar.com";

type NotificationType =
  | "new_review"
  | "review_reply"
  | "claim_approved"
  | "claim_rejected"
  | "submission_approved"
  | "submission_rejected"
  | "new_submission"
  | "new_claim"
  | "analytics_digest"
  | "new_tool_in_category";

interface NotificationPrefs {
  new_review?: boolean;
  review_reply?: boolean;
  submission_approved?: boolean;
  submission_rejected?: boolean;
  new_submission?: boolean;
  new_claim?: boolean;
  analytics_digest?: boolean;
}

// Check if user wants to receive a specific notification type
async function shouldNotify(userId: string, type: NotificationType): Promise<boolean> {
  // Map notification types to preference keys
  const prefKeyMap: Record<string, keyof NotificationPrefs> = {
    new_review: "new_review",
    review_reply: "review_reply",
    submission_approved: "submission_approved",
    submission_rejected: "submission_rejected",
    new_submission: "new_submission",
    new_claim: "new_claim",
    analytics_digest: "analytics_digest",
  };

  const prefKey = prefKeyMap[type];

  // If no preference mapping exists, always notify (e.g., claim_approved, claim_rejected)
  if (!prefKey) return true;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  });

  const prefs = user?.notificationPrefs as NotificationPrefs | null;

  // Default to true if no preferences set or specific pref not set
  if (!prefs || prefs[prefKey] === undefined) return true;

  return prefs[prefKey] === true;
}

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
  // Check if user wants this notification type
  const shouldSend = await shouldNotify(userId, type);
  if (!shouldSend) return null;

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

// ==========================================
// ADMIN EMAIL NOTIFICATIONS
// ==========================================

// Notify admin when a new submission is created
export async function notifyAdminNewSubmission(
  companyName: string,
  productName: string,
  submittedBy: string
) {
  // Create in-app notification for all admins (respecting their preferences)
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin.id,
          type: "new_submission",
          title: "New Tool Submission",
          message: `${productName} submitted by ${companyName}`,
          link: "/admin/submissions",
        })
      )
    );
  } catch (error) {
    console.error("Failed to create admin notifications:", error);
  }

  // Send email notification
  try {
    await getResend().emails.send({
      from: "Toolradar <hello@team.toolradar.com>",
      to: ADMIN_EMAIL,
      subject: `[Toolradar] New submission: ${productName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 18px; font-weight: 600; color: #0f172a;">New Product Submission</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
                A new product has been submitted for review:
              </p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${productName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Company:</strong> ${companyName}</p>
                <p style="margin: 0;"><strong>Submitted by:</strong> ${submittedBy}</p>
              </div>
              <a href="${BASE_URL}/admin/submissions" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                Review Submission
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}

// Notify admin when a new claim request is created
export async function notifyAdminNewClaim(
  companyName: string,
  claimantName: string,
  claimantEmail: string,
  workEmail: string | null
) {
  // Create in-app notification for all admins (respecting their preferences)
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin.id,
          type: "new_claim",
          title: "New Company Claim",
          message: `${claimantName} wants to claim ${companyName}`,
          link: "/admin/claims",
        })
      )
    );
  } catch (error) {
    console.error("Failed to create admin notifications:", error);
  }

  // Send email notification
  try {
    await getResend().emails.send({
      from: "Toolradar <hello@team.toolradar.com>",
      to: ADMIN_EMAIL,
      subject: `[Toolradar] New claim request: ${companyName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 18px; font-weight: 600; color: #0f172a;">New Company Claim Request</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
                Someone wants to claim a company profile:
              </p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0;"><strong>Company:</strong> ${companyName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Claimant:</strong> ${claimantName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Account Email:</strong> ${claimantEmail}</p>
                ${workEmail ? `<p style="margin: 0;"><strong>Work Email:</strong> ${workEmail}</p>` : ""}
              </div>
              <a href="${BASE_URL}/admin/claims" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                Review Claim
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}
