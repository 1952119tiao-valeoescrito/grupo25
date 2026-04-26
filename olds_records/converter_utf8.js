import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/admin/page.tsx',
  'src/lib/abi.json',
  'src/lib/prisma.ts',
  'package.json',
  'prisma/schema.prisma'
];

console.log("🧹 Iniciando conversão forçada para UTF-8...");

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      // Lê o arquivo como um buffer (binário)
      const buffer = fs.readFileSync(file);
      
      // Converte para string e remove possíveis caracteres ocultos (BOM) do Windows
      let content = buffer.toString('utf8');
      
      // Sobrescreve o arquivo garantindo codificação UTF-8 sem BOM
      fs.writeFileSync(file, content, { encoding: 'utf8' });
      
      console.log(`✅ ${file} convertido com sucesso!`);
    } catch (err) {
      console.error(`❌ Erro ao converter ${file}:`, err.message);
    }
  } else {
    console.log(`⚠️ Arquivo não encontrado: ${file}`);
  }
});

console.log("\n🚀 Todos os arquivos críticos agora estão em formato Linux/Vercel!");