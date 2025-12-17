import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommandSearch } from "@/components/search/command-search";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl flex-shrink-0">
            Tool<span className="text-primary">radar</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/tools"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Browse
            </Link>
            <Link
              href="/trending"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Trending
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Categories
            </Link>
          </nav>

          {/* Search - centered and wider */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <CommandSearch />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search */}
            <div className="sm:hidden">
              <CommandSearch />
            </div>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all hidden md:block"
                >
                  Dashboard
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/submit"
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all"
              >
                List Your Product
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
