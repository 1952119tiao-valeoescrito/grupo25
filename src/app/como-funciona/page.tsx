"use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, Zap, ShieldCheck, Target, Wallet, MousePointer2, ArrowRight, Menu, X } from 'lucide-react';

export default function ComoFunciona() {
  const canvasRef = useRef(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.22)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.12;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-50" />
      
      {/* HEADER COM MENU HAMBÚRGUER */}
      <nav className="fixed top-0 w-full z-[100] bg-black/90 backdrop-blur-xl border-b border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all text-xs uppercase font-black">
            <ChevronLeft size={18} /> <span className="hidden md:inline">Voltar</span>
          </button>
          
          <h1 className="text-xl font-black italic tracking-tighter uppercase font-elite">
            MIMOSINHA<span className="text-cyan-400">G25</span>
          </h1>

          <button onClick={toggleMenu} className="text-white hover:text-cyan-400 transition-all">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MENU MOBILE OVERLAY */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col p-8 gap-6 text-center font-elite">
               <Link href="/" className="text-lg font-black uppercase tracking-widest hover:text-cyan-400 transition-all">Início</Link>
               <Link href="/register" className="text-lg font-black uppercase tracking-widest hover:text-cyan-400 transition-all">Cadastrar</Link>
               <Link href="/login" className="text-lg font-black uppercase tracking-widest hover:text-cyan-400 transition-all">Entrar</Link>
               <div className="h-px bg-white/10 w-full" />
               <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em]">Protocolos Matrix Ativos</p>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <header className="text-center mb-20">
          <div className="bg-yellow-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
             <Trophy size={48} className="text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 font-elite text-white">
            GUIA <span className="text-cyan-400">MATRIX</span>
          </h2>
          <p className="text-[#ff00ff] text-[10px] md:text-xs uppercase tracking-[0.4em] font-black drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">Transparência Blockchain & Matemática Pura</p>
        </header>

        {/* 1. O QUE É A GRUPO25.BET? */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[3rem] mb-8 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-6 uppercase flex items-center gap-3 font-elite">
            <Zap className="text-[#ff00ff]" /> O QUE É A MIMOSINHA G25?
          </h3>
          <p className="text-white leading-relaxed mb-8 text-lg font-medium">
            Somos uma loteria de prognósticos de última geração, estruturada sobre uma matriz de <span className="text-[#ff00ff] font-bold">25x25</span> que gera 625 combinações auditadas e imutáveis.
          </p>
          
          <div className="bg-black/80 p-8 rounded-[2rem] border border-cyan-500/20 space-y-5 font-black text-xs md:text-sm text-white">
            <p className="flex gap-4 items-center"><span className="w-2 h-2 bg-[#ff00ff] rounded-full animate-ping" /> Cada coordenada (x/y) corresponde a 16 milhares diferentes.</p>
            <p className="flex gap-4 items-center"><span className="w-2 h-2 bg-[#ff00ff] rounded-full animate-ping" /> Cobre exatamente 10.000 milhares (do 0000 ao 9999).</p>
            <p className="flex gap-4 items-center"><span className="w-2 h-2 bg-[#ff00ff] rounded-full animate-ping" /> Sorteio auditado via Chainlink VRF na rede Base Mainnet.</p>
          </div>
        </section>

        {/* 2. A MÁGICA DA HORIZONTALIDADE */}
        <section className="bg-[#0d1117] border border-cyan-500/40 rounded-[3rem] p-8 md:p-12 mb-8 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
          <h3 className="text-yellow-500 font-black text-2xl uppercase mb-8 italic flex items-center gap-3 font-elite">
            <Target size={24}/> Por que você ganha mais aqui?
          </h3>
          
          <div className="space-y-6 text-white leading-relaxed">
            <p className="text-lg font-bold">
              Sua malha concorre em <span className="text-cyan-400">5 frentes simultâneas</span> na horizontal:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/60 p-6 rounded-3xl border-l-4 border-cyan-500">
                <p className="text-cyan-400 font-black mb-3 uppercase text-sm tracking-widest">Poder Horizontal</p>
                <p className="text-sm font-bold leading-relaxed">Cada uma das 5 linhas da sua malha concorre individualmente a um dos 5 prêmios sorteados. Você tem 5 chances por linha!</p>
              </div>
              <div className="bg-black/60 p-6 rounded-3xl border-l-4 border-[#ff00ff]">
                <p className="text-[#ff00ff] font-black mb-3 uppercase text-sm tracking-widest">Ganhos com 1 Ponto</p>
                <p className="text-sm font-bold leading-relaxed">Acertou apenas 1 coordenada na horizontal de qualquer prêmio? <strong>PIX NA CONTA!</strong> Premiamos faixas de 1, 2, 3, 4 e 5 pontos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PASSO A PASSO (TUTORIAL) */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[3rem] mb-12 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-12 uppercase flex items-center gap-3 font-elite text-center justify-center">
             COMO JOGAR AGORA
          </h3>
          
          <div className="space-y-12">
            <div className="flex gap-6 items-start group">
              <div className="w-12 h-12 bg-cyan-500 text-black rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"><MousePointer2 size={24}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-base mb-2">1. Gere sua Matriz 5x5</h4>
                <p className="text-white font-medium text-sm leading-relaxed">No seu painel, clique em "Trocar Coordenadas" até encontrar a malha da sorte.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="w-12 h-12 bg-yellow-500 text-black rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"><Wallet size={24}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-base mb-2">2. Ative com R$ 10,00</h4>
                <p className="text-white font-medium text-sm leading-relaxed">Gere o Pix instantâneo via Mercado Pago. O crédito cai na hora e valida sua aposta.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="w-12 h-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"><ShieldCheck size={24}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-base mb-2">3. Garanta seu Certificado</h4>
                <p className="text-white font-medium text-sm leading-relaxed">Receba seu bilhete digital autenticado com ID único rastreável.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="text-center bg-gradient-to-br from-cyan-600/30 via-black to-magenta-600/30 p-12 rounded-[4rem] border-2 border-white/10 shadow-[0_0_100px_rgba(34,211,238,0.15)]">
          <h3 className="text-2xl md:text-4xl font-black uppercase italic mb-8 font-elite tracking-tighter text-white">ESTÁ PRONTO PARA FORRAR?</h3>
          <button 
            onClick={() => router.push('/register')}
            className="bg-white text-black px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-cyan-400 transition-all flex items-center gap-4 mx-auto"
          >
            ENTRAR NA MATRIX <ArrowRight size={20} />
          </button>
        </section>

        <div className="text-center mt-20 opacity-40 text-[10px] uppercase font-bold tracking-[0.6em] text-white">
          © 2026 BET-GRUPO25 | SISTEMAS CRIPTOGRÁFICOS ELITE
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}