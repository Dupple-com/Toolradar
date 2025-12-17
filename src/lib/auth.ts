import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";
import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    EmailProvider({
      from: "Toolradar <noreply@toolradar.com>",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await getResend().emails.send({
            from: "Toolradar <noreply@toolradar.com>",
            to: email,
            subject: "Sign in to Toolradar",
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Toolradar</h1>
                <p>Click the button below to sign in to your account:</p>
                <a href="${url}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                  Sign In
                </a>
                <p style="color: #666; font-size: 14px;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
        session.user.username = (user as any).username;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Verify LinkedIn users automatically
      if (account?.provider === "linkedin") {
        await prisma.user.update({
          where: { id: user.id },
          data: { verified: true },
        });
      }
      return true;
    },
  },
  session: {
    strategy: "database",
  },
};
