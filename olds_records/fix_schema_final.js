import fs from 'fs';

const schema = `
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
  round           Round    @relation(fields: [rodadaId], references: [id])
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
console.log("✅ Schema atualizado com a tabela Round!");
```

Rode no terminal:
```cmd
node fix_schema_final.js