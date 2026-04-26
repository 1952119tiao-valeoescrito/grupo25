"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function ConteudoAcesso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState('bridge');
  const [dataNasc, setDataNasc] = useState("");

  const confirmarEntrada = () => {
    if (!dataNasc) return alert("Insira sua data de nascimento.");
    sessionStorage.setItem('veio_da_ponte', 'true');
    router.push('/?bridge=true&ref=' + (searchParams.get('ref') || ""));
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans">
      {step === 'bridge' ? (
        <div className="bg-[#0d1117] border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
          <h1 className="text-xl text-cyan-400 uppercase font-bold mb-4">Acesso ao Simulador Matrix</h1>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">Processamento de coordenadas 100% auditado via Blockchain.</p>
          <button onClick={() => setStep('age')} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-cyan-500">INICIAR CONEXÃO</button>
        </div>
      ) : (
        <div className="bg-[#010409] border-2 border-red-600/50 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl">
           <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">18+</div>
           <h2 className="text-2xl font-bold uppercase mb-2">Controle de Acesso</h2>
           <p className="text-slate-500 text-[10px] mb-8 uppercase font-black">Verificação Obrigatória</p>
           <input type="date" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center mb-6 outline-none" />
           <button onClick={confirmarEntrada} className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl">CONFIRMAR E ENTRAR</button>
        </div>
      )}
    </div>
  );
}

export default function AcessoPage() {
  return <Suspense fallback={null}><ConteudoAcesso /></Suspense>;
}
