import { requireAdmin } from "@/lib/auth-utils";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-bold text-xl">
                Tool<span className="text-primary">radar</span>
                <span className="text-xs ml-2 px-2 py-1 bg-primary/10 text-primary rounded">Admin</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/admin/tools" className="text-muted-foreground hover:text-foreground transition">
                  Tools
                </Link>
                <Link href="/admin/reviews" className="text-muted-foreground hover:text-foreground transition">
                  Reviews
                </Link>
                <Link href="/admin/submissions" className="text-muted-foreground hover:text-foreground transition">
                  Submissions
                </Link>
                <Link href="/admin/totd" className="text-muted-foreground hover:text-foreground transition">
                  Tool of the Day
                </Link>
              </div>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to site
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
