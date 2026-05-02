export async function extractPdfText(file) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(groupPdfTextLines(content.items));
  }

  return pages.join("\n");
}

function groupPdfTextLines(items) {
  const lines = new Map();

  items.forEach((item) => {
    const y = Math.round(item.transform?.[5] || 0);
    const x = Math.round(item.transform?.[4] || 0);
    const current = lines.get(y) || [];
    current.push({ x, text: item.str });
    lines.set(y, current);
  });

  return [...lines.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, line]) => line.sort((a, b) => a.x - b.x).map((item) => item.text).join(" "))
    .join("\n");
}
