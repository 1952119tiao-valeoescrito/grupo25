"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, ShieldCheck, Zap, Globe, FileText, 
  ExternalLink, MousePointer2, Briefcase, Lock, 
  MessageSquare, ChevronRight, Share2 
} from 'lucide-react';

export default function LinkTreeG25() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const coords: string[] = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const grid: any[] = []; for (let i=0; i<50; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = '900 10px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
      requestAnimationFrame(draw);
    }; draw();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://www.bet-grupo25.com.br/links");
    alert("Link do Hub Copiado!");
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans flex flex-col items-center p-6 relative overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />

      {/* 🚀 FOTO MARRENTA CORRIGIDA AQUI */}
      <div className="relative z-10 flex flex-col items-center mt-10 mb-10">
        <div className="w-28 h-28 rounded-full border-4 border-cyan-500/50 p-1 mb-4 shadow-[0_0_30px_rgba(34,211,238,0.4)] overflow-hidden bg-slate-800">
           <img 
             src="/minha-foto-terno.png" 
             alt="SFCHAGASFILHO" 
             className="w-full h-full object-cover rounded-full" 
           />
        </div>
        <h1 className="text-2xl font-black uppercase font-elite tracking-tighter text-white">SFCHAGASFILHO</h1>
        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">CEO G25 Tech Solutions</p>
      </div>

      <main className="w-full max-w-md relative z-10 space-y-8">
        
        <section className="space-y-4">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Expansão e Negócios</p>
          <LinkButton 
            title="Apresentação Corporativa" 
            desc="Pitch Deck para Concessionárias"
            icon={<Briefcase size={20}/>}
            onClick={() => router.push('/admin/apresentacao')}
            color="border-cyan-500/30"
          />
          <LinkButton 
            title="Demonstração Técnica" 
            desc="Fale no WhatsApp Corporativo"
            icon={<MessageSquare size={20}/>}
            onClick={() => window.open('https://wa.me/5521993527957', '_blank')}
            color="border-emerald-500/30"
          />
        </section>

        <section className="space-y-4">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Showroom Tecnológico</p>
          <LinkButton 
            title="Portal G25 Matrix Engine" 
            desc="Acesse o MVP e veja o motor em ação"
            icon={<Globe size={20}/>}
            onClick={() => router.push('/')}
            color="border-yellow-500/30"
          />
        </section>

        <section className="space-y-4">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Legal & Compliance</p>
          <LinkButton 
            title="Acordo de Sigilo (NDA)" 
            desc="Protocolo para auditoria de código"
            icon={<Lock size={20}/>}
            onClick={() => router.push('/admin/nda')}
            color="border-white/10"
          />
          <LinkButton 
            title="Carta de Intenção (LOI)" 
            desc="Modelo de formalização de interesse"
            icon={<FileText size={20}/>}
            onClick={() => router.push('/admin/loi')}
            color="border-white/10"
          />
        </section>

        <button 
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
        >
          <Share2 size={14}/> Compartilhar Hub
        </button>

      </main>

      <footer className="mt-10 py-10 opacity-20 text-[8px] font-black uppercase tracking-[0.6em] text-center">
        © 2026 G25 TECH SOLUTIONS | BY SFCHAGASFILHO
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}

function LinkButton({ title, desc, icon, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full bg-[#0d1117] border ${color} p-5 rounded-3xl flex items-center gap-5 hover:scale-[1.03] active:scale-95 transition-all text-left shadow-2xl group`}
    >
      <div className="bg-black/50 p-3 rounded-2xl text-cyan-400 group-hover:text-white transition-colors border border-white/5">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-white text-xs font-black uppercase tracking-tight leading-none">{title}</h4>
        <p className="text-slate-500 text-[9px] font-bold mt-1.5">{desc}</p>
      </div>
      <ChevronRight size={18} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
    </button>
  );
}