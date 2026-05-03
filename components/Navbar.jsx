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
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3" prefetch onClick={() => setIsMenuOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-sm font-extrabold leading-none text-text">Saori</p>
              <p className="text-xs text-text-muted">Banco de Questões</p>
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
              className="btn-primary hidden md:inline-flex"
              prefetch
              onClick={() => setIsMenuOpen(false)}
            >
              Importar PDF
            </Link>

            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-xl font-bold md:hidden"
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
          <div className="mt-3 grid gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm md:hidden">
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
            <Link
              href="/#importar"
              className="btn-primary mt-2"
              prefetch
              onClick={() => setIsMenuOpen(false)}
            >
              Importar PDF
            </Link>
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
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-indigo-50 text-primary" : "text-text-muted hover:bg-slate-100 hover:text-text"
      }`}
      prefetch
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
