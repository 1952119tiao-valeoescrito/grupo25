"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, Zap, Target, Cpu, Globe, BarChart3, 
  ArrowRight, Lock, Database, Terminal, Plus, Minus, 
  Trophy, MousePointer2, Wallet 
} from 'lucide-react';

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; 
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    const coords: string[] = []; 
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const grid: any[] = []; 
    for (let i=0; i<80; i++) {
      grid.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        text: coords[Math.floor(Math.random() * 625)],
      });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.25)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron'; 
      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      grid.forEach(s => { 
        ctx.fillText(s.text, s.x, s.y); 
        if(Math.random() > 0.985) s.text = coords[Math.floor(Math.random() * 625)]; 
      });
      requestAnimationFrame(draw);
    }; 
    draw();
  }, []);

  const handleWhatsappProposta = () => {
    const msg = encodeURIComponent("Olá! Estive analisando o portal G25TECH.COM.BR e gostaria de solicitar uma proposta comercial personalizada.");
    window.open(`https://wa.me/5521993527957?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
  <img 
    src="/logo-g25-tech-v3.png" 
    alt="G25 Tech Solutions" 
    className="h-28 md:h-48 w-auto brightness-125 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" 
  />
</div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400 font-elite">
             <a href="#tecnologia" className="hover:text-cyan-400 transition-colors">Tecnologia</a>
             <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
             <button onClick={() => router.push('/login')} className="hover:text-cyan-400 transition-colors uppercase">Acessar Demo</button>
          </div>
          <button onClick={() => router.push('/login')} className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px] hover:bg-cyan-400 transition-all">Área do Licenciado</button>
        </div>
      </nav>

      <main className="relative z-10 pt-48 pb-20 px-6">
        <section className="max-w-5xl mx-auto text-center mb-32">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-8">
             <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em]">Propriedade Intelectual Registrada INPI</p>
          </div>
          <h2 className="text-5xl md:text-8xl font-black uppercase italic leading-none tracking-tighter mb-8 font-elite">
            O FUTURO DAS <br/> <span className="text-cyan-400 text-glow">LOTERIAS</span> É G25.
          </h2>
          <p className="max-w-2xl mx-auto text-white text-lg md:text-xl font-bold leading-relaxed mb-12 opacity-90">
            Licencie o motor de prognósticos mais disruptivo do mercado brasileiro. 
            Sincronia Matrix 25x25 com auditoria imutável via Oráculo Blockchain.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
             <button onClick={handleWhatsappProposta} className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 mx-auto md:mx-0 transition-all hover:scale-105">
               Solicitar Proposta Comercial <ArrowRight size={18}/>
             </button>
             <button onClick={() => router.push('/login')} className="border border-white/20 bg-black/40 hover:bg-white/5 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
               Ver Demonstração do MVP
             </button>
          </div>
        </section>

        <section id="tecnologia" className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-40">
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group">
              <Cpu className="text-cyan-400 mb-8" size={32} />
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Motor Híbrido</h3>
              <p className="text-white text-sm font-bold opacity-80 leading-relaxed">Arquitetura matricial 25x25 baseada na fórmula proprietária ((n-1)/4)+1.</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group">
              <Globe className="text-yellow-500 mb-8" size={32} />
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Oráculo Blockchain</h3>
              <p className="text-white text-sm font-bold opacity-80 leading-relaxed">Extração auditada via Chainlink VRF na rede Base Mainnet. Imutabilidade absoluta.</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group">
              <BarChart3 className="text-emerald-400 mb-8" size={32} />
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Alta Retenção</h3>
              <p className="text-white text-sm font-bold opacity-80 leading-relaxed">O bilhete oferece 25 chances de vitória com 1 ponto. Máximo engajamento.</p>
           </div>
        </section>

        <section id="compliance" className="max-w-4xl w-full mx-auto mb-40 bg-[#0d1117]/95 rounded-[3rem] border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
             <div className="p-10 text-center border-b border-slate-800 bg-slate-800/20 font-elite">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-yellow-500 italic">Regulamento Oficial</h2>
                <p className="text-cyan-400 text-[10px] font-black uppercase mt-2">Protocolos de Auditoria e Premiação</p>
             </div>
             <div className="divide-y divide-slate-800">
                <FaqItem title="ESCLARECIMENTO TÉCNICO" text="A G25TECH é fundamentada em matriz tecnológica 25x25, gerando 625 prognósticos exclusivos (x/y). Cada um corresponde a 16 milhares distintos, cobrindo 10.000 milhares (0000-9999)." />
                <FaqItem title="PONTUAÇÃO HORIZONTAL" text="A vitória é determinada pela Horizontalidade: o 1º prêmio sorteado pontua exclusivamente a 1ª linha da sua matriz 5x5. Você tem 25 oportunidades de vitória por bilhete." />
                <FaqItem title="COMPLIANCE (LEI 13.756/2018)" text="Divisão: Pool de Premiação (43,35%), Seguridade Social (17,32%), Segurança FNSP (9,26%), Educação FNDE (9,26%), Operação (9,57%) e Manutenção (11,24%)." />
             </div>
        </section>

        <section className="text-center max-w-4xl mx-auto">
           <h3 className="text-3xl md:text-5xl font-black uppercase italic mb-8 font-elite leading-tight">Pronto para liderar <br/> o mercado?</h3>
           <button onClick={handleWhatsappProposta} className="bg-white text-black px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-cyan-500 transition-all flex items-center gap-4 mx-auto shadow-2xl">
              Solicitar Demonstração Técnica <ArrowRight size={20} />
           </button>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center font-elite">
         <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.8em]">
            © 2026 G25 TECH SOLUTIONS | WWW.G25TECH.COM.BR | BY SFCHAGASFILHO
         </p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        .text-glow { text-shadow: 0 0 30px rgba(34, 211, 238, 0.6); }
      `}</style>
    </div>
  );
}

function FaqItem({ title, text }: { title: string, text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-8 flex justify-between items-center text-left text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white/5 text-white">
        <span>{title}</span> <span className="text-yellow-500 text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="px-10 py-6 text-white text-xs md:text-sm leading-relaxed font-bold border-t border-white/5 bg-black/40 mx-6 rounded-[2rem] text-justify mb-4">{text}</div>}
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }