import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Limpeza e Identificação
    const emailLimpo = body.email.trim().toLowerCase();
    const cpfLimpo = body.cpf ? body.cpf.replace(/[^0-9]/g, '') : '00000000000';
    
    // Captura a chave de resgate que vem do novo input do Dashboard
    // Se não vier no body, tenta pegar a do cadastro do usuário
    const chaveParaResgate = body.pixKeyResgate || body.cpf || "N/A";

    // 2. Configuração do Mercado Pago
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    // 3. Buscar usuário para garantir o vínculo
    const user = await prisma.user.findUnique({ where: { email: emailLimpo } });
    if (!user) {
       return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    // 4. Gerar um ID amigável para o Bilhete antes de tudo
    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

    // 5. Chamada ao Mercado Pago (Agora enviando o ID que geramos)
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10.00,
        description: "Aposta Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: bilheteId, // Conecta com o Webhook
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/webhook', // Ajustado para sua rota de webhook
        payer: {
          email: emailLimpo,
          identification: { 
            type: 'CPF', 
            number: cpfLimpo.length === 11 ? cpfLimpo : '00000000000' 
          }
        }
      }
    });

    const qrCodeGerado = mpRes.point_of_interaction?.transaction_data?.qr_code;

    if (!qrCodeGerado) {
       throw new Error("Mercado Pago não retornou o QR Code.");
    }

    // 6. Criar o Ticket no Neon já com o QR Code e a Chave de Resgate
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        rodadaId: 1,
        userId: user.id,
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pago: false,
        // CAMPOS NOVOS QUE ADICIONAMOS NO SQL:
        pix_key_resgate: chaveParaResgate,
        qr_code_payload: qrCodeGerado,
        status_pagamento: 'pendente'
      }
    });

    // 7. Retorna o QR Code para o Frontend exibir
    return NextResponse.json({ 
      qrCode: qrCodeGerado, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("FALHA CRÍTICA PIX:", e);
    const errorMsg = e.api_response?.body?.message || e.message || "Erro desconhecido";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}