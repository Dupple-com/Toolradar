import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Toolradar",
  description: "Privacy Policy for Toolradar - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500">Last updated: December 18, 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p className="text-lg text-slate-700">
            Dupple ("we", "our", or "us") operates Toolradar (toolradar.com). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <Section title="1. Information We Collect">
            <Subsection title="1.1 Information You Provide">
              <ul className="space-y-2 ml-4">
                <li><strong>Account Information:</strong> When you create an account via Google or LinkedIn OAuth, we collect your name, email address, and profile picture.</li>
                <li><strong>Reviews:</strong> When you submit a review, we collect the content of your review, ratings, and any additional information you provide.</li>
                <li><strong>Tool Submissions:</strong> When you submit a tool for listing, we collect the tool name, description, website, pricing information, and other details you provide.</li>
                <li><strong>Company Claims:</strong> When you claim a company profile, we may collect your work email, job title, and LinkedIn profile URL for verification purposes.</li>
                <li><strong>Contact Information:</strong> When you contact us, we collect any information you provide in your message.</li>
              </ul>
            </Subsection>

            <Subsection title="1.2 Information Collected Automatically">
              <ul className="space-y-2 ml-4">
                <li><strong>Usage Data:</strong> We collect information about how you interact with our website, including pages visited, time spent, and actions taken.</li>
                <li><strong>Device Information:</strong> We collect information about your device, including browser type, operating system, and IP address.</li>
                <li><strong>Cookies:</strong> We use essential cookies to maintain your session and preferences.</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="2. How We Use Your Information">
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and display your reviews and tool submissions</li>
              <li>Verify company ownership claims</li>
              <li>Send you notifications about your account, reviews, or claimed companies</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Sharing of Information">
            <p className="mb-3">We may share your information in the following circumstances:</p>
            <ul className="space-y-2 ml-4">
              <li><strong>Public Content:</strong> Reviews, tool submissions, and company profiles are publicly visible on our platform.</li>
              <li><strong>Service Providers:</strong> We work with third-party services including Resend (email delivery), Vercel (hosting), and PostgreSQL database providers.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time by contacting us.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p className="mb-3">Under GDPR and French data protection law, you have the right to:</p>
            <ul className="space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise these rights, please contact us at the address below.</p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </Section>

          <Section title="7. International Data Transfers">
            <p>
              Your information may be transferred to and processed in countries other than France. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="font-semibold text-slate-900 mb-2">Dupple</p>
              <p>14 avenue Jean de la Fontaine</p>
              <p>91120 Palaiseau</p>
              <p className="mb-3">France</p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                <a href="mailto:privacy@toolradar.com" className="text-blue-600 hover:underline">
                  privacy@toolradar.com
                </a>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-6 border-t border-slate-100 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-slate-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
