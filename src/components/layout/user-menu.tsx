"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Building2, Shield, Star, ChevronDown } from "lucide-react";

interface UserMenuProps {
  userName: string | null;
  userImage: string | null;
  hasCompany?: boolean;
  isAdmin?: boolean;
}

export function UserMenu({ userName, userImage, hasCompany, isAdmin }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-100 text-sm font-medium"
      >
        {userImage ? (
          <img src={userImage} alt={`${userName || "User"}'s profile picture`} className="w-6 h-6 rounded-full" />
        ) : (
          <User size={18} />
        )}
        <span className="hidden lg:flex items-center gap-1 max-w-[100px]">
          <span className="truncate">{userName || "Account"}</span>
          {isAdmin && <Star size={12} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          {hasCompany && (
            <Link
              href="/company"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Building2 size={16} />
              Company
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors"
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
          <hr className="my-1 border-gray-100" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
