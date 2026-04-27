import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limparTudo() {
  console.log("🧹 Iniciando limpeza profunda no Banco Neon...");

  try {
    // 1. Apagar os bilhetes (Tickets) primeiro por causa das conexões
    const tickets = await prisma.ticket.deleteMany({});
    console.log(`🗑️ ${tickets.count} Bilhetes de teste removidos.`);

    // 2. Apagar os usuários (Users)
    const usuarios = await prisma.user.deleteMany({});
    console.log(`🗑️ ${usuarios.count} Usuários de teste removidos.`);

    // 3. Apagar as rodadas antigas
    await prisma.round.deleteMany({});
    console.log("🗑️ Rodadas antigas removidas.");

    // 4. RESETAR A IGNIÇÃO: Criar a Rodada #1 oficial
    await prisma.round.create({
      data: {
        id: 1,
        arrecadacaoTotal: 0,
        concluida: false
      }
    });
    console.log("✅ Rodada #1 recriada. O sistema está pronto para o lançamento oficial!");

  } catch (e) {
    console.error("❌ Erro durante a limpeza:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

limparTudo();