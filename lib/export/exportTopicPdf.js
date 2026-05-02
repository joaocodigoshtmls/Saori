import { slugify } from "@/lib/utils/text";

export async function exportTopicPdf(topicName, questions) {
  const items = questions
    .filter((question) => question.topic === topicName)
    .sort((a, b) => a.code.localeCompare(b.code, "pt-BR"));

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 42;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = margin;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(`Questões de ${topicName}`, margin, y);
  y += 24;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`${items.length} questões organizadas por código`, margin, y);
  y += 28;

  items.forEach((question, index) => {
    const block = formatQuestionForPdf(question, index + 1);
    y = writeWrappedText(pdf, block, margin, y, pageWidth - margin * 2, pageHeight, margin);
    y += 14;
  });

  pdf.save(`${slugify(topicName)}-${items.length}-questoes.pdf`);
}

function formatQuestionForPdf(question, number) {
  const lines = [
    `${number}. ${question.code} - ${question.type === "multiple" ? "Objetiva" : "Discursiva"}`,
    question.statement
  ];

  if (question.type === "multiple") {
    lines.push(...question.options, `Gabarito: ${question.correctOption}`);
  } else {
    lines.push(`Resposta esperada: ${question.expectedAnswer || "-"}`);
    if (question.keyPoints?.length) lines.push(`Pontos obrigatórios: ${question.keyPoints.join("; ")}`);
  }

  lines.push(`Explicação: ${question.explanation}`);
  return lines.join("\n");
}

function writeWrappedText(pdf, text, x, y, width, pageHeight, margin) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  const lines = pdf.splitTextToSize(text, width);

  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, x, y);
    y += 15;
  });

  return y;
}
