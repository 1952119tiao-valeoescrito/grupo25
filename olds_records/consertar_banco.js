const fs = require('fs');

const schemaOficial = `
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
}
`;

if (!fs.existsSync('prisma')) fs.mkdirSync('prisma');
fs.writeFileSync('prisma/schema.prisma', schemaOficial.trim());

console.log("✅ Arquivo prisma/schema.prisma corrigido com as quebras de linha!");