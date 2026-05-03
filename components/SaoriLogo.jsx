export default function SaoriLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-yellow-300/70 bg-white shadow-gold dark:border-yellow-300/40 dark:bg-slate-900">
        <span className="font-display text-3xl font-bold text-violet-700 dark:text-violet-300">
          S
        </span>

        <span className="absolute -right-1 -top-1 text-lg text-yellow-400">
          ✦
        </span>

        <span className="absolute inset-1 rounded-full border border-violet-300/70 dark:border-violet-400/50" />
      </div>

      <div className="leading-none">
        <p className="font-display text-3xl font-bold text-violet-900 dark:text-violet-100">
          Saori
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Banco de Questões
        </p>
      </div>
    </div>
  );
}
