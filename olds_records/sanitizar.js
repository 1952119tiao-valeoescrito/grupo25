import fs from 'fs';

console.log("🧼 Sanitizando códigos e corrigindo erros de sintaxe...");

const adminPath = 'src/app/admin/central/page.tsx';

// 1. Código corrigido para a Página Admin (Sem o erro na linha 85)
const adminCode = `"use client"
import { useState, useEffect } from 'react';
import { Terminal, Database, Activity, RefreshCw } from 'lucide-react';

export default function ComandoCentral() {
  const [data, setData] = useState({ total_valor: 'R$ 0,00', total_contagem: 0, ultimas_apostas: [] });

  const fetchDados = async () => {
    try {
      const res = await fetch('/api/admin/resumo');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Erro no carregamento"); }
  };

  useEffect(() => {
    fetchDados();
    const interval = setInterval(fetchDados, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-[#d4af37] p-4 md:p-10 font-mono">
      <header className="flex justify-between items-center mb-10 border-b border-yellow-600/30 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-600/10 p-3 rounded-lg border border-yellow-600/50">
            <Terminal className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Comando Central</h1>
        </div>
        <div className="text-cyan-500 font-bold flex items-center gap-2">
          <Activity size={16} className="animate-pulse" /> SISTEMA ATIVO
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card label="TOTAL ARRECADADO (PIX)" value={data.total_valor} />
        <Card label="BILHETES PAGOS" value={data.total_contagem} />
        <Card label="CONEXÃO NEON" value="ESTÁVEL" color="text-emerald-400" />
      </div>

      <div className="bg-slate-900/50 border border-yellow-600/20 rounded-2xl p-6 overflow-hidden">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Database size={16} /> Últimas Entradas na Matriz
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="text-slate-500 border-b border-white/5">
              <tr>
                <th className="p-3">IDENTIFICADOR</th>
                <th className="p-3">COOTAS MATRIX</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.ultimas_apostas.map((a, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-white">{a.usuarioEmail}</td>
                  <td className="p-3 text-cyan-400 font-bold">25 COORDENADAS</td>
                  <td className="p-3 text-right">
                    <span className={a.pago ? "text-emerald-500" : "text-yellow-600"}>
                      {a.pago ? "● CONFIRMADO" : "○ PENDENTE"}
                    </span>
                  </td>
                </tr>
              ))}
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
      <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase">{label}</p>
      <h2 className={"text-3xl font-black tracking-tighter " + color}>{value}</h2>
    </div>
  );
}
`;

// Escrever os arquivos com codificação garantida
fs.writeFileSync(adminPath, adminCode, { encoding: 'utf8' });
console.log("✅ Erro de sintaxe corrigido em: " + adminPath);

console.log("\n🚀 Agora siga os comandos de Deploy.");