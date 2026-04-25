import fs from 'fs';

console.log("🛠️ Ajustando arquivos para o padrão ESM (Moderno)...");

// 1. Corrigir o hardhat.config.js para o padrão ESM
const hardhatConfig = `
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    }
  }
};
`.trim();
fs.writeFileSync('hardhat.config.js', hardhatConfig);

// 2. Corrigir o iniciar_banco.js (Resolvendo o erro de undefined)
const iniciarBanco = `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Tentando inicializar a Rodada #1...");
  try {
    // Nota: O modelo no seu schema é 'Round' (com R maiúsculo)
    await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, arrecadacaoTotal: 0, concluida: false },
    });
    console.log("✅ Rodada #1 inicializada com sucesso!");
  } catch (e) {
    console.error("❌ Erro no Prisma:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
`.trim();
fs.writeFileSync('iniciar_banco.js', iniciarBanco);

// 3. Atualizar o script de deploy para ESM
const deployScript = `
import hre from "hardhat";

async function main() {
  console.log("🚀 Iniciando Deploy na BASE MAINNET...");

  const subId = "COLOQUE_AQUI_SEU_ID_DA_CHAINLINK"; 
  const vrfCoordinator = "0x5C210eF413483b74041f380f626d0484256859AA";
  const keyHash = "0x195709695d738981ef4fa9449f0525d8042456079949d2146903f0b240679da3";

  const BetOficial = await hre.ethers.getContractFactory("BetGrupo25Oficial");
  const contract = await BetOficial.deploy(subId, vrfCoordinator, keyHash);

  await contract.waitForDeployment();
  console.log("✅ Contrato Deployado em:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`.trim();
if (!fs.existsSync('scripts')) fs.mkdirSync('scripts');
fs.writeFileSync('scripts/deploy.js', deployScript);

console.log("🚀 Arquivos atualizados! Agora tudo deve funcionar.");