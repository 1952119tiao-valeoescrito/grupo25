"use client"
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Trophy, ShieldCheck, Scale, Zap, Target, ScrollText, Plus, Minus, HelpCircle, X } from 'lucide-react';

function LandingContent() {
  const [step, setStep] = useState('bridge'); // bridge -> age -> splash -> form
  const [progress, setProgress] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false); // NOVO: Controle do Manual
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);

  // MOTOR MATRIX DE FUNDO
  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
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
    }, 150); // Ajustei um pouco o tempo para dar tempo de ver o tutorial se quiser
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', { 
        method:'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          pix: form.pix,
          senha: form.senha
        }) 
      });
      const data = await res.json();
      if(res.ok) { 
        localStorage.setItem('user', JSON.stringify(data)); 
        router.push('/dashboard'); 
      } else { 
        alert(data.error || "Erro ao cadastrar"); 
      }
    } catch (err) {
      alert("Erro de conexão");
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* MODAL TUTORIAL ESTRATÉGICO */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-cyan-500/30 p-8 rounded-[2.5rem] max-w-md w-full shadow-[0_0_50px_rgba(34,211,238,0.2)] relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowTutorial(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <h2 style={{fontFamily:'Orbitron'}} className="text-amber-500 font-black text-xl uppercase italic">🐮 Manual da Mimosinha</h2>
              <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mt-1">Segredos da Matrix G25</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-amber-500 text-black font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</div>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white uppercase">Coordenadas:</strong> Na Dashboard, clique em <span className="text-cyan-400">"Trocar Coordenadas"</span> até encontrar sua combinação eleita.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-500 text-black font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</div>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white uppercase">Crédito:</strong> Use o botão <span className="text-cyan-400">"Gerar PIX"</span> para preparar seu sinal na rede.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-500 text-black font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</div>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white uppercase">Blockchain:</strong> Clique em <span className="text-cyan-400">"Confirmar Certificado"</span> para selar sua aposta de forma imutável.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-500 text-black font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">4</div>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white uppercase">Ativação:</strong> Pague o QR Code gerado para validar seu bilhete instantaneamente.</p>
              </div>
            </div>

            <button onClick={() => setShowTutorial(false)} className="w-full mt-10 bg-amber-500 py-4 rounded-xl text-black font-black uppercase text-xs hover:bg-amber-400 transition-all shadow-lg">ENTENDI, VAMOS VENCER!</button>
          </div>
        </div>
      )}

      {/* STEP 1: ACESSO AO SIMULADOR */}
      {step === 'bridge' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-6 text-center">
          <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
            <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase font-bold mb-4 italic">Acesso ao Simulador Matrix</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed uppercase font-bold">Processamento de coordenadas 100% auditado via Oráculo Blockchain.</p>
            <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500 transition-all font-elite">INICIAR TREINAMENTO</button>
          </div>
        </div>
      )}

      {/* STEP 2: CONTROLE DE ACESSO */}
      {step === 'age' && (
        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="bg-[#010409] border-2 border-red-600/50 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">18+</div>
            <h2 style={{fontFamily:'Orbitron'}} className="text-lg mb-2 uppercase text-white font-black">Controle de Acesso</h2>
            <p className="text-slate-500 text-[9px] mb-6 uppercase tracking-widest font-black">Identidade Obrigatória</p>
            <input type="date" className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none focus:border-red-500 font-bold" />
            <button onClick={handleAgeConfirm} className="w-full bg-[#10b981] py-5 rounded-2xl font-black uppercase text-xs shadow-xl font-elite transition-all hover:bg-emerald-500">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {/* STEP 3: SPLASH SCREEN + MANUAL ESTRATÉGICO */}
      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-[400px] md:max-w-[500px] mb-8 animate-pulse" alt="Logo" />
          <h4 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black uppercase text-2xl italic tracking-tighter shadow-yellow-500/50">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          
          <div className="w-64 h-1.5 bg-slate-800 mt-10 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_#eab308]" style={{width: progress+'%'}} />
          </div>
          
          {/* BOTÃO DO MANUAL INSERIDO ESTRATEGICAMENTE AQUI */}
          <button 
            onClick={() => setShowTutorial(true)}
            className="mt-6 flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 transition-all animate-bounce"
          >
            <HelpCircle size={14} /> Como vencer na Matrix?
          </button>

          <p className="text-yellow-500/30 text-[10px] mt-4 uppercase font-black tracking-widest">Sincronizando Protocolos Matrix...</p>
        </div>
      )}

      {/* STEP 4: FORMULÁRIO + REGULAMENTO */}
      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-[#010409]/95 border-b border-amber-500/20 px-6 md:px-10 py-6 flex justify-between items-center backdrop-blur-md">
            <h1 style={{fontFamily:'Orbitron'}} className="text-white text-lg tracking-tighter uppercase italic font-bold">MIMOSINHA<span className="text-amber-500 ml-1">G25</span></h1>
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-elite">
               <a href="#regulamento" className="hover:text-amber-500 transition-colors">Regulamento</a>
               <a href="/admin/central" className="hover:text-amber-500 transition-colors">Painel Admin</a>
               <a href="#" className="hover:text-amber-500 transition-colors">Suporte</a>
            </div>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-8 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center backdrop-blur-md mt-10">
            <h2 style={{fontFamily:'Orbitron'}} className="text-yellow-500 font-black text-xl md:text-2xl uppercase mb-1">Crie sua conta</h2>
            <p className="text-slate-400 text-[9px] mb-10 font-bold uppercase tracking-widest">Acesse a Matriz 25x25 (625 Combinações)</p>
            
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm text-white focus:border-yellow-500 outline-none font-bold" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail (Seu Login)" type="email" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm text-white focus:border-yellow-500 outline-none font-bold" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="Chave PIX (Para Receber Prêmios)" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm text-white focus:border-yellow-500 outline-none font-bold" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required placeholder="Sua Senha" type="password" className="w-full p-4 rounded-xl bg-[#010409] border border-slate-800 text-sm text-white focus:border-yellow-500 outline-none font-bold" onChange={e=>setForm({...form, senha: e.target.value})} />
              
              <div className="flex items-start gap-3 py-3">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-yellow-500" />
                <p className="text-[10px] text-slate-400 leading-tight italic font-medium">Eu declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade.</p>
              </div>

              <p className="text-center text-[9px] text-white font-black uppercase tracking-widest py-2 animate-pulse bg-cyan-950/30 rounded-lg">🔥 Junte-se a +50.000 jogadores no modo treino hoje</p>
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black font-elite uppercase text-xs shadow-xl transition-all hover:bg-yellow-400 text-black">CADASTRAR E JOGAR</button>
              
              <p className="mt-8 text-[10px] text-slate-400 uppercase font-black tracking-widest text-center">Já é membro? <span onClick={() => router.push('/login')} className="text-yellow-500 underline cursor-pointer italic ml-1">Entre aqui</span></p>
            </form>
          </div>

          <section id="regulamento" className="max-w-4xl w-full mt-20 bg-[#0d1117]/95 rounded-[3rem] border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-xl mb-20">
             <div className="p-10 text-center border-b border-slate-800 bg-slate-800/20">
                <h2 style={{fontFamily:'Orbitron'}} className="text-xl md:text-2xl font-black uppercase tracking-widest text-yellow-500 italic">Regulamento Oficial</h2>
                <p className="text-cyan-400 text-[10px] font-black uppercase mt-2 tracking-[0.3em]">Protocolos de Auditoria e Premiação</p>
             </div>
             
             <div className="divide-y divide-slate-800">
                <FaqItem 
                  title="ESCLARECIMENTO TÉCNICO E MATEMÁTICO" 
                  text="A 'Grupo25BetBrasil' é fundamentada em uma matriz tecnológica de 25x25, gerando 625 prognósticos exclusivos (x/y). Cada prognóstico corresponde a 16 milhares distintos. A integração total da malha (de 1/1 a 25/25) cobre exatamente 10.000 milhares (0000 a 9999), garantindo um ecossistema matemático sem duplicidades e 100% auditável via Oráculo Blockchain." 
                />
                
                <FaqItem 
                  title="DINÂMICA DE PONTUAÇÃO HORIZONTAL" 
                  text="Diferente de loterias convencionais, a vitória é determinada pela Horizontalidade: o 1º prêmio sorteado pontua exclusivamente a 1ª linha da sua matriz 5x5; o 2º sorteado pontua a 2ª linha, e sucessivamente até o 5º prêmio. Você tem 5 frentes distintas de pontuação por bilhete. Premiação garantida para quem cravar 5, 4, 3, 2 ou apenas 1 ponto na linha correspondente." 
                />
                
                <FaqItem 
                  title="PREMIAÇÃO E COMPLIANCE (LEI 13.756/2018)" 
                  text="Divisão da Arrecadação: Pool de Premiação (43,35%), Seguridade Social (17,32%), Segurança FNSP (9,26%), Educação FNDE (9,26%), Operação (9,57%) e Manutenção (11,24%). Cotas Oficiais do Pool: 5 PONTOS (50%), 4 PONTOS (20%), 3 PONTOS (15%), 2 PONTOS (10%) e 1 PONTO (5%), distribuídos em partes iguais entre os acertadores de cada faixa." 
                />
                
                <FaqItem 
                  title="PROTOCOLOS DE CASCATA E ACUMULAÇÃO" 
                  text="Fluxo de Cascata: Se não houver vencedores na faixa de 5 pontos, o valor de 50% é rateado e somado aos prêmios de 4, 3, 2 e 1 ponto. Caso não haja ganhadores em faixas subsequentes, o prêmio desce até a base, podendo o acertador de 1 ponto levar o prêmio total. Acumulação Total: Se não houver ganhadores em nenhuma faixa, 100% do pool é transferido para a rodada seguinte." 
                />

                <FaqItem 
                  title="MANUTENÇÃO E CUSTEIO" 
                  text="Conforme estabelecido no contrato inteligente, os percentuais remanescentes da arrecadação são destinados exclusivamente à manutenção técnica do sistema, segurança de dados e custeio operacional do certame." 
                />
             </div>
          </section>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}

function FaqItem({ title, text }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-8 flex justify-between items-center text-left text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white group">
        <span className={isOpen ? 'text-cyan-400' : 'text-white group-hover:text-yellow-500 transition-colors'}>{title}</span> 
        <span className="text-yellow-500 text-xl font-bold">{isOpen ? <Minus size={18}/> : <Plus size={18}/>}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
        <div className="px-10 py-6 text-white text-xs md:text-sm leading-relaxed font-bold border-t border-white/5 bg-black/40 mx-6 rounded-[2rem] text-justify">
          {text}
        </div>
      </div>
    </div>
  );
}

export default function Index() { return <Suspense fallback={null}><LandingContent /></Suspense>; }