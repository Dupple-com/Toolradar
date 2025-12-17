import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommandSearch } from "@/components/search/command-search";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-xl text-gray-900">Tool<span className="text-blue-600">radar</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/tools" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-100 font-medium text-sm">
                Browse
              </Link>
              <Link href="/trending" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-100 font-medium text-sm">
                Trending
              </Link>
              <Link href="/categories" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-100 font-medium text-sm">
                Categories
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <CommandSearch />
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            <div className="md:hidden">
              <CommandSearch />
            </div>
            {session ? (
              <Link
                href="/dashboard"
                className="hidden md:block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-100 text-sm font-medium"
              >
                Dashboard
              </Link>
            ) : null}
            <Link
              href="/review"
              className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-100 text-sm font-bold shadow-sm"
            >
              Leave a Review
            </Link>
            <Link
              href="/vendors"
              className="hidden md:block px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-100 text-sm font-medium"
            >
              List Your Product
            </Link>
            <MobileMenu isLoggedIn={!!session} isAdmin={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
