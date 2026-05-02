export function buildPerformance(history) {
  const answered = history.filter((item) => item.status);
  const byTopic = groupStats(answered, "topic");
  const byType = groupStats(answered, "type");
  const weakestTopics = [...byTopic].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total).slice(0, 3);
  const mostMissed = countMisses(answered).slice(0, 5);

  return {
    total: answered.length,
    correct: answered.filter((item) => item.status === "correct").length,
    partial: answered.filter((item) => item.status === "partial").length,
    incorrect: answered.filter((item) => item.status === "incorrect").length,
    streakDays: calculateStudyStreak(answered),
    byTopic,
    byType,
    weakestTopics,
    mostMissed
  };
}

function groupStats(items, key) {
  const map = new Map();

  items.forEach((item) => {
    const name = item[key] || "Sem categoria";
    const stats = map.get(name) || { name, total: 0, correct: 0, partial: 0, incorrect: 0, accuracy: 0 };
    stats.total += 1;
    stats.correct += item.status === "correct" ? 1 : 0;
    stats.partial += item.status === "partial" ? 1 : 0;
    stats.incorrect += item.status === "incorrect" ? 1 : 0;
    map.set(name, stats);
  });

  return [...map.values()].map((stats) => ({
    ...stats,
    accuracy: Math.round(((stats.correct + stats.partial * 0.5) / stats.total) * 100)
  }));
}

function countMisses(items) {
  const map = new Map();
  items.filter((item) => item.status !== "correct").forEach((item) => {
    const current = map.get(item.code) || {
      code: item.code,
      topic: item.topic,
      misses: 0
    };
    current.misses += 1;
    map.set(item.code, current);
  });

  return [...map.values()].sort((a, b) => b.misses - a.misses);
}

function calculateStudyStreak(items) {
  const days = new Set(items.map((item) => new Date(item.date).toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
