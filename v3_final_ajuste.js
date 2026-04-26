import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
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
    const inv = setInterval(() => { p += 2; setProgress(p); if(p >= 100){ clearInterval(inv); setStep('form'); } }, 100);
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
      const data = await res.json();
      if(res.ok) { 
        localStorage.setItem('user', JSON.stringify(data)); 
        router.push('/dashboard'); 
      } else {
        alert(data.error === "E-mail já cadastrado ou erro no banco" ? "Este e-mail já está cadastrado! Clique em 'Entre aqui' abaixo." : data.error);
      }
    } catch (e) { alert("Erro de conexão com o servidor."); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      
      {step === 'age' && (
        <div className="relative z-10 flex h-screen items-center justify-center p-4">
          <div className="bg-[#0d1117] border-2 border-red-500 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest">Verificação de Identidade Obrigatória</p>
            <input type="date" className="w-full bg-slate-900 border border-red-500/50 p-3 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleStart} className="w-full bg-green-600 p-4 rounded-xl font-bold uppercase text-xs">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-md animate-pulse mb-8" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1 bg-slate-800 mt-10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 transition-all duration-300" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase">MIMOSINHA<span className="text-amber-500">G25</span></h1>
          </nav>

          <div className="bg-[#0f172a]/90 border border-slate-800 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 (625 Combinações)</p>
            
            <form onSubmit={submitRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX (Para Receber Prêmios)" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm outline-none focus:border-yellow-500" onChange={e=>setForm({...form, senha: e.target.value})} />
              
              <div className="flex items-start gap-2 py-2">
                <input type="checkbox" required className="mt-1 accent-yellow-500" />
                <p className="text-[10px] text-slate-500 leading-tight">Eu declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade.</p>
              </div>

              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-2">
                🔥 Junte-se a +50.000 jogadores no modo treino hoje
              </p>

              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400 transition-all">CADASTRAR E JOGAR</button>
              
              <p className="mt-6 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">
                Já é membro? <span onClick={()=>router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span>
              </p>
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
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Visual corrigido e link 'Entre aqui' adicionado!");