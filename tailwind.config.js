/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f8fafc",
        "bg-soft": "#eef2ff",
        surface: "#ffffff",
        "surface-soft": "#f8fafc",
        text: "#0f172a",
        "text-muted": "#64748b",
        ink: "#0f172a",
        muted: "#64748b",
        line: "#e2e8f0",
        soft: "#f8fafc",
        accent: "#4f46e5",
        "accent-strong": "#4338ca",
        primary: "#4f46e5",
        "primary-strong": "#4338ca",
        good: "#16a34a",
        bad: "#dc2626",
        warn: "#d97706"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
