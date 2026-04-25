import "./globals.css";

export const metadata = {
  title: "Bet-Grupo25 Oficial",
  description: "Loteria Híbrida Web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}