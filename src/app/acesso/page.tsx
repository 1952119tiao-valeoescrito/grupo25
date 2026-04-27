"use client"
import { useRouter } from 'next/navigation';

export default function AcessoPonte() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#010409] text-white flex items-center justify-center p-6" style={{fontFamily: 'Orbitron, sans-serif'}}>
      <div className="bg-[#0f172a]/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
        <h1 className="text-xl text-cyan-400 uppercase tracking-widest mb-4">Acesso ao Simulador Matrix</h1>
        <p className="text-slate-400 text-sm mb-10 font-sans leading-relaxed">Você está acessando a malha de treinamento 25x25. O processamento de coordenadas é 100% auditado via Blockchain.</p>
        <button onClick={() => router.push('/')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-500 transition-all active:scale-95">
          INICIAR TREINAMENTO GRATUITO
        </button>
      </div>
    </div>
  );
}