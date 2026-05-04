import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email?.trim().toLowerCase();
    const cpfLimpo = (body.pixKeyResgate || "").replace(/\D/g, '');

    if (!emailLimpo || cpfLimpo.length < 11) {
      return NextResponse.json({ error: "E-mail e CPF válidos são obrigatórios." }, { status: 400 });
    }

    // 1. BUSCA O USUÁRIO NO BANCO PARA PEGAR O ID REAL
    const dbUser = await prisma.user.findUnique({
      where: { email: emailLimpo }
    });

    if (!dbUser) {
      return NextResponse.json({ 
        error: "Sessão expirada ou usuário não encontrado. Faça login novamente." 
      }, { status: 404 });
    }

    // 2. CONFIGURAÇÃO MERCADO PAGO
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (!token) throw new Error("Token MP_ACCESS_TOKEN não configurado.");

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. GERA O PIX NO MERCADO PAGO
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
    if (!qrCodeReal) throw new Error("Mercado Pago não retornou o código PIX.");

    // 4. SALVA NO BANCO (USANDO AS RELAÇÕES DO SEU SCHEMA)
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        round: {
          connectOrCreate: {
            where: { id: 1 },
            create: { id: 1, arrecadacaoTotal: 0, concluida: false }
          }
        },
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
    console.error("ERRO COMPLETO:", e);
    
    // Tratamento amigável de erros (Especialmente para o erro do celular)
    const mpError = e.api_response?.body;
    let mensagem = "Erro ao processar aposta (Banco ou Mercado Pago)";

    if (mpError?.message?.includes("identification.number")) {
      mensagem = "CPF INVÁLIDO: O Mercado Pago recusou o documento cadastrado.";
    } else if (e.code === 'P2025') {
      mensagem = "Usuário não encontrado no banco de dados.";
    } else if (e.message) {
      mensagem = e.message;
    }

    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}