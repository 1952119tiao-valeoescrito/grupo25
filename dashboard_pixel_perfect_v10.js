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
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

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
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.1;
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
  useEffect(() => { if(mounted) gerarMalha(); }, [mounted]);

  // FUNÇÃO DE ACESSO AO PIX (CORRIGIDA)
  const handleConfirmarCertificado = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: user.email, 
            cpf: user.pixKey, // Envia a chave Pix (CPF) cadastrada
            prognosticos: matriz.flat(), 
            rodadaId: 1 
        })
      });
      const data = await res.json();
      if(data.qrCode) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({
          id: data.ticketId,
          coords: matriz.flat(),
          qrCode: data.qrCode,
          usuario: user.nome,
          data: new Date().toLocaleString('pt-BR')
        }));
        router.push('/bilhete/' + data.ticketId);
      } else {
        alert("Erro no Mercado Pago: " + (data.error || "Token ou CPF inválido"));
      }
    } catch (e) {
      alert("Erro de conexão com a Matrix");
    }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest font-elite">
           🚀 BEM-VINDO À MIMOSINHA BRASIL: SORTEIOS GRATUITOS NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center font-elite">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter" style={{fontFamily: 'Orbitron'}}>MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase">Olá, {user.nome.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        
        {/* TIMER */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4 text-center">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-9xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter italic text-center">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic text-center">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Nossa produção 100% blockchain</p>
        </section>

        {/* --- GRID LAYOUT (MATRIX ESQUERDA | INFO DIREITA) --- */}
        <div className="grid lg:grid-cols-3 gap-8 items-start text-left mb-16">
          
          {/* MALHA MATRIX */}
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest text-center italic" style={{fontFamily: 'Orbitron'}}>Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1 italic">{i+1}º</span>
                      {matriz[i] && matriz[i].map((c, j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{fontFamily: 'Orbitron'}}>
                          {c}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] transition-all border border-white/5">Trocar Coordenadas</button>
                <button onClick={handleConfirmarCertificado} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg flex justify-center items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                </button>
             </div>
             <p className="text-[10px] text-white/30 text-center mt-6 uppercase font-bold italic tracking-widest italic animate-pulse">IDENTIFICADO: {user.nome}</p>
          </div>

          {/* COLUNA DIREITA */}
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-amber-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">SÓCIO AFILIADO</div>
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest italic" style={{fontFamily: 'Orbitron'}}>💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
               <button className="w-full bg-[#ea580c] hover:bg-orange-500 text-white p-4 rounded-xl text-[10px] font-black uppercase mt-6 shadow-lg transition-all">SACAR VIA PIX</button>
            </div>

            <div className="bg-[#0f172a] border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl text-center">
               <h3 className="text-[10px] text-emerald-400 mb-4 uppercase tracking-widest font-black font-elite flex items-center justify-center gap-2">🏆 Ranking Semanal</h3>
               <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando competidores...</p>
            </div>

            <div className="bg-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[10px] tracking-widest italic font-elite text-center">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[9px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* RODAPÉ E SLOGAN */}
        <section className="mb-20">
           <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white font-elite">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
        </section>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] italic cursor-pointer">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ DASHBOARD 100% FIEL E FUNCIONAL RECONSTRUÍDO!");