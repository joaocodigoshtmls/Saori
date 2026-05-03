import EmptyState from "@/components/EmptyState";

const inputClass = "rounded-lg border border-line px-3 py-3 text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15";

export default function QuestionList({
  topicName,
  topicCount,
  exportMinimum,
  search,
  typeFilter,
  questions,
  selectedCode,
  onSearch,
  onTypeFilter,
  onSelectQuestion,
  onExportTopic
}) {
  const canExport = Boolean(topicName) && topicCount >= exportMinimum;

  return (
    <section id="questoes" className="scroll-mt-24 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase text-muted">Espaço do tópico</p>
          <h2 className="mt-1 break-words text-2xl font-extrabold">{topicName || "Todas as questões"}</h2>
        </div>
        <span className="w-fit rounded-lg bg-soft px-3 py-2 text-sm font-bold text-muted">{topicCount}</span>
      </div>

      <button
        className={`mt-4 w-full rounded-lg px-4 py-3 font-bold ${
          canExport
            ? "bg-accent text-white hover:bg-accent-strong"
            : "cursor-not-allowed border border-line bg-soft text-muted"
        }`}
        disabled={!canExport}
        onClick={onExportTopic}
      >
        Baixar PDF do tópico
      </button>

      <label className="mt-4 grid gap-2 text-sm font-bold text-muted">
        Buscar
        <input
          className={inputClass}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Código ou enunciado"
          type="search"
        />
      </label>

      <div className="mt-4 grid gap-2 text-sm font-bold text-muted">
        Tipo de questão
        <div className="grid grid-cols-3 gap-2">
          {[
            ["all", "Todas"],
            ["multiple", "Objetivas"],
            ["discursive", "Discursivas"]
          ].map(([value, label]) => (
            <button
              key={value}
              className={`min-h-11 rounded-lg border px-2 py-2 text-center text-sm font-bold transition ${
                typeFilter === value ? "border-accent bg-accent text-white" : "border-line bg-white text-ink hover:bg-soft"
              }`}
              type="button"
              onClick={() => onTypeFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid max-h-[56vh] gap-2 overflow-auto pr-1">
        {questions.length ? questions.map((question) => (
          <button
            key={question.code}
            className={`grid min-w-0 gap-1 rounded-lg border bg-white p-3 text-left transition ${
              question.code === selectedCode ? "border-accent ring-4 ring-accent/15" : "border-line hover:border-accent/50"
            }`}
            type="button"
            onClick={() => onSelectQuestion(question.code)}
          >
            <strong className="break-words">{question.code}</strong>
            <span className="text-sm text-muted">{question.type === "multiple" ? "Objetiva" : "Discursiva"}</span>
            <span className="line-clamp-2 break-words text-sm">{question.statement}</span>
          </button>
        )) : (
          <EmptyState text={topicCount ? "Nenhuma questão encontrada." : "Este tópico ainda não tem questões."} />
        )}
      </div>
    </section>
  );
}
