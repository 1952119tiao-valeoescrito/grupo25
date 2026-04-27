"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:20:56:04");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

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
    }; draw();
  }, []);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (logged) setUser(JSON.parse(logged));
    else router.push('/');
    const gerarMalha = () => {
      const pSet = new Set();
      while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
      const array = Array.from(pSet);
      const linhas = []; for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
      setMatriz(linhas);
    };
    gerarMalha();
  }, [router]);

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
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      {/* 1. TICKER SUPERIOR (PRINT 2) */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-[100] relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[12px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO PARA ENTENDER COMO FUNCIONA NA PRÁTICA! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO DA PREMIAÇÃO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      {/* 2. HEADER (PRINT 2) */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/admin/central')} className="text-cyan-400">PAINEL ADMIN</button>
             <button onClick={()=>router.push('/meus-bilhetes')}>MEUS REGISTROS</button>
             <button onClick={()=>router.push('/resultados')}>RESULTADOS</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">ACESSO RESTRITO</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10"><LogOut size={16}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        
        {/* 3. TIMER GIGANTE (PRINT 2) */}
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-9xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter italic">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        {/* 4. PAINEL CENTRAL MATRIX (PRINT 2) */}
        <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-8 md:p-16 rounded-[4rem] shadow-2xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-yellow-500 font-bold text-xs uppercase mb-10 tracking-widest">Sua Malha de Coordenadas Matrix 5x5</h2>
          <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-4 md:p-10 mb-10">
            <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="contents">
                  <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                  {[0,1,2,3,4].map((j) => (
                    <div key={j} className="aspect-square bg-[#020617] border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400">
                      {matriz[i] ? matriz[i][j] : '--/--'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-white mb-8 font-bold italic uppercase tracking-widest animate-pulse">AGUARDANDO LOGIN...</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex-1 bg-slate-800/50 text-slate-500 border border-white/5 py-5 px-10 rounded-2xl font-black uppercase text-[10px]">Gerar Coordenadas</button>
            <button className="flex-1 bg-slate-800/50 text-slate-500 border border-white/5 py-5 px-10 rounded-2xl font-black uppercase text-[10px]">Confirmar Certificado</button>
          </div>
        </div>

        {/* 5. RANKING (PRINT 2 BOTTOM) */}
        <div className="max-w-md mx-auto bg-[#0f172a]/95 border border-emerald-500/30 p-8 rounded-[2.5rem] shadow-2xl mb-20">
            <h3 className="text-xs text-emerald-400 mb-6 uppercase tracking-widest font-black flex items-center justify-center gap-2">🏆 Ranking Semanal Mimosinha</h3>
            <p className="text-slate-500 italic text-[11px] uppercase tracking-tighter">Sincronizando competidores...</p>
            <p className="mt-6 text-[9px] text-slate-400 uppercase tracking-widest font-bold">O TOP 10 GANHA 1 BILHETE REAL!</p>
        </div>

        {/* 6. MEU LUCRO + CRÉDITO (PRINT 3) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-[#0f172a]/95 border border-amber-500/30 p-10 rounded-[2.5rem] text-left relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">Sócio Afiliado</div>
               <h3 className="text-[11px] text-amber-500 mb-6 uppercase font-black tracking-widest italic">💰 Meu Lucro de Indicação</h3>
               <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white">R$ 0,00</p>
               <button className="w-full bg-[#ea580c] hover:bg-orange-500 text-white p-4 rounded-xl text-[10px] font-black uppercase mt-6 transition-all shadow-lg">SACAR VIA PIX</button>
            </div>

            <div className="bg-[#0f172a]/95 border border-cyan-500/20 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center">
               <h3 className="text-[11px] text-cyan-400 mb-6 uppercase font-black">02. CRÉDITO (R$ 10)</h3>
               <div className="bg-white p-4 rounded-3xl mb-6">
                 {!qrCode ? <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-xl" /> : <QRCodeSVG value={qrCode} size={128} />}
               </div>
               <button onClick={handleConfirmar} disabled={loading} className="w-full bg-slate-800 p-4 rounded-xl text-white font-black text-[10px] uppercase">
                 {loading ? "GERANDO..." : "GERAR PIX"}
               </button>
            </div>
        </div>

        {/* 7. TRANSPARÊNCIA LEGAL (ADICIONADO CONFORME LEI) */}
        <div className="max-w-4xl mx-auto bg-[#0f172a]/95 border border-white/10 p-8 rounded-[2.5rem] text-left shadow-2xl mb-20">
            <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[10px] tracking-widest italic">⚖️ Transparência (Lei 13.756)</h3>
            <div className="grid md:grid-cols-2 gap-8 text-[10px] font-bold text-slate-400 uppercase font-mono">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio Bruto</span><span className="text-white">43,35%</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Seguridade Social</span><span className="text-white">17,32%</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Segurança (FNSP)</span><span className="text-white">9,26%</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Educação (FNDE)</span><span className="text-white">9,26%</span></div>
                </div>
            </div>
        </div>

        {/* 8. PRODUTOS E SLOGAN (PRINT 4) */}
        <section className="mb-20">
           <h2 className="text-lg md:text-3xl font-black uppercase tracking-tighter mb-12">A ÚNICA MATRIZ ONDE <span className="text-yellow-500">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.</h2>
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#0f172a] border border-cyan-500/20 p-10 rounded-[3rem] text-center">
                 <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase">INTER-BET</h3>
                 <p className="text-[9px] text-slate-400 mb-8 font-bold">GANHA COM 5, 4, 3, 2 E ATÉ COM 1 PONTO APENAS.</p>
                 <button className="w-full bg-cyan-500 text-black py-4 rounded-[2rem] font-black text-[10px] uppercase">ACESSAR SITE</button>
              </div>
              <div className="bg-[#0f172a] border border-cyan-500/20 p-10 rounded-[3rem] text-center">
                 <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase">QUINA-BET</h3>
                 <p className="text-[9px] text-slate-400 mb-8 font-bold">LOTERIA CLÁSSICA DE 5 PROGNÓSTICOS.</p>
                 <button className="w-full bg-cyan-500 text-black py-4 rounded-[2rem] font-black text-[10px] uppercase">ACESSAR SITE</button>
              </div>
           </div>
        </section>

        {/* 9. CONTATO (PRINT 4 BOTTOM) */}
        <div className="bg-[#0f172a]/70 border border-cyan-500/20 p-12 rounded-[4rem] mb-20 max-w-4xl mx-auto">
           <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-cyan-400 mb-10 tracking-[0.3em] uppercase italic">Entre em Contato</h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div><p className="text-[10px] text-slate-500 uppercase font-black mb-2">E-mail</p><p className="text-sm font-bold">suporte@blockchain-betbrasil.io</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-black mb-2">WhatsApp</p><p className="text-sm font-bold">+55 (21) 99352-7957</p></div>
           </div>
        </div>

        <footer className="py-20 border-t border-white/5 opacity-30 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">© 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE</p>
        </footer>
      </main>

      <div className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer text-white">
         <HelpCircle size={28} />
      </div>

      <style jsx global>{\
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      \}</style>
    </div>
  );
}
