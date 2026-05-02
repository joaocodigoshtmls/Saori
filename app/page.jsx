"use client";

import { useEffect, useMemo, useState } from "react";
import HistoryPanel from "@/components/HistoryPanel";
import ImportPdfBox from "@/components/ImportPdfBox";
import PerformancePanel from "@/components/PerformancePanel";
import QuestionCard from "@/components/QuestionCard";
import QuestionList from "@/components/QuestionList";
import TopicList from "@/components/TopicList";
import { exportTopicPdf } from "@/lib/export/exportTopicPdf";
import { gradeDiscursive } from "@/lib/grading/gradeDiscursive";
import { gradeMultiple } from "@/lib/grading/gradeMultiple";
import { buildPerformance } from "@/lib/performance/buildPerformance";
import { extractPdfText } from "@/lib/pdf/extractPdfText";
import { parseQuestionsFromText } from "@/lib/pdf/parseQuestions";
import { groupByTopic, mergeQuestions } from "@/lib/questions/questionLibrary";
import { sampleQuestions } from "@/lib/questions/sampleQuestions";
import { readStorage, writeStorage } from "@/lib/storage/questionStorage";
import { normalize } from "@/lib/utils/text";

const STORAGE_KEY = "question-library-v2";
const HISTORY_KEY = "question-history-v2";
const EXPORT_MINIMUM = 100;

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [search, setSearch] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    const savedQuestions = readStorage(STORAGE_KEY, []);
    const savedHistory = readStorage(HISTORY_KEY, []);
    setQuestions(savedQuestions);
    setHistory(savedHistory);
    setSelectedTopic(savedQuestions[0]?.topic || "");
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
  const activeTopic = selectedTopic || topics[0]?.name || "";

  const topicQuestions = useMemo(() => {
    return questions.filter((question) => question.topic === activeTopic);
  }, [activeTopic, questions]);

  const filteredQuestions = useMemo(() => {
    const needle = normalize(search);
    return topicQuestions.filter((question) => {
      const haystack = normalize(`${question.code} ${question.type} ${question.statement}`);
      return haystack.includes(needle);
    });
  }, [topicQuestions, search]);

  const selectedQuestion = useMemo(() => {
    return questions.find((question) => question.code === selectedCode) || topicQuestions[0] || questions[0] || null;
  }, [questions, selectedCode, topicQuestions]);

  const performance = useMemo(() => buildPerformance(history), [history]);

  function selectTopic(topicName) {
    const firstQuestion = questions.find((question) => question.topic === topicName);
    setSelectedTopic(topicName);
    setSelectedCode(firstQuestion?.code || "");
    setAnswer("");
    setFeedback(null);
  }

  function selectQuestion(code) {
    setSelectedCode(code);
    setAnswer("");
    setFeedback(null);
  }

  function addExamples() {
    setQuestions((current) => mergeQuestions(current, sampleQuestions));
    setSelectedTopic(sampleQuestions[0].topic);
    setSelectedCode(sampleQuestions[0].code);
    setFeedback(null);
    setImportStatus({ tone: "success", text: "Exemplos adicionados à biblioteca." });
  }

  async function importPdf(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ tone: "neutral", text: "Lendo PDF..." });

    try {
      const text = await extractPdfText(file);
      const importedQuestions = parseQuestionsFromText(text, file.name);

      if (!importedQuestions.length) {
        setImportStatus({
          tone: "error",
          text: "Não encontrei questões no PDF. Use blocos separados por --- com TOPICO, CODIGO, TIPO, ENUNCIADO e os campos de resposta."
        });
        return;
      }

      setQuestions((current) => mergeQuestions(current, importedQuestions));
      setSelectedTopic(importedQuestions[0].topic);
      setSelectedCode(importedQuestions[0].code);
      setAnswer("");
      setFeedback(null);
      setImportStatus({
        tone: "success",
        text: `${importedQuestions.length} questão${importedQuestions.length === 1 ? "" : "ões"} importada${importedQuestions.length === 1 ? "" : "s"} de ${file.name}.`
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

    setHistory((current) => [
      {
        code: selectedQuestion.code,
        topic: selectedQuestion.topic,
        type: selectedQuestion.type,
        result: result.title,
        status: result.status,
        answer,
        timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
        date: new Date().toISOString()
      },
      ...current
    ].slice(0, 100));
  }

  return (
    <main className="min-h-screen p-3 text-ink sm:p-6">
      <div className="mx-auto grid max-w-[1380px] gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-line/90 bg-white/90 p-4 shadow-panel xl:min-h-[calc(100vh-48px)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent font-extrabold text-white">Q</div>
            <div>
              <h1 className="text-lg font-extrabold">Banco de Questões</h1>
              <p className="text-sm text-muted">Biblioteca por tópico.</p>
            </div>
          </div>

          <ImportPdfBox
            isImporting={isImporting}
            importStatus={importStatus}
            onImportPdf={importPdf}
            onAddExamples={addExamples}
          />

          <TopicList
            topics={topics}
            selectedTopic={activeTopic}
            totalQuestions={questions.length}
            exportMinimum={EXPORT_MINIMUM}
            onSelectTopic={selectTopic}
          />
        </aside>

        <section className="rounded-lg border border-line/90 bg-white/90 p-4 shadow-panel sm:p-6 xl:min-h-[calc(100vh-48px)]">
          <div className="grid gap-4 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
            <QuestionList
              topicName={activeTopic}
              topicCount={topicQuestions.length}
              exportMinimum={EXPORT_MINIMUM}
              search={search}
              questions={filteredQuestions}
              selectedCode={selectedQuestion?.code}
              onSearch={setSearch}
              onSelectQuestion={selectQuestion}
              onExportTopic={() => exportTopicPdf(activeTopic, questions)}
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
              <PerformancePanel performance={performance} />
              <HistoryPanel history={history} onClear={() => setHistory([])} />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
