import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando a Finalização da Bet-Grupo25...");

  // 1. DESTRAVAR O BANCO DE DADOS (CRIAR RODADA 1)
  try {
    await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, arrecadacaoTotal: 0, concluida: false }
    });
    console.log("✅ Banco Neon: Rodada #1 configurada!");
  } catch (e) {
    console.log("⚠️ Nota: Se o banco já estiver configurado, ignore este aviso.");
  }

  // 2. REESCREVER O DASHBOARD COM O LAYOUT EXATO E TEXTO CORRIGIDO
  const dashCode = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
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

  const handleGerarPix = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
      else alert("Erro: verifique seu token na Vercel.");
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  const handleConfirmarCertificado = () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    localStorage.setItem('CERTIFICADO_G25', JSON.stringify({
        coords: matriz.flat(),
        usuario: user.nome,
        data: new Date().toLocaleString()
    }));
    router.push('/bilhete/atual');
    setMatriz([]); // LIMPA A MATRIX PARA O PRÓXIMO
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest">
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
             <span className="text-[10px] font-bold text-yellow-500 uppercase border border-yellow-500/20 px-4 py-1.5 rounded-full bg-yellow-500/10">Olá, {user.nome.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        
        <section className="mb-10 text-center">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic mb-2">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        {/* 1. TOPO: CARDS INTER-BET E QUINA-BET */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto px-4">
          <div className="bg-[#0f172a]/95 border border-cyan-500/20 p-8 rounded-[3rem] text-center shadow-xl">
             <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase italic" style={{fontFamily: 'Orbitron'}}>INTER-BET</h3>
             <p className="text-[9px] text-white font-bold mb-6">GANHA COM ATÉ 1 PONTO</p>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/inter-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase">Acessar Site</button>
          </div>
          <div className="bg-[#0f172a]/95 border border-cyan-500/20 p-8 rounded-[3rem] text-center shadow-xl">
             <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase italic" style={{fontFamily: 'Orbitron'}}>QUINA-BET</h3>
             <p className="text-[9px] text-white font-bold mb-6">SORTEIOS SEMANAIS</p>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/quina-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase">Acessar Site</button>
          </div>
        </div>

        {/* 2. MEIO: PORTAL DE ACESSO E CRÉDITO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto items-stretch">
            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3rem] shadow-2xl text-left backdrop-blur-md">
               <h3 className="text-[10px] text-yellow-500 mb-8 uppercase font-black" style={{fontFamily: 'Orbitron'}}>01. PORTAL DE ACESSO</h3>
               <div className="space-y-4">
                  <input placeholder="E-mail" value={user.email} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-sm" readOnly />
                  <input type="password" placeholder="Senha" value="********" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-sm" readOnly />
                  <button onClick={()=>alert("Matrix Online")} className="w-full bg-cyan-700 p-5 rounded-2xl font-black text-xs uppercase shadow-lg">ACESSAR MATRIX</button>
               </div>
            </div>

            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
               <h3 className="text-[11px] text-cyan-400 mb-8 uppercase font-black" style={{fontFamily: 'Orbitron'}}>02. CRÉDITO (R$ 10)</h3>
               <div className="bg-white p-4 rounded-3xl mb-8 shadow-inner flex items-center justify-center">
                 {!qrCode ? <div className="w-32 h-32 bg-slate-100 flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div> : <QRCodeSVG value={qrCode} size={128} />}
               </div>
               <button onClick={handleGerarPix} className="w-full bg-slate-800 p-4 rounded-xl text-white font-black text-[10px] uppercase border border-white/5">Gerar Pix</button>
            </div>
        </div>

        {/* 3. SLOGAN CENTRAL (CORRIGIDO) */}
        <section className="mb-20">
           <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
        </section>

        {/* 4. MALHA E COLUNA DIREITA */}
        <div className="grid lg:grid-cols-3 gap-10 items-start text-left mb-20">
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-12 rounded-[3.5rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-xs uppercase mb-8 tracking-widest text-center" style={{fontFamily: 'Orbitron'}}>Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/90 border border-slate-800 rounded-[2.5rem] p-6 mb-10">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-cyan-500/50 text-right pr-2">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-[#020617] border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{fontFamily: 'Orbitron'}}>
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 border border-white/5 py-4 rounded-2xl font-black uppercase text-[10px]">Trocar Coordenadas</button>
                <button onClick={handleConfirmarCertificado} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                </button>
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl text-left">
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest font-elite">💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
            </div>
            <div className="bg-[#0f172a] border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl text-center">
               <h3 className="text-[10px] text-emerald-400 mb-6 uppercase font-black font-elite">🏆 Ranking Semanal</h3>
               <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando...</p>
            </div>
            <div className="bg-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[9px] tracking-widest font-elite text-center">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Segurança (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

  fs.writeFileSync('src/app/dashboard/page.tsx', dashCode, { encoding: 'utf8' });
  console.log("✅ Dashboard V100 instalado com Sucesso!");
  await prisma.$disconnect();
}

main();