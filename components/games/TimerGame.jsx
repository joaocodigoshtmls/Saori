"use client";

import { useEffect, useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";
import FeedbackBox from "@/components/FeedbackBox";
import { gradeDiscursive } from "@/lib/grading/gradeDiscursive";
import { gradeMultiple } from "@/lib/grading/gradeMultiple";
import { TIMER_DURATIONS, formatTime, pointsForStatus, shuffleQuestions } from "@/lib/games/timerGame";
import { STORAGE_KEY } from "@/lib/storage/keys";
import { readStorage } from "@/lib/storage/questionStorage";

export default function TimerGame() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState("Todos");
  const [duration, setDuration] = useState(TIMER_DURATIONS[1].seconds);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setQuestions(readStorage(STORAGE_KEY, []));
  }, []);

  useEffect(() => {
    if (status !== "running") return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("finished");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
  }, [currentIndex]);

  const topics = useMemo(() => {
    return ["Todos", ...new Set(questions.map((question) => question.topic))];
  }, [questions]);

  const availableQuestions = useMemo(() => {
    return topic === "Todos" ? questions : questions.filter((question) => question.topic === topic);
  }, [questions, topic]);

  const currentQuestion = queue[currentIndex] || null;
  const correctCount = results.filter((item) => item.status === "correct").length;
  const partialCount = results.filter((item) => item.status === "partial").length;
  const incorrectCount = results.filter((item) => item.status === "incorrect").length;

  function startGame() {
    const nextQueue = shuffleQuestions(availableQuestions);

    setQueue(nextQueue);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setResults([]);
    setTimeLeft(duration);
    setStatus(nextQueue.length ? "running" : "idle");
  }

  function finishGame() {
    setStatus("finished");
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (!currentQuestion || status !== "running") return;

    const result = currentQuestion.type === "multiple"
      ? gradeMultiple(currentQuestion, answer)
      : gradeDiscursive(currentQuestion, answer);

    if (!result.shouldSave) {
      setFeedback(result);
      return;
    }

    const points = pointsForStatus(result.status);
    setScore((current) => current + points);
    setResults((current) => [
      ...current,
      {
        code: currentQuestion.code,
        topic: currentQuestion.topic,
        status: result.status,
        points
      }
    ]);
    setFeedback({ ...result, message: `${result.message} Pontuação da questão: ${points > 0 ? "+" : ""}${points}.` });
  }

  function nextQuestion() {
    const nextIndex = currentIndex + 1;

    setAnswer("");
    setFeedback(null);

    if (nextIndex >= queue.length) {
      setStatus("finished");
      return;
    }

    setCurrentIndex(nextIndex);
  }

  function resetGame() {
    setQueue([]);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setResults([]);
    setTimeLeft(duration);
    setStatus("idle");
  }

  return (
    <section className="rounded-lg border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Mini-game</p>
          <h2 className="mt-1 text-2xl font-extrabold">Contra o Tempo</h2>
          <p className="mt-1 text-muted">Escolha um tópico, defina o tempo e responda o máximo que conseguir.</p>
        </div>
        <div className="rounded-lg bg-soft px-4 py-3 text-right">
          <p className="text-sm font-bold text-muted">Tempo</p>
          <strong className="text-2xl">{formatTime(timeLeft)}</strong>
        </div>
      </div>

      {questions.length ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <label className="grid gap-2 text-sm font-bold text-muted">
              Tópico
              <select
                className={inputClass}
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                disabled={status === "running"}
              >
                {topics.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold text-muted">
              Duração
              <select
                className={inputClass}
                value={duration}
                onChange={(event) => {
                  const seconds = Number(event.target.value);
                  setDuration(seconds);
                  setTimeLeft(seconds);
                }}
                disabled={status === "running"}
              >
                {TIMER_DURATIONS.map((item) => (
                  <option key={item.seconds} value={item.seconds}>{item.label}</option>
                ))}
              </select>
            </label>

            <div className="flex items-end gap-2">
              {status === "running" ? (
                <button className="rounded-lg border border-line bg-white px-4 py-3 font-bold hover:bg-soft" onClick={finishGame}>
                  Encerrar
                </button>
              ) : (
                <button className="rounded-lg bg-accent px-4 py-3 font-bold text-white hover:bg-accent-strong" onClick={startGame}>
                  Iniciar
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Metric label="Pontos" value={score} />
            <Metric label="Acertos" value={correctCount} />
            <Metric label="Parciais" value={partialCount} />
            <Metric label="Erros" value={incorrectCount} />
          </div>

          {status === "idle" && (
            <div className="mt-5">
              <EmptyState text={`${availableQuestions.length} questão${availableQuestions.length === 1 ? "" : "ões"} disponível${availableQuestions.length === 1 ? "" : "is"} para este modo.`} />
            </div>
          )}

          {status === "running" && currentQuestion && (
            <article key={`${currentQuestion.code}-${currentIndex}`} className="mt-5 rounded-lg border border-line p-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-muted">{currentQuestion.code}</p>
                  <h3 className="text-xl font-extrabold">{currentQuestion.topic}</h3>
                </div>
                <span className="rounded-lg bg-soft px-3 py-2 text-sm font-bold text-muted">
                  {currentIndex + 1}/{queue.length}
                </span>
              </div>

              <p className="mt-4 text-lg leading-8">{currentQuestion.statement}</p>

              <form className="mt-5 grid gap-3" onSubmit={submitAnswer}>
                {currentQuestion.type === "multiple" && currentQuestion.options.map((option) => (
                  <label key={`${currentQuestion.code}-${option}`} className="grid grid-cols-[20px_1fr] items-start gap-3 rounded-lg border border-line bg-white p-3">
                    <input
                      className="mt-1 h-4 w-4"
                      name={`timer-answer-${currentQuestion.code}-${currentIndex}`}
                      type="radio"
                      checked={answer === option}
                      onChange={() => setAnswer(option)}
                      disabled={!!feedback}
                    />
                    <span>{option}</span>
                  </label>
                ))}

                {currentQuestion.type === "discursive" && (
                  <textarea
                    className="min-h-36 rounded-lg border border-line p-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Escreva sua resposta"
                    disabled={!!feedback}
                  />
                )}

                <div className="flex flex-wrap gap-2">
                  {!feedback ? (
                    <button className="rounded-lg bg-accent px-5 py-3 font-bold text-white hover:bg-accent-strong" type="submit">
                      Responder
                    </button>
                  ) : (
                    <button className="rounded-lg bg-accent px-5 py-3 font-bold text-white hover:bg-accent-strong" type="button" onClick={nextQuestion}>
                      Próxima
                    </button>
                  )}
                </div>
              </form>

              {feedback && <FeedbackBox feedback={feedback} explanation={currentQuestion.explanation} />}
            </article>
          )}

          {status === "finished" && (
            <section className="mt-5 rounded-lg border border-line bg-soft p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-muted">Resultado final</p>
              <h3 className="mt-1 text-3xl font-extrabold">{score} pontos</h3>
              <p className="mt-2 text-muted">
                Você respondeu {results.length} questão{results.length === 1 ? "" : "ões"}: {correctCount} acerto{correctCount === 1 ? "" : "s"}, {partialCount} parcial{partialCount === 1 ? "" : "is"} e {incorrectCount} erro{incorrectCount === 1 ? "" : "s"}.
              </p>
              <button className="mt-4 rounded-lg bg-accent px-5 py-3 font-bold text-white hover:bg-accent-strong" onClick={resetGame}>
                Jogar novamente
              </button>
            </section>
          )}
        </>
      ) : (
        <div className="mt-5">
          <EmptyState text="Importe questões em PDF na página inicial para liberar o Contra o Tempo." />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-soft p-3">
      <p className="text-sm font-bold text-muted">{label}</p>
      <strong className="text-2xl">{value}</strong>
    </div>
  );
}

const inputClass = "rounded-lg border border-line px-3 py-3 text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15";
