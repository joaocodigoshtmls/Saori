/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1e2428",
        muted: "#657178",
        line: "#d8dee2",
        soft: "#f3f6f7",
        accent: "#1d766f",
        "accent-strong": "#155d58",
        good: "#1f7a3d",
        bad: "#bb2f3a",
        warn: "#a84821"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(30, 36, 40, 0.12)"
      }
    }
  },
  plugins: []
};
