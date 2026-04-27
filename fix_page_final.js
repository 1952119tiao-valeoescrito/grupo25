import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente Interno que contém a lógica de busca de parâmetros
function LandingContent() {
  const [step, setStep] = useState('age'); // age, splash, register
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // Efeito Matrix de fundo
  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<80; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = '#22d3ee22';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.97) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleAgeConfirm = () => {
    setStep('splash');
    let p = 0;
    const interval = setInterval(() => {
      p += 1; setProgress(p);
      if (p >= 100) { clearInterval(interval); setStep('register'); }
    }, 300); // 30 segundos de splash fiel ao seu pedido
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { 
      method: 'POST', 
      body: JSON.stringify({ ...form, password: form.senha, indicado_por: searchParams.get('ref') }) 
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } else {
      alert("Erro no cadastro ou e-mail já existe.");
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {step === 'age' && (
        <div className="relative z-10 flex h-screen items-center justify-center p-4">
          <div className="bg-[#010409]/90 border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-md">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-xl mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[10px] mb-8 uppercase tracking-widest font-black">Verificação de Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl transition-all active:scale-95">CONFIRMAR E ENTRAR</button>
            <p className="mt-4 text-slate-600 text-[9px] uppercase font-bold cursor-pointer">Sou menor / Sair</p>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[600px] mb-12 animate-pulse" alt="Mimosinha G25" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-2xl md:text-3xl text-yellow-500 font-black uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-12 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: progress + '%' }} />
          </div>
          <p className="text-yellow-500/40 font-['Orbitron'] text-[9px] mt-6 tracking-[0.4em] uppercase">Sincronizando Matrix...</p>
        </div>
      )}

      {step === 'register' && (
        <div className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1">G25</span></h1>
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-['Orbitron']">
               <a href="#">Como Funciona</a>
               <a href="#">Painel Admin</a>
               <a href="#">Suporte</a>
            </div>
          </nav>

          <div className="bg-[#0f172a]/90 border border-slate-800 p-10 md:p-14 rounded-[3rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1 font-['Orbitron']">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest text-center">Acesse a Matriz 25x25 (625 Combinações)</p>
            
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX (Para Receber Prêmios)" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              
              <div className="flex items-start gap-3 py-3">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-yellow-500" />
                <p className="text-[10px] text-slate-500 leading-tight">Eu declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade.</p>
              </div>
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-2 animate-bounce">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase text-xs shadow-xl transition-all">CADASTRAR E JOGAR</button>
              <p className="mt-8 text-[11px] text-slate-500 uppercase font-bold tracking-widest text-center">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span></p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// EXPORT PRINCIPAL COM O ESCUDO DE SUSPENSE (FIX PARA VERCEL)
export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LandingContent />
    </Suspense>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Arquivo page.tsx corrigido com Suspense Boundary!");