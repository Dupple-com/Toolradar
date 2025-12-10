import { requireCompany } from "@/lib/auth-utils";
import { SubmissionForm } from "@/components/company/submission-form";

export default async function SubmitToolPage() {
  await requireCompany();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Submit a Tool</h1>
        <p className="text-muted-foreground mt-1">
          Submit your tool for review. We&apos;ll evaluate it and add it to Toolradar if it meets our quality standards.
        </p>
      </div>
      <SubmissionForm />
    </div>
  );
}
