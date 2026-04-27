import fs from 'fs';
import path from 'path';

console.log("🚀 Reorganizando fluxo: Acesso ao Satélite agora é a Página Inicial!");

const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim(), { encoding: 'utf8' });
  console.log(`✅ Atualizado: ${filePath}`);
};

// --- 1. PÁGINA INICIAL (O PORTAL DO SATÉLITE + SEQUÊNCIA COMPLETA) ---
const indexCode = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Trophy } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('bridge'); // SEQUÊNCIA: bridge -> age -> splash -> form
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // MOTOR MATRIX DE FUNDO
  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<80; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleStartSplash = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => {
      p += 1; setProgress(p);
      if (p >= 100) { clearInterval(inv); setStep('form'); }
    }, 150); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if(res.ok) { 
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data)); 
      router.push('/dashboard'); 
    } else { alert("E-mail já cadastrado!"); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* ETAPA 1: ACESSO AO SIMULADOR (O SATÉLITE) */}
      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6 text-center">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Você está acessando a malha de treinamento 25x25. O processamento de coordenadas é 100% auditado via Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500">INICIAR TREINAMENTO</button>
          </div>
        </div>
      )}

      {/* ETAPA 2: CONTROLE DE ACESSO (BORDA VERMELHA) */}
      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4 text-center">
          <div className="bg-[#010409] border-2 border-red-600/50 p-10 rounded-[2.5rem] max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleStartSplash} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {/* ETAPA 3: SPLASH SCREEN (MIMOSINHA) */}
      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-yellow-500" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {/* ETAPA 4: CADASTRO (FORMULÁRIO + FAQ) */}
      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1 font-bold">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer" onClick={() => router.push('/login')}>Fazer Login</span>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center mt-10">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-8">Crie sua conta</h2>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, senha: e.target.value})} />
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase text-xs shadow-xl mt-6 hover:bg-yellow-400">CADASTRAR E JOGAR</button>
              <p className="mt-6 text-[10px] text-slate-500 uppercase text-center font-bold">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span></p>
            </form>
          </div>

          {/* REGULAMENTO */}
          <div className="max-w-4xl w-full mt-20 bg-[#0f172a]/95 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl">
             <div className="p-8 text-center border-b border-slate-800 bg-slate-800/30 text-yellow-500 font-bold uppercase text-sm tracking-widest font-elite">Regulamento Oficial</div>
             <div className="p-10 text-[10px] text-slate-400 space-y-4 text-center leading-relaxed italic">
                <p>O prêmio corresponde a 43,35% da arrecadação total conforme a Lei 13.756/2018.</p>
                <p>Extração via Chainlink VRF na rede Base Mainnet.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }
`;

writeFile('src/app/page.tsx', indexCode);

// --- LIMPEZA DE ARQUIVOS CONFLITANTES NA PASTA PUBLIC ---
const publicFiles = ['public/index.html', 'public/dashboard.html', 'public/acesso.html'];
publicFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`🗑️ Removido arquivo estático conflitante: ${f}`);
  }
});

console.log("\n🚀 FLUXO REORGANIZADO! Agora a sequência começa na página inicial.");