import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Limpeza dos dados de entrada
    // O trim() remove espaços e o toLowerCase() ignora se é maiúscula ou minúscula
    const emailLogin = body.email?.trim().toLowerCase();
    const senhaLogin = body.senha?.trim();

    if (!emailLogin || !senhaLogin) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    // 2. Busca o usuário ignorando espaços e cases
    const user = await prisma.user.findUnique({ 
      where: { email: emailLogin } 
    });

    // 3. Verificação de segurança
    if (!user) {
      return NextResponse.json({ error: "E-mail não encontrado!" }, { status: 401 });
    }

    if (user.senha !== senhaLogin) {
      return NextResponse.json({ error: "Senha incorreta!" }, { status: 401 });
    }

    // 4. Login com sucesso
    return NextResponse.json(user);

  } catch (e: any) {
    console.error("ERRO NO LOGIN:", e);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}