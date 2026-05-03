import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validação inicial dos dados que vem do frontend
    if (!body.email || !body.pixKeyResgate) {
        return NextResponse.json({ error: "E-mail e CPF/Chave Pix são obrigatórios." }, { status: 400 });
    }

    const emailLimpo = body.email.trim().toLowerCase();
    // LIMPEZA TOTAL: Remove qualquer coisa que não seja número (pontos, traços, espaços)
    const cpfApenasNumeros = body.pixKeyResgate.replace(/\D/g, '');

    // SEGURANÇA: Se após a limpeza não tiver 11 dígitos, o Mercado Pago vai recusar.
    if (cpfApenasNumeros.length !== 11) {
        return NextResponse.json({ 
            error: `O CPF informado (${cpfApenasNumeros}) é inválido. Ele deve conter exatamente 11 números.` 
        }, { status: 400 });
    }

    // 2. Configuração do Token
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (!token) throw new Error("Token MP_ACCESS_TOKEN não configurado na Vercel.");

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 3. Chamada ao Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Matrix G25",
        payment_method_id: 'pix',
        external_reference: bilheteId,
        payer: {
          email: emailLimpo,
          // O MP exige Nome para PIX dinâmico, enviamos um padrão se não houver no body
          first_name: body.nome?.split(' ')[0] || "Usuario",
          last_name: body.nome?.split(' ').slice(1).join(' ') || "G25",
          identification: {
            type: 'CPF',
            number: cpfApenasNumeros // Agora garantido apenas números e 11 dígitos
          }
        }
      }
    });

    const qrCodeReal = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeReal) {
        console.error("MP Resposta sem QR Code:", JSON.stringify(mpRes));
        throw new Error("Mercado Pago não conseguiu gerar o código PIX.");
    }

    // 4. Salva no banco de dados Neon
    await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate, // Salva o original para conferência
        qr_code_payload: qrCodeReal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ qrCode: qrCodeReal, ticketId: bilheteId });

  } catch (e: any) {
    // Log detalhado para o painel da Vercel
    const mpError = e.api_response?.body;
    console.error("DETALHES DO ERRO:", JSON.stringify(mpError || e.message));
    
    // Tradução amigável dos erros mais comuns do Mercado Pago
    let mensagemAmigavel = "Erro ao processar com Mercado Pago";
    
    if (mpError?.message === "payer.identification.number is invalid") {
        mensagemAmigavel = "O CPF informado é inválido para o Mercado Pago.";
    } else if (mpError?.message === "collector and payer cannot be the same") {
        mensagemAmigavel = "Você não pode pagar um Pix para si mesmo (use outro e-mail/CPF).";
    }

    return NextResponse.json({ 
        error: mensagemAmigavel 
    }, { status: 500 });
  }
}