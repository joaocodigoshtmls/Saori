"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { href: "/", label: "Questões" },
    { href: "/performance", label: "Desempenho" },
    { href: "/history", label: "Histórico" },
    { href: "/games", label: "Mini-games" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto max-w-[1380px] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2" prefetch onClick={() => setIsMenuOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
              S
            </div>

            <div>
              <p className="text-sm font-bold leading-none text-ink">Saori</p>
              <p className="text-xs text-muted">Banco de Questões</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/#importar"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
              prefetch
              onClick={() => setIsMenuOpen(false)}
            >
              Importar PDF
            </Link>

            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-xl font-bold md:hidden"
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-expanded={isMenuOpen}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? "x" : "☰"}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 grid gap-2 rounded-lg border border-line bg-white p-2 md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, active, children, onClick }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium ${
        active ? "bg-soft text-ink" : "text-muted hover:bg-soft hover:text-ink"
      }`}
      prefetch
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
