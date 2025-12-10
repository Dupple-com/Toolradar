import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  const verifyToken = Math.random().toString(36).substring(2, 15);

  await prisma.subscriber.create({
    data: {
      email,
      verifyToken,
      verified: false,
    },
  });

  // Send verification email
  try {
    await resend.emails.send({
      from: "Toolradar <newsletter@toolradar.com>",
      to: email,
      subject: "Confirm your subscription to Toolradar",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Toolradar Newsletter</h1>
          <p>Thanks for subscribing! Click the button below to confirm your email:</p>
          <a href="${process.env.NEXTAUTH_URL}/api/newsletter/verify?token=${verifyToken}" 
             style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Confirm Subscription
          </a>
          <p style="color: #666; font-size: 14px;">
            If you didn't subscribe, you can ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
  }

  return NextResponse.json({ success: true });
}
