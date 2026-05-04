import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "E-mail não informado" }, { status: 400 });
    }

    // Busca todos os bilhetes do usuário no Neon
    const tickets = await prisma.ticket.findMany({
      where: { usuarioEmail: email.toLowerCase() },
      orderBy: { id: 'desc' } // Os mais recentes primeiro
    });

    return NextResponse.json(tickets);
  } catch (e) {
    console.error("Erro ao buscar apostas:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}