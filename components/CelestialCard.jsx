export default function CelestialCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-violet-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-celestial dark:border-slate-700/80 dark:bg-slate-900/75 ${className}`}
    >
      {children}
    </div>
  );
}
