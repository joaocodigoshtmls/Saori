"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("saori-theme") || "light";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("saori-theme", nextTheme);

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-2 text-sm font-semibold text-violet-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-violet-200"
      type="button"
      aria-label="Alternar tema"
    >
      <span>{theme === "dark" ? "☀️" : "🌙"}</span>
      <span className="hidden sm:inline">
        {theme === "dark" ? "Claro" : "Escuro"}
      </span>
    </button>
  );
}
