"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompareStore } from "@/store/useCompareStore";
import { LogIn, Bookmark, GitCompare, Landmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const comparedIds = useCompareStore((state) => state.comparedIds);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const links = [
    { href: "/colleges", label: "Colleges", icon: Landmark },
    { href: "/compare", label: "Compare", icon: GitCompare, badge: comparedIds.length },
    { href: "/saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600 hover:opacity-90">
              <Landmark className="h-6 w-6 stroke-[2.5]" />
              <span>EduFind</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50/60"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Clerk Authentication widgets */}
            <div className="border-l border-gray-200 pl-4 flex items-center gap-2">
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              ) : (
                <UserButton />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-2 pt-2 pb-3 space-y-1 shadow-lg">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 pt-4 pb-2 px-3">
            {!isSignedIn ? (
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="flex items-center justify-center py-2">
                <UserButton />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
