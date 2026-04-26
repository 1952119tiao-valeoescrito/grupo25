import { PrismaClient } from '@prisma/client';

// Forçamos a criação do cliente
const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Verificando modelos disponíveis no Prisma...");
  
  // Lista todas as tabelas que o Prisma reconheceu
  const tabelas = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));
  console.log("📊 Tabelas encontradas:", tabelas);

  try {
    console.log("⏳ Tentando inicializar a Rodada #1...");
    
    // Tentamos acessar 'round' ou 'Round'
    const model = prisma.round || prisma.Round;

    if (!model) {
      throw new Error("A tabela 'Round' não foi encontrada no Prisma Client. Rode 'npx prisma generate' novamente.");
    }

    await model.upsert({
      where: { id: 1 },
      update: {},
      create: { 
        id: 1, 
        arrecadacaoTotal: 0, 
        concluida: false 
      },
    });

    console.log("✅ SUCESSO: Rodada #1 inicializada e pronta para apostas!");
  } catch (e) {
    console.error("❌ ERRO NO PROCESSO:");
    console.error(e.message);
    console.log("\n💡 DICA: Se a lista de tabelas acima estiver vazia, rode: npx prisma generate");
  } finally {
    await prisma.$disconnect();
  }
}

main();