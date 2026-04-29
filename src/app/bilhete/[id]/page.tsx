"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Printer, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificadoG25() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('CERTIFICADO_G25');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 md:p-10 text-slate-200 font-sans print:bg-white print:p-0">
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 w-full max-w-4xl rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-black">
        <div className="absolute top-10 right-10 border-4 border-emerald-500/40 text-emerald-500/40 px-6 py-2 rounded-xl font-black uppercase text-xl rotate-[-15deg] print:border-black print:text-black">Autenticado</div>

        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/30 pb-8 mb-8 gap-6 print:border-black">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg print:bg-black"><Trophy className="text-white" size={32}/></div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black" style={{fontFamily: 'Orbitron'}}>BET-GRUPO25</h1>
          </div>
          <div className="text-center md:text-right">
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic print:border-black print:text-black">Aposta Registrada</span>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">ID do Bilhete</p><p className="font-mono font-bold text-white print:text-black">#{data.id}</p></div>
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">Apostador</p><p className="font-bold text-white print:text-black uppercase">{data.usuario}</p></div>
                <div><p className="text-[9px] text-yellow-500 font-black uppercase mb-1">Chave Pix Resgate</p><p className="font-bold text-white print:text-black italic text-sm">{data.pixKey}</p></div>
                
                <div className="mt-8">
                   <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6 italic print:text-black">Sua Malha Matrix 5x5</h3>
                   <div className="flex flex-col gap-2">
                      {[0,1,2,3,4].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[8px] font-black text-slate-500 uppercase w-16 text-right">{i+1} PREMIO:</span>
                          <div className="flex-1 grid grid-cols-5 gap-1.5">
                            {[0,1,2,3,4].map((j) => (
                              <div key={j} className="bg-slate-950 border border-cyan-500/20 py-2 rounded-lg flex items-center justify-center font-black text-cyan-400 text-xs print:border-black print:text-black print:bg-transparent">
                                {data.coords[i * 5 + j]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl self-center no-print">
                <p className="text-black font-black uppercase text-xs mb-6 tracking-tighter">Pague via Pix para Validar</p>
                <QRCodeSVG value={data.qrCode} size={220} />
                <p className="text-slate-400 text-[9px] mt-6 font-bold uppercase animate-pulse">Aguardando Pagamento</p>
            </div>
        </section>

        <footer className="flex justify-between items-center pt-8 border-t border-cyan-900/30 no-print">
           <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase underline">Voltar</button>
           <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2">
             Imprimir Bilhete
           </button>
        </footer>
      </div>
    </div>
  );
}
