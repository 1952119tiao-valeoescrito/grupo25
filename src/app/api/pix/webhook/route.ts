import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paymentId = body.data?.id || body.id;

    if (paymentId) {
      console.log("📡 Processando Webhook: " + paymentId);
      
      const p = await payment.get({ id: String(paymentId) });
      
      if (p.status === 'approved') {
        const ticketId = p.external_reference;

        if (ticketId) {
          await prisma.ticket.update({
            where: { id: ticketId },
            data: { 
              pago: true, 
              status_pagamento: 'pago',
              mpPaymentId: String(paymentId) 
            }
          });
          console.log(`✅ Bilhete ${ticketId} atualizado para PAGO.`);
        }
      }
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("❌ Erro no Webhook:", e.message);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}