import { getCurrentUser } from "@/lib/auth-utils";
import { SubmitToolForm } from "@/components/company/submit-form";

export default async function SubmitToolPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Submit a Tool</h1>
      <p className="text-muted-foreground mb-8">
        Submit your tool for review. Our team will evaluate it and add it to Toolradar if it meets our quality standards.
      </p>
      <SubmitToolForm />
    </div>
  );
}
