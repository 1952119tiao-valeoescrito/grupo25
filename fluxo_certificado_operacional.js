import fs from 'fs';

console.log("🛠️ Ativando engrenagens: Dashboard + Pix + Certificado...");

// 1. REESCREVER A API DE PIX (src/app/api/pix/create/route.ts)
const apiCode = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // Criar o Ticket no Neon
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: user.pixKey || "00000000000",
        usuarioEmail: user.email,
        chavePixPremio: user.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos),
        pago: false
      }
    });

    // Criar o Pix no Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Bilhete Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { 
          email: user.email,
          identification: { type: 'CPF', number: user.pixKey.replace(/[^0-9]/g, '') || '00000000000' }
        }
      }
    });

    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO API PIX:", e);
    return NextResponse.json({ error: e.message || "Erro no processamento" }, { status: 500 });
  }
}
`.trim();

// 2. REESCREVER O DASHBOARD (src/app/dashboard/page.tsx)
const dashCode = `
"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]);
  const [timer, setTimer] = useState("05:07:26:56");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const logged = localStorage.getItem('user');
    if (logged) setUser(JSON.parse(logged));
    else router.push('/');

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

    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const gridAnim = [];
    for (let i = 0; i < 100; i++) {
        gridAnim.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.22)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 12px Orbitron';
      gridAnim.forEach(s => {
        s.c++;
        if(Math.random() > 0.985) s.text = coords[Math.floor(Math.random() * 625)];
        const op = (Math.sin(s.c * 0.05) * 0.1) + 0.08;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + op + ')';
        ctx.fillText(s.text, s.x, s.y);
      });
      requestAnimationFrame(draw);
    }; draw();
    return () => clearInterval(interval);
  }, [router]);

  const gerarMalha = () => {
    const pSet = new Set();
    while(pSet.size < 25) pSet.add((Math.floor(Math.random()*25)+1) + '/' + (Math.floor(Math.random()*25)+1));
    const array = Array.from(pSet);
    const linhas = [];
    for(let i=0; i<5; i++) linhas.push(array.slice(i*5, (i+1)*5));
    setMatriz(linhas);
  };
  useEffect(() => { if(mounted) gerarMalha(); }, [mounted]);

  const handleConfirmar = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, prognosticos: matriz.flat() })
      });
      const data = await res.json();
      if (data.qrCode && data.ticketId) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({
          id: data.ticketId,
          coords: matriz.flat(),
          qrCode: data.qrCode,
          usuario: user.nome,
          data: new Date().toLocaleString('pt-BR')
        }));
        router.push('/bilhete/' + data.ticketId);
      } else {
        alert("Erro: " + (data.error || "Falha ao gerar bilhete"));
      }
    } catch (e) {
      alert("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* TICKER */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest font-elite">
           🚀 BEM-VINDO À MIMOSINHA BRASIL: SORTEIOS GRATUITOS NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center font-elite">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">Meus Registros</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">Resultados</button>
             <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase">Olá, {user.nome.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        
        {/* TIMER E SLOGAN BLOCKCHAIN */}
        <section className="mb-10">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic mb-2">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        {/* MALHA MATRIX */}
        <div className="max-w-4xl mx-auto bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl mb-12">
            <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest text-center italic font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
            <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1 italic">{i+1}º</span>
                      {matriz[i] && matriz[i].map((c, j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400">
                          {c}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 font-elite transition-all hover:bg-slate-700">Trocar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg font-elite transition-all hover:bg-orange-500 flex justify-center items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Certificado"} <ChevronRight size={16}/>
                </button>
            </div>
            <p className="text-[10px] text-white/30 text-center mt-6 uppercase font-bold italic tracking-widest italic animate-pulse">Identificado: {user.nome}</p>
        </div>

        {/* BLOCOS PRODUTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          <div className="bg-[#0f172a] border border-cyan-500/30 p-10 rounded-[3.5rem] shadow-2xl text-center">
             <h3 className="text-2xl text-yellow-500 mb-2 font-black uppercase italic font-elite">INTER-BET</h3>
             <p className="text-[10px] text-slate-400 mb-8 font-bold uppercase tracking-widest italic">Ganha com até 1 ponto</p>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/inter-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase shadow-lg">Acessar Site</button>
          </div>
          <div className="bg-[#0f172a] border border-cyan-500/30 p-10 rounded-[3.5rem] shadow-2xl text-center">
             <h3 className="text-2xl text-cyan-400 mb-2 font-black uppercase italic font-elite">QUINA-BET</h3>
             <p className="text-[10px] text-slate-400 mb-8 font-bold uppercase tracking-widest italic">Sorteios Semanais</p>
             <button onClick={()=>window.open('https://blockchain-betbrasil.io/pt/quina-bet')} className="w-full bg-cyan-500 text-black py-4 rounded-3xl font-black text-[10px] uppercase shadow-lg">Acessar Site</button>
          </div>
        </div>

        {/* SLOGAN CENTRAL */}
        <section className="mb-20">
           <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white font-elite">
             A ÚNICA MATRIZ ONDE <span className="text-yellow-500 italic">ERRAR 24 VEZES</span> <br/>AINDA TE FAZ UM VENCEDOR.
           </h2>
        </section>

        {/* FOOTER COM PORTA SECRETA */}
        <footer className="py-20 border-t border-white/5 opacity-30 text-center relative z-[200]">
           <p onClick={()=>{setClickCount(c=>c+1); if(clickCount>=4) window.location.href='/admin/central'}} className="text-[11px] font-black uppercase tracking-[0.5em] italic cursor-pointer select-none antialiased">
              © 2026 BET-GRUPO25 | PROTOCOLOS MATRIX PRO | BY NEON DATABASE
           </p>
        </footer>
</main>
    </div>
  );
}
`.trim();

fs.writeFileSync('src/app/api/pix/create/route.ts', apiCode);
fs.writeFileSync('src/app/dashboard/page.tsx', dashCode);
console.log("✅ Sistema operacional reativado! O botão laranja agora funciona.");