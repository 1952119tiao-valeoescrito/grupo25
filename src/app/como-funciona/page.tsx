"use client"
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, Zap, ShieldCheck, Target, Wallet, MousePointer2, ArrowRight } from 'lucide-react';

export default function ComoFunciona() {
  const canvasRef = useRef(null);
  const router = useRouter();

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
      ctx.fillStyle = 'rgba(1, 4, 9, 0.18)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
      
      {/* NAV FIXA */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs uppercase font-black">
            <ChevronLeft size={16} /> Voltar
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase font-elite">GRUPO25<span className="text-cyan-400">.BET</span></h1>
          <div className="w-20 md:block hidden"></div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <header className="text-center mb-16">
          <Trophy size={60} className="text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 font-elite">
            GUIA <span className="text-cyan-400">MATRIX</span>
          </h2>
          <p className="text-[#ff00ff] text-xs uppercase tracking-[0.4em] font-bold">Transparência Blockchain & Matemática Pura</p>
        </header>

        {/* 1. O QUE É A GRUPO25.BET? (BASE MATEMÁTICA) */}
        <section className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2.5rem] mb-8 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-6 uppercase flex items-center gap-3 font-elite">
            <Zap className="text-[#ff00ff]" /> O QUE É A GRUPO25.BET?
          </h3>
          <p className="text-slate-300 leading-relaxed mb-8 text-lg">
            Somos uma loteria de prognósticos inovadora, baseada em uma matriz de <span className="text-[#ff00ff] font-bold">25x25</span> que gera 625 combinações auditadas.
          </p>
          
          <div className="bg-black/60 p-8 rounded-3xl border border-slate-800 space-y-4 font-bold text-xs md:text-sm text-cyan-200/80">
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> Cada coordenada (x/y) corresponde a 16 milhares diferentes.</p>
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> A integração total cobre exatamente 10.000 milhares (0000 a 9999).</p>
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> Sorteio 100% auditado via Chainlink VRF na Base Mainnet.</p>
          </div>
        </section>

        {/* 2. A MÁGICA DA HORIZONTALIDADE (ESTRATÉGIA) */}
        <section className="bg-[#0d1117]/90 backdrop-blur-xl border border-cyan-500/20 rounded-[3rem] p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
          <h3 className="text-yellow-500 font-black text-2xl uppercase mb-8 italic flex items-center gap-3 font-elite">
            <Target size={24}/> Por que é fácil ganhar?
          </h3>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-lg">
              Sua aposta é uma **Malha 5x5** com 25 coordenadas. Diferente de tudo o que você já viu, o seu bilhete concorre em **5 frentes simultâneas**:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <p className="text-cyan-400 font-black mb-2 uppercase text-sm">Poder Horizontal</p>
                <p className="text-[11px] leading-relaxed">Cada uma das 5 linhas da sua malha concorre individualmente a um dos 5 prêmios sorteados. Você tem 5 chances por linha!</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <p className="text-[#ff00ff] font-black mb-2 uppercase text-sm">Ganhos a partir de 1 Ponto</p>
                <p className="text-[11px] leading-relaxed">Acertou apenas 1 coordenada na horizontal de qualquer prêmio? <strong>VOCÊ JÁ GANHOU PIX!</strong> Ganhos com 1, 2, 3, 4 ou 5 pontos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PASSO A PASSO (TUTORIAL) */}
        <section className="bg-slate-900/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-10 uppercase flex items-center gap-3 font-elite">
             PASSO A PASSO
          </h3>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-cyan-500 text-black rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg"><MousePointer2 size={18}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-1">Gere sua Matriz</h4>
                <p className="text-slate-400 text-xs">No Dashboard, clique em "Trocar Coordenadas" até encontrar sua combinação favorita.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-yellow-500 text-black rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg"><Wallet size={18}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-1">Pague via PIX (R$ 10,00)</h4>
                <p className="text-slate-400 text-xs">O crédito é processado instantaneamente pelo Mercado Pago. Use o QR Code ou Copia e Cola.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-emerald-500 text-black rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg"><ShieldCheck size={18}/></div>
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-1">Bilhete Autenticado</h4>
                <p className="text-slate-400 text-xs">Confirme seu certificado e receba seu bilhete digital com selo de autenticidade Blockchain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="text-center bg-gradient-to-r from-cyan-600/20 to-magenta-600/20 p-12 rounded-[4rem] border border-white/5 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-6 font-elite tracking-tighter">PRONTO PARA ENTRAR NA MATRIX?</h3>
          <button 
            onClick={() => router.push('/register')}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            Começar Agora <ArrowRight size={18} />
          </button>
        </section>

        <div className="text-center mt-12 opacity-30 text-[10px] uppercase font-bold tracking-[0.5em]">
          © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}