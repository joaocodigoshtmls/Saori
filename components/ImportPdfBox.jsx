export default function ImportPdfBox({ isImporting, importStatus, onImportPdf, onAddExamples }) {
  return (
    <section className="mt-5 rounded-lg border border-line bg-white p-3">
      <label className="grid cursor-pointer gap-3 rounded-lg border border-dashed border-accent/50 bg-soft p-4 text-center font-bold text-accent-strong">
        {isImporting ? "Importando..." : "Enviar PDF"}
        <input className="sr-only" type="file" accept="application/pdf" onChange={onImportPdf} disabled={isImporting} />
      </label>
      {importStatus && (
        <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold ${statusClass(importStatus.tone)}`}>
          {importStatus.text}
        </p>
      )}
      <button className="mt-3 w-full rounded-lg border border-line bg-white px-4 py-3 font-bold hover:bg-soft" onClick={onAddExamples}>
        Adicionar exemplos
      </button>
    </section>
  );
}

function statusClass(tone) {
  return {
    success: "bg-good/10 text-good",
    error: "bg-bad/10 text-bad",
    neutral: "bg-soft text-muted"
  }[tone] || "bg-soft text-muted";
}
