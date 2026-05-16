"use client"
import { Trophy, ShieldCheck, Zap, Target, Cpu, Globe, BarChart3, Lock, ArrowRight, CheckCircle2, Printer, Landmark } from 'lucide-react';

export default function PitchDeckG25() {
  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* CONTROLES DE VISUALIZAÇÃO - NO-PRINT */}
      <div className="fixed top-6 right-6 z-[100] no-print flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-2xl transition-all"
        >
          <Printer size={18} /> Exportar PDF Comercial
        </button>
      </div>

      <main className="max-w-5xl mx-auto py-10 print:py-0">
        
        {/* SLIDE 1: CAPA IMPACTANTE */}
        <section className="h-[90vh] flex flex-col justify-center items-center text-center border-2 border-cyan-500/20 rounded-[4rem] mb-20 relative overflow-hidden slide-page">
          <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12"><Cpu size={400}/></div>
          <Trophy size={80} className="text-yellow-500 mb-8 animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase font-elite leading-none">
            G25<span className="text-cyan-400 text-glow">TECH</span>
          </h1>
          <p className="text-yellow-500 text-xl md:text-2xl font-black uppercase tracking-[0.6em] mt-4 font-elite">Software House</p>
          <div className="w-32 h-1 bg-cyan-500 my-10" />
          <p className="max-w-xl text-slate-400 text-lg font-bold uppercase tracking-widest leading-relaxed">
            Infraestrutura Híbrida de Prognósticos com Auditoria Imutável via Blockchain.
          </p>
        </section>

        {/* SLIDE 2: O PROBLEMA VS A SOLUÇÃO */}
        <section className="min-h-[90vh] flex flex-col justify-center p-12 md:p-20 bg-slate-900/40 border border-white/10 rounded-[4rem] mb-20 slide-page">
          <h2 className="text-yellow-500 font-black text-3xl md:text-5xl uppercase font-elite mb-12 italic border-l-8 border-cyan-500 pl-6">O Paradigma do Mercado</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-red-500 font-black uppercase tracking-widest flex items-center gap-2"><ArrowRight className="rotate-180"/> O Problema Atual</h3>
              <p className="text-lg opacity-80 leading-relaxed">Loterias tradicionais sofrem com a <strong>baixa retenção</strong> e a <strong>desconfiança pública</strong> na extração dos resultados, gerando um alto índice de abandono (Churn).</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2"><Zap/> A Solução G25</h3>
              <p className="text-lg opacity-80 leading-relaxed">Nossa tecnologia utiliza o <strong>Oráculo Chainlink VRF</strong>. O resultado não é gerado pelo servidor, ele é extraído da Blockchain. Transparência 100% auditável.</p>
            </div>
          </div>
        </section>

        {/* SLIDE 3: O TRUNFO COMERCIAL (25 CHANCES) */}
        <section className="min-h-[90vh] flex flex-col justify-center p-12 md:p-20 bg-gradient-to-br from-[#0d1117] to-black border-2 border-cyan-500/30 rounded-[4rem] mb-20 relative overflow-hidden slide-page">
           <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
           <h2 className="text-white font-black text-4xl md:text-6xl uppercase font-elite mb-8 leading-none z-10">Alta Retenção: <br/><span className="text-cyan-400">O Poder do "25"</span></h2>
           <p className="text-xl md:text-2xl text-yellow-500 font-black uppercase tracking-widest mb-12 z-10 italic">25 Chances reais de vitória por bilhete.</p>
           
           <div className="grid md:grid-cols-2 gap-10 z-10">
              <div className="bg-black/60 p-8 rounded-3xl border border-white/10">
                 <h4 className="text-cyan-400 font-black mb-4 uppercase">Mecânica Horizontal</h4>
                 <p className="text-sm leading-relaxed font-medium">Diferente do sistema "Tudo ou Nada", o motor G25 premia acertadores com apenas 1 ponto. Com 25 prognósticos concorrendo em 5 linhas, a percepção de ganho do usuário é massiva.</p>
              </div>
              <div className="bg-black/60 p-8 rounded-3xl border border-white/10">
                 <h4 className="text-cyan-400 font-black mb-4 uppercase">Ciclo de Reaposta</h4>
                 <p className="text-sm leading-relaxed font-medium">A alta frequência de pequenos prêmios mantém o saldo do usuário ativo, estimulando o engajamento contínuo e aumentando o faturamento bruto da operadora.</p>
              </div>
           </div>
        </section>

        {/* SLIDE 4: COMPLIANCE E COTAS LEGAIS */}
        <section className="min-h-[90vh] flex flex-col justify-center p-12 md:p-20 bg-white text-black rounded-[4rem] mb-20 slide-page">
           <h2 className="text-black font-black text-4xl md:text-6xl uppercase font-elite mb-12 italic border-l-8 border-yellow-500 pl-6">Compliance Nativo</h2>
           <p className="text-xl font-bold mb-10">Arquitetura de distribuição financeira programada sob as diretrizes da <strong>Lei 13.756/2018</strong>.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {label: "Seguridade Social", val: "17.32%"},
                {label: "Segurança (FNSP)", val: "9.26%"},
                {label: "Educação (FNDE)", val: "9.26%"},
                {label: "Operador", val: "9.57%"}
              ].map((item, i) => (
                <div key={i} className="border-2 border-black p-6 rounded-3xl text-center">
                   <p className="text-[10px] font-black uppercase opacity-60 mb-2">{item.label}</p>
                   <b className="text-2xl font-elite">{item.val}</b>
                </div>
              ))}
           </div>
           <div className="mt-12 p-6 bg-slate-100 rounded-2xl border-l-8 border-emerald-500">
              <p className="text-sm font-bold uppercase italic">"Distribuição automatizada via Contrato Inteligente (Imutável)."</p>
           </div>
        </section>

        {/* SLIDE 5: MODELO DE LICENCIAMENTO */}
        <section className="min-h-[90vh] flex flex-col justify-center p-12 md:p-20 bg-slate-900/60 border border-white/10 rounded-[4rem] mb-20 slide-page">
           <h2 className="text-cyan-400 font-black text-3xl md:text-5xl uppercase font-elite mb-12 text-center">Modelo de Negócio</h2>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 text-center">
                 <Landmark className="mx-auto mb-6 text-yellow-500" size={40} />
                 <h4 className="font-black mb-4 uppercase text-sm">SETUP FEE</h4>
                 <p className="text-xs opacity-60">Implementação White Label e integração de banco de dados personalizado.</p>
              </div>
              <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 text-center">
                 <RefreshCw className="mx-auto mb-6 text-cyan-400 animate-spin-slow" size={40} />
                 <h4 className="font-black mb-4 uppercase text-sm">MAINTENANCE</h4>
                 <p className="text-xs opacity-60">Suporte técnico 24/7 e monitoramento ativo do robô auditor Render.</p>
              </div>
              <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 text-center">
                 <BarChart3 className="mx-auto mb-6 text-emerald-400" size={40} />
                 <h4 className="font-black mb-4 uppercase text-sm">REVENUE SHARE</h4>
                 <p className="text-xs opacity-60">Porcentagem sobre o volume de bilhetes gerados pelo motor G25.</p>
              </div>
           </div>
        </section>

        {/* SLIDE 6: CONTATO FINAL */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center p-12 slide-page">
           <ShieldCheck size={100} className="text-cyan-400 mb-8" />
           <h2 className="text-4xl md:text-7xl font-black uppercase font-elite mb-8 leading-tight italic">Sua Concessionária <br/> na Nova Era.</h2>
           <p className="text-slate-400 text-lg mb-12">Propriedade Intelectual Registrada INPI. <br/> Código Fonte Auditado.</p>
           
           <div className="p-[2px] bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full">
              <button className="bg-black text-white px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm hover:bg-transparent transition-all">
                 Solicitar Demo Técnica
              </button>
           </div>
        </section>

      </main>

      <footer className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em] font-elite print:hidden">
        © 2026 G25 TECH SOLUTIONS | BY SFCHAGASFILHO.
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        .text-glow { text-shadow: 0 0 30px rgba(34, 211, 238, 0.6); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          .slide-page { page-break-after: always; min-height: 100vh !important; border: 1px solid #eee !important; margin-bottom: 0 !important; border-radius: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

// Sub-componente para animação (opcional)
function RefreshCw({ className, size }: { className?: string, size?: number }) {
  return <div className={className}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg></div>;
}