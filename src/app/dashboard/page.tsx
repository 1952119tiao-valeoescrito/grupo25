"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, Wallet, Zap, Mail, MessageSquare, LogOut, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // 1. Efeito Matrix Background Fervilhante (Idêntico ao original)
  useEffect(() => {
    const canvas = canvasRef.current;
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

  // 2. Lógica de Login e Dados
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
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      {/* Ticker Superior */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-[100] relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[11px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 🛡️ ACERTE 1 PONTO E JÁ TEM PIX NA CONTA
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center">
        <div className="max-w-[1200px] mx-auto w-full px-6 flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl tracking-tighter italic uppercase">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400 hover:text-white transition-all">Painel Admin</button>
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">Meus Registros</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">Resultados</button>
          </nav>
          <div className="flex items-center gap-4">
             <p className="hidden sm:block text-[10px] font-bold text-yellow-500 uppercase italic">
                {user ? user.nome.split(' ')[0] : 'Acesso Restrito'}
             </p>
             <button onClick={handleSair} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40 transition-all"><LogOut size={16}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        
        {/* Cronômetro */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-8xl mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        {/* MALHA MATRIX */}
        <div className="bg-[#0f172a]/85 backdrop-blur-xl border border-cyan-500/20 p-6 md:p-12 rounded-[3rem] shadow-2xl mb-12">
          <h2 className="text-yellow-500 font-bold text-xs uppercase mb-8 tracking-widest">Sua Malha de Coordenadas Matrix 5x5</h2>
          <div className="grid grid-cols-6 gap-2 md:gap-4 mb-10 items-center max-w-md mx-auto">
            {matriz.map((linha, i) => (
              <div key={i} className="contents">
                <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                {linha.map((c, j) => (
                  <div key={j} className="aspect-square bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    {c}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
             <button onClick={gerarMalha} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] transition-all shadow-lg shadow-cyan-900/40">Gerar Coordenadas</button>
             <button className="flex-1 bg-amber-500 hover:bg-yellow-400 text-slate-950 py-4 rounded-2xl font-black uppercase text-[10px] transition-all shadow-lg">Confirmar Certificado</button>
          </div>
        </div>

        {/* AFILIADOS (PRINT 2) */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-[#0f172a]/85 border border-amber-500/30 p-8 rounded-[2rem] text-left relative overflow-hidden backdrop-blur-xl shadow-2xl">
             <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">Sócio Afiliado</div>
             <h3 style={{fontFamily:'Orbitron'}} className="text-[11px] text-amber-500 mb-6 uppercase font-black">💰 Meu Lucro de Indicação</h3>
             <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
                  <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white drop-shadow-[0_0_10px_white]">R$ 0,00</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-xl transition-all">SACAR VIA PIX</button>
             </div>
             <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                <p className="text-[9px] text-slate-500 uppercase mb-2 font-bold italic">Meu Link de Convite</p>
                <div className="flex gap-2">
                   <input readOnly value={"https://www.bet-grupo25.com.br/acesso?ref=" + (user?.id || '')} className="w-full bg-transparent text-cyan-400 text-[10px] font-mono outline-none" />
                   <button onClick={() => alert("Link Copiado!")} className="text-white bg-slate-800 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase">Copiar</button>
                </div>
             </div>
             <p className="mt-4 text-[8px] text-slate-500 uppercase text-center italic">Você ganha R$ 0,30 de cada aposta real dos seus indicados!</p>
          </div>
        </div>

        {/* CARDS PRODUTOS (PRINT 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-[1000px] mx-auto">
          <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] backdrop-blur-xl flex flex-col justify-between">
             <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-yellow-500 mb-4 tracking-widest italic">INTER-BET</h3>
             <p className="text-xs uppercase font-bold text-slate-400 mb-8">Ganha com 5, 4, 3, 2 e até com 1 ponto apenas.</p>
             <a href="https://blockchain-betbrasil.io/pt/inter-bet" target="_blank" className="w-full py-4 bg-cyan-500 text-black rounded-[2rem] font-black uppercase text-xs hover:scale-105 transition-all">Acessar Site</a>
          </div>
          <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] backdrop-blur-xl flex flex-col justify-between">
             <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-cyan-400 mb-4 tracking-widest italic">QUINA-BET</h3>
             <p className="text-xs uppercase font-bold text-slate-400 mb-8">Loteria clássica de 5 prognósticos. Sorteios semanais.</p>
             <a href="https://blockchain-betbrasil.io/pt/quina-bet" target="_blank" className="w-full py-4 bg-cyan-500 text-black rounded-[2rem] font-black uppercase text-xs hover:scale-105 transition-all">Acessar Site</a>
          </div>
        </div>

        {/* CONTATO (PRINT 4) */}
        <div className="bg-[#0f172a]/70 border border-cyan-500/20 p-12 rounded-[4rem] mb-20">
           <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-cyan-400 mb-10 tracking-[0.3em] uppercase italic">Entre em Contato</h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div><p className="text-[10px] text-slate-500 uppercase font-black mb-2">E-mail</p><p className="text-sm font-bold">suporte@blockchain-betbrasil.io</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-black mb-2">WhatsApp</p><p className="text-sm font-bold">+55 (21) 99352-7957</p></div>
           </div>
        </div>

        {/* FOOTER SECRETO (PRINT 5) */}
        <footer className="py-16 border-t border-white/5 text-center">
           <p onClick={()=>router.push('/admin/central')} className="text-[10px] text-white uppercase tracking-[0.5em] font-black cursor-pointer hover:text-yellow-500 transition-all antialiased">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>

      <style jsx global>{\
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      \}</style>
    </div>
  );
}
