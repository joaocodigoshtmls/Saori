import Navbar from "@/components/Navbar";

const games = [
  {
    title: "Contra o Tempo",
    status: "Próximo",
    text: "Responda o máximo de questões possível em uma rodada curta."
  },
  {
    title: "Boss Battle",
    status: "Planejado",
    text: "Derrote um chefe de um tópico acertando sequências de questões."
  },
  {
    title: "Caça ao Erro",
    status: "Planejado",
    text: "Encontre pontos ausentes em respostas discursivas incompletas."
  }
];

export default function GamesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-3 text-ink sm:p-6">
        <section className="mx-auto max-w-[1100px] rounded-lg border border-line/90 bg-white/90 p-4 shadow-panel sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Mini-games</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Modos de estudo</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {games.map((game) => (
              <article key={game.title} className="rounded-lg border border-line bg-white p-4">
                <span className="rounded-lg bg-soft px-3 py-1 text-sm font-bold text-muted">{game.status}</span>
                <h2 className="mt-4 text-xl font-extrabold">{game.title}</h2>
                <p className="mt-2 leading-7 text-muted">{game.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
