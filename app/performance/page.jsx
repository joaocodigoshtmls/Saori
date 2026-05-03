"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import StatsPanel from "@/components/StatsPanel";
import { buildPerformance } from "@/lib/performance/buildPerformance";
import { HISTORY_KEY } from "@/lib/storage/keys";
import { normalizeHistoryItems, readStorage } from "@/lib/storage/questionStorage";

export default function PerformancePage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(normalizeHistoryItems(readStorage(HISTORY_KEY, [])));
  }, []);

  const performance = useMemo(() => buildPerformance(history), [history]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-3 text-ink sm:p-6">
        <section className="mx-auto max-w-[1100px]">
          <StatsPanel performance={performance} />
        </section>
      </main>
    </>
  );
}
