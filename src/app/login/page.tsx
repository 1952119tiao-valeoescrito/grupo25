"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de Login (Integraremos a API a seguir)
    setTimeout(() => {
      localStorage.setItem('usuario_email', form.email);
      localStorage.setItem('esta_logado', 'true');
      router.push('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-900/80 border border-white/10 p-10 max-w-md w-full rounded-[3rem] shadow-2xl backdrop-blur-xl text-center">
        <div className="bg-cyan-600 p-3 rounded-2xl inline-block mb-6 shadow-lg shadow-cyan-900/40">
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Acesso <span className="text-cyan-400 text-sm">Matrix</span></h2>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-10">Protocolo de Segurança Ativo</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              required type="email" placeholder="E-mail" 
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-cyan-500" 
              onChange={(e)=>setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              required type="password" placeholder="Senha" 
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-cyan-500" 
              onChange={(e)=>setForm({...form, senha: e.target.value})}
            />
          </div>

          <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "ENTRAR NO SISTEMA"} <ChevronRight size={16} />
          </button>
        </form>

        <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase">
          Novo por aqui? <span onClick={() => router.push('/register')} className="text-yellow-500 underline cursor-pointer hover:text-yellow-400">Crie sua Identidade Matrix</span>
        </p>
      </div>
    </div>
  );
}
