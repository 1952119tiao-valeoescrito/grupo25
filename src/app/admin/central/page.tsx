"use client"
import { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Trophy, Users, Terminal, Loader2, Lock, Activity, Database, RefreshCw } from 'lucide-react';

export default function PainelAdminMatrix() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setResumo] = useState<any>(null);
  const [tickets, setTickets] = useState([]); // Simulação da sua lista atual

  // Função para acionar o sorteio automático + auditoria
  const executarSorteio = async () => {
    if (!secret) return alert("Insira a ADMIN_SECRET_KEY para autorizar!");
    if (!confirm("ACIONAR PROTOCOLO DE CONTINGÊNCIA? Esta ação calculará os ganhadores no banco Neon agora.")) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/contingencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      });
      const data = await res.json();
      if (res.ok) {
        setResumo(data);
        alert("Sorteio e Auditoria Concluídos com Sucesso!");
      } else {
        alert(data.error || "Falha na Autenticação");
      }
    } catch (e) { alert("Erro de conexão com o servidor"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/5 pb-8">
           <div className="flex items-center gap-4">
              <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg"><Terminal size={28}/></div>
              <h1 className="text-2xl font-black uppercase italic font-elite tracking-tighter">COMANDO CENTRAL <span className="text-cyan-400 text-xs not-italic ml-2">V3.0</span></h1>
           </div>
           <div className="flex items-center gap-2 text-cyan-400 font-bold text-[9px] uppercase tracking-widest animate-pulse">
              <Activity size={14}/> SISTEMA ON-LINE
           </div>
        </header>

        {/* CARDS DE ESTATÍSTICAS (O que você já tinha) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2rem] text-center shadow-xl">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-4 tracking-widest">Total Arrecadado</p>
              <h2 className="text-3xl font-black italic font-elite text-white">R$ 0,00</h2>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2rem] text-center shadow-xl">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-4 tracking-widest">Bilhetes Pagos</p>
              <h2 className="text-3xl font-black italic font-elite text-white">0</h2>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2rem] text-center shadow-xl">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-4 tracking-widest">Conexão Neon</p>
              <h2 className="text-xl font-black uppercase italic font-elite text-emerald-400">ESTÁVEL</h2>
           </div>
        </div>

        {/* --- NOVA SEÇÃO: SALA DE SORTEIO (CONTINGÊNCIA) --- */}
        <section className="bg-gradient-to-br from-slate-900 to-black border-2 border-red-500/20 rounded-[3rem] p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500"><ShieldAlert size={150}/></div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                 <h3 className="text-red-500 font-black text-xl uppercase font-elite italic mb-4 flex items-center gap-2">
                    <Zap size={20}/> Acionar Sorteio Manual
                 </h3>
                 <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase mb-8">
                    Use este recurso apenas em caso de instabilidade no VRF Blockchain. 
                    Ao acionar, o sistema gerará os resultados e auditará todos os bilhetes pagos instantaneamente.
                 </p>
                 <div className="flex flex-col md:flex-row gap-4">
                    <input 
                      type="password" 
                      placeholder="ADMIN_SECRET_KEY"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="bg-black border border-slate-800 p-4 rounded-xl text-center font-mono text-red-500 flex-1 outline-none focus:border-red-500 transition-all"
                    />
                    <button 
                      onClick={executarSorteio}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "DISPARAR AGORA"}
                    </button>
                 </div>
              </div>

              {/* ÁREA DO RESULTADO PÓS-SORTEIO */}
              <div className="min-h-[150px] border-2 border-dashed border-slate-800 rounded-[2rem] flex items-center justify-center p-6 text-center">
                 {!report ? (
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Aguardando Comando...</p>
                 ) : (
                   <div className="w-full animate-in fade-in zoom-in duration-500">
                      <h4 className="text-cyan-400 text-[9px] font-black uppercase mb-4 tracking-widest">Resultados da Rodada</h4>
                      <div className="grid grid-cols-5 gap-2 mb-6">
                        {report.resultados.map((res: any, i: number) => (
                          <div key={i} className="bg-slate-900 border border-cyan-500/30 p-2 rounded-lg">
                            <p className="text-[7px] text-slate-500 mb-1">{i+1}º</p>
                            <b className="text-white text-xs font-elite">{res}</b>
                          </div>
                        ))}
                      </div>
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase">
                         Auditados: {report.totalBilhetesAuditados} bilhetes
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* TABELA DE ÚLTIMAS ENTRADAS (MANTIDA) */}
        <section className="bg-[#0f172a]/40 border border-white/5 rounded-[2.5rem] p-8">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-yellow-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 font-elite">
                 <Database size={16}/> Últimas Entradas
              </h3>
              <button className="text-slate-500 hover:text-white transition-all"><RefreshCw size={16}/></button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] font-bold uppercase">
                 <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                       <th className="pb-4">Identificador</th>
                       <th className="pb-4">Matriz</th>
                       <th className="pb-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-slate-300">
                    <tr className="border-b border-white/5">
                       <td className="py-4">aninhatavares@gmail.com</td>
                       <td className="py-4 text-cyan-400">5x5 [OK]</td>
                       <td className="py-4 text-right text-yellow-500">○ Pendente</td>
                    </tr>
                    {/* Adicione aqui o seu map para puxar os dados reais do Neon */}
                 </tbody>
              </table>
           </div>
        </section>

        <footer className="mt-20 text-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
           © 2026 BET-GRUPO25 | PROTOCOLO MATRIX ELITE
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}