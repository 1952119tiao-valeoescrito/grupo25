import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, Wallet, LogOut, Scale } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
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

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else {
      setUser(JSON.parse(logged));
      gerarMalha();
    }
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

  const handleSair = () => { localStorage.clear(); router.push('/'); };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />

      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden flex items-center h-[45px] z-50 relative">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[10px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <div className="flex items-center gap-4">
             <p className="hidden sm:block text-[10px] font-bold text-yellow-500 uppercase italic">{user ? user.nome.split(' ')[0] : 'Acesso Restrito'}</p>
             <button onClick={handleSair} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40"><LogOut size={16}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div className="text-5xl md:text-8xl mb-4 font-black drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
             <h2 className="text-yellow-500 font-bold text-xs uppercase mb-8 tracking-widest text-center">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="grid grid-cols-6 gap-2 md:gap-4 mb-10 items-center max-w-md mx-auto">
                {matriz.map((linha, i) => (
                  <div key={i} className="contents">
                    <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                    {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] font-black text-cyan-400">{c}</div>)}
                  </div>
                ))}
             </div>
             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase">Trocar Coordenadas</button>
                <button className="flex-1 bg-cyan-600 p-4 rounded-2xl font-black text-[10px] uppercase">Confirmar Certificado</button>
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a]/85 border border-amber-500/30 p-8 rounded-[2rem] text-left">
               <h3 className="text-[11px] text-amber-500 mb-6 font-black uppercase">💰 Lucro de Indicação</h3>
               <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p className="text-3xl text-white font-black italic">R$ 0,00</p>
               <button className="w-full bg-amber-600 p-4 rounded-xl text-[10px] font-black uppercase mt-6">SACAR VIA PIX</button>
            </div>
            
            <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-yellow-500 font-black text-xs uppercase mb-6 flex items-center gap-2"><Scale size={16}/> Transparência Legal</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Segurança (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Operador (9,57%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20 max-w-[1000px] mx-auto">
          <a href="https://blockchain-betbrasil.io/pt/inter-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
             <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase">INTER-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Acesse o ecossistema</p>
          </a>
          <a href="https://blockchain-betbrasil.io/pt/quina-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
             <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase">QUINA-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Acesse o ecossistema</p>
          </a>
        </div>

        <footer className="py-20 border-t border-white/5 opacity-30">
           <p onClick={()=>router.push('/admin/central')} className="text-[10px] font-black uppercase tracking-[0.5em] cursor-pointer">© 2026 BET-GRUPO25 | MATRIX PROTOCOL | BY NEON DATABASE</p>
        </footer>
      </main>

      <style jsx global>{\`
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      \`}</style>
    </div>
  );
}`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Dashboard Elite restaurado com sucesso!");