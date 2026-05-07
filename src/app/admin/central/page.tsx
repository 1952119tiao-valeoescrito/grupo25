"use client"
import { useState } from 'react';
import { ShieldAlert, Zap, Trophy, Users, Terminal, Loader2, Lock, ChevronRight } from 'lucide-react';

export default function PainelAdminMatrix() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setResumo] = useState<any>(null);

  const executarSorteio = async () => {
    if (!secret) return alert("Insira a Chave de Acesso Admin!");
    if (!confirm("CONFIRMAR SORTEIO DE EMERGÊNCIA? Esta ação é irreversível.")) return;

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
        alert("Sorteio e Auditoria Concluídos!");
      } else {
        alert(data.error || "Erro ao executar");
      }
    } catch (e) {
      alert("Erro de conexão");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-12 selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER ADMIN */}
        <header className="flex items-center justify-between mb-12 border-b border-red-500/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic font-elite tracking-tighter">Central de Comando</h1>
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em]">Protocolos de Contingência VRF</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-slate-500 text-[9px] font-black uppercase">Ambiente Altamente Restrito</p>
             <p className="text-white text-xs font-mono">v3.0.4-LOCKED</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* PAINEL DE AÇÃO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase mb-6 flex items-center gap-2">
                <Lock size={14}/> Autenticação Requerida
              </h3>
              <input 
                type="password" 
                placeholder="ADMIN_SECRET_KEY"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full bg-black border border-slate-800 p-4 rounded-xl mb-6 text-center font-mono text-red-500 outline-none focus:border-red-500 transition-all"
              />
              <button 
                onClick={executarSorteio}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Zap size={18}/> Acionar Contingência</>}
              </button>
            </div>
          </div>

          {/* PAINEL DE RESULTADOS (RESUMO) */}
          <div className="lg:col-span-2">
            {!report ? (
              <div className="h-full min-h-[300px] border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
                 <Terminal size={48} className="mb-4 opacity-20" />
                 <p className="text-xs font-black uppercase tracking-[0.2em]">Aguardando disparo de sorteio...</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                
                {/* RESULTADOS SORTEADOS */}
                <div className="bg-black/60 border border-cyan-500/30 p-8 rounded-[3rem]">
                   <h4 className="text-cyan-400 text-[10px] font-black uppercase mb-6 tracking-widest">Coordenadas Sorteadas (Oficial)</h4>
                   <div className="grid grid-cols-5 gap-3">
                      {report.resultados.map((res: string, i: number) => (
                        <div key={i} className="bg-slate-900 border border-cyan-500/50 p-4 rounded-xl text-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                           <p className="text-[8px] text-slate-500 mb-1">{i+1}º</p>
                           <b className="text-cyan-400 text-sm font-elite">{res}</b>
                        </div>
                      ))}
                   </div>
                </div>

                {/* RESUMO DE GANHADORES */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   {[5,4,3,2,1].map(faixa => (
                     <div key={faixa} className="bg-slate-900 p-4 rounded-[1.5rem] border border-white/5 text-center">
                        <p className="text-[8px] text-slate-500 uppercase font-black">{faixa} PONTOS</p>
                        <p className="text-2xl font-black text-yellow-500 font-elite">{report.resumo[`faixa${faixa}`]}</p>
                     </div>
                   ))}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Users className="text-emerald-500" size={20}/>
                      <span className="text-xs font-bold uppercase">Bilhetes Auditados nesta rodada:</span>
                   </div>
                   <b className="text-xl font-elite">{report.totalBilhetesAuditados}</b>
                </div>

              </div>
            )}
          </div>
        </div>

        <footer className="mt-20 text-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
           Sistema de Auditoria Matrix | v3.0 | Neon Database Connected
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}

