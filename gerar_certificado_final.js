import fs from 'fs';

console.log("📜 Ativando a emissão de Certificados Oficiais...");

// 1. ATUALIZAR O DASHBOARD (VINCULAR O BOTÃO LARANJA)
const dashboardPath = 'src/app/dashboard/page.tsx';
if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Inserindo a lógica de confirmação e redirecionamento
    const logicReplace = `
  const handleConfirmar = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          cpf: user.pixKey, 
          prognosticos: matriz.flat(), 
          rodadaId: 1 
        })
      });
      const data = await res.json();
      if (data.qrCode && data.ticketId) {
        // Salva para o certificado ler
        const infoBilhete = {
          id: data.ticketId,
          coords: matriz.flat(),
          qrCode: data.qrCode,
          usuario: user.nome,
          data: new Date().toLocaleString('pt-BR')
        };
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify(infoBilhete));
        // REDIRECIONA PARA O CERTIFICADO
        router.push('/bilhete/' + data.ticketId);
      } else {
        alert("Erro ao gerar Pix. Verifique seu token.");
      }
    } catch (e) {
      alert("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };
`.trim();

    // Substitui a função vazia pela real
    content = content.replace(/const handleConfirmar = async \(\) => \{[\s\S]*?\};/, logicReplace);
    
    // Garante que o botão laranja chama a função
    content = content.replace(/Confirmar Certificado<\/button>/, 'Confirmar Certificado</button>');
    content = content.replace(/onClick=\{handleConfirmar\}/g, 'onClick={handleConfirmar}');

    fs.writeFileSync(dashboardPath, content);
    console.log("✅ Botão Laranja ativado no Dashboard!");
}

// 2. REESCREVER O CERTIFICADO (O LAYOUT QUE VOCÊ APROVOU)
const bilhetePath = 'src/app/bilhete/[id]/page.tsx';
const bilheteCode = `"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Printer, ChevronLeft, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificadoG25() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('CERTIFICADO_G25');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-bold">GERANDO CERTIFICADO...</div>;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 md:p-10 text-slate-200 font-sans">
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 w-full max-w-4xl rounded-[3rem] p-8 md:p-16 shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-black">
        
        {/* Carimbo de Autenticação */}
        <div className="absolute top-10 right-10 border-4 border-emerald-500/40 text-emerald-500/40 px-6 py-2 rounded-xl font-black uppercase text-xl rotate-[-15deg] print:border-black print:text-black">
          Autenticado
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/30 pb-10 mb-10 gap-6 print:border-black">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg print:bg-black"><Trophy className="text-white" size={32}/></div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400 print:text-black" style={{fontFamily: 'Orbitron'}}>BET-GRUPO25</h1>
          </div>
          <div className="text-center md:text-right">
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic print:border-black print:text-black">✓ Aposta Auditada & Registrada</span>
             <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-[0.3em]">Protocolo Blockchain Base Mainnet</p>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">ID do Bilhete</p><p className="font-mono font-bold text-white text-lg print:text-black">#\${data.id.substring(0,12)}</p></div>
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Apostador</p><p className="font-bold text-white print:text-black uppercase">\${data.usuario}</p></div>
                <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Data do Registro</p><p className="font-bold text-slate-400 print:text-black">\${data.data}</p></div>
                
                <div className="mt-10">
                   <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-6 italic">Sua Malha Matrix 5x5</h3>
                   <div className="grid grid-cols-5 gap-2">
                      {data.coords.map((c, i) => (
                        <div key={i} className="bg-slate-950 border border-cyan-500/20 py-3 rounded-xl flex items-center justify-center font-black text-cyan-400 text-xs print:border-black print:text-black print:bg-white shadow-inner">
                          {c}
                        </div>
                      ))}
                   </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl no-print self-center">
                <p className="text-black font-black uppercase text-xs mb-6 tracking-tighter">Pague via Pix para Validar</p>
                <QRCodeSVG value={data.qrCode} size={220} />
                <p className="text-slate-400 text-[9px] mt-6 font-bold uppercase tracking-widest animate-pulse">Escaneie com o app do banco</p>
            </div>
        </section>

        <footer className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-cyan-900/30 gap-6 print:border-black">
           <div className="text-[9px] text-slate-600 font-bold uppercase italic max-w-sm text-center md:text-left leading-relaxed print:text-black">
             Este certificado é o registro oficial dos seus prognósticos. A validade é garantida pelo protocolo Neon DB e Oráculo Chainlink VRF.
           </div>
           <div className="flex gap-4 no-print">
              <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold uppercase text-[10px] border border-white/5 hover:bg-slate-700 transition-all">Voltar</button>
              <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg transition-all flex items-center gap-2">
                <Printer size={16}/> Imprimir
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
}
`;

if (!fs.existsSync('src/app/bilhete/[id]')) fs.mkdirSync('src/app/bilhete/[id]', { recursive: true });
fs.writeFileSync(bilhetePath, bilheteCode, { encoding: 'utf8' });
console.log("✅ Página de Certificado (Bilhete) Restaurada e Vinculada!");