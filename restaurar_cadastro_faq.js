import fs from 'fs';

const code = `"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Trophy } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // 1. MOTOR MATRIX (625 COORDENADAS)
  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<100; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)] });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
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
      if (p >= 100) { clearInterval(inv); setStep('register'); }
    }, 300);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { 
      method: 'POST', 
      body: JSON.stringify({ ...form, password: form.senha, indicado_por: searchParams.get('ref') }) 
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } else {
      alert("Este e-mail já está cadastrado ou o servidor está offline.");
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* STEP 1: AGE GATE */}
      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 className="font-['Orbitron'] text-lg mb-2 uppercase">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Verificação de Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-black font-['Orbitron'] uppercase text-xs shadow-xl transition-all active:scale-95">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {/* STEP 2: SPLASH SCREEN */}
      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[700px] mb-12 animate-pulse" alt="Mimosinha G25" />
          <h4 className="font-['Orbitron'] text-2xl md:text-3xl text-yellow-500 font-black uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden">
             <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: progress + '%' }} />
          </div>
        </div>
      )}

      {/* STEP 3: CADASTRO + FAQ */}
      {step === 'register' && (
        <div className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/90 border-b border-amber-500/20 px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 className="font-['Orbitron'] text-white text-lg tracking-tighter uppercase italic">MIMOSINHA<span className="text-amber-500 ml-1 font-bold">G25</span></h1>
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-['Orbitron']">
               <a href="#regulamento" className="hover:text-amber-500">Como Funciona</a>
               <span className="text-yellow-500 cursor-pointer italic underline" onClick={() => router.push('/login')}>Já sou membro? Entre aqui</span>
            </div>
          </nav>

          {/* FORMULÁRIO */}
          <div className="bg-[#0f172a]/90 border border-slate-800 p-10 md:p-14 rounded-[3rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md">
            <h2 className="text-yellow-500 font-black text-xl uppercase mb-1 font-['Orbitron']">Crie sua conta</h2>
            <p className="text-slate-500 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 (625 Combinações)</p>
            
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX (Para Receber Prêmios)" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm" onChange={e=>setForm({...form, senha: e.target.value})} />
              
              <div className="flex items-start gap-3 py-3">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-yellow-500" />
                <p className="text-[10px] text-slate-500 leading-tight">Eu declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade.</p>
              </div>

              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-2 animate-bounce">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black font-['Orbitron'] uppercase text-xs shadow-xl transition-all hover:bg-yellow-400 text-black">CADASTRAR E JOGAR</button>
              
              <p className="mt-8 text-[11px] text-slate-500 uppercase font-bold tracking-widest text-center">
                Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer">Entre aqui</span>
              </p>
            </form>
          </div>

          {/* FAQ / REGULAMENTO OFICIAL (INSERIDO AQUI) */}
          <section id="regulamento" className="max-w-4xl w-full mt-20 bg-[#0f172a]/95 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl">
             <div className="p-8 text-center border-b border-slate-800 bg-slate-800/30">
                <h2 className="text-xl font-black uppercase tracking-widest text-yellow-500 font-['Orbitron']">Regulamento Oficial</h2>
             </div>
             
             <div className="divide-y divide-slate-800">
                <FaqItem 
                  isOpen={openFaq === 0} 
                  onClick={() => toggleFaq(0)}
                  title="ESCLARECIMENTO TÉCNICO" 
                  text="A 'Bet-Grupo25' é uma loteria de prognósticos estruturada sobre uma matriz 25x25 que gera 625 prognósticos definidos por x/y, onde x= 1 a 25 e y= 1 a 25. Cada prognóstico representa 16 diferentes milhares, cuja integração total gera 10.000 milhares (0000 a 9999)." 
                />
                <FaqItem 
                  isOpen={openFaq === 1} 
                  onClick={() => toggleFaq(1)}
                  title="COMO FUNCIONA A 'MIMOSINHA'?" 
                  text="Após cadastrado e logado, ao realizar o pagamento de R$10,00, o sistema escolhe aleatoriamente 25 prognósticos na matriz 25x25 e os insere em seu bilhete Matrix 5x5. O sorteio acontece todos os sábados às 20h via Blockchain." 
                />
                <FaqItem 
                  isOpen={openFaq === 2} 
                  onClick={() => toggleFaq(2)}
                  title="PREMIAÇÃO (LEI 13.756/2018)" 
                  text="O prêmio bruto corresponde a 43,35% da arrecadação. A distribuição é: 5 pontos (50%), 4 pontos (20%), 3 pontos (15%), 2 pontos (10%) e 1 ponto (5%). O sistema utiliza a regra de cascata e acúmulo auditados em contrato inteligente." 
                />
                <FaqItem 
                  isOpen={openFaq === 3} 
                  onClick={() => toggleFaq(3)}
                  title="DESTINAÇÃO SOCIAL" 
                  text="Conforme a Lei Federal, destinamos: 17,32% para Seguridade Social, 9,26% para Segurança Pública (FNSP) e 9,26% para Educação (FNDE)." 
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
      <button onClick={onClick} className="w-full p-6 flex justify-between items-center text-left text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white">
        {title} <span className="text-yellow-500 text-lg">{isOpen ? '-' : '+'}</span>
      </button>
      <div className={\`transition-all duration-300 overflow-hidden \${isOpen ? 'max-h-96' : 'max-h-0'}\`}>
        <p className="p-6 pt-0 text-slate-400 text-sm leading-relaxed italic text-center font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return <Suspense fallback={null}><LandingContent /></Suspense>;
}
`;

fs.writeFileSync('src/app/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Cadastro Matrix + FAQ Oficial restaurados com sucesso!");

