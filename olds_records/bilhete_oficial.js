import fs from 'fs';

const bilheteCode = `
"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Printer, ChevronLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function BilheteAuditado() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('ULTIMO_BILHETE');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 md:p-10 text-slate-200">
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/20 w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-black">
        
        <div className="absolute top-10 right-10 border-4 border-emerald-500/50 text-emerald-500/50 px-6 py-2 rounded-xl font-black uppercase text-xl rotate-[-15deg] print:border-black print:text-black">
          Autenticado
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/30 pb-8 mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg print:bg-black"><Trophy className="text-white" size={32}/></div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black">BET-GRUPO25</h1>
          </div>
          <div className="text-center md:text-right">
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic print:border-black print:text-black">✓ Aposta Registrada</span>
             <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-[0.3em]">Blockchain Matrix Protocol</p>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-10 mb-12">
            {/* LADO ESQUERDO: DADOS */}
            <div className="space-y-6">
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">ID do Certificado</p><p className="font-mono font-bold text-white print:text-black">{data.id}</p></div>
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Data do Registro</p><p className="font-mono font-bold text-white print:text-black">{new Date().toLocaleString()}</p></div>
                
                <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mt-8 italic">Suas Coordenadas 5x5</h3>
                <div className="grid grid-cols-5 gap-2">
                    {data.coords.map((c, i) => (
                        <div key={i} className="bg-slate-950 border border-cyan-500/20 py-2 rounded-lg flex items-center justify-center font-black text-cyan-400 text-[10px] print:border-black print:text-black">
                            {c}
                        </div>
                    ))}
                </div>
            </div>

            {/* LADO DIREITO: PIX */}
            <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl no-print">
                <p className="text-black font-black uppercase text-xs mb-6">Pague para Validar o Bilhete</p>
                <QRCodeSVG value={data.qrCode} size={200} />
                <p className="text-slate-400 text-[9px] mt-6 font-bold uppercase">Escaneie o QR Code acima</p>
            </div>
        </section>

        <footer className="flex justify-between items-center pt-8 border-t border-cyan-900/30 no-print">
           <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase underline">Voltar ao Painel</button>
           <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2">
             <Printer size={16}/> Imprimir Bilhete
           </button>
        </footer>
      </div>
    </div>
  );
}
`.trim();

fs.writeFileSync('src/app/bilhete/[id]/page.tsx', bilheteCode, { encoding: 'utf8' });
console.log("✅ Página de Bilhete e Impressão ativada!");