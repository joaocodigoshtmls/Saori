"use client";

import { useEffect, useMemo, useState } from "react";
import ImportPdf from "@/components/ImportPdf";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import QuestionList from "@/components/QuestionList";
import TopicList from "@/components/TopicList";
import { exportTopicPdf } from "@/lib/export/exportTopicPdf";
import { gradeDiscursive } from "@/lib/grading/gradeDiscursive";
import { gradeMultiple } from "@/lib/grading/gradeMultiple";
import { extractPdfText } from "@/lib/pdf/extractPdfText";
import { parseQuestionsFromText } from "@/lib/pdf/parseQuestions";
import { groupByTopic, mergeQuestions } from "@/lib/questions/questionLibrary";
import { HISTORY_KEY, STORAGE_KEY } from "@/lib/storage/keys";
import { normalizeHistoryItems, readStorage, writeStorage } from "@/lib/storage/questionStorage";
import { normalize } from "@/lib/utils/text";

const EXPORT_MINIMUM = 100;

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    const savedQuestions = readStorage(STORAGE_KEY, []);
    const savedHistory = normalizeHistoryItems(readStorage(HISTORY_KEY, []));
    setQuestions(savedQuestions);
    setHistory(savedHistory);
    setSelectedCode(savedQuestions[0]?.code || "");
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeStorage(STORAGE_KEY, questions);
  }, [isReady, questions]);

  useEffect(() => {
    if (!isReady) return;
    writeStorage(HISTORY_KEY, history);
  }, [history, isReady]);

  useEffect(() => {
    setStartedAt(Date.now());
  }, [selectedCode]);

  const topics = useMemo(() => groupByTopic(questions), [questions]);

  const topicQuestions = useMemo(() => {
    if (!selectedTopic) return questions;
    return questions.filter((question) => question.topic === selectedTopic);
  }, [questions, selectedTopic]);

  const filteredQuestions = useMemo(() => {
    const needle = normalize(search);
    return topicQuestions.filter((question) => {
      const matchesType = typeFilter === "all" || question.type === typeFilter;
      const haystack = normalize(`${question.code} ${question.type} ${question.statement}`);
      return matchesType && haystack.includes(needle);
    });
  }, [search, topicQuestions, typeFilter]);

  const selectedQuestion = useMemo(() => {
    const current = filteredQuestions.find((question) => question.code === selectedCode);
    return current || filteredQuestions[0] || null;
  }, [filteredQuestions, selectedCode]);

  function selectTopic(topicName) {
    const firstQuestion = questions.find((question) => !topicName || question.topic === topicName);
    setSelectedTopic(topicName);
    if (!topicName) setTypeFilter("all");
    setSelectedCode(firstQuestion?.code || "");
    setAnswer("");
    setFeedback(null);
  }

  function changeTypeFilter(nextType) {
    const nextQuestions = questions.filter((question) => {
      const matchesTopic = !selectedTopic || question.topic === selectedTopic;
      const matchesType = nextType === "all" || question.type === nextType;
      return matchesTopic && matchesType;
    });
    setTypeFilter(nextType);
    setSelectedCode(nextQuestions[0]?.code || "");
    setAnswer("");
    setFeedback(null);
  }

  function selectQuestion(code) {
    setSelectedCode(code);
    setAnswer("");
    setFeedback(null);
  }

  async function importPdf(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsImporting(true);
    setImportErrors([]);
    setImportStatus({ tone: "neutral", text: "Lendo PDF..." });

    try {
      const text = await extractPdfText(file);
      const importResult = parseQuestionsFromText(text, file.name);
      const importedQuestions = importResult.questions;
      setImportErrors(importResult.errors);

      if (!importedQuestions.length) {
        setImportStatus({
          tone: "error",
          text: "Não foi possível encontrar questões válidas no PDF. Verifique se cada questão está separada por --- e se possui TOPICO, CODIGO, TIPO e ENUNCIADO."
        });
        return;
      }

      setQuestions((current) => mergeQuestions(current, importedQuestions));
      setSelectedTopic(importedQuestions[0].topic);
      setSelectedCode(importedQuestions[0].code);
      setTypeFilter("all");
      setAnswer("");
      setFeedback(null);
      setImportStatus({
        tone: "success",
        text: `${importedQuestions.length} questão${importedQuestions.length === 1 ? "" : "ões"} importada${importedQuestions.length === 1 ? "" : "s"} de ${file.name}.${importResult.errors.length ? ` ${importResult.errors.length} bloco${importResult.errors.length === 1 ? "" : "s"} precisa${importResult.errors.length === 1 ? "" : "m"} de ajuste.` : ""}`
      });
    } catch (error) {
      setImportStatus({ tone: "error", text: error.message || "Não foi possível ler o PDF." });
    } finally {
      setIsImporting(false);
    }
  }

  function gradeAnswer(event) {
    event.preventDefault();
    if (!selectedQuestion) return;

    const result = selectedQuestion.type === "multiple"
      ? gradeMultiple(selectedQuestion, answer)
      : gradeDiscursive(selectedQuestion, answer);

    setFeedback(result);
    if (!result.shouldSave) return;

    setHistory((current) => {
      const now = new Date().toISOString();
      const entry = {
        id: `${selectedQuestion.code}-${Date.now()}`,
        code: selectedQuestion.code,
        topic: selectedQuestion.topic,
        type: selectedQuestion.type,
        result: result.title,
        status: result.status,
        answer,
        timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
        date: now
      };
      const last = current[0];
      const lastDate = last?.date ? new Date(last.date).getTime() : 0;
      const isRapidDuplicate = last
        && last.code === entry.code
        && last.status === entry.status
        && normalize(last.answer) === normalize(entry.answer)
        && Date.now() - lastDate < 10000;

      return isRapidDuplicate ? current : [entry, ...current];
    });
  }

  return (
    <>
    <Navbar />
    <main id="top" className="min-h-screen scroll-mt-24 p-3 text-ink sm:p-6">
      <div
        className="mx-auto grid max-w-[1380px] gap-5 transition-[grid-template-columns] duration-300 ease-out xl:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": isSidebarOpen ? "360px" : "0px" }}
      >
        <aside
          className={`overflow-hidden rounded-lg transition-all duration-300 ease-out ${
            isSidebarOpen
              ? "max-h-[2200px] border border-line/90 bg-white/90 p-4 opacity-100 shadow-panel xl:min-h-[calc(100vh-48px)] xl:max-h-none"
              : "pointer-events-none max-h-0 border-0 bg-transparent p-0 opacity-0 shadow-none xl:max-h-none"
          }`}
          aria-hidden={!isSidebarOpen}
        >
            <button
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-3 text-left font-bold hover:bg-soft"
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-expanded={isSidebarOpen}
            >
              <span>Ocultar biblioteca</span>
              <span className="text-lg leading-none">−</span>
            </button>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent font-extrabold text-white">Q</div>
                <div>
                  <h1 className="text-lg font-extrabold">Banco de Questões</h1>
                  <p className="text-sm text-muted">Biblioteca por tópico.</p>
                </div>
              </div>

              <ImportPdf
                isImporting={isImporting}
                importStatus={importStatus}
                importErrors={importErrors}
                onImportPdf={importPdf}
              />

              <TopicList
                topics={topics}
                selectedTopic={selectedTopic}
                totalQuestions={questions.length}
                exportMinimum={EXPORT_MINIMUM}
                onSelectTopic={selectTopic}
              />
            </div>
        </aside>

        <section className="rounded-lg border border-line/90 bg-white/90 p-4 shadow-panel transition-all duration-300 ease-out sm:p-6 xl:min-h-[calc(100vh-48px)]">
          {!isSidebarOpen && (
            <button
              className="mb-4 flex w-fit items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 font-bold transition hover:bg-soft"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-expanded={isSidebarOpen}
            >
              <span className="text-lg leading-none">+</span>
              <span>Mostrar biblioteca</span>
            </button>
          )}

          <div className="grid gap-4 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
            <QuestionList
              topicName={selectedTopic}
              topicCount={topicQuestions.length}
              exportMinimum={EXPORT_MINIMUM}
              search={search}
              typeFilter={typeFilter}
              questions={filteredQuestions}
              selectedCode={selectedQuestion?.code}
              onSearch={setSearch}
              onTypeFilter={changeTypeFilter}
              onSelectQuestion={selectQuestion}
              onExportTopic={() => selectedTopic && exportTopicPdf(selectedTopic, questions)}
            />

            <section>
              <QuestionCard
                question={selectedQuestion}
                answer={answer}
                feedback={feedback}
                historyCount={history.length}
                onAnswerChange={setAnswer}
                onSubmit={gradeAnswer}
              />
            </section>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
