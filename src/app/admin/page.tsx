"use client"
import { useState } from 'react';
import { ethers } from 'ethers';
import { Settings, Play, Users, Loader2 } from 'lucide-react';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [arrecadacao, setArrecadacao] = useState("");

  const dispararSorteio = async () => {
    if(!window.ethereum) return alert("Instale a MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", 
        ["function realizarSorteioOficial(uint256) external"], 
        signer
      );
      const tx = await contract.realizarSorteioOficial(parseFloat(arrecadacao) * 100);
      await tx.wait();
      alert("Sorteio Iniciado na Blockchain!");
    } catch (e) { alert("Erro ao interagir com o contrato"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="text-green-500" /> Gestão Bet-Grupo25</h1>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 max-w-md">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Play className="text-green-500" size={18}/> Iniciar Sorteio (VRF)</h2>
          <input 
            type="number" 
            placeholder="Total Arrecadado R$" 
            className="w-full bg-slate-950 p-4 rounded-xl text-2xl mb-6 outline-none border border-slate-800 focus:border-green-500" 
            onChange={(e)=>setArrecadacao(e.target.value)}
          />
          <button 
            onClick={dispararSorteio}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 p-5 rounded-2xl font-black transition-all flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "DISPARAR CHAINLINK VRF"}
          </button>
        </div>
      </div>
    </div>
  );
}