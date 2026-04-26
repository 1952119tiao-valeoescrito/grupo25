const fs = require('fs');

const pageContent = `
import { Trophy, Scale, ShieldCheck, Wallet, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center py-12 px-4">
      {/* HEADER CENTRALIZADO */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-xl shadow-lg shadow-green-900/40">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Bet-Grupo25</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-xs font-bold border border-green-500/20">
          <ShieldCheck size={16} /> SORTEIO AUDITADO VIA VRF
        </div>
      </header>

      <main className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-start">
        {/* CARD DE APOSTA */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2">Monte sua Aposta</h2>
          <p className="text-slate-500 text-sm mb-8">Participe da rodada oficial com transparência total.</p>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Identificação</label>
              <input placeholder="Seu CPF" className="w-full p-4 rounded-2xl" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Recebimento de Prêmio</label>
              <input placeholder="Chave PIX (CPF, E-mail ou Telefone)" className="w-full p-4 rounded-2xl" />
            </div>
            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-black p-5 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-900/20">
              PAGAR R$ 10,00 VIA PIX <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* CARD DE TRANSPARÊNCIA */}
        <section className="bg-slate-900/30 p-8 md:p-10 rounded-[2.5rem] border border-slate-800/50">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Scale className="text-green-500" /> Transparência Legal
          </h2>
          
          <div className="space-y-5">
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4 text-sm">
                <span className="text-slate-400">Seguridade Social (17,32%)</span>
                <span className="font-mono font-bold text-green-400 italic">R$ 0,00</span>
             </div>
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4 text-sm">
                <span className="text-slate-400">Segurança Pública - FNSP (9,26%)</span>
                <span className="font-mono font-bold text-green-400 italic">R$ 0,00</span>
             </div>
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4 text-sm">
                <span className="text-slate-400">Educação - FNDE (9,26%)</span>
                <span className="font-mono font-bold text-green-400 italic">R$ 0,00</span>
             </div>
             <div className="pt-6">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[10px] text-slate-500 leading-relaxed italic">
                  Operação em conformidade com a Lei 13.756/2018. Os valores são destinados automaticamente após a confirmação do sorteio pela Blockchain Chainlink VRF.
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        www.bet-grupo25.com.br © 2024
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', pageContent.trim());
console.log("✨ Site refinado e centralizado!");