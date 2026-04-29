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
  const [matriz, setMatriz] = useState([]); // REGRA 1: COMEÇA VAZIA
  const [timer, setTimer] = useState("05:07:26:56");
  const [qrCode, setQrCode] = useState("");
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
    if(canvas) {
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
    }
    return () => clearInterval(interval);
  }, [router]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
    setQrCode(""); // Reseta o Pix anterior se houver
  };

  // 01. BOTÃO GERAR PIX
  const handleGerarPix = async () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) {
        setQrCode(data.qrCode);
        // Guarda os dados para o certificado
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ 
          id: data.ticketId, 
          coords: matriz.flat(), 
          qrCode: data.qrCode, 
          usuario: user.nome, 
          data: new Date().toLocaleString() 
        }));
      } else { alert("Erro ao gerar Pix: " + data.error); }
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  // 02. BOTÃO CONFERIR CERTIFICADO (LARANJA)
  const handleVerCertificado = () => {
    const cert = localStorage.getItem('CERTIFICADO_G25');
    if(!cert) return alert("Gere o Pix primeiro para validar o bilhete!");
    
    // REGRA 2: MATRIX RETORNA VAZIA APÓS APOSTA
    setMatriz([]); 
    
    const parsed = JSON.parse(cert);
    router.push('/bilhete/' + parsed.id);
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
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); router.push('/');}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase italic">Acesso Restrito</span>
             <p className="text-[10px] font-bold text-yellow-500 uppercase border border-yellow-500/20 px-4 py-1.5 rounded-full bg-yellow-500/10">Olá, {user.nome.split(' ')[0]}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        <section className="mb-10 text-center">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic mb-2 text-center">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px] text-center">Nossa produção 100% blockchain</p>
        </section>

        {/* 1. CARDS PRODUTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto px-4">
          <div className="bg-[#0f172a]/95 border border-cyan-500/20 p-8 rounded-[3rem] text-center shadow-xl">
             <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase italic font-elite" style={{fontFamily:'Orbitron'}}>INTER-BET</h3>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/inter-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase mt-4">Acessar Site</button>
          </div>
          <div className="bg-[#0f172a]/95 border border-cyan-500/20 p-8 rounded-[3rem] text-center shadow-xl">
             <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase italic font-elite" style={{fontFamily:'Orbitron'}}>QUINA-BET</h3>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/quina-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase mt-4">Acessar Site</button>
          </div>
        </div>

        {/* 2. MEIO: LOGIN E PIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto items-stretch">
            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3rem] shadow-2xl text-left backdrop-blur-md">
               <h3 className="text-[10px] text-yellow-500 mb-8 uppercase font-black font-elite">01. PORTAL DE ACESSO</h3>
               <div className="space-y-4">
                  <input placeholder="E-mail" value={user.email} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-sm" readOnly />
                  <input type="password" placeholder="Senha" value="********" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-sm" readOnly />
                  <button onClick={()=>alert("Acesso Matrix Confirmado")} className="w-full bg-cyan-700 p-5 rounded-2xl font-black text-xs uppercase shadow-lg">ACESSAR MATRIX</button>
               </div>
            </div>

            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
               <h3 className="text-[11px] text-cyan-400 mb-8 uppercase font-black font-elite">02. CRÉDITO (R$ 10)</h3>
               <div className="bg-white p-4 rounded-3xl mb-8 shadow-inner flex items-center justify-center min-h-[128px]">
                 {!qrCode ? (
                    <div className="text-slate-300 text-[10px] font-bold uppercase animate-pulse">Aguardando...</div>
                 ) : <QRCodeSVG value={qrCode} size={128} />}
               </div>
               <button onClick={handleGerarPix} disabled={loading || matriz.length === 0} className="w-full bg-slate-800 p-4 rounded-xl text-white font-black text-[10px] uppercase border border-white/5 shadow-lg">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={14}/> : "GERAR PIX"}
               </button>
            </div>
        </div>

        {/* 3. SLOGAN */}
        <section className="mb-20">
           <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white font-elite">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
        </section>

        {/* 4. BASE: MALHA E COLUNA DIREITA */}
        <div className="grid lg:grid-cols-3 gap-10 items-start text-left">
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-12 rounded-[3.5rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-xs uppercase mb-8 tracking-widest text-center italic font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/90 border border-slate-800 rounded-[2.5rem] p-6 mb-10 shadow-inner">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-cyan-500/50 text-right pr-2">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-[#020617] border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 border border-white/5 py-4 rounded-2xl font-black uppercase text-[10px] transition-all hover:bg-slate-700">Trocar Coordenadas</button>
                <button onClick={handleVerCertificado} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg transition-all">Confirmar Certificado</button>
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl text-left">
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest font-elite italic">💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p className="text-3xl text-white font-black italic tracking-tighter" style={{fontFamily:'Orbitron'}}>R$ 0,00</p>
            </div>
            <div className="bg-[#0f172a] border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl text-center">
               <h3 className="text-[10px] text-emerald-400 mb-4 uppercase tracking-widest font-black font-elite">🏆 Ranking Semanal</h3>
               <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando...</p>
            </div>
            <div className="bg-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[10px] tracking-widest font-elite italic text-center">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[9px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Segurança (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center relative z-[200]">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] italic antialiased">
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
console.log("✅ Dashboard FINALIZADO com botões ativos e Matrix que reseta!");