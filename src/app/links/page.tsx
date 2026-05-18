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

  // MOTOR MATRIX DE FUNDO - IDENTIDADE DA MARCA
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

      {/* PERFIL CEO */}
      <div className="relative z-10 flex flex-col items-center mt-10 mb-10">
        <div className="w-24 h-24 rounded-full border-4 border-cyan-500/50 p-1 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] overflow-hidden">
           {/* Substitua pela sua foto de terno que vimos antes */}
           <img src="/minha-foto-terno.jpg" alt="SFCHAGASFILHO" className="w-full h-full object-cover rounded-full" />
        </div>
        <h1 className="text-xl font-black uppercase font-elite tracking-tighter">SFCHAGASFILHO</h1>
        <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic">CEO G25 Tech Solutions</p>
      </div>

      <main className="w-full max-w-md relative z-10 space-y-8">
        
        {/* GRUPO 1: COMERCIAL */}
        <section className="space-y-3">
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Expansão e Negócios</p>
          <LinkButton 
            title="Apresentação Corporativa (PDF)" 
            desc="Pitch Deck para Concessionárias e Investidores"
            icon={<Briefcase size={20}/>}
            onClick={() => router.push('/admin/apresentacao')}
            color="border-cyan-500/30"
          />
          <LinkButton 
            title="Solicitar Demonstração Técnica" 
            desc="Fale direto no meu WhatsApp Corporativo"
            icon={<MessageSquare size={20}/>}
            onClick={() => window.open('https://wa.me/5521993527957', '_blank')}
            color="border-emerald-500/30"
          />
        </section>

        {/* GRUPO 2: O PRODUTO (MVP) */}
        <section className="space-y-3">
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Showroom Tecnológico</p>
          <LinkButton 
            title="Portal G25 Matrix Engine" 
            desc="Acesse o MVP e veja o motor em ação"
            icon={<Globe size={20}/>}
            onClick={() => router.push('/')}
            color="border-yellow-500/30"
          />
          <LinkButton 
            title="Como Funciona a Matriz" 
            desc="Entenda a Sincronia Horizontal Blockchain"
            icon={<Zap size={20}/>}
            onClick={() => router.push('/como-funciona')}
            color="border-white/10"
          />
        </section>

        {/* GRUPO 3: JURÍDICO */}
        <section className="space-y-3">
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] ml-2">Legal & Compliance</p>
          <LinkButton 
            title="Acordo de Confidencialidade (NDA)" 
            desc="Protocolo de sigilo para auditoria de código"
            icon={<Lock size={20}/>}
            onClick={() => router.push('/admin/nda')}
            color="border-white/10"
          />
          <LinkButton 
            title="Carta de Intenção (LOI)" 
            desc="Modelo oficial de formalização de interesse"
            icon={<FileText size={20}/>}
            onClick={() => router.push('/admin/loi')}
            color="border-white/10"
          />
        </section>

        {/* BOTÃO COMPARTILHAR HUB */}
        <button 
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
        >
          <Share2 size={14}/> Compartilhar este Hub
        </button>

      </main>

      <footer className="mt-auto py-10 opacity-20 text-[8px] font-black uppercase tracking-[0.6em] text-center">
        G25 TECH SOLUTIONS | BY SFCHAGASFILHO
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
      className={`w-full bg-slate-900/60 backdrop-blur-md border ${color} p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all text-left shadow-lg group`}
    >
      <div className="bg-black/50 p-3 rounded-xl text-cyan-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-white text-[11px] font-black uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 text-[9px] font-bold mt-0.5">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
    </button>
  );
}