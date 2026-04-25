import hre from "hardhat";

async function main() {
  console.log("🚀 Iniciando Deploy na BASE MAINNET...");

  // O segredo revelado: Transformamos a string em BigInt adicionando o 'n' no final e removendo as aspas
  const subId = 36138621669409696298732184724241418706400288212719944200636317415753324723360n; 
  
  const vrfCoordinator = "0x5c210ef413483b74041f380f626d0484256859aa";
  const keyHash = "0x195709695d738981ef4fa9449f0525d8042456079949d2146903f0b240679da3";

  // Pegamos a fábrica do contrato
  const BetOficial = await hre.ethers.getContractFactory("BetGrupo25Oficial");
  
  console.log("📡 Enviando transação para a rede Base...");

  // Disparamos o deploy com os argumentos corrigidos
  const contract = await BetOficial.deploy(subId, vrfCoordinator, keyHash);

  console.log("⏳ Aguardando confirmação do bloco...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("--------------------------------------------------");
  console.log("✅ CONTRATO PUBLICADO COM SUCESSO!");
  console.log("📍 ENDEREÇO:", address);
  console.log("--------------------------------------------------");
  console.log("👉 Copie este endereço e coloque no seu arquivo .env");
}

main().catch((error) => {
  console.error("❌ Erro no Deploy:", error);
  process.exitCode = 1;
});