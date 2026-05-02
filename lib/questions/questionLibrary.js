import { normalize } from "@/lib/utils/text";

export function mergeQuestions(current, incoming) {
  const byCode = new Map(current.map((question) => [normalize(question.code), question]));
  incoming.forEach((question) => byCode.set(normalize(question.code), question));
  return [...byCode.values()].sort((a, b) => a.topic.localeCompare(b.topic, "pt-BR") || a.code.localeCompare(b.code, "pt-BR"));
}

export function groupByTopic(questions) {
  const map = new Map();
  questions.forEach((question) => {
    map.set(question.topic, (map.get(question.topic) || 0) + 1);
  });
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
