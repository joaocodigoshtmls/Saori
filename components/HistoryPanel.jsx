import EmptyState from "@/components/EmptyState";

export default function HistoryPanel({ history, onClear, limit = 8 }) {
  return (
    <section id="historico" className="mt-5 scroll-mt-24 rounded-lg border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="text-lg font-extrabold">Histórico</h3>
        {history.length > 0 && (
          <button className="w-fit font-bold text-accent-strong" onClick={onClear}>
            Limpar histórico
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-2">
        {history.length ? history.slice(0, limit).map((item) => (
          <div key={item.id || `${item.date}-${item.code}-${item.answer}`} className={`min-w-0 rounded-lg border-l-4 bg-white p-3 ${historyBorder(item.status)}`}>
            <strong className="break-words">{item.code} · {item.result}</strong>
            <p className="break-words text-sm text-muted">
              {item.topic} · {typeLabel(item.type)} · {formatBrasiliaDate(item.date)}
            </p>
            <p className="mt-1 break-words">{item.answer}</p>
          </div>
        )) : (
          <EmptyState text="As respostas corrigidas aparecem aqui." />
        )}
      </div>
    </section>
  );
}

function typeLabel(type) {
  return type === "multiple" ? "Objetiva" : type === "discursive" ? "Discursiva" : "Sem tipo";
}

function formatBrasiliaDate(date) {
  return new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
  });
}

function historyBorder(status) {
  return {
    correct: "border-l-good",
    incorrect: "border-l-bad",
    partial: "border-l-warn"
  }[status] || "border-l-line";
}
