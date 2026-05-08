import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ultimaRodada = await prisma.round.findFirst({
      where: { concluida: true },
      orderBy: { id: 'desc' }
    });

    if (!ultimaRodada) {
      return NextResponse.json({ message: "Nenhum sorteio realizado ainda." }, { status: 404 });
    }

    return NextResponse.json(ultimaRodada);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}