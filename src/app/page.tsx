"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap, Target, Cpu, Globe, BarChart3, ArrowRight, Lock, Database, Terminal } from 'lucide-react';

export default function SoftwareHouseLanding() {
  const router = useRouter();
  const canvasRef = useRef(null);

  // MOTOR MATRIX DE FUNDO
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = (canvas as any).getContext('2d');
    (canvas as any).width = window.innerWidth; (canvas as any).height = window.innerHeight;
    const coords: string[] = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const grid: any[] = []; for (let i=0; i<80; i++) grid.push({ x: Math.random()*(canvas as any).width, y: Math.random()*(canvas as any).height, text: coords[Math.floor(Math.random()*625)] });
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.25)'; ctx.fillRect(0,0,(canvas as any).width,(canvas as any).height);
      ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
      requestAnimationFrame(draw);
    }; draw();
  }, []);

  // FUNÇÃO PARA WHATSAPP
  const handleWhatsappProposta = () => {
    const msg = encodeURIComponent("Olá! Estive analisando o portal da G25 TECH e gostaria de solicitar uma proposta comercial personalizada sobre o licenciamento do software.");
    window.open(`https://wa.me/5521993527957?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* HEADER CORPORATIVO */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase font-elite">
            G25<span className="text-cyan-400">TECH</span><span className="text-xs lowercase text-slate-500 ml-2 italic">solutions</span>
          </h1>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <a href="#tecnologia" className="hover:text-cyan-400 transition-colors">Tecnologia</a>
             <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
             {/* 🚀 BOTÃO MENU HABILITADO */}
             <button onClick={() => router.push('/login')} className="hover:text-cyan-400 transition-colors uppercase">Acessar Demo</button>
          </div>
          <button onClick={() => router.push('/login')} className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px] hover:bg-cyan-400 transition-all">Área do Licenciado</button>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-20 px-6">
        
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto text-center mb-32">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-8">
             <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em]">Propriedade Intelectual Registrada INPI</p>
          </div>
          <h2 className="text-5xl md:text-8xl font-black uppercase italic leading-none tracking-tighter mb-8 font-elite">
            O FUTURO DAS <br/> <span className="text-cyan-400">LOTERIAS</span> É G25.
          </h2>
          <p className="max-w-2xl mx-auto text-white text-lg md:text-xl font-bold leading-relaxed mb-12 opacity-80">
            Licencie o motor de prognósticos mais disruptivo do mercado brasileiro. 
            Sincronia Matrix 25x25 com auditoria imutável via Oráculo Blockchain.
          </p>
          
          {/* 🚀 BOTÕES HERO HABILITADOS */}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
             <button 
               onClick={handleWhatsappProposta}
               className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center gap-3 mx-auto md:mx-0 transition-all hover:scale-105"
             >
               Solicitar Proposta Comercial <ArrowRight size={18}/>
             </button>
             <button 
               onClick={() => router.push('/login')}
               className="border border-white/20 bg-black/40 hover:bg-white/5 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
             >
               Ver Demonstração do MVP
             </button>
          </div>
        </section>

        {/* 3 PILARES (CONTEÚDO MANTIDO) */}
        <section id="tecnologia" className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-40">
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-cyan-500/50 transition-all">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20">
                <Cpu className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Motor Híbrido</h3>
              <p className="text-white text-sm leading-relaxed font-bold">Arquitetura matricial 25x25 (625 combinações) baseada na fórmula proprietária ((n-1)/4)+1.</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-yellow-500/50 transition-all">
              <div className="bg-yellow-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-yellow-500/20">
                <Globe className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Oráculo Blockchain</h3>
              <p className="text-white text-sm leading-relaxed font-bold">Extração auditada via Chainlink VRF na rede Base Mainnet. Aleatoriedade imutável.</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-emerald-500/50 transition-all">
              <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
                <BarChart3 className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Alta Retenção</h3>
              <p className="text-white text-sm leading-relaxed font-bold">O bilhete oferece 25 chances de vitória com 1 ponto. Máximo engajamento e LTV.</p>
           </div>
        </section>

        {/* COMPLIANCE SECTION (CONTEÚDO MANTIDO) */}
        <section id="compliance" className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1117] to-black border-2 border-white/10 rounded-[4rem] p-10 md:p-20 mb-40 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5"><ShieldCheck size={300} /></div>
           <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                 <h3 className="text-yellow-500 font-black text-2xl md:text-4xl uppercase italic font-elite mb-6 leading-tight">Engenharia de <br/> Compliance Nativa</h3>
                 <p className="text-white text-lg font-bold leading-relaxed mb-10">
                    O nosso software foi construído sob as diretrizes da Lei 13.756/2018. O contrato inteligente automatiza a distribuição legal.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10"><p className="text-[10px] font-black uppercase text-cyan-400">Seguridade Social</p><b className="text-xl">17.32%</b></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10"><p className="text-[10px] font-black uppercase text-cyan-400">Segurança Pública</p><b className="text-xl">9.26%</b></div>
                 </div>
              </div>
              <div className="bg-slate-950 p-8 rounded-[3rem] border border-cyan-500/20 shadow-inner">
                 <h4 className="text-cyan-400 font-black uppercase text-[10px] mb-8 tracking-[0.3em] text-center italic">Monitor de Auditoria Automática</h4>
                 <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                       <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-500">{i}º PRÊMIO</span>
                          <div className="flex gap-2">
                             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-500/30">OK</div>
                             <div className="w-10 h-8 bg-black rounded-lg flex items-center justify-center text-[10px] font-black text-cyan-400 border border-cyan-500/30 italic">10/22</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* CTA FINAL HABILITADO */}
        <section className="text-center max-w-4xl mx-auto">
           <h3 className="text-3xl md:text-5xl font-black uppercase italic mb-8 font-elite">Pronto para liderar o mercado?</h3>
           <button 
             onClick={handleWhatsappProposta}
             className="bg-white text-black px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-cyan-500 transition-all flex items-center gap-4 mx-auto shadow-2xl"
           >
              Solicitar Demonstração Técnica <ArrowRight size={20} />
           </button>
        </section>

      </main>

      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.8em] font-elite">
            © 2026 G25 TECH SOLUTIONS | iGAMING SOFTWARE HOUSE | BY SFCHAGASFILHO
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