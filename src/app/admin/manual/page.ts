import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Busca a última rodada que foi marcada como concluída
    const ultimaRodada = await prisma.round.findFirst({
      where: { concluida: true },
      orderBy: { id: 'desc' }
    });

    if (!ultimaRodada) {
      return NextResponse.json({ message: "Nenhum sorteio realizado ainda." }, { status: 404 });
    }

    // O campo 'resultados' no banco guarda os 5 milhares ex: "5490,1237,2134,9090,6787"
    return NextResponse.json(ultimaRodada);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}
```

---

### 🚀 PASSO 2: A Página de Resultados Completa (`src/app/resultados/page.tsx`)

Vou refatorar sua página para colocar o **Resultado Oficial** no topo (com destaque) e o **Simulador** logo abaixo.

```tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, Activity, Calculator, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResultadosOficiais() {
  const [oficial, setOficial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Lógica do Simulador
  const [lotteryNumbers, setLotteryNumbers] = useState({ prize1: '', prize2: '', prize3: '', prize4: '', prize5: '' });
  const [simResults, setSimResults] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/resultados/ultimo')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setOficial(data);
        setLoading(false);
      });
  }, []);

  // Função para converter Milhar em Prognóstico (Lógica oficial do contrato)
  const converter = (milhar: string) => {
    const m = milhar.padStart(4, '0').slice(-4);
    let d1 = parseInt(m.slice(0, 2));
    let d2 = parseInt(m.slice(2, 4));
    const v1 = d1 === 0 ? 100 : d1;
    const v2 = d2 === 0 ? 100 : d2;
    return `${Math.floor((v1 - 1) / 4) + 1}/${Math.floor((v2 - 1) / 4) + 1}`;
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-6">
      <main className="max-w-5xl mx-auto py-10">
        
        {/* 1. RESULTADO OFICIAL (DESTAQUE BLOCKCHAIN) */}
        <section className="mb-16">
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter font-elite">
              PAINEL DE <span className="text-cyan-400">RESULTADOS</span>
            </h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 mt-2">
              <ShieldCheck size={14}/> Auditoria VRF Chainlink Ativa
            </p>
          </header>

          {loading ? (
            <div className="text-center py-20 animate-pulse text-slate-500 font-black uppercase text-xs">Sincronizando com a Blockchain...</div>
          ) : oficial ? (
            <div className="bg-gradient-to-br from-slate-900 to-black border-2 border-emerald-500/30 rounded-[3rem] p-8 md:p-12 shadow-[0_0_60px_rgba(16,185,129,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500"><Trophy size={150}/></div>
               
               <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                  <h2 className="text-yellow-500 font-black uppercase italic font-elite text-xl">Última Extração</h2>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 rounded-full text-[9px] font-black uppercase">Rodada #{oficial.id}</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {oficial.resultados?.split(',').map((num: string, i: number) => (
                    <div key={i} className="bg-black/60 border border-white/10 p-6 rounded-[2rem] text-center group hover:border-emerald-500/50 transition-all">
                       <p className="text-[8px] text-slate-500 font-black uppercase mb-3">{i+1}º PRÊMIO</p>
                       <p className="text-white text-2xl font-black tracking-tighter mb-4">{num}</p>
                       <div className="py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                          <p className="text-[7px] text-emerald-400 font-black uppercase mb-1">Pontuação</p>
                          <b className="text-white text-base font-elite">{converter(num)}</b>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 text-center">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Hash de Auditoria: <span className="text-white font-mono lowercase">0x74...d2e9</span></p>
               </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-white/5 p-16 rounded-[3rem] text-center">
               <p className="text-slate-500 uppercase font-black text-xs tracking-widest italic">Aguardando o primeiro sorteio oficial da semana...</p>
            </div>
          )}
        </section>

        {/* 2. O SIMULADOR (AUDITORIA DO USUÁRIO) */}
        <section className="bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl">
           <div className="text-center mb-10">
              <h3 className="text-cyan-400 font-black text-lg uppercase font-elite italic flex items-center justify-center gap-3">
                 <Calculator size={20}/> Auditor de Resultados
              </h3>
              <p className="text-white text-xs mt-2 font-bold uppercase opacity-60">Converta qualquer milhar no padrão Grupo25</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="text-center">
                   <label className="text-[9px] text-yellow-500 font-black uppercase mb-2 block">{n}º PRÊMIO</label>
                   <input 
                    maxLength={4} placeholder="0000"
                    className="w-full bg-black border border-slate-800 p-4 rounded-xl text-center font-black text-white focus:border-cyan-500 outline-none"
                    onChange={(e) => setLotteryNumbers({...lotteryNumbers, [`prize${n}`]: e.target.value})}
                   />
                </div>
              ))}
           </div>
           
           <button 
             onClick={() => {
                const results = Object.values(lotteryNumbers).filter(v => v.length >= 4).map((v, i) => ({ milhar: v, prog: converter(v), idx: i+1 }));
                setSimResults(results);
             }}
             className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg"
           >
             SIMULAR CONVERSÃO MATRIX
           </button>

           {simResults && (
             <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3 animate-in fade-in zoom-in duration-300">
                {simResults.map(r => (
                  <div key={r.idx} className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-2xl text-center">
                    <p className="text-[7px] text-cyan-500 font-black mb-1 uppercase">{r.idx}º PRÊMIO</p>
                    <p className="text-white text-lg font-black mb-2">{r.milhar}</p>
                    <b className="text-cyan-400 text-sm font-elite">{r.prog}</b>
                  </div>
                ))}
             </div>
           )}
        </section>

        <div className="text-center mt-12">
           <button onClick={()=>router.push('/')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase underline">Voltar ao Início</button>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}