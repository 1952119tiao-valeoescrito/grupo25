const fs = require('fs');

// 1. Criar a pasta scripts se não existir
if (!fs.existsSync('scripts')) {
    fs.mkdirSync('scripts');
    console.log("✅ Pasta 'scripts' criada!");
}

// 2. Conteúdo do script de deploy para BASE MAINNET
const deployScript = `
const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando Deploy na BASE MAINNET...");

  // PARÂMETROS OFICIAIS CHAINLINK VRF NA BASE MAINNET
  // Você precisa substituir o subId pelo seu ID criado em vrf.chain.link
  const subId = "COLOQUE_AQUI_SEU_ID_DA_CHAINLINK"; 
  const vrfCoordinator = "0x5C210eF413483b74041f380f626d0484256859AA";
  const keyHash = "0x195709695d738981ef4fa9449f0525d8042456079949d2146903f0b240679da3";

  // Nome do contrato deve ser EXATAMENTE o que está no arquivo .sol
  const BetOficial = await hre.ethers.getContractFactory("BetGrupo25Oficial");
  
  console.log("Aguardando deploy...");
  const contract = await BetOficial.deploy(subId, vrfCoordinator, keyHash);

  await contract.waitForDeployment();

  console.log("--------------------------------------------------");
  console.log("✅ Contrato Bet-Grupo25 Deployado com Sucesso!");
  console.log("📍 Endereço:", await contract.getAddress());
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

fs.writeFileSync('scripts/deploy.js', deployScript.trim());
console.log("✅ Arquivo scripts/deploy.js criado com sucesso!");