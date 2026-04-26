const fs = require('fs');

const files = {
  // 1. ATUALIZAÇÃO DA PÁGINA INICIAL (COM LÓGICA DE PIX)
  'src/app/page.tsx': `
"use client"
import { useState } from 'react';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '', email: '', pixKey: '' });

  const gerarPix = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prognosticos: ["1/2", "3/4"], rodadaId: 1 })
      });
      const data = await res.json();
      if (data.qrCode) setQrCode(data.qrCode);
      else alert("Erro ao gerar PIX. Verifique seu Token no .env");
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center py-12 px-4 text-white">
      <header className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-xl shadow-lg shadow-green-900/40"><Trophy size={28} /></div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Bet-Grupo25</h1>
        </div>
      </header>

      <main className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-2xl font-bold mb-8">Monte sua Aposta</h2>
          
          {!qrCode ? (
            <div className="space-y-4">
              <input placeholder="Seu CPF" className="w-full" onChange={(e)=>setForm({...form, cpf: e.target.value})} />
              <input placeholder="E-mail" className="w-full" onChange={(e)=>setForm({...form, email: e.target.value})} />
              <input placeholder="Chave PIX para prêmio" className="w-full" onChange={(e)=>setForm({...form, pixKey: e.target.value})} />
              <button 
                onClick={gerarPix}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 p-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "PAGAR R$ 10,00 VIA PIX"} <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 bg-white rounded-3xl">
              <p className="text-black font-bold mb-4 text-sm uppercase">Escaneie para pagar</p>
              <QRCodeSVG value={qrCode} size={200} />
              <button onClick={()=>setQrCode("")} className="mt-6 text-slate-500 text-xs underline">Voltar</button>
            </div>
          )}
        </section>

        <section className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2"><Scale className="text-green-500" /> Transparência Legal</h2>
          <div className="space-y-5 text-sm text-slate-400 font-mono">
             <div className="flex justify-between"><span>Seguridade Social (17,32%)</span><span className="text-green-400 font-bold">R$ 0,00</span></div>
             <div className="flex justify-between"><span>Segurança Pública (9,26%)</span><span className="text-green-400 font-bold">R$ 0,00</span></div>
             <div className="flex justify-between"><span>Educação (9,26%)</span><span className="text-green-400 font-bold">R$ 0,00</span></div>
             <div className="pt-6 text-[10px] italic">Sorteio auditado via Chainlink VRF</div>
          </div>
        </section>
      </main>
    </div>
  );
}`,

  // 2. ATUALIZAÇÃO DO ADMIN (PARA FALAR COM A BLOCKCHAIN)
  'src/app/admin/page.tsx': `
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
}`
};

Object.entries(files).forEach(([name, content]) => fs.writeFileSync(name, content.trim()));
console.log("🚀 Integração concluída! O site agora gera QR Code e fala com a Blockchain.");
