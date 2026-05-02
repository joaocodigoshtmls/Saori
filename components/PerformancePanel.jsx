import EmptyState from "@/components/EmptyState";

export default function PerformancePanel({ performance }) {
  const accuracy = performance.total
    ? Math.round(((performance.correct + performance.partial * 0.5) / performance.total) * 100)
    : 0;

  return (
    <section className="mt-5 rounded-lg border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Meu desempenho</p>
          <h3 className="text-lg font-extrabold">Evolução por tópico</h3>
        </div>
        <span className="rounded-lg bg-soft px-3 py-2 text-sm font-bold text-muted">{accuracy}% geral</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Respondidas" value={performance.total} />
        <Metric label="Acertos" value={performance.correct} />
        <Metric label="Parciais" value={performance.partial} />
        <Metric label="Dias seguidos" value={performance.streakDays} />
      </div>

      {performance.total ? (
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <StatsList title="Por tópico" items={performance.byTopic} />
          <StatsList title="Objetivas e discursivas" items={performance.byType.map((item) => ({
            ...item,
            name: item.name === "multiple" ? "Objetivas" : item.name === "discursive" ? "Discursivas" : item.name
          }))} />
          <SimpleList title="Tópicos mais fracos" items={performance.weakestTopics.map((item) => `${item.name}: ${item.accuracy}%`)} />
          <SimpleList title="Questões mais erradas" items={performance.mostMissed.map((item) => `${item.code} · ${item.topic} (${item.misses})`)} />
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState text="Responda algumas questões para ver porcentagens, pontos fracos e sequência de estudos." />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-soft p-3">
      <p className="text-sm font-bold text-muted">{label}</p>
      <strong className="text-2xl">{value}</strong>
    </div>
  );
}

function StatsList({ title, items }) {
  return (
    <div>
      <h4 className="font-extrabold">{title}</h4>
      <div className="mt-2 grid gap-2">
        {items.length ? items.map((item) => (
          <div key={item.name} className="rounded-lg border border-line p-3">
            <div className="flex justify-between gap-3 text-sm font-bold">
              <span>{item.name}</span>
              <span>{item.accuracy}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
              <div className="h-full bg-accent" style={{ width: `${item.accuracy}%` }} />
            </div>
            <p className="mt-1 text-sm text-muted">{item.total} respostas · {item.incorrect} erros</p>
          </div>
        )) : <EmptyState text="Sem dados suficientes." />}
      </div>
    </div>
  );
}

function SimpleList({ title, items }) {
  return (
    <div>
      <h4 className="font-extrabold">{title}</h4>
      <div className="mt-2 grid gap-2">
        {items.length ? items.map((item) => (
          <div key={item} className="rounded-lg border border-line p-3 text-sm">{item}</div>
        )) : <EmptyState text="Nada crítico por enquanto." />}
      </div>
    </div>
  );
}
