export default function GameCard({ title, status, text }) {
  return (
    <article className="min-w-0 rounded-lg border border-line bg-white p-4">
      <span className="inline-flex rounded-lg bg-soft px-3 py-1 text-sm font-bold text-muted">{status}</span>
      <h2 className="mt-4 break-words text-xl font-extrabold">{title}</h2>
      <p className="mt-2 break-words leading-7 text-muted">{text}</p>
    </article>
  );
}
