import fs from 'fs';

console.log("🔧 Ajustando a inteligência de redirecionamento...");

// 1. ATUALIZAR PÁGINA INICIAL (INDEX) PARA PULAR O SATÉLITE SE LOGADO
const indexPath = 'src/app/page.tsx';
const indexContent = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function LandingContent() {
  const [step, setStep] = useState('loading'); // Começa em loading para checar sessão
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const canvasRef = useRef(null);

  // --- CHECAGEM DE SESSÃO IMEDIATA ---
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      router.push('/dashboard'); // Se já está logado, vai direto pro jogo
    } else {
      setStep('bridge'); // Se não, mostra o satélite
    }
  }, [router]);

  useEffect(() => {
    if (step === 'bridge' || step === 'age' || step === 'form') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<80; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.97) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleAgeConfirm = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => {
      p += 1; setProgress(p);
      if (p >= 100) { clearInterval(inv); setStep('form'); }
    }, 50); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } else { alert("Erro no cadastro"); }
  };

  if (step === 'loading') return <div className="min-h-screen bg-black"></div>;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium text-center">Processamento de coordenadas 100% auditado via Oráculo Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500 transition-all">INICIAR TREINAMENTO</button>
          </div>
        </div>
      )}

      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409]/95 border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase text-white">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Verificação Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none focus:border-red-500" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-4 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter shadow-yellow-500/50">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4 animate-in fade-in duration-1000">
          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <form onSubmit={handleRegister} className="space-y-4 text-left mt-8">
              <input required placeholder="E-mail" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400">CADASTRAR E JOGAR</button>
              <p className="mt-6 text-[10px] text-slate-500 uppercase text-center tracking-widest">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span></p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }
`;

// 2. ATUALIZAR PÁGINA DE LOGIN PARA SALVAR DADOS CORRETAMENTE
const loginPath = 'src/app/login/page.tsx';
const loginContent = `"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Mail, Lock, ChevronRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('user')) router.push('/dashboard');
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/dashboard');
      } else {
        alert("E-mail ou senha incorretos!");
      }
    } catch (err) { alert("Erro ao conectar ao servidor"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans selection:bg-cyan-500/30">
      <div className="bg-slate-900/80 border border-white/10 p-10 max-w-md w-full rounded-[3rem] shadow-2xl backdrop-blur-xl text-center">
        <div className="bg-cyan-600 p-3 rounded-2xl inline-block mb-6 shadow-lg shadow-cyan-900/40"><Trophy size={32} /></div>
        <h2 style={{fontFamily:'Orbitron'}} className="text-2xl font-black uppercase italic tracking-tighter mb-10">ACESSO <span className="text-cyan-400 text-sm">MATRIX</span></h2>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input required type="email" placeholder="E-mail" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-cyan-500" onChange={e=>setForm({...form, email: e.target.value})} />
          <input required type="password" placeholder="Senha" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-cyan-500" onChange={e=>setForm({...form, senha: e.target.value})} />
          <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 p-5 rounded-2xl font-black text-xs uppercase shadow-xl flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "ENTRAR NO SISTEMA"} <ChevronRight size={16} />
          </button>
        </form>
        <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase">Novo por aqui? <span onClick={() => router.push('/')} className="text-yellow-500 underline cursor-pointer">Crie sua Identidade</span></p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(indexPath, indexContent);
fs.writeFileSync(loginPath, loginContent);
console.log("✅ Sistema de Redirecionamento e Sessão corrigido!");