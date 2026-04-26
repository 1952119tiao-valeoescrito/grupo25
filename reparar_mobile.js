import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Menu, X, Wallet, Scale, ShieldCheck, ChevronRight, RefreshCw, Loader2, LayoutDashboard, History, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function EliteMatrixMobile() {
  const router = useRouter();
  const [step, setStep] = useState('age'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [progress, setProgress] = useState(0);
  const [matriz, setMatriz] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.99) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.12) + 0.08;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, [step]);

  const handleStart = () => {
    setStep('splash');
    let p = 0;
    const interval = setInterval(() => {
      p += 2; setProgress(p);
      if (p >= 100) { clearInterval(interval); setStep('form'); }
    }, 100);
  };

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) { pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1)); }
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };
  useEffect(() => { gerarMalha(); }, []);

  return (
    <div className="min-h-screen bg-[#010409] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-50" />

      <div className={"fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl transition-all duration-500 " + (isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
        <nav className="flex flex-col items-center justify-center h-full gap-8 font-black uppercase italic tracking-tighter text-2xl">
           <button onClick={() => {setIsMenuOpen(false); setStep('form');}} className="hover:text-cyan-400 flex items-center gap-4">DASHBOARD</button>
           <button onClick={() => router.push('/meus-bilhetes')} className="hover:text-cyan-400 flex items-center gap-4">MEUS BILHETES</button>
           <button onClick={() => router.push('/resultados')} className="hover:text-cyan-400 flex items-center gap-4">RESULTADOS</button>
           <button onClick={() => router.push('/admin/central')} className="text-yellow-500 flex items-center gap-4">ADMIN</button>
        </nav>
      </div>

      {step === 'age' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border-2 border-red-500/30 p-8 rounded-[2.5rem] text-center w-full max-w-sm shadow-2xl">
             <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-xl">18+</div>
             <button onClick={handleStart} className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">ENTRAR NO SISTEMA</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="fixed inset-0 z-[1001] flex flex-col items-center justify-center bg-[#020617] p-8 text-center">
          <img src="/mimosinha-logo.png" className="w-full max-w-[500px] animate-pulse mb-8" alt="Logo" />
          <div className="w-full max-w-xs h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: progress + '%' }} />
          </div>
        </div>
      )}

      {step === 'form' && (
        <>
          <header className="sticky top-0 z-[100] w-full bg-black/60 backdrop-blur-lg border-b border-white/5 px-6 py-5 flex justify-between items-center">
            <h1 className="font-black text-lg italic uppercase tracking-tighter text-white tracking-widest">MIMOSINHA<span className="text-cyan-400 ml-1">G25</span></h1>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 bg-slate-800 rounded-xl border border-white/10 text-cyan-400">
              <Menu size={24} />
            </button>
          </header>

          <main className="max-w-5xl mx-auto p-4 md:p-12 space-y-8">
            <section className="bg-slate-900/80 border border-white/10 p-6 md:p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg md:text-2xl font-black italic uppercase text-white">Sua Malha Matrix</h2>
                <button onClick={gerarMalha} className="bg-cyan-500/10 text-cyan-400 p-3 rounded-2xl border border-cyan-500/20"><RefreshCw size={18}/></button>
              </div>

              <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center mb-10">
                {matriz.map((linha, i) => (
                  <div key={i} className="contents">
                    <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right">{i+1}º</span>
                    {linha.map((celula, j) => (
                      <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/20 rounded-lg flex items-center justify-center text-[9px] md:text-sm font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
                        {celula}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input placeholder="CPF" className="w-full p-4 rounded-xl text-sm bg-slate-950 border-slate-800" />
                   <input placeholder="Chave PIX Prêmio" className="w-full p-4 rounded-xl text-sm bg-slate-950 border-slate-800" />
                </div>
                <button className="w-full bg-cyan-600 hover:bg-cyan-500 p-5 rounded-[1.5rem] font-black text-sm tracking-widest shadow-xl shadow-cyan-900/20">CONFIRMAR E PAGAR</button>
              </div>
            </section>
          </main>
        </>
      )}

      <footer className="py-12 text-center opacity-20 text-[8px] font-black uppercase tracking-[0.5em] px-6">
        Protocolos Matrix Elite © 2026 | By Neon Database & Base Mainnet
      </footer>
    </div>
  );
}`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Arquivo page.tsx responsivo reparado com sucesso!");