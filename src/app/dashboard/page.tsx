"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2, HelpCircle, LogOut, Cpu, ShieldCheck, Zap, Wallet, BarChart3, Copy, CheckCircle2, Globe, RefreshCw, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardShowroom() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [matriz, setMatriz] = useState([]); 
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const logged = localStorage.getItem('user');
    if (logged) {
      try { setUser(JSON.parse(logged)); } catch (e) { router.push('/login'); }
    } else { router.push('/login'); }

    // Lógica do Timer
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

    // Efeito Matrix de Fundo
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
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')';
        ctx.fillText(s.text, s.x, s.y);
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
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, pixKeyResgate: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
      else alert(data.error || "Erro no Gateway");
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  const handleConfirmar = () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ 
      id: 'G25-WEB', 
      coords: matriz.flat(), 
      qrCode: qrCode, 
      usuario: user.nome, 
      pixKey: user.pixKey,
      data: new Date().toLocaleString() 
    }));
    router.push('/bilhete/atual');
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* HEADER CORPORATIVO */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6 md:px-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-black uppercase italic tracking-tighter font-elite leading-none">G25 MATRIX <span className="text-cyan-400">ENGINE</span></h1>
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.4em] mt-1">Licensed for SFCHAGASFILHO</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex gap-4">
                <button onClick={()=>router.push('/meus-bilhetes')} className="text-[10px] font-black uppercase hover:text-cyan-400 text-white">Registros</button>
                <button onClick={()=>router.push('/resultados')} className="text-[10px] font-black uppercase hover:text-cyan-400 text-white">Resultados</button>
             </div>
             <div className="bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter">Olá, {user.nome.split(' ')[0]}</p>
             </div>
             <button onClick={()=>{localStorage.clear(); router.push('/login');}} className="text-red-500"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 relative z-10">
        
        {/* TIMER E SELO INPI */}
        <section className="text-center mb-16">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-6">
             <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2"><ShieldCheck size={12}/> Propriedade Intelectual Registrada INPI</p>
          </div>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-4 italic">{timer}</div>
          <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] opacity-70">Próxima Extração Auditada Blockchain</p>
        </section>

        {/* PRODUTOS E PORTAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
           {/* CARD PRODUTOS */}
           <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl text-yellow-500 mb-4 font-black uppercase italic font-elite">Modular Bet Solutions</h3>
                <p className="text-white font-bold text-sm mb-6 leading-relaxed">Nossos algoritmos suportam múltiplas modalidades de quota fixa com liquidação automática.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-cyan-400 font-black text-[10px] uppercase mb-1">INTER-BET</p>
                    <p className="text-[9px] text-white font-medium">Ganhos de 1 a 5 pts</p>
                 </div>
                 <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-cyan-400 font-black text-[10px] uppercase mb-1">QUINA-BET</p>
                    <p className="text-[9px] text-white font-medium">Lógica Clássica</p>
                 </div>
              </div>
           </div>

           {/* PORTAL DE ACESSO E CRÉDITO */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a]/95 border border-white/10 p-6 rounded-[2.5rem] shadow-xl">
                 <h3 className="text-[10px] text-yellow-500 mb-6 uppercase font-black font-elite">01. Identidade</h3>
                 <div className="space-y-3">
                    <input value={user.email} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-white font-bold" readOnly />
                    <button className="w-full bg-cyan-700/50 p-4 rounded-xl font-black text-[10px] uppercase text-cyan-200">Matrix Ativa</button>
                 </div>
              </div>

              <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-6 rounded-[2.5rem] flex flex-col items-center justify-center">
                 <h3 className="text-[10px] text-cyan-400 mb-4 uppercase font-black font-elite">02. Crédito (R$ 10)</h3>
                 <div className="bg-white p-3 rounded-2xl mb-4 shadow-inner flex items-center justify-center min-h-[110px]">
                   {!qrCode ? (
                      <div className="text-slate-300 text-[9px] font-black uppercase animate-pulse">Aguardando...</div>
                   ) : <QRCodeSVG value={qrCode} size={110} includeMargin={true} level="H" />}
                 </div>
                 <button onClick={handleGerarPix} disabled={loading || matriz.length === 0} className="w-full bg-slate-800 p-3 rounded-xl text-white font-black text-[9px] uppercase hover:bg-slate-700 transition-all flex justify-center items-center">
                    {loading ? <Loader2 className="animate-spin" size={14}/> : "GERAR PIX"}
                 </button>
              </div>
           </div>
        </div>

        {/* MALHA MATRIX 5X5 */}
        <div className="bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3.5rem] shadow-2xl mb-16 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={200}/></div>
           <h2 className="text-yellow-500 font-black text-xs md:text-sm uppercase mb-10 tracking-[0.4em] text-center italic font-elite">Malha de Prognósticos Matrix 5x5</h2>
           
           <div className="bg-black/90 border border-slate-800 rounded-[2.5rem] p-4 md:p-8 mb-10 shadow-inner">
              <div className="flex flex-col gap-3">
                {[0,1,2,3,4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right w-16 italic">{i+1}º PRÊMIO</span>
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/20 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-white shadow-sm">
                          {matriz[i] ? (matriz[i] as any)[j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 transition-all">Trocar Coordenadas</button>
              <button onClick={handleConfirmar} disabled={loading || matriz.length === 0} className="flex-1 bg-[#ea580c] hover:bg-orange-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all flex justify-center items-center gap-2">
                 Confirmar Certificado
              </button>
           </div>
        </div>

        {/* AFILIADOS E COMPLIANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* MEU LUCRO / AFILIADO */}
           <div className="lg:col-span-1 bg-[#0f172a] border border-amber-500/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase italic">REVENUE SHARE</div>
              <h3 className="text-[11px] text-amber-500 mb-6 font-black uppercase tracking-widest font-elite">💰 Meu Lucro</h3>
              
              <div className="mb-6 p-4 bg-black/40 rounded-2xl border border-white/5">
                <p className="text-[8px] text-white uppercase font-black mb-2 tracking-widest text-center">Seu Link de Licenciado</p>
                <div className="flex gap-2">
                  <input readOnly value={`https://www.bet-grupo25.com.br/register?ref=${user.id}`} className="bg-slate-950 border border-white/10 p-3 rounded-xl text-[8px] flex-1 text-cyan-400 font-mono outline-none" />
                  <button 
                    onClick={() => { navigator.clipboard.writeText(`https://www.bet-grupo25.com.br/register?ref=${user.id}`); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                    className="bg-amber-600 p-2 rounded-xl text-[8px] font-black uppercase"
                  >
                    {copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>}
                  </button>
                </div>
              </div>

              <p className="text-[8px] text-white uppercase font-bold mb-1 opacity-60">Saldo Disponível</p>
              <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
              <button onClick={()=>alert("Pedido de saque registrado")} className="w-full bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-2xl text-[10px] font-black uppercase mt-6 transition-all">Sacar via Pix</button>
           </div>

           {/* TRANSPARÊNCIA LEGAL */}
           <div className="lg:col-span-2 bg-[#0d1117] border border-white/10 p-8 rounded-[3rem] shadow-2xl">
              <h3 className="text-cyan-400 mb-8 uppercase font-black text-[10px] tracking-widest italic font-elite text-center flex items-center justify-center gap-3">
                <BarChart3 size={16}/> Distribuição de Arrecadação (Contrato Smart)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[9px] font-black text-white uppercase">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><span>Prêmio Bruto</span><br/><span className="text-lg text-cyan-400">43,35%</span></div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><span>Seguridade</span><br/><span className="text-lg text-cyan-400">17,32%</span></div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><span>Segurança</span><br/><span className="text-lg text-cyan-400">9,26%</span></div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><span>Educação</span><br/><span className="text-lg text-cyan-400">9,26%</span></div>
              </div>
              <p className="mt-8 text-[9px] text-white font-bold opacity-40 text-center uppercase tracking-widest">Protocolo de Auditoria v3.5 | Neon DB Engine</p>
           </div>
        </div>

        <footer className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em] font-elite">
           © 2026 G25 TECH SOLUTIONS | BY SFCHAGASFILHO
        </footer>
      </main>

      <div onClick={()=>router.push('/como-funciona')} className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-110 transition-all z-[300] text-white animate-bounce">
         <HelpCircle size={28} />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}