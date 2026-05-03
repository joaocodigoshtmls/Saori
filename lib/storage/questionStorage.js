export function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function normalizeHistoryItems(items) {
  if (!Array.isArray(items)) return [];

  const seen = new Set();
  return items.filter((item) => {
    if (!item?.code || !item?.date) return false;
    const key = [
      item.code,
      item.topic || "",
      item.type || "",
      item.status || "",
      item.answer || "",
      item.date
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
