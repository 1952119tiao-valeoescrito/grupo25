const fs = require('fs');
const { execSync } = require('child_process');

console.log("🛠 Iniciando conserto do Tailwind v4...");

// 1. Remover configurações que conflitam com a v4
const conflitos = ['tailwind.config.js', 'postcss.config.js', 'tailwind.config.ts'];
conflitos.forEach(f => {
    if (fs.existsSync(f)) {
        fs.unlinkSync(f);
        console.log(`🗑 Apagado: ${f}`);
    }
});

// 2. Criar a nova configuração de PostCSS exigida pelo erro
const postcssMjs = `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
fs.writeFileSync('postcss.config.mjs', postcssMjs.trim());
console.log("✅ Criado: postcss.config.mjs");

// 3. Resetar o globals.css para o padrão v4 puro
const cssV4 = `
@import "tailwindcss";

@theme {
  --color-background: #020617;
  --color-primary: #22c55e;
}

@layer base {
  body {
    background-color: #020617;
    color: white;
    -webkit-font-smoothing: antialiased;
  }
}

/* Estilos básicos para os inputs aparecerem bem */
input {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  color: white;
  outline: none;
}
input:focus {
  border-color: #22c55e;
}
`;
fs.writeFileSync('src/app/globals.css', cssV4.trim());
console.log("✅ Atualizado: src/app/globals.css");

// 4. Instalar o pacote que o erro pediu (@tailwindcss/postcss)
console.log("📦 Instalando dependência de compatibilidade...");
try {
    execSync('npm install @tailwindcss/postcss postcss', { stdio: 'inherit' });
    console.log("\n🚀 CONSERTO CONCLUÍDO!");
} catch (e) {
    console.log("❌ Erro na instalação. Tente rodar 'npm install @tailwindcss/postcss' manualmente.");
}