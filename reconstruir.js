import fs from 'fs';
import { execSync } from 'child_process';

console.log("🏗️ Iniciando reconstrução total do Banco de Dados...");

const schemaCompleto = `
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Round {
  id               Int      @id
  arrecadacaoTotal Int      @default(0)
  concluida        Boolean  @default(false)
  tickets          Ticket[]
}

model Ticket {
  id               String   @id @default(cuid())
  rodadaId         Int
  round            Round    @relation(fields: [rodadaId], references: [id])
  usuarioCpf       String
  usuarioEmail     String
  chavePixPremio   String
  prognosticos     String   
  pago             Boolean  @default(false)
  mpPaymentId      String?  @unique
  acertos          Int?     
  pagoAoGanhador   Boolean  @default(false)
}
`.trim();

// 1. Escreve o arquivo garantindo que as duas tabelas estão lá
fs.writeFileSync('prisma/schema.prisma', schemaCompleto);
console.log("✅ Arquivo schema.prisma reescrito com Round e Ticket.");

try {
  // 2. Apaga o banco de dados antigo para não haver conflito de nomes
  if (fs.existsSync('dev.db')) {
    fs.unlinkSync('dev.db');
    console.log("🗑️ Banco dev.db antigo removido para limpeza.");
  }

  // 3. Força a sincronização e geração do cliente
  console.log("⏳ Sincronizando tabelas (npx prisma db push)...");
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log("⏳ Gerando Cliente (npx prisma generate)...");
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log("\n🚀 BANCO RECONSTRUÍDO! Agora tente rodar: node iniciar_banco.js");
} catch (e) {
  console.error("❌ Erro durante a reconstrução:", e.message);
}