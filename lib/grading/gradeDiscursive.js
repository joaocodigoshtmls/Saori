import { normalize } from "@/lib/utils/text";

export function gradeDiscursive(question, answer) {
  const cleanAnswer = answer.trim();
  if (!cleanAnswer) {
    return {
      status: "incorrect",
      title: "Escreva sua resposta para corrigir",
      message: "A análise precisa de um texto seu.",
      shouldSave: false
    };
  }

  const keyPoints = question.keyPoints || [];
  const matched = keyPoints.filter((point) => containsMeaning(cleanAnswer, point));
  const missing = keyPoints.filter((point) => !containsMeaning(cleanAnswer, point));
  const expectedSimilarity = similarity(cleanAnswer, question.expectedAnswer || "");
  const pointScore = keyPoints.length ? matched.length / keyPoints.length : 0;
  const score = Math.max(pointScore, expectedSimilarity);

  if (score >= 0.75) {
    return {
      status: "correct",
      title: "Provavelmente correto",
      message: "Sua resposta cobre os pontos principais esperados.",
      shouldSave: true
    };
  }

  if (score >= 0.42) {
    return {
      status: "partial",
      title: "Parcialmente correto",
      message: missing.length ? `Você acertou parte da ideia, mas faltou abordar: ${missing.join("; ")}.` : "Sua resposta está próxima, mas precisa ficar mais completa e específica.",
      shouldSave: true
    };
  }

  return {
    status: "incorrect",
    title: "Provavelmente incorreto",
    message: missing.length ? `O erro está na ausência destes pontos: ${missing.join("; ")}.` : "A resposta ficou distante do modelo esperado.",
    shouldSave: true
  };
}

function containsMeaning(answer, point) {
  const answerWords = new Set(normalize(answer).split(" ").filter((word) => word.length > 2));
  const pointWords = normalize(point).split(" ").filter((word) => word.length > 2);
  if (!pointWords.length) return false;
  const hits = pointWords.filter((word) => answerWords.has(word)).length;
  return hits / pointWords.length >= 0.6;
}

function similarity(answer, expected) {
  const answerWords = new Set(normalize(answer).split(" ").filter((word) => word.length > 3));
  const expectedWords = normalize(expected).split(" ").filter((word) => word.length > 3);
  if (!answerWords.size || !expectedWords.length) return 0;
  const hits = expectedWords.filter((word) => answerWords.has(word)).length;
  return hits / expectedWords.length;
}
