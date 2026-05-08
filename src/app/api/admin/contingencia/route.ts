import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secretAdmin = (process.env.ADMIN_SECRET || '').trim();
    if (!body.secret || body.secret !== secretAdmin) {
      return NextResponse.json({ error: "Acesso Negado" }, { status: 403 });
}

    // 1. GERA 5 MILHARES ALEATÓRIOS (Simulando o Oráculo VRF)
    const milharesSorteados = [];
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 10000);
      milharesSorteados.push(num.toString().padStart(4, '0'));
    }
    const stringMilhares = milharesSorteados.join(',');

    // 2. BUSCA BILHETES PARA AUDITORIA
    const tickets = await prisma.ticket.findMany({ where: { rodadaId: 1, pago: true } });
    
    // Função interna para converter milhar em ponto x/y para comparar
    const getPoint = (m: string) => {
       let d1 = parseInt(m.slice(0,2)); let d2 = parseInt(m.slice(2,4));
       const v1 = d1 === 0 ? 100 : d1; const v2 = d2 === 0 ? 100 : d2;
       return `${Math.floor((v1-1)/4)+1}/${Math.floor((v2-1)/4)+1}`;
    };
    const winProgs = milharesSorteados.map(m => getPoint(m));

    // 3. AUDITORIA AUTOMÁTICA
    for (const t of tickets) {
      const progs = JSON.parse(t.prognosticos);
      let pts = 0;
      for (let i=0; i<5; i++) {
        const linha = progs.slice(i*5, (i+1)*5);
        if (linha.includes(winProgs[i])) pts++;
      }
      await prisma.ticket.update({
        where: { id: t.id },
        data: { pontos: pts, status_pagamento: pts > 0 ? `GANHADOR_${pts}_PONTOS` : 'NAO_PREMIADO' }
      });
    }

    // 4. GRAVA O RESULTADO OFICIAL NO ROUND
    await prisma.round.update({
      where: { id: 1 },
      data: { concluida: true, resultados: stringMilhares }
    });

    return NextResponse.json({ success: true, resultados: stringMilhares });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}