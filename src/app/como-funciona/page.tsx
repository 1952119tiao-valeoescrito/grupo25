"use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, Zap, ShieldCheck, Target, Wallet, MousePointer2, ArrowRight, Menu, X, Mail, MessageSquare } from 'lucide-react';

export default function ComoFuncionaCompleto() {
  const canvasRef = useRef(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        gridAnim.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.25)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      gridAnim.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.15;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />
      
      {/* HEADER COM MENU HAMBÚRGUER */}
      <nav className="fixed top-0 w-full z-[100] bg-black/90 backdrop-blur-xl border-b border-white/10 py-5 px-6 font-elite text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all text-[10px] uppercase font-black">
            <ChevronLeft size={18} /> Início
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            BET-GRUPO25<span className="text-cyan-400">.OFICIAL</span>
          </h1>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col p-8 gap-6 text-center">
               <Link href="/" onClick={()=>setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest hover:text-cyan-400">Página Inicial</Link>
               <Link href="/register" onClick={()=>setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-yellow-500">Criar Conta</Link>
               <Link href="/login" onClick={()=>setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest hover:text-cyan-400">Acessar Matrix</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        
        <header className="text-center mb-20">
          <Trophy size={48} className="text-cyan-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 font-elite text-white">
            GUIA <span className="text-cyan-400">COMPLETO</span>
          </h2>
          <p className="text-[#ff00ff] text-[10px] md:text-xs uppercase tracking-[0.5em] font-black drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] text-white">Transparência Blockchain & Matemática Pura</p>
        </header>

        {/* 1. O QUE É A BET-GRUPO25? */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[3rem] mb-10 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-6 uppercase flex items-center gap-3 font-elite text-white">
            <Zap className="text-[#ff00ff]" /> O QUE É A BET-GRUPO25?
          </h3>
          <p className="text-white leading-relaxed mb-8 text-lg font-bold">
            Somos uma loteria de prognósticos de última geração baseada em uma matriz <span className="text-[#ff00ff] font-black">25x25</span> que gera 625 combinações auditadas e imutáveis.
          </p>
          <div className="bg-black/80 p-8 rounded-[2rem] border border-cyan-500/20 space-y-6 font-black text-sm md:text-base text-white">
            <p className="flex gap-4 items-start"><span className="text-cyan-400 mt-1">●</span> Cada coordenada (x/y) corresponde a 16 milhares diferentes.</p>
            <p className="flex gap-4 items-start"><span className="text-cyan-400 mt-1">●</span> Cobertura total de 10.000 milhares (do 0000 ao 9999).</p>
            <p className="flex gap-4 items-start"><span className="text-cyan-400 mt-1">●</span> Resultados gerados via Chainlink VRF na rede Base Mainnet.</p>
          </div>
        </section>

        {/* 2. LOGICA DE PONTUAÇÃO (HORIZONALIDADE) */}
        <section className="bg-gradient-to-br from-slate-900 via-black to-[#0d1117] border-2 border-cyan-500/30 rounded-[4rem] p-8 md:p-16 mb-10 shadow-xl">
          <h3 className="text-yellow-500 font-black text-2xl md:text-4xl uppercase mb-10 italic flex items-center gap-4 font-elite text-white">
            <Target size={32}/> A Mágica da Horizontalidade
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-black/60 p-8 rounded-3xl border-l-8 border-cyan-500">
                <h4 className="text-cyan-400 font-black mb-4 uppercase text-lg underline decoration-cyan-500/30">SINCRONIA POR LINHAS</h4>
                <p className="text-white font-black text-sm md:text-base leading-relaxed">
                  Cada prognóstico sorteado do <span className="text-cyan-400 italic">1º ao 5º prêmio</span> pontua o prognóstico contido na **LINHA CORRESPONDENTE** da sua matriz 5x5.
                </p>
                <div className="mt-6 p-4 bg-cyan-950/30 rounded-xl border border-cyan-500/20">
                   <p className="text-white text-[11px] font-bold uppercase leading-relaxed">
                     Ou seja: O 1º sorteio pontua apenas a 1ª linha, o 2º sorteio a 2ª linha, e assim sucessivamente. Você tem 5 chances por linha!
                   </p>
                </div>
              </div>
              <div className="bg-black/60 p-8 rounded-3xl border-l-8 border-[#ff00ff]">
                <h4 className="text-[#ff00ff] font-black mb-4 uppercase text-lg underline decoration-[#ff00ff]/30 text-white">VITÓRIA COM 1 PONTO</h4>
                <p className="text-white font-black text-sm md:text-base leading-relaxed">
                  Acertou apenas 1 coordenada na horizontal correspondente ao prêmio? **VOCÊ JÁ GANHOU!** Pagamos prêmios para faixas de 1, 2, 3, 4 e 5 pontos.
                </p>
              </div>
            </div>

            {/* MATRIX VISUAL COM NUMERAÇÃO DE PRÊMIOS */}
            <div className="bg-slate-950 p-6 md:p-10 rounded-[3rem] border-4 border-cyan-500/20 shadow-2xl relative">
               <div className="flex flex-col gap-3">
                  {[0,1,2,3,4].map((row) => (
                    <div key={row} className="flex items-center gap-3">
                       {/* NUMERAÇÃO À ESQUERDA */}
                       <div className="w-16 md:w-20 text-right">
                          <span className="text-[8px] md:text-[10px] font-black text-cyan-400 uppercase tracking-tighter whitespace-nowrap">
                            {row + 1}º PRÊMIO
                          </span>
                       </div>
                       {/* LINHA DA MATRIZ */}
                       <div className="flex-1 grid grid-cols-5 gap-1.5 md:gap-2 text-white">
                          {[0,1,2,3,4].map((col) => (
                             <div key={col} className={`aspect-square rounded-lg flex items-center justify-center text-[9px] md:text-xs font-black border ${row === 0 ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-900 border-white/5 text-white/40'}`}>
                                {Math.floor(Math.random()*25)+1}/{Math.floor(Math.random()*25)+1}
                             </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
               <p className="text-[10px] text-cyan-400 font-black uppercase text-center mt-8 tracking-widest text-white">Exemplo: Prognósticos da 1ª linha concorrendo ao 1º prêmio sorteado</p>
            </div>
          </div>
        </section>

        {/* 3. PROCEDIMENTO DE APOSTA */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[3rem] mb-12 shadow-2xl">
          <h3 className="text-2xl font-black text-cyan-400 mb-12 uppercase font-elite text-center text-white">PROCEDIMENTO DE APOSTA</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
               <div className="w-20 h-20 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MousePointer2 className="text-cyan-400" size={36} />
               </div>
               <h4 className="text-white font-black uppercase text-sm mb-2">1. GERE A MATRIZ</h4>
               <p className="text-white text-[11px] font-bold leading-relaxed uppercase opacity-80">No dashboard, troque as coordenadas até encontrar sua malha vencedora.</p>
            </div>
            <div className="text-center group">
               <div className="w-20 h-20 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="text-yellow-500" size={36} />
               </div>
               <h4 className="text-white font-black uppercase text-sm mb-2 text-white">2. PAGUE O PIX</h4>
               <p className="text-white text-[11px] font-bold leading-relaxed uppercase opacity-80">R$ 10,00 via Mercado Pago. O crédito cai na hora e valida sua aposta.</p>
            </div>
            <div className="text-center group">
               <div className="w-20 h-20 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-emerald-500" size={36} />
               </div>
               <h4 className="text-white font-black uppercase text-sm mb-2 text-white">3. AUTENTIQUE</h4>
               <p className="text-white text-[11px] font-bold leading-relaxed uppercase opacity-80 text-white">Confirme o certificado e tenha seu bilhete digital autenticado no sistema.</p>
            </div>
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="text-center bg-white text-black p-12 md:p-16 rounded-[4rem] shadow-2xl">
          <h3 className="text-3xl md:text-5xl font-black uppercase italic mb-8 font-elite leading-none tracking-tighter">PRONTO PARA ENTRAR NA MATRIX?</h3>
          <button 
            onClick={() => router.push('/register')}
            className="bg-cyan-600 hover:bg-black text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-4 mx-auto border-4 border-transparent hover:border-cyan-500 shadow-xl"
          >
            CRIAR MINHA IDENTIDADE <ArrowRight size={20} />
          </button>
        </section>

        <footer className="mt-32 border-t border-white/10 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left text-white font-black uppercase">
            <div>
              <h4 className="text-cyan-400 text-xs tracking-widest mb-8 font-elite">Suporte Matrix</h4>
              <ul className="space-y-5 text-[10px]">
                <li className="flex items-center justify-center md:justify-start gap-3">suporte@blockchain-betbrasil.io</li>
                <li className="flex items-center justify-center md:justify-start gap-3 text-emerald-400">WhatsApp: +55 (21) 99352-7957</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 text-xs tracking-widest mb-8 font-elite text-white">Acesso Rápido</h4>
              <ul className="space-y-5 text-[10px]">
                <li><Link href="/" className="hover:text-cyan-400 transition-all">Página Principal</Link></li>
                <li><Link href="/register" className="text-yellow-500">Guia Passo-a-Passo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 text-xs tracking-widest mb-8 font-elite text-white">Segurança</h4>
              <p className="text-[9px] leading-relaxed opacity-60">
                Auditoria Oráculo Chainlink VRF. <br/> Resultados imutáveis na rede Base.
              </p>
            </div>
          </div>
          <div className="mt-24 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.8em] text-white">
            © 2026 BET-GRUPO25 | PROTOCOLOS ELITE ATIVOS
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}