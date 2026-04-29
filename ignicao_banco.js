import { PrismaClient } from '@prisma/client';

// Forçamos o Prisma a tentar a conexão várias vezes se a rede oscilar
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("📡 Conectando ao Neon Database...");
  
  try {
    // Teste de conexão simples
    await prisma.$connect();
    console.log("✅ Conexão estabelecida!");

    console.log("🛠️ Criando Rodada #1 oficial...");
    
    const round = await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        arrecadacaoTotal: 0,
        concluida: false
      },
    });

    console.log("==========================================");
    console.log("🚀 SUCESSO TOTAL!");
    console.log("📍 Rodada #1 está ativa no banco de dados.");
    console.log("📍 O Pix já pode ser gerado no site.");
    console.log("==========================================");

  } catch (e) {
    console.error("❌ FALHA NA CONEXÃO:");
    console.error(e.message);
    console.log("\n💡 DICA: Verifique se sua internet está estável e se o link no .env termina com ?sslmode=require");
  } finally {
    await prisma.$disconnect();
  }
}

main();