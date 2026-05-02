import EmptyState from "@/components/EmptyState";

const inputClass = "rounded-lg border border-line px-3 py-3 text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15";

export default function QuestionList({
  topicName,
  topicCount,
  exportMinimum,
  search,
  questions,
  selectedCode,
  onSearch,
  onSelectQuestion,
  onExportTopic
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Espaço do tópico</p>
          <h2 className="mt-1 text-2xl font-extrabold">{topicName || "Sem tópico"}</h2>
        </div>
        <span className="rounded-lg bg-soft px-3 py-2 text-sm font-bold text-muted">{topicCount}</span>
      </div>

      <button
        className={`mt-4 w-full rounded-lg px-4 py-3 font-bold ${
          topicCount >= exportMinimum
            ? "bg-accent text-white hover:bg-accent-strong"
            : "cursor-not-allowed border border-line bg-soft text-muted"
        }`}
        disabled={topicCount < exportMinimum}
        onClick={onExportTopic}
      >
        Baixar PDF do tópico
      </button>

      <label className="mt-4 grid gap-2 text-sm font-bold text-muted">
        Buscar no tópico
        <input
          className={inputClass}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Código ou enunciado"
          type="search"
        />
      </label>

      <div className="mt-4 grid max-h-[56vh] gap-2 overflow-auto pr-1">
        {questions.length ? questions.map((question) => (
          <button
            key={question.code}
            className={`grid gap-1 rounded-lg border bg-white p-3 text-left transition ${
              question.code === selectedCode ? "border-accent ring-4 ring-accent/15" : "border-line hover:border-accent/50"
            }`}
            onClick={() => onSelectQuestion(question.code)}
          >
            <strong>{question.code}</strong>
            <span className="text-sm text-muted">{question.type === "multiple" ? "Objetiva" : "Discursiva"}</span>
            <span className="line-clamp-2 text-sm">{question.statement}</span>
          </button>
        )) : (
          <EmptyState text={topicCount ? "Nenhuma questão encontrada." : "Este tópico ainda não tem questões."} />
        )}
      </div>
    </section>
  );
}
