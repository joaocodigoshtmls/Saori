export const TIMER_DURATIONS = [
  { label: "1 minuto", seconds: 60 },
  { label: "3 minutos", seconds: 180 },
  { label: "5 minutos", seconds: 300 }
];

export function shuffleQuestions(questions) {
  return [...questions]
    .map((question) => ({ question, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.question);
}

export function pointsForStatus(status) {
  if (status === "correct") return 10;
  if (status === "partial") return 5;
  return -3;
}

export function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
