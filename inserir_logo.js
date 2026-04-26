import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';

export default function EliteHome() {
  const router = useRouter();
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = [];
      for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = [];
      for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
        for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
          grid.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
        }
      }
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.18)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '900 14px Orbitron';
        grid.forEach(cell => {
          cell.counter++;
          if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
          const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
          ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
          ctx.fillText(cell.text, cell.x, cell.y);
        });
        requestAnimationFrame(draw);
      };
      draw();
    }
  }, [step]);

  const handleStart = () => {
    setStep('splash');
    let p = 0;
    const interval = setInterval(() => {
      p += 1; // 100 passos
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('form'), 1000);
      }
    }, 150); // Aproximadamente 15 segundos de Splash
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />

      {/* 1. AGE GATE */}
      {step === 'age' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#010409]/90 backdrop-blur-xl">
          <div className="bg-slate-900 border-2 border-red-500/30 p-12 rounded-[3rem] text-center shadow-2xl">
             <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl tracking-tighter">18+</div>
             <h2 className="text-xl font-bold uppercase mb-6 tracking-widest text-red-500">Acesso Restrito</h2>
             <button onClick={handleStart} className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">SOU MAIOR E DESEJO ENTRAR</button>
          </div>
        </div>
      )}

      {/* 2. SPLASH SCREEN COM A IMAGEM ELITE */}
      {step === 'splash' && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          {/* AQUI ESTÁ A SUA IMAGEM */}
          <img 
            src="/mimosinha-logo.png" 
            alt="Mimosinha G25" 
            className="w-full max-w-[500px] md:max-w-[700px] mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
          />
          
          <h4 className="text-xl md:text-3xl text-yellow-500 font-black uppercase italic drop-shadow-[0_0_10px_rgba(234,179,8,0.4)] tracking-tighter">
            ACERTE 1 PONTO E JÁ GANHA PIX!
          </h4>

          <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-12 overflow-hidden border border-white/5">
            <div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{ width: progress + '%' }} />
          </div>
          <p className="text-yellow-500/40 text-[9px] font-bold uppercase tracking-[0.5em] mt-6 animate-pulse text-center">Sincronizando Protocolos Matrix...</p>
        </div>
      )}

      {/* 3. FORMULÁRIO DE CADASTRO */}
      {step === 'form' && (
        <div className="flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/5 py-6 px-10 flex justify-between items-center">
             <h1 className="font-black text-xl italic uppercase tracking-tighter">MIMOSINHA<span className="text-yellow-500 text-sm ml-1 tracking-widest">G25</span></h1>
             <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer hover:text-yellow-300" onClick={() => router.push('/login')}>Fazer Login</span>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl backdrop-blur-xl text-center mt-10">
             <h2 className="text-yellow-500 font-black text-2xl uppercase mb-2">Crie sua conta</h2>
             <p className="text-slate-500 text-[10px] mb-10 uppercase font-bold tracking-widest">Acesse a Matriz Matrix Elite</p>
             
             <div className="space-y-4 text-left">
                <input placeholder="Nome Completo" className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500" />
                <input placeholder="E-mail" className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500" />
                <input placeholder="Chave PIX prêmio" className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500" />
                <input type="password" placeholder="Sua Senha" className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500" />
                <button className="w-full bg-amber-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase text-xs shadow-xl mt-6 transition-all transform active:scale-95">CADASTRAR E JOGAR</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Imagem da Mimosinha integrada ao Splash com sucesso!");