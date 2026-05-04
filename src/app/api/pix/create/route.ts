import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // TRAVA DE SEGURANÇA: Se o e-mail não vier, nem tenta falar com o banco
    if (!body.email) {
        return NextResponse.json({ 
          error: "Sessão expirada. Por favor, saia do sistema e faça login novamente." 
        }, { status: 401 });
    }

    const emailLimpo = body.email.trim().toLowerCase();
    // ... resto do seu código
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
    const mpError = e.api_response?.body;
    console.error("ERRO MP DETALHADO:", JSON.stringify(mpError));
    
    let mensagem = "Erro ao processar com Mercado Pago";
    
    if (mpError?.message?.includes("identification.number")) {
        // ESSA LINHA É A CHAVE: Ela vai te dizer qual CPF o banco tentou usar
        mensagem = `CPF INVÁLIDO: O sistema tentou usar o CPF cadastrado, mas o Mercado Pago recusou. Verifique seus dados de perfil.`;
    }

    return NextResponse.json({ error: mensagem }, { status: 500 });
  }