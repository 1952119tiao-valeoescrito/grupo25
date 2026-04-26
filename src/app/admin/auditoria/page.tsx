"use client"
import { useState } from 'react';
import { ShieldCheck, Calculator, Hash, ChevronRight } from 'lucide-react';

export default function Auditoria() {
  const [numbers, setNumbers] = useState({ p1: '', p2: '', p3: '', p4: '', p5: '' });
  const [results, setResults] = useState(null);

  const calcularGrupos = () => {
    const list = [];
    for (let i = 1; i <= 5; i++) {
      const val = numbers['p' + i];
      if (val && val.length >= 4) {
        const milhar = val.slice(-4);
        let d1 = parseInt(milhar.slice(0, 2));
        let d2 = parseInt(milhar.slice(2, 4));
        if (d1 === 0) d1 = 100;
        if (d2 === 0) d2 = 100;
        const g1 = Math.floor((d1 - 1) / 4) + 1;
        const g2 = Math.floor((d2 - 1) / 4) + 1;
        list.push({ prize: i, milhar, g1, g2, prog: g1 + '/' + g2 });
      }
    }
    setResults(list.length > 0 ? list : null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-900/50 border border-cyan-500/20 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md mb-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] mb-2 flex justify-center gap-2 items-center">
              <ShieldCheck size={16}/> Auditoria Matrix 25x25
            </h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Conversão oficial Milhar para Coordenadas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <label className="block text-[9px] font-black text-yellow-600 uppercase text-center">{i}º Prêmio</label>
                <input 
                  type="text" maxLength={4} placeholder="0000"
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center font-black text-cyan-400 focus:border-cyan-500 outline-none"
                  onChange={(e) => setNumbers({...numbers, ['p'+i]: e.target.value})}
                />
              </div>
            ))}
          </div>

          <button onClick={calcularGrupos} className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20">
            Simular Conversão Grupo25
          </button>
        </div>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in zoom-in duration-300">
            {results.map((res) => (
              <div key={res.prize} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] text-center">
                <p className="text-[9px] font-black text-yellow-500 uppercase mb-4">{res.prize}º Prêmio</p>
                <div className="space-y-4">
                  <div><span className="text-[8px] text-slate-500 block uppercase mb-1">Milhar</span><b className="text-white text-lg font-black">{res.milhar}</b></div>
                  <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-3">
                    <div><p className="text-[7px] text-slate-600 uppercase">G1</p><b className="text-emerald-500">{res.g1}</b></div>
                    <div><p className="text-[7px] text-slate-600 uppercase">G2</p><b className="text-blue-500">{res.g2}</b></div>
                  </div>
                  <div className="bg-cyan-500/10 py-2 rounded-xl border border-cyan-500/20">
                    <p className="text-[7px] text-cyan-500 font-bold uppercase">Prognóstico</p>
                    <b className="text-cyan-400 text-sm">{res.prog}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
