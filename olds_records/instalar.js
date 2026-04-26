```javascript
const fs = require('fs');
const path = require('path');

const folders = [
  'src/lib',
  'src/pages/api/pix',
  'src/pages/api/admin',
  'prisma',
  'contracts'
];

const files = {
  'prisma/schema.prisma': `
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
model Ticket {
  id               String   @id @default(cuid())
  rodadaId         Int
  usuarioCpf       String
  usuarioEmail     String
  chavePixPremio   String
  prognosticos     String   
  pago             Boolean  @default(false)
  mpPaymentId      String?  @unique
  acertos          Int?     
  pagoAoGanhador   Boolean  @default(false)
}`,
  'src/lib/prisma.ts': `
import { PrismaClient } from '@prisma/client';
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export { prisma as db };`,
  'src/pages/api/pix/create.ts': `
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "API de PIX Pronta" });
}`,
  '.env': `
MP_ACCESS_TOKEN="SEU_TOKEN_AQUI"
CONTRACT_ADDRESS="0x000"
PRIVATE_KEY="0x000"
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL="http://localhost:3000"`,
  'src/pages/index.tsx': `
import React from 'react';
export default function Home() {
  return <div style={{background: '#020617', color: 'white', minHeight: '100vh', padding: '50px'}}>
    <h1>Bet-Grupo25 Oficial</h1>
    <p>O motor híbrido está funcionando!</p>
  </div>
}`
};

// Criar pastas
folders.forEach(folder => {
  fs.mkdirSync(folder, { recursive: true });
  console.log('✅ Pasta criada:', folder);
});

// Criar arquivos
Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(name, content.trim());
  console.log('📄 Arquivo criado:', name);
});

console.log('\n🚀 TUDO PRONTO! Agora rode: npx prisma generate');
```