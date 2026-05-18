"use client"
import { ShieldCheck, FileText, PenTool, Printer, ChevronLeft, Landmark, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LOI_G25() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* TOOLBAR NO-PRINT */}
      <div className="max-w-4xl mx-auto flex justify-between mb-8 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
           <ChevronLeft size={18}/> Voltar
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <Printer size={18} /> Gerar PDF para Formalização
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/60 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl relative print:border-none print:shadow-none print:p-0">
        
        <header className="text-center mb-16 border-b border-white/5 pb-10 print:border-black">
          <Landmark size={60} className="text-emerald-400 mx-auto mb-6" />
          <h1 className="text-2xl md:text-4xl font-black uppercase font-elite tracking-tighter italic text-white print:text-black">
            CARTA DE INTENÇÃO (LOI)
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Protocolo de Intencionalidade de Licenciamento de Software</p>
        </header>

        <article className="space-y-8 text-sm md:text-base leading-relaxed text-slate-300 print:text-black text-justify font-medium">
          
          <div className="bg-black/30 p-6 rounded-2xl border border-white/5 print:border-black mb-10">
             <p className="text-white print:text-black font-bold">À G25 TECH SOLUTIONS / SFCHAGASFILHO</p>
             <p className="text-xs mt-2 italic">Ref: Implementação do Motor Matricial G25 Matrix Engine</p>
          </div>

          <p>
            Pela presente, a <strong className="text-white print:text-black">[NOME DA EMPRESA/CONCESSIONÁRIA RECEPTORA]</strong>, inscrita no CNPJ sob o nº [00.000.000/0000-00], declara formalmente seu interesse em iniciar o processo de análise e licenciamento da tecnologia <strong className="text-white print:text-black">Matrix Engine G25</strong>.
          </p>

          <section>
            <h3 className="text-emerald-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16}/> 1. ESCOPO DO INTERESSE
            </h3>
            <p>O interesse abrange o licenciamento do software em modelo White Label, incluindo o motor de processamento matricial 25x25, o protocolo de auditoria blockchain via Chainlink VRF e a interface de usuário personalizada para operações de prognósticos numéricos.</p>
          </section>

          <section>
            <h3 className="text-emerald-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16}/> 2. ETAPAS PREVISTAS
            </h3>
            <p>As partes concordam em seguir o seguinte cronograma preliminar:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Assinatura de Acordo de Confidencialidade (NDA);</li>
              <li>Apresentação de Demonstração Técnica (Showroom) e Auditoria de Código;</li>
              <li>Definição de cronograma para Setup Fee e Integração de APIs Financeiras;</li>
              <li>Celebração do Contrato de Licenciamento e Revenue Share.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-emerald-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16}/> 3. NATUREZA NÃO VINCULANTE
            </h3>
            <p>As partes reconhecem que este documento expressa uma intenção séria de negócio, mas não constitui uma obrigação final de contratação até que o Instrumento Particular de Licenciamento seja formalizado e assinado por ambas as partes.</p>
          </section>

          {/* ÁREA DE DATAS E ASSINATURAS */}
          <div className="pt-20 space-y-20">
             <p className="text-right">Local e Data: ______________________, _____ de __________ de 2026.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="text-center">
                   <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                   <p className="font-black uppercase text-[10px] text-white print:text-black">SEBASTIÃO FRANCISCO CHAGAS FILHO</p>
                   <p className="text-[8px] text-slate-500 uppercase font-bold">CEO G25 TECH SOLUTIONS | DIVULGADORA</p>
                </div>
                <div className="text-center">
                   <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                   <p className="font-black uppercase text-[10px] text-white print:text-black">ASSINATURA DO REPRESENTANTE LEGAL</p>
                   <p className="text-[8px] text-slate-500 uppercase font-bold">[NOME DA EMPRESA RECEPTORA]</p>
                </div>
             </div>
          </div>
        </article>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center opacity-30 print:hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.8em]">
            G25 TECH SOLUTIONS | WWW.G25TECH.COM.BR | BY SFCHAGASFILHO
          </p>
        </footer>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          h1, h2, h3, h4 { color: black !important; }
          p, li { color: black !important; font-weight: 500 !important; }
        }
      `}</style>
    </div>
  );
}