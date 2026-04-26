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
}