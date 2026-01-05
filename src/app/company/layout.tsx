import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Header } from "@/components/layout/header";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

async function getCompanyForUser(userId: string) {
  const membership = await prisma.companyMember.findFirst({
    where: { userId },
    include: { company: true },
  });

  if (membership) return membership.company;

  return prisma.company.findUnique({ where: { userId } });
}

export default async function CompanyLayout({ children }: CompanyLayoutProps) {
  const user = await requireAuth();
  const company = await getCompanyForUser(user.id);

  // No company or not verified - simplified layout
  if (!company || !company.verifiedAt) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </div>
      </>
    );
  }

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
