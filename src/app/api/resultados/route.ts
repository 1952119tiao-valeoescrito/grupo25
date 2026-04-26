import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rounds = await prisma.round.findMany({
      where: { concluida: true },
      orderBy: { id: 'desc' },
      take: 10
    });

    return NextResponse.json(rounds);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}
