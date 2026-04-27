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
  const [matriz, setMatriz] = useState([]); // Começa vazio
  const [timer, setTimer] = useState("05:07:26:56");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setMounted(true);
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

    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
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
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  const handleConfirmar = async () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode && data.ticketId) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ id: data.ticketId, coords: matriz.flat(), qrCode: data.qrCode, usuario: user.nome, data: new Date().toLocaleString() }));
        
        // --- O SEGREDO DA LIMPEZA ---
        setMatriz([]); // Limpa a matriz na tela antes de sair
        
        router.push('/bilhete/' + data.ticketId);
      }
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-60" />

      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest font-elite">
           🚀 BEM-VINDO À MIMOSINHA BRASIL: SORTEIOS GRATUITOS NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center font-elite">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase">Olá, {user.nome.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        
        <section className="mb-10">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic text-center">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic text-center">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        <div className="max-w-4xl mx-auto bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl mb-12">
            <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest text-center italic font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
            <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1 italic font-elite">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 font-elite transition-all hover:bg-slate-700">Gerar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading || matriz.length === 0} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg font-elite transition-all hover:bg-orange-500 flex justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                   {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                </button>
            </div>
            <p className="text-[10px] text-white/30 text-center mt-6 uppercase font-bold italic tracking-widest italic">
                {matriz.length === 0 ? "⚠️ Clique em Gerar para iniciar" : "Identificado: " + user.nome}
            </p>
        </div>

        {/* ... restante do layout (Lucro, Ranking, Transparência) ... */}
        <div className="grid lg:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            <div className="bg-[#0f172a] border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase italic">SÓCIO AFILIADO</div>
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest italic font-elite">💰 Meu Lucro</h3>
               <p className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
            </div>
            <div className="bg-[#0f172a] border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-[10px] text-emerald-400 mb-4 uppercase tracking-widest font-black font-elite flex items-center justify-center gap-2">🏆 Ranking Semanal</h3>
               <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter text-center">Sincronizando...</p>
            </div>
            <div className="bg-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[9px] tracking-widest italic font-elite text-center">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[9px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio</span><span className="text-white">43,35%</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social</span><span className="text-white">17,32%</span></div>
                  <div className="flex justify-between"><span>Educação</span><span className="text-white">9,26%</span></div>
               </div>
            </div>
        </div>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center relative z-[200]">
           <p onClick={()=>{setClickCount(c=>c+1); if(clickCount>=4) router.push('/admin/central')}} className="text-[10px] font-black uppercase tracking-[0.5em] italic cursor-pointer select-none antialiased">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code);
console.log("✅ Lógica de 'Mesa Limpa' ativada! Matrix agora reseta após gerar o bilhete.");