"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, Activity, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

interface IResult {
  prizeNum: number;
  milhar: string;
  dezena1: number;
  dezena2: number;
  grupo1: number;
  grupo2: number;
  prognostico: string;
}

export default function ResultadosOficiais() {
  const router = useRouter();
  const canvasRef = useRef(null);
  
  // Estados do Simulador
  const [lotteryNumbers, setLotteryNumbers] = useState({
    prize1: '', prize2: '', prize3: '', prize4: '', prize5: '',
  });
  const [results, setResults] = useState<IResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Efeito Matrix no Fundo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let i = 0; i < 80; i++) {
        gridAnim.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(s => {
        s.c++;
        if(Math.random() > 0.98) s.text = coords[Math.floor(Math.random() * 625)];
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.08;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')';
        ctx.fillText(s.text, s.x, s.y);
      });
      requestAnimationFrame(draw);
    }; draw();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, prizeNum: number) => {
    if (/^\d*$/.test(e.target.value)) {
      setLotteryNumbers({
        ...lotteryNumbers,
        [`prize${prizeNum}`]: e.target.value,
      });
    }
  };

  const handleSimulate = () => {
    setResults(null);
    setErrorMessage(null);
    const allResults: IResult[] = [];
    
    for (let i = 1; i <= 5; i++) {
      const numStr = lotteryNumbers[`prize${i}` as keyof typeof lotteryNumbers];
      if (numStr && numStr.length >= 4) {
        const milharStr = numStr.slice(-4);
        let d1 = parseInt(milharStr.slice(0, 2), 10);
        let d2 = parseInt(milharStr.slice(2, 4), 10);
        
        // Regra de Conversão: 00 vira 100 para o cálculo de grupos
        const val1 = d1 === 0 ? 100 : d1;
        const val2 = d2 === 0 ? 100 : d2;
        
        const g1 = Math.floor((val1 - 1) / 4) + 1;
        const g2 = Math.floor((val2 - 1) / 4) + 1;
        
        allResults.push({
          prizeNum: i,
          milhar: milharStr,
          dezena1: val1,
          dezena2: val2,
          grupo1: g1,
          grupo2: g2,
          prognostico: `${g1}/${g2}`
        });
      }
    }
    
    if (allResults.length === 0) {
      setErrorMessage('Insira ao menos um milhar (4 dígitos) para auditar.');
      return;
    }
    setResults(allResults);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* HEADER */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
               <Activity size={40} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2" style={{fontFamily: 'Orbitron'}}>
            RESULTADOS <span className="text-cyan-400">OFICIAIS</span>
          </h1>
          <p className="text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
            <CheckCircle2 size={14}/> Auditado via Base Mainnet & Neon DB
          </p>
        </header>

        {/* CONTAINER DO SIMULADOR */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl mb-12 border-t-cyan-500/30">
          <div className="text-center mb-10">
             <h2 className="text-yellow-500 font-black text-xl md:text-2xl uppercase font-elite italic flex items-center justify-center gap-3">
               <Calculator size={24}/> Auditor de Sorteio Matrix
             </h2>
             <p className="text-white mt-4 text-sm font-medium leading-relaxed max-w-2xl mx-auto">
                Utilize esta ferramenta para converter os milhares sorteados no padrão 25x25. 
                A transparência é a nossa base: audite você mesmo o resultado.
             </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* GRID DE INPUTS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="text-center space-y-2">
                  <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest">{num}º PRÊMIO</label>
                  <input 
                    type="text" 
                    placeholder="0000"
                    value={lotteryNumbers[`prize${num}` as keyof typeof lotteryNumbers]}
                    onChange={(e) => handleInputChange(e, num)}
                    className="w-full bg-black/60 border-2 border-slate-800 rounded-2xl py-4 text-center text-white font-black text-lg focus:border-cyan-500 transition-all outline-none shadow-inner"
                    maxLength={5}
                  />
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="mb-8 p-4 rounded-2xl text-center text-xs font-black uppercase bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center gap-2">
                <AlertCircle size={16}/> {errorMessage}
              </div>
            )}

            <button 
                onClick={handleSimulate} 
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-95"
            >
              SIMULAR CONVERSÃO GRUPO25
            </button>
          </div>

          {/* RESULTADOS DA CONVERSÃO */}
          {results && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {results.map((res) => (
                <div key={res.prizeNum} className="p-6 bg-black/80 rounded-[2.5rem] border-2 border-cyan-500/20 text-center relative overflow-hidden group hover:border-cyan-400 transition-all">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                  
                  <h4 className="font-black text-[10px] text-yellow-500 mb-4 uppercase tracking-tighter">{res.prizeNum}º PRÊMIO</h4>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Milhar</span>
                      <b className="text-white text-xl font-black tracking-tight">{res.milhar}</b>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                      <div className="bg-slate-900/50 p-2 rounded-lg">
                        <p className="text-[8px] text-slate-500 uppercase font-black">GRUPO X</p>
                        <b className="text-cyan-400 text-sm font-black">{res.grupo1}</b>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded-lg">
                        <p className="text-[8px] text-slate-500 uppercase font-black">GRUPO Y</p>
                        <b className="text-cyan-400 text-sm font-black">{res.grupo2}</b>
                      </div>
                    </div>

                    <div className="bg-cyan-500/10 py-3 rounded-2xl border border-cyan-500/30 mt-2">
                      <p className="text-[8px] text-cyan-400 uppercase font-black tracking-widest mb-1">Prognóstico</p>
                      <b className="text-white text-base font-black italic">{res.prognostico}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MENSAGEM DE AGUARDANDO (SÓ APARECE SE NÃO HOUVER SIMULAÇÃO) */}
        {!results && (
          <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-16 text-center">
             <Trophy size={48} className="text-white/10 mx-auto mb-6" />
             <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">Aguardando dados para auditoria</p>
          </div>
        )}

        <div className="text-center mt-12 pb-20">
          <button 
            onClick={() => router.push('/')} 
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest border-b border-transparent hover:border-white/20 pb-1"
          >
            <ChevronLeft size={16} /> Voltar ao Painel Matrix
          </button>
        </div>

      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}

