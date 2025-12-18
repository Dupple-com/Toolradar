import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Toolradar",
  description: "Privacy Policy for Toolradar - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: December 18, 2025</p>

      <div className="prose prose-slate max-w-none">
        <p>
          Dupple ("we", "our", or "us") operates Toolradar (toolradar.com). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> When you create an account via Google or LinkedIn OAuth, we collect your name, email address, and profile picture.</li>
          <li><strong>Reviews:</strong> When you submit a review, we collect the content of your review, ratings, and any additional information you provide.</li>
          <li><strong>Tool Submissions:</strong> When you submit a tool for listing, we collect the tool name, description, website, pricing information, and other details you provide.</li>
          <li><strong>Company Claims:</strong> When you claim a company profile, we may collect your work email, job title, and LinkedIn profile URL for verification purposes.</li>
          <li><strong>Contact Information:</strong> When you contact us, we collect any information you provide in your message.</li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> We collect information about how you interact with our website, including pages visited, time spent, and actions taken.</li>
          <li><strong>Device Information:</strong> We collect information about your device, including browser type, operating system, and IP address.</li>
          <li><strong>Cookies:</strong> We use essential cookies to maintain your session and preferences.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process and display your reviews and tool submissions</li>
          <li>Verify company ownership claims</li>
          <li>Send you notifications about your account, reviews, or claimed companies</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Detect, prevent, and address technical issues or fraudulent activity</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li><strong>Public Content:</strong> Reviews, tool submissions, and company profiles are publicly visible on our platform.</li>
          <li><strong>Service Providers:</strong> We work with third-party services including:
            <ul>
              <li>Resend (email delivery)</li>
              <li>Vercel (hosting)</li>
              <li>PostgreSQL database providers</li>
            </ul>
          </li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time by contacting us.
        </p>

        <h2>5. Your Rights</h2>
        <p>Under GDPR and French data protection law, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>To exercise these rights, please contact us at the address below.</p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
        </p>

        <h2>7. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than France. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <address className="not-italic">
          <strong>Dupple</strong><br />
          14 avenue Jean de la Fontaine<br />
          91120 Palaiseau<br />
          France<br />
          <br />
          Email: privacy@toolradar.com
        </address>
      </div>
    </div>
  );
}
