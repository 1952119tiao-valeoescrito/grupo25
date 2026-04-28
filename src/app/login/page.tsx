"use client"
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
