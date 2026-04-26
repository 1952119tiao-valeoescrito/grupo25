"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingFlow() {
  const [step, setStep] = useState('splash');
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();

  useEffect(() => {
    let p = 0;
    const inv = setInterval(() => {
      p += 2; setProgress(p);
      if (p >= 100) { clearInterval(inv); setStep('form'); }
    }, 50);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if (res.ok) { 
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data)); 
      router.push('/dashboard'); 
    } else { alert("E-mail já cadastrado!"); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden">
      {step === 'splash' ? (
        <div className="flex flex-col items-center justify-center h-screen bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-md mb-8 animate-pulse" />
          <h4 className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1 bg-slate-800 mt-10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{width: progress+'%'}} /></div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center">
            <h1 className="text-white text-lg font-bold uppercase tracking-tighter">MIMOSINHA<span className="text-amber-500">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer" onClick={() => router.push('/login')}>Já sou membro? Entre aqui</span>
          </nav>
          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 Elite</p>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-4">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400">CADASTRAR E JOGAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
