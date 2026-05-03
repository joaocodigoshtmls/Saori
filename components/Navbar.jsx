"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SaoriLogo from "@/components/SaoriLogo";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/questions", label: "Questões" },
  { href: "/questions#importar", label: "Importar PDF" },
  { href: "/performance", label: "Desempenho" },
  { href: "/games", label: "Mini-games" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto w-[94%] max-w-7xl rounded-3xl border border-white/70 bg-white/75 shadow-celestial backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-950/75">
      <nav className="px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" prefetch onClick={() => setIsMenuOpen(false)}>
            <SaoriLogo />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(pathname, link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/history"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white/80 text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-violet-200 sm:flex"
              prefetch
              aria-label="Abrir histórico"
              title="Histórico"
            >
              👤
            </Link>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white/80 text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-violet-200 md:hidden"
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-expanded={isMenuOpen}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 grid gap-2 rounded-3xl border border-violet-100 bg-white/90 p-2 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(pathname, link.href)}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink href="/history" active={pathname === "/history"} onClick={() => setIsMenuOpen(false)}>
              Histórico
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

function isActive(pathname, href) {
  const route = href.split("#")[0];
  return pathname === route;
}

function NavLink({ href, active, children, onClick }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-slate-800 dark:hover:text-violet-300 ${
        active ? "bg-violet-100 text-violet-700 dark:bg-slate-800 dark:text-violet-300" : "text-slate-600 dark:text-slate-300"
      }`}
      prefetch
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
