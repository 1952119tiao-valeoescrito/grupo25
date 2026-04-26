import fs from 'fs';

const code = `"use client"
import { useState, useEffect } from 'react';
import { Terminal, Database, Activity, RefreshCw, Loader2 } from 'lucide-react';

export default function ComandoCentral() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDados = async () => {
    try {
      const res = await fetch('/api/admin/resumo');
      if (!res.ok) throw new Error("Falha na API");
      const json = await res.json();
      setData(json);
      setError(false);
    } catch (e) {
      console.error("Erro no carregamento:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
    const interval = setInterval(fetchDados, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#d4af37] p-4 md:p-10 font-mono">
      <header className="flex justify-between items-center mb-10 border-b border-yellow-600/30 pb-6">
        <div className="flex items-center gap-4">
          <Terminal className="text-yellow-500" />
          <h1 className="text-2xl font-black uppercase italic text-white tracking-tighter text-wrap">Comando Central</h1>
        </div>
        <div className="text-cyan-500 font-bold flex items-center gap-2 text-[10px]">
          <Activity size={14} className="animate-pulse" /> SISTEMA ON-LINE
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card label="TOTAL ARRECADADO" value={data?.total_valor || 'R$ 0,00'} />
        <Card label="BILHETES PAGOS" value={data?.total_contagem || '0'} />
        <Card label="CONEXÃO NEON" value={error ? "ERRO" : "ESTÁVEL"} color={error ? "text-red-500" : "text-emerald-400"} />
      </div>

      <div className="bg-slate-900/50 border border-yellow-600/20 rounded-2xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Database size={16} /> Últimas Entradas
          </h3>
          <button onClick={fetchDados} className="text-xs hover:text-white"><RefreshCw size={14}/></button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="text-slate-500 border-b border-white/5">
              <tr>
                <th className="p-3 font-bold uppercase">Identificador</th>
                <th className="p-3 font-bold uppercase">Matriz</th>
                <th className="p-3 text-right font-bold uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.ultimas_apostas?.length > 0 ? (
                data.ultimas_apostas.map((a, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white">{a.usuarioEmail || 'Anônimo'}</td>
                    <td className="p-3 text-cyan-400 font-bold tracking-widest">5x5 [OK]</td>
                    <td className="p-3 text-right">
                      <span className={a.pago ? "text-emerald-500" : "text-yellow-600"}>
                        {a.pago ? "● CONFIRMADO" : "○ PENDENTE"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="p-10 text-center text-slate-600 italic uppercase">Aguardando novos bilhetes...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-900/80 border border-yellow-600/20 p-6 rounded-2xl text-center">
      <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">{label}</p>
      <h2 className={"text-3xl font-black tracking-tighter " + color}>{value}</h2>
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/central/page.tsx', code, { encoding: 'utf8' });
console.log("✅ Comando Central blindado com sucesso!");