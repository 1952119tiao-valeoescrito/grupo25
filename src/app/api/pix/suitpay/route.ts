import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // --- 1. PREPARAÇÃO DOS DADOS (Comum para os dois gateways) ---
    const emailLimpo = body.email?.trim().toLowerCase();
    const cpfLimpo = (body.pixKeyResgate || "").replace(/\D/g, '');
    const valorAposta = 10.00;

    if (!emailLimpo || cpfLimpo.length !== 11) {
      return NextResponse.json({ error: "E-mail ou CPF inválidos." }, { status: 400 });
    }

    // Busca o usuário para garantir que ele existe e pegar o ID real
    const dbUser = await prisma.user.findUnique({ where: { email: emailLimpo } });
    if (!dbUser) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

    const bilheteId = `G25-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    let qrCodeFinal = "";

    // --- 2. O CONTROLADOR DE TRÁFEGO ---
    // Ele lê a variável da Vercel. Se não existir, o padrão é Mercado Pago.
    const gateway = process.env.GATEWAY_ATIVO || 'mercadopago';

    if (gateway === 'suitpay') {
      // 🟢 ROTA SUITPAY (Focada em iGaming)
      const res = await fetch('https://api.suitpay.app/v1/gateway/pix', {
        method: 'POST',
        headers: {
          'ci': (process.env.SUIT_CLIENT_ID || '').trim(),
          'cs': (process.env.SUIT_CLIENT_SECRET || '').trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestNumber: bilheteId,
          dueDate: "2026-12-31",
          amount: valorAposta,
          client: {
            name: dbUser.nome,
            document: cpfLimpo,
            email: emailLimpo
          }
        })
      });

      const data = await res.json();
      if (data.response === 'OK') {
        qrCodeFinal = data.pixCode; // Linha Copia e Cola da SuitPay
      } else {
        throw new Error("Erro na SuitPay: " + (data.message || "Falha na comunicação"));
      }

    } else {
      // 🔵 ROTA MERCADO PAGO (Padrão)
      const token = (process.env.MP_ACCESS_TOKEN || '').trim();
      const client = new MercadoPagoConfig({ accessToken: token });
      const payment = new Payment(client);

      const mpRes = await payment.create({
        body: {
          transaction_amount: valorAposta,
          description: "Aposta Matrix G25",
          payment_method_id: 'pix',
          external_reference: bilheteId,
          payer: {
            email: emailLimpo,
            identification: { type: 'CPF', number: cpfLimpo }
          }
        }
      });

      qrCodeFinal = mpRes.point_of_interaction?.transaction_data?.qr_code || "";
    }

    // Se nenhum dos dois gerou o código, explode erro
    if (!qrCodeFinal) throw new Error("O Gateway de pagamento não devolveu o QR Code.");

    // --- 3. SALVAMENTO NO NEON (Comum para qualquer banco escolhido) ---
    const ticket = await prisma.ticket.create({
      data: {
        id: bilheteId,
        round: { connectOrCreate: { where: { id: 1 }, create: { id: 1 } } },
        user: { connect: { id: dbUser.id } },
        usuarioEmail: emailLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
        pix_key_resgate: body.pixKeyResgate,
        qr_code_payload: qrCodeFinal,
        status_pagamento: 'pendente',
        pago: false
      }
    });

    return NextResponse.json({ 
      qrCode: qrCodeFinal, 
      ticketId: ticket.id,
      gatewayUsado: gateway 
    });

  } catch (e: any) {
    console.error("ERRO NO CONTROLADOR DE PIX:", e.message);
    return NextResponse.json({ error: e.message || "Erro interno" }, { status: 500 });
  }
}