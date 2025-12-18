import { requireCompanyMemberPage } from "@/lib/auth-utils";
import Link from "next/link";
import { Header } from "@/components/layout/header";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company } = await requireCompanyMemberPage();

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <p className="font-semibold mb-1">{company.name}</p>
              <p className="text-xs text-muted-foreground mb-4">Company Dashboard</p>
              <nav className="space-y-1">
                {[
                  { href: "/company", label: "Overview" },
                  { href: "/company/analytics", label: "Analytics" },
                  { href: "/company/badges", label: "Badges" },
                  { href: "/company/submit", label: "Submit Tool" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg hover:bg-muted transition text-sm"
                  >
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
