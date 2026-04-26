"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';
export default function MeusBilhetes() {
  const [apostas, setApostas] = useState([]);
  useEffect(() => {
    const email = localStorage.getItem('usuario_email');
    if (email) fetch('/api/apostas/minhas?email=' + email).then(res => res.json()).then(setApostas);
  }, []);
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-cyan-400 mb-8 uppercase italic">Meus Bilhetes</h1>
        <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
          {apostas.map(a => (
            <div key={a.id} className="p-6 border-b border-white/5 flex justify-between items-center">
              <div><p className="font-bold">#${a.id.substring(0,8)}</p><p className="text-xs text-slate-500">Rodada ${a.rodadaId}</p></div>
              <div>{a.pago ? <span className="text-emerald-400 text-xs font-bold">PAGO</span> : <span className="text-yellow-500 text-xs font-bold">AGUARDANDO</span>}</div>
            </div>
          ))}
          <Link href="/" className="block p-6 text-center text-xs text-slate-500 underline">Voltar ao Jogo</Link>
        </div>
      </div>
    </div>
  );
}