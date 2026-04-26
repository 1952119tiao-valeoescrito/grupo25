import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2, RefreshCw, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MatrixDashboard() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '', email: '', pixKey: '' });
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * coords.length)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.18)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * coords.length)];
        // FIX: Correção da string de cor para evitar erro de unicode escape
        const opacity = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + opacity + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  useEffect(() => {
    const timerInt = setInterval(() => {
      const now = new Date();
      const nextSat = new Date();
      nextSat.setDate(now.getDate() + (6 - now.getDay()));
      nextSat.setHours(20, 0, 0, 0);
      if (now > nextSat) nextSat.setDate(nextSat.getDate() + 7);
      const diff = nextSat.getTime() - now.getTime();
      const f = (n) => Math.floor(Math.max(0, n)).toString().padStart(2, '0');
      setTimer(f(diff/86400000) + ":" + f((diff/3600000)%24) + ":" + f((diff/60000)%60) + ":" + f((diff/1000)%60));
    }, 1000);
    return () => clearInterval(timerInt);
  }, []);

  const gerarMalha = () => {
    const novaMatriz = [];
    const pSet = new Set();
    while(pSet.size < 25) { 
      const x = Math.floor(Math.random()*25)+1;
      const y = Math.floor(Math.random()*25)+1;
      pSet.add(x + '/' + y);
    }
    const array = Array.from(pSet);
    for(let i=0; i<5; i++) novaMatriz.push(array.slice(i*5, (i+1)*5));
    setMatriz(novaMatriz);
  };

  useEffect(() => { gerarMalha(); }, []);

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
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <h1 className="text-xl font-black tracking-tighter italic uppercase">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10">
        <section className="mb-20">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div className="text-6xl md:text-9xl font-black tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] mb-4">{timer}</div>
        </section>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[4rem] shadow-2xl mb-12">
          {!qrCode ? (
            <div className="max-w-xl mx-auto">
              <h2 className="text-yellow-500 font-bold text-xs uppercase mb-10 tracking-widest text-center">Sua Malha de Coordenadas Matrix 5x5</h2>
              <div className="grid grid-cols-6 gap-2 md:gap-4 mb-12 items-center">
                {matriz.map((linha, i) => (
                  <div key={i} className="contents">
                    <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                    {linha.map((celula, j) => (
                      <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400">
                        {celula}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <input placeholder="Seu CPF" className="w-full p-5 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, cpf: e.target.value})} />
                <input placeholder="Chave PIX Prêmio" className="w-full p-5 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, pixKey: e.target.value})} />
                <input placeholder="Seu E-mail" className="md:col-span-2 w-full p-5 rounded-2xl bg-slate-950 border-slate-800" onChange={(e)=>setForm({...form, email: e.target.value})} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-5 rounded-2xl font-black text-[10px] uppercase">Trocar Coordenadas</button>
                <button onClick={handlePagamento} disabled={loading} className="flex-1 bg-cyan-600 p-5 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" /> : "Confirmar Certificado"} <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10">
               <div className="bg-white p-8 rounded-[3rem] mb-8">
                  <QRCodeSVG value={qrCode} size={250} />
               </div>
               <button onClick={()=>setQrCode("")} className="text-white/50 underline text-xs font-bold uppercase">Voltar</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Arquivo page.tsx reparado e salvo em UTF-8 puro!");