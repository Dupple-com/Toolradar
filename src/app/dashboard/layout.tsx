import { requireAuth } from "@/lib/auth-utils";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl">
                Tool<span className="text-primary">radar</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
                  Overview
                </Link>
                <Link href="/dashboard/favorites" className="text-muted-foreground hover:text-foreground transition">
                  Favorites
                </Link>
                <Link href="/dashboard/lists" className="text-muted-foreground hover:text-foreground transition">
                  Lists
                </Link>
                <Link href="/dashboard/reviews" className="text-muted-foreground hover:text-foreground transition">
                  Reviews
                </Link>
                <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground transition">
                  Settings
                </Link>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
