import { requireAuth } from "@/lib/auth-utils";
import Link from "next/link";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <p className="font-semibold mb-4">{user.name || user.email}</p>
              <nav className="space-y-1">
                {[
                  { href: "/dashboard", label: "Overview" },
                  { href: "/dashboard/favorites", label: "Favorites" },
                  { href: "/dashboard/lists", label: "Lists" },
                  { href: "/dashboard/reviews", label: "My Reviews" },
                  { href: "/dashboard/settings", label: "Settings" },
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
