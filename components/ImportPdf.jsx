export default function ImportPdf({ isImporting, importStatus, importErrors, onImportPdf }) {
  return (
    <section id="importar" className="mt-5 scroll-mt-24 rounded-lg border border-line bg-white p-3">
      <label className="grid min-h-12 cursor-pointer gap-3 rounded-lg border border-dashed border-accent/50 bg-soft p-4 text-center font-bold text-accent-strong">
        {isImporting ? "Importando..." : "Enviar PDF"}
        <input className="sr-only" type="file" accept="application/pdf" onChange={onImportPdf} disabled={isImporting} />
      </label>
      {importStatus && (
        <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold leading-6 ${statusClass(importStatus.tone)}`}>
          {importStatus.text}
        </p>
      )}
      {!!importErrors?.length && (
        <div className="mt-3 rounded-lg border border-warn/30 bg-warn/10 p-3 text-sm leading-6 text-warn">
          <strong>Algumas questões não foram importadas:</strong>
          <ul className="mt-2 list-disc pl-5">
            {importErrors.map((error) => (
              <li key={`${error.block}-${error.message}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
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
