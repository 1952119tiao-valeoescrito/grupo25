"use client"
import { useState, useEffect } from 'react';
import { ethers } from 'ethers'; 
import { ShieldAlert, Zap, Trophy, Users, Terminal, Loader2, Wallet, CheckCircle2, Globe, Database, DollarSign, RefreshCw, PlusCircle, Settings } from 'lucide-react';
import ABI from '@/lib/abi.json'; 

export default function PainelAdminMaster() {
  const [tab, setTab] = useState('stats'); 
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [ganhadores, setGanhadores] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ arrecadacao: 'R$ 0,00', totalPagos: 0 });

  useEffect(() => {
    fetch('/api/admin/resumo').then(res => res.json()).then(data => {
      if (!data.error) setStats(data);
      const winners = data.entradas?.filter((t:any) => t.status_pagamento?.includes('GANHADOR'));
      setGanhadores(winners || []);
    });
  }, []);

  // --- 🔗 FUNÇÃO WEB3 CORRIGIDA (EVITA NaN E VALIDA ARRECADAÇÃO) ---
  const handleSorteioOficialBlockchain = async () => {
    if(!(window as any).ethereum) return alert("Instale a MetaMask para disparar na Blockchain!");
    
    // Converte para número e garante que não seja NaN
    const bilhetesPagos = Number(stats.totalPagos) || 0;

    // O contrato inteligente exige arrecadação > 0
    if (bilhetesPagos === 0) {
        return alert("Erro: Não existem bilhetes pagos para processar a arrecadação oficial!");
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      
      if (!contractAddress) throw new Error("Endereço do contrato não configurado na Vercel.");

      const contract = new ethers.Contract(contractAddress, ABI, signer);
      
      // Cálculo: 1 bilhete = R$ 10,00
      const valorArrecadacao = bilhetesPagos * 10;
      
      console.log("Enviando arrecadação:", valorArrecadacao);
      
      const tx = await contract.realizarSorteioOficial(valorArrecadacao);
      
      alert(`Solicitação enviada (R$ ${valorArrecadacao},00). Confirme o gás na sua MetaMask...`);
      await tx.wait();
      alert("✅ Sorteio Blockchain Iniciado! O Oráculo Chainlink VRF está processando os números. Aguarde 2 minutos e confira o resultado oficial.");
      window.location.reload();
      
    } catch (e: any) {
      console.error(e);
      alert("Erro na Transação: " + (e.reason || e.message || "Verifique seu saldo de ETH/LINK"));
    }
    setLoading(false);
  };

  // --- 🟢 FUNÇÕES WEB2 (BANCO NEON) ---
  const iniciarNovaRodada = async () => {
    if (!secret) return alert("Chave Admin Requerida! Digite a senha na aba 'Sorteio'.");
    if (!confirm("CUIDADO: Isso zerará os dados na tela para o próximo certame. Confirmar?")) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/rounds/next', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }) 
      });
      const data = await res.json();
      if (res.ok) { alert(data.message); window.location.reload(); }
      else alert(data.error);
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  const dispararContingencia = async () => {
    if (!secret) return alert("Chave Admin Requerida!");
    if (!confirm("CONFIRMAR SORTEIO MANUAL? Esta ação calculará os pontos localmente.")) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contingencia', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }) 
      });
      if (res.ok) alert("Sorteio e Auditoria Local Concluídos!");
      else alert("Erro no disparo");
    } catch (e) { alert("Erro de rede"); }
    setLoading(false);
  };

  const baixarPremio = async (id: string) => {
    if (!confirm("Confirma pagamento via Pix?")) return;
    const res = await fetch('/api/admin/payout', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: id, secret }) 
    });
    if (res.ok) { alert("Baixa realizada!"); setGanhadores(ganhadores.filter(g => g.id !== id)); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
           <div className="flex items-center gap-4">
              <div className="bg-red-600 p-3 rounded-2xl shadow-lg"><ShieldAlert size={28}/></div>
              <h1 className="text-2xl font-black uppercase italic font-elite tracking-tighter text-white">Central de Comando G25</h1>
           </div>
           <div className="flex gap-2">
              {['stats', 'sorteio', 'financeiro'].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                   {t === 'stats' ? 'Dashboard' : t === 'sorteio' ? 'Sorteio' : 'Financeiro'}
                </button>
              ))}
           </div>
        </header>

        {tab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
             <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-2">Arrecadação</p>
                <h2 className="text-3xl font-black font-elite">{stats.arrecadacao}</h2>
             </div>
             <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-2">Tickets Pagos</p>
                <h2 className="text-3xl font-black font-elite">{stats.totalPagos}</h2>
             </div>
             <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-2">Neon DB</p>
                <h2 className="text-xl font-black text-emerald-400 font-elite italic">ESTÁVEL</h2>
             </div>
             <div className="bg-slate-800 p-8 rounded-[2rem] border border-yellow-500/20 text-center">
                <p className="text-[8px] text-yellow-500 uppercase font-black mb-4 tracking-widest">Próxima Rodada</p>
                <button onClick={iniciarNovaRodada} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                   <PlusCircle size={16}/> Resetar Ciclo
                </button>
             </div>
          </div>
        )}

        {tab === 'sorteio' && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
             <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-red-500/20">
                <h3 className="text-red-500 font-black text-xl mb-4 font-elite uppercase italic">Protocolo Local</h3>
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-8 italic">Use em caso de falha na Blockchain</p>
                <input type="password" placeholder="ADMIN KEY" value={secret} onChange={e=>setSecret(e.target.value)} className="w-full bg-black border border-slate-800 p-4 rounded-xl mb-6 text-center font-mono text-red-500 outline-none focus:border-red-500"/>
                <button onClick={dispararContingencia} disabled={loading} className="w-full bg-red-600 py-5 rounded-2xl font-black uppercase text-xs flex justify-center items-center gap-3 active:scale-95">
                   {loading ? <Loader2 className="animate-spin"/> : <><Zap size={20}/> Acionar Matrix Local</>}
                </button>
             </div>

             <div className="bg-gradient-to-br from-[#0d1117] to-[#020617] p-10 rounded-[3rem] border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-3 mb-4">
                   <Globe className="text-cyan-400 animate-pulse" size={24}/>
                   <h3 className="text-cyan-400 font-black text-xl font-elite uppercase italic">Sorteio Oficial</h3>
                </div>
                <p className="text-white text-[10px] uppercase font-black mb-10 leading-relaxed">
                   Gatilho Real via <span className="text-yellow-500">Chainlink VRF</span> na Base Mainnet. <br/>
                   Exige assinatura via MetaMask.
                </p>
                <button 
                  onClick={handleSorteioOficialBlockchain}
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 py-6 rounded-2xl font-black uppercase text-xs shadow-xl flex justify-center items-center gap-3 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin"/> : <><Settings size={20}/> Disparar VRF Blockchain</>}
                </button>
             </div>
          </div>
        )}

        {tab === 'financeiro' && (
          <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden animate-in fade-in">
             <div className="p-8 border-b border-white/5 bg-slate-800/20">
                <h3 className="text-yellow-500 font-black text-xs uppercase tracking-widest flex items-center gap-3 font-elite"><DollarSign size={18}/> Payouts Pendentes</h3>
             </div>
             {ganhadores.length === 0 ? (
               <div className="p-24 text-center text-slate-600 italic uppercase text-[10px] font-black tracking-widest">Nenhum prêmio pendente.</div>
             ) : (
               <div className="divide-y divide-white/5">
                  {ganhadores.map(g => (
                    <div key={g.id} className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/5 transition-all">
                       <div className="text-left"><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Apostador</p><b className="text-white text-sm">{g.usuarioEmail}</b></div>
                       <div className="bg-white/5 px-6 py-2 rounded-xl text-center"><p className="text-[8px] text-slate-500 font-black mb-1">PONTOS</p><b className="text-cyan-400 text-lg font-elite">{g.status_pagamento.split('_')[1]}</b></div>
                       <button onClick={() => baixarPremio(g.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 transition-all active:scale-95">
                          <CheckCircle2 size={18}/> Validar Payout
                       </button>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}