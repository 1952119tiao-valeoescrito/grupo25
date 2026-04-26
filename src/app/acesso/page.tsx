"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function ConteudoAcesso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState('bridge'); // bridge ou age
  const [dataNasc, setDataNasc] = useState("");

  const irParaAgeGate = () => {
    setStep('age');
  };

  const confirmarEntrada = () => {
    if (!dataNasc) return alert("Por favor, insira sua data de nascimento.");
    
    // Lógica básica de verificação de idade
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) idade--;

    if (idade >= 18) {
      sessionStorage.setItem('veio_da_ponte', 'true');
      const ref = searchParams.get('ref') || "";
      router.push('/?bridge=true&ref=' + ref);
    } else {
      alert("Acesso negado para menores de 18 anos.");
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white font-sans">
      
      {/* TELA 1: INFORMAÇÃO DO SIMULADOR (PONTE) */}
      {step === 'bridge' && (
        <div className="bg-[#0d1117] border border-cyan-500/20 p-10 max-w-md w-full text-center rounded-[2.5rem] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛰️</div>
          <h1 style={{fontFamily:'Orbitron'}} className="text-xl text-cyan-400 uppercase tracking-widest mb-4">Acesso ao Simulador Matrix</h1>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Você está acessando a malha de treinamento 25x25. O processamento de coordenadas é 100% auditado via Blockchain.</p>
          <button onClick={irParaAgeGate} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-500 transition-all active:scale-95">INICIAR TREINAMENTO GRATUITO</button>
        </div>
      )}

      {/* TELA 2: CONTROLE DE ACESSO (O SEU PRINT COM BORDA VERMELHA) */}
      {step === 'age' && (
        <div className="bg-[#010409] border-2 border-red-600/50 p-12 rounded-[3rem] text-center max-w-md w-full shadow-[0_0_40px_rgba(220,38,38,0.2)] animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl shadow-lg">18+</div>
           
           <h2 style={{fontFamily:'Orbitron'}} className="text-2xl font-bold uppercase mb-2 tracking-tighter text-white">Controle de Acesso</h2>
           <p className="text-slate-500 text-[10px] mb-8 uppercase tracking-[0.3em] font-black">Verificação de Identidade Obrigatória</p>
           
           <div className="space-y-6">
              <input 
                type="date" 
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                className="w-full bg-[#0d1117] border border-slate-800 p-4 rounded-xl text-white text-center outline-none focus:border-red-500 transition-all font-mono"
              />
              
              <button 
                onClick={confirmarEntrada}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-black font-sans uppercase text-xs tracking-widest shadow-xl transition-all transform active:scale-95"
              >
                CONFIRMAR E ENTRAR
              </button>
              
              <button onClick={() => window.location.href='https://www.google.com'} className="text-slate-600 hover:text-red-500 text-[9px] font-bold uppercase tracking-[0.4em] transition-colors">
                SOU MENOR / SAIR
              </button>
           </div>
        </div>
      )}

      <style jsx global>{\
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
      \}</style>
    </div>
  );
}

export default function AcessoPonte() {
  return (
    <Suspense fallback={null}>
      <ConteudoAcesso />
    </Suspense>
  );
}
