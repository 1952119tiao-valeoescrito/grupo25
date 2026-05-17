"use client"
import { ShieldCheck, Lock, Printer, ChevronLeft, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NDA_G25() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      <div className="max-w-4xl mx-auto flex justify-between mb-8 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest">
           <ChevronLeft size={18}/> Voltar
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <Printer size={18} /> Exportar para Assinatura
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/60 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl relative print:border-none print:shadow-none print:p-0">
        
        <header className="text-center mb-16 border-b border-white/5 pb-10 print:border-black">
          <ShieldCheck size={60} className="text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl md:text-4xl font-black uppercase font-elite tracking-tighter italic text-white print:text-black">
            ACORDO DE CONFIDENCIALIDADE
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Non-Disclosure Agreement (NDA) - G25 Tech Solutions</p>
        </header>

        <article className="space-y-8 text-sm md:text-base leading-relaxed text-slate-300 print:text-black text-justify font-medium">
          
          <p>
            Pelo presente instrumento particular, de um lado, <strong className="text-white print:text-black">SEBASTIÃO FRANCISCO CHAGAS FILHO</strong>, doravante denominada "DIVULGADORA", e do outro lado, a PESSOA FÍSICA ou JURÍDICA interessada no licenciamento de tecnologia, doravante denominada "RECEPTORA", celebram este Acordo sob as seguintes cláusulas:
          </p>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Lock size={16}/> 1. OBJETO
            </h3>
            <p>O presente acordo visa proteger as informações confidenciais relativas à tecnologia <strong className="text-white print:text-black">Matrix Engine G25</strong>, incluindo sua arquitetura matricial 25x25, lógica de sincronia horizontal, algoritmos de auditoria blockchain e modelos de negócios híbridos.</p>
          </section>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2 text-white print:text-black">
              <Lock size={16}/> 2. DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL
            </h3>
            <p>Considera-se informação confidencial todo e qualquer dado técnico, financeiro, comercial, estratégico, segredos de negócio, fluxogramas, códigos-fonte e metodologias de processamento revelados pela DIVULGADORA.</p>
          </section>

          <section>
            <h3 className="text-cyan-400 font-black uppercase text-sm mb-4 flex items-center gap-2 text-white print:text-black">
              <Scale size={16}/> 3. OBRIGAÇÕES E PENALIDADES
            </h3>
            <p>Este compromisso de sigilo terá validade de 05 (cinco) anos. O descumprimento sujeitará a RECEPTORA às sanções civis e criminais cabíveis, além de indenização por quebra de propriedade intelectual registrada junto ao INPI.</p>
          </section>

          {/* ÁREA DE ASSINATURA ATUALIZADA */}
          <div className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-20">
             <div className="text-center">
                <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                <p className="font-black uppercase text-[10px] text-white print:text-black">SEBASTIÃO FRANCISCO CHAGAS FILHO</p>
                <p className="text-[8px] text-slate-500 uppercase">Divulgadora / Proprietária</p>
             </div>
             <div className="text-center">
                <div className="h-px bg-slate-500 w-full mb-4 print:bg-black" />
                <p className="font-black uppercase text-[10px] text-white print:text-black">ASSINATURA DA RECEPTORA</p>
                <p className="text-[8px] text-slate-500 uppercase">Licenciada Interessada</p>
             </div>
          </div>
        </article>

        // No rodapé do arquivo src/app/admin/nda/page.tsx
<footer className="mt-20 pt-10 border-t border-white/5 text-center opacity-30 print:hidden">
  <p className="text-[10px] font-black uppercase tracking-[0.6em]">
    Documento Gerado por G25 TECH SOLUTIONS | WWW.G25TECH.COM.BR | BY SFCHAGASFILHO
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