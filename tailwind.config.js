/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--background)",
        "bg-soft": "var(--background-soft)",
        surface: "var(--card)",
        "surface-soft": "var(--background-soft)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        ink: "var(--text)",
        muted: "var(--text-muted)",
        line: "var(--border)",
        soft: "var(--background-soft)",
        accent: "var(--primary)",
        "accent-strong": "#6d28d9",
        primary: "var(--primary)",
        "primary-strong": "#6d28d9",
        good: "var(--success)",
        bad: "var(--danger)",
        warn: "var(--accent)"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)",
        celestial: "0 20px 60px rgba(124, 58, 237, 0.18)",
        gold: "0 10px 30px rgba(234, 179, 8, 0.22)"
      },
      backgroundImage: {
        "saori-light":
          "radial-gradient(circle at 20% 10%, rgba(196,181,253,0.55), transparent 30%), radial-gradient(circle at 80% 20%, rgba(234,179,8,0.18), transparent 24%), linear-gradient(135deg, #F9FAFB 0%, #F3E8FF 45%, #EFF6FF 100%)",
        "saori-dark":
          "radial-gradient(circle at 20% 10%, rgba(124,58,237,0.35), transparent 30%), radial-gradient(circle at 80% 20%, rgba(250,204,21,0.13), transparent 24%), linear-gradient(135deg, #020617 0%, #0F172A 55%, #111827 100%)"
      },
      fontFamily: {
        display: ["Georgia", "serif"]
      }
    }
  },
  plugins: []
};
