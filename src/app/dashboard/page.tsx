"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2, LogOut, ShieldCheck, Zap, Wallet, BarChart3, Globe, RefreshCw, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardShowroom() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [matriz, setMatriz] = useState([]); 
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const logged = localStorage.getItem('user');
    if (logged) { try { setUser(JSON.parse(logged)); } catch (e) { router.push('/login'); } }
    else { router.push('/login'); }

    const interval = setInterval(() => {
      const now = new Date();
      const nextSat = new Date();
      nextSat.setDate(now.getDate() + (6 - now.getDay()));
      nextSat.setHours(20, 0, 0, 0);
      if (now > nextSat) nextSat.setDate(nextSat.getDate() + 7);
      const diff = nextSat.getTime() - now.getTime();
      const f = (n: number) => Math.floor(Math.max(0, n)).toString().padStart(2, '0');
      setTimer(f(diff/86400000) + ":" + f((diff/3600000)%24) + ":" + f((diff/60000)%60) + ":" + f((diff/1000)%60));
    }, 1000);

    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = (canvas as any).getContext('2d');
    (canvas as any).width = window.innerWidth; (canvas as any).height = window.innerHeight;
    const coords: string[] = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim: any[] = []; for (let i = 0; i < 60; i++) {
        gridAnim.push({ x: Math.random() * (canvas as any).width, y: Math.random() * (canvas as any).height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(s => {
        s.c++; if(Math.random() > 0.985) s.text = coords[Math.floor(Math.random() * 625)];
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.08;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')'; ctx.fillText(s.text, s.x, s.y);
      });
      requestAnimationFrame(draw);
    }; draw();
    return () => clearInterval(interval);
  }, [router]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = []; for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas as any); setQrCode(""); 
  };

  const handleGerarPix = async () => {
    if (matriz.length === 0) return alert("Gere as coordenadas!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, pixKeyResgate: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
      else alert("Erro no Gateway");
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-28 flex items-center px-6 md:px-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
  <img src="/logo-g25-tech-v3.png" alt="G25 Matrix" className="h-16 w-auto" />
  <div className="flex flex-col">
    <h1 className="text-white text-xl font-black uppercase italic font-elite leading-none tracking-tighter">G25 MATRIX <span className="text-cyan-400">ENGINE</span></h1>
    <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] mt-2">PROPRIEDADE DE SFCHAGASFILHO</span>
  </div>
</div>
          <div className="flex items-center gap-6 font-elite">
             <div className="hidden md:flex gap-6 text-xs uppercase font-black">
                <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-cyan-400 transition-all text-white">Registros</button>
                <button onClick={()=>router.push('/resultados')} className="hover:text-cyan-400 transition-all text-white">Resultados</button>
             </div>
             <div className="bg-yellow-500/10 px-6 py-2.5 rounded-full border border-yellow-500/20 shadow-inner">
                <p className="text-xs font-bold text-yellow-500 uppercase">Olá, {user.nome.split(' ')[0]}</p>
             </div>
             <button onClick={()=>{localStorage.clear(); router.push('/login');}} className="text-red-500 hover:scale-110 transition-transform"><LogOut size={24}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 relative z-10 text-center">
        <section className="mb-16">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-6">
             <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 font-elite"><ShieldCheck size={12}/> Tecnologia Registrada INPI</p>
          </div>
          <div className="text-5xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] font-elite italic">{timer}</div>
          <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] mt-4 opacity-70">Sincronia Blockchain Ativa</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 text-left">
           <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between">
              <h3 className="text-xl text-yellow-500 mb-4 font-black uppercase italic font-elite">Modular Bet Solutions</h3>
              <p className="text-white font-bold text-sm mb-8 leading-relaxed">Nossos algoritmos suportam múltiplas modalidades de quota fixa com liquidação automática.</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => window.open('https://blockchain-betbrasil.io/pt/inter-bet', '_blank')} className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center hover:bg-cyan-600/20 transition-all font-black text-[10px] text-cyan-400 uppercase">INTER-BET</button>
                 <button onClick={() => window.open('https://blockchain-betbrasil.io/pt/quina-bet', '_blank')} className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center hover:bg-cyan-600/20 transition-all font-black text-[10px] text-cyan-400 uppercase">QUINA-BET</button>
              </div>
           </div>

           <div className="bg-[#0d1117] border border-cyan-500/30 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <h2 className="text-yellow-500 font-black text-xs md:text-sm uppercase mb-10 tracking-[0.4em] text-center italic font-elite">Malha de Prognósticos 5x5</h2>
              <div className="bg-black/90 border border-slate-800 rounded-[2.5rem] p-4 md:p-8 mb-10 shadow-inner">
                <div className="flex flex-col gap-3">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right w-16 italic font-elite">{i+1}º PRÊMIO</span>
                      <div className="flex-1 grid grid-cols-5 gap-2">
                        {[0,1,2,3,4].map((j) => (
                          <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/20 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-white">{matriz[i] ? (matriz[i] as any)[j] : '--/--'}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 max-w-md mx-auto">
                 <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-xl font-black text-[10px] uppercase">Trocar Matriz</button>
                 <button onClick={handleGerarPix} disabled={loading || matriz.length === 0} className="flex-1 bg-cyan-600 p-4 rounded-xl font-black text-[10px] uppercase shadow-lg flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={14}/> : "GERAR CRÉDITO"}
                 </button>
              </div>
           </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}