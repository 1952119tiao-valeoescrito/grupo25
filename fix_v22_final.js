import fs from 'fs';

console.log("🚀 Iniciando reconstrução das telas com Regra de Horizontalidade...");

// 1. RECONSTRUIR DASHBOARD (Malha 5x5 com Rótulos 1º a 5º)
const dashCode = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Scale } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]); 
  const [timer, setTimer] = useState("05:01:52:40");
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
    if (loading || matriz.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat(), rodadaId: 1 })
      });
      const data = await res.json();
      if(data.qrCode) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ 
          id: data.ticketId, 
          coords: matriz.flat(), 
          qrCode: data.qrCode, 
          usuario: user.nome,
          pixKey: user.pixKey,
          data: new Date().toLocaleString('pt-BR') 
        }));
        setMatriz([]); 
        router.push('/bilhete/' + data.ticketId);
      }
    } catch (e) { alert("Erro de conexao"); }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30 text-center">
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter" style={{fontFamily:'Orbitron'}}>MIMOSINHA<span className="text-cyan-400">G25</span></h1>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase italic">Olá, {user.nome.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        <section className="mb-10">
          <div className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] mb-2" style={{fontFamily:'Orbitron'}}>{timer}</div>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        <div className="max-w-4xl mx-auto bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl mb-12">
            <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest italic" style={{fontFamily:'Orbitron'}}>Sua Malha de Coordenadas Matrix 5x5</h2>
            
            <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                {/* GRADE COM LABELS À ESQUERDA */}
                <div className="flex flex-col gap-3">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 uppercase italic w-20 text-right">{i+1} PREMIO:</span>
                      <div className="flex-1 grid grid-cols-5 gap-2">
                        {[0,1,2,3,4].map((j) => (
                          <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[9px] md:text-sm font-black text-cyan-400">
                            {matriz[i] ? matriz[i][j] : '--/--'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 transition-all">Gerar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading || matriz.length === 0} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg flex justify-center items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"}
                </button>
            </div>
            <p className="text-[10px] text-white/30 text-center mt-6 uppercase font-bold italic tracking-widest">Identificado: {user.nome}</p>
        </div>
      </main>
    </div>
  );
}
`;

// 2. RECONSTRUIR BILHETE (Rótulos 1º a 5º + Chave Pix)
const bilheteCode = `"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Printer, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificadoG25() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('CERTIFICADO_G25');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 md:p-10 text-slate-200 font-sans print:bg-white print:p-0">
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 w-full max-w-4xl rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-black">
        <div className="absolute top-10 right-10 border-4 border-emerald-500/40 text-emerald-500/40 px-6 py-2 rounded-xl font-black uppercase text-xl rotate-[-15deg] print:border-black print:text-black">Autenticado</div>

        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/30 pb-8 mb-8 gap-6 print:border-black">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg print:bg-black"><Trophy className="text-white" size={32}/></div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black" style={{fontFamily: 'Orbitron'}}>BET-GRUPO25</h1>
          </div>
          <div className="text-center md:text-right">
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic print:border-black print:text-black">Aposta Registrada</span>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">ID do Bilhete</p><p className="font-mono font-bold text-white print:text-black">#{data.id}</p></div>
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">Apostador</p><p className="font-bold text-white print:text-black uppercase">{data.usuario}</p></div>
                <div><p className="text-[9px] text-yellow-500 font-black uppercase mb-1">Chave Pix Resgate</p><p className="font-bold text-white print:text-black italic text-sm">{data.pixKey}</p></div>
                
                <div className="mt-8">
                   <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6 italic print:text-black">Sua Malha Matrix 5x5</h3>
                   <div className="flex flex-col gap-2">
                      {[0,1,2,3,4].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[8px] font-black text-slate-500 uppercase w-16 text-right">{i+1} PREMIO:</span>
                          <div className="flex-1 grid grid-cols-5 gap-1.5">
                            {[0,1,2,3,4].map((j) => (
                              <div key={j} className="bg-slate-950 border border-cyan-500/20 py-2 rounded-lg flex items-center justify-center font-black text-cyan-400 text-xs print:border-black print:text-black print:bg-transparent">
                                {data.coords[i * 5 + j]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl self-center no-print">
                <p className="text-black font-black uppercase text-xs mb-6 tracking-tighter">Pague via Pix para Validar</p>
                <QRCodeSVG value={data.qrCode} size={220} />
                <p className="text-slate-400 text-[9px] mt-6 font-bold uppercase animate-pulse">Aguardando Pagamento</p>
            </div>
        </section>

        <footer className="flex justify-between items-center pt-8 border-t border-cyan-900/30 no-print">
           <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase underline">Voltar</button>
           <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2">
             Imprimir Bilhete
           </button>
        </footer>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', dashCode, { encoding: 'utf8' });
fs.writeFileSync('src/app/bilhete/[id]/page.tsx', bilheteCode, { encoding: 'utf8' });

console.log("✅ Sistema reconstruído com Regra de Horizontalidade (1º ao 5º)!");