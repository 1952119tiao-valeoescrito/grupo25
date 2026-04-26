"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

export default function LandingFlow() {
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
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
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = '#22d3ee22';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.95) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleStart = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => { p += 1; setProgress(p); if(p >= 100){ clearInterval(inv); setStep('form'); } }, 50); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify({...form, password: form.senha}) });
    const data = await res.json();
    if(res.ok) { localStorage.setItem('user', JSON.stringify(data)); router.push('/dashboard'); }
    else alert(data.error);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      
      {step === 'age' && (
        <div className="relative z-10 flex h-screen items-center justify-center p-4">
          <div className="bg-[#0d1117] border-2 border-red-500 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest italic">Verificação Obrigatória</p>
            <button onClick={handleStart} className="w-full bg-green-600 py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">ENTRAR NO SISTEMA</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" alt="Logo" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter shadow-yellow-500/50">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 text-sm ml-1">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer italic underline" onClick={() => router.push('/login')}>Já sou membro</span>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 Elite</p>
            
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX Prêmio" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, senha: e.target.value})} />
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-4 animate-bounce">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400 transition-all">CADASTRAR E JOGAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
