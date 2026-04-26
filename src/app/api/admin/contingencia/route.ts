import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validação de Segurança
    if (body.secret !== process.env.PRIVATE_KEY) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // 1. Criar a matriz completa 25x25 (625 combinações)
    const matrizTotal = [];
    for (let x = 1; x <= 25; x++) {
      for (let y = 1; y <= 25; y++) {
        matrizTotal.push(x + '/' + y);
      }
    }

    // 2. Shuffle Fisher-Yates (Sua lógica estratégica)
    for (let i = matrizTotal.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matrizTotal[i], matrizTotal[j]] = [matrizTotal[j], matrizTotal[i]];
    }

    // 3. Extraímos os primeiros 5 para o sorteio principal
    const resultados = matrizTotal.slice(0, 5);

    // 4. Salvar no Neon Database como Rodada Concluída
    const round = await prisma.round.update({
      where: { id: Number(body.rodadaId || 1) },
      data: {
        concluida: true,
        // Armazenamos como JSON para o site ler
        arrecadacaoTotal: Number(body.arrecadacao || 0)
      }
    });

    return NextResponse.json({ success: true, resultados });
  } catch (e) {
    return NextResponse.json({ error: "Falha na contingência" }, { status: 500 });
  }
}
