import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function reset() {
  console.log("🛠️ Inicializando banco para o novo motor...");
  try {
    await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, arrecadacaoTotal: 0, concluida: false }
    });
    console.log("✅ Rodada #1 criada!");
  } catch (e) { console.error(e); }
}
reset();