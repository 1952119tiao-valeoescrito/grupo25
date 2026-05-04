import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email?.trim().toLowerCase();
    const cpfLimpo = (body.pixKeyResgate || "").replace(/\D/g, '');

    // 1. Mercado Pago
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix G25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        payer: {
          email: emailLimpo,
          identification: { type: 'CPF', number: cpfLimpo }
        }
      }
    });

    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;
    if (!qrCodeReal) throw new Error("Mercado Pago falhou.");

    // 2. SALVAMENTO NO BANCO (COM LOG DE ERRO REAL)
    try {
      const ticket = await prisma.ticket.create({
        data: {
          id: bilheteId,
          rodadaId: 1,
          qr_code_payload: qrCodeReal,
          pix_key_resgate: body.pixKeyResgate,
          status_pagamento: 'pendente',
          pago: false,
          prognosticos: JSON.stringify(body.prognosticos || []),
          user: {
            connect: { email: emailLimpo }
          }
        }
      });
      return NextResponse.json({ qrCode: qrCodeReal, ticketId: ticket.id });

    } catch (dbError: any) {
      console.error("ERRO PRISMA:", dbError);
      // ESSA LINHA ABAIXO VAI TE MOSTRAR O ERRO REAL NO POPUP:
      return NextResponse.json({ 
        error: `Erro no Banco: ${dbError.message.split('\n').pop()}` 
      }, { status: 500 });
    }

  } catch (e: any) {
    return NextResponse.json({ error: "Erro Geral: " + e.message }, { status: 500 });
  }
}