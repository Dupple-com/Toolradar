"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Building2, Check, Plus } from "lucide-react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  domain: string;
  role: string;
  verifiedAt: Date | null;
}

interface CompanySwitcherProps {
  companies: Company[];
  activeCompanyId: string;
}

export function CompanySwitcher({ companies, activeCompanyId }: CompanySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const activeCompany = companies.find((c) => c.id === activeCompanyId);

  const handleSwitch = async (companyId: string) => {
    if (companyId === activeCompanyId) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/company/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (res.ok) {
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to switch company:", error);
    }
    setIsLoading(false);
  };

  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{activeCompany?.name || "Select Company"}</p>
            <p className="text-xs text-muted-foreground truncate">{activeCompany?.domain}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg border shadow-lg z-20 py-1">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSwitch(company.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{company.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{company.domain}</p>
                </div>
                {company.id === activeCompanyId && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
            <div className="border-t mt-1 pt-1">
              <Link
                href="/company/setup"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left text-sm text-muted-foreground"
              >
                <Plus className="w-4 h-4" />
                Add another company
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
