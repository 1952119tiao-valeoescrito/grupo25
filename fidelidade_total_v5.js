import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, HelpCircle, LayoutDashboard, History, Activity, Wallet, Scale } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // 1. MOTOR MATRIX ORIGINAL (625 COORDENADAS)
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

  // 2. SESSÃO E TIMER
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
  }, []);

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
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      {/* TICKER SUPERIOR */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-50 relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[11px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO PARA ENTENDER COMO FUNCIONA NA PRÁTICA! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO DA PREMIAÇÃO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400 hover:text-white transition-all">PAINEL ADMIN</button>
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">MEUS REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Olá, {user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40 transition-all text-white"><LogOut size={16}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        
        {/* TIMER GIGANTE */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-8xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        {/* PAINEL CENTRAL MATRIX */}
        <div className="bg-[#0f172a]/85 backdrop-filter blur-[16px] border border-cyan-500/30 p-8 md:p-16 rounded-[4rem] shadow-2xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-yellow-500 font-black text-xs uppercase mb-10 tracking-[0.2em]">Sua Malha de Coordenadas Matrix 5x5</h2>
          
          <div className="bg-black/60 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-10">
            <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="contents">
                  <span className="text-[10px] font-black text-yellow-500 text-right pr-2 font-elite">{i+1}º</span>
                  {[0,1,2,3,4].map((j) => (
                    <div key={j} className="aspect-square bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-elite">
                      {matriz[i] ? matriz[i][j] : '--/--'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {!qrCode ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Gerar Coordenadas</button>
              <button onClick={handleConfirmar} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"} <ChevronRight size={16}/>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 bg-white rounded-[3rem] p-10 max-w-xs mx-auto">
               <QRCodeSVG value={qrCode} size={200} />
               <p className="text-black font-black uppercase text-xs mt-6">Escaneie o Pix para Validar</p>
               <button onClick={()=>setQrCode("")} className="mt-6 text-slate-400 underline text-[10px] font-bold uppercase">Voltar</button>
            </div>
          )}
          <p className="text-[11px] text-white mt-8 font-bold italic uppercase tracking-widest animate-pulse italic">
            IDENTIFICADO: {user.nome}
          </p>
        </div>

        {/* LADO A LADO: LUCRO + TRANSPARÊNCIA */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-[#0f172a]/85 border border-amber-500/30 p-8 rounded-[2rem] text-left relative overflow-hidden shadow-2xl backdrop-blur-xl">
             <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">Sócio Afiliado</div>
             <h3 className="text-[11px] text-amber-500 mb-6 uppercase font-black font-elite">💰 Meu Lucro de Indicação</h3>
             <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
                  <p className="text-3xl text-white font-elite drop-shadow-[0_0_10px_white]">R$ 0,00</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-xl transition-all">SACAR VIA PIX</button>
             </div>
             <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                <p className="text-[9px] text-slate-500 uppercase mb-2 font-bold italic text-center">Link de Convite</p>
                <input readOnly value={"https://www.bet-grupo25.com.br/acesso?ref=" + user.id} className="w-full bg-transparent text-cyan-400 text-[10px] font-mono outline-none text-center" />
             </div>
          </div>

          <div className="bg-[#0f172a]/85 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl text-left">
             <h3 className="text-yellow-500 font-black text-[10px] uppercase mb-6 flex items-center gap-2 font-elite tracking-widest">⚖️ Transparência Legal</h3>
             <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
             </div>
             <p className="mt-6 text-[8px] text-slate-600 italic leading-relaxed uppercase">Operação em conformidade com a Lei 13.756/2018.</p>
          </div>
        </div>

        {/* RANKING SEMANAL */}
        <div className="max-w-md mx-auto bg-[#0f172a]/95 border border-emerald-500/30 p-10 rounded-[2.5rem] shadow-2xl">
            <h3 className="font-elite text-xs text-emerald-400 mb-6 uppercase tracking-widest font-black flex items-center justify-center gap-2">🏆 Ranking Semanal Mimosinha</h3>
            <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando competidores...</p>
            <p className="mt-6 text-[9px] text-slate-400 uppercase tracking-widest font-bold">O TOP 10 GANHA 1 BILHETE REAL!</p>
        </div>

        {/* CARDS PRODUTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-20 max-w-[1000px] mx-auto px-4">
          <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3.5rem] shadow-2xl">
             <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase font-elite tracking-widest">INTER-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold mb-8">Ganha com até 1 ponto</p>
             <a href="https://blockchain-betbrasil.io/pt/inter-bet" target="_blank" className="block w-full py-5 bg-cyan-500 text-black rounded-[2rem] font-black uppercase text-xs hover:scale-105 transition-all">Acessar Site</a>
          </div>
          <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3.5rem] shadow-2xl">
             <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase font-elite tracking-widest">QUINA-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold mb-8">Sorteios Semanais</p>
             <a href="https://blockchain-betbrasil.io/pt/quina-bet" target="_blank" className="block w-full py-5 bg-cyan-500 text-black rounded-[2rem] font-black uppercase text-xs hover:scale-105 transition-all">Acessar Site</a>
          </div>
        </div>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center">
           <p onClick={()=>{setClickCount(c=>c+1); if(clickCount>=4) router.push('/admin/central')}} className="text-[10px] font-black uppercase tracking-[0.5em] italic cursor-pointer antialiased select-none">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>

      <div onClick={()=>router.push('/como-funciona')} className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-110 transition-all z-[100] animate-bounce">
         <HelpCircle size={28} />
      </div>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Dashboard Original de Elite Restaurado com Sucesso!");