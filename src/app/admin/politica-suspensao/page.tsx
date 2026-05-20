"use client"
import { AlertTriangle, ShieldAlert, Clock, FileText, CheckCircle2, Printer, ChevronLeft, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PoliticaSuspensao() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-red-500/30 print:bg-white print:text-black">
      
      {/* TOOLBAR */}
      <div className="max-w-4xl mx-auto flex justify-between mb-8 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
           <ChevronLeft size={18}/> Voltar
        </button>
        <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-lg transition-all">
          <Printer size={18} /> Gerar PDF de Notificação
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/60 border-2 border-red-500/30 rounded-[3rem] p-10 md:p-20 shadow-2xl relative print:border-none print:shadow-none print:p-0">
        
        <header className="text-center mb-16 border-b border-white/5 pb-10 print:border-black">
          <ShieldAlert size={60} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-4xl font-black uppercase font-elite tracking-tighter italic text-white print:text-black">
            POLÍTICA DE SUSPENSÃO
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Protocolo de Manutenção e Continuidade G25 Tech</p>
        </header>

        <article className="space-y-8 text-sm md:text-base leading-relaxed text-slate-300 print:text-black text-justify font-medium">
          
          <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 mb-10">
             <p className="text-red-500 font-black uppercase text-xs flex items-center gap-2">
                <AlertTriangle size={16}/> Aviso de Conformidade Técnica
             </p>
             <p className="text-white text-xs mt-2 italic opacity-80">Este documento rege a disponibilidade do motor Matrix Engine G25 e seus serviços de auditoria blockchain.</p>
          </div>

          <section>
             <h3 className="text-white font-black uppercase text-sm mb-4 border-l-4 border-red-500 pl-4">1. CICLO DE LICENCIAMENTO</h3>
             <p>O licenciamento da tecnologia <strong className="text-white print:text-black">G25 Matrix Engine</strong> é concedido em regime de locação mensal (SaaS). A continuidade do serviço está vinculada à liquidação das faturas de manutenção e taxas de processamento (Revenue Share) acordadas em contrato.</p>
          </section>

          <section>
             <h3 className="text-white font-black uppercase text-sm mb-4 border-l-4 border-red-500 pl-4">2. PROTOCOLO DE INADIMPLÊNCIA</h3>
             <p>Em caso de ausência de pagamento na data de vencimento, o sistema executará os seguintes procedimentos automáticos:</p>
             <ul className="list-disc pl-6 space-y-3 mt-4 text-xs md:text-sm">
                <li><strong>D+1 ao D+5 (Tolerância):</strong> O acesso administrativo exibirá um banner de alerta de pendência. O site continuará operando normalmente para o público final.</li>
                <li><strong>D+6 (Bloqueio Total):</strong> O sistema ativará o <span className="text-red-500 font-black italic">Kill Switch</span>. A interface pública será substituída por uma tela de "Manutenção Administrativa", bloqueando novas apostas e acessos.</li>
                <li><strong>Suspensão do Oráculo:</strong> O robô de auditoria (Render) deixará de monitorar a blockchain, cessando a validação automática de resultados.</li>
             </ul>
          </section>

          <section>
             <h3 className="text-white font-black uppercase text-sm mb-4 border-l-4 border-red-500 pl-4">3. ISENÇÃO DE RESPONSABILIDADE</h3>
             <p>A G25 TECH SOLUTIONS e seu titular, <strong className="text-white print:text-black">SEBASTIÃO FRANCISCO CHAGAS FILHO</strong>, ficam isentos de qualquer responsabilidade por perdas, danos ou lucros cessantes decorrentes da interrupção do serviço motivada pela falta de pagamento das obrigações contratuais por parte da RECEPTORA.</p>
          </section>

          <section>
             <h3 className="text-white font-black uppercase text-sm mb-4 border-l-4 border-red-500 pl-4">4. REATIVAÇÃO</h3>
             <p>A reativação do sistema ocorrerá em até 24h úteis após a confirmação do pagamento integral dos débitos e multas de atraso, mediante reinicialização remota do servidor central.</p>
          </section>

          {/* RODAPÉ E ASSINATURA */}
          <div className="pt-12 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-40">
                G25 TECH SOLUTIONS | BY SFCHAGASFILHO
             </p>
          </div>
        </article>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          h1, h2, h3 { color: black !important; }
          p, li { color: black !important; font-weight: 500 !important; }
        }
      `}</style>
    </div>
  );
}