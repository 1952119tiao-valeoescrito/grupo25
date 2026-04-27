import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, Wallet, LogOut, Scale, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [clickCount, setClickCount] = useState(0); // Para a porta secreta

  // 1. MOTOR MATRIX (625 COORDENADAS)
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

  // 2. CRONÔMETRO E LOGIN
  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }
    
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

  const handlePagamento = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            cpf: user.email.split('@')[0], // Placeholder se CPF não estiver no user
            email: user.email, 
            prognosticos: matriz.flat(), 
            rodadaId: 1 
        })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
      else alert("Erro ao gerar PIX");
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  // 3. PORTA SECRETA DO GENERAL (5 Cliques no Footer)
  const portalDoGeneral = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      router.push('/admin/central');
    }
    setTimeout(() => setClickCount(0), 5000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />

      {/* TICKER SUPERIOR */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-50 relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[10px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black tracking-tighter italic uppercase">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-elite">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400 hover:text-white transition-all">PAINEL ADMIN</button>
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">MEUS REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Olá, {user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40 transition-all text-white">🚪</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        
        {/* TIMER NÍTIDO */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-8xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic font-elite">Sábado às 20:00hrs</p>
        </section>

        {/* PAINEL CENTRAL (BILHETE MATRIX) */}
        <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-8 md:p-16 rounded-[4rem] shadow-2xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-yellow-500 font-black text-xs uppercase mb-10 tracking-[0.2em] font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
          
          <div className="bg-black/80 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-10">
            <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
              {matriz.map((linha, i) => (
                <div key={i} className="contents">
                  <span className="text-[10px] font-black text-yellow-500 text-right pr-2 font-elite">{i+1}º</span>
                  {linha.map((c, j) => (
                    <div key={j} className="aspect-square bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-elite">
                      {c}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {!qrCode ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all font-elite">Trocar Coordenadas</button>
              <button onClick={handlePagamento} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-5 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all font-elite flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Confirmar Certificado"} <ChevronRight size={16}/>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 bg-white rounded-[3rem] p-10">
               <QRCodeSVG value={qrCode} size={200} />
               <p className="text-black font-black uppercase text-xs mt-6">Escaneie o Pix para Validar</p>
               <button onClick={()=>setQrCode("")} className="mt-6 text-slate-400 underline text-[10px] font-bold uppercase">Voltar</button>
            </div>
          )}
        </div>

        {/* LUCRO E INDICAÇÃO */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-[#0f172a]/95 border border-amber-500/30 p-8 rounded-[2rem] text-left relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">Sócio Afiliado</div>
             <h3 style={{fontFamily:'Orbitron'}} className="text-[11px] text-amber-500 mb-6 uppercase font-black">💰 Meu Lucro de Indicação</h3>
             <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
                  <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white">R$ 0,00</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-lg transition-all">SACAR VIA PIX</button>
             </div>
             <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                <p className="text-[9px] text-slate-500 uppercase mb-2 font-bold italic">Link de Convite</p>
                <input readOnly value={"https://www.bet-grupo25.com.br/acesso?ref=" + (user?.id || '')} className="w-full bg-transparent text-cyan-400 text-[10px] font-mono outline-none" />
             </div>
          </div>
        </div>

        {/* PRODUTOS DO ECOSSISTEMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20 max-w-[1000px] mx-auto">
          <a href="https://blockchain-betbrasil.io/pt/inter-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
             <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase font-elite">INTER-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Acesse o site oficial</p>
          </a>
          <a href="https://blockchain-betbrasil.io/pt/quina-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
             <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase font-elite">QUINA-BET</h3>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Acesse o site oficial</p>
          </a>
        </div>

        {/* CONTATO */}
        <div className="bg-[#0f172a]/70 border border-cyan-500/20 p-12 rounded-[4rem] mb-20 max-w-4xl mx-auto">
           <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-cyan-400 mb-10 tracking-[0.3em] uppercase italic">Entre em Contato</h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div><p className="text-[11px] text-slate-500 uppercase font-black mb-2">E-mail Suporte</p><p className="text-sm font-bold">suporte@blockchain-betbrasil.io</p></div>
              <div><p className="text-[11px] text-slate-500 uppercase font-black mb-2">WhatsApp Oficial</p><p className="text-sm font-bold">+55 (21) 99352-7957</p></div>
           </div>
        </div>

        {/* FOOTER COM PORTA SECRETA */}
        <footer className="py-20 border-t border-white/5 text-center">
           <p onClick={portalDoGeneral} className="text-[11px] text-white uppercase tracking-[0.5em] font-black cursor-pointer hover:text-yellow-500 transition-all antialiased select-none">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
      </main>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', code, { encoding: 'utf8' });
console.log("✅ IMPÉRIO MATRIX ATIVADO! Botões e Porta Secreta prontos.");