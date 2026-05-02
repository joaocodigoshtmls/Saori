import { escapeRegExp, normalize, slugify, splitLines } from "@/lib/utils/text";

export function parseQuestionsFromText(text, source) {
  return text
    .split(/\n?\s*---+\s*\n?/g)
    .map((block, index) => parseQuestionBlock(block, index, source))
    .filter(Boolean);
}

function parseQuestionBlock(block, index, source) {
  const topic = readField(block, "TOPICO") || readField(block, "TÓPICO");
  const code = readField(block, "CODIGO") || readField(block, "CÓDIGO");
  const typeField = readField(block, "TIPO");
  const statement = readField(block, "ENUNCIADO");
  const explanation = readField(block, "EXPLICACAO") || readField(block, "EXPLICAÇÃO") || "Revise a resposta correta e os pontos esperados.";

  if (!topic || !statement) return null;

  const type = normalize(typeField).includes("discurs") ? "discursive" : "multiple";
  const finalCode = code || `${slugify(topic).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;

  if (type === "discursive") {
    const expectedAnswer = readField(block, "RESPOSTA ESPERADA") || readField(block, "RESPOSTA");
    const keyPoints = splitLines(readField(block, "PONTOS") || readField(block, "PONTOS OBRIGATORIOS") || readField(block, "PONTOS OBRIGATÓRIOS"));

    if (!expectedAnswer && !keyPoints.length) return null;

    return { code: finalCode, type, topic, statement, expectedAnswer, keyPoints, explanation, source };
  }

  const options = extractOptions(block);
  const correctField = readField(block, "CORRETA") || readField(block, "GABARITO");
  const correctOption = resolveCorrectOption(correctField, options);

  if (options.length < 2 || !correctOption) return null;

  return { code: finalCode, type, topic, statement, options, correctOption, explanation, source };
}

function readField(block, field) {
  const labels = [
    "TOPICO", "TÓPICO", "CODIGO", "CÓDIGO", "TIPO", "ENUNCIADO", "EXPLICACAO", "EXPLICAÇÃO",
    "CORRETA", "GABARITO", "RESPOSTA ESPERADA", "RESPOSTA", "PONTOS", "PONTOS OBRIGATORIOS", "PONTOS OBRIGATÓRIOS"
  ];
  const escapedLabels = labels.map(escapeRegExp).join("|");
  const pattern = new RegExp(`${escapeRegExp(field)}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedLabels})\\s*:|\\n\\s*[A-E][\\).:-]|$)`, "i");
  return (block.match(pattern)?.[1] || "").trim();
}

function extractOptions(block) {
  const matches = [...block.matchAll(/(?:^|\n)\s*([A-E])[\).:-]\s*(.+?)(?=\n\s*[A-E][\).:-]|\n\s*(?:CORRETA|GABARITO)\s*:|$)/gis)];
  return matches.map((match) => `${match[1].toUpperCase()}) ${match[2].replace(/\s+/g, " ").trim()}`);
}

function resolveCorrectOption(value, options) {
  const clean = (value || "").trim();
  if (!clean) return "";
  const letter = clean.match(/^[A-E]/i)?.[0]?.toUpperCase();
  if (letter) return options.find((option) => option.startsWith(`${letter})`)) || clean;
  return options.find((option) => normalize(option) === normalize(clean)) || clean;
}
