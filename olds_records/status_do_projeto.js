import fs from 'fs';
import path from 'path';

console.log("===============================================");
console.log("🔍 RELATÓRIO DE STATUS: BET-GRUPO25 MATRIX");
console.log("===============================================\n");

const checkFile = (name, desc) => {
    const exists = fs.existsSync(name);
    console.log(`${exists ? '✅' : '❌'} ${name.padEnd(30)} -> ${desc}`);
};

// 1. Estrutura de Pastas e Configurações
console.log("--- INFRAESTRUTURA ---");
checkFile('package.json', 'Configuração de dependências');
checkFile('tsconfig.json', 'Configuração do TypeScript');
checkFile('.env', 'Chaves secretas (Mercado Pago, Base, Neon)');
checkFile('prisma/schema.prisma', 'Mapa do Banco de Dados (Postgres)');

// 2. O Coração Web3
console.log("\n--- BLOCKCHAIN (BASE MAINNET) ---");
checkFile('contracts/BetGrupo25Oficial.sol', 'Contrato Inteligente Oficial');
checkFile('scripts/deploy.js', 'Script de Deploy corrigido');
checkFile('hardhat.config.js', 'Configuração do Hardhat (ESM)');
if (fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf8');
    const addr = env.match(/NEXT_PUBLIC_CONTRACT_ADDRESS="([^"]+)"/);
    console.log(`📍 Contrato no .env: ${addr ? addr[1] : 'Não configurado'}`);
}

// 3. O Visual e APIs
console.log("\n--- FRONTEND & API ---");
checkFile('src/app/page.tsx', 'Interface Matrix Elite');
checkFile('src/app/admin/page.tsx', 'Painel Administrativo');
checkFile('src/app/api/pix/create/route.ts', 'Motor de Cobrança Pix');
checkFile('src/lib/prisma.ts', 'Conexão segura com Banco de Dados');

// 4. Verificação de Versões Críticas
console.log("\n--- VERSÕES INSTALADAS ---");
if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`📦 Next.js: ${pkg.dependencies.next}`);
    console.log(`📦 Prisma: ${pkg.dependencies["@prisma/client"]}`);
    console.log(`📦 Tailwind: ${pkg.devDependencies.tailwindcss || 'v4'}`);
}

console.log("\n===============================================");