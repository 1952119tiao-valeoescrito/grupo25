const fs = require('fs');
const path = require('path');

console.log("🛠 Iniciando correção de caminhos e variáveis...");

// 1. Corrigir o arquivo de API (Mudar o import de @/lib para caminho relativo)
const apiPath = 'src/app/api/pix/create/route.ts';
if (fs.existsSync(apiPath)) {
    let content = fs.readFileSync(apiPath, 'utf8');
    // Troca o @/lib/prisma por ../../../lib/prisma (caminho real no Windows)
    content = content.replace("@/lib/prisma", "../../../lib/prisma");
    fs.writeFileSync(apiPath, content);
    console.log("✅ Caminho do Prisma corrigido na API.");
}

// 2. Corrigir o .env (Colocar um endereço fictício para parar o erro de ENS)
const envPath = '.env';
if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    // Substitui o texto genérico por um endereço hexadecimal válido (mesmo que zerado)
    envContent = envContent.replace("ENDERECO_DO_CONTRATO_DO_REMIX", "0x0000000000000000000000000000000000000000");
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Endereço de contrato placeholder corrigido no .env.");
}

// 3. Garantir que o tsconfig.json aceite o alias @ (Opcional, mas boa prática)
const tsConfigPath = 'tsconfig.json';
if (fs.existsSync(tsConfigPath)) {
    let tsContent = fs.readFileSync(tsConfigPath, 'utf8');
    if (!tsContent.includes('"@/*"')) {
        console.log("⚠️ Nota: Seu tsconfig pode precisar de ajustes de alias, mas usamos caminhos relativos para garantir.");
    }
}

console.log("\n🚀 Tente rodar 'npm run dev' agora!");