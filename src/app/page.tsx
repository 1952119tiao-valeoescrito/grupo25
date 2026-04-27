"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingFlow() {
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();

  const handleAgeConfirm = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => {
      p += 1; setProgress(p);
      if (p >= 100) { clearInterval(inv); setStep('form'); }
    }, 50); 
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      {step === 'age' && (
        <div className="flex h-screen items-center justify-center p-4">
          <div className="bg-[#0d1117] border-2 border-red-600/50 p-6 md:p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-4 rounded-2xl font-black uppercase text-xs">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="w-full max-w-[300px] md:max-w-[600px] h-auto mb-8 animate-pulse" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-lg md:text-3xl text-yellow-500 font-black uppercase italic">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-full max-w-xs h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden">
             <div className="h-full bg-yellow-500" style={{width: progress+'%'}} />
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="flex flex-col items-center py-10 px-4">
          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-6 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
              const data = await res.json();
              if(res.ok) { localStorage.setItem('user', JSON.stringify(data)); router.push('/dashboard'); }
              else alert(data.error);
            }} className="space-y-4 mt-8">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800" onChange={e=>setForm({...form, senha: e.target.value})} />
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase text-xs">CADASTRAR E JOGAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
