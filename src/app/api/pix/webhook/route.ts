import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // O Mercado Pago envia o ID do pagamento de várias formas
    const paymentId = body.data?.id || body.id;

    if (paymentId) {
      console.log("📡 Notificação recebida: " + paymentId);
      
      // Consultamos o Mercado Pago para confirmar se é real e se está aprovado
      const p = await payment.get({ id: String(paymentId) });
      
      if (p.status === 'approved') {
        // Buscamos o bilhete pelo ID que salvamos na 'external_reference'
        await prisma.ticket.update({
          where: { id: p.external_reference },
          data: { 
            pago: true, 
            mpPaymentId: String(paymentId) 
          }
        });
        console.log("✅ Bilhete " + p.external_reference + " marcado como PAGO!");
      }
    }
    // O Mercado Pago exige resposta 200/201 para parar de enviar notificações
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("❌ Erro no Webhook:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 200 });
  }
}
