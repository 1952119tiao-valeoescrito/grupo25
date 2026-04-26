"use client"
import { useState, useEffect, useRef } from 'react';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2, RefreshCw, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MatrixDashboard() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '', email: '', pixKey: '' });
  const [matriz, setMatriz] = useState([]);
  const canvasRef = useRef(null);

  // Efeito Matrix Background
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
        const opacity = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + opacity + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) {
      pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    }
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };
  useEffect(() => gerarMalha(), []);

  const handlePagamento = async () => {
    if(!form.cpf || !form.email) return alert("Preencha seus dados!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans relative overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-30" />
      
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <h1 className="text-xl font-black italic uppercase text-white tracking-tighter">MIMOSINHA<span className="text-cyan-400 text-sm ml-1">G25</span></h1>
        <div className="flex gap-2 items-center bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
           <ShieldCheck size={14} className="text-green-500" />
           <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Auditado via Base Mainnet</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
             {!qrCode ? (
               <>
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-bold uppercase italic text-yellow-500">Sua Malha Matrix 5x5</h2>
                    <button onClick={gerarMalha} className="bg-cyan-500/10 text-cyan-400 p-3 rounded-2xl hover:bg-cyan-500/20 transition-all border border-cyan-500/20"><RefreshCw size={18}/></button>
                 </div>
                 <div className="grid grid-cols-6 gap-3 mb-12 items-center">
                    {matriz.map((linha, i) => (
                      <div key={i} className="contents">
                        <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                        {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">{c}</div>)}
                      </div>
                    ))}
                 </div>
                 <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <input placeholder="Seu CPF" className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800 outline-none focus:border-cyan-500 text-sm" onChange={(e)=>setForm({...form, cpf: e.target.value})} />
                    <input placeholder="Chave PIX Prêmio" className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800 outline-none focus:border-cyan-500 text-sm" onChange={(e)=>setForm({...form, pixKey: e.target.value})} />
                 </div>
                 <button onClick={handlePagamento} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3">
                   {loading ? <Loader2 className="animate-spin" /> : "CONFIRMAR CERTIFICADO"} <ChevronRight />
                 </button>
               </>
             ) : (
               <div className="flex flex-col items-center py-6">
                 <div className="bg-white p-8 rounded-[3rem] mb-6">
                    <QRCodeSVG value={qrCode} size={250} />
                 </div>
                 <p className="text-cyan-400 font-black uppercase text-sm mb-8">Escaneie o Pix para Validar</p>
                 <button onClick={()=>setQrCode("")} className="text-white/30 underline text-xs font-bold uppercase hover:text-white">Voltar e Editar</button>
               </div>
             )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
               <h3 className="text-cyan-400 font-black text-xs uppercase mb-6 flex items-center gap-2"><Wallet size={16}/> Sócio Afiliado</h3>
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Saldo de Indicação</p>
               <p className="text-3xl font-black text-emerald-400 italic tracking-tighter">R$ 0,00</p>
               <button className="w-full bg-slate-800 py-4 rounded-2xl text-[10px] font-black uppercase mt-6 tracking-widest hover:bg-slate-700 transition-all">Sacar via Pix</button>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
               <h3 className="text-yellow-500 font-black text-xs uppercase mb-6 flex items-center gap-2"><Scale size={16}/> Transparência Legal</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio Ganhadores (43,35%)</span><span className="text-white font-mono">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Seguridade Social (17,32%)</span><span className="text-white font-mono">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Segurança Pública (9,26%)</span><span className="text-white font-mono">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Educação (9,26%)</span><span className="text-white font-mono">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Custeio Operador (9,57%)</span><span className="text-white font-mono">R$ 0,00</span></div>
               </div>
               <p className="mt-6 text-[8px] text-slate-600 italic leading-relaxed">Operação conforme Lei 13.756/2018. Todos os repasses são auditados via Blockchain.</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-20 text-center mt-20 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">© 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE</p>
      </footer>
    </div>
  );
}
