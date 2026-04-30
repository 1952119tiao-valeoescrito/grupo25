import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // O ID pode vir em body.data.id (notificação de pagamento) 
    const paymentId = body.data?.id || body.id;

    if (paymentId && (body.type === 'payment' || body.action === 'payment.created' || !body.type)) {
      console.log("📡 Processando pagamento: " + paymentId);
      
      const p = await payment.get({ id: String(paymentId) });
      
      if (p.status === 'approved') {
        const ticketId = p.external_reference;

        if (ticketId) {
          // ATUALIZAÇÃO ALINHADA COM O NOVO BANCO DE DADOS
          await prisma.ticket.update({
            where: { id: ticketId },
            data: { 
              pago: true,                        // Coluna antiga (boolean)
              status_pagamento: 'pago',          // Nova coluna (string)
              mpPaymentId: String(paymentId)     // Referência do MP
            }
          });
          console.log(`✅ SUCESSO: Bilhete ${ticketId} autenticado!`);
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("❌ Erro no Webhook:", e.message);
    // Retornamos 200 mesmo no erro para o Mercado Pago não ficar tentando reenviar
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
```