import fs from 'fs';

console.log("⚙️ Ativando fluxo: Dashboard -> Banco de Dados -> Bilhete Impresso...");

// 1. ATUALIZAR A API PARA RETORNAR O ID DO BILHETE CRIADO
const apiPath = 'src/app/api/pix/create/route.ts';
const apiCode = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cpfLimpo = body.cpf.replace(/[^0-9]/g, '');

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return NextResponse.json({ error: "Usuário não logado" }, { status: 401 });

    // Salva o Bilhete com as 25 coordenadas
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos), // Salva a malha 5x5
      }
    });

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Bilhete Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { email: body.email, identification: { type: 'CPF', number: cpfLimpo } }
      }
    });

    // Retorna o QR Code e o ID do bilhete para o redirecionamento
    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });
  } catch (e) { 
    console.error(e);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 }); 
  }
}
`.trim();

// 2. ATUALIZAR O DASHBOARD PARA REDIRECIONAR PARA O BILHETE
const dashPath = 'src/app/dashboard/page.tsx';
const dashCode = `
"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Scale } from 'lucide-react';

export default function DashboardElite() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("00:00:00:00");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const logged = localStorage.getItem('user');
    if (!logged) router.push('/');
    else { setUser(JSON.parse(logged)); gerarMalha(); }
    
    const interval = setInterval(() => {
      const now = new Date();
      const nextSat = new Date();
      nextSat.setDate(now.getDate() + (6 - now.getDay()));
      nextSat.setHours(20, 0, 0, 0);
      if (now > nextSat) nextSat.setDate(nextSat.getDate() + 7);
      const diff = nextSat.getTime() - now.getTime();
      const f = (n) => Math.floor(Math.max(0, n)).toString().padStart(2, '0');
      setTimer(f(diff/86400000) + ":" + f((diff/3600000)%24) + ":" + f((diff/60000)%60) + ":" + f((diff/1000)%60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };

  const confirmarBilhete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          cpf: user.pixKey, // Usando a chave pix como CPF base ou ajuste conforme seu form
          prognosticos: matriz.flat(),
          rodadaId: 1 
        })
      });
      const data = await res.json();
      if(data.ticketId) {
        // SALVA OS DADOS PARA O BILHETE LER
        localStorage.setItem('ULTIMO_BILHETE', JSON.stringify({
          id: data.ticketId,
          coords: matriz.flat(),
          qrCode: data.qrCode
        }));
        // REDIRECIONA PARA A PÁGINA DE IMPRESSÃO
        router.push('/bilhete/' + data.ticketId);
      } else { alert("Erro ao gerar bilhete"); }
    } catch (e) { alert("Erro de conexão"); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <h1 style={{fontFamily:'Orbitron'}} className="text-white text-sm md:text-xl font-black uppercase italic">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <div className="flex items-center gap-4">
             <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Olá, {user.nome.split(' ')[0]}</span>
             <button onClick={()=>{localStorage.clear(); router.push('/')}} className="bg-slate-800 p-2 rounded-xl border border-white/10 hover:bg-red-900/40 transition-all text-white">🚪</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center relative z-10">
        <section className="mb-12">
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.5em] mb-4">Próximo Sorteio Auditado</p>
          <div style={{fontFamily:'Orbitron'}} className="text-5xl md:text-8xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter italic">{timer}</div>
          <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest italic text-center">Sábado às 20:00hrs</p>
        </section>

        <div className="bg-[#0f172a]/85 border border-cyan-500/20 p-6 md:p-12 rounded-[3rem] shadow-2xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-yellow-500 font-bold text-xs uppercase mb-10 tracking-widest text-center">Sua Malha de Coordenadas Matrix 5x5</h2>
          <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-4 md:p-10 mb-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-6 gap-2 md:gap-4 items-center">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="contents">
                  <span className="text-[10px] font-black text-yellow-500 text-right pr-2">{i+1}º</span>
                  {[0,1,2,3,4].map((j) => (
                    <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/40 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-elite">
                      {matriz[i] ? matriz[i][j] : '--/--'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button onClick={gerarMalha} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-5 rounded-2xl font-black uppercase text-[10px] transition-all border border-white/5">Gerar Coordenadas</button>
            <button onClick={confirmarBilhete} disabled={loading} className="flex-1 bg-[#ea580c] hover:bg-orange-500 text-white py-5 px-10 rounded-2xl font-black uppercase text-[10px] shadow-lg flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"} <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
`.trim();

fs.writeFileSync(apiPath, apiCode, { encoding: 'utf8' });
fs.writeFileSync(dashPath, dashCode, { encoding: 'utf8' });
console.log("✅ API e Dashboard sincronizados para gerar o Bilhete!");