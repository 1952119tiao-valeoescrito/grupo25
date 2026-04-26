"use client"
import { useState } from 'react';
import { ethers } from 'ethers';
import { Settings, Play, Users, ShieldAlert, Loader2 } from 'lucide-react';
import ABI from '@/lib/abi.json';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [arrecadacao, setArrecadacao] = useState("");
  const [ganhadores, setGanhadores] = useState([0,0,0,0,0,0]);

  const handleDraw = async () => {
    if(!window.ethereum) return alert("Instale a MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.realizarSorteioOficial(parseFloat(arrecadacao) * 100);
      await tx.wait();
      alert("Sorteio iniciado com sucesso!");
    } catch (e) { alert("Erro: " + e.message); }
    setLoading(false);
  };

  const handleFinish = async () => {
    if(!window.ethereum) return alert("Instale a MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, ABI, signer);
      const rodadaId = await contract.rodadaAtual();
      const tx = await contract.encerrarRodada(rodadaId, ganhadores);
      await tx.wait();
      alert("Rodada encerrada e rateio concluído!");
    } catch (e) { alert("Erro: " + e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans flex flex-col items-center">
      <div className="max-w-5xl w-full space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="text-cyan-500" /> Gestão Bet-Grupo25</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Play className="text-green-500" size={18}/> Iniciar Sorteio Oficial</h2>
            <input type="number" value={arrecadacao} onChange={(e)=>setArrecadacao(e.target.value)} className="w-full bg-slate-950 p-4 rounded-xl text-2xl mb-6 outline-none border border-slate-800" placeholder="R$ 0,00" />
            <button onClick={handleDraw} disabled={loading} className="w-full bg-green-600 p-5 rounded-2xl font-black hover:bg-green-500 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "DISPARAR CHAINLINK VRF"}
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Users className="text-blue-500" size={18}/> Definir Ganhadores</h2>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1,2,3,4,5].map(i => (
                <div key={i}>
                  <label className="text-[8px] text-slate-500 block text-center mb-1">{i} PTS</label>
                  <input type="number" value={ganhadores[i]} onChange={(e) => {
                    const newG = [...ganhadores];
                    newG[i] = parseInt(e.target.value) || 0;
                    setGanhadores(newG);
                  }} className="w-full bg-slate-950 p-2 rounded-lg text-center border border-slate-800" />
                </div>
              ))}
            </div>
            <button onClick={handleFinish} disabled={loading} className="w-full bg-blue-600 p-5 rounded-2xl font-black hover:bg-blue-500 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "ENCERRAR RODADA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
