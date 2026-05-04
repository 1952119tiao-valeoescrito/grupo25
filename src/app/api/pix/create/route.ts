import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.email || !body.pixKeyResgate) {
        return NextResponse.json({ error: "E-mail e CPF são obrigatórios." }, { status: 400 });
    }

    const emailLimpo = body.email.trim().toLowerCase();
    const cpfApenasNumeros = body.pixKeyResgate.replace(/\D/g, '');

    // 1. Configuração do Mercado Pago
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (!token) throw new Error("Token MP_ACCESS_TOKEN não encontrado.");

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 2. Chamada ao Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix G25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        payer: {
          email: emailLimpo,
          identification: {
            type: 'CPF',
            number: cpfApenasNumeros
          }
        }
      }
    });

    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeReal) throw new Error("Mercado Pago não retornou o código PIX.");

    // 3. Salva no banco de dados Neon (CORREÇÃO CRÍTICA AQUI)
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        // EM VEZ DE usuarioEmail, USAMOS A RELAÇÃO 'user'
        user: {
          connect: { email: emailLimpo }
        },
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate,
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    // 4. Retorna para o Frontend
    return NextResponse.json({ 
      qrCode: qrCodeReal, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO COMPLETO:", e);
    
    // Se o erro for que o usuário não existe no banco
    if (e.code === 'P2025') {
        return NextResponse.json({ error: "Erro: Usuário não encontrado no banco de dados." }, { status: 404 });
    }

    return NextResponse.json({ 
        error: e.api_response?.body?.message || "Erro ao processar com Mercado Pago ou Banco" 
    }, { status: 500 });
  }
}