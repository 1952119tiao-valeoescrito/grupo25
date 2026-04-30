import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email.trim().toLowerCase();
    
    // Configuração Mercado Pago
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    // 1. Gerar ID do Bilhete
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 2. Chamada ao Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        notification_url: (process.env.NEXT_PUBLIC_URL || '') + '/api/pix/webhook',
        payer: { email: emailLimpo }
      }
    });

    const qrCodeGerado = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeGerado) throw new Error("Erro ao gerar QR Code no MP");

    // 3. Salvar no Neon (Usando os nomes exatos das suas colunas)
    // Nota: Usamos (prisma.ticket as any) caso o seu Prisma local ainda não tenha sido atualizado
    const ticket = await (prisma.ticket as any).create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate || "N/A", // Salva a chave digitada
        qr_code_payload: qrCodeGerado,               // Salva o código do Pix
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ 
      qrCode: qrCodeGerado, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO API PIX:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}