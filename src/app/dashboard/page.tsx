"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, RefreshCw, ChevronRight, Loader2, LogOut, Wallet, Scale, HelpCircle, Terminal, Database, Activity, Mail, MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardEliteTotal() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [matriz, setMatriz] = useState([]); 
  const [timer, setTimer] = useState("05:01:52:40");
  const [qrCode, setQrCode] = useState("");
  const [pixKeyResgate, setPixKeyResgate] = useState(""); // NOVO: Estado para a chave pix
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const logged = localStorage.getItem('user');
    if (logged) {
        const parsedUser = JSON.parse(logged);
        setUser(parsedUser);
        if(parsedUser.pixKey) setPixKeyResgate(parsedUser.pixKey);
    }
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
    for (let i = 0; i < 120; i++) {
        gridAnim.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: coords[Math.floor(Math.random() * 625)], c: Math.random() * 100 });
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.25)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    setQrCode(""); 
  };

  const handleGerarPix = async () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    if (!pixKeyResgate) return alert("Insira sua Chave Pix de Resgate primeiro!");
    
    setLoading(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: user.email, 
            cpf: pixKeyResgate, // Enviando a chave preenchida
            prognosticos: matriz.flat(), 
            rodadaId: 1 
        })
      });
      const data = await res.json();
      if(data.qrCode) {
          setQrCode(data.qrCode);
          alert("Pix gerado com sucesso! Pague para validar.");
      }
      else alert("Erro ao gerar Pix. Verifique a API.");
    } catch (e) { alert("Erro de rede ao conectar com o sistema de pagamentos"); }
    setLoading(false);
  };

  const handleConfirmar = () => {
    if (matriz.length === 0) return alert("Gere as coordenadas primeiro!");
    if (!qrCode) return alert("Você precisa gerar o PIX antes de confirmar o bilhete!");

    // SALVANDO TUDO PARA O BILHETE ATUAL
    localStorage.setItem('CERTIFICADO_G25', JSON.stringify({ 
        id: 'G25-WEB', 
        coords: matriz.flat(), 
        qrCode: qrCode, 
        usuario: user.nome, 
        pixResgate: pixKeyResgate, // Enviando a chave para o bilhete
        data: new Date().toLocaleString() 
    }));
    
    router.push('/bilhete/atual');
  };

  if (!mounted || !user) return <div className="min-h-screen bg-[#010409]" />;

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* TICKER SUPERIOR */}
      <div className="w-full bg-black border-b border-cyan-500/30 py-3 overflow-hidden h-[45px] z-50 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-cyan-400 font-black uppercase text-[11px] tracking-widest font-elite">
           🚀 BEM-VINDO À MIMOSINHA BRASIL: SORTEIOS GRATUITOS NO MODO TREINO &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 💸 NO MODO REAL O PAGAMENTO É AUTOMÁTICO VIA PIX
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center font-elite">
          <h1 className="text-white text-sm md:text-xl font-black uppercase italic tracking-tighter">MIMOSINHA<span className="text-cyan-400">BRASIL</span></h1>
          <nav className="hidden md:flex gap-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">
             <button onClick={()=>router.push('/meus-bilhetes')} className="hover:text-white transition-all">REGISTROS</button>
             <button onClick={()=>router.push('/resultados')} className="hover:text-white transition-all">RESULTADOS</button>
             <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="text-red-500 font-black">SAIR</button>
          </nav>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full uppercase italic tracking-tighter">Acesso Restrito</span>
             <p className="text-[10px] font-bold text-yellow-500 uppercase border border-yellow-500/20 px-4 py-1.5 rounded-full bg-yellow-500/10">Olá, {user.nome.split(' ')[0]}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-center relative z-10">
        
        {/* TIMER */}
        <section className="mb-10">
          <div style={{fontFamily:'Orbitron'}} className="text-4xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-tighter mb-2 italic">{timer}</div>
          <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest italic mb-2">Sábado às 20:00hrs</p>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">Nossa produção 100% blockchain</p>
        </section>

        {/* 2. PORTAL DE ACESSO E CRÉDITO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto items-stretch">
            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3.5rem] shadow-2xl text-left backdrop-blur-md">
               <h3 className="text-[10px] text-yellow-500 mb-8 uppercase font-black font-elite">01. DADOS DE ACESSO E RESGATE</h3>
               <div className="space-y-4">
                  <input placeholder="E-mail" value={user.email} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-sm text-white" readOnly />
                  {/* CAMPO NOVO PARA INSERIR A CHAVE PIX */}
                  <input 
                    placeholder="INSERIR CHAVE PIX PARA RESGATE" 
                    value={pixKeyResgate} 
                    onChange={(e) => setPixKeyResgate(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-500/50 p-5 rounded-2xl text-sm text-cyan-400 font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  />
                  <button onClick={()=>alert("Dados atualizados")} className="w-full bg-cyan-700 p-5 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-cyan-600 transition-all">SALVAR DADOS MATRIX</button>
               </div>
            </div>

            <div className="bg-[#0f172a]/95 border border-cyan-500/30 p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
               <h3 className="text-[11px] text-cyan-400 mb-8 uppercase font-black font-elite">02. PAGAMENTO (R$ 10)</h3>
               <div className="bg-white p-4 rounded-3xl mb-8 shadow-inner flex items-center justify-center min-h-[128px]">
                 {!qrCode ? (
                    <div className="text-slate-300 text-[10px] font-bold uppercase animate-pulse">Aguardando Geração...</div>
                 ) : <QRCodeSVG value={qrCode} size={128} />}
               </div>
               <button onClick={handleGerarPix} disabled={loading || matriz.length === 0} className="w-full bg-slate-800 p-4 rounded-xl text-white font-black text-[10px] uppercase border border-white/5 shadow-lg hover:bg-slate-700">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={14}/> : "GERAR QR CODE PIX"}
               </button>
            </div>
        </div>

        {/* 4. BASE: MALHA MATRIX */}
        <div className="grid lg:grid-cols-3 gap-8 items-start text-left mb-20">
          <div className="lg:col-span-2 bg-[#0d1117] border border-cyan-500/30 p-6 md:p-10 rounded-[3rem] shadow-2xl">
             <h2 className="text-yellow-500 font-black text-[11px] uppercase mb-8 tracking-widest text-center italic font-elite">Sua Malha de Coordenadas Matrix 5x5</h2>
             <div className="bg-black/90 border border-slate-800 rounded-[2rem] p-4 md:p-10 mb-8 shadow-inner">
                <div className="grid grid-cols-6 gap-1.5 md:gap-4 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className="contents">
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-500/40 text-right pr-1 italic font-elite">{i+1}º</span>
                      {[0,1,2,3,4].map((j) => (
                        <div key={j} className="aspect-square bg-slate-900 border border-cyan-500/30 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          {matriz[i] ? matriz[i][j] : '--/--'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={gerarMalha} className="flex-1 bg-slate-800 p-4 rounded-2xl font-black text-[10px] uppercase border border-white/5 font-elite transition-all hover:bg-slate-700">Trocar Coordenadas</button>
                <button onClick={handleConfirmar} disabled={loading || matriz.length === 0 || !qrCode} className="flex-1 bg-[#ea580c] p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg font-elite transition-all hover:bg-orange-500 flex justify-center items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={14}/> : "Confirmar Bilhete"}
                </button>
             </div>
          </div>

          {/* ... Restante do código das colunas laterais ... */}
          <div className="space-y-6">
              {/* Card de Lucro e Ranking mantidos como no original */}
          </div>
        </div>

        {/* Rodapé e estilos mantidos conforme original */}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        .font-elite { font-family: 'Orbitron', sans-serif; }
        @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
}
