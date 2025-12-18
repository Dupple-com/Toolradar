import { Metadata } from "next";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Toolradar",
  description: "Terms of Service for Toolradar - Rules and guidelines for using our platform",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <ScrollText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
        <p className="text-slate-500">Last updated: December 18, 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p className="text-lg text-slate-700">
            Welcome to Toolradar. These Terms of Service ("Terms") govern your use of toolradar.com (the "Service") operated by Dupple ("we", "our", or "us"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <Section title="1. Description of Service">
            <p className="mb-3">Toolradar is a software discovery platform that allows users to:</p>
            <ul className="space-y-2 ml-4">
              <li>Browse and search for software tools</li>
              <li>Read and write reviews for software tools</li>
              <li>Submit new tools for listing</li>
              <li>Claim and manage company profiles</li>
              <li>Access analytics for claimed company profiles</li>
            </ul>
          </Section>

          <Section title="2. Account Registration">
            <p className="mb-3">To access certain features of the Service, you must create an account using Google or LinkedIn authentication. You agree to:</p>
            <ul className="space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </Section>

          <Section title="3. User Content">
            <Subsection title="3.1 Reviews">
              <p className="mb-2">When submitting reviews, you agree that:</p>
              <ul className="space-y-2 ml-4">
                <li>Your review reflects your genuine experience with the tool</li>
                <li>You have actually used the tool you are reviewing</li>
                <li>Your review does not contain false or misleading information</li>
                <li>Your review does not contain defamatory, abusive, or illegal content</li>
                <li>You do not have a financial interest in the tool unless disclosed</li>
              </ul>
            </Subsection>

            <Subsection title="3.2 Tool Submissions">
              <p className="mb-2">When submitting tools for listing, you agree that:</p>
              <ul className="space-y-2 ml-4">
                <li>You have the right to submit the tool information</li>
                <li>The information provided is accurate and not misleading</li>
                <li>The tool does not violate any applicable laws or third-party rights</li>
              </ul>
            </Subsection>

            <Subsection title="3.3 Company Claims">
              <p className="mb-2">When claiming a company profile, you represent that:</p>
              <ul className="space-y-2 ml-4">
                <li>You are an authorized representative of the company</li>
                <li>You have the authority to manage the company's presence on our platform</li>
                <li>All verification information provided is accurate</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="4. Prohibited Conduct">
            <p className="mb-3">You agree not to:</p>
            <ul className="space-y-2 ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit fake reviews or manipulate ratings</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Collect user information without consent</li>
              <li>Post spam, advertisements, or promotional content in reviews</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            <p className="mb-3">
              The Service and its original content (excluding user-generated content) are the property of Dupple and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              By submitting content to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.
            </p>
          </Section>

          <Section title="6. Company Profiles and Analytics">
            <p>
              Companies with claimed profiles may access analytics about their tools, including view counts and engagement metrics. This data is provided for informational purposes and may not be complete or accurate.
            </p>
          </Section>

          <Section title="7. Moderation">
            <p className="mb-3">We reserve the right to:</p>
            <ul className="space-y-2 ml-4">
              <li>Review and moderate all user-submitted content</li>
              <li>Remove content that violates these Terms</li>
              <li>Suspend or terminate accounts for violations</li>
              <li>Reject or remove tool listings at our discretion</li>
              <li>Approve or reject company claim requests</li>
            </ul>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p className="mb-3">The Service is provided "as is" without warranties of any kind. We do not guarantee:</p>
            <ul className="space-y-2 ml-4">
              <li>The accuracy or completeness of tool information</li>
              <li>The reliability of user reviews</li>
              <li>Uninterrupted or error-free service</li>
              <li>The quality or suitability of any listed tools</li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Dupple shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
          </Section>

          <Section title="10. Indemnification">
            <p>
              You agree to indemnify and hold harmless Dupple from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </Section>

          <Section title="11. Third-Party Links">
            <p>
              The Service may contain links to third-party websites. We are not responsible for the content or practices of these external sites.
            </p>
          </Section>

          <Section title="12. Modifications to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="13. Termination">
            <p>
              We may terminate or suspend your account at any time for violations of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms are governed by the laws of France. Any disputes shall be subject to the exclusive jurisdiction of the courts of Paris, France.
            </p>
          </Section>

          <Section title="15. Contact Us">
            <p className="mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="font-semibold text-slate-900 mb-2">Dupple</p>
              <p>14 avenue Jean de la Fontaine</p>
              <p>91120 Palaiseau</p>
              <p className="mb-3">France</p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                <span className="text-blue-600">
                  legal[at]toolradar.com
                </span>
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
