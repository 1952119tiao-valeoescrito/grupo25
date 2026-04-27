import fs from 'fs';

// --- CÓDIGO DA PÁGINA INICIAL (CADASTRO + SPLASH) ---
const indexCode = `"use client"
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
`;

// --- CÓDIGO DO DASHBOARD (MOBILE FIRST + HAMBURGUER) ---
const dashboardCode = `"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Trophy, RefreshCw, ChevronRight, Scale, Wallet, LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = []; for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden">
      {/* MENU HAMBURGUER MOBILE */}
      <div className={"fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden " + (isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-cyan-400"><X size={32} /></button>
        <nav className="flex flex-col items-center justify-center h-full gap-8 font-black uppercase italic text-xl tracking-widest">
           <button onClick={()=>router.push('/dashboard')} className="text-cyan-400">JOGAR AGORA</button>
           <button onClick={()=>router.push('/meus-bilhetes')}>MEUS REGISTROS</button>
           <button onClick={()=>router.push('/resultados')}>RESULTADOS</button>
           <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-red-500">SAIR</button>
        </nav>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-16 md:h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">G25</span></h1>
          
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-red-500">SAIR</button>
          </nav>

          <button onClick={()=>setIsMenuOpen(true)} className="md:hidden text-cyan-400 p-2"><Menu size={28}/></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 text-center">
        <section className="mb-8">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">05:22:20:10</div>
          <p className="text-[9px] text-yellow-500 uppercase font-bold tracking-widest mt-2">Próximo Sorteio Auditado</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-6 items-start text-left">
          <div className="lg:col-span-2 bg-[#0f172a]/95 border border-cyan-500/20 p-6 md:p-10 rounded-[2.5rem] shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm md:text-lg font-bold uppercase text-yellow-500">Sua Malha Matrix 5x5</h2>
                <button onClick={gerarMalha} className="text-cyan-400"><RefreshCw size={18}/></button>
             </div>
             
             <div className="grid grid-cols-6 gap-1 md:gap-4 mb-8">
                {matriz.map((linha, i) => (
                  <div key={i} className="contents">
                    <span className="text-[8px] md:text-[10px] font-black text-cyan-500/30 flex items-center justify-end pr-1">{i+1}º</span>
                    {linha.map((c, j) => (
                      <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[9px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                        {c}
                      </div>
                    ))}
                  </div>
                ))}
             </div>

             <button className="w-full bg-[#ea580c] p-4 md:p-6 rounded-2xl font-black text-xs md:text-sm uppercase shadow-xl transition-all">CONFIRMAR CERTIFICADO</button>
          </div>

          <div className="space-y-4">
             <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="text-yellow-500 text-[10px] font-bold uppercase mb-4 flex items-center gap-2"><Scale size={14}/> Transparência (Lei 13.756)</h3>
                <div className="space-y-3 text-[9px] text-slate-400 uppercase">
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                   <div className="flex justify-between"><span>Segurança (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', indexCode);
fs.writeFileSync('src/app/dashboard/page.tsx', dashboardCode);
console.log("✅ Páginas responsivas com Menu Hamburguer injetadas!");