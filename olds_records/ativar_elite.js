import fs from 'fs';

const folders = ['src/app/api/auth/login', 'src/app/api/auth/register', 'src/lib'];
folders.forEach(f => { if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true }); });

const files = {
  // 1. API DE CADASTRO (LIGA O FORMULÁRIO AO NEON)
  'src/app/api/auth/register/route.ts': `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: body.password, // Em produção, use hash
        pixKey: body.pix,
        indicadoPor: body.indicado_por
      }
    });
    return NextResponse.json({ usuario_id: user.id, nome: user.nome });
  } catch (e) {
    return NextResponse.json({ error: "E-mail já cadastrado ou erro no banco" }, { status: 400 });
  }
}`,

  // 2. API DE LOGIN
  'src/app/api/auth/login/route.ts': `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || user.senha !== body.password) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 401 });
    }
    return NextResponse.json({ usuario_id: user.id, nome: user.nome, email: user.email });
  } catch (e) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}`,

  // 3. A PÁGINA INICIAL (VISUAL ELITE + FUNDO MATRIX COMPLETO)
  'src/app/page.tsx': `"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronDown } from 'lucide-react';

export default function EliteHome() {
  const router = useRouter();
  const [step, setStep] = useState('age'); 
  const [form, setForm] = useState({ nome: '', email: '', pix: '', senha: '' });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const coords = [];
    for(let x=1; x<=25; x++) for(let y=1; y<=25; y++) coords.push(x + '/' + y);
    const grid = [];
    for (let c = 0; c < Math.floor(canvas.width / 50); c++) {
      for (let r = 0; r < Math.floor(canvas.height / 35); r++) {
        grid.push({ x: c * 60, y: r * 45, text: coords[Math.floor(Math.random() * 625)], counter: Math.random() * 100 });
      }
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 9, 0.18)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '900 14px Orbitron';
      grid.forEach(cell => {
        cell.counter++;
        if (Math.random() > 0.985) cell.text = coords[Math.floor(Math.random() * 625)];
        const alpha = (Math.sin(cell.counter * 0.05) * 0.15) + 0.1;
        ctx.fillStyle = 'rgba(34, 211, 238, ' + alpha + ')';
        ctx.fillText(cell.text, cell.x, cell.y);
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, [step]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...form, password: form.senha })
    });
    const data = await res.json();
    if(data.usuario_id) {
       localStorage.setItem('usuario_id', data.usuario_id);
       localStorage.setItem('usuario_email', form.email);
       router.push('/dashboard');
    } else { alert(data.error); }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-cyan-500">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
      
      {step === 'age' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#010409]/90 backdrop-blur-xl">
          <div className="bg-slate-900 border-2 border-red-500/30 p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
             <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">18+</div>
             <button onClick={() => setStep('form')} className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">CONFIRMAR E ENTRAR</button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="flex flex-col items-center py-20 px-4">
          <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/5 py-6 px-10 flex justify-between items-center">
             <h1 className="font-black text-xl italic uppercase tracking-tighter">MIMOSINHA<span className="text-yellow-500">G25</span></h1>
             <span className="text-yellow-500 font-bold text-[10px] uppercase cursor-pointer" onClick={() => router.push('/login')}>Fazer Login</span>
          </nav>

          <div className="bg-[#0f172a]/90 border border-cyan-500/20 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl text-center mt-10">
             <h2 className="text-yellow-500 font-black text-2xl uppercase mb-2">Crie sua conta</h2>
             <p className="text-slate-500 text-[10px] mb-10 uppercase font-bold tracking-widest">Acesse a Matriz Matrix Elite</p>
             <form onSubmit={handleRegister} className="space-y-4 text-left">
                <input placeholder="Nome Completo" required className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={e=>setForm({...form, nome: e.target.value})} />
                <input placeholder="E-mail" type="email" required className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={e=>setForm({...form, email: e.target.value})} />
                <input placeholder="Chave PIX prêmio" required className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={e=>setForm({...form, pix: e.target.value})} />
                <input placeholder="Sua Senha" type="password" required className="w-full p-4 rounded-2xl bg-slate-950 border-slate-800" onChange={e=>setForm({...form, senha: e.target.value})} />
                <button type="submit" className="w-full bg-amber-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase text-xs shadow-xl mt-6 transition-all transform active:scale-95">CADASTRAR E JOGAR</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}`
};

Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(name, content.trim(), { encoding: 'utf8' });
  console.log("✅ Atualizado: " + name);
});