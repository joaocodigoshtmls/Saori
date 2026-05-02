import EmptyState from "@/components/EmptyState";

export default function HistoryPanel({ history, onClear, limit = 8 }) {
  return (
    <section id="historico" className="mt-5 scroll-mt-24 rounded-lg border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="text-lg font-extrabold">Histórico</h3>
        <button className="w-fit font-bold text-accent-strong" onClick={onClear}>
          Limpar histórico
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {history.length ? history.slice(0, limit).map((item) => (
          <div key={`${item.date}-${item.code}`} className={`rounded-lg border-l-4 bg-white p-3 ${historyBorder(item.status)}`}>
            <strong>{item.code} · {item.result}</strong>
            <p className="text-sm text-muted">{item.topic} · {new Date(item.date).toLocaleString("pt-BR")}</p>
            <p className="mt-1">{item.answer}</p>
          </div>
        )) : (
          <EmptyState text="As respostas corrigidas aparecem aqui." />
        )}
      </div>
    </section>
  );
}

function historyBorder(status) {
  return {
    correct: "border-l-good",
    incorrect: "border-l-bad",
    partial: "border-l-warn"
  }[status] || "border-l-line";
}
