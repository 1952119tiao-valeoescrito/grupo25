import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email?.trim().toLowerCase();
    const cpfLimpo = (body.pixKeyResgate || "").replace(/\D/g, '');

    // 1. BUSCA O ID DO USUÁRIO NO BANCO
    const dbUser = await prisma.user.findUnique({
      where: { email: emailLimpo }
    });

    if (!dbUser) {
      return NextResponse.json({ 
        error: "Sessão expirada ou usuário não encontrado. Por favor, faça login novamente." 
      }, { status: 404 });
    }

    // 2. CONFIGURAÇÃO MERCADO PAGO
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. GERA O PIX
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
    if (!qrCodeReal) throw new Error("Mercado Pago falhou ao gerar o Pix.");

    // 4. SALVA NO BANCO (USANDO AS RELAÇÕES DO SEU SCHEMA)
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        // GARANTE QUE A RODADA 1 EXISTE (connectOrCreate evita erro se a tabela estiver vazia)
        round: {
          connectOrCreate: {
            where: { id: 1 },
            create: { id: 1, arrecadacaoTotal: 0, concluida: false }
          }
        },
        // CONECTA AO USUÁRIO PELO ID REAL (O que o seu schema exige)
        user: {
          connect: { id: dbUser.id }
        },
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate,
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ qrCode: qrCodeReal, ticketId: ticket.id });

  } catch (e: any) {
    console.error("ERRO NO PROCESSO:", e);
    return NextResponse.json({ 
      error: "Erro ao gerar aposta: " + (e.message || "Erro interno") 
    }, { status: 500 });
  }
}