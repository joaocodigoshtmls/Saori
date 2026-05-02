import { normalize } from "@/lib/utils/text";

export function gradeMultiple(question, answer) {
  if (!answer) {
    return {
      status: "incorrect",
      title: "Escolha uma alternativa para corrigir",
      message: "Selecione uma resposta antes de enviar.",
      shouldSave: false
    };
  }

  const isCorrect = normalize(answer) === normalize(question.correctOption);
  return {
    status: isCorrect ? "correct" : "incorrect",
    title: isCorrect ? "Correto" : "Incorreto",
    message: isCorrect ? "Você marcou a alternativa correta." : `A alternativa correta é: ${question.correctOption}.`,
    shouldSave: true
  };
}
