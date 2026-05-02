import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Pegando os dados que vem do frontend
    const emailLimpo = body.email?.trim().toLowerCase();
    const pixKeyResgate = body.pixKeyResgate || body.cpf || "N/A"; // Aceita os dois nomes por segurança
    const nomeUsuario = body.nome || "Usuario G25";

    // 1. Configuração do Mercado Pago
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (!token) throw new Error("Token do Mercado Pago não configurado nas variáveis de ambiente.");
    
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    // 2. Gerar ID Único para o Bilhete
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. Chamada ao Mercado Pago (COM PAYER COMPLETO)
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        // Se a URL não existir, não enviamos a notification_url para não dar erro
        ...(process.env.NEXT_PUBLIC_URL && {
           notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`
        }),
        payer: {
          email: emailLimpo,
          first_name: nomeUsuario.split(' ')[0],
          last_name: nomeUsuario.split(' ').slice(1).join(' ') || 'Silva',
          identification: {
            type: 'CPF',
            number: pixKeyResgate.replace(/\D/g, '') // Remove pontos e traços do CPF
          }
        }
      }
    });

    // 4. Captura o código "Copia e Cola"
    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeReal) {
       console.error("Resposta Completa MP:", JSON.stringify(mpRes));
       throw new Error("Mercado Pago não devolveu o código PIX.");
    }

    // 5. Salva no banco de dados Neon
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: pixKeyResgate,
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ 
      qrCode: qrCodeReal, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO DETALHADO NO PIX:", e);
    
    // Pega a mensagem de erro real do Mercado Pago se existir
    const msgErro = e.api_response?.body?.message || e.message || "Erro desconhecido";
    
    return NextResponse.json({ 
        error: msgErro 
    }, { status: 500 });
  }
}