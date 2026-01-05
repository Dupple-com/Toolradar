import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { redirect } from "next/navigation";
import { SubmitToolForm } from "@/components/company/submit-form";
import { Rocket, Clock, CheckCircle } from "lucide-react";

export default async function SubmitToolPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getActiveCompany(user.id);

  if (!company) {
    redirect("/company/setup");
  }

  if (!company.verifiedAt) {
    if (company.verificationToken) {
      redirect(`/company/verify?token=${company.verificationToken}`);
    }
    redirect("/company/setup");
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
          <Rocket className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Submit Your Tool</h1>
        <p className="text-muted-foreground">
          Get listed on Toolradar and reach thousands of potential customers.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-xl mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Review within 48h</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4" />
          <span>Free listing</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl border p-6">
        <SubmitToolForm />
      </div>
    </div>
  );
}
