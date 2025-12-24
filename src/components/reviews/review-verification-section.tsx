"use client";

interface VerificationData {
  usageDuration: string;
  companySize: string;
  userRole: string;
  linkedinUrl: string;
}

interface ReviewVerificationSectionProps {
  data: VerificationData;
  onChange: (field: keyof VerificationData, value: string) => void;
  userEmail: string;
}

const USAGE_DURATION_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "less_than_month", label: "Less than 1 month" },
  { value: "1_6_months", label: "1-6 months" },
  { value: "6_12_months", label: "6-12 months" },
  { value: "1_2_years", label: "1-2 years" },
  { value: "more_than_2_years", label: "More than 2 years" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "self_employed", label: "Self-employed" },
  { value: "1_10", label: "1-10 employees" },
  { value: "11_50", label: "11-50 employees" },
  { value: "51_200", label: "51-200 employees" },
  { value: "201_1000", label: "201-1000 employees" },
  { value: "1000_plus", label: "1000+ employees" },
];

const USER_ROLE_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "founder", label: "Founder / CEO" },
  { value: "executive", label: "Executive (C-suite, VP)" },
  { value: "manager", label: "Manager / Team Lead" },
  { value: "individual", label: "Individual Contributor" },
  { value: "freelancer", label: "Freelancer / Consultant" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
];

/**
 * Verification section for the review form.
 * Collects usage duration, company size, role, and LinkedIn profile.
 */
export function ReviewVerificationSection({
  data,
  onChange,
  userEmail,
}: ReviewVerificationSectionProps) {
  const selectClassName =
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white";

  return (
    <div className="bg-white rounded-xl border p-6 space-y-5">
      <div>
        <h3 className="font-semibold">Help us verify your review</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This information helps us ensure review authenticity. Verified reviews get a badge.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            How long have you used this tool? <span className="text-red-500">*</span>
          </label>
          <select
            value={data.usageDuration}
            onChange={(e) => onChange("usageDuration", e.target.value)}
            className={selectClassName}
          >
            {USAGE_DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company size</label>
          <select
            value={data.companySize}
            onChange={(e) => onChange("companySize", e.target.value)}
            className={selectClassName}
          >
            {COMPANY_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your role</label>
          <select
            value={data.userRole}
            onChange={(e) => onChange("userRole", e.target.value)}
            className={selectClassName}
          >
            {USER_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            LinkedIn Profile
            <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
              +Verified badge
            </span>
          </label>
          <input
            type="url"
            value={data.linkedinUrl}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-900 mb-1">Your email: {userEmail}</p>
        <p className="text-blue-700">
          We use your email to verify your identity. Work emails matching the tool&apos;s domain
          will receive additional verification.
        </p>
      </div>
    </div>
  );
}
