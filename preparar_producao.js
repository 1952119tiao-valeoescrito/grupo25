import fs from 'fs';
import { execSync } from 'child_process';

console.log("🛡️ Blindando o projeto para a Vercel...");

// 1. Garantir o Schema do Prisma para PostgreSQL com suporte a Linux (Vercel)
const schema = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
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

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("✅ prisma/schema.prisma atualizado!");

// 2. Ajustar o package.json para garantir que as ferramentas de build estejam lá
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies["@prisma/client"] = "6.2.1";
pkg.devDependencies["prisma"] = "6.2.1";
pkg.scripts["build"] = "prisma generate && next build";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("✅ package.json atualizado!");

try {
    console.log("⏳ Gerando Prisma Client local...");
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log("✅ Cliente gerado!");
} catch (e) {
    console.log("⚠️ Aviso: Erro ao gerar localmente, mas a Vercel tentará novamente.");
}

console.log("\n🚀 PRONTO! Agora siga os comandos de envio.");