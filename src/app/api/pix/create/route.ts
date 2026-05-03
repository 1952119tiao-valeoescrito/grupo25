import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validação básica de entrada
    if (!body.email || !body.pixKeyResgate) {
        return NextResponse.json({ error: "E-mail e CPF são obrigatórios." }, { status: 400 });
    }

    const emailLimpo = body.email.trim().toLowerCase();
    const cpfApenasNumeros = body.pixKeyResgate.replace(/\D/g, '');

    // 2. Configuração do Token (Verifique se isso está na Vercel!)
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (!token) throw new Error("Token MP_ACCESS_TOKEN não encontrado nas variáveis de ambiente.");

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. Chamada Simplificada (Removendo notification_url para testar)
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix G25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        // Removemos a notification_url temporariamente para garantir o sucesso do Pix
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

    if (!qrCodeReal) {
        console.error("MP Response Error:", mpRes);
        throw new Error("Mercado Pago não retornou o código PIX.");
    }

    // 4. Salva no banco
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
    // Log detalhado para você ver no painel da Vercel
    console.error("ERRO COMPLETO MP:", JSON.stringify(e.api_response?.body || e.message));
    
    return NextResponse.json({ 
        error: e.api_response?.body?.message || "Erro de comunicação com o Mercado Pago" 
    }, { status: 500 });
  }
}