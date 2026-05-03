"use client";

import { useEffect, useState } from "react";
import HistoryPanel from "@/components/HistoryPanel";
import Navbar from "@/components/Navbar";
import { HISTORY_KEY } from "@/lib/storage/keys";
import { normalizeHistoryItems, readStorage, writeStorage } from "@/lib/storage/questionStorage";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setHistory(normalizeHistoryItems(readStorage(HISTORY_KEY, [])));
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeStorage(HISTORY_KEY, history);
  }, [history, isReady]);

  function clearHistory() {
    const confirmed = window.confirm("Tem certeza que deseja apagar todo o histórico de respostas?");
    if (!confirmed) return;
    setHistory([]);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-3 text-ink sm:p-6">
        <section className="mx-auto max-w-[900px]">
          <HistoryPanel history={history} onClear={clearHistory} limit={50} />
        </section>
      </main>
    </>
  );
}
