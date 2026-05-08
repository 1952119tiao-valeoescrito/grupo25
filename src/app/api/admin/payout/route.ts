import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { ticketId, secret } = await req.json();
    if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: "Acesso Negado" }, { status: 403 });

    // Marca o bilhete como prêmio enviado
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status_pagamento: 'PREMIO_PAGO_SINC' }
    });

    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Erro ao processar payout" }, { status: 500 }); }
}