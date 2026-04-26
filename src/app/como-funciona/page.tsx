"use client"
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trophy, ChevronLeft, Zap, ShieldCheck, Target } from 'lucide-react';

export default function ComoFunciona() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
    <div className="min-h-screen bg-[#010409] text-white font-sans p-6 md:p-12 relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
      
      <main className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-cyan-400 italic mb-4 uppercase">GRUPO25.BET</h1>
          <p className="text-magenta-400 text-xs uppercase tracking-[0.4em] font-bold text-[#ff00ff]">Transparência Blockchain & Matemática Pura</p>
          <div className="w-full h-px bg-cyan-500/30 mt-8" />
        </header>

        <section className="bg-slate-900/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2.5rem] mb-8 shadow-2xl">
          <h2 className="text-2xl font-black text-cyan-400 mb-6 uppercase flex items-center gap-3">
            <Zap className="text-[#ff00ff]" /> O QUE É A GRUPO25.BET?
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-lg">
            A <b className="text-white">Grupo25.Bet</b> é uma loteria de prognósticos inovadora, estruturada sobre uma matriz de <span className="text-[#ff00ff] font-bold">25x25</span> que gera 625 combinações possíveis.
          </p>
          
          <div className="bg-black/60 p-8 rounded-3xl border border-slate-800 space-y-4 font-bold text-sm text-cyan-200/80">
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> Cada prognóstico (x/y) corresponde a 16 milhares diferentes.</p>
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> A integração total cobre exatamente 10.000 milhares (0000 a 9999).</p>
            <p className="flex gap-3"><span className="text-[#ff00ff] italic">●</span> Resultado extraído via Chainlink VRF na Base Mainnet.</p>
          </div>
        </section>

        <section className="bg-slate-900/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl">
          <h2 className="text-2xl font-black text-cyan-400 mb-10 uppercase flex items-center gap-3">
            <Target className="text-[#ff00ff]" /> COMO APOSTAR?
          </h2>
          
          <div className="space-y-10">
            <div className="flex gap-6 items-center group">
              <div className="w-10 h-10 bg-cyan-500 text-black rounded-full flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]">1</div>
              <p className="text-white font-medium text-lg">Cadastre-se e realize o pagamento de <span className="text-[#ff00ff]">R$ 10,00</span> via PIX.</p>
            </div>
            <div className="flex gap-6 items-center group">
              <div className="w-10 h-10 bg-cyan-500 text-black rounded-full flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]">2</div>
              <p className="text-white font-medium text-lg">O sistema gera automaticamente seus 25 prognósticos aleatórios na matriz 5x5.</p>
            </div>
            <div className="flex gap-6 items-center group">
              <div className="w-10 h-10 bg-cyan-500 text-black rounded-full flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]">3</div>
              <p className="text-white font-medium text-lg">Aguarde o sorteio, que ocorre todos os <b className="text-cyan-400 uppercase italic">sábados às 20:00hrs</b>.</p>
            </div>
          </div>
        </section>

        <div className="text-center pb-20">
          <Link href="/" className="inline-flex items-center gap-2 border border-cyan-500/30 text-white px-10 py-4 rounded-2xl hover:bg-cyan-600 transition-all font-black uppercase text-xs tracking-[0.2em]">
            <ChevronLeft size={16} /> Voltar ao Painel Matrix
          </Link>
        </div>
      </main>
    </div>
  );
}
