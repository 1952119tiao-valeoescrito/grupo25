import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Algoritmo Fisher-Yates (Gerador de Sorteio Imparcial)
function realizarSorteio(quantidade: number) {
  const matrizTotal: string[] = [];
  for (let x = 1; x <= 25; x++) {
    for (let y = 1; y <= 25; y++) matrizTotal.push(`${x}/${y}`);
  }
  for (let i = matrizTotal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matrizTotal[i], matrizTotal[j]] = [matrizTotal[j], matrizTotal[i]];
  }
  return matrizTotal.slice(0, quantidade);
}

// 2. LÓGICA DE CONFERÊNCIA (O CÉREBRO)
function calcularPontuacao(prognosticosBilhete: string[], resultadosSorteio: string[]) {
  let pontos = 0;
  
  // Dividimos os 25 números do bilhete em 5 linhas de 5
  for (let i = 0; i < 5; i++) {
    const linha = prognosticosBilhete.slice(i * 5, (i + 1) * 5);
    const resultadoDaLinha = resultadosSorteio[i]; // 1º prêmio olha pra 1ª linha, etc.

    // Se o resultado sorteado para este prêmio estiver na linha correspondente, marca ponto!
    if (linha.includes(resultadoDaLinha)) {
      pontos++;
    }
  }
  return pontos;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação de Segurança
    const secretAdmin = (process.env.ADMIN_SECRET || '').trim();
    if (!body.secret || body.secret !== secretAdmin) {
      return NextResponse.json({ error: "Acesso Negado" }, { status: 403 });
    }

    // A) Executa o Sorteio (Geramos 5 prognósticos vencedores)
    const winCoords = realizarSorteio(5);
    const semente = "CONTINGENCIA_" + Date.now();

    // B) Busca todos os bilhetes PAGOS da rodada atual
    const tickets = await prisma.ticket.findMany({
      where: { rodadaId: 1, pago: true }
    });

    const resumoGanhadores = { faixa5: 0, faixa4: 0, faixa3: 0, faixa2: 0, faixa1: 0 };
    const ticketsProcessados = [];

    // C) Loop de Auditoria Automática
    for (const t of tickets) {
      const prognosticos = JSON.parse(t.prognosticos); // Array de 25 strings
      const totalPontos = calcularPontuacao(prognosticos, winCoords);

      if (totalPontos > 0) {
        resumoGanhadores[`faixa${totalPontos}` as keyof typeof resumoGanhadores]++;
      }

      // Atualiza o bilhete no banco com a pontuação e status
      const updated = await prisma.ticket.update({
        where: { id: t.id },
        data: {
          status_pagamento: totalPontos > 0 ? `GANHADOR_${totalPontos}_PONTOS` : 'NAO_PREMIADO'
        }
      });
      ticketsProcessados.push({ id: t.id, pontos: totalPontos });
    }

    // D) Finaliza a Rodada no Banco
    await prisma.round.update({
      where: { id: 1 },
      data: { concluida: true }
    });

    return NextResponse.json({
      success: true,
      message: "Sorteio e Auditoria concluídos!",
      resultados: winCoords,
      resumo: resumoGanhadores,
      totalBilhetesAuditados: tickets.length
    });

  } catch (e: any) {
    console.error("ERRO NO SORTEIO:", e.message);
    return NextResponse.json({ error: "Falha na execução: " + e.message }, { status: 500 });
  }
}