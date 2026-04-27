import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:22:20:10");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let i = 0; i < 100; i++) {
        gridAnim.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(s => {
        s.c++;
        if(Math.random() > 0.98) s.text = coords[Math.floor(Math.random() * 625)];
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')';
        ctx.fillText(s.text, s.x, s.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (logged) setUser(JSON.parse(logged));
    else router.push('/');
  }, [router]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };
  useEffect(() => { gerarMalha(); }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* TICKER SUPERIOR */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO PARA ENTENDER COMO FUNCIONA NA PRÁTICA! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO DA PREMIAÇÃO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617] border-b border-white/10 h-16 md:h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400 ml-1">BRASIL</span></h1>
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
             <button className="hover:text-white">REGISTROS</button>
             <button className="hover:text-white">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="md:hidden flex items-center gap-4">
             <span className="text-[10px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase">ELITE</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        <section className="mb-10">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic text-center">Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 items-start text-left">
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-[10px] uppercase mb-8 tracking-widest text-center">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1 italic">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[9px] md:text-sm font-black text-cyan-400">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             
             {!qrCode ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 hover:bg-slate-700 transition-all">Trocar Coordenadas</button>
                  <button onClick={gerarMalha} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg flex justify-center items-center gap-2 transition-all">
                    Confirmar Certificado
                  </button>
                </div>
             ) : (
                <div className="flex flex-col items-center py-4 bg-white rounded-[2rem] p-8 max-w-xs mx-auto shadow-2xl">
                   <QRCodeSVG value={qrCode} size={200} />
                   <button onClick={()=>setQrCode("")} className="mt-4 text-slate-400 underline text-[10px] font-bold uppercase">Voltar</button>
                </div>
             )}
             <p className="text-[10px] text-white/50 mt-6 font-bold uppercase tracking-widest text-center italic">ID: {user.nome}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0d1117] border border-amber-500/30 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase">SÓCIO AFILIADO</div>
               <h3 className="text-[10px] text-amber-500 mb-6 font-black uppercase tracking-widest italic">💰 Meu Lucro</h3>
               <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p style={{fontFamily:'Orbitron'}} className="text-3xl text-white font-black italic tracking-tighter">R$ 0,00</p>
               <button className="w-full bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-xl text-[10px] font-black uppercase mt-6 shadow-lg transition-all">SACAR VIA PIX</button>
            </div>
            <div className="bg-[#0d1117] border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
               <h3 className="text-yellow-500 mb-6 uppercase font-bold text-[9px] tracking-widest italic">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[9px] font-bold text-slate-400 uppercase font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Segurança (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>

        <section className="my-20">
           <h2 className="text-lg md:text-3xl font-black uppercase tracking-tighter mb-12 text-white">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#0f172a] border border-cyan-500/20 p-10 rounded-[3rem] text-center">
                 <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase italic">INTER-BET</h3>
                 <p className="text-[9px] text-slate-400 mb-8 font-bold">GANHA COM ATÉ 1 PONTO APENAS.</p>
                 <button className="w-full bg-cyan-500 text-black py-4 rounded-[2rem] font-black text-[10px] uppercase transition-all hover:scale-105">ACESSAR SITE</button>
              </div>
              <div className="bg-[#0f172a] border border-cyan-500/20 p-10 rounded-[3rem] text-center">
                 <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase italic">QUINA-BET</h3>
                 <p className="text-[9px] text-slate-400 mb-8 font-bold">LOTERIA CLÁSSICA DE 5 PROGNÓSTICOS.</p>
                 <button className="w-full bg-cyan-500 text-black py-4 rounded-[2rem] font-black text-[10px] uppercase transition-all hover:scale-105">ACESSAR SITE</button>
              </div>
           </div>
        </section>

        <div className="bg-[#0d1117] border border-cyan-500/20 p-12 rounded-[4rem] mb-20 max-w-4xl mx-auto">
           <h3 style={{fontFamily:'Orbitron'}} className="text-2xl text-cyan-400 mb-10 tracking-[0.3em] uppercase italic">Entre em Contato</h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div><p className="text-[11px] text-slate-500 uppercase font-black mb-2 text-center">E-mail Suporte</p><p className="text-sm font-bold text-center">suporte@blockchain-betbrasil.io</p></div>
              <div><p className="text-[11px] text-slate-500 uppercase font-black mb-2 text-center">WhatsApp Oficial</p><p className="text-sm font-bold text-center">+55 (21) 99352-7957</p></div>
           </div>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 opacity-20 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] italic cursor-pointer select-none">
           © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
        </p>
      </footer>

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
console.log("✅ Dashboard ORIGINAL restaurado com sintaxe 100% limpa!");