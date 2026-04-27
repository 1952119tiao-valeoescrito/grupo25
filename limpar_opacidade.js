import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, LogOut, HelpCircle, LayoutDashboard, History } from 'lucide-react';

export default function DashboardElite() {
  const router = useRouter();
  const [timer, setTimer] = useState("00:00:00:00");
  const [matriz, setMatriz] = useState([]);
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
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
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
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

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (logged) setUser(JSON.parse(logged));
    
    const interval = setInterval(() => {
      const now = new Date();
      const nextSat = new Date();
      nextSat.setDate(now.getDate() + (6 - now.getDay()));
      nextSat.setHours(20, 0, 0, 0);
      if (now > nextSat) nextSat.setDate(nextSat.getDate() + 7);
      const diff = nextSat.getTime() - now.getTime();
      const f = (n) => Math.floor(Math.max(0, n)).toString().padStart(2, '0');
      setTimer(f(diff/86400000) + ":" + f((diff/3600000)%24) + ":" + f((diff/60000)%60) + ":" + f((diff/1000)%60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* TICKER SUPERIOR */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] z-50 relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[12px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO PARA ENTENDER COMO FUNCIONA NA PRÁTICA! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617] border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="font-elite text-white text-sm md:text-xl tracking-tighter italic uppercase">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400 hover:text-white">PAINEL ADMIN</button>
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white">MEUS REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white">RESULTADOS</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">ACESSO RESTRITO</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40">🚪</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        
        {/* TIMER NÍTIDO */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div className="font-elite text-6xl md:text-9xl mb-4 text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] tracking-tighter">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        {/* PAINEL CENTRAL (TRANSPARÊNCIA SEM BLUR) */}
        <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-8 md:p-16 rounded-[4rem] shadow-2xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-yellow-500 font-black text-xs uppercase mb-10 tracking-[0.2em]">Sua Malha de Coordenadas Matrix 5x5</h2>
          
          <div className="bg-black/80 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-10">
            <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="contents">
                  <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                  {[0,1,2,3,4].map((j) => (
                    <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-elite">
                      {matriz[i] ? matriz[i][j] : '--/--'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white mb-8 font-bold italic uppercase tracking-widest">
            {user ? 'IDENTIFICADO: ' + user.nome : 'AGUARDANDO LOGIN...'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Trocar Coordenadas</button>
            <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">Confirmar Certificado</button>
          </div>
        </div>

        {/* RANKING SEMANAL */}
        <div className="max-w-md mx-auto bg-[#0f172a]/95 border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl">
           <h3 className="font-elite text-xs text-emerald-400 mb-6 uppercase tracking-widest font-black flex items-center justify-center gap-2">🏆 Ranking Semanal Mimosinha</h3>
           <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando competidores...</p>
           <p className="mt-6 text-[9px] text-slate-400 uppercase tracking-widest font-bold">O TOP 10 GANHA 1 BILHETE REAL!</p>
        </div>

      </main>

      <footer className="py-20 border-t border-white/5 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2026 BET-GRUPO25 | MATRIX PRO | NEON DATABASE</p>
      </footer>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Card Matrix limpo! A opacidade foi removida.");