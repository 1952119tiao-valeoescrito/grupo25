import fs from 'fs';

console.log("✈️ Preparando plano de voo para a Vercel...");

// 1. Garantir que o comando de build no package.json está perfeito
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts["build"] = "npx prisma generate && next build";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

// 2. Criar um arquivo de configuração para o Tailwind 4 não dar erro no build
const postcss = `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`.trim();
fs.writeFileSync('postcss.config.mjs', postcss);

console.log("✅ Plano de voo pronto!");
```
**Rode no terminal:** `node preparar_voo.js`

---

### 3. O Deploy Definitivo (O "Agora Vai")

Agora, vamos mandar tudo para o ar de uma forma que a Vercel não tenha como recusar. No terminal:

```cmd
:: 1. Sincroniza o código novo
git add .
git commit -m "Lançamento Oficial: Pix OK + Contrato OK"
git push origin main

:: 2. Dispara o Deploy forçando a Vercel a ignorar caches antigos
vercel deploy --prod --force