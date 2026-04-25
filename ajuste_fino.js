import fs from 'fs';

console.log("🔧 Aplicando ajustes finos para o build da Vercel...");

// 1. Ajustar o package.json para usar npx (mais seguro na Vercel)
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts["build"] = "npx prisma generate && next build";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("✅ Comando de build atualizado para 'npx prisma generate'.");

// 2. Garantir que o Layout não tenha erro de fonte (comum em build de servidor)
const layout = `
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
`.trim();
fs.writeFileSync('src/app/layout.tsx', layout);
console.log("✅ Layout simplificado para evitar erros de fonte no build.");

console.log("\n🚀 Agora siga os passos de conferência abaixo.");