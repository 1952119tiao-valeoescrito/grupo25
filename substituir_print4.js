import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Trophy, ShieldCheck, Scale, Zap, Target, ScrollText } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('bridge'); // bridge -> age -> splash -> form
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // MOTOR MATRIX DE FUNDO
  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<80; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.98) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleAgeConfirm = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => {
      p += 1; setProgress(p);
      if (p >= 100) { clearInterval(inv); setStep('form'); }
    }, 100); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if(res.ok) { 
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data)); 
      router.push('/dashboard'); 
    } else { alert("Erro: E-mail já cadastrado!"); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* STEP 1: ACESSO AO SIMULADOR (PRINT 1) */}
      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6 text-center">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4 italic">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed">Processamento de coordenadas 100% auditado via Oráculo Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500 transition-all">INICIAR TREINAMENTO</button>
          </div>
        </div>
      )}

      {/* STEP 2: CONTROLE DE ACESSO (PRINT 2) */}
      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409] border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none focus:border-red-500" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {/* STEP 3: SPLASH SCREEN (PRINT 3) */}
      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter shadow-yellow-500/50">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {/* STEP 4: FORMULÁRIO ELITE + FAQ (SUBSTITUINDO O PRINT 4 PELO PRINT 5) */}
      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic font-bold">MIMOSINHA<span className="text-amber-500 ml-1">G25</span></h1>
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-['Orbitron']">
               <a href="#regulamento" className="hover:text-amber-500 transition-colors">Como Funciona</a>
               <a href="/admin/central" className="hover:text-amber-500 transition-colors">Painel Admin</a>
               <a href="#" className="hover:text-amber-500 transition-colors">Suporte</a>
            </div>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 (625 Combinações)</p>
            
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm focus:border-yellow-500 outline-none" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm focus:border-yellow-500 outline-none" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX (Para Receber Prêmios)" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm focus:border-yellow-500 outline-none" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm focus:border-yellow-500 outline-none" onChange={e=>setForm({...form, senha: e.target.value})} />
              
              <div className="flex items-start gap-3 py-3">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-yellow-500" />
                <p className="text-[10px] text-slate-500 leading-tight italic">Eu declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade.</p>
              </div>

              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-2 animate-pulse">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black font-['Orbitron'] uppercase text-xs shadow-xl transition-all hover:bg-yellow-400 text-black">CADASTRAR E JOGAR</button>
              
              <p className="mt-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer italic">Entre aqui</span></p>
            </form>
          </div>

          {/* REGULAMENTO OFICIAL (DA SEÇÃO FAQ DO PRINT 5) */}
          <section id="regulamento" className="max-w-4xl w-full mt-20 bg-[#0f172a]/95 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl">
             <div className="p-8 text-center border-b border-slate-800 bg-slate-800/30">
                <h2 style={{fontFamily:'Orbitron'}} className="text-xl font-black uppercase tracking-widest text-yellow-500">Regulamento Oficial</h2>
             </div>
             
             <div className="divide-y divide-slate-800">
                <FaqItem title="ESCLARECIMENTO TÉCNICO" text="A 'Bet-Grupo25' é uma loteria de prognósticos estruturada sobre uma matriz 25x25 que gera 625 prognósticos definidos por x/y. Cada prognóstico corresponde a 16 diferentes milhares, cuja integração total gera 10.000 milhares (0000 a 9999)." />
                <FaqItem title="COMO FUNCIONA A 'MIMOSINHA'?" text="Para apostar, o usuário realiza o cadastro e o pagamento de R$10,00. O sistema escolhe aleatoriamente 25 prognósticos na matriz 25x25 e os insere em seu bilhete Matrix 5x5. Sorteios todos os sábados às 20h." />
                <FaqItem title="PREMIAÇÃO (LEI 13.756/2018)" text="O prêmio bruto corresponde a 43,35% da arrecadação. Dividido em 5 etapas: 5 pts(50%), 4 pts(20%), 3 pts(15%), 2 pts(10%) e 1 pt(5%). Regras de cascata e acúmulo aplicadas conforme contrato." />
                <FaqItem title="MANUTENÇÃO DO SISTEMA" text="Os 10% da arrecadação em cada rodada ficam para manutenção do sistema e custeio operacional." />
             </div>
          </section>
        </div>
      )}

      <style jsx global>{\`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
      \`}</style>
    </div>
  );
}

function FaqItem({ title, text }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex justify-between items-center text-left text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white">
        {title} <span className="text-yellow-500 text-lg">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-8 pt-0 text-slate-400 text-sm leading-relaxed italic text-justify border-t border-white/5 bg-black/20">
          {text}
        </div>
      )}
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ SUBSTITUIÇÃO CONCLUÍDA! O Print 4 agora é o Print 5 Oficial.");