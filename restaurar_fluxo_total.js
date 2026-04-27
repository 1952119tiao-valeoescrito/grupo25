import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LandingFlow() {
  const [step, setStep] = useState('bridge'); // SEQUÊNCIA: bridge -> age -> splash -> form
  const [progress, setProgress] = useState(0);
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
    }, 150); // 15 segundos de Splash
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if(res.ok) { 
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data)); 
      router.push('/dashboard'); 
    } else { alert("Erro no cadastro"); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* --- ETAPA 1: ACESSO AO SIMULADOR (O SEU ÚLTIMO PRINT) --- */}
      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase tracking-widest mb-4">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Você está acessando a malha de treinamento 25x25. O processamento de coordenadas é 100% auditado via Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-500 transition-all">
              INICIAR TREINAMENTO GRATUITO
            </button>
          </div>
        </div>
      )}

      {/* --- ETAPA 2: CONTROLE DE ACESSO (BORDA VERMELHA) --- */}
      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409] border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Verificação de Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleStartSplash} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
            <p className="mt-4 text-slate-600 text-[9px] uppercase font-bold">Sou menor / Sair</p>
          </div>
        </div>
      )}

      {/* --- ETAPA 3: SPLASH SCREEN (MIMOSINHA) --- */}
      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[600px] mb-12 animate-pulse" alt="Mimosinha G25" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-2xl md:text-3xl text-yellow-500 font-black uppercase italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-12 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-yellow-500" style={{width: progress+'%'}} />
          </div>
          <p className="text-yellow-500/40 font-['Orbitron'] text-[9px] mt-6 tracking-[0.4em] uppercase">Sincronizando Matrix...</p>
        </div>
      )}

      {/* --- ETAPA 4: CADASTRO (FORMULÁRIO) --- */}
      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4 animate-in fade-in duration-1000">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer" onClick={() => router.push('/login')}>Fazer Login</span>
          </nav>
          <div className="bg-[#0f172a]/90 border border-slate-800 p-10 md:p-14 rounded-[3rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest text-center">Acesse a Matriz 25x25 Elite</p>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-4">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400">CADASTRAR E JOGAR</button>
              <p className="mt-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span></p>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
      \`}</style>
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingFlow /></Suspense>; }
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Sequência Oficial Restaurada [Satélite -> Idade -> Splash -> Cadastro]");