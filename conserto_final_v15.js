import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function executar() {
  console.log("🛠️ Iniciando Conserto Final: Matrix Vazia + Fim do Loop...");

  // 1. Garante Rodada 1 no Neon
  try {
    await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, arrecadacaoTotal: 0, concluida: false }
    });
    console.log("✅ Banco Neon: Rodada #1 verificada.");
  } catch (e) { console.log("Aviso: Rodada já existente."); }

  // 2. Dashboard com Matrix que Reseta
  const dashCode = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardElite() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]); // COMEÇA VAZIA
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

  const handleConfirmar = async () => {
    if (loading || matriz.length === 0) return;
    setLoading(true); // Começa a girar
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cpf: user.pixKey, prognosticos: matriz.flat() })
      });
      const data = await res.json();
      
      if(data.qrCode) {
        localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ id: data.ticketId, coords: matriz.flat(), qrCode: data.qrCode, usuario: user.nome, data: new Date().toLocaleString() }));
        
        // --- SUCESSO: LIMPA A MATRIX NA TELA ---
        setMatriz([]); 
        router.push('/bilhete/' + data.ticketId);
      } else {
        alert("Erro: " + (data.error || "Falha no servidor"));
      }
    } catch (e) {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      // --- FIM DO LOOP: PARA DE GIRAR INDEPENDENTE DE ERRO ---
      setLoading(false);
    }
  };

  if (!mounted || !user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans text-center p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <h1 className="text-xl font-black italic uppercase">MIMOSINHA<span className="text-cyan-400">G25</span></h1>
        <p className="text-xs font-bold text-yellow-500">Olá, {user.nome.split(' ')[0]}</p>
      </header>

      <main className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10">
          <div className="text-5xl md:text-8xl font-black drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{fontFamily:'Orbitron'}}>{timer}</div>
          <p className="text-cyan-400 font-bold uppercase text-[10px] mt-4">Nossa produção 100% blockchain</p>
        </div>

        <div className="bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest italic">Sua Malha Matrix 5x5</h2>
            <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-6 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-2 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[10px] font-black text-cyan-500/40 text-right pr-2">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/20 rounded-lg flex items-center justify-center text-[10px] font-black text-cyan-400">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase">Trocar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading || matriz.length === 0} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg flex justify-center items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={16}/> : "Confirmar Certificado"}
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
`;

  fs.writeFileSync('src/app/dashboard/page.tsx', dashCode, { encoding: 'utf8' });
  console.log("✅ Dashboard atualizado: Matrix resetando e Loop protegido!");
  await prisma.$disconnect();
}

executar();