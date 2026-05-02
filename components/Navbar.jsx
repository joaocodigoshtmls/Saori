import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1380px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" prefetch>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
            S
          </div>

          <div>
            <p className="text-sm font-bold leading-none text-ink">Saori</p>
            <p className="text-xs text-muted">Banco de Questões</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink href="/">Questões</NavLink>
          <NavLink href="/performance">Desempenho</NavLink>
          <NavLink href="/history">Histórico</NavLink>
          <NavLink href="/games">Mini-games</NavLink>
        </div>

        <Link
          href="/#importar"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
          prefetch
        >
          Importar PDF
        </Link>
      </nav>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-soft hover:text-ink"
      prefetch
    >
      {children}
    </Link>
  );
}
