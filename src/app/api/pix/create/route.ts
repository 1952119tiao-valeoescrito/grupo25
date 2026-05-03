import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email?.trim().toLowerCase();
    
    // LIMPEZA TOTAL DO CPF: Remove tudo que não for número
    const cpfApenasNumeros = (body.pixKeyResgate || "").replace(/\D/g, '');

    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        payer: {
          email: emailLimpo,
          first_name: body.nome?.split(' ')[0] || "Usuario",
          last_name: body.nome?.split(' ').slice(1).join(' ') || "G25",
          identification: {
            type: 'CPF',
            number: cpfApenasNumeros // AGORA VAI SÓ NÚMEROS
          }
        }
      }
    });

    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeReal) throw new Error("Mercado Pago falhou ao gerar o código PIX.");

    await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate,
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ qrCode: qrCodeReal, ticketId: bilheteId });

  } catch (e: any) {
    console.error("ERRO MP:", e.api_response?.body || e.message);
    const msg = e.api_response?.body?.message === "payer.identification.number is invalid" 
      ? "CPF INVÁLIDO! Verifique os dados do usuário." 
      : "Erro no Mercado Pago";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}