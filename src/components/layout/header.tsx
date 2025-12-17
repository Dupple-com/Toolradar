import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommandSearch } from "@/components/search/command-search";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Toolradar" width={140} height={32} priority />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/tools" className="text-muted-foreground hover:text-foreground transition">
                Browse
              </Link>
              <Link href="/trending" className="text-muted-foreground hover:text-foreground transition">
                Trending
              </Link>
              <Link href="/categories" className="text-muted-foreground hover:text-foreground transition">
                Categories
              </Link>
              <Link href="/compare" className="text-muted-foreground hover:text-foreground transition">
                Compare
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <CommandSearch />
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/review"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Leave a Review
              </Link>
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
                    Dashboard
                  </Link>
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground transition">
                      Admin
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition"
                >
                  Sign In
                </Link>
              )}
            </div>
            <MobileMenu
              isLoggedIn={!!session?.user}
              isAdmin={session?.user?.role === "admin"}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
