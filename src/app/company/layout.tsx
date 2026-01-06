import { requireAuth } from "@/lib/auth-utils";
import { getUserCompanies, getActiveCompany } from "@/lib/company-utils";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { CompanySwitcher } from "@/components/company/company-switcher";
import { LayoutDashboard, BarChart3, Award, PlusCircle, FileText, Code } from "lucide-react";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export default async function CompanyLayout({ children }: CompanyLayoutProps) {
  const user = await requireAuth();
  const companies = await getUserCompanies(user.id);
  const activeCompany = await getActiveCompany(user.id);

  // No company or not verified - simplified layout
  if (!activeCompany || !activeCompany.verifiedAt) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </div>
      </>
    );
  }

  const navItems = [
    { href: "/company", label: "Overview", icon: LayoutDashboard },
    { href: "/company/submissions", label: "Submissions", icon: FileText },
    { href: "/company/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/company/badges", label: "Badges", icon: Award },
    { href: "/company/widget", label: "Widget", icon: Code },
    { href: "/company/submit", label: "Submit Tool", icon: PlusCircle },
  ];

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <div className="bg-card rounded-xl border sticky top-24">
              {/* Company Switcher */}
              <div className="p-2 border-b">
                <CompanySwitcher
                  companies={companies.map((c) => ({
                    id: c.id,
                    name: c.name,
                    domain: c.domain,
                    role: c.role,
                    verifiedAt: c.verifiedAt,
                  }))}
                  activeCompanyId={activeCompany.id}
                />
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1">
                {navItems.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition text-sm"
                  >
                    <link.icon className="w-4 h-4 text-muted-foreground" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
