"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, RefreshCw, Loader2, ChevronRight, Scale, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '' });

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      router.push('/'); // Se não estiver logado, volta pro cadastro
    } else {
      setUser(JSON.parse(loggedUser));
      gerarMalha();
    }
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) {
      pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    }
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  const handlePagamento = async () => {
    if(!form.cpf) return alert("Digite seu CPF!");
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cpf: form.cpf, 
          email: user.email, 
          prognosticos: matriz.flat(),
          rodadaId: 1 
        })
      });
      const data = await res.json();
      if(data.qrCode) setQrCode(data.qrCode);
      else alert("Erro ao gerar Pix");
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-bold">AUTENTICANDO...</div>;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-6 md:p-12">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="font-black text-xl uppercase italic">MIMOSINHA<span className="text-cyan-400 ml-1">G25</span></h1>
        <div className="text-[10px] font-bold text-yellow-500 uppercase border border-yellow-500/20 px-4 py-1.5 rounded-full bg-yellow-500/10">
          Olá, {user.nome.split(' ')[0]}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
           {!qrCode ? (
             <>
               <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-bold uppercase italic text-yellow-500">Malha Matrix 5x5</h2>
                  <button onClick={gerarMalha} className="text-cyan-400 p-2 hover:bg-cyan-400/10 rounded-xl"><RefreshCw size={20}/></button>
               </div>
               <div className="grid grid-cols-6 gap-3 mb-12 items-center">
                  {matriz.map((linha, i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-cyan-500/50 text-right">{i+1}º</span>
                      {linha.map((c, j) => <div key={j} className="aspect-square bg-slate-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-xs font-black text-cyan-400">{c}</div>)}
                    </div>
                  ))}
               </div>
               <input placeholder="Digite seu CPF para validar" className="w-full p-5 rounded-2xl bg-slate-950 border-slate-800 mb-6 outline-none focus:border-cyan-500" onChange={e=>setForm({cpf: e.target.value})} />
               <button onClick={handlePagamento} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/40">
                 {loading ? <Loader2 className="animate-spin"/> : "CONFIRMAR CERTIFICADO"} <ChevronRight />
               </button>
             </>
           ) : (
             <div className="flex flex-col items-center py-6">
               <div className="bg-white p-8 rounded-[3rem] mb-6"><QRCodeSVG value={qrCode} size={250} /></div>
               <p className="text-cyan-400 font-black uppercase text-sm mb-4">Pague para Ativar</p>
               <button onClick={()=>setQrCode("")} className="text-white/30 underline text-xs font-bold uppercase">Voltar</button>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h3 className="text-yellow-500 font-black text-xs uppercase mb-6 flex items-center gap-2"><Scale size={16}/> Transparência Legal</h3>
              <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
                 <div className="flex justify-between border-b border-slate-800 pb-2"><span>Prêmio (43,35%)</span><span className="text-white">R$ 0,00</span></div>
                 <div className="flex justify-between border-b border-slate-800 pb-2"><span>Seguridade (17,32%)</span><span className="text-white">R$ 0,00</span></div>
                 <div className="flex justify-between border-b border-slate-800 pb-2"><span>Educação (9,26%)</span><span className="text-white">R$ 0,00</span></div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
