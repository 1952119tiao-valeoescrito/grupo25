import fs from 'fs';
import path from 'path';

console.log("🛠️ Reconstruindo o império com código limpo...");

// FUNÇÃO PARA CRIAR PASTAS E ARQUIVOS COM SEGURANÇA
const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log(`✅ Gerado: ${filePath}`);
};

// --- 1. PÁGINA DE ACESSO (O SATÉLITE + AGE GATE BORDA VERMELHA) ---
const acessoCode = `"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function ConteudoAcesso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState('bridge');
  const [dataNasc, setDataNasc] = useState("");

  const confirmarEntrada = () => {
    if (!dataNasc) return alert("Insira sua data de nascimento.");
    sessionStorage.setItem('veio_da_ponte', 'true');
    router.push('/?bridge=true&ref=' + (searchParams.get('ref') || ""));
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans">
      {step === 'bridge' ? (
        <div className="bg-[#0d1117] border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
          <h1 className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">Processamento de coordenadas 100% auditado via Blockchain.</p>
          <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500">INICIAR CONEXÃO</button>
        </div>
      ) : (
        <div className="bg-[#010409] border-2 border-red-600/50 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl">
           <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">18+</div>
           <h2 className="text-2xl font-bold uppercase mb-2">Controle de Acesso</h2>
           <p className="text-slate-500 text-[10px] mb-8 uppercase font-black">Verificação Obrigatória</p>
           <input type="date" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
           <button onClick={confirmarEntrada} className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
        </div>
      )}
    </div>
  );
}

export default function AcessoPage() {
  return <Suspense fallback={null}><ConteudoAcesso /></Suspense>;
}
`;

// --- 2. PÁGINA INICIAL (SPLASH + CADASTRO IDÊNTICO AO PRINT) ---
const indexCode = `"use client"
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
`;

// --- 3. DASHBOARD (O PAINEL 5x5 + AFILIADOS + LINKS) ---
const dashboardCode = `"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Scale, Wallet } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:23:34:00");

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-6 md:p-12">
      <header className="max-w-[1200px] mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <h1 className="font-bold text-xl uppercase italic">MIMOSINHA<span className="text-cyan-400">G25</span></h1>
        <div className="text-[10px] font-bold text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full bg-yellow-500/10">Olá, {user.nome}</div>
      </header>

      <main className="max-w-6xl mx-auto text-center">
         <section className="mb-16">
            <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
            <div className="text-6xl md:text-9xl font-black tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">{timer}</div>
            <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest mt-4">Sábado às 20:00hrs</p>
         </section>

         <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
               <h2 className="text-yellow-500 font-bold text-xs uppercase mb-10 tracking-widest">Sua Malha Matrix 5x5</h2>
               <div className="grid grid-cols-6 gap-2 md:gap-4 mb-12 items-center">
                  {matriz.map((linha, i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                      {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-[10px] font-black text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">{c}</div>)}
                    </div>
                  ))}
               </div>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-5 rounded-2xl font-black text-[10px] uppercase">Trocar Coordenadas</button>
                  <button className="flex-1 bg-cyan-600 p-5 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2">Confirmar Certificado <ChevronRight size={16}/></button>
               </div>
            </div>

            <div className="space-y-8 text-left">
               <div className="bg-[#0f172a]/85 border border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <h3 className="text-[11px] text-amber-500 mb-6 uppercase font-black tracking-widest flex items-center gap-2">💰 Lucro Afiliado</h3>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Saldo Disponível</p>
                  <p className="text-3xl font-black text-white italic">R$ 0,00</p>
                  <button className="w-full bg-amber-600 hover:bg-amber-500 p-4 rounded-xl text-[10px] font-black uppercase mt-6 transition-all">SACAR VIA PIX</button>
               </div>
               <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem]">
                  <h3 className="text-yellow-500 font-black text-xs uppercase mb-6 flex items-center gap-2"><Scale size={16}/> Transparência</h3>
                  <div className="space-y-4 text-[10px] font-bold text-slate-400">
                    <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                    <div className="flex justify-between border-b border-slate-800 pb-2"><span>Social (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                    <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20 max-w-[1000px] mx-auto">
            <a href="https://blockchain-betbrasil.io/pt/inter-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
               <h3 className="text-xl text-yellow-500 mb-2 font-black uppercase">INTER-BET</h3>
               <p className="text-[10px] text-slate-400 uppercase">Ganha com até 1 ponto</p>
            </a>
            <a href="https://blockchain-betbrasil.io/pt/quina-bet" target="_blank" className="bg-[#0f172a]/85 border border-cyan-500/20 p-10 rounded-[3rem] text-center hover:scale-105 transition-all">
               <h3 className="text-xl text-cyan-400 mb-2 font-black uppercase">QUINA-BET</h3>
               <p className="text-[10px] text-slate-400 uppercase">Sorteios Semanais</p>
            </a>
         </div>
      </main>
    </div>
  );
}
`;

writeFile('src/app/acesso/page.tsx', acessoCode);
writeFile('src/app/page.tsx', indexCode);
writeFile('src/app/dashboard/page.tsx', dashboardCode);

console.log("\n🚀 TODAS AS PÁGINAS RECONSTRUÍDAS COM SINTAXE LIMPA!");