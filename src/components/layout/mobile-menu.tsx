"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export function MobileMenu({ isLoggedIn, isAdmin }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/tools", label: "Browse" },
    { href: "/trending", label: "Trending" },
    { href: "/categories", label: "Categories" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/" className="font-bold text-xl" onClick={() => setIsOpen(false)}>
                Tool<span className="text-primary">radar</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition"
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <hr className="my-4" />
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="px-4 py-6 border-t">
              {isLoggedIn ? (
                <Link
                  href="/api/auth/signout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-center border rounded-lg hover:bg-muted"
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
