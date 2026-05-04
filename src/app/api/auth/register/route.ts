import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Limpeza e Padronização dos dados antes de salvar no banco
    const emailLimpo = body.email?.trim().toLowerCase();
    const pixLimpo = body.pix?.replace(/\D/g, ''); // Garante que o CPF/Pix vá só números
    const nomeLimpo = body.nome?.trim();
    const senhaLimpa = body.senha?.trim();

    if (!emailLimpo || !senhaLimpa || !nomeLimpo) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 2. Tenta criar o usuário
   const user = await prisma.user.create({
      data: { 
        nome: nomeLimpo, 
        email: emailLimpo, 
        senha: senhaLimpa, 
        pixKey: pixLimpo 
      }
    });

    // 3. RETORNO COMPLETO: Agora enviamos os dados para o navegador salvar
    return NextResponse.json({ 
        id: user.id,
        nome: user.nome,
        email: user.email,
        pixKey: user.pixKey
    });

  } catch (e: any) {
    // ... catch igual ...
    console.error("ERRO NO REGISTRO:", e);
    
    // Verifica se o erro é de e-mail duplicado (P2002 é o código do Prisma para Unique Constraint)
    if (e.code === 'P2002') {
      return NextResponse.json({ error: "Este e-mail já está cadastrado!" }, { status: 400 });
    }

    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}