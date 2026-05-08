import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: "Acesso Negado" }, { status: 403 });

    // 1. Encontra a última rodada criada
    const ultimaRodada = await prisma.round.findFirst({
      orderBy: { id: 'desc' }
    });

    const proximoId = (ultimaRodada?.id || 0) + 1;

    // 2. Cria a nova rodada e garante que ela não está concluída
    const novaRodada = await prisma.round.create({
      data: {
        id: proximoId,
        arrecadacaoTotal: 0,
        concluida: false
      }
    });

    return NextResponse.json({ 
      success: true, 
      novaRodada: proximoId,
      message: `Matrix reiniciada! Rodada #${proximoId} aberta.` 
    });

  } catch (e: any) {
    console.error("Erro ao virar rodada:", e.message);
    return NextResponse.json({ error: "Erro técnico ao iniciar nova rodada" }, { status: 500 });
  }
}