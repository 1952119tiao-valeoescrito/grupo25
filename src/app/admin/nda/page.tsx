"use client"
import { ShieldCheck, FileText, Lock, Printer, ChevronLeft, Scale, PenTool, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NDA_G25() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* TOOLBAR NO-PRINT */}
      <div className="max-w-4xl mx-auto flex justify-between mb-8 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest">
           <ChevronLeft size={18}/> Voltar
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <Printer size={18} /> Exportar PDF para Assinatura
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/60 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl relative print:border-none print:shadow-none print:p-0">
        
        <header className="text-center mb-16 border-b border-white/5 pb-10 print:border-black">
          <ShieldCheck size={60} className="text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl md:text-4xl font-black uppercase font-elite tracking-tighter italic">
            ACORDO DE CONFIDENCIALIDADE
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Non-Disclosure Agreement (NDA) - G25 Tech</p>
        </header>

        <article className="space-y-8 text-sm md:text-base leading-relaxed text-slate-300 print:text-black text-justify font-medium">
          
          <p>
            Pelo presente instrumento particular, de um lado, <strong className="text-white print:text-black">SFCHAGASFILHO</strong>, doravante denominada "DIVULGADORA", e do outro lado, a PESSOA FÍSICA ou JURÍDICA interessada no licenciamento de tecnologia, doravante denominada "RECEPTORA", celebram este Acordo sob as seguintes cláusulas:
          </p>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Lock size={16}/> 1. OBJETO
            </h3>
            <p>O presente acordo visa proteger as informações confidenciais relativas à tecnologia <strong className="text-white print:text-black">Matrix Engine G25</strong>, incluindo sua arquitetura matricial 25x25, lógica de sincronia horizontal, algoritmos de auditoria blockchain e modelos de negócios híbridos.</p>
          </section>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Lock size={16}/> 2. DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL
            </h3>
            <p>Considera-se informação confidencial todo e qualquer dado técnico, financeiro, comercial, estratégico, segredos de negócio, fluxogramas, códigos-fonte e metodologias de processamento revelados pela DIVULGADORA.</p>
          </section>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Lock size={16}/> 3. OBRIGAÇÕES DA RECEPTORA
            </h3>
            <p>A RECEPTORA compromete-se a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Manter sigilo absoluto sobre os dados apresentados;</li>
              <li>Não utilizar as informações para fins diversos da análise de licenciamento;</li>
              <li>Não reproduzir, copiar ou realizar engenharia reversa nos algoritmos matriciais da DIVULGADORA.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Scale size={16}/> 4. PRAZO E PENALIDADES
            </h3>
            <p>Este compromisso de sigilo terá validade de 05 (cinco) anos a partir da data de assinatura. O descumprimento sujeitará a RECEPTORA às sanções civis e criminais cabíveis, além de indenização por perdas e danos e quebra de propriedade intelectual (INPI).</p>
          </section>

          {/* ESPAÇO PARA ASSINATURA NO PDF */}
          <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-20">
             <div className="text-center">
                <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                <p className="font-black uppercase text-[10px]">SFCHAGASFILHO</p>
                <p className="text-[8px] text-slate-500 uppercase">Divulgadora / Proprietária</p>
             </div>
             <div className="text-center">
                <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                <p className="font-black uppercase text-[10px]">ASSINATURA DA RECEPTORA</p>
                <p className="text-[8px] text-slate-500 uppercase">Licenciada Interessada</p>
             </div>
          </div>
        </article>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center opacity-30 print:hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.6em]">
            Documento Gerado por G25 TECH SOLUTIONS | BY SFCHAGASFILHO
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