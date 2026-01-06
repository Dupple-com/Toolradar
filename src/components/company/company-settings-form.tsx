"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Linkedin } from "lucide-react";

interface CompanySettingsFormProps {
  company: {
    id: string;
    linkedinUrl: string | null;
  };
}

export function CompanySettingsForm({ company }: CompanySettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState(company.linkedinUrl || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/company/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl: linkedinUrl || null }),
      });

      if (res.ok) {
        toast.success("Settings saved!");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Company Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <span className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              LinkedIn Page URL
            </span>
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/company/your-company"
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be displayed on your public company page
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Settings
      </button>
    </form>
  );
}
