import fs from 'fs';

console.log("🏷️ Inserindo rótulos de prêmios (1º ao 5º) na Matrix...");

// 1. ATUALIZAR DASHBOARD (Onde o usuário gera a aposta)
const dashPath = 'src/app/dashboard/page.tsx';
if (fs.existsSync(dashPath)) {
    let content = fs.readFileSync(dashPath, 'utf8');
    
    // Ajuste no rótulo da malha para ser mais explícito
    content = content.replace(
        /\{i\+1\}º<\/span>/g, 
        '{i+1}º Prêmio:</span>'
    );
    
    // Ajuste de largura da coluna de labels para não amassar o texto
    content = content.replace(
        /grid-cols-6 gap-1.5/g, 
        'grid-cols-[80px_repeat(5,1fr)] gap-1.5'
    );

    fs.writeFileSync(dashPath, content);
    console.log("✅ Rótulos adicionados ao Dashboard.");
}

// 2. ATUALIZAR O BILHETE (O Certificado oficial de impressão)
const bilhetePath = 'src/app/bilhete/[id]/page.tsx';
if (fs.existsSync(bilhetePath)) {
    let bContent = fs.readFileSync(bilhetePath, 'utf8');

    // Substitui a grid de 5 colunas por uma de 6 (Label + 5 Slots)
    const newGrid = `
                <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 items-center">
                    {[0,1,2,3,4].map((row) => (
                      <div key={row} className="contents">
                        <span className="text-[9px] font-black text-slate-500 text-right pr-2">{row + 1}º Prêmio:</span>
                        {[0,1,2,3,4].map((col) => (
                          <div key={col} className="bg-slate-950 border border-cyan-500/20 py-3 rounded-xl flex items-center justify-center font-black text-cyan-400 text-xs print:border-black print:text-black shadow-inner">
                            {data.coords[row * 5 + col]}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
    `.trim();

    // Localiza a div da grid antiga e substitui
    const gridRegex = /<div className="grid grid-cols-5 gap-2">[\s\S]*?<\/div>/;
    bContent = bContent.replace(gridRegex, newGrid);

    fs.writeFileSync(bilhetePath, bContent);
    console.log("✅ Rótulos adicionados ao Bilhete de Impressão.");
}