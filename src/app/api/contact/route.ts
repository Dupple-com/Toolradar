import { NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy initialization for Resend
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const CONTACT_EMAIL = "louis@dupple.com";

// Verify Turnstile token with Cloudflare
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Skip verification in development if no secret key
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping verification");
    return true;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message, turnstileToken } = body;

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the verification" },
        { status: 400 }
      );
    }

    const isValidToken = await verifyTurnstile(turnstileToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Send email
    await getResend().emails.send({
      from: "Toolradar Contact <hello@team.toolradar.com>",
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject} - ${name}`,
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
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
              <span style="font-size: 20px; font-weight: 600; color: #ffffff;">New Contact Form Submission</span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Contact Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                    <p style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 500;">${name}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding: 12px 16px; background: #f8fafc; border-radius: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                    <p style="margin: 0; font-size: 15px; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></p>
                  </td>
                  <td width="50%" style="padding: 12px 16px; background: #f8fafc; border-radius: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Company</p>
                    <p style="margin: 0; font-size: 15px; color: #0f172a;">${company || "Not provided"}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; background: #f8fafc; border-radius: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                    <p style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 500;">${subject}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="padding: 16px 20px; background: #fefefe; border: 1px solid #e2e8f0; border-radius: 8px; border-left: 4px solid #2563eb;">
                  <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Reply Button -->
              <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                Reply to ${name.split(" ")[0]}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; border-top: 1px solid #f1f5f9; background: #fafafa;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                This message was sent via the Toolradar contact form
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
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
