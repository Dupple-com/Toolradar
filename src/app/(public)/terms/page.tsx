import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Toolradar",
  description: "Terms of Service for Toolradar - Rules and guidelines for using our platform",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-slate-500 mb-8">Last updated: December 18, 2025</p>

      <div className="prose prose-slate max-w-none">
        <p>
          Welcome to Toolradar. These Terms of Service ("Terms") govern your use of toolradar.com (the "Service") operated by Dupple ("we", "our", or "us"). By accessing or using our Service, you agree to be bound by these Terms.
        </p>

        <h2>1. Description of Service</h2>
        <p>
          Toolradar is a software discovery platform that allows users to:
        </p>
        <ul>
          <li>Browse and search for software tools</li>
          <li>Read and write reviews for software tools</li>
          <li>Submit new tools for listing</li>
          <li>Claim and manage company profiles</li>
          <li>Access analytics for claimed company profiles</li>
        </ul>

        <h2>2. Account Registration</h2>
        <p>
          To access certain features of the Service, you must create an account using Google or LinkedIn authentication. You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>

        <h2>3. User Content</h2>

        <h3>3.1 Reviews</h3>
        <p>When submitting reviews, you agree that:</p>
        <ul>
          <li>Your review reflects your genuine experience with the tool</li>
          <li>You have actually used the tool you are reviewing</li>
          <li>Your review does not contain false or misleading information</li>
          <li>Your review does not contain defamatory, abusive, or illegal content</li>
          <li>You do not have a financial interest in the tool unless disclosed</li>
        </ul>

        <h3>3.2 Tool Submissions</h3>
        <p>When submitting tools for listing, you agree that:</p>
        <ul>
          <li>You have the right to submit the tool information</li>
          <li>The information provided is accurate and not misleading</li>
          <li>The tool does not violate any applicable laws or third-party rights</li>
        </ul>

        <h3>3.3 Company Claims</h3>
        <p>When claiming a company profile, you represent that:</p>
        <ul>
          <li>You are an authorized representative of the company</li>
          <li>You have the authority to manage the company's presence on our platform</li>
          <li>All verification information provided is accurate</li>
        </ul>

        <h2>4. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Submit fake reviews or manipulate ratings</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with or disrupt the Service</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Use automated systems to access the Service without permission</li>
          <li>Collect user information without consent</li>
          <li>Post spam, advertisements, or promotional content in reviews</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding user-generated content) are the property of Dupple and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          By submitting content to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.
        </p>

        <h2>6. Company Profiles and Analytics</h2>
        <p>
          Companies with claimed profiles may access analytics about their tools, including view counts and engagement metrics. This data is provided for informational purposes and may not be complete or accurate.
        </p>

        <h2>7. Moderation</h2>
        <p>
          We reserve the right to:
        </p>
        <ul>
          <li>Review and moderate all user-submitted content</li>
          <li>Remove content that violates these Terms</li>
          <li>Suspend or terminate accounts for violations</li>
          <li>Reject or remove tool listings at our discretion</li>
          <li>Approve or reject company claim requests</li>
        </ul>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The Service is provided "as is" without warranties of any kind. We do not guarantee:
        </p>
        <ul>
          <li>The accuracy or completeness of tool information</li>
          <li>The reliability of user reviews</li>
          <li>Uninterrupted or error-free service</li>
          <li>The quality or suitability of any listed tools</li>
        </ul>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Dupple shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Dupple from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
        </p>

        <h2>11. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites. We are not responsible for the content or practices of these external sites.
        </p>

        <h2>12. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>

        <h2>13. Termination</h2>
        <p>
          We may terminate or suspend your account at any time for violations of these Terms. Upon termination, your right to use the Service will immediately cease.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These Terms are governed by the laws of France. Any disputes shall be subject to the exclusive jurisdiction of the courts of Paris, France.
        </p>

        <h2>15. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us:
        </p>
        <address className="not-italic">
          <strong>Dupple</strong><br />
          14 avenue Jean de la Fontaine<br />
          91120 Palaiseau<br />
          France<br />
          <br />
          Email: legal@toolradar.com
        </address>
      </div>
    </div>
  );
}
