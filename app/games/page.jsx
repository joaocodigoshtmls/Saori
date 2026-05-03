import GameCard from "@/components/GameCard";
import TimerGame from "@/components/games/TimerGame";
import Navbar from "@/components/Navbar";

const plannedGames = [
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

          <div className="mt-6">
            <TimerGame />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {plannedGames.map((game) => (
              <GameCard key={game.title} {...game} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
