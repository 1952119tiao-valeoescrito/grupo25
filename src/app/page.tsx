"use client"
import { useState } from 'react';
import { Trophy, Scale, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [form, setForm] = useState({ cpf: '', email: '', pixKey: '' });
  const [palpites, setPalpites] = useState([
    { x: '', y: '' }, { x: '', y: '' }, { x: '', y: '' }, { x: '', y: '' }, { x: '', y: '' }
  ]);

  const updatePalpite = (index, field, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val !== '' && (parseInt(val) < 1 || parseInt(val) > 25)) return;
    const novosPalpites = [...palpites];
    novosPalpites[index][field] = val;
    setPalpites(novosPalpites);
  };

  const gerarPix = async () => {
    const preenchidos = palpites.every(p => p.x !== '' && p.y !== '');
    if (!preenchidos || !form.cpf || !form.email) {
      alert("Preencha todos os campos e os 5 palpites!");
      return;
    }
    const prognosticosFormatados = palpites.map(p => parseInt(p.x) + '/' + parseInt(p.y));
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prognosticos: prognosticosFormatados, rodadaId: 1 })
      });
      const data = await res.json();
      if (data.qrCode) setQrCode(data.qrCode);
      else alert("Erro ao gerar PIX");
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center py-12 px-4 text-white font-sans">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-xl"><Trophy size={28} /></div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-green-500 italic">Bet-Grupo25</h1>
        </div>
        <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-2">
          <ShieldCheck size={14}/> SORTEIO AUDITADO VIA VRF
        </div>
      </header>

      <main className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-start">
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-8 italic">Faça seu Prognóstico</h2>
          {!qrCode ? (
            <div className="space-y-6">
              <div className="space-y-3">
                {palpites.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <span className="text-slate-600 font-bold text-xs w-6">{i+1}º</span>
                    <div className="flex items-center gap-2 flex-1">
                      <input type="text" placeholder="G1" value={p.x} onChange={(e) => updatePalpite(i, 'x', e.target.value)} className="w-full text-center font-bold text-green-500 outline-none bg-transparent" />
                      <span className="text-slate-700">/</span>
                      <input type="text" placeholder="G2" value={p.y} onChange={(e) => updatePalpite(i, 'y', e.target.value)} className="w-full text-center font-bold text-green-500 outline-none bg-transparent" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <input placeholder="Seu CPF" className="text-sm p-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-green-500" onChange={(e)=>setForm({...form, cpf: e.target.value})} />
                <input placeholder="Chave PIX Prêmio" className="text-sm p-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-green-500" onChange={(e)=>setForm({...form, pixKey: e.target.value})} />
                <input placeholder="Seu E-mail" className="col-span-2 text-sm p-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-green-500" onChange={(e)=>setForm({...form, email: e.target.value})} />
              </div>
              <button onClick={gerarPix} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 p-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-900/20 uppercase tracking-widest">
                {loading ? <Loader2 className="animate-spin" /> : "GERAR BILHETE R$ 10,00"} <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-8 bg-white rounded-[2rem]">
              <p className="text-black font-black mb-6 text-center italic">PAGUE O PIX PARA VALIDAR</p>
              <QRCodeSVG value={qrCode} size={220} />
              <button onClick={()=>setQrCode("")} className="mt-8 text-slate-400 text-xs font-bold underline uppercase">VOLTAR E EDITAR</button>
            </div>
          )}
        </section>

        <section className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 italic"><Scale className="text-green-500" /> Transparência Legal</h2>
          <div className="space-y-6 text-slate-400">
             <div className="flex justify-between border-b border-slate-800/50 pb-2 text-sm"><span>Seguridade Social (17,32%)</span><span className="font-mono text-green-400">R$ 0,00</span></div>
             <div className="flex justify-between border-b border-slate-800/50 pb-2 text-sm"><span>Segurança Pública (9,26%)</span><span className="font-mono text-green-400">R$ 0,00</span></div>
             <div className="flex justify-between border-b border-slate-800/50 pb-2 text-sm"><span>Educação (9,26%)</span><span className="font-mono text-green-400">R$ 0,00</span></div>
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">Operação em conformidade com a Lei 13.756/2018. O valor destinado a prêmios é de 43,35% da arrecadação total.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
