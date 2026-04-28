import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
    const payment = new Payment(client);

    // 1. Limpeza de dados
    const emailLimpo = body.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailLimpo } });
    if (!user) return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });

    const cpfLimpo = user.pixKey ? user.pixKey.replace(/[^0-9]/g, '') : '00000000000';
    
    // 2. Criar Ticket no Banco
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: user.email,
        chavePixPremio: user.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos || []),
      }
    });

    // 3. Chamar Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: 'https://www.bet-grupo25.com.br/api/pix/webhook',
        payer: {
          email: user.email,
          identification: { type: 'CPF', number: cpfLimpo.length === 11 ? cpfLimpo : '00000000000' }
        }
      }
    });

    return NextResponse.json({ qrCode: mpRes.point_of_interaction?.qr_code, ticketId: ticket.id });

  } catch (e: any) {
    console.error("ERRO MP:", e);
    const msg = e.api_response?.body?.message || e.message || "Erro no Mercado Pago";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
