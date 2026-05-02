import "./globals.css";

export const metadata = {
  title: "Banco de Questões",
  description: "Responda questões objetivas e discursivas com correção imediata.",
  icons: {
    icon: "/favicon-banco-de-questoes.svg",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
