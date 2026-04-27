import fs from 'fs';
import path from 'path';

console.log("🚀 Iniciando Restauração Pixel-Perfect dos Layouts de Elite...");

const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim(), { encoding: 'utf8' });
  console.log(`✅ Restaurado: ${filePath}`);
};

// --- 1. PÁGINA DE ACESSO (O SATÉLITE - PRINT 1) ---
const acessoCode = `"use client"
import { useRouter } from 'next/navigation';
export default function Acesso() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#010409] text-white flex items-center justify-center p-6" style={{fontFamily: 'Orbitron, sans-serif'}}>
      <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
        <h1 className="text-xl text-cyan-400 uppercase tracking-widest mb-4">Acesso ao Simulador Matrix</h1>
        <p className="text-slate-400 text-sm mb-10 font-sans leading-relaxed">Você está acessando a malha de treinamento 25x25. O processamento de coordenadas é 100% auditado via Blockchain.</p>
        <button onClick={() => router.push('/')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-500 transition-all active:scale-95">INICIAR TREINAMENTO GRATUITO</button>
      </div>
    </div>
  );
}`;

// --- 2. INDEX FLOW (AGE GATE, SPLASH, REGISTER - PRINTS 2, 3, 4) ---
const indexCode = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<100; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleAgeConfirm = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => { p += 1; setProgress(p); if(p >= 100){ clearInterval(inv); setStep('form'); } }, 300);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409]/90 border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-md">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 className="font-['Orbitron'] text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Verificação de Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none focus:border-red-500" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-5 rounded-2xl font-black font-['Orbitron'] uppercase text-xs shadow-xl transition-all active:scale-95">CONFIRMAR E ENTRAR</button>
            <p className="mt-4 text-slate-600 text-[9px] uppercase font-bold">Sou menor / Sair</p>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-12 animate-pulse" />
          <h4 className="font-['Orbitron'] text-2xl md:text-3xl text-yellow-500 font-black uppercase italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-yellow-500 transition-all duration-300" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 className="font-['Orbitron'] text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1 font-bold">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer" onClick={() => router.push('/login')}>Já é membro? Entre aqui</span>
          </nav>
          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 className="text-yellow-500 font-black text-xl uppercase mb-1 font-['Orbitron']">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 Elite</p>
            <form onSubmit={async (e)=>{e.preventDefault(); const res = await fetch('/api/auth/register', {method:'POST', body: JSON.stringify(form)}); if(res.ok) router.push('/dashboard'); else alert("Erro no cadastro");}} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-4">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400">CADASTRAR E JOGAR</button>
            </form>
          </div>
          <section className="max-w-4xl w-full mt-20 bg-[#0f172a]/95 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl">
             <div className="p-8 text-center border-b border-slate-800 bg-slate-800/30"><h2 className="text-xl font-black uppercase tracking-widest text-yellow-500 font-['Orbitron']">Regulamento Oficial</h2></div>
             <div className="p-10 text-[11px] text-slate-400 text-center italic">Lei 13.756/2018 - Repasses para Educação e Segurança Pública.</div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }
`;

// --- 3. DASHBOARD (O ORIGINAL - PRINT 5 E 7) ---
const dashboardCode = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ChevronRight, Scale, Wallet, LogOut, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:22:20:10");
  const [qrCode, setQrCode] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }

    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = []; for (let i=0; i<120; i++) gridAnim.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = '900 13px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      gridAnim.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
      requestAnimationFrame(draw);
    }; draw();
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = []; for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  const handleConfirmar = async () => {
    const res = await fetch('/api/pix/create', { method:'POST', body: JSON.stringify({ email: user.email, cpf: '00000000000', prognosticos: matriz.flat(), rodadaId: 1 }) });
    const data = await res.json();
    if(data.qrCode) setQrCode(data.qrCode);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden whitespace-nowrap h-[45px] flex items-center z-50 relative">
        <div className="animate-marquee inline-block text-cyan-400 font-black uppercase text-[10px] tracking-widest">
           🚀 BEM-VINDO À MIMOSINHA: REALIZE APOSTAS GRATUITAMENTE NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO DA PREMIAÇÃO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 className="font-['Orbitron'] text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Olá, \${user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10"><LogOut size={14}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10">
        <section className="mb-12">
          <div className="font-['Orbitron'] text-6xl md:text-9xl mb-4 text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter italic">05:22:20:10</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic">Sábado às 20:00hrs</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 bg-[#0f172a]/95 border border-cyan-500/30 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
             <h2 className="text-yellow-500 font-black text-xs uppercase mb-10 tracking-[0.2em] font-['Orbitron']">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-4 md:p-10 mb-10">
                <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
                  {matriz.map((linha, i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                      {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)] font-['Orbitron']">{c}</div>)}
                    </div>
                  ))}
                </div>
             </div>
             
             {!qrCode ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={gerarMalha} className="flex-1 bg-slate-800 border border-white/5 py-5 rounded-2xl font-black uppercase text-[10px]">Trocar Coordenadas</button>
                  <button onClick={handleConfirmar} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-5 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-cyan-900/40">Confirmar Certificado</button>
                </div>
             ) : (
                <div className="flex flex-col items-center p-6 bg-white rounded-3xl">
                   <QRCodeSVG value={qrCode} size={200} />
                   <button onClick={()=>setQrCode("")} className="mt-4 text-slate-500 text-xs underline uppercase">Voltar</button>
                </div>
             )}
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-[#0f172a]/95 border border-amber-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Sócio Afiliado</div>
               <h3 className="text-[11px] text-amber-500 mb-6 uppercase font-black font-['Orbitron'] tracking-widest">💰 Meu Lucro</h3>
               <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
               <p className="text-3xl font-black text-white font-['Orbitron']">R$ 0,00</p>
            </div>
            <div className="bg-[#0f172a]/95 border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-yellow-500 font-black text-[10px] uppercase mb-6 flex items-center gap-2 font-['Orbitron'] tracking-widest italic">⚖️ Transparência Legal</h3>
               <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                  <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTÃO DE AJUDA - PRINT 7 */}
      <div onClick={()=>router.push('/como-funciona')} className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-110 transition-all z-[100] animate-bounce">
         <HelpCircle size={28} />
      </div>

      <footer className="py-20 border-t border-white/5 opacity-30 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] italic cursor-pointer" onClick={()=>router.push('/admin/central')}>
           © 2026 BET-GRUPO25 | MATRIX PRO | BY NEON DATABASE
        </p>
      </footer>

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      \`}</style>
    </div>
  );
}
`;

writeFile('src/app/acesso/page.tsx', acessoCode);
writeFile('src/app/page.tsx', indexCode);
writeFile('src/app/dashboard/page.tsx', dashboardCode);

console.log("\n💎 FIDELIDADE TOTAL RESTAURADA! O design original agora governa o site.");
