import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Trophy, ShieldCheck, Scale, Zap } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('bridge'); 
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
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
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.95) s.text = coords[Math.floor(Math.random()*625)]; });
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
    }, 150); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    if(res.ok) { 
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data)); 
      router.push('/dashboard'); 
    } else { alert("E-mail já cadastrado!"); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6 text-center">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed">Processamento de coordenadas 100% auditado via Oráculo Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500 transition-all">INICIAR TREINAMENTO</button>
          </div>
        </div>
      )}

      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409] border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[500px] mb-8 animate-pulse" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1 font-bold">G25</span></h1>
            <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer italic underline" onClick={() => router.push('/login')}>Já sou membro? Entre aqui</span>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest uppercase">Matriz 25x25 Elite</p>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX Prêmio" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-4 animate-bounce">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl text-xs hover:bg-yellow-400">CADASTRAR E JOGAR</button>
              <p className="mt-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span></p>
            </form>
          </div>

          <section id="regulamento" className="max-w-4xl w-full mt-20 bg-[#0f172a]/95 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-md">
             <div className="p-8 text-center border-b border-slate-800 bg-slate-800/30">
                <h2 style={{fontFamily:'Orbitron'}} className="text-xl font-black uppercase tracking-widest text-yellow-500">Regulamento Oficial</h2>
             </div>
             
             <div className="divide-y divide-slate-800">
                <FaqItem 
                  isOpen={openFaq === 0} 
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                  title="ESCLARECIMENTO TÉCNICO" 
                  text="A 'Bet-Grupo25' é uma loteria de prognósticos estruturada sobre uma matriz 25x25 que gera 625 prognósticos definidos por x/y, onde x= 1 a 25 e y= 1 a 25. Cada prognóstico (x/y) corresponde a 16 diferentes milhares, cuja integração de 1/1 a 25/25 gera 10.000 milhares (0000 a 9999)." 
                />
                <FaqItem 
                  isOpen={openFaq === 1} 
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  title="COMO FUNCIONA A 'BET-GRUPO25'?" 
                  text="Para apostar, o usuário realiza seu cadastro e o pagamento de R$10,00. Uma vez logado, clica em 'GERADOR DE APOSTAS' e o sistema escolhe aleatoriamente 25 prognósticos na matriz 25x25, inserindo-os na sua malha 5x5. O sorteio acontece todos os sábados às 20:00hrs." 
                />
                <FaqItem 
                  isOpen={openFaq === 2} 
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  title="PREMIAÇÃO (LEI 13.756/2018)" 
                  text="O prêmio bruto corresponde a 43,35% da arrecadação. Dividido em 5 etapas: 5 pts(50%), 4 pts(20%), 3 pts(15%), 2 pts(10%) e 1 pt(5%). Utilizamos a regra de cascata e acúmulo auditados por contrato inteligente." 
                />
                <FaqItem 
                  isOpen={openFaq === 3} 
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  title="TECNOLOGIA WEB2/WEB3" 
                  text="A extração de resultados, conferência de contemplados e distribuição de valores para o Mercado Pago é realizada através do Chainlink VRF na Blockchain Base Mainnet, garantindo transparência total." 
                />
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

function FaqItem({ title, text, isOpen, onClick }) {
  return (
    <div className="w-full">
      <button onClick={onClick} className="w-full p-6 flex justify-between items-center text-left text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white">
        {title} <span className="text-yellow-500 text-lg">{isOpen ? '-' : '+'}</span>
      </button>
      <div className={\`transition-all duration-300 overflow-hidden \${isOpen ? 'max-h-96' : 'max-h-0'}\`}>
        <p className="p-8 pt-0 text-slate-400 text-sm leading-relaxed italic text-justify border-t border-white/5 bg-black/20">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Arquivo page.tsx restaurado com FAQ e Regulamento!");