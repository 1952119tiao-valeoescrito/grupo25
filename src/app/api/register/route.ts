import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const emailLimpo = body.email?.trim().toLowerCase();
    const pixLimpo = body.pix?.replace(/\D/g, ''); 

    // Tenta criar o usuário incluindo o ID de quem indicou
    const user = await prisma.user.create({
      data: { 
        nome: body.nome?.trim(), 
        email: emailLimpo, 
        senha: body.senha?.trim(), 
        pixKey: pixLimpo,
        indicadoPor: body.indicadoPor || null // 🚀 GRAVA O AFILIADO AQUI
      }
    });

    return NextResponse.json(user);

  } catch (e: any) {
    console.error("ERRO NO REGISTRO:", e);
    if (e.code === 'P2002') return NextResponse.json({ error: "E-mail já cadastrado!" }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}