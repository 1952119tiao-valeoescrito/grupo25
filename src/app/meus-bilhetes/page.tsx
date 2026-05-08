"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ChevronLeft, Clock, CheckCircle2, Wallet, Loader2, ArrowRight } from 'lucide-react';

export default function MeusBilhetes() {
  const router = useRouter();
  const [apostas, setApostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Busca o usuário do LocalStorage (objeto 'user' que criamos no Login/Registro)
    const logged = localStorage.getItem('user');
    if (!logged) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(logged);
    setUser(userData);

    // 2. Busca as apostas reais no Banco Neon
    fetch('/api/apostas/minhas?email=' + userData.email)
      .then(res => res.json())
      .then(data => {
        setApostas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Função para gerar o selo de status com visual Matrix
  const renderStatus = (a: any) => {
    if (a.status_pagamento?.includes('GANHADOR')) {
      return (
        <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-4 py-1.5 rounded-full">
           <Trophy size={14} className="animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-tighter">{a.status_pagamento.replace('_', ' ')}</span>
        </div>
      );
    }
    if (a.pago) {
      return (
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full">
           <CheckCircle2 size={14} />
           <span className="text-[10px] font-black uppercase tracking-tighter">PAGO / VALIDADO</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-slate-800 text-slate-400 px-4 py-1.5 rounded-full opacity-60">
         <Clock size={14} />
         <span className="text-[10px] font-black uppercase tracking-tighter">AGUARDANDO PIX</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-6 md:p-12 selection:bg-cyan-500/30">
      <main className="max-w-4xl mx-auto">
        
        {/* HEADER ESTRUTURADO */}
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all text-xs font-black uppercase">
            <ChevronLeft size={20} /> Voltar
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase font-elite text-white">
            MEUS <span className="text-cyan-400">REGISTROS</span>
          </h1>
          <div className="w-10"></div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Sincronizando com a Blockchain...</p>
          </div>
        ) : apostas.length === 0 ? (
          <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[3rem] p-20 text-center">
             <Trophy size={48} className="text-slate-800 mx-auto mb-6" />
             <p className="text-white font-black uppercase text-sm tracking-widest">Nenhuma aposta encontrada.</p>
             <Link href="/dashboard" className="mt-8 inline-block bg-cyan-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-cyan-500 transition-all">Começar a Jogar</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apostas.map((a) => (
              <div 
                key={a.id} 
                className="bg-[#0d1117]/80 border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-cyan-500/40 transition-all group shadow-xl"
              >
                <div className="flex items-center gap-6">
                   <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 text-cyan-400 group-hover:scale-110 transition-transform shadow-inner">
                      <Wallet size={28}/>
                   </div>
                   <div className="text-center md:text-left">
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Identificador</p>
                      <h3 className="font-mono text-sm font-bold text-white uppercase tracking-tighter">#{a.id.substring(0,12)}</h3>
                   </div>
                </div>

                <div className="flex flex-col items-center md:items-start border-x border-white/5 px-8">
                   <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Pontuação</p>
                   <p className="text-2xl font-black font-elite text-white italic">{a.pontos || 0} <span className="text-[10px] text-slate-600 not-italic">/ 5</span></p>
                </div>

                <div className="flex items-center gap-6">
                   {renderStatus(a)}
                   <button 
                     title="Ver Bilhete"
                     onClick={() => {
                        // 🚀 RECONSTRÓI O CERTIFICADO NO STORAGE PARA O USUÁRIO VER O BILHETE DE NOVO
                        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({
                            id: a.id,
                            coords: JSON.parse(a.prognosticos),
                            qrCode: a.qr_code_payload,
                            usuario: user?.nome,
                            pixKey: a.pix_key_resgate,
                            data: new Date(a.createdAt || Date.now()).toLocaleString()
                        }));
                        router.push('/bilhete/atual');
                     }}
                     className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5"
                   >
                     <ArrowRight size={20} className="text-cyan-400" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
           <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.8em]">© 2026 BET-GRUPO25 | PROTOCOLOS DE AUDITORIA ATIVOS</p>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}