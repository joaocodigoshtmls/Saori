import FeedbackBox from "@/components/FeedbackBox";

export default function QuestionCard({ question, answer, feedback, historyCount, onAnswerChange, onSubmit }) {
  return (
    <section>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">{question?.code || "Sem código"}</p>
          <h2 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{question?.topic || "Escolha uma questão"}</h2>
        </div>
        <div className="rounded-lg bg-soft px-4 py-3 text-sm font-bold text-muted">
          {historyCount} respondida{historyCount === 1 ? "" : "s"}
        </div>
      </div>

      <article className="mt-5 rounded-lg border border-line bg-white p-4 sm:p-5">
        <p className="text-lg leading-8">
          {question?.statement || "Envie um PDF para alimentar a biblioteca e começar a responder."}
        </p>

        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          {question?.type === "multiple" && question.options.map((option) => (
            <label key={option} className="grid grid-cols-[20px_1fr] items-start gap-3 rounded-lg border border-line bg-white p-3">
              <input
                className="mt-1 h-4 w-4"
                name="answer"
                type="radio"
                checked={answer === option}
                onChange={() => onAnswerChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}

          {question?.type === "discursive" && (
            <textarea
              className="min-h-44 rounded-lg border border-line p-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Escreva sua resposta discursiva"
            />
          )}

          {question && (
            <button className="w-fit rounded-lg bg-accent px-5 py-3 font-bold text-white hover:bg-accent-strong" type="submit">
              Responder
            </button>
          )}
        </form>

        {feedback && <FeedbackBox feedback={feedback} explanation={question?.explanation} />}
      </article>
    </section>
  );
}
