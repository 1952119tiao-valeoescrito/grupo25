"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState('age'); // age, splash, form
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const canvasRef = useRef(null);

  // 1. Efeito Matrix Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.18)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, [step]);

  // 2. Lógica do Splash (30 segundos)
  const iniciarSplash = () => {
    setStep('splash');
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('form'), 1000);
          return 100;
        }
        return old + (100 / 30);
      });
    }, 1000);
  };

  // 3. FUNÇÃO DE CADASTRO REAL (A MÁGICA ACONTECE AQUI)
  const handleRegister = async () => {
    if(!form.email || !form.senha || !form.nome) return alert("Preencha todos os campos!");
    
    setLoading(true);
    try {
      // PADRÃO DE ELITE: Limpando o e-mail antes de enviar pro banco
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(), // Salva limpo no banco!
        pix: form.pix.replace(/\D/g, '') // Remove pontos/traços do CPF/Pix se for número
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push('/login'); // Joga pro login após cadastrar
      } else {
        alert(data.error || "Erro ao cadastrar");
      }
    } catch (e) {
      alert("Erro de conexão com o servidor");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      {/* 18+ AGE GATE */}
      {step === 'age' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#010409]/95 backdrop-blur-xl">
          <div className="bg-slate-900 border-2 border-red-500/50 p-10 rounded-[3rem] text-center max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.2)]">
             <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">18+</div>
             <h2 className="text-xl font-black uppercase mb-2">Acesso Restrito</h2>
             <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-widest">É proibida a participação de menores de idade.</p>
             <button onClick={iniciarSplash} className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all">SOU MAIOR E DESEJO ENTRAR</button>
             <button onClick={() => window.location.href='https://google.com'} className="mt-6 text-slate-500 text-[10px] font-bold uppercase">Sair</button>
          </div>
        </div>
      )}

      {/* SPLASH SCREEN */}
      {step === 'splash' && (
        <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-[#020617]">
          <Trophy size={100} className="text-yellow-500 animate-pulse mb-8" />
          <h4 className="text-2xl md:text-4xl text-yellow-500 font-black uppercase text-center px-6 leading-tight drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
            AQUI, ACERTANDO APENAS 1 PONTO, <br/> JÁ CAI PIX NA CONTA!
          </h4>
          <div className="w-64 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: progress + '%' }} />
          </div>
          <p className="text-yellow-500/50 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Sincronizando Matrix...</p>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-8 flex justify-between">
           <h1 className="text-xl font-black italic tracking-tighter uppercase">Bet-Grupo25 <span className="text-cyan-400 text-xs">V3</span></h1>
        </div>
      </nav>

      <main className="pt-32 pb-20 flex flex-col items-center px-4">
        <div className="bg-slate-900/80 border border-white/10 p-8 md:p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl backdrop-blur-xl">
           <h2 className="text-yellow-500 font-black text-2xl uppercase text-center mb-1">Crie sua Conta</h2>
           <p className="text-slate-500 text-[10px] text-center mb-8 uppercase font-bold tracking-widest">Acesso à Matriz 25x25 Elite</p>
           
           <div className="space-y-4">
              <input 
                placeholder="Nome Completo" 
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500 text-white" 
              />
              <input 
                placeholder="E-mail (Seu Login)" 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500 text-white" 
              />
              <input 
                placeholder="Chave PIX / CPF" 
                value={form.pix}
                onChange={(e) => setForm({...form, pix: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500 text-white" 
              />
              <input 
                type="password" 
                placeholder="Sua Senha" 
                value={form.senha}
                onChange={(e) => setForm({...form, senha: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 outline-none focus:border-yellow-500 text-white" 
              />
              
              <button 
                onClick={handleRegister} 
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black text-xs uppercase shadow-xl mt-6 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "CADASTRAR E JOGAR"}
              </button>
              
              <p className="text-center text-[10px] text-slate-500 uppercase font-bold mt-4">
                Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Faça Login</span>
              </p>
           </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
      `}</style>
    </div>
  );
}