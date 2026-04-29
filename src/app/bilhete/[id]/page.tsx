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
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-start p-4 md:p-10 text-slate-200 font-sans print:bg-white print:p-0">
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden print:shadow-none print:border-slate-300 print:rounded-none print:bg-white print:text-black print:max-w-full">
        
        {/* Selo Autenticado */}
        <div className="absolute top-10 right-10 border-4 border-emerald-500/40 text-emerald-500/40 px-6 py-2 rounded-xl font-black uppercase text-xl rotate-[-15deg] print:border-black print:text-black print:opacity-20">
          Autenticado
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/30 pb-6 mb-6 gap-6 print:border-black">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-600 p-2 rounded-xl print:bg-black"><Trophy className="text-white" size={28}/></div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black" style={{fontFamily: 'Orbitron'}}>BET-GRUPO25</h1>
          </div>
          <div className="text-center md:text-right">
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest print:border-black print:text-black italic">✓ Aposta Auditada & Registrada</span>
             <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold print:text-black">Protocolo Blockchain Base Mainnet</p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 mb-8 print:gap-4">
            <div className="space-y-4">
                <div>
                  <p className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-widest">ID do Bilhete</p>
                  <p className="font-mono font-bold text-white text-sm print:text-black">#{data.id}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-widest">Apostador</p>
                  <p className="font-bold text-white uppercase text-sm print:text-black">{data.usuario}</p>
                </div>
                {/* --- CAMPO CHAVE PIX ADICIONADO --- */}
                <div>
                  <p className="text-[8px] text-yellow-500 font-black uppercase mb-1 tracking-widest">Chave Pix para Prêmio</p>
                  <p className="font-bold text-white text-sm print:text-black italic">{data.pixKey || "Vincular no Perfil"}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-widest">Data do Registro</p>
                  <p className="font-bold text-slate-400 text-sm print:text-black">{data.data}</p>
                </div>
                
                <div className="mt-6">
                   <h3 className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 italic print:text-black">Sua Malha Matrix 5x5</h3>
                   <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 items-center">
                    {[0,1,2,3,4].map((row) => (
                      <div key={row} className="contents">
                        <span className="text-[9px] font-black text-slate-500 text-right pr-2">{row + 1}º Prêmio:</span>
                        {[0,1,2,3,4].map((col) => (
                          <div key={col} className="bg-slate-950 border border-cyan-500/20 py-3 rounded-xl flex items-center justify-center font-black text-cyan-400 text-xs print:border-black print:text-black shadow-inner">
                            {data.coords[row * 5 + col]}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
                      ))}
                   </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl self-center print:shadow-none print:p-2">
                <p className="text-black font-black uppercase text-[10px] mb-4 no-print">Pague via Pix para Validar</p>
                <QRCodeSVG value={data.qrCode} size={180} />
                <p className="text-slate-400 text-[8px] mt-4 font-bold uppercase no-print">Aguardando Pagamento</p>
            </div>
        </section>

        <footer className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-cyan-900/30 gap-4 print:border-black">
           <div className="text-[9px] text-slate-600 font-bold uppercase italic max-w-sm text-center md:text-left print:text-black">
             A validade deste bilhete é garantida pelo protocolo Neon DB e Oráculo Chainlink VRF. Prêmio bruto de 43,35% conforme Lei 13.756.
           </div>
           <div className="flex gap-4 no-print">
              <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold uppercase text-[9px] border border-white/5">Voltar</button>
              <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-black uppercase text-[9px] shadow-lg flex items-center gap-2">
                <Printer size={14}/> Imprimir
              </button>
           </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
