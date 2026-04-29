import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const round = await prisma.round.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        arrecadacaoTotal: 0,
        concluida: false
      },
    });
    return NextResponse.json({ success: true, message: "Rodada #1 ativada com sucesso pelo servidor!" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
