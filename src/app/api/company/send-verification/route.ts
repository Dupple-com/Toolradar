import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, token } = await request.json();

  if (!email || !token) {
    return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
  }

  // Find company by token
  const company = await prisma.company.findUnique({
    where: { verificationToken: token },
    include: { members: true },
  });

  if (!company) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  // Check if user is owner
  const isOwner = company.members.some(
    (m) => m.userId === user.id && m.role === "owner"
  );
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate email domain matches company domain
  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain !== company.domain.toLowerCase()) {
    return NextResponse.json(
      { error: `Email must be from @${company.domain}` },
      { status: 400 }
    );
  }

  // Update company with verification email (keep same token)
  await prisma.company.update({
    where: { id: company.id },
    data: {
      verificationEmail: email,
    },
  });

  // Generate verification URL using existing token
  const baseUrl = process.env.NEXTAUTH_URL || "https://toolradar.com";
  const verifyUrl = `${baseUrl}/company/verify/confirm?token=${company.verificationToken}`;

  // Send verification email
  try {
    await getResend().emails.send({
      from: "Toolradar <noreply@toolradar.com>",
      to: email,
      subject: `Verify ${company.name} on Toolradar`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="#3b82f6" stroke-width="6" fill="none"/>
                  <circle cx="50" cy="50" r="8" fill="#3b82f6"/>
                  <path d="M50 20 L50 35" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
                  <path d="M50 65 L50 80" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
                  <path d="M20 50 L35 50" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
                  <path d="M65 50 L80 50" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
                </svg>
                <span style="font-size: 22px; font-weight: 600; color: #0f172a;">Toolradar</span>
              </div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #0f172a; text-align: center;">
                Verify your company
              </h1>
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #64748b; line-height: 1.6; text-align: center;">
                Click the button below to verify ownership of:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 17px; font-weight: 600; color: #0f172a; text-align: center;">
                ${company.name}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 15px; font-weight: 500; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Verify Company
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
                If you didn't request this verification, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Toolradar - Discover the best software tools
              </p>
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
