import { requireAdminPage } from "@/lib/auth-utils";
import Link from "next/link";
import { RadarLogo } from "@/components/ui/radar-logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <RadarLogo className="w-8 h-8" color="#2563EB" />
                <span className="font-bold text-xl text-slate-800">Toolradar</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">Admin</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/admin/tools" className="text-muted-foreground hover:text-foreground transition">
                  Tools
                </Link>
                <Link href="/admin/tools/logos" className="text-muted-foreground hover:text-foreground transition">
                  Logos
                </Link>
                <Link href="/admin/reviews" className="text-muted-foreground hover:text-foreground transition">
                  Reviews
                </Link>
                <Link href="/admin/submissions" className="text-muted-foreground hover:text-foreground transition">
                  Submissions
                </Link>
                <Link href="/admin/claims" className="text-muted-foreground hover:text-foreground transition">
                  Claims
                </Link>
                <Link href="/admin/totd" className="text-muted-foreground hover:text-foreground transition">
                  Tool of the Day
                </Link>
                <Link href="/admin/seed" className="text-muted-foreground hover:text-foreground transition">
                  Seed
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
