"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap, Target, Cpu, Globe, BarChart3, ArrowRight, Lock, Database, Terminal } from 'lucide-react';

export default function SoftwareHouseLanding() {
  const router = useRouter();
  const canvasRef = useRef(null);

  // MOTOR MATRIX DE FUNDO - IDENTIDADE TECNOLÓGICA
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

  // CANAL DE VENDAS DIRETO
  const handleWhatsappProposta = () => {
    const msg = encodeURIComponent("Olá! Estive analisando o portal G25TECH.COM.BR e gostaria de solicitar uma proposta comercial personalizada sobre o licenciamento do software.");
    window.open(`https://wa.me/5521993527957?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* HEADER CORPORATIVO ATUALIZADO */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase font-elite">
            G25<span className="text-cyan-400">TECH</span><span className="text-xs lowercase text-slate-500 ml-2 italic">.com.br</span>
          </h1>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <a href="#tecnologia" className="hover:text-cyan-400 transition-colors">Tecnologia</a>
             <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
             <button onClick={() => router.push('/login')} className="hover:text-cyan-400 transition-colors uppercase font-black">Acessar Demo</button>
          </div>
          <button onClick={() => router.push('/login')} className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px] hover:bg-cyan-400 transition-all shadow-lg">Área do Licenciado</button>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-20 px-6">
        
        {/* HERO SECTION - O PITCH */}
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

        {/* 3 PILARES DE VALOR */}
        <section id="tecnologia" className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-40">
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-cyan-500/50 transition-all">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Motor Híbrido</h3>
              <p className="text-white text-sm leading-relaxed font-bold opacity-80">Arquitetura matricial 25x25 (625 combinações) baseada na fórmula proprietária ((n-1)/4)+1.</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-yellow-500/50 transition-all">
              <div className="bg-yellow-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                <Globe className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 font-elite">Oráculo Blockchain</h3>