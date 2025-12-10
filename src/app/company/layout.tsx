import { requireCompany } from "@/lib/auth-utils";
import Link from "next/link";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCompany();

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl">
                Tool<span className="text-primary">radar</span>
                <span className="text-xs ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded">Company</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/company" className="text-muted-foreground hover:text-foreground transition">
                  Overview
                </Link>
                <Link href="/company/tools" className="text-muted-foreground hover:text-foreground transition">
                  My Tools
                </Link>
                <Link href="/company/analytics" className="text-muted-foreground hover:text-foreground transition">
                  Analytics
                </Link>
                <Link href="/company/badges" className="text-muted-foreground hover:text-foreground transition">
                  Badges
                </Link>
                <Link href="/company/submit" className="text-muted-foreground hover:text-foreground transition">
                  Submit Tool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
