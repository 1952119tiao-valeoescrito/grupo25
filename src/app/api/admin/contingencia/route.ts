import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secretAdmin = (process.env.ADMIN_SECRET || '').trim();
    
    // 1. Validação de Segurança
    if (!body.secret || body.secret !== secretAdmin) {
      return NextResponse.json({ error: "Acesso Negado: Chave Incorreta" }, { status: 403 });
    }

    // 2. GERA 5 MILHARES ALEATÓRIOS (Simulando o Oráculo VRF)
    const milharesSorteados = [];
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 10000);
      milharesSorteados.push(num.toString().padStart(4, '0'));
    }
    const stringMilhares = milharesSorteados.join(',');

    // 3. BUSCA BILHETES PAGOS PARA AUDITORIA
    const tickets = await prisma.ticket.findMany({ 
      where: { rodadaId: 1, pago: true } 
    });

    // Função interna para converter milhar em ponto x/y
    const getPoint = (m: string) => {
       let d1 = parseInt(m.slice(0,2)); let d2 = parseInt(m.slice(2,4));
       const v1 = d1 === 0 ? 100 : d1; const v2 = d2 === 0 ? 100 : d2;
       return `${Math.floor((v1-1)/4)+1}/${Math.floor((v2-1)/4)+1}`;
    };
    const winProgs = milharesSorteados.map(m => getPoint(m));

    // Variáveis para o relatório final
    const resumo = { faixa5: 0, faixa4: 0, faixa3: 0, faixa2: 0, faixa1: 0 };

    // 4. LOOP DE AUDITORIA AUTOMÁTICA
    for (const t of tickets) {
      const progs = JSON.parse(t.prognosticos); // Transforma a string do banco em array
      let pts = 0;

      // Confere cada linha (Horizontalidade)
      for (let i=0; i<5; i++) {
        const linha = progs.slice(i*5, (i+1)*5);
        if (linha.includes(winProgs[i])) pts++;
      }

      // Conta o ganhador para o relatório
      if (pts > 0) {
        resumo[`faixa${pts}` as keyof typeof resumo]++;
      }

      // Atualiza o bilhete individualmente
      await prisma.ticket.update({
        where: { id: t.id },
        data: { 
          pontos: pts, 
          status_pagamento: pts > 0 ? `GANHADOR_${pts}_PONTOS` : 'NAO_PREMIADO' 
        }
      });
    }

    // 5. GRAVA O RESULTADO OFICIAL E ENCERRA A RODADA
    await prisma.round.update({
      where: { id: 1 },
      data: { concluida: true, resultados: stringMilhares }
    });

    // 6. RETORNA O RELATÓRIO COMPLETO PARA O PAINEL ADMIN
    return NextResponse.json({ 
      success: true, 
      resultados: winProgs, // Manda os pontos x/y para o painel mostrar
      resumo: resumo, 
      totalBilhetesAuditados: tickets.length 
    });

  } catch (e: any) {
    console.error("ERRO NO SORTEIO:", e.message);
    return NextResponse.json({ error: "Falha técnica: " + e.message }, { status: 500 });
  }
}