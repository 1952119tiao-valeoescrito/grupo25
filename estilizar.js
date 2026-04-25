const fs = require('fs');

// 1. Configuração do Tailwind (O cérebro do design)
const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        primary: "#22c55e",
      },
    },
  },
  plugins: [],
};
`;

// 2. CSS Global com as diretivas do Tailwind
const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-[#020617] text-white antialiased;
}

input {
  @apply bg-slate-900 border border-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all;
}
`;

// 3. PostCSS Config
const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

fs.writeFileSync('tailwind.config.js', tailwindConfig.trim());
fs.writeFileSync('postcss.config.js', postcssConfig.trim());
fs.writeFileSync('src/app/globals.css', globalsCss.trim());

console.log("🎨 Design ativado! Agora vamos centralizar tudo...");