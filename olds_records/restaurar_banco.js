import fs from 'fs';

const schema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

model User {
  id             String   @id @default(cuid())
  nome           String
  email          String   @unique
  senha          String
  pixKey         String
  saldoAfiliado  Float    @default(0.0)
  indicadoPor    String?
  tickets        Ticket[]
  createdAt      DateTime @default(now())
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
  userId           String?
  user             User?    @relation(fields: [userId], references: [id])
  usuarioCpf       String
  usuarioEmail     String
  chavePixPremio   String
  prognosticos     String   
  pago             Boolean  @default(false)
  mpPaymentId      String?  @unique
  acertos          Int?     
  pagoAoGanhador   Boolean  @default(false)
}`;

// Escreve o arquivo forçando UTF-8 puro (sem BOM do Windows)
fs.writeFileSync('prisma/schema.prisma', schema, { encoding: 'utf8' });

console.log("✅ O arquivo prisma/schema.prisma foi restaurado em UTF-8 limpo!");