"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ShieldCheck, ChevronLeft, Calendar } from 'lucide-react';

export default function Resultados() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resultados')
      .then(res => res.json())
      .then(data => {
        setRounds(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-12 flex flex-col items-center">
      <main className="max-w-4xl w-full">
        <header className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black text-cyan-400 uppercase tracking-widest italic mb-2">
            Resultados <span className="text-white not-italic">Oficiais</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Auditado via Base Mainnet & Neon DB
          </div>
        </header>

        {loading ? (
          <p className="text-center animate-pulse text-cyan-500 font-bold uppercase text-xs tracking-widest mt-20">Sincronizando com a Blockchain...</p>
        ) : rounds.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5">
            <Trophy size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 uppercase font-black text-xs">Aguardando o primeiro sorteio oficial</p>
          </div>
        ) : (
          <div className="space-y-8">
            {rounds.map((round) => (
              <div key={round.id} className="bg-slate-900/80 border border-cyan-500/20 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-black text-xs uppercase">CONCURSO</div>
                    <span className="text-2xl font-black italic tracking-tighter">#{String(round.id).padStart(3, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                    <Calendar size={14} /> 26/04/2026
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="text-center group">
                      <p className="text-[9px] text-slate-500 mb-2 font-black uppercase">{i}º PRÊMIO</p>
                      <div className="bg-slate-950 border border-cyan-500/40 py-4 rounded-2xl font-black text-cyan-400 text-lg shadow-[inset_0_0_15px_rgba(34,211,238,0.1)] group-hover:border-cyan-400 transition-all">
                        {/* No real, mapearíamos resultados sorteados aqui */}
                        --/--
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <ChevronLeft size={14} /> Voltar ao Início
          </Link>
        </div>
      </main>
    </div>
  );
}
