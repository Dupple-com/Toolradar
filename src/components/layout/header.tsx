import Link from "next/link";
import { RadarLogo } from "@/components/ui/radar-logo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveCompany } from "@/lib/company-utils";
import { CommandSearch } from "@/components/search/command-search";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";

export async function Header() {
  const session = await getServerSession(authOptions);

  // Check if user has a verified company
  let hasVerifiedCompany = false;
  if (session?.user?.id) {
    const company = await getActiveCompany(session.user.id);
    hasVerifiedCompany = !!company?.verifiedAt;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <RadarLogo className="w-8 h-8" color="#2563EB" />
              <span className="font-bold text-xl text-slate-800">Toolradar</span>
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

          {/* Center: Search Bar - hidden on homepage */}
          <CommandSearch />

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <Link
              href="/review"
              className="hidden md:block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-100 text-sm font-medium"
            >
              Leave a Review
            </Link>
            <Link
              href="/vendors"
              className="hidden lg:block px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-100 text-sm font-medium"
            >
              List Your Product
            </Link>
            {session ? (
              <div className="hidden md:flex items-center gap-1">
                <NotificationBell />
                <UserMenu
                  userName={session.user?.name || null}
                  userImage={session.user?.image || null}
                  hasCompany={hasVerifiedCompany}
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-100 text-sm font-medium"
              >
                Join or Log In
              </Link>
            )}
            <MobileMenu isLoggedIn={!!session} isAdmin={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
