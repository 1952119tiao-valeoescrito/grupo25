"use client"
import { ShieldCheck, Zap, Wallet, Cpu, Database, Award, Info, FileText, Printer, ChevronRight } from 'lucide-react';

export default function ManualAdmin() {
  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* BOTÃO DE IMPRESSÃO (Fica invisível no PDF) */}
      <div className="max-w-5xl mx-auto flex justify-end mb-6 no-print">
        <button 
          onClick={() => window.print()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <Printer size={18} /> Gerar PDF / Imprimir
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/50 border-2 border-cyan-500/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* MARCA D'ÁGUA DE FUNDO */}
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Cpu size={400} />
        </div>

        <header className="border-b border-cyan-500/30 pb-10 mb-12 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg print:bg-black">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black" style={{fontFamily: 'Orbitron'}}>
              MANUAL DO COMANDANTE <span className="text-white text-sm not-italic ml-2">V3.5</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em]">Protocolos de Gestão Bet-Grupo25 Oficial</p>
        </header>

        <main className="space-y-16 relative z-10">

          {/* SEÇÃO 1: ACESSO ADMIN */}
          <section>
            <h2 className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-lg mb-6 italic">
              <Zap size={20} /> 01. Acesso e Chaves Mestras
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <h4 className="text-cyan-400 font-black text-xs uppercase mb-3">Variável Admin</h4>
                <p className="text-sm leading-relaxed mb-4">A senha do painel é definida na Vercel pela chave <strong>ADMIN_SECRET</strong>. Ela protege o disparo do sorteio.</p>
                <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/20 font-mono text-[10px] text-cyan-500">
                  URL: /admin/central
                </div>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <h4 className="text-cyan-400 font-black text-xs uppercase mb-3">Normalização de Dados</h4>
                <p className="text-sm leading-relaxed italic opacity-80 text-white">O sistema limpa automaticamente e-mails (minúsculo) e CPFs (apenas números) para evitar falhas de login e de Pix.</p>
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: ABASTECIMENTO BLOCKCHAIN */}
          <section>
            <h2 className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-lg mb-6 italic">
              <Cpu size={20} /> 02. Abastecimento Chainlink VRF
            </h2>
            <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border-l-8 border-cyan-500">
              <p className="text-sm mb-6 leading-relaxed">
                O sorteio depende de <strong>Tokens LINK</strong> na rede Base Mainnet. Sem saldo, o oráculo não responde e o sorteio manual deve ser acionado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Onde Abastecer</p>
                  <p className="text-[9px] font-bold">subscription.chain.link</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Saldo Mínimo</p>
                  <p className="text-[9px] font-bold text-emerald-400">2.0 LINK</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Rede Oficial</p>
                  <p className="text-[9px] font-bold text-cyan-400">BASE MAINNET</p>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: LÓGICA DO SORTEIO */}
          <section>
            <h2 className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-lg mb-6 italic">
              <Award size={20} /> 03. O Ritual da Horizontalidade
            </h2>
            <div className="space-y-6">
              <p className="text-sm leading-relaxed bg-cyan-900/20 p-6 rounded-2xl border border-cyan-500/20">
                Ao disparar o sorteio, o sistema gera 5 resultados e faz o <strong>Espelhamento Horizontal</strong> instantâneo contra o banco de dados Neon.
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <table className="w-full text-[10px] md:text-xs text-left uppercase font-bold">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="p-4">Evento Sorteado</th>
                      <th className="p-4">Linha de Auditoria</th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/20 divide-y divide-white/5">
                    <tr><td className="p-4 text-cyan-400">1º PRÊMIO</td><td className="p-4">LINHA 01 DO BILHETE 5x5</td></tr>
                    <tr><td className="p-4 text-cyan-400">2º PRÊMIO</td><td className="p-4">LINHA 02 DO BILHETE 5x5</td></tr>
                    <tr><td className="p-4 text-cyan-400">3º PRÊMIO</td><td className="p-4">LINHA 03 DO BILHETE 5x5</td></tr>
                    <tr><td className="p-4 text-cyan-400">4º PRÊMIO</td><td className="p-4">LINHA 04 DO BILHETE 5x5</td></tr>
                    <tr><td className="p-4 text-cyan-400">5º PRÊMIO</td><td className="p-4">LINHA 05 DO BILHETE 5x5</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SEÇÃO 4: FINANCEIRO E CASCATA */}
          <section>
            <h2 className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-lg mb-6 italic">
              <Wallet size={20} /> 04. Divisão Legal e Cascata
            </h2>
            <div className="bg-black/60 p-8 rounded-[3rem] border border-white/10">
              <h4 className="text-cyan-400 font-black text-xs uppercase mb-6 text-center">Pool de Premiação: 43,35%</h4>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3 text-[11px] font-bold uppercase">
                  <p className="flex justify-between border-b border-white/5 pb-2"><span>5 PONTOS:</span> <span className="text-yellow-500">50% DO POOL</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span>4 PONTOS:</span> <span className="text-white">20% DO POOL</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span>3 PONTOS:</span> <span className="text-white">15% DO POOL</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span>2 PONTOS:</span> <span className="text-white">10% DO POOL</span></p>
                  <p className="flex justify-between"><span>1 PONTO:</span> <span className="text-white">05% DO POOL</span></p>
                </div>
                <div className="bg-slate-900/80 p-6 rounded-2xl border-l-4 border-yellow-500">
                  <h5 className="text-[10px] font-black text-yellow-500 mb-2 uppercase">Regra de Cascata</h5>
                  <p className="text-[10px] leading-relaxed text-white">Se não houver ganhador com 5 pontos, o valor é rateado entre as faixas 4, 3, 2 e 1 ponto sucessivamente até a base.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 5: COMANDOS SQL NEON */}
          <section className="print:hidden">
            <h2 className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-lg mb-6 italic">
              <Database size={20} /> 05. Comandos de Emergência (Neon)
            </h2>
            <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 font-mono text-cyan-500 text-[10px] space-y-4">
              <div>
                <p className="text-slate-500 mb-1">// Ver ganhadores da rodada</p>
                <p>SELECT * FROM "Ticket" WHERE "pontos" {'>'} 0 AND "rodadaId" = 1;</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">// Ver arrecadação total por Pix</p>
                <p>SELECT SUM(10) FROM "Ticket" WHERE "pago" = true;</p>
              </div>
            </div>
          </section>

        </main>

        <footer className="mt-20 pt-10 border-t border-white/10 text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">
            © 2026 BET-GRUPO25 | SISTEMA HÍBRIDO WEB2/WEB3
          </p>
        </footer>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
