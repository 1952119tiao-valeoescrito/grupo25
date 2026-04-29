import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]); // COMEÇA VAZIA
  const [timer, setTimer] = useState("05:07:26:56");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // 1. Garantia de Carregamento (Mata o erro da Vercel)
  useEffect(() => {
    setMounted(true);
    const logged = localStorage.getItem('user');
    if (logged) {
      setUser(JSON.parse(logged));
    } else {
      router.push('/');
    }
  }, [router]);

  // 2. Motor Matrix (Z-Index 0)
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let i = 0; i < 100; i++) {
        gridAnim.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.25)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(s => {
        s.c++;
        if(Math.random() > 0.985) s.text = coords[Math.floor(Math.random() * 625)];
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')';
        ctx.fillText(s.text, s.x, s.y);
      });
      requestAnimationFrame(draw);
    }; draw();
  }, [mounted]);

  // 3. Temporizador Sábado 20h
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  const handleConfirmar = async () => {
    if (loading || matriz.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ id: data.ticketId, coords: matriz.flat(), qrCode: data.qrCode, usuario: user.nome, data: new Date().toLocaleString() }));
        
        // --- REGRA: MATRIX RETORNA VAZIA APÓS APOSTA ---
        setMatriz([]); 
        
        router.push('/bilhete/' + data.ticketId);
      } else {
        alert("Erro no Pix: Verifique se o banco de dados tem a Rodada #1.");
      }
    } catch (e) { alert("Erro de rede."); }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter" style={{fontFamily: 'Orbitron'}}>MIMOSINHA<span className="text-cyan-400">G25</span></h1>
          <nav className="flex items-center gap-4">
             <span className="text-[10px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase italic">Olá, {user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/');}} className="text-white bg-slate-800 p-2 rounded-lg hover:bg-red-900/50 transition-all"><LogOut size={14}/></button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 text-center relative z-10">
        
        {/* TIMER */}
        <section className="mb-10 text-center">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic mb-2">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10 items-start text-left mb-16">
          
          {/* MALHA MATRIX */}
          <div className="lg:col-span-2 bg-[#0f172a]/95 border border-cyan-500/30 p-8 md:p-12 rounded-[3rem] shadow-2xl backdrop-blur-xl">
             <h2 className="text-yellow-500 font-black text-xs uppercase mb-8 tracking-[0.2em]" style={{fontFamily: 'Orbitron'}}>Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-4 md:p-10 mb-10 shadow-inner">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-[#020617] border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{fontFamily: 'Orbitron'}}>
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] transition-all border border-white/5">Gerar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading || matriz.length === 0} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg flex justify-center items-center gap-2 disabled:opacity-30">
                  {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                </button>
             </div>
             <p className="text-[10px] text-white/30 text-center mt-8 font-bold uppercase tracking-widest italic animate-pulse">
                {matriz.length === 0 ? 'AGUARDANDO GERAÇÃO...' : 'MALHA ATIVA'}
             </p>
          </div>

          {/* COLUNA LATERAL */}
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-amber-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">SÓCIO AFILIADO</div>
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest italic" style={{fontFamily: 'Orbitron'}}>💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
               <button className="w-full bg-[#ea580c] hover:bg-orange-500 text-white p-4 rounded-xl text-[10px] font-black uppercase mt-6 shadow-lg transition-all">SACAR VIA PIX</button>
            </div>
            
            <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[10px] tracking-widest italic" style={{fontFamily: 'Orbitron'}}>⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* SLOGAN COM TEXTO CORRIGIDO */}
        <section className="my-20">
           <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
        </section>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Dashboard FINALIZADO, BLINDADO E NÍTIDO!");