import fs from 'fs';

const path = 'src/app/page.tsx';

if (fs.existsSync(path)) {
    const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LandingContent() {
  const [step, setStep] = useState('loading'); // Começa em loading para checar sessão
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // 1. CHECAGEM DE SESSÃO (EVITA O LOOP)
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      router.push('/dashboard'); // Se já tem usuário, vai direto pro jogo
    } else {
      setStep('bridge'); // Se não tem, mostra o satélite
    }
  }, [router]);

  // 2. MOTOR MATRIX
  useEffect(() => {
    if (step !== 'splash' && step !== 'loading') {
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
    }, 150); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { 
      method: 'POST', 
      body: JSON.stringify({ ...form, password: form.senha }) 
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } else {
      alert("Erro no cadastro ou e-mail já existe.");
    }
  };

  if (step === 'loading') return <div className="min-h-screen bg-black"></div>;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500">INICIAR CONEXÃO</button>
          </div>
        </div>
      )}

      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409]/90 border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" />
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-yellow-500" style={{ width: progress + '%' }} />
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <div className="bg-[#0f172a]/90 border border-slate-800 p-10 rounded-[3rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-8">Crie sua conta</h2>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="E-mail" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, senha: e.target.value})} />
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
    fs.writeFileSync(path, code, { encoding: 'utf8' });
    console.log("✅ Loop de login corrigido!");
}