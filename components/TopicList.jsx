import EmptyState from "@/components/EmptyState";

export default function TopicList({ topics, selectedTopic, totalQuestions, exportMinimum, onSelectTopic }) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold">Tópicos</h2>
        <span className="rounded-lg bg-soft px-3 py-1 text-sm font-bold text-muted">{totalQuestions} questões</span>
      </div>

      <div className="mt-3 grid max-h-[46vh] gap-2 overflow-auto pr-1">
        {topics.length ? topics.map((topic) => (
          <button
            key={topic.name}
            className={`grid gap-2 rounded-lg border bg-white p-3 text-left transition ${
              topic.name === selectedTopic ? "border-accent ring-4 ring-accent/15" : "border-line hover:border-accent/50"
            }`}
            onClick={() => onSelectTopic(topic.name)}
          >
            <span className="flex items-center justify-between gap-3">
              <strong>{topic.name}</strong>
              <span className="text-sm font-bold text-muted">{topic.count}/{exportMinimum}</span>
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-soft">
              <span className="block h-full bg-accent" style={{ width: `${Math.min(100, (topic.count / exportMinimum) * 100)}%` }} />
            </span>
            <span className="text-sm text-muted">
              {topic.count >= exportMinimum ? "PDF liberado" : `Faltam ${exportMinimum - topic.count}`}
            </span>
          </button>
        )) : (
          <EmptyState text="Nenhum tópico importado ainda." />
        )}
      </div>
    </section>
  );
}
