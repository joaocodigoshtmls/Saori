export default function Loading() {
  return (
    <main className="min-h-screen p-3 text-ink sm:p-6">
      <section className="mx-auto max-w-[1380px] rounded-lg border border-line/90 bg-white/90 p-5 shadow-panel">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-soft" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
          <div className="h-80 animate-pulse rounded-lg bg-soft" />
          <div className="h-80 animate-pulse rounded-lg bg-soft" />
        </div>
      </section>
    </main>
  );
}
