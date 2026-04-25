import fs from 'fs';

console.log("🔗 Vinculando motor de CSS...");

// 1. Configuração do PostCSS para Tailwind v4
const postcssConfig = `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`.trim();

fs.writeFileSync('postcss.config.mjs', postcssConfig);
console.log("✅ postcss.config.mjs configurado.");

// 2. Garantir que o globals.css está no padrão v4
const globalsCss = `
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
`.trim();

fs.writeFileSync('src/app/globals.css', globalsCss);
console.log("✅ src/app/globals.css revisado.");