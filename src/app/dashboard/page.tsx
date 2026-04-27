"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Scale, Wallet, History, MessageSquare, LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:20:56:04");
  const canvasRef = useRef(null);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }

    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = []; for (let i=0; i<120; i++) gridAnim.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = '900 13px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      gridAnim.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
      requestAnimationFrame(draw);
    }; draw();
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = []; for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-50 relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[10px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="font-['Orbitron'] text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400">PAINEL ADMIN</button>
             <button onClick={()=>router.push('/meus-bilhetes')}>MEUS REGISTROS</button>
             <button onClick={()=>router.push('/resultados')}>RESULTADOS</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase">Olá, ${user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10"><LogOut size={14}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10">
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div className="font-['Orbitron'] text-6xl md:text-9xl mb-4 text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter italic">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 bg-[#0f172a]/95 border border-cyan-500/30 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
             <h2 className="text-yellow-500 font-black text-xs uppercase mb-8 tracking-[0.2em] font-['Orbitron']">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-4 md:p-8 mb-10">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {matriz.map((linha, i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                      {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)] font-['Orbitron']">{c}</div>)}
                    </div>
                  ))}
                </div>
             </div>
             <p className="text-[10px] text-white mb-8 font-black uppercase italic tracking-widest animate-pulse italic">Identificado: ${user.nome}</p>
             <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 border border-white/5 py-5 rounded-2xl font-black uppercase text-[10px]">Trocar Coordenadas</button>
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-cyan-900/40">Confirmar Certificado</button>
             </div>
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-[#0f172a]/95 border border-amber-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">Sócio Afiliado</div>
               <h3 className="text-[11px] text-amber-500 mb-6 uppercase font-black font-['Orbitron'] tracking-widest">💰 Meu Lucro</h3>
               <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p className="text-3xl font-black text-white font-['Orbitron']">R$ 0,00</p>
               <button className="w-full bg-amber-600 py-4 rounded-xl text-[10px] font-black uppercase mt-6">SACAR VIA PIX</button>
            </div>
            <div className="bg-[#0f172a]/95 border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-yellow-500 font-black text-[10px] uppercase mb-6 flex items-center gap-2 font-['Orbitron'] tracking-widest">⚖️ Transparência</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-[#0f172a]/95 border border-emerald-500/30 p-10 rounded-[2.5rem] shadow-2xl mt-12">
            <h3 className="font-['Orbitron'] text-xs text-emerald-400 mb-6 uppercase tracking-widest font-black flex items-center justify-center gap-2">🏆 Ranking Mimosinha</h3>
            <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando competidores...</p>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 opacity-30 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] italic cursor-pointer" onClick={()=>router.push('/admin/central')}>
           © 2026 BET-GRUPO25 | MATRIX PRO | BY NEON DATABASE
        </p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      `}</style>
    </div>
  );
}