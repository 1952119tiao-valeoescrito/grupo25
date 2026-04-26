"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConteudoPonte() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const iniciarSequenciaMaster = () => {
    sessionStorage.setItem('veio_da_ponte', 'true');
    const ref = searchParams.get('ref') || "";
    router.push('/register?bridge=true&ref=' + ref);
  };

  return (
    <div className="bg-slate-900/80 border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl backdrop-blur-md">
        <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <span className="text-4xl">🛰️</span>
        </div>
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4 italic text-center">Protocolo Matrix</h1>
        <p className="text-slate-400 text-sm mb-12 leading-relaxed text-center">
          Você está prestes a acessar a malha de treinamento 25x25. <br/>
          O processamento de coordenadas é 100% auditado via Oráculo Blockchain na Base Mainnet.
        </p>
        <button 
          onClick={iniciarSequenciaMaster}
          className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all transform active:scale-95"
        >
          INICIAR CONEXÃO MATRIX
        </button>
    </div>
  );
}

export default function AcessoPonte() {
  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans">
      <Suspense fallback={<div className="text-cyan-500 font-bold animate-pulse uppercase text-xs">Carregando Protocolo...</div>}>
        <ConteudoPonte />
      </Suspense>
    </div>
  );
}
