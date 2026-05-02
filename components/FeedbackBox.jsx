export default function FeedbackBox({ feedback, explanation }) {
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
