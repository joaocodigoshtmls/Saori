import { escapeRegExp, normalize, splitLines } from "@/lib/utils/text";

export function parseQuestionsFromText(text, source) {
  const blocks = text
    .split(/\n?\s*---+\s*\n?/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const questions = [];
  const errors = [];

  if (!blocks.length) {
    return {
      questions,
      errors: [{
        block: 0,
        message: "Não foi possível encontrar questões no PDF. Verifique se cada questão está separada por --- e se possui TOPICO, CODIGO, TIPO e ENUNCIADO."
      }]
    };
  }

  blocks.forEach((block, index) => {
    const result = parseQuestionBlock(block, index, source);

    if (result.question) {
      questions.push(result.question);
      return;
    }

    errors.push({
      block: index + 1,
      message: `Bloco ${index + 1}: ${result.error}`
    });
  });

  return { questions, errors };
}

function parseQuestionBlock(block, index, source) {
  const topic = readField(block, "TOPICO") || readField(block, "TÓPICO");
  const code = readField(block, "CODIGO") || readField(block, "CÓDIGO");
  const typeField = readField(block, "TIPO");
  const statement = readField(block, "ENUNCIADO");
  const explanation = readField(block, "EXPLICACAO") || readField(block, "EXPLICAÇÃO") || "Revise a resposta correta e os pontos esperados.";

  if (!topic) return { error: "campo TOPICO ausente." };
  if (!code) return { error: "campo CODIGO ausente." };
  if (!typeField) return { error: "campo TIPO ausente." };
  if (!statement) return { error: "campo ENUNCIADO ausente." };

  const type = parseQuestionType(typeField);
  if (!type) return { error: "campo TIPO deve ser objetiva ou discursiva." };

  const finalCode = code;

  if (type === "discursive") {
    const expectedAnswer = readField(block, "RESPOSTA ESPERADA") || readField(block, "RESPOSTA");
    const keyPoints = splitLines(readField(block, "PONTOS") || readField(block, "PONTOS OBRIGATORIOS") || readField(block, "PONTOS OBRIGATÓRIOS"));

    if (!expectedAnswer && !keyPoints.length) {
      return { error: "questão discursiva sem RESPOSTA ESPERADA ou PONTOS." };
    }

    return {
      question: { code: finalCode, type, topic, statement, expectedAnswer, keyPoints, explanation, source }
    };
  }

  const options = extractOptions(block);
  const correctField = readField(block, "CORRETA") || readField(block, "GABARITO") || readField(block, "RESPOSTA CORRETA");
  const correctOption = resolveCorrectOption(correctField, options);

  if (options.length < 2) return { error: "questão objetiva precisa de pelo menos duas alternativas." };
  if (!correctOption) return { error: "campo CORRETA ou GABARITO ausente." };

  return {
    question: { code: finalCode, type, topic, statement, options, correctOption, explanation, source }
  };
}

function readField(block, field) {
  const labels = [
    "TOPICO", "TÓPICO", "CODIGO", "CÓDIGO", "TIPO", "ENUNCIADO", "EXPLICACAO", "EXPLICAÇÃO",
    "ALTERNATIVAS", "CORRETA", "GABARITO", "RESPOSTA CORRETA", "RESPOSTA ESPERADA", "RESPOSTA",
    "PONTOS", "PONTOS OBRIGATORIOS", "PONTOS OBRIGATÓRIOS"
  ];
  const escapedLabels = labels.map(escapeRegExp).join("|");
  const pattern = new RegExp(`${escapeRegExp(field)}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedLabels})\\s*:|\\n\\s*[A-E][\\).:-]|$)`, "i");
  return (block.match(pattern)?.[1] || "").trim();
}

function parseQuestionType(value) {
  const type = normalize(value);
  if (type.includes("discurs")) return "discursive";
  if (type.includes("objet") || type.includes("multipla") || type.includes("multiple")) return "multiple";
  return "";
}

function extractOptions(block) {
  const matches = [...block.matchAll(/(?:^|\n)\s*([A-E])[\).:-]\s*(.+?)(?=\n\s*[A-E][\).:-]|\n\s*(?:CORRETA|GABARITO|RESPOSTA CORRETA)\s*:|$)/gis)];
  return matches.map((match) => `${match[1].toUpperCase()}) ${match[2].replace(/\s+/g, " ").trim()}`);
}

function resolveCorrectOption(value, options) {
  const clean = (value || "").trim();
  if (!clean) return "";
  const letter = clean.match(/^[A-E]/i)?.[0]?.toUpperCase();
  if (letter) return options.find((option) => option.startsWith(`${letter})`)) || clean;
  return options.find((option) => normalize(option) === normalize(clean)) || clean;
}
