import Link from "next/link";
import CelestialCard from "@/components/CelestialCard";
import Navbar from "@/components/Navbar";

const toolCards = [
  {
    href: "/questions",
    icon: "📖",
    title: "Questões",
    text: "Treine com questões organizadas por tópicos e disciplinas."
  },
  {
    href: "/questions#importar",
    icon: "☁️",
    title: "Importar PDF",
    text: "Envie seus PDFs e o Saori extrai o conteúdo para criar questões."
  },
  {
    href: "/performance",
    icon: "📊",
    title: "Desempenho",
    text: "Acompanhe sua evolução com relatórios detalhados."
  },
  {
    href: "/games",
    icon: "🎮",
    title: "Mini-games",
    text: "Aprenda se divertindo com desafios rápidos e recompensas."
  }
];

const topics = [
  "Todos",
  "Direito Constitucional",
  "Direito Administrativo",
  "Direito Penal",
  "Direito Civil",
  "Português",
  "+18"
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-saori-light text-slate-900 dark:bg-saori-dark dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="saori-glow absolute left-12 top-32 text-5xl text-yellow-300/60">✦</div>
        <div className="saori-glow absolute right-24 top-44 text-4xl text-violet-300/60">✧</div>
        <div className="absolute left-1/2 top-28 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-700/20" />
      </div>

      <Navbar />

      <section className="relative mx-auto max-w-7xl px-5 pb-12 pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="saori-fade-up">
            <p className="mb-4 text-sm font-bold uppercase text-yellow-600 dark:text-yellow-300">
              Plataforma de estudos <span className="text-yellow-400">✦</span>
            </p>

            <h1 className="font-display text-5xl font-bold leading-tight text-violet-950 dark:text-violet-100 md:text-7xl">
              Estude por questões <br />
              com o Saori <span className="text-yellow-500">✦</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Importe PDFs, organize por tópicos, acompanhe seu desempenho e treine com mini-games.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/questions"
                className="rounded-2xl bg-violet-700 px-7 py-4 font-bold text-white shadow-celestial transition hover:-translate-y-1 hover:bg-violet-800"
              >
                ✦ Começar agora
              </Link>

              <Link
                href="/questions#importar"
                className="rounded-2xl border border-violet-300 bg-white/70 px-7 py-4 font-bold text-violet-800 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md dark:border-violet-500/50 dark:bg-slate-900/70 dark:text-violet-200"
              >
                ⬆ Importar PDF
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute inset-0 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-700/20" />

            <div className="relative rounded-[2rem] border border-white/70 bg-white/30 p-8 text-center shadow-celestial backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/30">
              <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-full border border-yellow-300/60 bg-gradient-to-br from-white/80 to-violet-100/80 shadow-gold dark:from-slate-900 dark:to-violet-950">
                <div className="text-center">
                  <div className="text-8xl">♛</div>
                  <p className="mt-4 font-display text-3xl font-bold text-violet-800 dark:text-violet-200">
                    Sabedoria
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    constelações • estudo • progresso
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 font-bold text-violet-900 dark:text-violet-100">
            <span className="text-yellow-400">✦</span> Ferramentas de estudo
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {toolCards.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr_0.8fr]">
          <QuestionPreview />
          <StatsPreview />
          <MiniGamePreview />
        </section>

        <section className="mt-8">
          <h2 className="mb-4 font-bold text-violet-900 dark:text-violet-100">
            <span className="text-yellow-400">✦</span> Filtrar por tópico
          </h2>

          <div className="flex flex-wrap gap-3">
            {topics.map((topic, index) => (
              <Link
                key={topic}
                href="/questions"
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${
                  index === 0
                    ? "bg-violet-700 text-white"
                    : "border border-violet-200 bg-white/70 text-violet-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-violet-200"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function ToolCard({ href, icon, title, text }) {
  return (
    <Link href={href} className="block">
      <CelestialCard className="h-full">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/60 bg-violet-700 text-2xl shadow-gold">
            {icon}
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-violet-900 dark:text-violet-100">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {text}
            </p>
          </div>
        </div>
      </CelestialCard>
    </Link>
  );
}

function QuestionPreview() {
  const options = [
    "A soberania popular é exercida exclusivamente por meio do voto.",
    "O pluralismo político é vedado às associações civis.",
    "A dignidade da pessoa humana constitui fundamento da República.",
    "Os valores sociais do trabalho e da livre iniciativa são incompatíveis.",
    "A cidadania é restrita aos brasileiros natos."
  ];

  return (
    <CelestialCard>
      <h2 className="mb-4 font-bold text-violet-900 dark:text-violet-100">
        <span className="text-yellow-400">✦</span> Questão em destaque
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
          Direito Constitucional
        </span>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200">
          Média
        </span>
      </div>

      <p className="mb-4 font-medium leading-7 text-slate-700 dark:text-slate-200">
        Sobre os princípios fundamentais da República Federativa do Brasil, assinale a alternativa correta.
      </p>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={option}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              index === 2
                ? "border-violet-400 bg-violet-100 text-violet-900 dark:border-violet-400 dark:bg-violet-900/40 dark:text-violet-100"
                : "border-slate-200 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
            }`}
          >
            <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}</span>
            {option}
          </div>
        ))}
      </div>
    </CelestialCard>
  );
}

function StatsPreview() {
  return (
    <CelestialCard>
      <h2 className="mb-4 font-bold text-violet-900 dark:text-violet-100">
        <span className="text-yellow-400">✦</span> Seu desempenho
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400">Progresso geral</p>
      <p className="mt-1 text-4xl font-black text-violet-700 dark:text-violet-300">72%</p>

      <div className="mt-4 h-3 rounded-full bg-violet-100 dark:bg-slate-800">
        <div className="h-3 w-[72%] rounded-full bg-violet-700 dark:bg-violet-400" />
      </div>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Meta: 80% até 31/05</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric title="Questões" value="1.248" />
        <Metric title="Acertos" value="896" />
        <Metric title="Sequência" value="12 dias" />
        <Metric title="Ranking" value="Top 18%" />
      </div>
    </CelestialCard>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white/60 p-3 text-center dark:border-slate-700 dark:bg-slate-950/40">
      <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 font-bold text-violet-700 dark:text-violet-300">{value}</p>
    </div>
  );
}

function MiniGamePreview() {
  return (
    <CelestialCard className="bg-gradient-to-br from-violet-50/90 to-white/80 dark:from-violet-950/60 dark:to-slate-900/80">
      <h2 className="mb-4 font-bold text-violet-900 dark:text-violet-100">
        <span className="text-yellow-400">✦</span> Mini-game
      </h2>

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-300/60 bg-violet-700 text-3xl shadow-gold">
        ⏱️
      </div>

      <h3 className="font-display text-2xl font-bold text-violet-900 dark:text-violet-100">
        Contra o Tempo
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Responda o máximo de questões corretas antes que o tempo acabe!
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <span className="rounded-2xl bg-white/70 p-2 dark:bg-slate-950/40">10<br />Questões</span>
        <span className="rounded-2xl bg-white/70 p-2 dark:bg-slate-950/40">90s<br />Por questão</span>
        <span className="rounded-2xl bg-white/70 p-2 dark:bg-slate-950/40">+100<br />Bônus</span>
      </div>

      <Link
        href="/games"
        className="mt-6 block w-full rounded-2xl bg-violet-700 py-3 text-center font-bold text-white shadow-celestial transition hover:-translate-y-1 hover:bg-violet-800"
      >
        ▶ Jogar agora
      </Link>
    </CelestialCard>
  );
}
