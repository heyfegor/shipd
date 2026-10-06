"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useShipdAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/build/new", label: "New Build" },
  { href: "/reputation", label: "Reputation" },
];

/**
 * Sticky app header used across authenticated screens. Matches the prototype
 * header (blurred obsidian bar, hairline underline, 940px container) with the
 * Shipd wordmark, primary nav, and a logout control.
 */
export function AppHeader() {
  const pathname = usePathname();
  const { authenticated, logout } = useShipdAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hair-soft)] bg-[rgba(9,10,11,0.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[940px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href={authenticated ? "/dashboard" : "/"} className="text-[17px] font-semibold tracking-tight text-text">
          shipd
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 font-mono text-[12px] uppercase tracking-[0.06em] transition-colors ${
                  active ? "text-text" : "text-text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {authenticated && (
            <button
              type="button"
              onClick={() => void logout()}
              className="ml-1 rounded-md border border-[var(--hair-strong)] px-3 py-2 font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted transition-colors hover:text-text"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
