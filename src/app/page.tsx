"use client"
import { useState, useEffect, useRef } from 'react';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2, RefreshCw, User, Wallet, Info, Menu, X, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MatrixDashboard() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '', email: '', pixKey: '' });
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const canvasRef = useRef(null);

  // 1. Efeito Matrix de Coordenadas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 60); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 40); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * coords.length)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * coords.length)];
        ctx.fillStyle = \gba(34, 211, 238, \)\;
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  // 2. Cronômetro até Sábado 20h
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const proximoSabado = new Date();
      proximoSabado.setDate(agora.getDate() + (6 - agora.getDay()));
      proximoSabado.setHours(20, 0, 0, 0);
      if (agora > proximoSabado) proximoSabado.setDate(proximoSabado.getDate() + 7);
      
      const diff = proximoSabado.getTime() - agora.getTime();
      const f = (n) => Math.floor(Math.max(0, n)).toString().padStart(2, '0');
      setTimer(\\:\:\:\\);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Gerador de Prognósticos 5x5 Automático
  const gerarMatriz = () => {
    const novaMatriz = [];
    for (let i = 0; i < 5; i++) {
      const linha = [];
      for (let j = 0; j < 5; j++) {
        linha.push(\\/\\);
      }
      novaMatriz.push(linha);
    }
    setMatriz(novaMatriz);
  };

  useEffect(() => { gerarMatriz(); }, []);

  const handlePagamento = async () => {
    if (!form.cpf || !form.email) return alert("Preencha CPF e E-mail!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if (data.qrCode) setQrCode(data.qrCode);
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-40 pointer-events-none" />
      
      {/* Ticker Superior */}
      <div className="w-full bg-cyan-950/50 border-b border-cyan-500/20 py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
          ?? BEM-VINDO À MATRIZ ELITE: SORTEIOS AUDITADOS VIA BLOCKCHAIN BASE MAINNET &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; ?? PAGAMENTO AUTOMÁTICO VIA PIX &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; ??? ACERTE 1 PONTO E JÁ GANHA
        </div>
      </div>

      <header className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 p-2 rounded-lg shadow-lg shadow-cyan-900/40"><Trophy size={24}/></div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Bet-Grupo25<span className="text-cyan-400 block text-[8px] tracking-[0.3em] not-italic">Matrix Edition</span></h1>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Resultados</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Ranking</a>
          <a href="#" className="text-yellow-500 underline">Acesso Admin</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 text-center">
        
        {/* Contador */}
        <section className="mb-16">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Todo Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10 items-start text-left">
          
          {/* Coluna 1: Aposta */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Sua Malha Matrix 5x5</h2>
              <button onClick={gerarMatriz} className="bg-cyan-500/10 text-cyan-400 p-3 rounded-2xl hover:bg-cyan-500/20 transition-all border border-cyan-500/20"><RefreshCw size={18}/></button>
            </div>

            {!qrCode ? (
              <div className="space-y-8">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {matriz.map((linha, i) => (
                    <div key={i} className="contents">
                       <span className="text-[10px] font-black text-yellow-600 text-right">{i+1}º</span>
                       {linha.map((celula, j) => (
                         <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
                           {celula}
                         </div>
                       ))}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-8 border-t border-slate-800">
                  <input placeholder="Seu CPF" className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, cpf: e.target.value})} />
                  <input placeholder="Chave PIX Prêmio" className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, pixKey: e.target.value})} />
                  <input placeholder="E-mail" className="md:col-span-2 w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, email: e.target.value})} />
                </div>

                <button onClick={handlePagamento} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 p-6 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-cyan-900/30 flex items-center justify-center gap-3 transform hover:scale-[1.01]">
                   {loading ? <Loader2 className="animate-spin" /> : "PAGAR R$ 10,00 VIA PIX"} <ChevronRight />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center p-10 bg-white rounded-[3rem]">
                <p className="text-black font-black mb-8 text-center uppercase italic">Escaneie para Validar sua Malha</p>
                <QRCodeSVG value={qrCode} size={250} />
                <button onClick={()=>setQrCode("")} className="mt-10 text-slate-400 text-xs font-bold underline uppercase">Voltar e Editar</button>
              </div>
            )}
          </div>

          {/* Coluna 2: Status e Transparência */}
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h3 className="font-black text-xs text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Wallet size={16}/> Seu Painel</h3>
              <div className="mb-6">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Saldo de Indicação</p>
                <p className="text-3xl font-black text-emerald-400 italic">R$ 0,00</p>
              </div>
              <button className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Sacar via PIX</button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h3 className="font-black text-xs text-yellow-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Scale size={16}/> Transparência Fiscal</h3>
              <div className="space-y-4 text-[10px] font-bold text-slate-400">
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>PRÊMIO (43,35%)</span><span className="text-white font-mono text-xs">R$ 0,00</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>SOCIAL (17,32%)</span><span className="text-white font-mono text-xs">R$ 0,00</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>SEGURANÇA (9,26%)</span><span className="text-white font-mono text-xs">R$ 0,00</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>EDUCAÇÃO (9,26%)</span><span className="text-white font-mono text-xs">R$ 0,00</span></div>
              </div>
              <p className="mt-6 text-[8px] text-slate-600 leading-tight italic">Operação Híbrida Web2/Web3 em conformidade com a Lei 13.756/2018. Sorteios gerados pela Chainlink VRF na Base Mainnet.</p>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2026 BET-GRUPO25 | MATRIX PROTOCOL | BY NEON DATABASE</p>
      </footer>

      <style jsx global>{\
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      \}</style>
    </div>
  );
}
