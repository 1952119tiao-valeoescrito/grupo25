"use client"
import { Trophy, ShieldCheck, Zap, Target, Wallet, BarChart3, ArrowRight, CheckCircle2, Printer, Users, Percent, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KitVendedor() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* TOOLBAR NO-PRINT */}
      <div className="max-w-5xl mx-auto flex justify-between p-6 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
           <ArrowRight className="rotate-180" size={18}/> Voltar
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-2xl transition-all"
        >
          <Printer size={18} /> Exportar Kit em PDF
        </button>
      </div>

      <main className="max-w-5xl mx-auto py-10 print:py-0">
        
        {/* CAPA DO KIT */}
        <section className="text-center mb-24 border-b border-white/5 pb-20 print:border-black">
          <div className="bg-cyan-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] print:bg-black">
             <Briefcase size={48} className="text-cyan-400 print:text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic font-elite tracking-tighter text-white print:text-black">
            KIT DE EXPANSÃO <br/><span className="text-cyan-400">COMERCIAL</span>
          </h1>
          <p className="text-yellow-500 text-sm md:text-lg font-black uppercase tracking-[0.5em] mt-4 font-elite">G25 Tech Solutions</p>
        </section>

        {/* O QUE VOCÊ VAI VENDER */}
        <section className="mb-20">
          <h2 className="text-yellow-500 font-black text-2xl uppercase font-elite mb-10 italic border-l-8 border-cyan-500 pl-6">O Produto: Matrix Engine G25</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <h3 className="text-cyan-400 font-black uppercase text-sm flex items-center gap-2"><ShieldCheck size={18}/> Transparência Web3</h3>
              <p className="text-sm leading-relaxed font-medium text-white opacity-90">Você vende a única tecnologia do Brasil com auditoria imutável via <strong>Chainlink VRF</strong>. O sorteio é criptográfico, eliminando o medo de fraudes das concessionárias.</p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <h3 className="text-cyan-400 font-black uppercase text-sm flex items-center gap-2"><Target size={18}/> Retenção Massiva</h3>
              <p className="text-sm leading-relaxed font-medium text-white opacity-90">O sistema oferece <strong>25 chances reais</strong> de marcar o primeiro ponto por bilhete. Ganhos frequentes mantêm o saldo do usuário ativo e aumentam o lucro do operador.</p>
            </div>
          </div>
        </section>

        {/* MODELO DE REMUNERAÇÃO (O QUE O VENDEDOR GANHA) */}
        <section className="bg-gradient-to-br from-slate-900 to-black border-2 border-yellow-500/20 rounded-[4rem] p-10 md:p-16 mb-20 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Percent size={200}/></div>
           <h2 className="text-white font-black text-3xl md:text-5xl uppercase font-elite mb-12 leading-tight">Sua Remuneração <br/><span className="text-yellow-500 text-glow">Híbrida de Elite</span></h2>
           
           <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="bg-black/60 p-8 rounded-3xl border-l-8 border-cyan-500 shadow-xl">
                 <h4 className="text-cyan-400 font-black mb-2 uppercase text-xs tracking-widest">COMISSÃO DE SETUP (IMEDIATA)</h4>
                 <p className="text-2xl font-black font-elite mb-4 text-white">20%</p>
                 <p className="text-xs leading-relaxed opacity-70">Receba uma fatia direta sobre o valor da taxa de instalação (Setup Fee) paga pelo licenciado. Dinheiro rápido no fechamento.</p>
              </div>
              <div className="bg-black/60 p-8 rounded-3xl border-l-8 border-emerald-500 shadow-xl">
                 <h4 className="text-emerald-400 font-black mb-2 uppercase text-xs tracking-widest">REVENUE SHARE (RECORRENTE)</h4>
                 <p className="text-2xl font-black font-elite mb-4 text-white">0.5% a 1.0%</p>
                 <p className="text-xs leading-relaxed opacity-70">Ganhe sobre cada bilhete gerado pelo motor G25 no cliente que você trouxe. Construa sua aposentadoria mensal.</p>
              </div>
           </div>
        </section>

        {/* SCRIPT DE ABORDAGEM */}
        <section className="mb-20">
          <h2 className="text-yellow-500 font-black text-2xl uppercase font-elite mb-10 italic border-l-8 border-cyan-500 pl-6">Manual de Abordagem</h2>
          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[3rem] space-y-8">
             <div className="space-y-3">
                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">O Gancho (Abertura)</p>
                <p className="text-sm italic border-l-2 border-white/20 pl-4 font-medium">"Sua plataforma atual sofre com Churn (saída de clientes) ou desconfiança nos sorteios? Eu tenho a tecnologia que resolve os dois de uma vez."</p>
             </div>
             <div className="space-y-3">
                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">O Xeque-Mate (Tecnologia)</p>
                <p className="text-sm italic border-l-2 border-white/20 pl-4 font-medium">"Nós licenciamos o Matrix Engine G25. Auditoria imutável via Blockchain e uma mecânica de 25 chances por bilhete que aumenta o faturamento em até 400%."</p>
             </div>
          </div>
        </section>

        {/* FOOTER DO KIT */}
        <footer className="text-center py-20 border-t border-white/5">
           <Trophy size={40} className="mx-auto mb-6 text-slate-700" />
           <h3 className="text-xl font-black uppercase font-elite text-white print:text-black">SEJA BEM-VINDO À MATRIX.</h3>
           <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.8em] mt-4">
             © 2026 G25 TECH SOLUTIONS | BY SFCHAGASFILHO
           </p>
        </footer>

      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        .text-glow { text-shadow: 0 0 20px rgba(234, 179, 8, 0.4); }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          section { page-break-inside: avoid; border: 1px solid #eee !important; margin-bottom: 20px !important; border-radius: 20px !important; }
        }
      `}</style>
    </div>
  );
}