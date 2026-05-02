"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "question-library-v2";
const HISTORY_KEY = "question-history-v2";
const EXPORT_MINIMUM = 100;

const sampleQuestions = [
  {
    code: "BIO-001",
    type: "multiple",
    topic: "Biologia",
    statement: "Qual organela é responsável pela produção principal de ATP na célula eucariótica?",
    options: ["Ribossomo", "Mitocôndria", "Lisossomo", "Complexo golgiense"],
    correctOption: "Mitocôndria",
    explanation: "A mitocôndria realiza a respiração celular e produz a maior parte do ATP usado como energia pela célula.",
    source: "Exemplo"
  },
  {
    code: "HIS-001",
    type: "discursive",
    topic: "História",
    statement: "Explique por que a Constituição de 1988 é conhecida como Constituição Cidadã.",
    expectedAnswer: "A Constituição de 1988 ampliou direitos sociais, políticos e civis depois do período autoritário, fortaleceu a democracia e garantiu maior participação popular.",
    keyPoints: ["ampliou direitos sociais", "fim do período autoritário", "fortaleceu a democracia", "participação popular"],
    explanation: "Uma boa resposta precisa relacionar a Constituição de 1988 à redemocratização e à ampliação de direitos.",
    source: "Exemplo"
  }
];

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [isReady, questions]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, isReady]);

  const topics = useMemo(() => groupByTopic(questions), [questions]);

  const topicQuestions = useMemo(() => {
    const currentTopic = selectedTopic || topics[0]?.name || "";
    return questions.filter((question) => question.topic === currentTopic);
  }, [questions, selectedTopic, topics]);

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
      setImportStatus({
        tone: "error",
        text: error.message || "Não foi possível ler o PDF."
      });
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
        result: result.title,
        status: result.status,
        answer,
        date: new Date().toISOString()
      },
      ...current
    ].slice(0, 60));
  }

  async function exportTopic(topicName) {
    const items = questions
      .filter((question) => question.topic === topicName)
      .sort((a, b) => a.code.localeCompare(b.code, "pt-BR"));

    if (items.length < EXPORT_MINIMUM) return;

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 42;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(`Questões de ${topicName}`, margin, y);
    y += 24;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`${items.length} questões organizadas por código`, margin, y);
    y += 28;

    items.forEach((question, index) => {
      const block = formatQuestionForPdf(question, index + 1);
      y = writeWrappedText(pdf, block, margin, y, pageWidth - margin * 2, pageHeight, margin);
      y += 14;
    });

    pdf.save(`${slugify(topicName)}-${items.length}-questoes.pdf`);
  }

  const currentTopicCount = topicQuestions.length;

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

          <section className="mt-5 rounded-lg border border-line bg-white p-3">
            <label className="grid cursor-pointer gap-3 rounded-lg border border-dashed border-accent/50 bg-soft p-4 text-center font-bold text-accent-strong">
              {isImporting ? "Importando..." : "Enviar PDF"}
              <input className="sr-only" type="file" accept="application/pdf" onChange={importPdf} disabled={isImporting} />
            </label>
            {importStatus && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold ${statusClass(importStatus.tone)}`}>
                {importStatus.text}
              </p>
            )}
            <button className="mt-3 w-full rounded-lg border border-line bg-white px-4 py-3 font-bold hover:bg-soft" onClick={addExamples}>
              Adicionar exemplos
            </button>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-extrabold">Tópicos</h2>
              <span className="rounded-lg bg-soft px-3 py-1 text-sm font-bold text-muted">{questions.length} questões</span>
            </div>

            <div className="mt-3 grid max-h-[46vh] gap-2 overflow-auto pr-1">
              {topics.length ? topics.map((topic) => (
                <button
                  key={topic.name}
                  className={`grid gap-2 rounded-lg border bg-white p-3 text-left transition ${
                    topic.name === (selectedTopic || topics[0]?.name) ? "border-accent ring-4 ring-accent/15" : "border-line hover:border-accent/50"
                  }`}
                  onClick={() => selectTopic(topic.name)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <strong>{topic.name}</strong>
                    <span className="text-sm font-bold text-muted">{topic.count}/{EXPORT_MINIMUM}</span>
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-soft">
                    <span className="block h-full bg-accent" style={{ width: `${Math.min(100, (topic.count / EXPORT_MINIMUM) * 100)}%` }} />
                  </span>
                  <span className="text-sm text-muted">
                    {topic.count >= EXPORT_MINIMUM ? "PDF liberado" : `Faltam ${EXPORT_MINIMUM - topic.count}`}
                  </span>
                </button>
              )) : (
                <EmptyState text="Nenhum tópico importado ainda." />
              )}
            </div>
          </section>
        </aside>

        <section className="rounded-lg border border-line/90 bg-white/90 p-4 shadow-panel sm:p-6 xl:min-h-[calc(100vh-48px)]">
          <div className="grid gap-4 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
            <section className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-muted">Espaço do tópico</p>
                  <h2 className="mt-1 text-2xl font-extrabold">{selectedTopic || topics[0]?.name || "Sem tópico"}</h2>
                </div>
                <span className="rounded-lg bg-soft px-3 py-2 text-sm font-bold text-muted">{currentTopicCount}</span>
              </div>

              <button
                className={`mt-4 w-full rounded-lg px-4 py-3 font-bold ${
                  currentTopicCount >= EXPORT_MINIMUM
                    ? "bg-accent text-white hover:bg-accent-strong"
                    : "cursor-not-allowed border border-line bg-soft text-muted"
                }`}
                disabled={currentTopicCount < EXPORT_MINIMUM}
                onClick={() => exportTopic(selectedTopic || topics[0]?.name)}
              >
                Baixar PDF do tópico
              </button>

              <label className="mt-4 grid gap-2 text-sm font-bold text-muted">
                Buscar no tópico
                <input
                  className={inputClass}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Código ou enunciado"
                  type="search"
                />
              </label>

              <div className="mt-4 grid max-h-[56vh] gap-2 overflow-auto pr-1">
                {filteredQuestions.length ? filteredQuestions.map((question) => (
                  <button
                    key={question.code}
                    className={`grid gap-1 rounded-lg border bg-white p-3 text-left transition ${
                      question.code === selectedQuestion?.code ? "border-accent ring-4 ring-accent/15" : "border-line hover:border-accent/50"
                    }`}
                    onClick={() => selectQuestion(question.code)}
                  >
                    <strong>{question.code}</strong>
                    <span className="text-sm text-muted">{question.type === "multiple" ? "Objetiva" : "Discursiva"}</span>
                    <span className="line-clamp-2 text-sm">{question.statement}</span>
                  </button>
                )) : (
                  <EmptyState text={topicQuestions.length ? "Nenhuma questão encontrada." : "Este tópico ainda não tem questões."} />
                )}
              </div>
            </section>

            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-muted">{selectedQuestion?.code || "Sem código"}</p>
                  <h2 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{selectedQuestion?.topic || "Escolha uma questão"}</h2>
                </div>
                <div className="rounded-lg bg-soft px-4 py-3 text-sm font-bold text-muted">
                  {history.length} respondida{history.length === 1 ? "" : "s"}
                </div>
              </div>

              <article className="mt-5 rounded-lg border border-line bg-white p-4 sm:p-5">
                <p className="text-lg leading-8">
                  {selectedQuestion?.statement || "Envie um PDF para alimentar a biblioteca e começar a responder."}
                </p>

                <form className="mt-5 grid gap-3" onSubmit={gradeAnswer}>
                  {selectedQuestion?.type === "multiple" && selectedQuestion.options.map((option) => (
                    <label key={option} className="grid grid-cols-[20px_1fr] items-start gap-3 rounded-lg border border-line bg-white p-3">
                      <input
                        className="mt-1 h-4 w-4"
                        name="answer"
                        type="radio"
                        checked={answer === option}
                        onChange={() => setAnswer(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}

                  {selectedQuestion?.type === "discursive" && (
                    <textarea
                      className="min-h-44 rounded-lg border border-line p-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Escreva sua resposta discursiva"
                    />
                  )}

                  {selectedQuestion && (
                    <button className="w-fit rounded-lg bg-accent px-5 py-3 font-bold text-white hover:bg-accent-strong" type="submit">
                      Responder
                    </button>
                  )}
                </form>

                {feedback && <Feedback feedback={feedback} explanation={selectedQuestion?.explanation} />}
              </article>

              <section className="mt-5 rounded-lg border border-line bg-white p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-extrabold">Histórico</h3>
                  <button className="w-fit font-bold text-accent-strong" onClick={() => setHistory([])}>
                    Limpar histórico
                  </button>
                </div>
                <div className="mt-4 grid gap-2">
                  {history.length ? history.slice(0, 8).map((item) => (
                    <div key={`${item.date}-${item.code}`} className={`rounded-lg border-l-4 bg-white p-3 ${historyBorder(item.status)}`}>
                      <strong>{item.code} · {item.result}</strong>
                      <p className="text-sm text-muted">{item.topic} · {new Date(item.date).toLocaleString("pt-BR")}</p>
                      <p className="mt-1">{item.answer}</p>
                    </div>
                  )) : (
                    <EmptyState text="As respostas corrigidas aparecem aqui." />
                  )}
                </div>
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feedback({ feedback, explanation }) {
  const tone = {
    correct: "border-good/30 bg-good/10",
    incorrect: "border-bad/30 bg-bad/10",
    partial: "border-warn/30 bg-warn/10"
  }[feedback.status];

  return (
    <div className={`mt-4 rounded-lg border p-4 leading-7 ${tone}`}>
      <strong className="block">{feedback.title}</strong>
      <p>{feedback.message}</p>
      {explanation && <p>{explanation}</p>}
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="rounded-lg border border-dashed border-line p-4 text-muted">{text}</div>;
}

async function extractPdfText(file) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(groupPdfTextLines(content.items));
  }

  return pages.join("\n");
}

function groupPdfTextLines(items) {
  const lines = new Map();

  items.forEach((item) => {
    const y = Math.round(item.transform?.[5] || 0);
    const x = Math.round(item.transform?.[4] || 0);
    const current = lines.get(y) || [];
    current.push({ x, text: item.str });
    lines.set(y, current);
  });

  return [...lines.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, line]) => line.sort((a, b) => a.x - b.x).map((item) => item.text).join(" "))
    .join("\n");
}

function parseQuestionsFromText(text, source) {
  return text
    .split(/\n?\s*---+\s*\n?/g)
    .map((block, index) => parseQuestionBlock(block, index, source))
    .filter(Boolean);
}

function parseQuestionBlock(block, index, source) {
  const topic = readField(block, "TOPICO") || readField(block, "TÓPICO");
  const code = readField(block, "CODIGO") || readField(block, "CÓDIGO");
  const typeField = readField(block, "TIPO");
  const statement = readField(block, "ENUNCIADO");
  const explanation = readField(block, "EXPLICACAO") || readField(block, "EXPLICAÇÃO") || "Revise a resposta correta e os pontos esperados.";

  if (!topic || !statement) return null;

  const type = normalize(typeField).includes("discurs") ? "discursive" : "multiple";
  const finalCode = code || `${slugify(topic).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;

  if (type === "discursive") {
    const expectedAnswer = readField(block, "RESPOSTA ESPERADA") || readField(block, "RESPOSTA");
    const keyPoints = splitLines(readField(block, "PONTOS") || readField(block, "PONTOS OBRIGATORIOS") || readField(block, "PONTOS OBRIGATÓRIOS"));

    if (!expectedAnswer && !keyPoints.length) return null;

    return {
      code: finalCode,
      type,
      topic,
      statement,
      expectedAnswer,
      keyPoints,
      explanation,
      source
    };
  }

  const options = extractOptions(block);
  const correctField = readField(block, "CORRETA") || readField(block, "GABARITO");
  const correctOption = resolveCorrectOption(correctField, options);

  if (options.length < 2 || !correctOption) return null;

  return {
    code: finalCode,
    type,
    topic,
    statement,
    options,
    correctOption,
    explanation,
    source
  };
}

function readField(block, field) {
  const labels = [
    "TOPICO", "TÓPICO", "CODIGO", "CÓDIGO", "TIPO", "ENUNCIADO", "EXPLICACAO", "EXPLICAÇÃO",
    "CORRETA", "GABARITO", "RESPOSTA ESPERADA", "RESPOSTA", "PONTOS", "PONTOS OBRIGATORIOS", "PONTOS OBRIGATÓRIOS"
  ];
  const escapedLabels = labels.map(escapeRegExp).join("|");
  const pattern = new RegExp(`${escapeRegExp(field)}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedLabels})\\s*:|\\n\\s*[A-E][\\).:-]|$)`, "i");
  return (block.match(pattern)?.[1] || "").trim();
}

function extractOptions(block) {
  const matches = [...block.matchAll(/(?:^|\n)\s*([A-E])[\).:-]\s*(.+?)(?=\n\s*[A-E][\).:-]|\n\s*(?:CORRETA|GABARITO)\s*:|$)/gis)];
  return matches.map((match) => `${match[1].toUpperCase()}) ${match[2].replace(/\s+/g, " ").trim()}`);
}

function resolveCorrectOption(value, options) {
  const clean = (value || "").trim();
  if (!clean) return "";
  const letter = clean.match(/^[A-E]/i)?.[0]?.toUpperCase();
  if (letter) {
    return options.find((option) => option.startsWith(`${letter})`)) || clean;
  }
  return options.find((option) => normalize(option) === normalize(clean)) || clean;
}

function mergeQuestions(current, incoming) {
  const byCode = new Map(current.map((question) => [normalize(question.code), question]));
  incoming.forEach((question) => byCode.set(normalize(question.code), question));
  return [...byCode.values()].sort((a, b) => a.topic.localeCompare(b.topic, "pt-BR") || a.code.localeCompare(b.code, "pt-BR"));
}

function groupByTopic(questions) {
  const map = new Map();
  questions.forEach((question) => {
    map.set(question.topic, (map.get(question.topic) || 0) + 1);
  });
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

function gradeMultiple(question, answer) {
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

function gradeDiscursive(question, answer) {
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

function formatQuestionForPdf(question, number) {
  const lines = [
    `${number}. ${question.code} - ${question.type === "multiple" ? "Objetiva" : "Discursiva"}`,
    question.statement
  ];

  if (question.type === "multiple") {
    lines.push(...question.options, `Gabarito: ${question.correctOption}`);
  } else {
    lines.push(`Resposta esperada: ${question.expectedAnswer || "-"}`);
    if (question.keyPoints?.length) lines.push(`Pontos obrigatórios: ${question.keyPoints.join("; ")}`);
  }

  lines.push(`Explicação: ${question.explanation}`);
  return lines.join("\n");
}

function writeWrappedText(pdf, text, x, y, width, pageHeight, margin) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  const lines = pdf.splitTextToSize(text, width);

  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, x, y);
    y += 15;
  });

  return y;
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function splitLines(value) {
  return String(value || "").split(/\n|;/).map((item) => item.trim()).filter(Boolean);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function statusClass(tone) {
  return {
    success: "bg-good/10 text-good",
    error: "bg-bad/10 text-bad",
    neutral: "bg-soft text-muted"
  }[tone] || "bg-soft text-muted";
}

function historyBorder(status) {
  return {
    correct: "border-l-good",
    incorrect: "border-l-bad",
    partial: "border-l-warn"
  }[status] || "border-l-line";
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, "-") || "topico";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const inputClass = "rounded-lg border border-line px-3 py-3 text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15";
