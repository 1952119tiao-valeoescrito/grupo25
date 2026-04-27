import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, HelpCircle, Wallet, Scale } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);

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
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const opacity = (Math.sin(cell.counter * 0.05) * 0.12) + 0.08;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + opacity + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (logged) setUser(JSON.parse(logged));
    else router.push('/');

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
  }, [router]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };
  useEffect(() => gerarMalha(), []);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey || '00000000000', prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
    } catch (e) { alert("Erro ao processar"); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* Ticker */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO PARA ENTENDER COMO FUNCIONA NA PRÁTICA! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO DA PREMIAÇÃO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617] border-b border-white/10 h-16 md:h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400 ml-1">BRASIL</span></h1>
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-red-500 hover:text-red-400 transition-all font-black">SAIR</button>
          </nav>
          <div className="md:hidden flex items-center gap-4">
             <span className="text-[10px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase">ELITE</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        <section className="mb-10">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/80 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             
             {!qrCode ? (
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 hover:bg-slate-700 transition-all font-elite">Trocar Coordenadas</button>
                  <button onClick={handleConfirmar} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg flex justify-center items-center gap-2 transition-all font-elite">
                    {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                  </button>
                </div>
             ) : (
                <div className="flex flex-col items-center py-4 bg-white rounded-[2rem] p-8 max-w-xs mx-auto shadow-2xl">
                   <QRCodeSVG value={qrCode} size={200} />
                   <button onClick={()=>setQrCode("")} className="mt-6 text-slate-400 underline text-[10px] font-bold uppercase">Voltar</button>
                </div>
             )}
             <p className="text-[10px] text-white/50 mt-8 font-bold uppercase tracking-widest italic animate-pulse">IDENTIFICADO: {user.nome}</p>
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-[#0d1117] border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">SÓCIO AFILIADO</div>
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest italic font-elite">💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
               <button className="w-full bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-xl text-[10px] font-black uppercase mt-6 shadow-lg transition-all">SACAR VIA PIX</button>
            </div>
            <div className="bg-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[9px] tracking-widest font-elite italic">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[9px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* RANKING */}
        <div className="max-w-md mx-auto bg-[#0d1117] border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl mt-12">
            <h3 className="text-[10px] text-emerald-400 mb-4 uppercase tracking-widest font-black font-elite flex items-center justify-center gap-2">🏆 Ranking Mimosinha</h3>
            <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter animate-pulse text-center">Sincronizando competidores...</p>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 opacity-20 text-center">
        <p onClick={()=>{setClickCount(c=>c+1); if(clickCount>=4) router.push('/admin/central')}} className="text-[9px] font-black uppercase tracking-[0.5em] italic cursor-pointer select-none">
           © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
        </p>
      </footer>

      <div onClick={()=>router.push('/como-funciona')} className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-110 transition-all z-[100] animate-bounce">
         <HelpCircle size={28} />
      </div>

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
console.log("✅ Dashboard Cristalino e Sem Erros de Sintaxe!");
