import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email.trim().toLowerCase();
    
    // 1. Configuração do Mercado Pago com seu Token real
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    // 2. Gerar ID Único para o Bilhete
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. Chamada REAL ao Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: bilheteId, // Conecta com o Webhook para validar o pagamento
        notification_url: (process.env.NEXT_PUBLIC_URL || '') + '/api/webhook',
        payer: {
          email: emailLimpo,
        }
      }
    });

    // 4. Captura o código "Copia e Cola" real (o mesmo que você me enviou)
    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeReal) {
       throw new Error("Mercado Pago não gerou o payload do PIX.");
    }

    // 5. Salva no banco de dados Neon com o código real
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        // Salvando a Chave Pix que o usuário quer receber o prêmio
        pix_key_resgate: body.pixKeyResgate || "N/A",
        // Salvando o código real do pagamento para o usuário ver
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    // 6. Retorna para o Frontend exibir no QR Code
    return NextResponse.json({ 
      qrCode: qrCodeReal, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO AO GERAR PIX REAL:", e);
    return NextResponse.json({ 
        error: e.api_response?.body?.message || "Erro no Mercado Pago" 
    }, { status: 500 });
  }
}