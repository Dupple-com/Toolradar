"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { RadarLogo } from "@/components/ui/radar-logo";

interface MobileMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export function MobileMenu({ isLoggedIn, isAdmin }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/tools", label: "Browse" },
    { href: "/trending", label: "Trending" },
    { href: "/guides", label: "Guides" },
    { href: "/compare", label: "Compare" },
  ];

  const menuContent = (
    <div
      className="fixed inset-0 bg-white flex flex-col"
      style={{ zIndex: 99999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <RadarLogo className="w-8 h-8" color="#2563EB" />
          <span className="font-bold text-xl text-slate-800" style={{ fontFamily: '"Funnel Display", sans-serif' }}>Toolradar</span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto bg-white">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {link.label}
          </Link>
        ))}

        {isLoggedIn && (
          <>
            <hr className="my-4 border-gray-200" />
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Admin
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-200 space-y-3 bg-white">
        <Link
          href="/vendors"
          onClick={() => setIsOpen(false)}
          className="block w-full px-4 py-3 text-center bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
        >
          List Your Product
        </Link>
        {isLoggedIn ? (
          <Link
            href="/api/auth/signout"
            onClick={() => setIsOpen(false)}
            className="block w-full px-4 py-3 text-center border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Sign Out
          </Link>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full px-4 py-3 text-center border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Portal menu to body */}
      {mounted && isOpen && createPortal(menuContent, document.body)}
    </div>
  );
}
