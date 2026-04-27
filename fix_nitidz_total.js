import fs from 'fs';

const path = 'src/app/dashboard/page.tsx';

if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Remove o efeito de embaçamento (blur) que causa a opacidade
    content = content.replace(/backdrop-filter blur-\[16px\]/g, '');
    content = content.replace(/backdrop-blur-xl/g, '');
    content = content.replace(/backdrop-blur-md/g, '');
    content = content.replace(/backdrop-filter/g, '');

    // 2. Garante que o fundo do card seja um azul bem escuro e nítido (95% opaco)
    content = content.replace(/bg-\[#0f172a\]\/85/g, 'bg-[#0f172a]/95');
    content = content.replace(/bg-slate-900\/80/g, 'bg-slate-950/95');

    fs.writeFileSync(path, content, { encoding: 'utf8' });
    console.log("✅ Efeito de opacidade removido! O Dashboard agora está cristalino.");
} else {
    console.log("❌ Arquivo do dashboard não encontrado.");
}