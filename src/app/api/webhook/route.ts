import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Captura os parâmetros enviados pelo Mercado Pago
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const dataId = searchParams.get('data.id');

    // Só processamos se for uma notificação de pagamento
    if (type !== 'payment' || !dataId) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    // 2. Configura o cliente do Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: (process.env.MP_ACCESS_TOKEN || '').trim() 
    });
    const payment = new Payment(client);

    // 3. Consulta o Mercado Pago para confirmar se o dinheiro REALMENTE caiu (Segurança)
    const mpRes = await payment.get({ id: dataId });
    
    if (mpRes.status === 'approved') {
      const bilheteId = mpRes.external_reference; // O nosso ID G25-XXXX

      // 4. ATUALIZAÇÃO NO BANCO NEON
      // Usamos uma transação para garantir consistência total
      await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.findUnique({ where: { id: bilheteId } });

        if (ticket && !ticket.pago) {
          // Marca o bilhete como pago
          await tx.ticket.update({
            where: { id: bilheteId },
            data: { 
              pago: true, 
              status_pagamento: 'PAGO_CONFIRMADO',
              mpPaymentId: String(dataId)
            }
          });

          // Incrementa a arrecadação da rodada (isso alimenta seu contrato depois)
          await tx.round.update({
            where: { id: ticket.rodadaId },
            data: { arrecadacaoTotal: { increment: 10 } }
          });
        }
      });

      console.log(`✅ Webhook: Bilhete ${bilheteId} pago e arrecadação atualizada!`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (e: any) {
    console.error("❌ Erro no Webhook:", e.message);
    // Retornamos 200 para o MP não ficar tentando reenviar o erro infinitamente
    return NextResponse.json({ error: "Webhook processado com ressalvas" }, { status: 200 });
  }
}