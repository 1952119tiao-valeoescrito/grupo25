import fs from 'fs';
import { execSync } from 'child_process';

console.log("🚀 Iniciando a ativação do motor funcional Bet-Grupo25...");

// 1. ATUALIZAR O SCHEMA DO BANCO (Tabela de Usuários + Tickets)
const schema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

model User {
  id        String   @id @default(cuid())
  nome      String
  email     String   @unique
  senha     String
  pixKey    String
  tickets   Ticket[]
}

model Round {
  id               Int      @id
  arrecadacaoTotal Int      @default(0)
  concluida        Boolean  @default(false)
  tickets          Ticket[]
}

model Ticket {
  id               String   @id @default(cuid())
  rodadaId         Int      @default(1)
  round            Round    @relation(fields: [rodadaId], references: [id])
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  usuarioEmail     String
  prognosticos     String   
  pago             Boolean  @default(false)
  mpPaymentId      String?  @unique
}`;

fs.writeFileSync('prisma/schema.prisma', schema);

// 2. CRIAR AS ROTAS DE API (CADASTRO E LOGIN)
const apiFolders = ['src/app/api/auth/register', 'src/app/api/auth/login', 'src/lib'];
apiFolders.forEach(f => fs.mkdirSync(f, { recursive: true }));

// API: REGISTER
fs.writeFileSync('src/app/api/auth/register/route.ts', `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: { nome: body.nome, email: body.email, senha: body.senha, pixKey: body.pix }
    });
    return NextResponse.json(user);
  } catch (e) { return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 400 }); }
}`);

// API: LOGIN
fs.writeFileSync('src/app/api/auth/login/route.ts', `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || user.senha !== body.senha) return NextResponse.json({ error: "Inválido" }, { status: 401 });
    return NextResponse.json(user);
  } catch (e) { return NextResponse.json({ error: "Erro" }, { status: 500 }); }
}`);

// 3. PÁGINA INICIAL: AGE GATE -> SPLASH -> FORM (IDÊNTICO AOS PRINTS)
const indexPage = `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const [step, setStep] = useState('age'); 
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (step !== 'splash') {
      const canvas = canvasRef.current; if(!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const coords = []; for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
      const grid = []; for (let i=0; i<100; i++) grid.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: coords[Math.floor(Math.random()*625)], c: 0 });
      const draw = () => {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = '900 12px Orbitron'; ctx.fillStyle = '#22d3ee22';
        grid.forEach(s => { ctx.fillText(s.text, s.x, s.y); if(Math.random()>0.95) s.text = coords[Math.floor(Math.random()*625)]; });
        requestAnimationFrame(draw);
      }; draw();
    }
  }, [step]);

  const handleStart = () => {
    setStep('splash');
    let p = 0;
    const inv = setInterval(() => { p += 2; setProgress(p); if(p >= 100){ clearInterval(inv); setStep('form'); } }, 100);
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
    const data = await res.json();
    if(data.id) { localStorage.setItem('user', JSON.stringify(data)); router.push('/dashboard'); }
    else alert("Erro no cadastro");
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {step === 'age' && (
        <div className="relative z-10 flex h-screen items-center justify-center">
          <div className="bg-slate-900 border-2 border-red-500 p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">18+</div>
            <button onClick={handleStart} className="w-full bg-green-600 p-4 rounded-xl font-bold uppercase">ENTRAR NO SISTEMA</button>
          </div>
        </div>
      )}

      {step === 'splash' && (
        <div className="relative z-20 h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
          <img src="/mimosinha-logo.png" className="max-w-md animate-pulse mb-8" />
          <h4 className="text-yellow-500 font-black uppercase text-2xl italic">ACERTE 1 PONTO E JÁ GANHA PIX!</h4>
          <div className="w-64 h-1 bg-slate-800 mt-10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 transition-all duration-300" style={{width: progress+'%'}} /></div>
        </div>
      )}

      {step === 'form' && (
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          <div className="bg-slate-900/80 border border-cyan-500/20 p-10 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
            <h2 className="text-yellow-500 font-black text-2xl uppercase mb-10">Crie sua Conta</h2>
            <form onSubmit={submitRegister} className="space-y-4">
              <input required placeholder="Nome" className="w-full p-4 rounded-xl bg-slate-950" onChange={e=>setForm({...form, nome: e.target.value})} />
              <input required placeholder="E-mail" className="w-full p-4 rounded-xl bg-slate-950" onChange={e=>setForm({...form, email: e.target.value})} />
              <input required placeholder="PIX" className="w-full p-4 rounded-xl bg-slate-950" onChange={e=>setForm({...form, pix: e.target.value})} />
              <input required type="password" placeholder="Senha" className="w-full p-4 rounded-xl bg-slate-950" onChange={e=>setForm({...form, senha: e.target.value})} />
              <button type="submit" className="w-full bg-amber-500 p-5 rounded-2xl font-black text-black uppercase shadow-xl mt-4">CADASTRAR E JOGAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`;
fs.writeFileSync('src/app/page.tsx', indexPage);

console.log("✅ Motor injetado! Sincronizando banco Neon...");
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log("\n🚀 TUDO PRONTO! Agora rode o deploy.");
} catch(e) { console.log("Erro no DB Push. Verifique seu link do Neon no .env"); }